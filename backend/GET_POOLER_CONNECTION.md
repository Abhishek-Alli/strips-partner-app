# 🔧 Get Connection Pooler String for Project: escmgtuixqydcofpguay

## Quick Link
**Direct link to your project's database settings:**
https://supabase.com/dashboard/project/escmgtuixqydcofpguay/settings/database

## Step-by-Step Instructions

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/escmgtuixqydcofpguay

### 2. Navigate to Database Settings
- Click on **Settings** in the left sidebar
- Click on **Database** under Settings

**OR** use the direct link:
https://supabase.com/dashboard/project/escmgtuixqydcofpguay/settings/database

### 3. Find Connection Pooling Section
Scroll down until you see **Connection Pooling** section

### 4. Select Pooler Mode
- Select **Transaction** mode (recommended)
- Or **Session** mode if Transaction doesn't work

### 5. Copy Connection String
- Click on **URI** tab (if available)
- Copy the **Connection string** shown
- It should look like:

```
postgresql://postgres.escmgtuixqydcofpguay:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Important details:**
- Uses `pooler.supabase.com` (not `db.xxx.supabase.co`)
- Port is `6543` (not `5432`)
- Has `.pooler.` in the domain name
- Region might be: `us-east-1`, `ap-south-1`, `eu-west-1`, etc.

### 6. Update backend/.env

Open `backend/.env` and replace the `DATABASE_URL` line:

**Before (Direct connection - NOT WORKING):**
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.escmgtuixqydcofpguay.supabase.co:5432/postgres
```

**After (Connection Pooler - SHOULD WORK):**
```env
DATABASE_URL=postgresql://postgres.escmgtuixqydcofpguay:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Replace:**
- `[PASSWORD]` with your actual database password
- `[REGION]` with your actual region (e.g., `us-east-1`, `ap-south-1`)

### 7. Test Connection

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

### 8. Restart Backend

```bash
npm start
```

### 9. Test Login in Web App

Try logging in again - it should work now!

---

## Alternative: If You Can't Find Connection Pooling

If Connection Pooling section is not visible, try:

### Option 1: Direct Connection (may not work from localhost)
1. Same page: Settings → Database
2. Under **Connection string**, select **URI** tab
3. Copy the connection string
4. Update `backend/.env`

**Note:** Direct connection (port 5432) often doesn't work from localhost due to network restrictions.

### Option 2: Check Project Status
- Make sure project is **Active** (not paused)
- If paused, click **Resume** and wait 1-2 minutes

### Option 3: Verify Project ID
- Confirm you're in the correct project: `escmgtuixqydcofpguay`
- Check URL: Should be `https://supabase.com/dashboard/project/escmgtuixqydcofpguay`

---

## Troubleshooting

### Still Getting ENOTFOUND Error?
1. Double-check the hostname in connection string
2. Make sure it says `pooler.supabase.com` (not `db.xxx.supabase.co`)
3. Port should be `6543` (not `5432`)
4. Verify password doesn't have spaces or special characters that need URL encoding

### Getting Authentication Error?
1. Check password is correct
2. Make sure password is URL-encoded if it has special characters
3. Try resetting database password in Supabase Dashboard

### Connection Timeout?
1. Check if port 6543 is blocked by firewall
2. Try different region if available
3. Check internet connection

---

## Example Connection String Formats

**Connection Pooler (Recommended):**
```
postgresql://postgres.escmgtuixqydcofpguay:yourpassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Direct Connection (May not work from localhost):**
```
postgresql://postgres:yourpassword@db.escmgtuixqydcofpguay.supabase.co:5432/postgres
```

---

## After Fixing

Once connection test is successful:
1. ✅ Backend will connect to database
2. ✅ Login will work in web app
3. ✅ All API endpoints will function normally


