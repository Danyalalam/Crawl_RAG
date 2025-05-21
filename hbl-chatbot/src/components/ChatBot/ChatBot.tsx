import React, { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatHeader from './ChatHeader';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import ChatToggle from './ChatToggle';
import { ChatContainer, ChatBody, TypeIndicator } from './styles';
import { useChatBot } from '../../hooks/useChatBot';

const ChatBot: React.FC = () => {
  const { 
    messages, 
    isOpen, 
    isLoading, 
    error, 
    toggleChat, 
    closeChat, 
    sendMessage, 
    clearChat 
  } = useChatBot(true); // Set to true for streaming
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  return (
    <>
      <ChatToggle isOpen={isOpen} onClick={toggleChat} />
      
      <AnimatePresence>
        {isOpen && (
          <ChatContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ChatHeader onClose={closeChat} onClear={clearChat} />
            
            <ChatBody>
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <TypeIndicator>
                  <span />
                  <span />
                  <span />
                </TypeIndicator>
              )}
              
              {error && (
                <ChatBubble 
                  message={{
                    id: 'error',
                    role: 'assistant',
                    content: `Error: ${error}`,
                    timestamp: new Date()
                  }} 
                />
              )}
              
              <div ref={messagesEndRef} />
            </ChatBody>
            
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </ChatContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;