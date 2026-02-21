import { query } from '../config/database.js';
import nodemailer from 'nodemailer';

// Test SMTP configuration (replace with real config in production)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'test@example.com',
    pass: process.env.SMTP_PASS || 'test-password'
  }
});

/**
 * Submit contact enquiry
 */
export const submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message, recaptchaToken } = req.body;

    // Validation
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // In production, verify reCAPTCHA token here
    // For test mode, we'll skip verification
    if (process.env.NODE_ENV === 'production' && !recaptchaToken) {
      return res.status(400).json({ error: 'reCAPTCHA verification required' });
    }

    // Save enquiry to database
    const result = await query(
      `INSERT INTO contact_enquiries (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, subject, message, created_at`,
      [name, email.toLowerCase(), phone, subject, message]
    );

    const enquiry = result.rows[0];

    // Send confirmation email to user (test mode)
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@shreeom.com',
        to: email,
        subject: 'Thank you for contacting us',
        html: `
          <h2>Thank you for your enquiry</h2>
          <p>Dear ${name},</p>
          <p>We have received your enquiry and will get back to you soon.</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p>Best regards,<br>SRJ Team</p>
        `
      });
    } catch (emailError) {
      // Log but don't fail the request
      console.error('Failed to send confirmation email:', emailError);
    }

    // Notify admin (test mode)
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@shreeom.com';
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@shreeom.com',
        to: adminEmail,
        subject: `New Contact Enquiry: ${subject}`,
        html: `
          <h2>New Contact Enquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
        `
      });
    } catch (emailError) {
      // Log but don't fail the request
      console.error('Failed to send admin notification:', emailError);
    }

    res.status(201).json({
      enquiry,
      message: 'Enquiry submitted successfully'
    });
  } catch (error) {
    console.error('Submit enquiry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get all contact enquiries (Admin only)
 */
export const getAllEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT id, name, email, phone, subject, message, created_at
      FROM contact_enquiries
      WHERE 1=1
    `;
    const queryParams = [];
    let paramCount = 1;

    if (search) {
      queryText += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR subject ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, offset);

    const result = await query(queryText, queryParams);

    // Get total count
    const countResult = await query('SELECT COUNT(*) FROM contact_enquiries');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      enquiries: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get enquiry by ID (Admin only)
 */
export const getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, name, email, phone, subject, message, created_at FROM contact_enquiries WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.json({ enquiry: result.rows[0] });
  } catch (error) {
    console.error('Get enquiry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

