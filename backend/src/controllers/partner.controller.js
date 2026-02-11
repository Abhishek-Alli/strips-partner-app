/**
 * Partner Controller
 *
 * Handles Partner-specific API requests
 */

import { query } from '../config/database.js';

// ============================================================================
// DASHBOARD
// ============================================================================

export const getPartnerDashboardStats = async (req, res) => {
  try {
    const partnerId = req.user.id;

    // Get works stats
    const worksResult = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_approved = true AND is_active = true) as approved_active
      FROM partner_works
      WHERE partner_id = $1
    `, [partnerId]);

    // Get enquiries stats
    const enquiriesResult = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'new') as new_count,
        COUNT(*) FILTER (WHERE status = 'responded') as responded_count
      FROM partner_enquiries
      WHERE partner_id = $1
    `, [partnerId]);

    // Get feedbacks stats
    const feedbacksResult = await query(`
      SELECT
        COUNT(*) as total,
        COALESCE(AVG(rating), 0) as avg_rating
      FROM partner_feedbacks
      WHERE partner_id = $1
    `, [partnerId]);

    // Get profile info
    const profileResult = await query(`
      SELECT p.*, u.name, u.email
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
    `, [partnerId]);

    // Get recent enquiries
    const recentEnquiries = await query(`
      SELECT * FROM partner_enquiries
      WHERE partner_id = $1
      ORDER BY created_at DESC
      LIMIT 5
    `, [partnerId]);

    // Get recent feedbacks
    const recentFeedbacks = await query(`
      SELECT pf.*, u.name as user_name
      FROM partner_feedbacks pf
      LEFT JOIN users u ON pf.user_id = u.id
      WHERE pf.partner_id = $1
      ORDER BY pf.created_at DESC
      LIMIT 5
    `, [partnerId]);

    res.json({
      stats: {
        totalWorks: parseInt(worksResult.rows[0].total) || 0,
        approvedWorks: parseInt(worksResult.rows[0].approved_active) || 0,
        totalEnquiries: parseInt(enquiriesResult.rows[0].total) || 0,
        newEnquiries: parseInt(enquiriesResult.rows[0].new_count) || 0,
        respondedEnquiries: parseInt(enquiriesResult.rows[0].responded_count) || 0,
        totalFeedbacks: parseInt(feedbacksResult.rows[0].total) || 0,
        averageRating: parseFloat(feedbacksResult.rows[0].avg_rating) || 0
      },
      profile: profileResult.rows[0] || null,
      recentEnquiries: recentEnquiries.rows,
      recentFeedbacks: recentFeedbacks.rows
    });
  } catch (error) {
    console.error('Get partner dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

// ============================================================================
// PARTNER WORKS
// ============================================================================

export const getPartnerWorks = async (req, res) => {
  try {
    const partnerId = req.user.id;

    const result = await query(`
      SELECT * FROM partner_works
      WHERE partner_id = $1
      ORDER BY created_at DESC
    `, [partnerId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get partner works error:', error);
    res.status(500).json({ error: 'Failed to fetch partner works' });
  }
};

export const getPartnerWorkById = async (req, res) => {
  try {
    const { id } = req.params;
    const partnerId = req.user.id;

    const result = await query(`
      SELECT * FROM partner_works
      WHERE id = $1 AND partner_id = $2
    `, [id, partnerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Work not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get partner work error:', error);
    res.status(500).json({ error: 'Failed to fetch partner work' });
  }
};

export const createPartnerWork = async (req, res) => {
  try {
    const partnerId = req.user.id;
    const { title, description, images, videos, links, category } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await query(`
      INSERT INTO partner_works (partner_id, title, description, images, videos, links, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [partnerId, title, description, images || [], videos || [], links || [], category]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create partner work error:', error);
    res.status(500).json({ error: 'Failed to create partner work' });
  }
};

export const updatePartnerWork = async (req, res) => {
  try {
    const { id } = req.params;
    const partnerId = req.user.id;
    const { title, description, images, videos, links, category, is_active } = req.body;

    const result = await query(`
      UPDATE partner_works
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          images = COALESCE($3, images),
          videos = COALESCE($4, videos),
          links = COALESCE($5, links),
          category = COALESCE($6, category),
          is_active = COALESCE($7, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 AND partner_id = $9
      RETURNING *
    `, [title, description, images, videos, links, category, is_active, id, partnerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Work not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update partner work error:', error);
    res.status(500).json({ error: 'Failed to update partner work' });
  }
};

export const deletePartnerWork = async (req, res) => {
  try {
    const { id } = req.params;
    const partnerId = req.user.id;

    const result = await query(`
      DELETE FROM partner_works
      WHERE id = $1 AND partner_id = $2
      RETURNING id
    `, [id, partnerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Work not found' });
    }

    res.json({ message: 'Work deleted successfully' });
  } catch (error) {
    console.error('Delete partner work error:', error);
    res.status(500).json({ error: 'Failed to delete partner work' });
  }
};

// ============================================================================
// ENQUIRIES
// ============================================================================

export const getPartnerEnquiries = async (req, res) => {
  try {
    const partnerId = req.user.id;
    const { status } = req.query;

    let sql = `
      SELECT pe.*, u.name as user_name, u.email as user_email
      FROM partner_enquiries pe
      LEFT JOIN users u ON pe.user_id = u.id
      WHERE pe.partner_id = $1
    `;
    const params = [partnerId];

    if (status && status !== 'all') {
      sql += ' AND pe.status = $2';
      params.push(status);
    }

    sql += ' ORDER BY pe.created_at DESC';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get partner enquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch partner enquiries' });
  }
};

export const getPartnerEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    const partnerId = req.user.id;

    const result = await query(`
      SELECT pe.*, u.name as user_name, u.email as user_email, u.phone as user_phone
      FROM partner_enquiries pe
      LEFT JOIN users u ON pe.user_id = u.id
      WHERE pe.id = $1 AND pe.partner_id = $2
    `, [id, partnerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get partner enquiry error:', error);
    res.status(500).json({ error: 'Failed to fetch partner enquiry' });
  }
};

export const respondToPartnerEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const partnerId = req.user.id;
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({ error: 'Response is required' });
    }

    const result = await query(`
      UPDATE partner_enquiries
      SET response = $1,
          status = 'responded',
          responded_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND partner_id = $3
      RETURNING *
    `, [response, id, partnerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Respond to partner enquiry error:', error);
    res.status(500).json({ error: 'Failed to respond to enquiry' });
  }
};

// ============================================================================
// FEEDBACKS
// ============================================================================

export const getPartnerFeedbacks = async (req, res) => {
  try {
    const partnerId = req.user.id;

    const result = await query(`
      SELECT pf.*, u.name as user_name
      FROM partner_feedbacks pf
      LEFT JOIN users u ON pf.user_id = u.id
      WHERE pf.partner_id = $1
      ORDER BY pf.created_at DESC
    `, [partnerId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get partner feedbacks error:', error);
    res.status(500).json({ error: 'Failed to fetch partner feedbacks' });
  }
};

export const respondToFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const partnerId = req.user.id;
    const { partner_response } = req.body;

    if (!partner_response) {
      return res.status(400).json({ error: 'Response is required' });
    }

    const result = await query(`
      UPDATE partner_feedbacks
      SET partner_response = $1,
          partner_responded_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND partner_id = $3
      RETURNING *
    `, [partner_response, id, partnerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Respond to feedback error:', error);
    res.status(500).json({ error: 'Failed to respond to feedback' });
  }
};

export const reportFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const partnerId = req.user.id;
    const { reason } = req.body;

    const result = await query(`
      UPDATE partner_feedbacks
      SET is_reported = true,
          reported_reason = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND partner_id = $3
      RETURNING *
    `, [reason, id, partnerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ message: 'Feedback reported successfully' });
  } catch (error) {
    console.error('Report feedback error:', error);
    res.status(500).json({ error: 'Failed to report feedback' });
  }
};

// ============================================================================
// OFFERS
// ============================================================================

export const getPartnerOffers = async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM offers
      WHERE is_active = true
      AND (applicable_to = 'partners' OR applicable_to = 'both')
      AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get partner offers error:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
};

// ============================================================================
// EVENTS
// ============================================================================

export const getPartnerEvents = async (req, res) => {
  try {
    const partnerId = req.user.id;

    // Get events with invites for this partner
    const result = await query(`
      SELECT e.*, ei.status as invite_status, ei.responded_at
      FROM events e
      LEFT JOIN event_invites ei ON e.id = ei.event_id AND ei.user_id = $1
      WHERE e.is_active = true
      AND (ei.user_id IS NOT NULL OR e.event_date > CURRENT_TIMESTAMP)
      ORDER BY e.event_date DESC
    `, [partnerId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get partner events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const respondToEventInvite = async (req, res) => {
  try {
    const { eventId } = req.params;
    const partnerId = req.user.id;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be accepted or rejected' });
    }

    const result = await query(`
      UPDATE event_invites
      SET status = $1, responded_at = CURRENT_TIMESTAMP
      WHERE event_id = $2 AND user_id = $3
      RETURNING *
    `, [status, eventId, partnerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event invite not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Respond to event invite error:', error);
    res.status(500).json({ error: 'Failed to respond to event invite' });
  }
};

// ============================================================================
// NOTES (Visible to Partners)
// ============================================================================

export const getPartnerNotes = async (req, res) => {
  try {
    const result = await query(`
      SELECT an.*, u.name as created_by_name
      FROM admin_notes an
      LEFT JOIN users u ON an.created_by = u.id
      WHERE an.visible_to_partners = true
      ORDER BY an.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get partner notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// ============================================================================
// GALLERY (Aggregate from works)
// ============================================================================

export const getPartnerGallery = async (req, res) => {
  try {
    const partnerId = req.user.id;

    const result = await query(`
      SELECT id, title, images, videos, category, created_at
      FROM partner_works
      WHERE partner_id = $1 AND is_active = true
      AND (array_length(images, 1) > 0 OR array_length(videos, 1) > 0)
      ORDER BY created_at DESC
    `, [partnerId]);

    // Flatten and format gallery items
    const gallery = [];
    result.rows.forEach(work => {
      if (work.images && work.images.length > 0) {
        work.images.forEach((url, index) => {
          gallery.push({
            id: `${work.id}-img-${index}`,
            workId: work.id,
            type: 'image',
            url,
            title: work.title,
            category: work.category,
            createdAt: work.created_at
          });
        });
      }
      if (work.videos && work.videos.length > 0) {
        work.videos.forEach((url, index) => {
          gallery.push({
            id: `${work.id}-vid-${index}`,
            workId: work.id,
            type: 'video',
            url,
            title: work.title,
            category: work.category,
            createdAt: work.created_at
          });
        });
      }
    });

    res.json(gallery);
  } catch (error) {
    console.error('Get partner gallery error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};

// ============================================================================
// BILLING / TRANSACTIONS
// ============================================================================

export const getPartnerTransactions = async (req, res) => {
  try {
    const partnerId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const countResult = await query(
      'SELECT COUNT(*) FROM transactions WHERE user_id = $1',
      [partnerId]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await query(`
      SELECT * FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [partnerId, parseInt(limit), offset]);

    res.json({
      items: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get partner transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// ============================================================================
// ANALYTICS
// ============================================================================

export const getPartnerAnalytics = async (req, res) => {
  try {
    const partnerId = req.user.id;
    const { period = '30' } = req.query;
    const days = parseInt(period);

    // Enquiries over time
    const enquiriesOverTime = await query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM partner_enquiries
      WHERE partner_id = $1 AND created_at >= CURRENT_DATE - $2
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [partnerId, days]);

    // Feedbacks over time
    const feedbacksOverTime = await query(`
      SELECT DATE(created_at) as date, COUNT(*) as count, COALESCE(AVG(rating), 0) as avg_rating
      FROM partner_feedbacks
      WHERE partner_id = $1 AND created_at >= CURRENT_DATE - $2
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [partnerId, days]);

    // Works by category
    const worksByCategory = await query(`
      SELECT category, COUNT(*) as count
      FROM partner_works
      WHERE partner_id = $1 AND category IS NOT NULL
      GROUP BY category
    `, [partnerId]);

    // Rating distribution
    const ratingDistribution = await query(`
      SELECT rating, COUNT(*) as count
      FROM partner_feedbacks
      WHERE partner_id = $1
      GROUP BY rating
      ORDER BY rating
    `, [partnerId]);

    res.json({
      enquiriesOverTime: enquiriesOverTime.rows,
      feedbacksOverTime: feedbacksOverTime.rows,
      worksByCategory: worksByCategory.rows,
      ratingDistribution: ratingDistribution.rows
    });
  } catch (error) {
    console.error('Get partner analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
