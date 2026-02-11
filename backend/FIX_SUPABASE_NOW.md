# 🚨 Fix Supabase Database Connection - Step by Step

## Current Error
```
Database connection failed
Cannot connect to database server
```

## ✅ Quick Fix (Most Common - 90% of cases)

### Step 1: Resume Supabase Project

Your Supabase project is likely **paused** (free tier pauses after 1 week of inactivity).

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Sign in with your account

2. **Find your project:**
   - Look for project: `escmgtuixqydcofpguay`
   - Or check URL: https://supabase.com/dashboard/project/escmgtuixqydcofpguay

3. **Resume if paused:**
   - If you see a **"Paused"** badge or **"Resume"** button, click it
   - Wait 1-2 minutes for the project to fully resume

4. **Restart backend:**
   ```bash
   cd backend
   npm start
   ```

5. **Try login again** in the web app

---

## 🔧 If Project is Active (Alternative Fixes)

### Option 1: Use Connection Pooler (Recommended)

Connection pooler is more reliable than direct connection.

1. **Get Pooler Connection String:**
   - Go to: https://supabase.com/dashboard/project/escmgtuixqydcofpguay
   - Navigate to: **Settings** → **Database**
   - Scroll to **Connection Pooling** section
   - Select mode: **Transaction**
   - Copy the **Connection string** (URI format)

2. **Update `backend/.env`:**
   ```env
   DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
   - Replace `[PASSWORD]` with your actual database password
   - The URL should use `pooler.supabase.com` and port `6543`

3. **Restart backend:**
   ```bash
   cd backend
   npm start
   ```

### Option 2: Get Fresh Direct Connection String

If pooler doesn't work, get a fresh direct connection string.

1. **Supabase Dashboard** → **Settings** → **Database**
2. Under **Connection string**, select **URI** tab
3. Copy the connection string
4. It should look like:
   ```
   postgresql://postgres:[PASSWORD]@db.escmgtuixqydcofpguay.supabase.co:5432/postgres
   ```
5. **Update `backend/.env`:**
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.escmgtuixqydcofpguay.supabase.co:5432/postgres
   ```
   - Make sure to replace `[YOUR-PASSWORD]` with your actual password

6. **Restart backend:**
   ```bash
   cd backend
   npm start
   ```

---

## 🧪 Test Database Connection

After updating the connection string, test if it works:

```bash
cd backend
node src/database/test-connection.js
```

**Expected output if successful:**
```
Testing database connection...
✅ Database connection successful!
Current time: 2024-01-10T...
```

**If it fails**, check:
- Password is correct (no spaces, special chars escaped)
- Connection string format is correct
- Project is not paused
- Internet connection is working

---

## ❓ Still Not Working?

### Check These:

1. **Internet Connection**
   - Can you access https://supabase.com in your browser?
   - Is your firewall blocking database connections?

2. **Verify Project ID**
   - Double-check project ID: `escmgtuixqydcofpguay`
   - Make sure you're using the correct Supabase account

3. **Password Issues**
   - Password might have special characters that need escaping
   - Try generating a new password in Supabase Dashboard

4. **Connection Method**
   - Try **Connection Pooler** (port 6543) instead of direct (port 5432)
   - Or vice versa

5. **Backend Logs**
   - Check backend console for detailed error messages
   - Look for `ENOTFOUND`, `ETIMEDOUT`, or `ECONNREFUSED` errors

---

## 📝 Your Current Configuration

Your project uses:
- **Project ID**: `escmgtuixqydcofpguay`
- **Database Host**: `db.escmgtuixqydcofpguay.supabase.co`
- **Port**: `5432` (direct) or `6543` (pooler)

Make sure your `backend/.env` has:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.escmgtuixqydcofpguay.supabase.co:5432/postgres
```

---

## ✅ Success Indicators

Once fixed, you'll see:
1. ✅ Backend starts without database errors
2. ✅ Login page accepts credentials
3. ✅ User dashboard loads successfully
4. ✅ No more "Database connection failed" errors

---

## 🆘 Need Help?

If still stuck:
1. Check backend console logs for exact error
2. Verify Supabase project is active (green status)
3. Test connection using the test script above
4. Try connection pooler method (most reliable)


