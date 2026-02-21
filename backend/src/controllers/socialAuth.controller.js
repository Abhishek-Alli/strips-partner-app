/**
 * Social Auth Controller
 *
 * Verifies Google / Facebook OAuth tokens server-side using
 * Node's built-in https module (no extra packages needed).
 * On success, returns JWT pair for existing users, or
 * { newUser: true, profile } so mobile can redirect to registration.
 */

import https from 'https';
import { query } from '../config/database.js';
import config from '../config/env.config.js';
import { generateTokenPair } from '../utils/jwt.js';

const logger = {
  error: (msg, err) => console.error(`[socialAuth] ${msg}`, err),
};

/** Helper: GET JSON from a URL */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

/**
 * POST /api/auth/social/google
 * Body: { idToken }
 */
export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'idToken is required' });

    // Verify token with Google
    const googleData = await httpsGet(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );

    if (googleData.error) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    // Validate audience matches our client ID
    const clientId = config.oauth?.google?.clientId;
    if (clientId && googleData.aud !== clientId) {
      return res.status(401).json({ error: 'Token audience mismatch' });
    }

    const { email, name, picture, sub: googleId } = googleData;
    if (!email) return res.status(401).json({ error: 'Email not provided by Google' });

    await _handleSocialLogin(req, res, { email, name, picture, providerId: googleId, provider: 'google' });
  } catch (error) {
    logger.error('Google login error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
};

/**
 * POST /api/auth/social/facebook
 * Body: { accessToken }
 */
export const facebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ error: 'accessToken is required' });

    // Verify token with Facebook Graph API
    const fbData = await httpsGet(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${encodeURIComponent(accessToken)}`
    );

    if (fbData.error) {
      return res.status(401).json({ error: 'Invalid Facebook token', detail: fbData.error.message });
    }

    const { email, name, picture, id: fbId } = fbData;
    const pictureUrl = picture?.data?.url || null;
    if (!email) return res.status(401).json({ error: 'Email permission not granted by Facebook' });

    await _handleSocialLogin(req, res, { email, name, picture: pictureUrl, providerId: fbId, provider: 'facebook' });
  } catch (error) {
    logger.error('Facebook login error:', error);
    res.status(500).json({ error: 'Facebook authentication failed' });
  }
};

/**
 * Shared logic: look up user by email and return tokens or newUser flag
 */
async function _handleSocialLogin(req, res, { email, name, picture, providerId, provider }) {
  const existingResult = await query(
    'SELECT id, email, name, role, is_active FROM users WHERE email = $1',
    [email]
  );

  if (existingResult.rows.length > 0) {
    const user = existingResult.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Update social provider ID if not set
    await query(
      `UPDATE users SET ${provider}_id = $1, avatar_url = COALESCE(avatar_url, $2), updated_at = NOW() WHERE id = $3`,
      [providerId, picture, user.id]
    ).catch(() => {}); // non-fatal

    const { accessToken, refreshToken } = await generateTokenPair(user);

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id:    user.id,
        email: user.email,
        name:  user.name,
        role:  user.role,
      },
    });
  }

  // New user — return profile data so mobile can complete registration
  res.json({
    newUser: true,
    provider,
    profile: { email, name, picture, providerId },
  });
}
