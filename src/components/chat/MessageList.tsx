import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatContext } from '@/contexts/ChatContext';
import { MessageBubble } from './MessageBubble';
import { SystemMessage } from './SystemMessage';
import { WelcomeMessage } from './WelcomeMessage';
import { ChatMessage } from '@/hooks/useWebSocket';

export const MessageList: React.FC = () => {
  const { currentRoom, roomHistories, username, markRoomAsRead } = useChatContext();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentRoomHistory = roomHistories[currentRoom];
  const messages = currentRoomHistory?.messages || [];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark room as read when viewing
  useEffect(() => {
    if (currentRoomHistory?.unread > 0) {
      markRoomAsRead(currentRoom);
    }
  }, [currentRoom, currentRoomHistory?.unread, markRoomAsRead]);

  const renderMessage = (message: ChatMessage, index: number) => {
    const isSystemMessage = ['system', 'user_join', 'user_leave'].includes(message.message_type);
    
    if (isSystemMessage) {
      return (
        <SystemMessage
          key={`${message.timestamp}-${index}`}
          message={message}
        />
      );
    }

    return (
      <MessageBubble
        key={`${message.timestamp}-${index}`}
        message={message}
        isOwn={message.username === username}
      />
    );
  };

  return (
    <ScrollArea 
      ref={scrollAreaRef}
      className="flex-1 p-6 scrollbar-thin"
    >
      <div className="space-y-4">
        {messages.length === 0 ? (
          <WelcomeMessage roomName={currentRoom} username={username} />
        ) : (
          messages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};