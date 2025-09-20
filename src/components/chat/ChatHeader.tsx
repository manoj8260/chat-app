import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useChatContext } from '@/contexts/ChatContext';
import { Hash, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ChatHeader: React.FC = () => {
  const { currentRoom, isConnected, connectionStatus } = useChatContext();

  return (
    <div className="h-16 bg-chat-main border-b border-border/50 flex items-center justify-between px-6">
      {/* Room Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-accent" />
          <h1 className="text-xl font-semibold text-foreground">
            {currentRoom}
          </h1>
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
          isConnected 
            ? "bg-success/20 text-success border border-success/30" 
            : "bg-destructive/20 text-destructive border border-destructive/30"
        )}>
          {isConnected ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          <span>{connectionStatus}</span>
          
          {isConnected && (
            <div className="w-2 h-2 bg-success rounded-full pulse-glow" />
          )}
        </div>
      </div>
    </div>
  );
};