class API {
    constructor(baseUrl = 'http://localhost:8000') {
        this.baseUrl = baseUrl;
    }
    
    setBaseUrl(url) {
        this.baseUrl = url;
        console.log(`API base URL updated to: ${this.baseUrl}`);
    }
    
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }
    
    async askQuestion(query, conversationId = null) {
        try {
            const payload = { query };
            if (conversationId) {
                payload.conversation_id = conversationId;
            }
            
            const response = await fetch(`${this.baseUrl}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error asking question:', error);
            throw error;
        }
    }
    
    async streamQuestion(query, conversationId = null) {
        try {
            const payload = { query };
            if (conversationId) {
                payload.conversation_id = conversationId;
            }
            
            // Make a request to the streaming endpoint
            const response = await fetch(`${this.baseUrl}/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            // Get the conversation ID from headers
            const newConversationId = response.headers.get('X-Conversation-ID');
            
            // Return the response and ID
            return {
                stream: response.body,
                conversationId: newConversationId || conversationId
            };
        } catch (error) {
            console.error('Error streaming question:', error);
            throw error;
        }
    }
}

// Global API instance
const api = new API();