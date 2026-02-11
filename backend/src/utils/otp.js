import { query } from '../config/database.js';

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const saveOTP = async (phone, code) => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(process.env.OTP_EXPIRY_MINUTES || '10'));

  await query(
    `INSERT INTO otps (phone, code, expires_at) 
     VALUES ($1, $2, $3)`,
    [phone, code, expiresAt]
  );
};

export const verifyOTP = async (phone, code) => {
  const result = await query(
    `SELECT id, expires_at, is_used 
     FROM otps 
     WHERE phone = $1 AND code = $2 
     ORDER BY created_at DESC 
     LIMIT 1`,
    [phone, code]
  );

  if (result.rows.length === 0) {
    return { valid: false, error: 'Invalid OTP' };
  }

  const otpRecord = result.rows[0];

  if (otpRecord.is_used) {
    return { valid: false, error: 'OTP already used' };
  }

  if (new Date() > new Date(otpRecord.expires_at)) {
    return { valid: false, error: 'OTP expired' };
  }

  // Mark OTP as used
  await query('UPDATE otps SET is_used = true WHERE id = $1', [otpRecord.id]);

  return { valid: true };
};

export const cleanupExpiredOTPs = async () => {
  await query(
    'DELETE FROM otps WHERE expires_at < CURRENT_TIMESTAMP OR is_used = true'
  );
};








