# Mobile App Environment Setup - Fix Loading Issue

## Problem
Phone scanned QR code but app is stuck loading. This is because:
- Phone is trying to connect to `localhost:3001` which doesn't work on physical devices
- Need to use your computer's IP address instead: `192.168.6.237`

## Fix Steps

### Step 1: Create `.env` file in `mobile` folder

**File: `mobile/.env`**
```env
EXPO_PUBLIC_API_URL=http://192.168.6.237:3001/api
EXPO_PUBLIC_USE_MOCK=false
EXPO_PUBLIC_ENABLE_DEBUG=true
```

**Important:** Create this file manually in the `mobile` folder!

### Step 2: Update Backend CORS

Add Expo connections to your `backend/.env`:

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,exp://192.168.6.237:8081,exp://localhost:8081
```

Or simply allow all origins for development:
```env
CORS_ORIGIN=*
```

### Step 3: Verify Both Devices on Same WiFi

- Phone and computer MUST be on the same WiFi network
- Both should be on the same network as IP `192.168.6.237`

### Step 4: Restart Everything

1. **Stop Expo** (Ctrl+C)
2. **Stop Backend** (Ctrl+C) 
3. **Restart Backend:**
   ```bash
   cd backend
   npm run dev
   ```
4. **Restart Expo:**
   ```bash
   cd mobile
   npm start
   ```
5. **Clear Expo cache** (if still having issues):
   ```bash
   cd mobile
   npx expo start -c
   ```

### Step 5: Test Backend from Phone

On your phone's browser, try opening:
```
http://192.168.6.237:3001/health
```

If this works, backend is accessible. If not, check:
- Firewall settings (Windows Defender might block port 3001)
- WiFi network (both devices on same network)

## Alternative: Use Expo Tunnel

If network issues persist, use Expo tunnel:

```bash
cd mobile
npx expo start --tunnel
```

This creates a tunnel but is slower.

## Quick Test

1. Create `mobile/.env` with IP address
2. Restart Expo: `cd mobile && npx expo start -c`
3. Scan QR code again
4. App should load!



