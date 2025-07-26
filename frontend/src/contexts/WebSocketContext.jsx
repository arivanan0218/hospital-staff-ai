import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateStaffRealtime } from '../store/slices/staffSlice';
import { updateShiftRealtime } from '../store/slices/shiftSlice';
import { addRealtimeNotification } from '../store/slices/dashboardSlice';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Generate a unique client ID
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Connect to WebSocket
    const ws = new WebSocket(`ws://localhost:8000/ws/${clientId}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'staff_update':
        dispatch(updateStaffRealtime(message.data));
        break;
      case 'shift_update':
        dispatch(updateShiftRealtime(message.data));
        break;
      case 'allocation_update':
        dispatch(addRealtimeNotification({
          type: 'allocation',
          message: 'New staff allocation created',
          data: message.data,
          timestamp: new Date().toISOString(),
        }));
        break;
      case 'emergency_alert':
        dispatch(addRealtimeNotification({
          type: 'emergency',
          message: message.message,
          data: message.data,
          timestamp: new Date().toISOString(),
        }));
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  const sendMessage = (message) => {
    if (socket && connected) {
      socket.send(JSON.stringify(message));
    }
  };

  const value = {
    socket,
    connected,
    sendMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};