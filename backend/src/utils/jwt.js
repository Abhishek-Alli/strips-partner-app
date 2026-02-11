import jwt from 'jsonwebtoken';

// Access token: short-lived (15 minutes)
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

// Refresh token: long-lived (7 days)
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

// Generate both tokens
export const generateTokenPair = (userId) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId)
  };
};

export const verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh 
    ? (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
    : process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};

// Legacy support
export const generateToken = generateAccessToken;



