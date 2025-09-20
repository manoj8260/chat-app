import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatContext } from '@/contexts/ChatContext';
import { Send, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isConnected } = useChatContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isSending) return;
    
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please wait for connection to be established",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    const messageToSend = message.trim();
    setMessage(''); // Clear input immediately for better UX
    
    try {
      const success = sendMessage(messageToSend);
      if (!success) {
        // Restore message if sending failed
        setMessage(messageToSend);
      }
    } catch (error) {
      // Restore message if sending failed
      setMessage(messageToSend);
      toast({
        title: "Send Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-6 bg-chat-input border-t border-border/50">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={1000}
          className="flex-1 h-12 bg-input/50 border-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          disabled={!isConnected || isSending}
          autoFocus
        />
        
        <Button
          type="submit"
          size="lg"
          className="h-12 w-12 p-0 bg-gradient-primary hover:shadow-glow transition-all duration-300"
          disabled={!message.trim() || !isConnected || isSending}
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
      
      {/* Character counter for long messages */}
      {message.length > 800 && (
        <div className="mt-2 text-right">
          <span className={`text-xs ${message.length > 950 ? 'text-warning' : 'text-muted-foreground'}`}>
            {message.length}/1000
          </span>
        </div>
      )}
    </div>
  );
};