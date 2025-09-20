import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useWebSocket, ChatMessage, Room } from '@/hooks/useWebSocket';
import { toast } from '@/hooks/use-toast';

interface RoomHistory {
  messages: ChatMessage[];
  unread: number;
}

interface ChatContextType {
  // User state
  username: string;
  isLoggedIn: boolean;
  
  // Room state
  currentRoom: string;
  roomHistories: Record<string, RoomHistory>;
  availableRooms: Room[];
  
  // Connection state
  isConnected: boolean;
  connectionStatus: string;
  
  // Actions
  login: (username: string, room: string) => Promise<void>;
  logout: () => void;
  switchRoom: (roomId: string) => Promise<void>;
  sendMessage: (message: string) => boolean;
  createOrJoinRoom: (roomName: string) => Promise<void>;
  loadRoomList: () => Promise<void>;
  markRoomAsRead: (roomId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
  backendHost?: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ 
  children, 
  backendHost = "localhost:8003" 
}) => {
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState('general');
  const [roomHistories, setRoomHistories] = useState<Record<string, RoomHistory>>({});
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { 
    isConnected, 
    connectionStatus, 
    connect, 
    disconnect, 
    sendMessage: wsSendMessage,
    addMessageHandler,
    addErrorHandler
  } = useWebSocket({ backendHost });

  // Handle incoming messages
  useEffect(() => {
    const removeMessageHandler = addMessageHandler((message: ChatMessage) => {
      const messageRoom = message.room_id || currentRoom;
      
      setRoomHistories(prev => {
        const roomHistory = prev[messageRoom] || { messages: [], unread: 0 };
        const updatedHistory = {
          ...roomHistory,
          messages: [...roomHistory.messages, message],
          unread: messageRoom === currentRoom ? 0 : roomHistory.unread + 1
        };
        
        return {
          ...prev,
          [messageRoom]: updatedHistory
        };
      });

      // Handle specific message types
      if (message.message_type === 'user_join' || message.message_type === 'user_leave') {
        setTimeout(() => loadRoomList(), 1000);
      }
    });

    const removeErrorHandler = addErrorHandler((error: string) => {
      toast({
        title: "Connection Error",
        description: error,
        variant: "destructive",
      });
    });

    return () => {
      removeMessageHandler();
      removeErrorHandler();
    };
  }, [addMessageHandler, addErrorHandler, currentRoom]);

  const login = useCallback(async (newUsername: string, room: string) => {
    if (!newUsername.trim()) {
      throw new Error('Username is required');
    }
    
    if (newUsername.length > 20) {
      throw new Error('Username must be 20 characters or less');
    }

    try {
      await connect(newUsername.trim(), room.trim() || 'general');
      setUsername(newUsername.trim());
      setCurrentRoom(room.trim() || 'general');
      setIsLoggedIn(true);
      
      // Initialize room history
      setRoomHistories(prev => ({
        ...prev,
        [room.trim() || 'general']: prev[room.trim() || 'general'] || { messages: [], unread: 0 }
      }));
      
      await loadRoomList();
      
      toast({
        title: "Connected",
        description: `Welcome to ConnectSphere, ${newUsername}!`,
      });
    } catch (error) {
      throw error;
    }
  }, [connect]);

  const logout = useCallback(() => {
    disconnect();
    setUsername('');
    setCurrentRoom('general');
    setRoomHistories({});
    setAvailableRooms([]);
    setIsLoggedIn(false);
    
    toast({
      title: "Disconnected",
      description: "You have been logged out",
    });
  }, [disconnect]);

  const switchRoom = useCallback(async (newRoomId: string) => {
    if (newRoomId === currentRoom || !username) {
      return;
    }

    try {
      await connect(username, newRoomId);
      setCurrentRoom(newRoomId);
      
      // Initialize room history if needed and mark as read
      setRoomHistories(prev => ({
        ...prev,
        [newRoomId]: {
          ...prev[newRoomId] || { messages: [], unread: 0 },
          unread: 0
        }
      }));
      
      await loadRoomList();
    } catch (error) {
      toast({
        title: "Room Switch Failed",
        description: `Failed to switch to room ${newRoomId}`,
        variant: "destructive",
      });
    }
  }, [currentRoom, username, connect]);

  const sendMessage = useCallback((message: string): boolean => {
    if (!message.trim()) return false;
    
    if (message.length > 1000) {
      toast({
        title: "Message Too Long",
        description: "Message must be 1000 characters or less",
        variant: "destructive",
      });
      return false;
    }

    return wsSendMessage(message.trim(), currentRoom);
  }, [wsSendMessage, currentRoom]);

  const createOrJoinRoom = useCallback(async (roomName: string) => {
    if (!roomName.trim()) {
      throw new Error('Room name is required');
    }
    
    if (roomName.length > 20) {
      throw new Error('Room name must be 20 characters or less');
    }
    
    if (!username) {
      throw new Error('Please log in first to create a room');
    }

    await switchRoom(roomName.trim());
  }, [username, switchRoom]);

  const loadRoomList = useCallback(async () => {
    try {
      const response = await fetch(`http://${backendHost}/api/rooms`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rooms: Room[] = await response.json();
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Error loading room list:', error);
      // Don't show error to user for background operations
    }
  }, [backendHost]);

  const markRoomAsRead = useCallback((roomId: string) => {
    setRoomHistories(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId] || { messages: [], unread: 0 },
        unread: 0
      }
    }));
  }, []);

  const value: ChatContextType = {
    username,
    isLoggedIn,
    currentRoom,
    roomHistories,
    availableRooms,
    isConnected,
    connectionStatus,
    login,
    logout,
    switchRoom,
    sendMessage,
    createOrJoinRoom,
    loadRoomList,
    markRoomAsRead,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};