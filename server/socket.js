const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;
const onlineUsers = new Map(); // userId -> Set of socket IDs

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*', // allows Render frontend or local Vite dev
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // JWT Middleware for Socket Handshake
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
      } catch (err) {
        console.warn('Socket token verification failed:', err.message);
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    // If authenticated, join private user room and update online status
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);

      if (!onlineUsers.has(socket.userId)) {
        onlineUsers.set(socket.userId, new Set());
      }
      onlineUsers.get(socket.userId).add(socket.id);

      // Broadcast list of currently online user IDs
      io.emit('online_users', Array.from(onlineUsers.keys()));
    }

    // Allow user to manually register their user ID if token was set late
    socket.on('register_user', (userId) => {
      if (userId) {
        socket.userId = userId;
        socket.join(`user:${userId}`);
        if (!onlineUsers.has(userId)) {
          onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);
        io.emit('online_users', Array.from(onlineUsers.keys()));
      }
    });

    // Real-Time 1-on-1 Direct Messaging
    socket.on('send_direct_message', ({ recipientId, text, senderName, senderAvatar }) => {
      if (!recipientId || !text || !text.trim()) return;

      const messagePayload = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        senderId: socket.userId,
        senderName: senderName || 'PassionX Member',
        senderAvatar: senderAvatar || '',
        recipientId,
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };

      // Deliver in real-time to recipient's room
      io.to(`user:${recipientId}`).emit('receive_direct_message', messagePayload);

      // Echo back to sender so their UI updates immediately
      socket.emit('message_sent', messagePayload);
    });

    // Real-Time Connection Alert
    socket.on('notify_connection', ({ targetUserId, senderName }) => {
      if (!targetUserId) return;
      io.to(`user:${targetUserId}`).emit('new_connection_alert', {
        senderId: socket.userId,
        senderName: senderName || 'Someone',
        timestamp: new Date().toISOString(),
      });
    });

    // Typing indicator
    socket.on('typing', ({ recipientId, isTyping, senderName }) => {
      if (!recipientId) return;
      io.to(`user:${recipientId}`).emit('user_typing', {
        senderId: socket.userId,
        senderName,
        isTyping,
      });
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
      if (socket.userId && onlineUsers.has(socket.userId)) {
        const userSockets = onlineUsers.get(socket.userId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(socket.userId);
        }
        io.emit('online_users', Array.from(onlineUsers.keys()));
      }
    });
  });

  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };

