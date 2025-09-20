import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useChatContext } from '@/contexts/ChatContext';
import { toast } from '@/hooks/use-toast';
import heroImage from '@/assets/chat-hero.jpg';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useChatContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(username, room);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const roomInput = document.getElementById('room-input') as HTMLInputElement;
      roomInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-glass backdrop-blur-lg">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <Card className="glass w-full max-w-md border-border/50 shadow-glow relative z-10">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ConnectSphere
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Enter your details to start chatting with others in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleUsernameKeyPress}
                  maxLength={20}
                  className="h-12 bg-input/50 border-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <div>
                <Input
                  id="room-input"
                  type="text"
                  placeholder="Initial room (e.g., general)"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                  maxLength={20}
                  className="h-12 bg-input/50 border-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Join Chat'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};