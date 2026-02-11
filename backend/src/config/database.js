import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use DATABASE_URL if available (simplest and most reliable)
// Only use individual parameters as fallback
let poolConfig;

if (process.env.DATABASE_URL) {
  // Use connection string (Supabase format) - SIMPLEST APPROACH
  const isSupabase = process.env.DATABASE_URL.includes('supabase');

  console.log('Using DATABASE_URL connection string');
  console.log('Host:', process.env.DATABASE_URL.match(/@([^:]+):/)?.[1] || 'unknown');
  console.log('User:', process.env.DATABASE_URL.match(/\/\/([^:]+):/)?.[1] || 'unknown');

  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: isSupabase ? { rejectUnauthorized: false } : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    // Force IPv4 to avoid IPv6 timeout issues
    family: 4,
  };
} else if (process.env.DB_HOST) {
  // Fallback to individual parameters
  const isSupabase = process.env.DB_HOST.includes('supabase');
  
  poolConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: isSupabase || process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    family: 0,
  };
} else {
  // Default fallback
  poolConfig = {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
    ssl: false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error', error);
    throw error;
  }
};

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export default pool;

