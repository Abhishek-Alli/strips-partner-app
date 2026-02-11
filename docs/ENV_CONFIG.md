# Environment Configuration

Create a `.env` file in the `backend/` directory with the following configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Database Configuration (Option 1: Connection String - Recommended)
# Get your connection string from Supabase Dashboard → Settings → Database
# Format: postgresql://postgres:[PASSWORD]@db.escmgtuixqydcofpguay.supabase.co:5432/postgres
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.escmgtuixqydcofpguay.supabase.co:5432/postgres

# OR Individual Parameters (Option 2: If not using connection string)
# DB_HOST=db.escmgtuixqydcofpguay.supabase.co
# DB_PORT=5432
# DB_NAME=postgres
# DB_USER=postgres
# DB_PASSWORD=[YOUR-PASSWORD]
# DB_SSL=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
# Access token expiry (short-lived for security)
JWT_ACCESS_EXPIRES_IN=15m
# Refresh token expiry (long-lived for user convenience)
JWT_REFRESH_EXPIRES_IN=7d
# Optional: Separate secret for refresh tokens (uses JWT_SECRET if not set)
# JWT_REFRESH_SECRET=your-refresh-token-secret

# OTP Configuration
OTP_EXPIRY_MINUTES=10

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:19006

# Supabase Project Info (for reference)
# Project URL: https://escmgtuixqydcofpguay.supabase.co
# Publishable API Key: sb_publishable_e9xpyREqOsge94yYuGTNSw_m2SQX0X6
```

## Getting Your Database Password

1. Go to: https://escmgtuixqydcofpguay.supabase.co
2. Navigate to **Settings** → **Database**
3. Find the **Connection string** section
4. Copy the connection string and extract the password, or use the connection string directly

## Quick Setup

1. Copy this file content to create `.env`:
   ```bash
   cp ENV_CONFIG.md .env
   # Then edit .env and replace [YOUR-PASSWORD] with your actual password
   ```

2. Test the connection:
   ```bash
   npm run test-db
   ```

3. Run migrations:
   ```bash
   npm run migrate
   ```



