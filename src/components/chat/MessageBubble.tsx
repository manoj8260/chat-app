import React from 'react';
import { ChatMessage } from '@/hooks/useWebSocket';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={cn(
      "flex flex-col max-w-[75%] slide-in",
      isOwn ? "self-start" : "self-end"
    )}>
      {/* Message Header */}
      <div className={cn(
        "flex items-baseline gap-2 mb-1 px-1 text-xs",
        isOwn ? "flex-row" : "flex-row-reverse"
      )}>
        <span className="font-semibold text-foreground">
          {message.username}
        </span>
        <span className="text-muted-foreground">
          {formatTime(message.timestamp)}
        </span>
      </div>
      
      {/* Message Content */}
      <div className={cn(
        "px-4 py-3 rounded-2xl break-words leading-relaxed shadow-sm",
        isOwn 
          ? "bg-gradient-primary text-white rounded-bl-md shadow-lg" 
          : "bg-message-other text-foreground rounded-br-md border border-border/50"
      )}>
        {message.message}
      </div>
    </div>
  );
};