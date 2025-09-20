// Backend configuration for FastAPI connection
export const BACKEND_CONFIG = {
  // Change this to your FastAPI server address
  host: "localhost:8003", // Update to your FastAPI host:port
  
  // WebSocket endpoint: ws://{host}/ws/{username}?room_id={room}
  // HTTP API endpoint: http://{host}/api/rooms
  
  // Connection settings
  maxReconnectAttempts: 5,
  reconnectDelay: 3000,
  connectionTimeout: 10000
};