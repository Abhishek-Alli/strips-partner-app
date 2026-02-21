/**
 * Socket.IO Service
 *
 * Real-time chat: join conversation rooms, broadcast messages,
 * typing indicators, read receipts.
 *
 * Requires: socket.io (npm install socket.io)
 */

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { saveMessage, isParticipant } from './chat.service.js';

const logger = {
  info:  (m) => console.log(`[socket] ${m}`),
  error: (m, e) => console.error(`[socket] ${m}`, e),
};

export function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin:      process.env.CORS_ORIGIN?.split(',') || '*',
      credentials: true,
    },
    pingTimeout:  60000,
    pingInterval: 25000,
  });

  // ── Auth middleware ───────────────────────────────────────────
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('No token provided'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId   = decoded.userId || decoded.id;
      socket.userName = decoded.name || 'User';
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  // ── Connection ────────────────────────────────────────────────
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.userId}`);

    // Join personal room for direct notifications
    socket.join(`user:${socket.userId}`);

    // ── Join a conversation room ──────────────────────────────
    socket.on('join_conversation', async (conversationId) => {
      try {
        const allowed = await isParticipant(conversationId, socket.userId);
        if (!allowed) {
          socket.emit('error', { message: 'Not a participant in this conversation' });
          return;
        }
        socket.join(`conversation:${conversationId}`);
        logger.info(`${socket.userId} joined conversation ${conversationId}`);
      } catch (err) {
        logger.error('join_conversation error:', err);
      }
    });

    // ── Send a message via socket ─────────────────────────────
    socket.on('send_message', async ({ conversationId, content, messageType = 'text' }) => {
      try {
        if (!conversationId || !content?.trim()) return;
        const allowed = await isParticipant(conversationId, socket.userId);
        if (!allowed) { socket.emit('error', { message: 'Not a participant' }); return; }

        const message = await saveMessage(conversationId, socket.userId, content.trim(), messageType);

        const payload = {
          id:             message.id,
          conversationId,
          senderId:       socket.userId,
          senderName:     socket.userName,
          content:        message.content,
          messageType:    message.message_type,
          createdAt:      message.created_at,
        };

        // Broadcast to everyone in the conversation room
        io.to(`conversation:${conversationId}`).emit('new_message', payload);
      } catch (err) {
        logger.error('send_message error:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ── Typing indicator ──────────────────────────────────────
    socket.on('typing', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId:         socket.userId,
        userName:       socket.userName,
        conversationId,
      });
    });

    socket.on('stop_typing', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_stop_typing', {
        userId:         socket.userId,
        conversationId,
      });
    });

    // ── Disconnect ────────────────────────────────────────────
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
    });
  });

  logger.info('Socket.IO initialized');
  return io;
}
