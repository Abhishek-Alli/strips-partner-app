import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
console.log('Connection string:', connectionString?.replace(/:([^:@]+)@/, ':***@'));

// Parse connection string manually to debug
if (connectionString) {
  const url = new URL(connectionString);
  console.log('Parsed URL parts:');
  console.log('  Protocol:', url.protocol);
  console.log('  Username:', url.username);
  console.log('  Host:', url.hostname);
  console.log('  Port:', url.port);
  console.log('  Database:', url.pathname.substring(1));
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

pool.query('SELECT NOW()').then(result => {
  console.log('✅ SUCCESS!', result.rows[0]);
  process.exit(0);
}).catch(error => {
  console.error('❌ ERROR:', error.message);
  console.error('Code:', error.code);
  process.exit(1);
});
