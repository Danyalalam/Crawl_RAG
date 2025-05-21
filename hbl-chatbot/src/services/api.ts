import axios from 'axios';

// Configure base URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to send message (non-streaming)
export const sendMessage = async (query: string, conversationId?: string): Promise<string> => {
  try {
    const payload = { query };
    if (conversationId) {
      Object.assign(payload, { conversation_id: conversationId });
    }
    
    const response = await api.post('/ask', payload);
    
    if (response.status !== 200) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return response.data.response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Update your streamMessage function

export const streamMessage = async (
  query: string, 
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
  conversationId?: string
): Promise<void> => {
  try {
    const payload = { query };
    if (conversationId) {
      Object.assign(payload, { conversation_id: conversationId });
    }
    
    const response = await fetch(`${API_URL}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is not readable');
    
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const messages = chunk.split('\n\n').filter(msg => msg.trim());
      
      for (const message of messages) {
        if (!message.startsWith('data: ')) continue;
        
        try {
          const data = JSON.parse(message.substring(6));
          
          if (data.error) {
            console.error("Stream error:", data.error);
            continue;
          }
          
          if (data.status === 'done') {
            console.log("Stream completed");
            continue;
          }
          
          if (data.text) {
            onChunk(data.text);
          }
        } catch (e) {
          console.error('Error parsing SSE message:', e, message);
        }
      }
    }
  } catch (error) {
    console.error('Error streaming message:', error);
    throw error;
  }
};

// Health check function
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};