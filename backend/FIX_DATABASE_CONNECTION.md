# 🔧 Fix Database Connection Issue

## Problem
```
Error: getaddrinfo ENOTFOUND db.escmgtuixqydcofpguay.supabase.co
```

Backend is running but cannot connect to Supabase database.

## Quick Fix: Check Supabase Project Status

**Most common cause: Supabase project is paused** (free tier pauses after 1 week of inactivity)

### Steps:
1. Go to: https://supabase.com/dashboard
2. Sign in to your account
3. Find project: `escmgtuixqydcofpguay`
4. If you see a "Paused" or "Resume" button, click it
5. Wait 1-2 minutes for project to resume
6. Restart backend: `npm start`

---

## Alternative Fix: Use Connection Pooler (Recommended)

Connection pooler is more reliable than direct connection.

### Steps:
1. Go to Supabase Dashboard → Your Project
2. Navigate to: **Settings** → **Database**
3. Scroll to **Connection Pooling** section
4. Select mode: **Transaction**
5. Copy the **Connection string** (URI format)
6. It should look like:
   ```
   postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
   Note: Uses `pooler.supabase.com` and port `6543`

7. Update `backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

8. Restart backend:
   ```bash
   cd backend
   npm start
   ```

---

## Alternative Fix: Get Fresh Connection String

If pooler doesn't work, get a fresh direct connection string:

1. Supabase Dashboard → Settings → Database
2. Under **Connection string**, select **URI** tab
3. Copy the connection string
4. Make sure it includes your password
5. Update `backend/.env` with the new string
6. Restart backend

---

## Test Database Connection

After updating connection string:

```bash
cd backend
node src/database/test-connection.js
```

Expected output:
```
Testing database connection...
✅ Database connection successful!
Current time: 2024-...
```

---

## Still Not Working?

1. **Check internet connection** - Can you access https://supabase.com?
2. **Verify project name** - Make sure project ID is correct
3. **Check credentials** - Password might have changed
4. **Try different connection method**:
   - Direct connection (port 5432)
   - Connection pooler (port 6543)
   - Session mode vs Transaction mode

---

## Temporary Workaround: Use Mock Data

If you need to test the app while fixing database:

1. In `backend/.env`, add:
   ```env
   USE_MOCK_DATA=true
   ```

2. This will bypass database for authentication (check if this feature exists)

---

## After Fixing

Once database connects successfully:
1. Backend will log: `✅ Database connection successful!`
2. Login will work in web app
3. All API endpoints will function normally


