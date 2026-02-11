import dns from 'dns';
import pool from '../config/database.js';

// Try to fix DNS resolution issues
// Use system DNS resolver (might help with IPv6 issues)
dns.setDefaultResultOrder('ipv4first');

const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    
    // Try to resolve hostname first to debug DNS
    if (process.env.DB_HOST) {
      try {
        console.log(`Resolving hostname: ${process.env.DB_HOST}...`);
        const addresses = await dns.promises.resolve4(process.env.DB_HOST);
        console.log(`✅ IPv4 addresses found: ${addresses.join(', ')}`);
      } catch (dnsError) {
        try {
          const addresses6 = await dns.promises.resolve6(process.env.DB_HOST);
          console.log(`⚠️  Only IPv6 addresses found: ${addresses6.join(', ')}`);
          console.log('   Node.js pg library may have issues with IPv6-only addresses');
        } catch (dnsError6) {
          console.log(`❌ DNS resolution failed: ${dnsError6.message}`);
        }
      }
    }
    
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].now);
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Tip: DNS resolution failed. Possible solutions:');
      console.error('   1. Use Connection Pooler (recommended)');
      console.error('   2. Check if hostname resolves: nslookup db.escmgtuixqydcofpguay.supabase.co');
      console.error('   3. Try using Connection Pooler from Supabase Dashboard');
      console.error('   4. Check network/firewall settings');
    } else if (error.code === '28P01') {
      console.error('\n💡 Tip: Check your DB_USER and DB_PASSWORD');
    } else if (error.code === '3D000') {
      console.error('\n💡 Tip: Check your DB_NAME');
    }
    process.exit(1);
  }
};

testConnection();



