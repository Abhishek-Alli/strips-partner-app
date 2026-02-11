/**
 * Admin Controller
 *
 * Complete CRUD operations for all Admin features
 */

import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

// ============================================================================
// DASHBOARD
// ============================================================================

export const getDashboardStats = async (req, res) => {
  try {
    // Get user counts by role
    const userCounts = await query(`
      SELECT
        COUNT(*) FILTER (WHERE role = 'GENERAL_USER') as general_users,
        COUNT(*) FILTER (WHERE role = 'DEALER') as dealers,
        COUNT(*) FILTER (WHERE role = 'PARTNER') as partners,
        COUNT(*) FILTER (WHERE role = 'ADMIN') as admins,
        COUNT(*) FILTER (WHERE is_active = true) as active_users,
        COUNT(*) as total_users
      FROM users
    `);

    // Get today's stats
    const todayStats = await query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURRENT_DATE) as new_users_today,
        (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE) as orders_today,
        (SELECT COALESCE(SUM(final_amount), 0) FROM orders WHERE DATE(created_at) = CURRENT_DATE AND status != 'cancelled') as revenue_today
    `);

    // Get pending items
    const pendingCounts = await query(`
      SELECT
        (SELECT COUNT(*) FROM dealership_applications WHERE status = 'pending') as pending_applications,
        (SELECT COUNT(*) FROM general_enquiries WHERE status = 'new') as pending_enquiries,
        (SELECT COUNT(*) FROM visualization_requests WHERE status = 'pending') as pending_visualizations
    `);

    // Recent users
    const recentUsers = await query(`
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Recent orders
    const recentOrders = await query(`
      SELECT o.id, o.order_number, o.final_amount, o.status, o.created_at, u.name as user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    const stats = userCounts.rows[0];
    const today = todayStats.rows[0];
    const pending = pendingCounts.rows[0];

    res.json({
      totalUsers: parseInt(stats.total_users) || 0,
      activeUsers: parseInt(stats.active_users) || 0,
      pendingActions: parseInt(pending.pending_applications) + parseInt(pending.pending_enquiries) || 0,
      systemHealth: 'Operational',
      usersByRole: {
        generalUsers: parseInt(stats.general_users) || 0,
        partners: parseInt(stats.partners) || 0,
        dealers: parseInt(stats.dealers) || 0,
        admins: parseInt(stats.admins) || 0
      },
      todayStats: {
        newUsers: parseInt(today.new_users_today) || 0,
        orders: parseInt(today.orders_today) || 0,
        revenue: parseFloat(today.revenue_today) || 0
      },
      pendingCounts: {
        applications: parseInt(pending.pending_applications) || 0,
        enquiries: parseInt(pending.pending_enquiries) || 0,
        visualizations: parseInt(pending.pending_visualizations) || 0
      },
      recentUsers: recentUsers.rows,
      recentOrders: recentOrders.rows
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '', status = '' } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let paramIndex = 0;

    let whereClause = 'WHERE 1=1';

    if (search) {
      paramIndex++;
      whereClause += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
    }

    if (role) {
      paramIndex++;
      whereClause += ` AND role = $${paramIndex}`;
      params.push(role);
    }

    if (status === 'active') {
      whereClause += ' AND is_active = true';
    } else if (status === 'inactive') {
      whereClause += ' AND is_active = false';
    }

    // Get total count
    const countResult = await query(`SELECT COUNT(*) FROM users ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    paramIndex++;
    params.push(parseInt(limit));
    paramIndex++;
    params.push(offset);

    const result = await query(`
      SELECT id, name, email, phone, role, is_active, created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex - 1} OFFSET $${paramIndex}
    `, params);

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
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT u.*, p.*
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'GENERAL_USER' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(`
      INSERT INTO users (name, email, phone, password_hash, role, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING id, name, email, phone, role, is_active, created_at
    `, [name, email, phone, passwordHash, role]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'User with this email or phone already exists' });
    }
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, is_active } = req.body;

    const result = await query(`
      UPDATE users
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          phone = COALESCE($3, phone),
          role = COALESCE($4, role),
          is_active = COALESCE($5, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING id, name, email, phone, role, is_active, created_at, updated_at
    `, [name, email, phone, role, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      UPDATE users
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, email, role, is_active
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
};

export const approveDealerPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'approved' } = req.body;

    // Update application status
    await query(`
      UPDATE dealership_applications
      SET status = $1, reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP
      WHERE user_id = $3
    `, [status, req.user.id, id]);

    // Activate user if approved
    if (status === 'approved') {
      await query('UPDATE users SET is_active = true WHERE id = $1', [id]);
    }

    res.json({ message: `User ${status} successfully` });
  } catch (error) {
    console.error('Approve dealer/partner error:', error);
    res.status(500).json({ error: 'Failed to approve dealer/partner' });
  }
};

// ============================================================================
// PRODUCTS (MASTER CATALOGUE)
// ============================================================================

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', category = '' } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let paramIndex = 0;
    let whereClause = 'WHERE 1=1';

    if (search) {
      paramIndex++;
      whereClause += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
    }

    if (category) {
      paramIndex++;
      whereClause += ` AND category = $${paramIndex}`;
      params.push(category);
    }

    const countResult = await query(`SELECT COUNT(*) FROM master_products ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].count);

    paramIndex++;
    params.push(parseInt(limit));
    paramIndex++;
    params.push(offset);

    const result = await query(`
      SELECT * FROM master_products
      ${whereClause}
      ORDER BY name
      LIMIT $${paramIndex - 1} OFFSET $${paramIndex}
    `, params);

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
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, description, unit, specifications } = req.body;

    const result = await query(`
      INSERT INTO master_products (name, category, description, unit, specifications)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, category, description, unit, JSON.stringify(specifications || {})]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, unit, specifications, is_active } = req.body;

    const result = await query(`
      UPDATE master_products
      SET name = COALESCE($1, name),
          category = COALESCE($2, category),
          description = COALESCE($3, description),
          unit = COALESCE($4, unit),
          specifications = COALESCE($5, specifications),
          is_active = COALESCE($6, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [name, category, description, unit, specifications ? JSON.stringify(specifications) : null, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM master_products WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// ============================================================================
// EVENTS
// ============================================================================

export const getEvents = async (req, res) => {
  try {
    const result = await query(`
      SELECT e.*, u.name as created_by_name,
        (SELECT COUNT(*) FROM event_invites WHERE event_id = e.id) as invite_count
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      ORDER BY e.event_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, location, location_lat, location_lng, event_date } = req.body;

    const result = await query(`
      INSERT INTO events (title, description, location, location_lat, location_lng, event_date, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title, description, location, location_lat, location_lng, event_date, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, location_lat, location_lng, event_date, is_active } = req.body;

    const result = await query(`
      UPDATE events
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          location = COALESCE($3, location),
          location_lat = COALESCE($4, location_lat),
          location_lng = COALESCE($5, location_lng),
          event_date = COALESCE($6, event_date),
          is_active = COALESCE($7, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [title, description, location, location_lat, location_lng, event_date, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

export const sendEventInvites = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_ids, user_role } = req.body;

    for (const userId of user_ids) {
      await query(`
        INSERT INTO event_invites (event_id, user_id, user_role, status)
        VALUES ($1, $2, $3, 'pending')
        ON CONFLICT (event_id, user_id) DO NOTHING
      `, [id, userId, user_role]);
    }

    res.json({ message: 'Invites sent successfully', count: user_ids.length });
  } catch (error) {
    console.error('Send invites error:', error);
    res.status(500).json({ error: 'Failed to send invites' });
  }
};

// ============================================================================
// PARTNER WORKS
// ============================================================================

export const getPartnerWorks = async (req, res) => {
  try {
    const result = await query(`
      SELECT pw.*, u.name as partner_name, u.email as partner_email
      FROM partner_works pw
      LEFT JOIN users u ON pw.partner_id = u.id
      ORDER BY pw.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get partner works error:', error);
    res.status(500).json({ error: 'Failed to fetch partner works' });
  }
};

export const updatePartnerWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved, is_active } = req.body;

    const result = await query(`
      UPDATE partner_works
      SET is_approved = COALESCE($1, is_approved),
          is_active = COALESCE($2, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [is_approved, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partner work not found' });
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
    const result = await query('DELETE FROM partner_works WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partner work not found' });
    }

    res.json({ message: 'Partner work deleted successfully' });
  } catch (error) {
    console.error('Delete partner work error:', error);
    res.status(500).json({ error: 'Failed to delete partner work' });
  }
};

// ============================================================================
// STEEL MARKET UPDATES
// ============================================================================

export const getSteelMarketUpdates = async (req, res) => {
  try {
    const result = await query(`
      SELECT smu.*, u.name as created_by_name
      FROM steel_market_updates smu
      LEFT JOIN users u ON smu.created_by = u.id
      ORDER BY smu.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get steel updates error:', error);
    res.status(500).json({ error: 'Failed to fetch steel market updates' });
  }
};

export const createSteelMarketUpdate = async (req, res) => {
  try {
    const { title, description, image_url } = req.body;

    const result = await query(`
      INSERT INTO steel_market_updates (title, description, image_url, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [title, description, image_url, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create steel update error:', error);
    res.status(500).json({ error: 'Failed to create steel market update' });
  }
};

export const updateSteelMarketUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, is_active } = req.body;

    const result = await query(`
      UPDATE steel_market_updates
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          image_url = COALESCE($3, image_url),
          is_active = COALESCE($4, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [title, description, image_url, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Steel market update not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update steel update error:', error);
    res.status(500).json({ error: 'Failed to update steel market update' });
  }
};

export const deleteSteelMarketUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM steel_market_updates WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Steel market update not found' });
    }

    res.json({ message: 'Steel market update deleted successfully' });
  } catch (error) {
    console.error('Delete steel update error:', error);
    res.status(500).json({ error: 'Failed to delete steel market update' });
  }
};

// ============================================================================
// GUEST LECTURES
// ============================================================================

export const getGuestLectures = async (req, res) => {
  try {
    const result = await query(`
      SELECT gl.*, u.name as created_by_name
      FROM guest_lectures gl
      LEFT JOIN users u ON gl.created_by = u.id
      ORDER BY gl.lecture_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get lectures error:', error);
    res.status(500).json({ error: 'Failed to fetch guest lectures' });
  }
};

export const createGuestLecture = async (req, res) => {
  try {
    const { title, description, meeting_link, lecture_date } = req.body;

    const result = await query(`
      INSERT INTO guest_lectures (title, description, meeting_link, lecture_date, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [title, description, meeting_link, lecture_date, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create lecture error:', error);
    res.status(500).json({ error: 'Failed to create guest lecture' });
  }
};

export const updateGuestLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, meeting_link, lecture_date, is_active } = req.body;

    const result = await query(`
      UPDATE guest_lectures
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          meeting_link = COALESCE($3, meeting_link),
          lecture_date = COALESCE($4, lecture_date),
          is_active = COALESCE($5, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [title, description, meeting_link, lecture_date, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guest lecture not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update lecture error:', error);
    res.status(500).json({ error: 'Failed to update guest lecture' });
  }
};

export const deleteGuestLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM guest_lectures WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guest lecture not found' });
    }

    res.json({ message: 'Guest lecture deleted successfully' });
  } catch (error) {
    console.error('Delete lecture error:', error);
    res.status(500).json({ error: 'Failed to delete guest lecture' });
  }
};

// ============================================================================
// TRADING ADVICES
// ============================================================================

export const getTradingAdvices = async (req, res) => {
  try {
    const result = await query(`
      SELECT ta.*, u.name as created_by_name
      FROM trading_advices ta
      LEFT JOIN users u ON ta.created_by = u.id
      ORDER BY ta.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get trading advices error:', error);
    res.status(500).json({ error: 'Failed to fetch trading advices' });
  }
};

export const createTradingAdvice = async (req, res) => {
  try {
    const { title, description, image_url, visible_to_dealers, visible_to_partners } = req.body;

    const result = await query(`
      INSERT INTO trading_advices (title, description, image_url, visible_to_dealers, visible_to_partners, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, description, image_url, visible_to_dealers || false, visible_to_partners || false, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create trading advice error:', error);
    res.status(500).json({ error: 'Failed to create trading advice' });
  }
};

export const updateTradingAdvice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, visible_to_dealers, visible_to_partners, is_active } = req.body;

    const result = await query(`
      UPDATE trading_advices
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          image_url = COALESCE($3, image_url),
          visible_to_dealers = COALESCE($4, visible_to_dealers),
          visible_to_partners = COALESCE($5, visible_to_partners),
          is_active = COALESCE($6, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [title, description, image_url, visible_to_dealers, visible_to_partners, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trading advice not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update trading advice error:', error);
    res.status(500).json({ error: 'Failed to update trading advice' });
  }
};

export const deleteTradingAdvice = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM trading_advices WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trading advice not found' });
    }

    res.json({ message: 'Trading advice deleted successfully' });
  } catch (error) {
    console.error('Delete trading advice error:', error);
    res.status(500).json({ error: 'Failed to delete trading advice' });
  }
};

// ============================================================================
// UPCOMING PROJECTS
// ============================================================================

export const getUpcomingProjects = async (req, res) => {
  try {
    const result = await query(`
      SELECT up.*, u.name as created_by_name
      FROM upcoming_projects up
      LEFT JOIN users u ON up.created_by = u.id
      ORDER BY up.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming projects' });
  }
};

export const createUpcomingProject = async (req, res) => {
  try {
    const { title, description, location, location_lat, location_lng } = req.body;

    const result = await query(`
      INSERT INTO upcoming_projects (title, description, location, location_lat, location_lng, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, description, location, location_lat, location_lng, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create upcoming project' });
  }
};

export const updateUpcomingProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, location_lat, location_lng, is_active } = req.body;

    const result = await query(`
      UPDATE upcoming_projects
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          location = COALESCE($3, location),
          location_lat = COALESCE($4, location_lat),
          location_lng = COALESCE($5, location_lng),
          is_active = COALESCE($6, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [title, description, location, location_lat, location_lng, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Upcoming project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update upcoming project' });
  }
};

export const deleteUpcomingProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM upcoming_projects WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Upcoming project not found' });
    }

    res.json({ message: 'Upcoming project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete upcoming project' });
  }
};

// ============================================================================
// TENDERS
// ============================================================================

export const getTenders = async (req, res) => {
  try {
    const result = await query(`
      SELECT t.*, u.name as created_by_name
      FROM tenders t
      LEFT JOIN users u ON t.created_by = u.id
      ORDER BY t.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get tenders error:', error);
    res.status(500).json({ error: 'Failed to fetch tenders' });
  }
};

export const createTender = async (req, res) => {
  try {
    const { title, description, attachments } = req.body;

    const result = await query(`
      INSERT INTO tenders (title, description, attachments, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [title, description, attachments || [], req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create tender error:', error);
    res.status(500).json({ error: 'Failed to create tender' });
  }
};

export const updateTender = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, attachments, is_active } = req.body;

    const result = await query(`
      UPDATE tenders
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          attachments = COALESCE($3, attachments),
          is_active = COALESCE($4, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [title, description, attachments, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update tender error:', error);
    res.status(500).json({ error: 'Failed to update tender' });
  }
};

export const deleteTender = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM tenders WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    res.json({ message: 'Tender deleted successfully' });
  } catch (error) {
    console.error('Delete tender error:', error);
    res.status(500).json({ error: 'Failed to delete tender' });
  }
};

// ============================================================================
// EDUCATION POSTS
// ============================================================================

export const getEducationPosts = async (req, res) => {
  try {
    const result = await query(`
      SELECT ep.*, u.name as created_by_name
      FROM education_posts ep
      LEFT JOIN users u ON ep.created_by = u.id
      ORDER BY ep.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get education posts error:', error);
    res.status(500).json({ error: 'Failed to fetch education posts' });
  }
};

export const createEducationPost = async (req, res) => {
  try {
    const { title, body, video_links, documents, images } = req.body;

    const result = await query(`
      INSERT INTO education_posts (title, body, video_links, documents, images, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, body, video_links || [], documents || [], images || [], req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create education post error:', error);
    res.status(500).json({ error: 'Failed to create education post' });
  }
};

export const updateEducationPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, video_links, documents, images, is_active } = req.body;

    const result = await query(`
      UPDATE education_posts
      SET title = COALESCE($1, title),
          body = COALESCE($2, body),
          video_links = COALESCE($3, video_links),
          documents = COALESCE($4, documents),
          images = COALESCE($5, images),
          is_active = COALESCE($6, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [title, body, video_links, documents, images, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Education post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update education post error:', error);
    res.status(500).json({ error: 'Failed to update education post' });
  }
};

export const deleteEducationPost = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM education_posts WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Education post not found' });
    }

    res.json({ message: 'Education post deleted successfully' });
  } catch (error) {
    console.error('Delete education post error:', error);
    res.status(500).json({ error: 'Failed to delete education post' });
  }
};

// ============================================================================
// QUIZZES
// ============================================================================

export const getQuizzes = async (req, res) => {
  try {
    const result = await query(`
      SELECT q.*, u.name as created_by_name,
        (SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = q.id) as attempt_count
      FROM quizzes q
      LEFT JOIN users u ON q.created_by = u.id
      ORDER BY q.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const { name, description, questions } = req.body;

    const result = await query(`
      INSERT INTO quizzes (name, description, questions, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [name, description, JSON.stringify(questions || []), req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, questions, is_active } = req.body;

    const result = await query(`
      UPDATE quizzes
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          questions = COALESCE($3, questions),
          is_active = COALESCE($4, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [name, description, questions ? JSON.stringify(questions) : null, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM quizzes WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
};

export const getQuizAttempts = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT qa.*, u.name as user_name, u.email as user_email
      FROM quiz_attempts qa
      LEFT JOIN users u ON qa.user_id = u.id
      WHERE qa.quiz_id = $1
      ORDER BY qa.completed_at DESC
    `, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz attempts' });
  }
};

// ============================================================================
// ADMIN NOTES
// ============================================================================

export const getAdminNotes = async (req, res) => {
  try {
    const result = await query(`
      SELECT an.*, u.name as created_by_name
      FROM admin_notes an
      LEFT JOIN users u ON an.created_by = u.id
      ORDER BY an.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get admin notes error:', error);
    res.status(500).json({ error: 'Failed to fetch admin notes' });
  }
};

export const createAdminNote = async (req, res) => {
  try {
    const { title, content, visible_to_partners, visible_to_dealers } = req.body;

    const result = await query(`
      INSERT INTO admin_notes (title, content, visible_to_partners, visible_to_dealers, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [title, content, visible_to_partners || false, visible_to_dealers || false, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create admin note error:', error);
    res.status(500).json({ error: 'Failed to create admin note' });
  }
};

export const updateAdminNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, visible_to_partners, visible_to_dealers } = req.body;

    const result = await query(`
      UPDATE admin_notes
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          visible_to_partners = COALESCE($3, visible_to_partners),
          visible_to_dealers = COALESCE($4, visible_to_dealers),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [title, content, visible_to_partners, visible_to_dealers, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin note not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update admin note error:', error);
    res.status(500).json({ error: 'Failed to update admin note' });
  }
};

export const deleteAdminNote = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM admin_notes WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin note not found' });
    }

    res.json({ message: 'Admin note deleted successfully' });
  } catch (error) {
    console.error('Delete admin note error:', error);
    res.status(500).json({ error: 'Failed to delete admin note' });
  }
};

// ============================================================================
// ENQUIRIES
// ============================================================================

export const getEnquiries = async (req, res) => {
  try {
    const { type = 'all', status = '' } = req.query;

    let results = [];

    if (type === 'all' || type === 'general') {
      const general = await query(`
        SELECT ge.*, 'general' as type, u.name as user_name
        FROM general_enquiries ge
        LEFT JOIN users u ON ge.user_id = u.id
        ${status ? "WHERE ge.status = $1" : ""}
        ORDER BY ge.created_at DESC
      `, status ? [status] : []);
      results = [...results, ...general.rows];
    }

    if (type === 'all' || type === 'contact') {
      const contact = await query(`
        SELECT *, 'contact' as type
        FROM contact_enquiries
        ORDER BY created_at DESC
      `);
      results = [...results, ...contact.rows];
    }

    if (type === 'all' || type === 'dealer') {
      const dealer = await query(`
        SELECT de.*, 'dealer' as type, u.name as dealer_name
        FROM dealer_enquiries de
        LEFT JOIN users u ON de.dealer_id = u.id
        ${status ? "WHERE de.status = $1" : ""}
        ORDER BY de.created_at DESC
      `, status ? [status] : []);
      results = [...results, ...dealer.rows];
    }

    res.json(results);
  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
};

export const respondToEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { response, type } = req.body;

    let table = 'general_enquiries';
    if (type === 'dealer') table = 'dealer_enquiries';

    const result = await query(`
      UPDATE ${table}
      SET response = $1, responded_at = CURRENT_TIMESTAMP, responded_by = $2, status = 'responded'
      WHERE id = $3
      RETURNING *
    `, [response, req.user.id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Respond to enquiry error:', error);
    res.status(500).json({ error: 'Failed to respond to enquiry' });
  }
};

// ============================================================================
// FEEDBACK MODERATION
// ============================================================================

export const getReportedFeedbacks = async (req, res) => {
  try {
    const dealerFeedbacks = await query(`
      SELECT df.*, 'dealer' as type, u.name as user_name, d.name as dealer_name
      FROM dealer_feedbacks df
      LEFT JOIN users u ON df.user_id = u.id
      LEFT JOIN users d ON df.dealer_id = d.id
      WHERE df.is_reported = true
      ORDER BY df.created_at DESC
    `);

    const partnerFeedbacks = await query(`
      SELECT pf.*, 'partner' as type, u.name as user_name, p.name as partner_name
      FROM partner_feedbacks pf
      LEFT JOIN users u ON pf.user_id = u.id
      LEFT JOIN users p ON pf.partner_id = p.id
      WHERE pf.is_reported = true
      ORDER BY pf.created_at DESC
    `);

    res.json([...dealerFeedbacks.rows, ...partnerFeedbacks.rows]);
  } catch (error) {
    console.error('Get reported feedbacks error:', error);
    res.status(500).json({ error: 'Failed to fetch reported feedbacks' });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    const table = type === 'partner' ? 'partner_feedbacks' : 'dealer_feedbacks';
    const result = await query(`DELETE FROM ${table} WHERE id = $1 RETURNING id`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};

// ============================================================================
// OFFERS
// ============================================================================

export const getOffers = async (req, res) => {
  try {
    const result = await query(`
      SELECT o.*, u.name as created_by_name
      FROM offers o
      LEFT JOIN users u ON o.created_by = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
};

export const createOffer = async (req, res) => {
  try {
    const { title, description, discount_type, discount_value, valid_until, applicable_to } = req.body;

    const result = await query(`
      INSERT INTO offers (title, description, discount_type, discount_value, valid_until, applicable_to, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title, description, discount_type, discount_value, valid_until, applicable_to, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, discount_type, discount_value, valid_until, applicable_to, is_active } = req.body;

    const result = await query(`
      UPDATE offers
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          discount_type = COALESCE($3, discount_type),
          discount_value = COALESCE($4, discount_value),
          valid_until = COALESCE($5, valid_until),
          applicable_to = COALESCE($6, applicable_to),
          is_active = COALESCE($7, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [title, description, discount_type, discount_value, valid_until, applicable_to, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({ error: 'Failed to update offer' });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM offers WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Delete offer error:', error);
    res.status(500).json({ error: 'Failed to delete offer' });
  }
};

// ============================================================================
// CHECKLISTS
// ============================================================================

export const getChecklists = async (req, res) => {
  try {
    const result = await query(`
      SELECT c.*, u.name as created_by_name
      FROM checklists c
      LEFT JOIN users u ON c.created_by = u.id
      ORDER BY c.category, c.title
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get checklists error:', error);
    res.status(500).json({ error: 'Failed to fetch checklists' });
  }
};

export const createChecklist = async (req, res) => {
  try {
    const { category, title, items } = req.body;

    const result = await query(`
      INSERT INTO checklists (category, title, items, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [category, title, JSON.stringify(items || []), req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create checklist error:', error);
    res.status(500).json({ error: 'Failed to create checklist' });
  }
};

export const updateChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title, items, is_active } = req.body;

    const result = await query(`
      UPDATE checklists
      SET category = COALESCE($1, category),
          title = COALESCE($2, title),
          items = COALESCE($3, items),
          is_active = COALESCE($4, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [category, title, items ? JSON.stringify(items) : null, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Checklist not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update checklist error:', error);
    res.status(500).json({ error: 'Failed to update checklist' });
  }
};

export const deleteChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM checklists WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Checklist not found' });
    }

    res.json({ message: 'Checklist deleted successfully' });
  } catch (error) {
    console.error('Delete checklist error:', error);
    res.status(500).json({ error: 'Failed to delete checklist' });
  }
};

// ============================================================================
// VISUALIZATION REQUESTS
// ============================================================================

export const getVisualizationRequests = async (req, res) => {
  try {
    const result = await query(`
      SELECT vr.*, u.name as user_name, u.email as user_email, r.name as responded_by_name
      FROM visualization_requests vr
      LEFT JOIN users u ON vr.user_id = u.id
      LEFT JOIN users r ON vr.responded_by = r.id
      ORDER BY vr.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get visualization requests error:', error);
    res.status(500).json({ error: 'Failed to fetch visualization requests' });
  }
};

export const respondToVisualizationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response_video, response_image, response_message } = req.body;

    const result = await query(`
      UPDATE visualization_requests
      SET status = $1,
          response_video = $2,
          response_image = $3,
          response_message = $4,
          responded_by = $5,
          responded_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [status, response_video, response_image, response_message, req.user.id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Visualization request not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Respond to visualization request error:', error);
    res.status(500).json({ error: 'Failed to respond to visualization request' });
  }
};

// ============================================================================
// SHORTCUTS & LINKS
// ============================================================================

export const getShortcutsLinks = async (req, res) => {
  try {
    const result = await query(`
      SELECT sl.*, u.name as created_by_name
      FROM shortcuts_links sl
      LEFT JOIN users u ON sl.created_by = u.id
      ORDER BY sl.category, sl.title
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get shortcuts error:', error);
    res.status(500).json({ error: 'Failed to fetch shortcuts' });
  }
};

export const createShortcutLink = async (req, res) => {
  try {
    const { category, title, link_url, description } = req.body;

    const result = await query(`
      INSERT INTO shortcuts_links (category, title, link_url, description, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [category, title, link_url, description, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create shortcut error:', error);
    res.status(500).json({ error: 'Failed to create shortcut' });
  }
};

export const updateShortcutLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title, link_url, description, is_active } = req.body;

    const result = await query(`
      UPDATE shortcuts_links
      SET category = COALESCE($1, category),
          title = COALESCE($2, title),
          link_url = COALESCE($3, link_url),
          description = COALESCE($4, description),
          is_active = COALESCE($5, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [category, title, link_url, description, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shortcut not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update shortcut error:', error);
    res.status(500).json({ error: 'Failed to update shortcut' });
  }
};

export const deleteShortcutLink = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM shortcuts_links WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shortcut not found' });
    }

    res.json({ message: 'Shortcut deleted successfully' });
  } catch (error) {
    console.error('Delete shortcut error:', error);
    res.status(500).json({ error: 'Failed to delete shortcut' });
  }
};

// ============================================================================
// VIDEOS
// ============================================================================

export const getVideos = async (req, res) => {
  try {
    const result = await query(`
      SELECT v.*, u.name as created_by_name
      FROM videos v
      LEFT JOIN users u ON v.created_by = u.id
      ORDER BY v.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

export const createVideo = async (req, res) => {
  try {
    const { title, youtube_url, category, description } = req.body;

    const result = await query(`
      INSERT INTO videos (title, youtube_url, category, description, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [title, youtube_url, category, description, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, youtube_url, category, description, is_active } = req.body;

    const result = await query(`
      UPDATE videos
      SET title = COALESCE($1, title),
          youtube_url = COALESCE($2, youtube_url),
          category = COALESCE($3, category),
          description = COALESCE($4, description),
          is_active = COALESCE($5, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [title, youtube_url, category, description, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM videos WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

// ============================================================================
// DEALERSHIP APPLICATIONS
// ============================================================================

export const getDealershipApplications = async (req, res) => {
  try {
    const { status = '' } = req.query;

    let sql = `
      SELECT da.*, u.name as user_name, u.email as user_email, u.phone as user_phone, u.role,
             r.name as reviewed_by_name
      FROM dealership_applications da
      LEFT JOIN users u ON da.user_id = u.id
      LEFT JOIN users r ON da.reviewed_by = r.id
    `;

    const params = [];
    if (status) {
      sql += ' WHERE da.status = $1';
      params.push(status);
    }

    sql += ' ORDER BY da.created_at DESC';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get dealership applications error:', error);
    res.status(500).json({ error: 'Failed to fetch dealership applications' });
  }
};

export const reviewDealershipApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Update application
    const result = await query(`
      UPDATE dealership_applications
      SET status = $1, reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [status, req.user.id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // If approved, activate the user
    if (status === 'approved') {
      await query('UPDATE users SET is_active = true WHERE id = $1', [result.rows[0].user_id]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Review application error:', error);
    res.status(500).json({ error: 'Failed to review application' });
  }
};

// ============================================================================
// LOYALTY POINTS
// ============================================================================

export const getLoyaltyPoints = async (req, res) => {
  try {
    const result = await query(`
      SELECT lp.*, u.name as user_name, u.email as user_email, c.name as created_by_name
      FROM loyalty_points lp
      LEFT JOIN users u ON lp.user_id = u.id
      LEFT JOIN users c ON lp.created_by = c.id
      ORDER BY lp.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get loyalty points error:', error);
    res.status(500).json({ error: 'Failed to fetch loyalty points' });
  }
};

export const addLoyaltyPoints = async (req, res) => {
  try {
    const { user_id, points, source, description } = req.body;

    const result = await query(`
      INSERT INTO loyalty_points (user_id, points, source, description, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [user_id, points, source || 'manual', description, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add loyalty points error:', error);
    res.status(500).json({ error: 'Failed to add loyalty points' });
  }
};

// ============================================================================
// REPORTS
// ============================================================================

export const getAdminReports = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);

    // User growth
    const userGrowth = await query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at >= CURRENT_DATE - $1
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [days]);

    // Order stats
    const orderStats = await query(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count,
        SUM(final_amount) as revenue
      FROM orders
      WHERE created_at >= CURRENT_DATE - $1
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [days]);

    // Role distribution
    const roleDistribution = await query(`
      SELECT role, COUNT(*) as count
      FROM users
      GROUP BY role
    `);

    res.json({
      userGrowth: userGrowth.rows,
      orderStats: orderStats.rows,
      roleDistribution: roleDistribution.rows
    });
  } catch (error) {
    console.error('Get admin reports error:', error);
    res.status(500).json({ error: 'Failed to fetch admin reports' });
  }
};
