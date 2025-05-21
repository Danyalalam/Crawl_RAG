import React from 'react';
import { FaComment, FaTimes } from 'react-icons/fa';
import { ChatToggleButton } from './styles';

interface ChatToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatToggle: React.FC<ChatToggleProps> = ({ isOpen, onClick }) => {
  return (
    <ChatToggleButton
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isOpen ? <FaTimes /> : <FaComment />}
    </ChatToggleButton>
  );
};

export default ChatToggle;