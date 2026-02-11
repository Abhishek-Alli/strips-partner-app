/**
 * Verify All Tables Exist in Supabase
 * 
 * This script checks if all expected tables exist in the database
 */

import { query } from '../config/database.js';

const expectedTables = [
  // Core tables
  'users',
  'otps',
  'contact_enquiries',
  
  // Dealer tables
  'master_products',
  'dealer_products',
  'dealer_enquiries',
  'dealer_feedbacks',
  'dealer_offers',
  
  // Admin tables
  'events',
  'event_invites',
  'partner_works',
  'steel_market_updates',
  'guest_lectures',
  'trading_advices',
  'upcoming_projects',
  'tenders',
  'education_posts',
  'quizzes',
  'quiz_attempts',
  'admin_notes',
  'offers',
  'checklists',
  'visualization_requests',
  'shortcuts_links',
  'videos',
  'dealership_applications',
  'loyalty_points',
];

const verifyTables = async () => {
  try {
    console.log('Verifying database tables...\n');
    
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const existingTables = result.rows.map(row => row.table_name);
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));
    const extraTables = existingTables.filter(table => !expectedTables.includes(table));
    
    console.log(`✅ Found ${existingTables.length} tables in database\n`);
    
    if (missingTables.length > 0) {
      console.log('❌ Missing tables:');
      missingTables.forEach(table => console.log(`   - ${table}`));
      console.log('\n💡 Run migrations: npm run migrate\n');
    } else {
      console.log('✅ All expected tables exist!\n');
    }
    
    if (extraTables.length > 0) {
      console.log('ℹ️  Extra tables (not in expected list):');
      extraTables.forEach(table => console.log(`   - ${table}`));
      console.log('');
    }
    
    // Verify columns for key tables
    console.log('Verifying key table columns...\n');
    
    const keyTables = ['users', 'dealer_products', 'events', 'quizzes'];
    for (const tableName of keyTables) {
      if (existingTables.includes(tableName)) {
        const columnsResult = await query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position
        `, [tableName]);
        
        console.log(`📋 ${tableName}:`);
        columnsResult.rows.forEach(col => {
          console.log(`   - ${col.column_name} (${col.data_type})`);
        });
        console.log('');
      }
    }
    
    console.log('✅ Database verification complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
};

verifyTables();






