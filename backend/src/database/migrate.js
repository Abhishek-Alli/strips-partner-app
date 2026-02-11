import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrate = async () => {
  try {
    console.log('Running database migrations...');
    
    // Run main schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await query(schema);
    console.log('✅ Main schema completed');
    
    // Run additional migrations if they exist
    const migrationsDir = path.join(__dirname, 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();
      
      for (const file of migrationFiles) {
        console.log(`Running migration: ${file}`);
        const migrationPath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        await query(migrationSQL);
        console.log(`✅ ${file} completed`);
      }
    }
    
    console.log('✅ All database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();



