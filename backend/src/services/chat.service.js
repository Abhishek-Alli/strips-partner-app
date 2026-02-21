/**
 * Chat Service
 *
 * DB queries for conversations and messages.
 * Table assumptions (matching existing Supabase schema):
 *   conversations(id, created_at, updated_at, last_message_at, metadata JSONB)
 *   conversation_participants(conversation_id, user_id, unread_count, joined_at)
 *   messages(id, conversation_id, sender_id, content, message_type, is_read, created_at)
 */

import { query } from '../config/database.js';

const logger = { error: (m, e) => console.error(`[chat] ${m}`, e) };

/**
 * Get or create a 1-on-1 conversation between two users
 */
export async function getOrCreateConversation(userId1, userId2) {
  // Find existing conversation with exactly these two participants
  const existing = await query(
    `SELECT c.id FROM conversations c
     JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = $1
     JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = $2
     LIMIT 1`,
    [userId1, userId2]
  );

  if (existing.rows.length > 0) return existing.rows[0].id;

  // Create new conversation
  const conv = await query(
    `INSERT INTO conversations (last_message_at) VALUES (NOW()) RETURNING id`,
    []
  );
  const convId = conv.rows[0].id;

  await query(
    `INSERT INTO conversation_participants (conversation_id, user_id, unread_count)
     VALUES ($1, $2, 0), ($1, $3, 0)`,
    [convId, userId1, userId2]
  );

  return convId;
}

/**
 * Get all conversations for a user with last message and participant info
 */
export async function getConversations(userId) {
  const result = await query(
    `SELECT
       c.id,
       c.last_message_at,
       cp.unread_count,
       (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
       (SELECT message_type FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message_type,
       -- Other participant
       u.id AS other_user_id,
       u.name AS other_user_name,
       p.avatar_url AS other_user_avatar,
       u.role AS other_user_role
     FROM conversations c
     JOIN conversation_participants cp ON cp.conversation_id = c.id AND cp.user_id = $1
     JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id != $1
     JOIN users u ON u.id = cp2.user_id
     LEFT JOIN profiles p ON p.user_id = u.id
     ORDER BY c.last_message_at DESC NULLS LAST`,
    [userId]
  );

  return result.rows.map(r => ({
    id:            r.id,
    lastMessageAt: r.last_message_at,
    unreadCount:   parseInt(r.unread_count) || 0,
    lastMessage:   r.last_message || '',
    lastMessageType: r.last_message_type || 'text',
    participant: {
      id:       r.other_user_id,
      name:     r.other_user_name,
      avatar:   r.other_user_avatar,
      role:     r.other_user_role,
    },
  }));
}

/**
 * Get paginated messages for a conversation
 */
export async function getMessages(conversationId, page = 1, limit = 50) {
  const offset = (page - 1) * limit;
  const result = await query(
    `SELECT m.id, m.sender_id, m.content, m.message_type, m.is_read, m.created_at,
            u.name AS sender_name, p.avatar_url AS sender_avatar
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     LEFT JOIN profiles p ON p.user_id = m.sender_id
     WHERE m.conversation_id = $1
     ORDER BY m.created_at DESC
     LIMIT $2 OFFSET $3`,
    [conversationId, limit, offset]
  );

  return result.rows.map(r => ({
    id:          r.id,
    senderId:    r.sender_id,
    senderName:  r.sender_name,
    senderAvatar:r.sender_avatar,
    content:     r.content,
    messageType: r.message_type || 'text',
    isRead:      r.is_read,
    createdAt:   r.created_at,
  })).reverse(); // oldest first for chat display
}

/**
 * Save a new message and update conversation timestamp
 */
export async function saveMessage(conversationId, senderId, content, messageType = 'text') {
  const msg = await query(
    `INSERT INTO messages (conversation_id, sender_id, content, message_type, is_read)
     VALUES ($1, $2, $3, $4, false) RETURNING *`,
    [conversationId, senderId, content, messageType]
  );

  await query(
    `UPDATE conversations SET last_message_at = NOW(), updated_at = NOW() WHERE id = $1`,
    [conversationId]
  );

  // Increment unread count for all other participants
  await query(
    `UPDATE conversation_participants
     SET unread_count = unread_count + 1
     WHERE conversation_id = $1 AND user_id != $2`,
    [conversationId, senderId]
  );

  return msg.rows[0];
}

/**
 * Mark all messages in a conversation as read for a user
 */
export async function markAsRead(conversationId, userId) {
  await query(
    `UPDATE messages SET is_read = true
     WHERE conversation_id = $1 AND sender_id != $2 AND is_read = false`,
    [conversationId, userId]
  );

  await query(
    `UPDATE conversation_participants SET unread_count = 0
     WHERE conversation_id = $1 AND user_id = $2`,
    [conversationId, userId]
  );
}

/**
 * Check if a user is a participant in a conversation
 */
export async function isParticipant(conversationId, userId) {
  const result = await query(
    `SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`,
    [conversationId, userId]
  );
  return result.rows.length > 0;
}
