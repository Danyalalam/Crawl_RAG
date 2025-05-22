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
  bottom: 25px;
  right: 25px;
  width: 80px;           // Increased from 70px
  height: 80px;          // Increased from 70px
  border-radius: 50%;
  background-color: ${colors.primary};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;       // Increased from 28px
  box-shadow: 0 6px 16px ${colors.shadow};
  z-index: 1000;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

export const ChatContainer = styled(motion.div)`
  position: fixed;
  bottom: 100px;
  right: 25px;
  width: 550px;  // Increased from 450px
  height: 700px; // Increased from 600px
  border-radius: 14px;
  background-color: ${colors.background};
  box-shadow: 0 10px 30px ${colors.shadow};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  border: 1px solid ${colors.borderColor};
  
  @media (max-width: 600px) {
    width: calc(100% - 40px); // Responsive on mobile
    height: 85vh;
  }
`;

export const ChatHeader = styled.div`
  padding: 18px 20px;    // Increased padding
  background-color: ${colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 3px 6px ${colors.shadow};
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  img {
    width: 36px;         // Increased from 30px
    height: 36px;        // Increased from 30px
    border-radius: 50%;
    object-fit: cover;
  }
  
  h3 {
    margin: 0;
    font-size: 18px;     // Increased from 16px
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
  padding: 22px;         // Increased padding
  overflow-y: auto;
  background-color: ${colors.chatBg};
  display: flex;
  flex-direction: column;
  gap: 22px;             // Increased gap
  font-size: 17px;       // Increased font size
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
  padding: 16px 22px;    // Increased padding
  border-radius: 24px;   // Increased border radius
  border: 1px solid ${colors.borderColor};
  font-size: 17px;       // Increased font size
  outline: none;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(11, 121, 47, 0.12);
  }
`;

export const SendButton = styled.button`
  width: 48px;           // Increased from 40px
  height: 48px;          // Increased from 40px
  border-radius: 50%;
  background-color: ${colors.primary};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 20px;       // Added explicit font size
  
  &:hover {
    background-color: #096e2a;
    transform: scale(1.05);
  }
`;

export const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 85%;
  padding: 15px 20px;    // Increased padding
  border-radius: ${({ $isUser }) => 
    $isUser ? '20px 20px 0 20px' : '20px 20px 20px 0'};
  background-color: ${({ $isUser }) => 
    $isUser ? colors.userBubble : colors.assistantBubble};
  color: ${({ $isUser }) => $isUser ? 'white' : colors.text};
  align-self: ${({ $isUser }) => $isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  position: relative;
  word-break: break-word;
  font-size: 17px;       // Increased font size
  line-height: 1.6;      // Increased line height
  
  p {
    margin: 0;
    line-height: 1.6;
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