import styled from 'styled-components';
import { motion } from 'framer-motion';

// HBL brand colors
export const colors = {
  primary: '#0B792F', // HBL Green
  secondary: '#EA4848', // Red
  tertiary: '#FDBF2D', // Yellow
  background: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  borderColor: '#E0E0E0',
  chatBg: '#F9F9F9',
  userBubble: '#0B792F',
  assistantBubble: '#F0F0F0',
  shadow: 'rgba(0, 0, 0, 0.1)'
};

export const ChatToggleButton = styled(motion.button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 70px;           // Increased from 60px
  height: 70px;          // Increased from 60px
  border-radius: 50%;
  background-color: ${colors.primary};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;       // Increased from 24px
  box-shadow: 0 4px 12px ${colors.shadow};
  z-index: 1000;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

export const ChatContainer = styled(motion.div)`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 450px;  // Increased from 350px
  height: 600px; // Increased from 500px
  border-radius: 12px;
  background-color: ${colors.background};
  box-shadow: 0 8px 24px ${colors.shadow};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  border: 1px solid ${colors.borderColor};
  
  @media (max-width: 500px) {
    width: calc(100% - 40px); // Responsive on mobile
    height: 80vh;
  }
`;

export const ChatHeader = styled.div`
  padding: 15px;
  background-color: ${colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px ${colors.shadow};
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
`;

export const Controls = styled.div`
  display: flex;
  gap: 12px;
  
  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
    }
  }
`;

export const ChatBody = styled.div`
  flex: 1;
  padding: 18px;         // Increased padding
  overflow-y: auto;
  background-color: ${colors.chatBg};
  display: flex;
  flex-direction: column;
  gap: 18px;             // Increased gap
  font-size: 16px;       // Added explicit font size
`;

export const ChatInputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid ${colors.borderColor};
  background-color: ${colors.background};
`;

export const InputForm = styled.form`
  display: flex;
  gap: 10px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 14px 18px;    // Increased padding
  border-radius: 22px;   // Increased border radius
  border: 1px solid ${colors.borderColor};
  font-size: 16px;       // Increased font size
  outline: none;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(11, 121, 47, 0.1);
  }
`;

export const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${colors.primary};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #096e2a;
    transform: scale(1.05);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: ${({ $isUser }) => 
    $isUser ? '18px 18px 0 18px' : '18px 18px 18px 0'};
  background-color: ${({ $isUser }) => 
    $isUser ? colors.userBubble : colors.assistantBubble};
  color: ${({ $isUser }) => $isUser ? 'white' : colors.text};
  align-self: ${({ $isUser }) => $isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: relative;
  word-break: break-word;
  
  p {
    margin: 0;
    line-height: 1.5;
  }
`;

export const TypeIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 10px 16px;
  background-color: ${colors.assistantBubble};
  border-radius: 18px 18px 18px 0;
  align-self: flex-start;
  margin-top: 4px;
  
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${colors.primary};
    opacity: 0.6;
    animation: typing 1s infinite;
    
    &:nth-child(1) {
      animation-delay: 0s;
    }
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
  
  @keyframes typing {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
      opacity: 0.8;
    }
  }
`;

export const Timestamp = styled.div`
  font-size: 10px;
  color: ${colors.textLight};
  margin-top: 4px;
  text-align: right;
  padding-right: 8px;
`;