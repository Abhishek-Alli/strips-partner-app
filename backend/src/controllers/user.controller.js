import { query } from '../config/database.js';

const logger = {
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
  },
};

// ========================================
// USER NOTES
// ========================================

/**
 * Get notes visible to the current user
 * Returns admin notes that are visible to the user's role
 */
export const getUserNotes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get admin notes visible to user's role
    let sql = 'SELECT * FROM admin_notes WHERE (';
    const params = [];
    
    if (userRole === 'PARTNER') {
      sql += 'visible_to_partners = true';
    } else if (userRole === 'DEALER') {
      sql += 'visible_to_dealers = true';
    } else {
      // For GENERAL_USER, show notes visible to both or all
      sql += 'visible_to_partners = true OR visible_to_dealers = true';
    }
    
    sql += ' OR created_by = $1) ORDER BY created_at DESC';
    params.push(userId);
    
    const result = await query(sql, params);
    
    const notes = result.rows.map(row => ({
      id: row.id,
      title: row.title || '',
      content: row.content || '',
      createdAt: row.created_at,
      isRead: false, // TODO: Add read tracking if needed
    }));
    
    res.json({ notes });
  } catch (error) {
    logger.error('Error fetching user notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// ========================================
// USER MESSAGES
// ========================================

/**
 * Get messages for the current user
 * Returns contact enquiries and responses related to the user
 */
export const getUserMessages = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get contact enquiries where user is the sender
    // For now, match by email. In future, could add user_id to contact_enquiries
    const result = await query(
      'SELECT * FROM contact_enquiries WHERE email = $1 ORDER BY created_at DESC',
      [userEmail]
    );
    
    const messages = result.rows.map(row => ({
      id: row.id,
      subject: row.subject || 'Enquiry',
      content: row.message || '',
      from: 'You', // User sent this enquiry
      createdAt: row.created_at,
      isRead: true, // User sent it, so it's read
      replyTo: null,
    }));
    
    // Also get responses (if there's a responses table in future)
    // For now, return empty array for responses
    // TODO: Create messages/responses table for admin-to-user communication
    
    res.json({ messages });
  } catch (error) {
    logger.error('Error fetching user messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

/**
 * Reply to a message
 * Creates a new contact enquiry as a reply
 */
export const replyToMessage = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = req.user;
    const { messageId } = req.params;
    const { content } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Reply content is required' });
    }
    
    // Get original message
    const originalResult = await query(
      'SELECT * FROM contact_enquiries WHERE id = $1',
      [messageId]
    );
    
    if (originalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    const originalMessage = originalResult.rows[0];
    
    // Create reply as a new contact enquiry
    // In a real system, you'd have a messages/responses table
    // For now, create a new enquiry with "Re: " prefix
    const replyResult = await query(
      `INSERT INTO contact_enquiries (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        user.name || 'User',
        user.email || '',
        user.phone || '',
        `Re: ${originalMessage.subject}`,
        content,
      ]
    );
    
    res.status(201).json({
      message: 'Reply sent successfully',
      reply: {
        id: replyResult.rows[0].id,
        subject: replyResult.rows[0].subject,
        content: replyResult.rows[0].message,
        createdAt: replyResult.rows[0].created_at,
      },
    });
  } catch (error) {
    logger.error('Error replying to message:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
};
