/**
 * Run Specific Migration
 * 
 * Run a specific migration file
 */

import { query } from '../config/database.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runMigration = async (migrationFile) => {
  try {
    const migrationPath = join(__dirname, 'migrations', migrationFile);
    const sql = readFileSync(migrationPath, 'utf8');

    console.log(`Running migration: ${migrationFile}`);
    await query(sql);
    console.log(`✅ Migration ${migrationFile} completed successfully`);
  } catch (error) {
    console.error(`❌ Error running migration ${migrationFile}:`, error);
    process.exit(1);
  }
};

// Get migration file from command line argument
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('Usage: node run-migration.js <migration-file.sql>');
  process.exit(1);
}

runMigration(migrationFile).then(() => {
  process.exit(0);
});






