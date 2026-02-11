/**
 * Profiles Controller
 *
 * Handles user profile management
 */

import { query } from '../config/database.js';
import { logger } from '../utils/logger.js';

/**
 * Get current user's profile
 * GET /api/profiles/me
 */
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with profile
    const result = await query(
      `SELECT
        u.id, u.name, u.email, u.phone, u.role, u.is_active, u.created_at,
        p.*
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }

    const userData = result.rows[0];

    // Create profile if doesn't exist
    if (!userData.user_id) {
      await query(
        'INSERT INTO profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING',
        [userId]
      );
    }

    res.json({
      success: true,
      data: {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          isActive: userData.is_active,
          createdAt: userData.created_at,
        },
        profile: {
          avatarUrl: userData.avatar_url,
          dateOfBirth: userData.date_of_birth,
          gender: userData.gender,
          addressLine1: userData.address_line1,
          addressLine2: userData.address_line2,
          city: userData.city,
          state: userData.state,
          pincode: userData.pincode,
          country: userData.country,
          latitude: userData.latitude,
          longitude: userData.longitude,
          locationName: userData.location_name,
          businessName: userData.business_name,
          businessType: userData.business_type,
          gstNumber: userData.gst_number,
          panNumber: userData.pan_number,
          alternatePhone: userData.alternate_phone,
          whatsappNumber: userData.whatsapp_number,
          websiteUrl: userData.website_url,
          facebookUrl: userData.facebook_url,
          instagramUrl: userData.instagram_url,
          linkedinUrl: userData.linkedin_url,
          referralCode: userData.referral_code,
          totalOrders: userData.total_orders,
          totalRevenue: userData.total_revenue,
          averageRating: userData.average_rating,
          totalReviews: userData.total_reviews,
          isEmailVerified: userData.is_email_verified,
          isPhoneVerified: userData.is_phone_verified,
          isBusinessVerified: userData.is_business_verified,
          notificationPreferences: userData.notification_preferences,
          languagePreference: userData.language_preference,
        },
      },
    });
  } catch (error) {
    logger.error('Get my profile error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch profile' },
    });
  }
};

/**
 * Update current user's profile
 * PATCH /api/profiles/me
 */
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      // Personal info
      avatar_url,
      date_of_birth,
      gender,
      // Address
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
      // Location
      latitude,
      longitude,
      location_name,
      // Business
      business_name,
      business_type,
      gst_number,
      pan_number,
      // Contact
      alternate_phone,
      whatsapp_number,
      website_url,
      // Social
      facebook_url,
      instagram_url,
      linkedin_url,
      // Settings
      notification_preferences,
      language_preference,
    } = req.body;

    // Ensure profile exists
    await query(
      'INSERT INTO profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING',
      [userId]
    );

    // Build update query dynamically
    const updates = [];
    const params = [];
    let paramIndex = 1;

    const addUpdate = (field, value) => {
      if (value !== undefined) {
        updates.push(`${field} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    };

    addUpdate('avatar_url', avatar_url);
    addUpdate('date_of_birth', date_of_birth);
    addUpdate('gender', gender);
    addUpdate('address_line1', address_line1);
    addUpdate('address_line2', address_line2);
    addUpdate('city', city);
    addUpdate('state', state);
    addUpdate('pincode', pincode);
    addUpdate('country', country);
    addUpdate('latitude', latitude);
    addUpdate('longitude', longitude);
    addUpdate('location_name', location_name);
    addUpdate('business_name', business_name);
    addUpdate('business_type', business_type);
    addUpdate('gst_number', gst_number);
    addUpdate('pan_number', pan_number);
    addUpdate('alternate_phone', alternate_phone);
    addUpdate('whatsapp_number', whatsapp_number);
    addUpdate('website_url', website_url);
    addUpdate('facebook_url', facebook_url);
    addUpdate('instagram_url', instagram_url);
    addUpdate('linkedin_url', linkedin_url);

    if (notification_preferences) {
      updates.push(`notification_preferences = $${paramIndex}`);
      params.push(JSON.stringify(notification_preferences));
      paramIndex++;
    }

    addUpdate('language_preference', language_preference);

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'No updates provided' },
      });
    }

    params.push(userId);

    const result = await query(
      `UPDATE profiles SET ${updates.join(', ')} WHERE user_id = $${paramIndex} RETURNING *`,
      params
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Profile updated successfully',
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to update profile' },
    });
  }
};

/**
 * Get public profile (dealer/partner)
 * GET /api/profiles/:id
 */
const getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT
        u.id, u.name, u.role, u.is_active, u.created_at,
        p.avatar_url, p.business_name, p.business_type, p.location_name,
        p.latitude, p.longitude, p.average_rating, p.total_reviews,
        p.total_orders, p.is_business_verified, p.website_url,
        p.facebook_url, p.instagram_url, p.linkedin_url
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = $1 AND u.role IN ('DEALER', 'PARTNER') AND u.is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Profile not found' },
      });
    }

    const data = result.rows[0];

    res.json({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        role: data.role,
        avatarUrl: data.avatar_url,
        businessName: data.business_name,
        businessType: data.business_type,
        locationName: data.location_name,
        latitude: data.latitude,
        longitude: data.longitude,
        averageRating: data.average_rating || 0,
        totalReviews: data.total_reviews || 0,
        isVerified: data.is_business_verified,
        socialLinks: {
          website: data.website_url,
          facebook: data.facebook_url,
          instagram: data.instagram_url,
          linkedin: data.linkedin_url,
        },
        memberSince: data.created_at,
      },
    });
  } catch (error) {
    logger.error('Get public profile error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch profile' },
    });
  }
};

/**
 * Get dealers list
 * GET /api/profiles/dealers
 */
const getDealers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      city,
      state,
      latitude,
      longitude,
      radius = 50, // km
      min_rating,
      is_verified,
      sort_by = 'rating',
      sort_order = 'desc',
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = `WHERE u.role = 'DEALER' AND u.is_active = true`;
    const params = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (u.name ILIKE $${paramIndex} OR p.business_name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (city) {
      whereClause += ` AND p.city = $${paramIndex}`;
      params.push(city);
      paramIndex++;
    }

    if (state) {
      whereClause += ` AND p.state = $${paramIndex}`;
      params.push(state);
      paramIndex++;
    }

    if (min_rating) {
      whereClause += ` AND p.average_rating >= $${paramIndex}`;
      params.push(min_rating);
      paramIndex++;
    }

    if (is_verified === 'true') {
      whereClause += ` AND p.is_business_verified = true`;
    }

    // Distance calculation if coordinates provided
    let distanceSelect = '';
    let distanceOrder = '';
    if (latitude && longitude) {
      distanceSelect = `,
        (6371 * acos(cos(radians($${paramIndex})) * cos(radians(p.latitude))
        * cos(radians(p.longitude) - radians($${paramIndex + 1}))
        + sin(radians($${paramIndex})) * sin(radians(p.latitude)))) AS distance`;
      params.push(latitude, longitude);

      if (radius) {
        whereClause += ` AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL`;
        // Note: We filter by radius in HAVING clause due to distance calculation
      }

      if (sort_by === 'distance') {
        distanceOrder = 'distance';
      }
      paramIndex += 2;
    }

    // Determine sort column
    let orderBy = 'p.average_rating DESC NULLS LAST';
    if (sort_by === 'name') {
      orderBy = `u.name ${sort_order.toUpperCase()}`;
    } else if (sort_by === 'reviews') {
      orderBy = `p.total_reviews ${sort_order.toUpperCase()} NULLS LAST`;
    } else if (distanceOrder) {
      orderBy = `distance ${sort_order.toUpperCase()}`;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       ${whereClause}`,
      params.slice(0, paramIndex - (latitude && longitude ? 2 : 0))
    );
    const total = parseInt(countResult.rows[0].count);

    // Get dealers
    params.push(limit, offset);
    const dealersResult = await query(
      `SELECT
        u.id, u.name, u.created_at,
        p.avatar_url, p.business_name, p.location_name, p.city, p.state,
        p.latitude, p.longitude, p.average_rating, p.total_reviews,
        p.is_business_verified,
        (SELECT COUNT(*) FROM dealer_products dp WHERE dp.dealer_id = u.id AND dp.status = 'active') as active_products
        ${distanceSelect}
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    res.json({
      success: true,
      data: {
        items: dealersResult.rows.map(d => ({
          id: d.id,
          name: d.name,
          avatarUrl: d.avatar_url,
          businessName: d.business_name,
          locationName: d.location_name,
          city: d.city,
          state: d.state,
          latitude: d.latitude,
          longitude: d.longitude,
          averageRating: d.average_rating || 0,
          totalReviews: d.total_reviews || 0,
          activeProducts: d.active_products || 0,
          isVerified: d.is_business_verified,
          distance: d.distance ? Math.round(d.distance * 10) / 10 : null,
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    logger.error('Get dealers error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch dealers' },
    });
  }
};

/**
 * Get partners list
 * GET /api/profiles/partners
 */
const getPartners = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      city,
      state,
      latitude,
      longitude,
      radius = 50,
      min_rating,
      is_verified,
      specialization,
      sort_by = 'rating',
      sort_order = 'desc',
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = `WHERE u.role = 'PARTNER' AND u.is_active = true`;
    const params = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (u.name ILIKE $${paramIndex} OR p.business_name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (city) {
      whereClause += ` AND p.city = $${paramIndex}`;
      params.push(city);
      paramIndex++;
    }

    if (state) {
      whereClause += ` AND p.state = $${paramIndex}`;
      params.push(state);
      paramIndex++;
    }

    if (min_rating) {
      whereClause += ` AND p.average_rating >= $${paramIndex}`;
      params.push(min_rating);
      paramIndex++;
    }

    if (is_verified === 'true') {
      whereClause += ` AND p.is_business_verified = true`;
    }

    // Distance calculation
    let distanceSelect = '';
    if (latitude && longitude) {
      distanceSelect = `,
        (6371 * acos(cos(radians($${paramIndex})) * cos(radians(p.latitude))
        * cos(radians(p.longitude) - radians($${paramIndex + 1}))
        + sin(radians($${paramIndex})) * sin(radians(p.latitude)))) AS distance`;
      params.push(latitude, longitude);
      paramIndex += 2;
    }

    // Determine sort
    let orderBy = 'p.average_rating DESC NULLS LAST';
    if (sort_by === 'name') {
      orderBy = `u.name ${sort_order.toUpperCase()}`;
    } else if (sort_by === 'reviews') {
      orderBy = `p.total_reviews ${sort_order.toUpperCase()} NULLS LAST`;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       ${whereClause}`,
      params.slice(0, paramIndex - (latitude && longitude ? 2 : 0))
    );
    const total = parseInt(countResult.rows[0].count);

    // Get partners
    params.push(limit, offset);
    const partnersResult = await query(
      `SELECT
        u.id, u.name, u.created_at,
        p.avatar_url, p.business_name, p.business_type, p.location_name, p.city, p.state,
        p.latitude, p.longitude, p.average_rating, p.total_reviews,
        p.is_business_verified,
        (SELECT COUNT(*) FROM partner_works pw WHERE pw.partner_id = u.id AND pw.is_active = true) as total_works
        ${distanceSelect}
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    res.json({
      success: true,
      data: {
        items: partnersResult.rows.map(p => ({
          id: p.id,
          name: p.name,
          avatarUrl: p.avatar_url,
          businessName: p.business_name,
          businessType: p.business_type,
          locationName: p.location_name,
          city: p.city,
          state: p.state,
          latitude: p.latitude,
          longitude: p.longitude,
          averageRating: p.average_rating || 0,
          totalReviews: p.total_reviews || 0,
          totalWorks: p.total_works || 0,
          isVerified: p.is_business_verified,
          distance: p.distance ? Math.round(p.distance * 10) / 10 : null,
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    logger.error('Get partners error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch partners' },
    });
  }
};

export {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
  getDealers,
  getPartners,
};
