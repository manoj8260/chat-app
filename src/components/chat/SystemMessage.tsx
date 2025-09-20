import React from 'react';
import { ChatMessage } from '@/hooks/useWebSocket';
import { UserPlus, UserMinus, Info } from 'lucide-react';

interface SystemMessageProps {
  message: ChatMessage;
}

export const SystemMessage: React.FC<SystemMessageProps> = ({ message }) => {
  const getSystemIcon = (type: string) => {
    switch (type) {
      case 'user_join':
        return <UserPlus className="h-4 w-4" />;
      case 'user_leave':
        return <UserMinus className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSystemColor = (type: string) => {
    switch (type) {
      case 'user_join':
        return 'text-success';
      case 'user_leave':
        return 'text-warning';
      default:
        return 'text-message-system';
    }
  };

  return (
    <div className="flex justify-center my-3">
      <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full border border-border/50 text-sm">
        <span className={getSystemColor(message.message_type)}>
          {getSystemIcon(message.message_type)}
        </span>
        <span className={`${getSystemColor(message.message_type)} font-medium`}>
          {message.message}
        </span>
      </div>
    </div>
  );
};