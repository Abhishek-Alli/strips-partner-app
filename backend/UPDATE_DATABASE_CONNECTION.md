# 🔧 Update Database Connection String

## Current Issue
```
Error: getaddrinfo ENOTFOUND db.escmgtuixqydcofpguay.supabase.co
```

The hostname cannot be resolved. This means either:
- The project ID is incorrect
- You need to use Connection Pooler instead of direct connection

## ✅ Solution: Get Correct Connection String from Supabase

### Step 1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard

### Step 2: Find Your Project
- Sign in to your account
- Look for your project (it might have a different ID than `escmgtuixqydcofpguay`)

### Step 3: Get Connection Pooler String (RECOMMENDED)

**Connection Pooler is more reliable than direct connection**

1. Click on your project
2. Go to: **Settings** → **Database**
3. Scroll down to **Connection Pooling** section
4. Select mode: **Transaction** (recommended)
5. Copy the **Connection string** (URI format)

**It should look like:**
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Notice:**
- Uses `pooler.supabase.com` (not `db.xxx.supabase.co`)
- Port is `6543` (not `5432`)
- Has `.pooler.` in the domain

### Step 4: Update backend/.env

Open `backend/.env` and replace the `DATABASE_URL` line with:

```env
DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Important:**
- Replace `[YOUR-PASSWORD]` with your actual database password
- Replace `xxxxx` with your actual project reference ID
- Replace `aws-0-us-east-1` with your actual region (e.g., `aws-0-ap-south-1` for Mumbai)

### Step 5: Test Connection

```bash
cd backend
npm run test-db
```

**Expected output:**
```
Testing database connection...
✅ Database connection successful!
Current time: 2024-01-10T...
```

### Step 6: Restart Backend

```bash
npm start
```

---

## Alternative: Use Direct Connection String

If pooler doesn't work, use direct connection:

1. Supabase Dashboard → Settings → Database
2. Under **Connection string**, select **URI** tab
3. Copy the connection string
4. It should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Update `backend/.env` with this string

**Note:** Direct connection (port 5432) may not always work, especially from localhost. Connection Pooler (port 6543) is recommended.

---

## Verify Your Project ID

To find your correct project ID:
1. Go to Supabase Dashboard
2. Click on your project
3. Go to Settings → General
4. Look for **Reference ID** - this is what should be in your connection string

---

## Common Issues

### Issue 1: "Project not found"
- Make sure you're logged into the correct Supabase account
- Verify the project reference ID matches

### Issue 2: "Connection timeout"
- Try Connection Pooler instead of direct connection
- Check if your firewall is blocking port 6543 or 5432

### Issue 3: "Authentication failed"
- Password might have special characters - make sure they're URL-encoded
- Try resetting your database password in Supabase Dashboard

### Issue 4: "SSL required"
- The code already handles SSL for Supabase connections
- If issues persist, check your connection string format

---

## Quick Test Script

After updating, run:
```bash
cd backend
npm run test-db
```

If successful, you'll see:
```
✅ Database connection successful!
```

Then restart backend and try login again in the web app.


