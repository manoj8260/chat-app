import React from 'react';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { LoginForm } from '@/components/chat/LoginForm';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { Toaster } from '@/components/ui/toaster';
import { useIsMobile } from '@/hooks/use-mobile';
import { BACKEND_CONFIG } from '@/config/backend';

const ChatInterface: React.FC = () => {
  const { isLoggedIn } = useChatContext();
  const { logout } = useAuth();
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
        
        {/* Header with logout */}
        <div className="flex items-center justify-between p-4 border-b border-border/20 bg-chat-sidebar/50 backdrop-blur-sm">
          <ChatHeader />
          <LogoutButton onLogout={logout} />
        </div>
        
        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, user, isQuickChatMode, login, register, quickChat } = useAuth();

  if (!isAuthenticated && !isQuickChatMode) {
    return (
      <AuthForm 
        onLogin={login}
        onRegister={register}
        onQuickChat={quickChat}
      />
    );
  }

  return (
    <ChatProvider backendHost={BACKEND_CONFIG.host}>
      <div className="min-h-screen bg-background">
        <ChatInterface />
        <Toaster />
      </div>
    </ChatProvider>
  );
};

const Chat: React.FC = () => {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
};

export default Chat;