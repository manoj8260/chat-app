import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  quickChat: () => void;
  isQuickChatMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuickChatMode, setIsQuickChatMode] = useState(false);

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('connectsphere_user');
    const storedQuickChat = localStorage.getItem('connectsphere_quickchat');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('connectsphere_user');
      }
    }
    
    if (storedQuickChat === 'true') {
      setIsQuickChatMode(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual FastAPI integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a mock user
      const newUser: User = {
        id: `user_${Date.now()}`,
        username,
        email: `${username}@example.com`, // This would come from your backend
        isOnline: true,
      };
      
      setUser(newUser);
      setIsQuickChatMode(false);
      localStorage.setItem('connectsphere_user', JSON.stringify(newUser));
      localStorage.removeItem('connectsphere_quickchat');
      
      // Here you would typically:
      // 1. Send login request to your FastAPI backend
      // 2. Receive JWT token and user data
      // 3. Store token for future requests
      // Example:
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password })
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);
      // setUser(data.user);
      // localStorage.setItem('auth_token', data.token);
      
    } catch (error) {
      throw new Error('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual FastAPI integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically:
      // 1. Send registration request to your FastAPI backend
      // 2. Handle validation and user creation
      // 3. Optionally auto-login after registration
      // Example:
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, email, password })
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);
      
      console.log('Registration successful for:', { username, email });
      
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsQuickChatMode(false);
    localStorage.removeItem('connectsphere_user');
    localStorage.removeItem('connectsphere_quickchat');
    localStorage.removeItem('auth_token');
    
    // Here you would typically:
    // 1. Send logout request to your FastAPI backend
    // 2. Invalidate tokens
    // Example:
    // fetch('/api/auth/logout', { method: 'POST' });
  };

  const quickChat = () => {
    setIsQuickChatMode(true);
    localStorage.setItem('connectsphere_quickchat', 'true');
    localStorage.removeItem('connectsphere_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    quickChat,
    isQuickChatMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};