import { query } from '../config/database.js';
import { getConverterCategories, convert } from '../services/converter.service.js';

const logger = {
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
  },
};

// ========================================
// CHECKLISTS
// ========================================

/**
 * Get checklists by category (optional filter)
 * Returns checklists in format expected by mobile app
 */
export const getChecklists = async (req, res) => {
  try {
    const { category } = req.query;
    
    let sql = 'SELECT * FROM checklists WHERE is_active = true';
    const params = [];
    
    if (category) {
      params.push(category);
      sql += ` AND category = $1`;
    }
    
    sql += ' ORDER BY category, title ASC';
    
    const result = await query(sql, params);
    
    // Map database schema to mobile app format
    const checklists = result.rows.map(row => {
      // Parse JSONB items array, ensure it's an array
      let items = [];
      if (row.items) {
        if (typeof row.items === 'string') {
          try {
            items = JSON.parse(row.items);
          } catch (e) {
            logger.error('Error parsing checklist items JSON', e);
            items = [];
          }
        } else if (Array.isArray(row.items)) {
          items = row.items;
        }
      }
      
      // Ensure each item has required fields
      items = items.map((item, idx) => ({
        id: item.id || `${row.id}-${idx}`,
        text: item.text || item.name || item.label || '',
        checked: item.checked || false,
      }));
      
      return {
        id: row.id,
        title: row.title,
        category: row.category,
        items,
      };
    });
    
    res.json({ checklists });
  } catch (error) {
    logger.error('Error fetching checklists:', error);
    res.status(500).json({ error: 'Failed to fetch checklists' });
  }
};

// ========================================
// VISUALIZATION REQUESTS
// ========================================

/**
 * Get user's visualization requests
 */
export const getVisualizationRequests = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const result = await query(
      'SELECT * FROM visualization_requests WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    const requests = result.rows.map(row => ({
      id: row.id,
      type: row.request_type || '3D',
      description: row.description || '',
      status: row.status || 'pending',
      createdAt: row.created_at,
      completedAt: row.response_video ? row.updated_at : null,
    }));
    
    res.json({ requests });
  } catch (error) {
    logger.error('Error fetching visualization requests:', error);
    res.status(500).json({ error: 'Failed to fetch visualization requests' });
  }
};

/**
 * Submit a visualization request
 */
export const submitVisualizationRequest = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { type, description } = req.body;
    
    if (!type || !description) {
      return res.status(400).json({ error: 'Type and description are required' });
    }
    
    const result = await query(
      'INSERT INTO visualization_requests (user_id, request_type, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, type, description, 'pending']
    );
    
    const request = result.rows[0];
    res.status(201).json({
      request: {
        id: request.id,
        type: request.request_type,
        description: request.description,
        status: request.status,
        createdAt: request.created_at,
      },
    });
  } catch (error) {
    logger.error('Error submitting visualization request:', error);
    res.status(500).json({ error: 'Failed to submit visualization request' });
  }
};

// ========================================
// VIDEOS
// ========================================

/**
 * Get videos by category (optional filter)
 */
export const getVideos = async (req, res) => {
  try {
    const { category } = req.query;
    
    let sql = 'SELECT * FROM videos WHERE is_active = true';
    const params = [];
    
    if (category) {
      params.push(category);
      sql += ` AND category = $1`;
    }
    
    sql += ' ORDER BY category, title ASC';
    
    const result = await query(sql, params);
    
    const videos = result.rows.map(row => ({
      id: row.id,
      title: row.title || '',
      category: row.category || '',
      youtubeId: row.youtube_id || row.video_link || '',
      thumbnail: row.thumbnail || null,
      description: row.description || null,
    }));
    
    res.json({ videos });
  } catch (error) {
    logger.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

// ========================================
// UNIT CONVERTERS
// ========================================

/**
 * Get unit converter categories and units
 */
export const getUnitConverters = async (req, res) => {
  try {
    const categories = getConverterCategories();
    res.json({ categories });
  } catch (error) {
    logger.error('Error fetching converters:', error);
    res.status(500).json({ error: 'Failed to fetch converters' });
  }
};

/**
 * Convert a value between units
 * Body: { category, fromUnit, toUnit, value }
 */
export const convertUnit = async (req, res) => {
  try {
    const { category, fromUnit, toUnit, value } = req.body;

    if (!category || !fromUnit || !toUnit || value === undefined) {
      return res.status(400).json({
        error: 'category, fromUnit, toUnit, and value are required',
      });
    }

    const { result, formula } = convert(category, fromUnit, toUnit, parseFloat(value));
    res.json({ result, formula });
  } catch (error) {
    logger.error('Error converting unit:', error);
    if (error.message?.includes('Unknown')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to convert unit' });
  }
};

// ========================================
// VAASTU PARTNERS
// ========================================

/**
 * Get Vaastu partners
 */
export const getVaastuPartners = async (req, res) => {
  try {
    // For now, return empty array - vaastu partners table might not exist yet
    // This can be expanded when vaastu partners feature is implemented
    res.json({ partners: [] });
  } catch (error) {
    logger.error('Error fetching Vaastu partners:', error);
    res.status(500).json({ error: 'Failed to fetch Vaastu partners' });
  }
};

