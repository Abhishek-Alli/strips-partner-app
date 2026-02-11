/**
 * Analytics Controller
 * 
 * Handles analytics and reporting API requests
 */

import { query } from '../config/database.js';

const logger = {
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
  },
  info: (message) => {
    console.log(`[INFO] ${message}`);
  },
};

/**
 * Helper function to get user activity data (without sending response)
 */
const getUserActivityData = async (startDate, endDate, userId = null) => {
  let userActivityQuery = `
    SELECT 
      u.id as user_id,
      u.role,
      u.name,
      u.email,
      u.created_at,
      COUNT(DISTINCT de.id) as total_enquiries,
      COUNT(DISTINCT ce.id) as total_contact_enquiries,
      COUNT(DISTINCT de.id) + COUNT(DISTINCT ce.id) as total_all_enquiries
    FROM users u
    LEFT JOIN dealer_enquiries de ON de.user_id = u.id 
      AND de.created_at >= $1 
      AND de.created_at <= $2
    LEFT JOIN contact_enquiries ce ON ce.email = u.email 
      AND ce.created_at >= $1 
      AND ce.created_at <= $2
    WHERE u.created_at >= $1 
      AND u.created_at <= $2
  `;

  const params = [startDate, endDate];
  
  if (userId) {
    userActivityQuery += ' AND u.id = $3';
    params.push(userId);
  }

  userActivityQuery += `
    GROUP BY u.id, u.role, u.name, u.email, u.created_at
    ORDER BY u.created_at DESC
  `;

  const result = await query(userActivityQuery, params);
  return result.rows.map(row => ({
    userId: row.user_id,
    role: row.role.toLowerCase(),
    totalLogins: 0,
    lastLogin: null,
    totalSearches: 0,
    totalEnquiries: parseInt(row.total_all_enquiries) || 0,
    totalPayments: 0,
    totalSpent: 0,
    period: { start: startDate, end: endDate }
  }));
};

/**
 * Get user activity report
 */
export const getUserActivityReport = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const reports = await getUserActivityData(startDate, endDate, userId);
    res.json(reports);
  } catch (error) {
    logger.error('Failed to get user activity report', error);
    res.status(500).json({ error: 'Failed to fetch user activity report' });
  }
};

/**
 * Get enquiry report
 */
export const getEnquiryReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    // Get dealer enquiries
    const dealerEnquiriesQuery = `
      SELECT 
        de.id as enquiry_id,
        de.user_id as user_id,
        de.dealer_id,
        'dealer' as entity_type,
        de.dealer_id as entity_id,
        de.status,
        de.created_at,
        de.responded_at,
        CASE 
          WHEN de.responded_at IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (de.responded_at - de.created_at)) / 3600
          ELSE NULL
        END as response_time
      FROM dealer_enquiries de
      WHERE de.created_at >= $1 AND de.created_at <= $2
      ORDER BY de.created_at DESC
    `;

    // Get contact enquiries
    const contactEnquiriesQuery = `
      SELECT 
        ce.id as enquiry_id,
        u.id as user_id,
        NULL as dealer_id,
        'contact' as entity_type,
        NULL as entity_id,
        'new' as status,
        ce.created_at,
        NULL as responded_at,
        NULL as response_time
      FROM contact_enquiries ce
      LEFT JOIN users u ON u.email = ce.email
      WHERE ce.created_at >= $1 AND ce.created_at <= $2
      ORDER BY ce.created_at DESC
    `;

    const [dealerResult, contactResult] = await Promise.all([
      query(dealerEnquiriesQuery, [startDate, endDate]),
      query(contactEnquiriesQuery, [startDate, endDate])
    ]);

    const reports = [
      ...dealerResult.rows.map(row => ({
        enquiryId: row.enquiry_id,
        userId: row.user_id || null,
        entityType: row.entity_type,
        entityId: row.entity_id || null,
        status: row.status,
        createdAt: row.created_at,
        respondedAt: row.responded_at || null,
        responseTime: row.response_time ? parseFloat(row.response_time.toFixed(1)) : null
      })),
      ...contactResult.rows.map(row => ({
        enquiryId: row.enquiry_id,
        userId: row.user_id || null,
        entityType: row.entity_type,
        entityId: row.entity_id || null,
        status: row.status,
        createdAt: row.created_at,
        respondedAt: row.responded_at || null,
        responseTime: row.response_time || null
      }))
    ];

    res.json(reports);
  } catch (error) {
    logger.error('Failed to get enquiry report', error);
    res.status(500).json({ error: 'Failed to fetch enquiry report' });
  }
};

/**
 * Get payment report
 * Note: Payments table doesn't exist yet, returning empty array
 */
export const getPaymentReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    // TODO: Implement when payments table is created
    // For now, return empty array
    res.json([]);
  } catch (error) {
    logger.error('Failed to get payment report', error);
    res.status(500).json({ error: 'Failed to fetch payment report' });
  }
};

/**
 * Helper function to get enquiry data (without sending response)
 */
const getEnquiryData = async (startDate, endDate) => {
  const dealerEnquiriesQuery = `
    SELECT 
      de.id as enquiry_id,
      de.user_id as user_id,
      de.dealer_id,
      'dealer' as entity_type,
      de.dealer_id as entity_id,
      de.status,
      de.created_at,
      de.responded_at,
      CASE 
        WHEN de.responded_at IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (de.responded_at - de.created_at)) / 3600
        ELSE NULL
      END as response_time
    FROM dealer_enquiries de
    WHERE de.created_at >= $1 AND de.created_at <= $2
    ORDER BY de.created_at DESC
  `;

  const contactEnquiriesQuery = `
    SELECT 
      ce.id as enquiry_id,
      u.id as user_id,
      NULL as dealer_id,
      'contact' as entity_type,
      NULL as entity_id,
      'new' as status,
      ce.created_at,
      NULL as responded_at,
      NULL as response_time
    FROM contact_enquiries ce
    LEFT JOIN users u ON u.email = ce.email
    WHERE ce.created_at >= $1 AND ce.created_at <= $2
    ORDER BY ce.created_at DESC
  `;

  const [dealerResult, contactResult] = await Promise.all([
    query(dealerEnquiriesQuery, [startDate, endDate]),
    query(contactEnquiriesQuery, [startDate, endDate])
  ]);

  return [
    ...dealerResult.rows.map(row => ({
      enquiryId: row.enquiry_id,
      userId: row.user_id || null,
      entityType: row.entity_type,
      entityId: row.entity_id || null,
      status: row.status,
      createdAt: row.created_at,
      respondedAt: row.responded_at || null,
      responseTime: row.response_time ? parseFloat(row.response_time.toFixed(1)) : null
    })),
    ...contactResult.rows.map(row => ({
      enquiryId: row.enquiry_id,
      userId: row.user_id || null,
      entityType: row.entity_type,
      entityId: row.entity_id || null,
      status: row.status,
      createdAt: row.created_at,
      respondedAt: row.responded_at || null,
      responseTime: row.response_time || null
    }))
  ];
};

/**
 * Export report as CSV
 */
export const exportReportAsCSV = async (req, res) => {
  try {
    const { reportType } = req.params;
    const { startDate, endDate, format = 'csv' } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    if (format !== 'csv') {
      return res.status(400).json({ error: 'Only CSV format is supported' });
    }

    let csvContent = '';
    let data = [];

    switch (reportType) {
      case 'user-activity':
        data = await getUserActivityData(startDate, endDate);
        csvContent = 'User ID,Role,Total Enquiries,Total Logins,Total Searches,Total Payments,Total Spent\n';
        data.forEach(row => {
          csvContent += `${row.userId},${row.role},${row.totalEnquiries},${row.totalLogins},${row.totalSearches},${row.totalPayments},${row.totalSpent}\n`;
        });
        break;
      
      case 'enquiries':
        data = await getEnquiryData(startDate, endDate);
        csvContent = 'Enquiry ID,User ID,Entity Type,Entity ID,Status,Created At,Responded At,Response Time (hours)\n';
        data.forEach(row => {
          csvContent += `${row.enquiryId},${row.userId || ''},${row.entityType},${row.entityId || ''},${row.status},${row.createdAt},${row.respondedAt || ''},${row.responseTime || ''}\n`;
        });
        break;
      
      case 'payments':
        // No payments data yet
        csvContent = 'Payment ID,User ID,Service Type,Amount,Currency,Status,Created At\n';
        break;
      
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${reportType}_${startDate}_${endDate}.csv"`);
    res.send(csvContent);
  } catch (error) {
    logger.error('Failed to export report', error);
    res.status(500).json({ error: 'Failed to export report' });
  }
};

