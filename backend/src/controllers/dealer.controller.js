/**
 * Dealer Controller
 * 
 * Handles Dealer-specific API requests
 */

import { query } from '../config/database.js';

// Simple logger
const logger = {
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
  },
};

// Master Products
export const getMasterProducts = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM master_products WHERE is_active = true ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching master products:', error);
    res.status(500).json({ error: 'Failed to fetch master products' });
  }
};

// Dealer Products
export const getDealerProducts = async (req, res) => {
  try {
    const { dealerId } = req.params;
    const result = await query(
      'SELECT * FROM dealer_products WHERE dealer_id = $1 ORDER BY created_at DESC',
      [dealerId]
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching dealer products:', error);
    res.status(500).json({ error: 'Failed to fetch dealer products' });
  }
};

export const addDealerProduct = async (req, res) => {
  try {
    const { dealerId, productId, price, unit, status } = req.body;

    // Get master product details
    const masterProduct = await query(
      'SELECT name, category FROM master_products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (masterProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Master product not found or inactive' });
    }

    const { name: productName } = masterProduct.rows[0];

    const result = await query(
      `INSERT INTO dealer_products (dealer_id, product_id, product_name, price, unit, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [dealerId, productId, productName, price || null, unit || null, status || 'active']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Product already exists in your catalogue' });
    }
    logger.error('Error adding dealer product:', error);
    res.status(500).json({ error: 'Failed to add dealer product' });
  }
};

export const updateDealerProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { price, unit, status } = req.body;
    const dealerId = req.user.id; // From auth middleware

    const result = await query(
      `UPDATE dealer_products
       SET price = COALESCE($1, price),
           unit = COALESCE($2, unit),
           status = COALESCE($3, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND dealer_id = $5
       RETURNING *`,
      [price, unit, status, productId, dealerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating dealer product:', error);
    res.status(500).json({ error: 'Failed to update dealer product' });
  }
};

export const deleteDealerProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const dealerId = req.user.id;

    const result = await query(
      'DELETE FROM dealer_products WHERE id = $1 AND dealer_id = $2 RETURNING id',
      [productId, dealerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error('Error deleting dealer product:', error);
    res.status(500).json({ error: 'Failed to delete dealer product' });
  }
};

// Enquiries
export const getDealerEnquiries = async (req, res) => {
  try {
    const { dealerId } = req.params;
    const { status } = req.query;

    let sql = 'SELECT * FROM dealer_enquiries WHERE dealer_id = $1';
    const params = [dealerId];

    if (status && status !== 'all') {
      sql += ' AND status = $2';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching dealer enquiries:', error);
    res.status(500).json({ error: 'Failed to fetch dealer enquiries' });
  }
};

export const getDealerEnquiryById = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const dealerId = req.user.id;

    const result = await query(
      'SELECT * FROM dealer_enquiries WHERE id = $1 AND dealer_id = $2',
      [enquiryId, dealerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching dealer enquiry:', error);
    res.status(500).json({ error: 'Failed to fetch dealer enquiry' });
  }
};

export const respondToEnquiry = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const { response } = req.body;
    const dealerId = req.user.id;

    const result = await query(
      `UPDATE dealer_enquiries
       SET response = $1,
           status = 'responded',
           responded_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND dealer_id = $3
       RETURNING *`,
      [response, enquiryId, dealerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error responding to enquiry:', error);
    res.status(500).json({ error: 'Failed to respond to enquiry' });
  }
};

export const sendEnquiryToAdmin = async (req, res) => {
  try {
    const { topic, message } = req.body;
    const dealerId = req.user.id; // Get from authenticated user

    // In production, this would create an enquiry with admin as recipient
    // For now, we'll log it or store in a separate admin_enquiries table
    const result = await query(
      `INSERT INTO dealer_enquiries (dealer_id, user_id, topic, message, status)
       VALUES ($1, $1, $2, $3, 'new')
       RETURNING *`,
      [dealerId, topic, message]
    );

    res.status(201).json({ message: 'Enquiry sent to admin', enquiry: result.rows[0] });
  } catch (error) {
    logger.error('Error sending enquiry to admin:', error);
    res.status(500).json({ error: 'Failed to send enquiry to admin' });
  }
};

// Feedbacks
export const getDealerFeedbacks = async (req, res) => {
  try {
    const { dealerId } = req.params;

    const result = await query(
      'SELECT * FROM dealer_feedbacks WHERE dealer_id = $1 ORDER BY created_at DESC',
      [dealerId]
    );

    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching dealer feedbacks:', error);
    res.status(500).json({ error: 'Failed to fetch dealer feedbacks' });
  }
};

export const reportFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { reason } = req.body;
    const dealerId = req.user.id;

    const result = await query(
      `UPDATE dealer_feedbacks
       SET is_reported = true,
           reported_reason = $1
       WHERE id = $2 AND dealer_id = $3
       RETURNING *`,
      [reason, feedbackId, dealerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ message: 'Feedback reported successfully', feedback: result.rows[0] });
  } catch (error) {
    logger.error('Error reporting feedback:', error);
    res.status(500).json({ error: 'Failed to report feedback' });
  }
};

// Offers
export const getDealerOffers = async (req, res) => {
  try {
    const { dealerId } = req.params;

    const result = await query(
      'SELECT * FROM dealer_offers WHERE dealer_id = $1',
      [dealerId]
    );

    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching dealer offers:', error);
    res.status(500).json({ error: 'Failed to fetch dealer offers' });
  }
};

export const likeOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const dealerId = req.user.id; // Get from authenticated user

    // Check if offer already exists
    const existing = await query(
      'SELECT * FROM dealer_offers WHERE dealer_id = $1 AND offer_id = $2',
      [dealerId, offerId]
    );

    let result;
    if (existing.rows.length > 0) {
      // Toggle like status
      const currentLikeStatus = existing.rows[0].is_liked;
      result = await query(
        `UPDATE dealer_offers
         SET is_liked = $1,
             liked_at = CASE WHEN $1 THEN CURRENT_TIMESTAMP ELSE NULL END
         WHERE dealer_id = $2 AND offer_id = $3
         RETURNING *`,
        [!currentLikeStatus, dealerId, offerId]
      );
    } else {
      // Create new like
      result = await query(
        `INSERT INTO dealer_offers (dealer_id, offer_id, is_liked, liked_at)
         VALUES ($1, $2, true, CURRENT_TIMESTAMP)
         RETURNING *`,
        [dealerId, offerId]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Offer already liked' });
    }
    logger.error('Error liking offer:', error);
    res.status(500).json({ error: 'Failed to like offer' });
  }
};

// Statistics
export const getDealerStats = async (req, res) => {
  try {
    const { dealerId } = req.params;

    // Get products stats
    const productsResult = await query(
      `SELECT 
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE status = 'active') as active
       FROM dealer_products
       WHERE dealer_id = $1`,
      [dealerId]
    );

    // Get enquiries stats
    const enquiriesResult = await query(
      `SELECT 
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE status = 'new') as new_count,
         COUNT(*) FILTER (WHERE status = 'responded') as responded_count
       FROM dealer_enquiries
       WHERE dealer_id = $1`,
      [dealerId]
    );

    // Get unique customers
    const customersResult = await query(
      `SELECT COUNT(DISTINCT user_id) as count
       FROM dealer_enquiries
       WHERE dealer_id = $1`,
      [dealerId]
    );

    // Get feedbacks stats
    const feedbacksResult = await query(
      `SELECT 
         COUNT(*) as total,
         COALESCE(AVG(rating), 0) as avg_rating
       FROM dealer_feedbacks
       WHERE dealer_id = $1`,
      [dealerId]
    );

    // Get offers stats
    const offersResult = await query(
      `SELECT 
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE is_liked = true) as liked_count
       FROM dealer_offers
       WHERE dealer_id = $1`,
      [dealerId]
    );

    const stats = {
      totalProducts: parseInt(productsResult.rows[0].total) || 0,
      activeProducts: parseInt(productsResult.rows[0].active) || 0,
      totalEnquiries: parseInt(enquiriesResult.rows[0].total) || 0,
      newEnquiries: parseInt(enquiriesResult.rows[0].new_count) || 0,
      respondedEnquiries: parseInt(enquiriesResult.rows[0].responded_count) || 0,
      customersContacted: parseInt(customersResult.rows[0].count) || 0,
      totalFeedbacks: parseInt(feedbacksResult.rows[0].total) || 0,
      averageRating: parseFloat(feedbacksResult.rows[0].avg_rating) || 0,
      totalOffers: parseInt(offersResult.rows[0].total) || 0,
      likedOffers: parseInt(offersResult.rows[0].liked_count) || 0,
    };

    res.json(stats);
  } catch (error) {
    logger.error('Error fetching dealer stats:', error);
    res.status(500).json({ error: 'Failed to fetch dealer stats' });
  }
};

