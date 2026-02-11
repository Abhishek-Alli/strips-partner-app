import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

const seed = async () => {
  try {
    console.log('Seeding database...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const dealerPassword = await bcrypt.hash('dealer123', 10);
    const partnerPassword = await bcrypt.hash('partner123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Insert admin user
    await query(
      `INSERT INTO users (email, name, password_hash, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO NOTHING`,
      ['admin@shreeom.com', 'Admin User', adminPassword, 'ADMIN']
    );

    // Insert dealer user
    await query(
      `INSERT INTO users (email, name, password_hash, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO NOTHING`,
      ['dealer@shreeom.com', 'Dealer User', dealerPassword, 'DEALER']
    );

    // Insert partner user
    await query(
      `INSERT INTO users (email, name, password_hash, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO NOTHING`,
      ['partner@shreeom.com', 'Partner User', partnerPassword, 'PARTNER']
    );

    // Insert general user
    await query(
      `INSERT INTO users (email, name, password_hash, role, phone) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING`,
      ['user@shreeom.com', 'General User', userPassword, 'GENERAL_USER', '+1234567890']
    );

    console.log('✅ Database seeded successfully');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@shreeom.com / admin123');
    console.log('Dealer: dealer@shreeom.com / dealer123');
    console.log('Partner: partner@shreeom.com / partner123');
    console.log('User: user@shreeom.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();








