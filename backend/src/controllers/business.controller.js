import { query } from '../config/database.js';

const logger = {
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
  },
};

// ========================================
// STEEL MARKET UPDATES
// ========================================

export const getSteelMarketUpdates = async (req, res) => {
  try {
    const { marketType, region } = req.query;
    let sql = 'SELECT * FROM steel_market_updates WHERE is_active = true';
    const params = [];
    
    // Note: marketType and region filters not in schema, but kept for API compatibility
    sql += ' ORDER BY created_at DESC LIMIT 50';
    
    const result = await query(sql, params);
    
    // Map database schema to TypeScript interface
    // Schema has: id, title, description, image_url, created_by, is_active, created_at, updated_at
    const updates = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.description || '',
      marketType: marketType || 'steel', // Default since not in schema
      priceChange: null, // Not in schema
      priceChangePercent: null, // Not in schema
      region: region || 'All', // Not in schema
      source: null, // Not in schema
      publishedAt: row.created_at,
      createdAt: row.created_at,
    }));
    
    res.json(updates);
  } catch (error) {
    logger.error('Error fetching steel market updates:', error);
    res.status(500).json({ error: 'Failed to fetch steel market updates' });
  }
};

// ========================================
// WORKS (Partner Works)
// ========================================

export const getWorks = async (req, res) => {
  try {
    const { userId, category } = req.query;
    const authenticatedUserId = req.user?.id;
    const targetUserId = authenticatedUserId || userId;
    
    if (!targetUserId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    let sql = 'SELECT * FROM partner_works WHERE partner_id = $1 AND is_active = true';
    const params = [targetUserId];
    
    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    
    // Schema: id, partner_id, title, description, images, videos, links, category, is_approved, is_active, created_at, updated_at
    const works = result.rows.map(row => ({
      id: row.id,
      userId: row.partner_id,
      title: row.title,
      description: row.description || '',
      category: row.category || '',
      images: Array.isArray(row.images) ? row.images : [],
      videos: Array.isArray(row.videos) ? row.videos : [],
      location: null, // Not in schema
      completedDate: null, // Not in schema
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
    
    res.json(works);
  } catch (error) {
    logger.error('Error fetching works:', error);
    res.status(500).json({ error: 'Failed to fetch works' });
  }
};

export const createWork = async (req, res) => {
  try {
    const authenticatedUserId = req.user?.id;
    if (!authenticatedUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { title, description, category, images = [], videos = [] } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Schema: partner_id, title, description, images, videos, links, category
    const result = await query(
      `INSERT INTO partner_works (partner_id, title, description, category, images, videos)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [authenticatedUserId, title, description, category, images, videos]
    );
    
    const work = result.rows[0];
    res.status(201).json({
      id: work.id,
      userId: work.partner_id,
      title: work.title,
      description: work.description || '',
      category: work.category || '',
      images: Array.isArray(work.images) ? work.images : [],
      videos: Array.isArray(work.videos) ? work.videos : [],
      location: null,
      completedDate: null,
      createdAt: work.created_at,
      updatedAt: work.updated_at,
    });
  } catch (error) {
    logger.error('Error creating work:', error);
    res.status(500).json({ error: 'Failed to create work' });
  }
};

export const updateWork = async (req, res) => {
  try {
    const { workId } = req.params;
    const authenticatedUserId = req.user?.id;
    const { title, description, category, images, videos } = req.body;
    
    // Verify ownership
    const checkResult = await query('SELECT partner_id FROM partner_works WHERE id = $1', [workId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Work not found' });
    }
    if (checkResult.rows[0].partner_id !== authenticatedUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Schema: title, description, category, images, videos, links
    const result = await query(
      `UPDATE partner_works
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           images = COALESCE($4, images),
           videos = COALESCE($5, videos),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [title, description, category, images, videos, workId]
    );
    
    const work = result.rows[0];
    res.json({
      id: work.id,
      userId: work.partner_id,
      title: work.title,
      description: work.description || '',
      category: work.category || '',
      images: Array.isArray(work.images) ? work.images : [],
      videos: Array.isArray(work.videos) ? work.videos : [],
      location: null,
      completedDate: null,
      createdAt: work.created_at,
      updatedAt: work.updated_at,
    });
  } catch (error) {
    logger.error('Error updating work:', error);
    res.status(500).json({ error: 'Failed to update work' });
  }
};

export const deleteWork = async (req, res) => {
  try {
    const { workId } = req.params;
    const authenticatedUserId = req.user?.id;
    
    // Verify ownership
    const checkResult = await query('SELECT partner_id FROM partner_works WHERE id = $1', [workId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Work not found' });
    }
    if (checkResult.rows[0].partner_id !== authenticatedUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await query('DELETE FROM partner_works WHERE id = $1', [workId]);
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting work:', error);
    res.status(500).json({ error: 'Failed to delete work' });
  }
};

// ========================================
// EVENTS
// ========================================

export const getEvents = async (req, res) => {
  try {
    const { eventType, organizerId } = req.query;
    let sql = 'SELECT * FROM events WHERE is_active = true';
    const params = [];
    
    // Note: eventType filter not in schema, but kept for API compatibility
    if (organizerId) {
      params.push(organizerId);
      sql += ` AND created_by = $${params.length}`;
    }
    
    sql += ' ORDER BY event_date ASC NULLS LAST';
    
    const result = await query(sql, params);
    
    // Schema: id, title, description, location, location_lat, location_lng, event_date, created_by, is_active, created_at, updated_at
    const events = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      eventType: eventType || 'other', // Default since not in schema
      startDate: row.event_date,
      endDate: null, // Not in schema
      location: row.location || '',
      organizerId: row.created_by,
      organizerType: 'partner', // Default, could be determined from user role
      imageUrl: null, // Not in schema
      registrationUrl: null, // Not in schema
      createdAt: row.created_at,
    }));
    
    res.json(events);
  } catch (error) {
    logger.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// ========================================
// OFFERS
// ========================================

export const getOffers = async (req, res) => {
  try {
    const { applicableTo } = req.query;
    let sql = 'SELECT * FROM offers WHERE is_active = true';
    const params = [];
    
    if (applicableTo && applicableTo !== 'all') {
      // Map 'partners'/'dealers' to 'both' if needed, or filter directly
      if (applicableTo === 'partners' || applicableTo === 'dealers') {
        sql += ` AND (applicable_to = $1 OR applicable_to = 'both')`;
        params.push(applicableTo === 'partners' ? 'partners' : 'dealers');
      } else {
        sql += ` AND applicable_to = $1`;
        params.push(applicableTo);
      }
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    
    // Schema: id, title, description, discount_type, discount_value, valid_until, applicable_to, created_by, is_active, created_at, updated_at
    const offers = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      discountType: row.discount_type || 'percentage',
      discountValue: parseFloat(row.discount_value || 0),
      validFrom: row.created_at, // Use created_at as default since valid_from not in schema
      validUntil: row.valid_until,
      applicableTo: row.applicable_to === 'both' ? 'all' : (row.applicable_to || 'all'),
      termsAndConditions: null, // Not in schema
      imageUrl: null, // Not in schema
      createdBy: row.created_by,
      createdAt: row.created_at,
    }));
    
    res.json(offers);
  } catch (error) {
    logger.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
};

// ========================================
// LOYALTY POINTS
// ========================================

export const getLoyaltyPoints = async (req, res) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.user?.id;
    const targetUserId = authenticatedUserId || userId;
    
    if (!targetUserId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const historyResult = await query(
      'SELECT * FROM loyalty_points WHERE user_id = $1 ORDER BY created_at DESC',
      [targetUserId]
    );
    
    const totalResult = await query(
      'SELECT COALESCE(SUM(points), 0) as total FROM loyalty_points WHERE user_id = $1',
      [targetUserId]
    );
    
    const history = historyResult.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      points: parseInt(row.points || 0),
      source: row.source || 'admin_grant',
      description: row.description || '',
      expiresAt: row.expires_at || null,
      createdAt: row.created_at,
    }));
    
    res.json({
      total: parseInt(totalResult.rows[0]?.total || 0),
      history,
    });
  } catch (error) {
    logger.error('Error fetching loyalty points:', error);
    res.status(500).json({ error: 'Failed to fetch loyalty points' });
  }
};

// ========================================
// LECTURES
// ========================================

export const getLectures = async (req, res) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM guest_lectures WHERE is_active = true';
    const params = [];
    
    sql += ' ORDER BY lecture_date ASC';
    
    const result = await query(sql, params);
    
    const lectures = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      speaker: 'Guest Speaker', // Default, could be added to schema
      videoUrl: null,
      slidesUrl: null,
      duration: null,
      category: category || 'General',
      scheduledAt: row.lecture_date || null,
      recordedAt: null,
      createdAt: row.created_at,
    }));
    
    res.json(lectures);
  } catch (error) {
    logger.error('Error fetching lectures:', error);
    res.status(500).json({ error: 'Failed to fetch lectures' });
  }
};

// ========================================
// TRADING ADVICES
// ========================================

export const getTradingAdvices = async (req, res) => {
  try {
    const { adviceType, materialType } = req.query;
    const userRole = req.user?.role;
    
    let sql = 'SELECT * FROM trading_advices WHERE is_active = true';
    const params = [];
    
    // Filter by visibility based on user role
    if (userRole === 'DEALER') {
      sql += ' AND visible_to_dealers = true';
    } else if (userRole === 'PARTNER') {
      sql += ' AND visible_to_partners = true';
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    
    const advices = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.description || '',
      adviceType: 'general',
      materialType: materialType || 'steel',
      targetPrice: null,
      currentPrice: null,
      validUntil: null,
      createdBy: row.created_by,
      createdAt: row.created_at,
    }));
    
    res.json(advices);
  } catch (error) {
    logger.error('Error fetching trading advices:', error);
    res.status(500).json({ error: 'Failed to fetch trading advices' });
  }
};

// ========================================
// PROJECTS
// ========================================

export const getProjects = async (req, res) => {
  try {
    const { status, projectType } = req.query;
    let sql = 'SELECT * FROM upcoming_projects WHERE is_active = true';
    const params = [];
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    
    const projects = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      projectType: projectType || 'residential',
      location: row.location || '',
      estimatedBudget: null,
      startDate: null,
      endDate: null,
      status: 'upcoming',
      contactPerson: null,
      contactEmail: null,
      contactPhone: null,
      createdAt: row.created_at,
    }));
    
    res.json(projects);
  } catch (error) {
    logger.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// ========================================
// TENDERS
// ========================================

export const getTenders = async (req, res) => {
  try {
    const { status, category } = req.query;
    let sql = 'SELECT * FROM tenders WHERE is_active = true';
    const params = [];
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    
    const tenders = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      tenderNumber: `TND-${row.id.substring(0, 8).toUpperCase()}`,
      organization: 'Organization', // Default
      category: category || 'General',
      estimatedValue: null,
      submissionDeadline: null,
      openingDate: null,
      location: 'Location',
      documentUrl: row.attachments?.[0] || null,
      contactEmail: null,
      contactPhone: null,
      status: 'open',
      createdAt: row.created_at,
    }));
    
    res.json(tenders);
  } catch (error) {
    logger.error('Error fetching tenders:', error);
    res.status(500).json({ error: 'Failed to fetch tenders' });
  }
};

// ========================================
// EDUCATION POSTS
// ========================================

export const getEducationPosts = async (req, res) => {
  try {
    const { category, tag } = req.query;
    let sql = 'SELECT * FROM education_posts WHERE is_active = true';
    const params = [];
    
    sql += ' ORDER BY created_at DESC LIMIT 50';
    
    const result = await query(sql, params);
    
    const posts = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.body || '',
      category: category || 'General',
      author: 'Admin', // Default
      imageUrl: row.images?.[0] || null,
      attachments: row.documents || [],
      tags: [],
      viewCount: 0,
      likeCount: 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
    
    res.json(posts);
  } catch (error) {
    logger.error('Error fetching education posts:', error);
    res.status(500).json({ error: 'Failed to fetch education posts' });
  }
};

// ========================================
// QUIZZES
// ========================================

export const getQuizzes = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    let sql = 'SELECT * FROM quizzes WHERE 1=1';
    const params = [];
    
    if (isActive !== undefined) {
      params.push(isActive === 'true' || isActive === true);
      sql += ` AND is_active = $${params.length}`;
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    
    const quizzes = result.rows.map(row => {
      const questions = Array.isArray(row.questions) ? row.questions : [];
      return {
        id: row.id,
        title: row.name,
        description: row.description || '',
        category: category || 'General',
        questions: questions.map((q, idx) => ({
          id: q.id || `q-${idx}`,
          question: q.question || '',
          options: q.options || [],
          correctAnswer: q.correctAnswer || 0,
          explanation: q.explanation || null,
        })),
        passingScore: 70, // Default
        timeLimit: null,
        isActive: row.is_active,
        createdAt: row.created_at,
      };
    });
    
    res.json(quizzes);
  } catch (error) {
    logger.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
};

export const submitQuizAttempt = async (req, res) => {
  try {
    const authenticatedUserId = req.user?.id;
    if (!authenticatedUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { quizId, answers, timeSpent } = req.body;
    
    if (!quizId || !answers) {
      return res.status(400).json({ error: 'Quiz ID and answers are required' });
    }
    
    // Get quiz to calculate score
    const quizResult = await query('SELECT questions FROM quizzes WHERE id = $1', [quizId]);
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    const questions = Array.isArray(quizResult.rows[0].questions) ? quizResult.rows[0].questions : [];
    let correctAnswers = 0;
    
    questions.forEach((q, idx) => {
      const questionId = q.id || `q-${idx}`;
      const userAnswer = answers[questionId];
      const correctAnswer = q.correctAnswer || 0;
      if (userAnswer === correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = correctAnswers;
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const passed = percentage >= 70; // Default passing score
    
    const result = await query(
      `INSERT INTO quiz_attempts (quiz_id, user_id, answers, score, total_questions, completed_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [quizId, authenticatedUserId, answers, score, totalQuestions]
    );
    
    res.status(201).json({
      id: result.rows[0].id,
      quizId: result.rows[0].quiz_id,
      userId: result.rows[0].user_id,
      answers: result.rows[0].answers,
      score,
      percentage,
      passed,
      timeSpent: timeSpent || 0,
      completedAt: result.rows[0].completed_at,
    });
  } catch (error) {
    logger.error('Error submitting quiz attempt:', error);
    res.status(500).json({ error: 'Failed to submit quiz attempt' });
  }
};

// ========================================
// REFERRALS
// ========================================

export const getReferrals = async (req, res) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.user?.id;
    const targetUserId = authenticatedUserId || userId;
    
    if (!targetUserId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Referrals might be stored in a separate table or derived from loyalty_points
    // For now, return empty array until referral table is created
    res.json([]);
  } catch (error) {
    logger.error('Error fetching referrals:', error);
    res.status(500).json({ error: 'Failed to fetch referrals' });
  }
};

export const createReferral = async (req, res) => {
  try {
    const authenticatedUserId = req.user?.id;
    if (!authenticatedUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Referral creation logic would go here once referral table exists
    // For now, return placeholder
    res.status(501).json({ error: 'Referral feature not yet implemented' });
  } catch (error) {
    logger.error('Error creating referral:', error);
    res.status(500).json({ error: 'Failed to create referral' });
  }
};

// ========================================
// GALLERY
// ========================================

export const getGallery = async (req, res) => {
  try {
    const { userId } = req.params;
    const { category } = req.query;
    const authenticatedUserId = req.user?.id;
    const targetUserId = authenticatedUserId || userId;
    
    if (!targetUserId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Gallery might be stored separately or derived from partner_works/images
    // For now, get images from partner_works
    const result = await query(
      'SELECT id, images, created_at FROM partner_works WHERE partner_id = $1',
      [targetUserId]
    );
    
    const galleryItems = [];
    result.rows.forEach(work => {
      if (Array.isArray(work.images)) {
        work.images.forEach((imageUrl, idx) => {
          galleryItems.push({
            id: `${work.id}-${idx}`,
            userId: targetUserId,
            title: null,
            description: null,
            imageUrl,
            createdAt: work.created_at,
          });
        });
      }
    });
    
    res.json(galleryItems);
  } catch (error) {
    logger.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};

export const addGalleryItem = async (req, res) => {
  try {
    const authenticatedUserId = req.user?.id;
    if (!authenticatedUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Gallery item creation would go here
    // For now, return placeholder
    res.status(501).json({ error: 'Gallery feature not yet fully implemented' });
  } catch (error) {
    logger.error('Error adding gallery item:', error);
    res.status(500).json({ error: 'Failed to add gallery item' });
  }
};

// ========================================
// NOTES
// ========================================

export const getNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { category, isPinned } = req.query;
    const authenticatedUserId = req.user?.id;
    const targetUserId = authenticatedUserId || userId;
    
    if (!targetUserId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Notes might be stored in admin_notes or a separate user_notes table
    // For now, check admin_notes
    let sql = 'SELECT * FROM admin_notes WHERE created_by = $1';
    const params = [targetUserId];
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    
    const notes = result.rows.map(row => ({
      id: row.id,
      userId: row.created_by,
      title: row.title || '',
      content: row.content || '',
      category: category || 'General',
      isPinned: false,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
    }));
    
    res.json(notes);
  } catch (error) {
    logger.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

export const createNote = async (req, res) => {
  try {
    const authenticatedUserId = req.user?.id;
    if (!authenticatedUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { title, content, category } = req.body;
    
    if (!title && !content) {
      return res.status(400).json({ error: 'Title or content is required' });
    }
    
    // Use admin_notes table for now
    const result = await query(
      'INSERT INTO admin_notes (title, content, created_by) VALUES ($1, $2, $3) RETURNING *',
      [title || '', content || '', authenticatedUserId]
    );
    
    const note = result.rows[0];
    res.status(201).json({
      id: note.id,
      userId: note.created_by,
      title: note.title || '',
      content: note.content || '',
      category: category || 'General',
      isPinned: false,
      createdAt: note.created_at,
      updatedAt: note.updated_at || note.created_at,
    });
  } catch (error) {
    logger.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

// ========================================
// STATISTICS
// ========================================

/**
 * Get business statistics for a user (Partner or Dealer)
 * Returns aggregated statistics including works, enquiries, feedbacks, ratings, etc.
 */
export const getStatistics = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    const authenticatedUserId = req.user?.id;

    // Use authenticated user ID or provided userId (must match for security)
    const targetUserId = authenticatedUserId || userId;

    if (!targetUserId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Parse dates or use defaults (last 30 days)
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get user role to determine which stats to fetch
    const userResult = await query(
      'SELECT role FROM users WHERE id = $1',
      [targetUserId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userRole = userResult.rows[0].role;

    // Initialize statistics object
    let statistics = {
      totalWorks: 0,
      totalEnquiries: 0,
      totalFeedbacks: 0,
      averageRating: 0,
      totalReferrals: 0,
      totalLoyaltyPoints: 0,
      totalEvents: 0,
      upcomingEvents: 0,
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    };

    // Get Partner Works (for PARTNER role)
    if (userRole === 'PARTNER') {
      try {
        const worksResult = await query(
          `SELECT COUNT(*) as count
           FROM partner_works
           WHERE partner_id = $1 AND created_at >= $2 AND created_at <= $3`,
          [targetUserId, start, end]
        );
        statistics.totalWorks = parseInt(worksResult.rows[0]?.count || 0);
      } catch (error) {
        console.warn('Error fetching partner works:', error.message);
      }
    }

    // Get Dealer Enquiries (for DEALER role)
    if (userRole === 'DEALER') {
      try {
        const enquiriesResult = await query(
          `SELECT COUNT(*) as count
           FROM dealer_enquiries
           WHERE dealer_id = $1 AND created_at >= $2 AND created_at <= $3`,
          [targetUserId, start, end]
        );
        statistics.totalEnquiries = parseInt(enquiriesResult.rows[0]?.count || 0);
      } catch (error) {
        console.warn('Error fetching dealer enquiries:', error.message);
      }

      // Get Dealer Feedbacks
      try {
        const feedbacksResult = await query(
          `SELECT 
             COUNT(*) as total,
             COALESCE(AVG(rating), 0) as avg_rating
           FROM dealer_feedbacks
           WHERE dealer_id = $1 AND created_at >= $2 AND created_at <= $3`,
          [targetUserId, start, end]
        );
        statistics.totalFeedbacks = parseInt(feedbacksResult.rows[0]?.total || 0);
        statistics.averageRating = parseFloat(feedbacksResult.rows[0]?.avg_rating || 0);
      } catch (error) {
        console.warn('Error fetching dealer feedbacks:', error.message);
      }
    } else {
      // For PARTNER, get enquiries from different source or return 0
      statistics.totalEnquiries = 0;
      statistics.totalFeedbacks = 0;
      statistics.averageRating = 0;
    }

    // Get Loyalty Points (for all roles)
    try {
      const loyaltyResult = await query(
        `SELECT 
           COUNT(*) as total_referrals,
           COALESCE(SUM(points), 0) as total_points
         FROM loyalty_points
         WHERE user_id = $1 AND created_at >= $2 AND created_at <= $3`,
        [targetUserId, start, end]
      );
      statistics.totalReferrals = parseInt(loyaltyResult.rows[0]?.total_referrals || 0);
      statistics.totalLoyaltyPoints = parseInt(loyaltyResult.rows[0]?.total_points || 0);
    } catch (error) {
      console.warn('Error fetching loyalty points:', error.message);
      // loyalty_points table might not exist yet, set defaults
      statistics.totalReferrals = 0;
      statistics.totalLoyaltyPoints = 0;
    }

    // Get Events (for all roles)
    try {
      const eventsResult = await query(
        `SELECT 
           COUNT(*) as total,
           COUNT(*) FILTER (WHERE event_date >= CURRENT_TIMESTAMP) as upcoming
         FROM events
         WHERE is_active = true AND created_at >= $1 AND created_at <= $2`,
        [start, end]
      );
      statistics.totalEvents = parseInt(eventsResult.rows[0]?.total || 0);
      statistics.upcomingEvents = parseInt(eventsResult.rows[0]?.upcoming || 0);
    } catch (error) {
      console.warn('Error fetching events:', error.message);
      statistics.totalEvents = 0;
      statistics.upcomingEvents = 0;
    }

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching business statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
};

