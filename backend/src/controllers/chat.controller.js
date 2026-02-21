/**
 * Chat Controller — REST endpoints
 */

import {
  getOrCreateConversation,
  getConversations,
  getMessages,
  saveMessage,
  markAsRead,
  isParticipant,
} from '../services/chat.service.js';

const logger = { error: (m, e) => console.error(`[chat] ${m}`, e) };

/** GET /api/chat/conversations */
export const listConversations = async (req, res) => {
  try {
    const conversations = await getConversations(req.user.id);
    res.json({ conversations });
  } catch (error) {
    logger.error('listConversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

/** POST /api/chat/conversations  body: { participantId } */
export const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    if (!participantId) return res.status(400).json({ error: 'participantId is required' });
    if (participantId === req.user.id) return res.status(400).json({ error: 'Cannot chat with yourself' });

    const conversationId = await getOrCreateConversation(req.user.id, participantId);
    res.json({ conversationId });
  } catch (error) {
    logger.error('createConversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

/** GET /api/chat/conversations/:id/messages?page=1&limit=50 */
export const listMessages = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    if (!await isParticipant(conversationId, req.user.id)) {
      return res.status(403).json({ error: 'Not a participant in this conversation' });
    }

    const page  = parseInt(req.query.page  || '1');
    const limit = parseInt(req.query.limit || '50');
    const messages = await getMessages(conversationId, page, limit);
    res.json({ messages });
  } catch (error) {
    logger.error('listMessages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

/** POST /api/chat/conversations/:id/messages  body: { content, messageType? } */
export const sendMessage = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    if (!await isParticipant(conversationId, req.user.id)) {
      return res.status(403).json({ error: 'Not a participant in this conversation' });
    }

    const { content, messageType = 'text' } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'content is required' });

    const message = await saveMessage(conversationId, req.user.id, content.trim(), messageType);

    // Emit via socket if io is available
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation:${conversationId}`).emit('new_message', {
        id:          message.id,
        conversationId,
        senderId:    req.user.id,
        senderName:  req.user.name,
        content:     message.content,
        messageType: message.message_type,
        createdAt:   message.created_at,
      });
    }

    res.status(201).json({ message });
  } catch (error) {
    logger.error('sendMessage:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

/** PUT /api/chat/conversations/:id/read */
export const markRead = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    if (!await isParticipant(conversationId, req.user.id)) {
      return res.status(403).json({ error: 'Not a participant' });
    }
    await markAsRead(conversationId, req.user.id);

    const io = req.app.get('io');
    if (io) {
      io.to(`conversation:${conversationId}`).emit('messages_read', {
        conversationId,
        userId: req.user.id,
      });
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('markRead:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};
