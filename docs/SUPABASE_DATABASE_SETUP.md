# Supabase Database Setup Guide

## Two Ways to Create Tables in Supabase

### ✅ **Option 1: Use Migration Script (Recommended)**

This is the **easiest and recommended** way:

```bash
cd backend
npm install
npm run migrate
```

This will:
- Connect to your Supabase database
- Run all SQL from `backend/src/database/schema.sql`
- Create tables, indexes, functions, and triggers automatically

**Advantages:**
- ✅ Automated
- ✅ Can be run multiple times (uses `IF NOT EXISTS`)
- ✅ Easy to update later
- ✅ Version controlled

---

### 📝 **Option 2: Manual SQL Editor (Alternative)**

If you prefer to do it manually or the migration script doesn't work:

1. **Go to Supabase Dashboard:**
   - Visit: https://escmgtuixqydcofpguay.supabase.co
   - Click **SQL Editor** in the left sidebar

2. **Copy the SQL:**
   - Open `backend/src/database/schema.sql`
   - Copy all the SQL code

3. **Paste and Run:**
   - Paste into the SQL Editor
   - Click **Run** (or press Ctrl+Enter)

**The SQL you need to run:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'GENERAL_USER',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_role CHECK (role IN ('GENERAL_USER', 'PARTNER', 'DEALER', 'ADMIN'))
);

-- OTP table for phone-based authentication
CREATE TABLE IF NOT EXISTS otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);
CREATE INDEX IF NOT EXISTS idx_otps_code ON otps(code);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## What Gets Created?

### Tables:
1. **`users`** - User accounts with roles
2. **`otps`** - OTP codes for phone authentication

### Extensions:
- **`uuid-ossp`** - For generating UUIDs

### Indexes:
- Email, phone, role indexes for fast queries

### Functions & Triggers:
- Auto-update `updated_at` timestamp on user updates

---

## Verify Tables Were Created

### In Supabase Dashboard:
1. Go to **Table Editor** in left sidebar
2. You should see:
   - ✅ `users` table
   - ✅ `otps` table

### Or Run SQL Query:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

## After Creating Tables

### Seed Test Data (Optional):

**Option 1: Use Script**
```bash
cd backend
npm run seed
```

**Option 2: Manual Insert**
You can also insert test users manually via SQL Editor or Table Editor in Supabase.

---

## Future Updates

### Adding New Tables/Columns:

**Recommended Approach:**
1. Update `backend/src/database/schema.sql`
2. Run `npm run migrate` again (it uses `IF NOT EXISTS`, so it's safe)

**Or Manual:**
1. Write SQL for new changes
2. Run in Supabase SQL Editor

---

## Troubleshooting

### "Extension uuid-ossp does not exist"
- Supabase should have this enabled by default
- If error occurs, contact Supabase support or enable manually

### "Permission denied"
- Make sure you're using the correct database user
- Check connection string has proper credentials

### "Table already exists"
- This is OK! The `IF NOT EXISTS` clause prevents errors
- Tables won't be recreated if they already exist

---

## Summary

**For First Time Setup:**
1. ✅ Use `npm run migrate` (easiest)
2. OR copy-paste SQL into Supabase SQL Editor

**For Future Changes:**
- Update `schema.sql` file
- Run migration again
- Or add SQL manually

**All database changes should be in Supabase**, not local storage. Local storage is only for temporary session tokens.

