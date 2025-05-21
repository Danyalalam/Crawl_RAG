import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { ChatInputContainer, InputForm, Input, SendButton } from './styles';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <ChatInputContainer>
      <InputForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />
        <SendButton type="submit" disabled={isLoading || !message.trim()}>
          <FaPaperPlane size={14} />
        </SendButton>
      </InputForm>
    </ChatInputContainer>
  );
};

export default ChatInput;