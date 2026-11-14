import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [toastNotification, setToastNotification] = useState(null);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState({}); // recipientId/senderId -> array of messages
  const [typingUsers, setTypingUsers] = useState({});

  const token = localStorage.getItem('token');
  const socketRef = useRef(null);

  useEffect(() => {
    // In production, connect to current origin. In dev, connect to localhost:5001
    const serverUrl =
      import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : window.location.hostname === 'localhost'
        ? 'http://localhost:5001'
        : window.location.origin;

    const newSocket = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      if (user?._id) {
        newSocket.emit('register_user', user._id);
      }
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('online_users', (usersList) => {
      setOnlineUsers(usersList || []);
    });

    // Real-Time Direct Message Received
    newSocket.on('receive_direct_message', (msg) => {
      const partnerId = msg.senderId;
      setMessages((prev) => ({
        ...prev,
        [partnerId]: [...(prev[partnerId] || []), msg],
      }));

      // Show toast alert if chat is not currently open with this sender
      setActiveChatUser((currentChat) => {
        if (!currentChat || currentChat._id !== msg.senderId) {
          setToastNotification({
            type: 'message',
            title: `💬 New message from ${msg.senderName}`,
            body: msg.text,
            avatar: msg.senderAvatar,
            sender: {
              _id: msg.senderId,
              name: msg.senderName,
              avatar: msg.senderAvatar,
            },
          });
        }
        return currentChat;
      });
    });

    // Message sent confirmation
    newSocket.on('message_sent', (msg) => {
      const partnerId = msg.recipientId;
      setMessages((prev) => ({
        ...prev,
        [partnerId]: [...(prev[partnerId] || []), msg],
      }));
    });

    // Real-Time Connection Alert
    newSocket.on('new_connection_alert', (alert) => {
      setToastNotification({
        type: 'connection',
        title: '🎉 New Connection!',
        body: `${alert.senderName} just connected with you on PassionX!`,
      });
    });

    // Typing status
    newSocket.on('user_typing', ({ senderId, isTyping }) => {
      setTypingUsers((prev) => ({ ...prev, [senderId]: isTyping }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id, token]);

  const clearToast = useCallback(() => {
    setToastNotification(null);
  }, []);

  const openChat = useCallback((partner) => {
    setActiveChatUser(partner);
    setToastNotification(null);
  }, []);

  const closeChat = useCallback(() => {
    setActiveChatUser(null);
  }, []);

  const sendMessage = useCallback(
    (recipientId, text) => {
      if (!socket || !recipientId || !text.trim()) return;
      socket.emit('send_direct_message', {
        recipientId,
        text,
        senderName: user?.name || 'PassionX Member',
        senderAvatar: user?.avatar || '',
      });
    },
    [socket, user]
  );

  const notifyConnection = useCallback(
    (targetUserId) => {
      if (!socket || !targetUserId) return;
      socket.emit('notify_connection', {
        targetUserId,
        senderName: user?.name || 'Someone',
      });
    },
    [socket, user]
  );

  const sendTypingStatus = useCallback(
    (recipientId, isTyping) => {
      if (!socket || !recipientId) return;
      socket.emit('typing', {
        recipientId,
        isTyping,
        senderName: user?.name,
      });
    },
    [socket, user]
  );

  const isUserOnline = useCallback(
    (userId) => {
      return onlineUsers.includes(userId);
    },
    [onlineUsers]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        onlineUsers,
        isUserOnline,
        toastNotification,
        clearToast,
        activeChatUser,
        openChat,
        closeChat,
        messages,
        sendMessage,
        notifyConnection,
        sendTypingStatus,
        typingUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
