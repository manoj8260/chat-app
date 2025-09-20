import React from 'react';
import { MessageCircle, Users } from 'lucide-react';

interface WelcomeMessageProps {
  roomName: string;
  username?: string;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ roomName, username }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
      <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
        <MessageCircle className="w-12 h-12 text-white" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-foreground">
          Welcome to #{roomName}
        </h2>
        
        {username ? (
          <p className="text-muted-foreground max-w-md">
            Hi <span className="text-accent font-semibold">{username}</span>! 
            You're now in the <span className="text-foreground font-medium">#{roomName}</span> room. 
            Start chatting with others or switch to a different room.
          </p>
        ) : (
          <p className="text-muted-foreground max-w-md">
            This room is ready for conversations. Be the first to send a message!
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 px-4 py-2 rounded-lg border border-border/30">
        <Users className="w-4 h-4" />
        <span>Real-time messaging • End-to-end connected</span>
      </div>
    </div>
  );
};