/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';

import { Socket } from 'socket.io-client';
import io from 'socket.io-client';

interface SocketContextType {
  socket: typeof Socket | null;
  isConnected: boolean;
  newRequestsCount: number;
  showNotificationBanner: boolean;
  resetNotificationCount: () => void;
  hideNotificationBanner: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  useEffect(() => {
    // Kết nối đến Backend Socket.IO server
    const socketInstance = io(
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
      {
        auth: { withCredentials: true },
        transports: ['websocket', 'polling'],
      }
    );

    // Lắng nghe sự kiện kết nối
    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    // Lắng nghe event "request" từ Backend
    socketInstance.on('new_request', () => {
      // Chỉ hiển thị notification khi đang ở trang orders
      const isAdminCreated = sessionStorage.getItem('admin-creating-order');
      const currentPath = window.location.pathname;
      if (
        currentPath.includes('/orders') &&
        !currentPath.includes('/detail/') &&
        !isAdminCreated
      ) {
        setNewRequestsCount((prev) => prev + 1);
        setShowNotificationBanner(true);
      }
      //Clear flag sau khi xử lý (dù có hiển thị hay không)
      if (isAdminCreated) {
        sessionStorage.removeItem('admin-creating-order');
      }
    });

    // Thêm listener cho helper working status changed
    socketInstance.on('helper_workingStatus_changed', (data) => {
      console.log('Helper working status changed:', data);
      // Dispatch custom event để các components có thể listen
      window.dispatchEvent(
        new CustomEvent('helperStatusChanged', {
          detail: data,
        })
      );
    });

    setSocket(socketInstance);

    // Cleanup khi component unmount
    return () => {
      socketInstance.off('new_request');
      socketInstance.off('helper_workingStatus_changed');
      socketInstance.disconnect();
    };
  }, []);

  const resetNotificationCount = () => {
    setNewRequestsCount(0);
    setShowNotificationBanner(false);
  };

  const hideNotificationBanner = () => {
    setShowNotificationBanner(false);
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    newRequestsCount,
    showNotificationBanner,
    resetNotificationCount,
    hideNotificationBanner,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
