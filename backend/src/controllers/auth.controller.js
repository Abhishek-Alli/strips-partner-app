import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { generateTokenPair } from '../utils/jwt.js';
import { generateOTP, saveOTP, verifyOTP } from '../utils/otp.js';

export const login = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    // Support both email and phone login
    let queryText, queryParams;
    if (email) {
      queryText = 'SELECT id, email, name, role, phone, password_hash, is_active FROM users WHERE email = $1';
      queryParams = [email.toLowerCase()];
    } else if (phone) {
      queryText = 'SELECT id, email, name, role, phone, password_hash, is_active FROM users WHERE phone = $1';
      queryParams = [phone];
    } else {
      return res.status(400).json({ error: 'Email or phone is required' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    let result;
    try {
      result = await query(queryText, queryParams);
    } catch (dbError) {
      console.error('Database connection error during login:', dbError);
      // Handle all database connection errors
      if (dbError.code === 'ENOTFOUND' || dbError.code === 'ETIMEDOUT' || dbError.code === 'ECONNREFUSED') {
        return res.status(503).json({ 
          error: 'Database unavailable',
          message: 'Cannot connect to database server. Please check Supabase project status or connection string.',
          code: 'DATABASE_CONNECTION_ERROR',
          details: dbError.message
        });
      }
      // For other database errors, return a more helpful message
      if (dbError.code && dbError.code.startsWith('E')) {
        return res.status(503).json({ 
          error: 'Database error',
          message: 'Database connection failed. Please check Supabase project status.',
          code: 'DATABASE_ERROR',
          details: dbError.message
        });
      }
      throw dbError; // Re-throw other database errors (like query errors)
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    if (!user.password_hash) {
      return res.status(401).json({ error: 'Password not set. Please use OTP login.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokenPair(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Check if it's a database connection error that wasn't caught in inner try-catch
    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'Database unavailable',
        message: 'Cannot connect to database server. Please check Supabase project status or connection string.',
        code: 'DATABASE_CONNECTION_ERROR',
        details: error.message
      });
    }
    
    // Check if response was already sent (database catch block already returned)
    if (res.headersSent) {
      return;
    }
    
    // Generic server error
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred during login',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'GENERAL_USER', referralCode } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Name, email, phone, and password are required' });
    }

    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2',
      [email.toLowerCase(), phone]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email or phone already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (inactive until OTP verified)
    const result = await query(
      `INSERT INTO users (name, email, phone, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5, false)
       RETURNING id, email, name, role, phone, is_active`,
      [name, email.toLowerCase(), phone, passwordHash, role]
    );

    const user = result.rows[0];

    // Generate and save OTP
    const otp = generateOTP();
    await saveOTP(phone, otp);

    // TODO: Send OTP via SMS/Email gateway
    console.log(`OTP for ${phone}: ${otp}`); // Remove in production

    res.status(201).json({
      message: 'Registration successful. Please verify OTP to activate your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const registerWithSocial = async (req, res) => {
  try {
    const { name, email, phone, role = 'GENERAL_USER', referralCode, socialId, provider } = req.body;

    if (!name || !email || !phone || !socialId || !provider) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2',
      [email.toLowerCase(), phone]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email or phone already exists' });
    }

    // Create user (inactive until OTP verified)
    const result = await query(
      `INSERT INTO users (name, email, phone, role, is_active)
       VALUES ($1, $2, $3, $4, false)
       RETURNING id, email, name, role, phone, is_active`,
      [name, email.toLowerCase(), phone, role]
    );

    const user = result.rows[0];

    // Generate and save OTP
    const otp = generateOTP();
    await saveOTP(phone, otp);

    // TODO: Send OTP via SMS/Email gateway
    console.log(`OTP for ${phone}: ${otp}`); // Remove in production

    res.status(201).json({
      message: 'Registration successful. Please verify OTP to activate your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Social register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendRegistrationOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ error: 'Email and phone are required' });
    }

    // Check if user exists and is inactive
    const result = await query(
      'SELECT id, is_active FROM users WHERE email = $1 AND phone = $2',
      [email.toLowerCase(), phone]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (result.rows[0].is_active) {
      return res.status(400).json({ error: 'Account is already activated' });
    }

    // Generate and save OTP
    const otp = generateOTP();
    await saveOTP(phone, otp);

    // TODO: Send OTP via SMS/Email gateway
    console.log(`OTP for ${phone}: ${otp}`); // Remove in production

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send registration OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    if (!email || !phone || !otp) {
      return res.status(400).json({ error: 'Email, phone, and OTP are required' });
    }

    // Verify OTP
    const verification = await verifyOTP(phone, otp);
    if (!verification.valid) {
      return res.status(400).json({ error: verification.error || 'Invalid or expired OTP' });
    }

    // Activate user
    const result = await query(
      `UPDATE users SET is_active = true
       WHERE email = $1 AND phone = $2
       RETURNING id, email, name, role, phone, is_active`,
      [email.toLowerCase(), phone]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Verify registration OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const result = await query(
      'SELECT id, phone FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      // Don't reveal if user exists for security
      return res.json({ message: 'If the email exists, a reset code has been sent' });
    }

    const user = result.rows[0];

    // Generate and save OTP
    const otp = generateOTP();
    await saveOTP(user.phone, otp);

    // TODO: Send OTP via SMS/Email gateway
    console.log(`Password reset OTP for ${user.phone}: ${otp}`); // Remove in production

    res.json({ message: 'If the email exists, a reset code has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    // Get user
    const userResult = await query(
      'SELECT id, phone FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Verify OTP
    const isValid = await verifyOTP(user.phone, otp);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, user.id]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const { verifyToken } = await import('../utils/jwt.js');
    const decoded = verifyToken(refreshToken, true);

    const result = await query(
      'SELECT id, email, name, role, phone, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({ error: 'Invalid refresh token or user inactive' });
    }

    const user = result.rows[0];
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokenPair(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        is_active: user.is_active
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const otp = generateOTP();
    await saveOTP(phone, otp);

    // TODO: Send OTP via SMS gateway
    console.log(`OTP for ${phone}: ${otp}`); // Remove in production

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyOTPLogin = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    const verification = await verifyOTP(phone, otp);
    if (!verification.valid) {
      return res.status(400).json({ error: verification.error || 'Invalid or expired OTP' });
    }

    // Get or create user
    let result = await query(
      'SELECT id, email, name, role, phone, is_active FROM users WHERE phone = $1',
      [phone]
    );

    let user;
    if (result.rows.length === 0) {
      // Create user if doesn't exist
      const createResult = await query(
        `INSERT INTO users (name, email, phone, role, is_active)
         VALUES ($1, $2, $3, $4, true)
         RETURNING id, email, name, role, phone, is_active`,
        [`User_${phone}`, `${phone}@temp.com`, phone, 'GENERAL_USER']
      );
      user = createResult.rows[0];
    } else {
      user = result.rows[0];
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    const { accessToken, refreshToken } = generateTokenPair(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('OTP login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
