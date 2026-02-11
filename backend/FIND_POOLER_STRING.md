# 🔍 How to Find Connection Pooler String in Supabase Dashboard

## Current Location
You're on: **Database Settings** page
- URL: `supabase.com/dashboard/project/escmgtuixqydcofpguay/database/settings`

## Where to Find Connection Pooler String

### Method 1: Use "Connect" Button (Easiest)

1. **Look at the top right of your Supabase dashboard**
2. **Click the "Connect" button** (next to "main PRODUCTION")
3. A modal/dropdown will open
4. Look for **"Connection Pooling"** tab or section
5. Select **"Transaction"** mode
6. Copy the **Connection string (URI)** shown

### Method 2: Scroll Down on Settings Page

1. On the **Database Settings** page you're currently on
2. **Scroll down** below the "Connection pooling configuration" section
3. Look for a section titled **"Connection string"** or **"Connection info"**
4. You should see tabs like:
   - Direct connection
   - Connection Pooling (Transaction)
   - Connection Pooling (Session)
5. Click on **"Connection Pooling (Transaction)"** tab
6. Copy the **URI** connection string shown

### Method 3: Project Settings → Database

1. Go to: **Settings** → **Database** (in left sidebar)
2. Scroll down to find **"Connection string"** section
3. Select **"Connection Pooling"** tab
4. Choose **"Transaction"** mode
5. Copy the connection string

## What the Connection String Should Look Like

**Connection Pooler (Transaction mode):**
```
postgresql://postgres.escmgtuixqydcofpguay:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Key differences from direct connection:**
- Uses `pooler.supabase.com` (not `db.xxx.supabase.co`)
- Port is `6543` (not `5432`)
- Username might be `postgres.escmgtuixqydcofpguay` or just `postgres`
- Region will be something like `us-east-1`, `ap-south-1`, etc.

## After You Find It

1. Copy the **EXACT** connection string
2. Replace `[YOUR-PASSWORD]` with your actual password: `srjStrips1221`
3. Update `backend/.env`:
   ```env
   DATABASE_URL=<paste-the-exact-connection-string-here>
   ```
4. Test connection:
   ```bash
   cd backend
   npm run test-db
   ```
5. Should show: `✅ Database connection successful!`

## If You Can't Find It

If you don't see Connection Pooling option:
- Your project might be on Free tier which might not show it in all views
- Try Method 1 (Connect button) - this always shows connection strings
- Or check: Settings → Database (different from Database Settings)


