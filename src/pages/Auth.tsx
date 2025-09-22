import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { Navigate } from 'react-router-dom';

const AuthContent: React.FC = () => {
  const { isAuthenticated, isQuickChatMode, login, register, quickChat } = useAuth();

  if (isAuthenticated || isQuickChatMode) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <AuthForm 
      onLogin={login}
      onRegister={register}
      onQuickChat={quickChat}
    />
  );
};

const Auth: React.FC = () => {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
};

export default Auth;