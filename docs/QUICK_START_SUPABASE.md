# Quick Start with Supabase

## Your Supabase Project
- **Project URL**: https://escmgtuixqydcofpguay.supabase.co
- **Publishable API Key**: sb_publishable_e9xpyREqOsge94yYuGTNSw_m2SQX0X6

## Step 1: Get Database Password

1. Go to: https://escmgtuixqydcofpguay.supabase.co
2. Click **Settings** (gear icon) → **Database**
3. Scroll to **Connection string** section
4. Copy the **URI** connection string (it looks like):
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   OR find the password in the **Connection parameters** section

## Step 2: Configure Backend

```bash
cd backend

# Create .env file
touch .env
```

Add this to `backend/.env`:

```env
PORT=3000
NODE_ENV=development

# Use the connection string from Supabase (replace [PASSWORD])
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.escmgtuixqydcofpguay.supabase.co:5432/postgres

# OR use individual parameters:
# DB_HOST=db.escmgtuixqydcofpguay.supabase.co
# DB_PORT=5432
# DB_NAME=postgres
# DB_USER=postgres
# DB_PASSWORD=[YOUR-PASSWORD]
# DB_SSL=true

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
OTP_EXPIRY_MINUTES=10
CORS_ORIGIN=http://localhost:5173,http://localhost:19006
```

**Important:** Replace `[YOUR-PASSWORD]` with your actual Supabase database password.

## Step 3: Test Connection

```bash
npm install
npm run test-db
```

If successful, you'll see: `✅ Database connection successful!`

## Step 4: Run Migrations

```bash
npm run migrate
```

This will create the `users` and `otps` tables in your Supabase database.

## Step 5: Seed Test Data (Optional)

```bash
npm run seed
```

This creates test users:
- Admin: admin@shreeom.com / admin123
- Dealer: dealer@shreeom.com / dealer123
- Partner: partner@shreeom.com / partner123
- User: user@shreeom.com / user123

## Step 6: Start Backend

```bash
npm run dev
```

Backend will run on `http://localhost:3000`

## Troubleshooting

### Connection Failed?
- Verify password is correct (no extra spaces)
- Check that your IP is allowed in Supabase (Settings → Database → Connection Pooling)
- Ensure `DB_SSL=true` if using individual parameters

### Migration Failed?
- Make sure you ran `npm run test-db` successfully first
- Check Supabase dashboard for any error messages
- Verify you have permissions to create tables

### Need Help?
- Check `backend/SUPABASE_SETUP.md` for detailed instructions
- Check `backend/ENV_CONFIG.md` for environment variable reference

## Next Steps

1. Start the web admin panel (see `web/` directory)
2. Start the mobile app (see `mobile/` directory)
3. Test login with seeded credentials



