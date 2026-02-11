/**
 * Orders Controller
 *
 * Handles order creation, management, and tracking
 */

import { query } from '../config/database.js';
import { logger } from '../utils/logger.js';

/**
 * Get orders for current user
 * GET /api/orders
 */
const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, status, from_date, to_date } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (from_date) {
      whereClause += ` AND created_at >= $${paramIndex}`;
      params.push(from_date);
      paramIndex++;
    }

    if (to_date) {
      whereClause += ` AND created_at <= $${paramIndex}`;
      params.push(to_date);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM orders ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get orders
    const ordersResult = await query(
      `SELECT o.*,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    res.json({
      success: true,
      data: {
        items: ordersResult.rows,
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
    logger.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch orders' },
    });
  }
};

/**
 * Get single order by ID
 * GET /api/orders/:id
 */
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Get order
    const orderResult = await query(
      `SELECT o.* FROM orders o
       WHERE o.id = $1 AND (o.user_id = $2 OR o.dealer_id = $2 OR o.partner_id = $2)`,
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found' },
      });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [id]
    );

    // Get payments
    const paymentsResult = await query(
      `SELECT * FROM payments WHERE order_id = $1`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...order,
        items: itemsResult.rows,
        payments: paymentsResult.rows,
      },
    });
  } catch (error) {
    logger.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch order' },
    });
  }
};

/**
 * Create new order
 * POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      items,
      dealer_id,
      partner_id,
      shipping_address,
      billing_address,
      payment_method,
      customer_notes,
      coupon_code,
      use_loyalty_points,
      loyalty_points_to_use,
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Order must have at least one item' },
      });
    }

    // Validate shipping address
    if (!shipping_address || !shipping_address.name || !shipping_address.phone) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Shipping address is required' },
      });
    }

    // Calculate totals
    let totalAmount = 0;
    let taxAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const itemTotal = item.unit_price * item.quantity;
      const itemTax = itemTotal * 0.18; // 18% GST
      totalAmount += itemTotal;
      taxAmount += itemTax;

      // Get product details
      let productName = 'Product';
      let productDescription = '';
      let productImage = null;

      if (item.product_id) {
        const productResult = await query(
          'SELECT name, description FROM master_products WHERE id = $1',
          [item.product_id]
        );
        if (productResult.rows.length > 0) {
          productName = productResult.rows[0].name;
          productDescription = productResult.rows[0].description;
        }
      } else if (item.dealer_product_id) {
        const dpResult = await query(
          'SELECT product_name, description, images FROM dealer_products WHERE id = $1',
          [item.dealer_product_id]
        );
        if (dpResult.rows.length > 0) {
          productName = dpResult.rows[0].product_name;
          productDescription = dpResult.rows[0].description;
          productImage = dpResult.rows[0].images?.[0];
        }
      }

      orderItems.push({
        ...item,
        product_name: productName,
        product_description: productDescription,
        product_image: productImage,
        total_price: itemTotal + itemTotal * 0.18,
        tax_percent: 18,
      });
    }

    // Calculate discount (coupon)
    let discountAmount = 0;
    // TODO: Implement coupon validation

    // Calculate loyalty points discount
    let loyaltyDiscount = 0;
    if (use_loyalty_points && loyalty_points_to_use > 0) {
      // Get loyalty balance
      const balanceResult = await query(
        `SELECT get_loyalty_balance($1) as balance`,
        [userId]
      );
      const balance = balanceResult.rows[0]?.balance || 0;

      if (balance >= loyalty_points_to_use) {
        loyaltyDiscount = loyalty_points_to_use * 0.25; // 1 point = 0.25 INR
      }
    }

    const shippingAmount = 0; // Free shipping for now
    const finalAmount = totalAmount + taxAmount - discountAmount - loyaltyDiscount + shippingAmount;

    // Create order
    const orderResult = await query(
      `INSERT INTO orders (
        user_id, dealer_id, partner_id,
        total_amount, discount_amount, tax_amount, shipping_amount, final_amount,
        shipping_name, shipping_phone, shipping_address_line1, shipping_address_line2,
        shipping_city, shipping_state, shipping_pincode,
        billing_name, billing_phone, billing_address_line1, billing_address_line2,
        billing_city, billing_state, billing_pincode,
        customer_notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, 'pending')
      RETURNING *`,
      [
        userId,
        dealer_id || null,
        partner_id || null,
        totalAmount,
        discountAmount + loyaltyDiscount,
        taxAmount,
        shippingAmount,
        finalAmount,
        shipping_address.name,
        shipping_address.phone,
        shipping_address.address_line1,
        shipping_address.address_line2 || null,
        shipping_address.city,
        shipping_address.state,
        shipping_address.pincode,
        billing_address?.name || shipping_address.name,
        billing_address?.phone || shipping_address.phone,
        billing_address?.address_line1 || shipping_address.address_line1,
        billing_address?.address_line2 || shipping_address.address_line2 || null,
        billing_address?.city || shipping_address.city,
        billing_address?.state || shipping_address.state,
        billing_address?.pincode || shipping_address.pincode,
        customer_notes || null,
      ]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of orderItems) {
      await query(
        `INSERT INTO order_items (
          order_id, product_id, dealer_product_id,
          product_name, product_description, product_image,
          unit_price, quantity, discount_percent, tax_percent, total_price, unit
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          order.id,
          item.product_id || null,
          item.dealer_product_id || null,
          item.product_name,
          item.product_description,
          item.product_image,
          item.unit_price,
          item.quantity,
          0,
          item.tax_percent,
          item.total_price,
          item.unit || null,
        ]
      );
    }

    // Deduct loyalty points if used
    if (use_loyalty_points && loyalty_points_to_use > 0 && loyaltyDiscount > 0) {
      await query(
        `INSERT INTO loyalty_transactions (
          user_id, transaction_type, points, description, reference_type, reference_id
        ) VALUES ($1, 'redeem', $2, $3, 'order', $4)`,
        [userId, loyalty_points_to_use, 'Points redeemed for order', order.id]
      );
    }

    // Create payment record
    const paymentResult = await query(
      `INSERT INTO payments (
        order_id, user_id, amount, payment_method, status
      ) VALUES ($1, $2, $3, $4, 'pending')
      RETURNING *`,
      [order.id, userId, finalAmount, payment_method]
    );

    // TODO: Initialize payment gateway

    res.status(201).json({
      success: true,
      data: {
        order: {
          ...order,
          items: orderItems,
        },
        payment: {
          id: paymentResult.rows[0].id,
          amount: finalAmount,
          gateway_order_id: null, // TODO: From payment gateway
        },
      },
    });
  } catch (error) {
    logger.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to create order' },
    });
  }
};

/**
 * Cancel order
 * PATCH /api/orders/:id/cancel
 */
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { reason } = req.body;

    // Check order exists and belongs to user
    const orderResult = await query(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found' },
      });
    }

    const order = orderResult.rows[0];

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Order cannot be cancelled' },
      });
    }

    // Update order status
    const updateResult = await query(
      `UPDATE orders
       SET status = 'cancelled', cancelled_at = NOW(), cancellation_reason = $1
       WHERE id = $2
       RETURNING *`,
      [reason || 'Cancelled by user', id]
    );

    // Refund loyalty points if used
    const loyaltyResult = await query(
      `SELECT * FROM loyalty_transactions
       WHERE reference_type = 'order' AND reference_id = $1 AND transaction_type = 'redeem'`,
      [id]
    );

    if (loyaltyResult.rows.length > 0) {
      const pointsToRefund = loyaltyResult.rows[0].points;
      await query(
        `INSERT INTO loyalty_transactions (
          user_id, transaction_type, points, description, reference_type, reference_id
        ) VALUES ($1, 'earn', $2, $3, 'order_cancelled', $4)`,
        [userId, pointsToRefund, 'Points refunded for cancelled order', id]
      );
    }

    res.json({
      success: true,
      data: updateResult.rows[0],
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    logger.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to cancel order' },
    });
  }
};

/**
 * Track order
 * GET /api/orders/:id/track
 */
const trackOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Get order
    const orderResult = await query(
      `SELECT id, order_number, status, tracking_number,
              shipped_at, delivered_at, created_at
       FROM orders
       WHERE id = $1 AND (user_id = $2 OR dealer_id = $2 OR partner_id = $2)`,
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found' },
      });
    }

    const order = orderResult.rows[0];

    // Build tracking events
    const events = [
      {
        status: 'pending',
        description: 'Order placed',
        timestamp: order.created_at,
      },
    ];

    if (['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)) {
      events.push({
        status: 'confirmed',
        description: 'Order confirmed',
        timestamp: order.created_at, // TODO: Store actual confirmation time
      });
    }

    if (['processing', 'shipped', 'delivered'].includes(order.status)) {
      events.push({
        status: 'processing',
        description: 'Order is being processed',
        timestamp: order.created_at,
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      events.push({
        status: 'shipped',
        description: 'Order shipped',
        location: order.tracking_number ? `Tracking: ${order.tracking_number}` : undefined,
        timestamp: order.shipped_at,
      });
    }

    if (order.status === 'delivered') {
      events.push({
        status: 'delivered',
        description: 'Order delivered',
        timestamp: order.delivered_at,
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        currentStatus: order.status,
        trackingNumber: order.tracking_number,
        events: events.reverse(), // Most recent first
      },
    });
  } catch (error) {
    logger.error('Track order error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to track order' },
    });
  }
};

/**
 * Admin: Get all orders
 * GET /api/admin/orders
 */
const adminGetOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      user_id,
      dealer_id,
      partner_id,
      from_date,
      to_date,
      search,
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      whereClause += ` AND o.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (user_id) {
      whereClause += ` AND o.user_id = $${paramIndex}`;
      params.push(user_id);
      paramIndex++;
    }

    if (dealer_id) {
      whereClause += ` AND o.dealer_id = $${paramIndex}`;
      params.push(dealer_id);
      paramIndex++;
    }

    if (partner_id) {
      whereClause += ` AND o.partner_id = $${paramIndex}`;
      params.push(partner_id);
      paramIndex++;
    }

    if (from_date) {
      whereClause += ` AND o.created_at >= $${paramIndex}`;
      params.push(from_date);
      paramIndex++;
    }

    if (to_date) {
      whereClause += ` AND o.created_at <= $${paramIndex}`;
      params.push(to_date);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (o.order_number ILIKE $${paramIndex} OR u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get orders
    const ordersResult = await query(
      `SELECT o.*,
        u.name as user_name,
        u.email as user_email,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    res.json({
      success: true,
      data: {
        items: ordersResult.rows,
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
    logger.error('Admin get orders error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch orders' },
    });
  }
};

/**
 * Admin: Update order
 * PATCH /api/admin/orders/:id
 */
const adminUpdateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tracking_number, admin_notes, shipped_at, delivered_at } = req.body;

    // Build update query
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (status) {
      updates.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (tracking_number) {
      updates.push(`tracking_number = $${paramIndex}`);
      params.push(tracking_number);
      paramIndex++;
    }

    if (admin_notes) {
      updates.push(`admin_notes = $${paramIndex}`);
      params.push(admin_notes);
      paramIndex++;
    }

    if (shipped_at) {
      updates.push(`shipped_at = $${paramIndex}`);
      params.push(shipped_at);
      paramIndex++;
    }

    if (delivered_at) {
      updates.push(`delivered_at = $${paramIndex}`);
      params.push(delivered_at);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'No updates provided' },
      });
    }

    params.push(id);

    const result = await query(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found' },
      });
    }

    // TODO: Send notification to user about status change

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Order updated successfully',
    });
  } catch (error) {
    logger.error('Admin update order error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to update order' },
    });
  }
};

export {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  trackOrder,
  adminGetOrders,
  adminUpdateOrder,
};
