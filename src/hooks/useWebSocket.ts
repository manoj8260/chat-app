import { useCallback, useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  username: string;
  message: string;
  timestamp: string;
  message_type: 'message' | 'system' | 'user_join' | 'user_leave';
  room_id: string;
}

export interface Room {
  room_id: string;
  users: string[];
}

interface WebSocketConfig {
  backendHost: string;
  maxReconnectAttempts: number;
  reconnectDelay: number;
  connectionTimeout: number;
}

const defaultConfig: WebSocketConfig = {
  backendHost: "localhost:8003",
  maxReconnectAttempts: 5,
  reconnectDelay: 3000,
  connectionTimeout: 10000
};

export const useWebSocket = (config: Partial<WebSocketConfig> = {}) => {
  const wsConfig = { ...defaultConfig, ...config };
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const connectionTimeoutRef = useRef<NodeJS.Timeout>();
  
  const messageHandlers = useRef<Set<(message: ChatMessage) => void>>(new Set());
  const errorHandlers = useRef<Set<(error: string) => void>>(new Set());

  const connect = useCallback((username: string, room: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Close existing connection
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      // Clear any existing timeouts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${wsConfig.backendHost}/ws/${encodeURIComponent(username)}?room_id=${encodeURIComponent(room)}`;

      try {
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          setIsConnected(true);
          setConnectionStatus('Connected');
          setReconnectAttempts(0);
          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
          }
          resolve();
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data: ChatMessage = JSON.parse(event.data);
            messageHandlers.current.forEach(handler => handler(data));
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        wsRef.current.onclose = (event) => {
          setIsConnected(false);
          setConnectionStatus('Disconnected');

          // Auto-reconnect logic
          if (event.code !== 1000 && reconnectAttempts < wsConfig.maxReconnectAttempts) {
            setReconnectAttempts(prev => prev + 1);
            setConnectionStatus(`Reconnecting... (${reconnectAttempts + 1}/${wsConfig.maxReconnectAttempts})`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              connect(username, room).catch(console.error);
            }, wsConfig.reconnectDelay);
          } else if (reconnectAttempts >= wsConfig.maxReconnectAttempts) {
            errorHandlers.current.forEach(handler => 
              handler("Could not reconnect to the server. Please refresh the page.")
            );
          }
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          wsRef.current?.close();
          reject(new Error('WebSocket connection failed'));
        };

        // Connection timeout
        connectionTimeoutRef.current = setTimeout(() => {
          if (wsRef.current?.readyState !== WebSocket.OPEN) {
            wsRef.current?.close();
            reject(new Error('Connection timeout'));
          }
        }, wsConfig.connectionTimeout);

      } catch (error) {
        reject(error as Error);
      }
    });
  }, [wsConfig, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null; // Prevent reconnection attempts
      wsRef.current.close(1000, 'User disconnect');
    }
    
    setIsConnected(false);
    setConnectionStatus('Disconnected');
    setReconnectAttempts(0);
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
  }, []);

  const sendMessage = useCallback((message: string, roomId: string): boolean => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      errorHandlers.current.forEach(handler => 
        handler('Not connected to the chat server')
      );
      return false;
    }

    try {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        message: message,
        room_id: roomId
      }));
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      errorHandlers.current.forEach(handler => 
        handler('Failed to send message')
      );
      return false;
    }
  }, []);

  const addMessageHandler = useCallback((handler: (message: ChatMessage) => void) => {
    messageHandlers.current.add(handler);
    return () => messageHandlers.current.delete(handler);
  }, []);

  const addErrorHandler = useCallback((handler: (error: string) => void) => {
    errorHandlers.current.add(handler);
    return () => errorHandlers.current.delete(handler);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
    addMessageHandler,
    addErrorHandler,
  };
};