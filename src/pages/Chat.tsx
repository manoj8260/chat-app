import React from 'react';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
import { LoginForm } from '@/components/chat/LoginForm';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { Toaster } from '@/components/ui/toaster';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatInterface: React.FC = () => {
  const { isLoggedIn } = useChatContext();
  const isMobile = useIsMobile();

  if (!isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen bg-gradient-subtle overflow-hidden">
      {/* Sidebar - Hidden on mobile, shown in sheet */}
      {!isMobile && <Sidebar />}
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-chat-main relative">
        {/* Mobile sidebar trigger is inside Sidebar component */}
        {isMobile && <Sidebar />}
        
        <ChatHeader />
        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-background">
        <ChatInterface />
        <Toaster />
      </div>
    </ChatProvider>
  );
};

export default Chat;