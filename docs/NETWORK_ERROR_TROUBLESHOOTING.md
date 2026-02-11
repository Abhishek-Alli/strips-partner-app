# Network Error Troubleshooting Guide

## Problem: "Network error. Please check your connection" or "Cannot connect to server"

This error occurs when the frontend cannot reach the backend API server.

## Quick Fixes

### 1. Ensure Backend Server is Running

The backend must be running before you can use the web app.

```bash
# Navigate to backend directory
cd backend

# Start the backend server
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📊 Environment: development
```

### 2. Check Environment Configuration

Create a `.env` file in the `web` directory if it doesn't exist:

**File: `web/.env`**
```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK=false
```

**Important:** After creating or modifying `.env`, restart the web dev server:
```bash
cd web
npm run dev
```

### 3. Verify Backend is Accessible

Open your browser and visit:
- http://localhost:3000/health - Should return `{"status":"ok",...}`
- http://localhost:3000/ - Should show API information

If these don't work, the backend is not running or not accessible.

### 4. Check CORS Configuration

Ensure your backend `.env` includes:

**File: `backend/.env`**
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:19006
```

The web app typically runs on port 5173 (Vite default).

### 5. Check Port Conflicts

Make sure:
- Backend is running on port 3000 (or update `VITE_API_URL` if using a different port)
- No other application is using port 3000
- Firewall is not blocking localhost connections

## Common Issues

### Issue: "ECONNREFUSED"
**Solution:** Backend server is not running. Start it with `npm run dev` in the backend directory.

### Issue: CORS Error in Browser Console
**Solution:** 
1. Check `CORS_ORIGIN` in `backend/.env` includes your frontend URL
2. Restart backend server after changing `.env`

### Issue: "Failed to fetch"
**Solution:** 
1. Verify backend is running: `curl http://localhost:3000/health`
2. Check if API URL in `web/.env` matches backend port
3. Ensure no proxy/VPN is interfering

### Issue: Environment variables not loading
**Solution:**
1. `.env` file must be in the `web` directory (not `web/src`)
2. Variable names must start with `VITE_` for Vite to expose them
3. Restart dev server after creating/modifying `.env`

## Verification Steps

1. ✅ Backend server is running (`npm run dev` in backend folder)
2. ✅ Backend responds at http://localhost:3000/health
3. ✅ `web/.env` file exists with `VITE_API_URL=http://localhost:3000/api`
4. ✅ Web dev server restarted after creating `.env`
5. ✅ No port conflicts (check with `netstat -ano | findstr :3000` on Windows)

## Testing the Connection

You can test the API connection directly:

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test login endpoint (should return 400 without credentials, not network error)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

If these commands work but the web app doesn't, it's likely an environment variable issue.

## Still Having Issues?

1. Check browser console for detailed error messages
2. Verify both servers are running in separate terminal windows
3. Try accessing the API directly in browser: http://localhost:3000/api/auth/login
4. Check if antivirus/firewall is blocking localhost connections



