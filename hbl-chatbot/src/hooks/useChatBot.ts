import { useState, useCallback} from 'react';
import type{ Message, ChatState } from '../types';
import { sendMessage, streamMessage } from '../services/api';

const initialState: ChatState = {
  messages: [
    {
      id: '0',
      role: 'system',
      content: 'Hi there! 👋 I\'m your HBL MicroFinance Bank virtual assistant. How can I help you today?',
      timestamp: new Date()
    }
  ],
  isOpen: false,
  isLoading: false,
  error: null
};

export const useChatBot = (useStreaming = true) => {
  const [state, setState] = useState<ChatState>(initialState);
  
  // Toggle chat panel
  const toggleChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);
  
  // Close chat panel
  const closeChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);
  
  // Add a user message
  const addUserMessage = useCallback((content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      isLoading: true,
      error: null
    }));
    
    return message;
  }, []);
  
  // Add an assistant message
  const addAssistantMessage = useCallback((content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      isLoading: false
    }));
    
    return message;
  }, []);
  
  // Set error state
  const setError = useCallback((errorMessage: string) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: errorMessage
    }));
  }, []);
  
  // Send message to API
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to chat
    addUserMessage(content);
    
    try {
      if (useStreaming) {
        // Use streaming API
        const controller = new AbortController();
        const signal = controller.signal;
        
        let assistantResponse = '';
        
        await streamMessage(
          content, 
          (chunk) => {
            assistantResponse += chunk;
            setState(prev => {
              // Find if there's already a temporary assistant message
              const hasTemp = prev.messages.some(m => m.id === 'temp-assistant');
              
              if (hasTemp) {
                // Update existing temp message
                return {
                  ...prev,
                  messages: prev.messages.map(m => 
                    m.id === 'temp-assistant' 
                      ? { ...m, content: assistantResponse } 
                      : m
                  )
                };
              } else {
                // Add temp message
                return {
                  ...prev,
                  messages: [
                    ...prev.messages, 
                    {
                      id: 'temp-assistant',
                      role: 'assistant',
                      content: assistantResponse,
                      timestamp: new Date()
                    }
                  ]
                };
              }
            });
          },
          signal
        );
        
        // Replace temp message with final message
        setState(prev => ({
          ...prev,
          isLoading: false,
          messages: prev.messages.map(m => 
            m.id === 'temp-assistant' 
              ? { 
                  ...m, 
                  id: Date.now().toString(),
                  content: assistantResponse 
                } 
              : m
          )
        }));
      } else {
        // Use regular API
        const response = await sendMessage(content);
        addAssistantMessage(response);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to get a response. Please try again.');
    }
  }, [addUserMessage, addAssistantMessage, setError, useStreaming]);
  
  // Clear chat history
  const clearChat = useCallback(() => {
    setState(initialState);
  }, []);
  
  return {
    messages: state.messages,
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    error: state.error,
    toggleChat,
    closeChat,
    sendMessage: handleSendMessage,
    clearChat
  };
};