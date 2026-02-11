import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE ENV VARIABLES NOT SET');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const token = authHeader.replace('Bearer ', '');

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata?.role || 'GENERAL_USER'
    };

    next();
  } catch (err) {
    console.error('AUTH ERROR:', err);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
