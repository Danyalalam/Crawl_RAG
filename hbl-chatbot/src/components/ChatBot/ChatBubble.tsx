import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { MessageBubble, Timestamp } from './styles';
import type { Message } from '../../types';

// Fix the CodeComponentProps type - make children optional
type CodeComponentProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode; // Make this optional to match React-Markdown's expectations
}

interface ChatBubbleProps {
  message: Message;
}

const formatTime = (timestamp: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(timestamp);
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div>
      <MessageBubble $isUser={isUser}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            // Style links appropriately for chat bubbles
            a: (props) => (
              <a 
                style={{ 
                  color: isUser ? '#ffffff' : '#0B792F',
                  textDecoration: 'underline'
                }}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            // Add custom code styling with proper typing
            code: ({ inline, className, children, ...props }: CodeComponentProps) => {
              return !inline ? (
                <code
                  style={{
                    display: 'block',
                    background: isUser ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.9em',
                    overflowX: 'auto',
                    whiteSpace: 'pre'
                  }}
                  className={className}
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <code 
                  style={{ 
                    background: isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    fontSize: '0.9em'
                  }}
                  className={className}
                  {...props}
                >
                  {children}
                </code>
              );
            }
          }}
        >
          {message.content}
        </ReactMarkdown>
      </MessageBubble>
      <Timestamp>{formatTime(message.timestamp)}</Timestamp>
    </div>
  );
};

export default ChatBubble;