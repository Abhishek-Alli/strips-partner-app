# Port Configuration Guide

## Problem: Port 3000 Already in Use

If you have another project running on port 3000, you need to configure this project to use a different port.

## Solution: Use Port 3001

### Step 1: Configure Backend Port

Add or update the `PORT` variable in your `backend/.env` file:

```env
PORT=3001
```

If you don't have a `.env` file in the `backend` folder, create one with:

```env
PORT=3001
DATABASE_URL=your_database_url_here
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

### Step 2: Update Frontend Configuration

Update the `web/.env` file (or create it if it doesn't exist):

```env
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCK=false
```

### Step 3: Restart Both Servers

1. **Stop the backend server** (if running) - Press `Ctrl+C`
2. **Restart backend:**
   ```bash
   cd backend
   npm run dev
   ```
   You should see: `🚀 Server running on port 3001`

3. **Restart frontend:**
   ```bash
   cd web
   npm run dev
   ```

### Step 4: Verify

1. Check backend is running: http://localhost:3001/health
2. Check frontend console shows: `API Client initialized` with `apiUrl: 'http://localhost:3001/api'`
3. Try logging in

## Alternative Ports

You can use any available port (3002, 3003, etc.). Just make sure:
- Backend `.env` has `PORT=YOUR_PORT`
- Frontend `.env` has `VITE_API_URL=http://localhost:YOUR_PORT/api`
- CORS_ORIGIN includes your frontend URL

## Troubleshooting

### Port Still in Use Error
- Make sure you restarted the backend after changing `.env`
- Check if another process is using the port: `netstat -ano | findstr :3001` (Windows)

### CORS Errors
- Make sure `CORS_ORIGIN` in backend `.env` includes your frontend URL
- Default is `*` which allows all origins, but it's better to specify

### Frontend Still Using Old Port
- Hard refresh browser: `Ctrl + Shift + R`
- Restart the web dev server after changing `.env`



