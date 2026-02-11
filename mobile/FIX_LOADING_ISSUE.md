# Fix Loading Issue - Step by Step

## Problem
Expo is using `exp://127.0.0.1:8082` (localhost) which doesn't work on physical devices.

## Solution

### Step 1: Stop Expo (Ctrl+C in the Expo terminal)

### Step 2: Verify .env file exists in `mobile` folder

The file should contain:
```env
EXPO_PUBLIC_API_URL=http://192.168.6.237:3001/api
EXPO_PUBLIC_USE_MOCK=false
EXPO_PUBLIC_ENABLE_DEBUG=true
```

### Step 3: Start Expo with LAN mode

Run this command in the `mobile` folder:

```bash
npx expo start --lan
```

This will:
- Use your computer's IP address (192.168.6.237) instead of localhost
- Show QR code that works on physical devices
- Display `exp://192.168.6.237:8082` instead of `exp://127.0.0.1:8082`

### Step 4: Alternative - Use Tunnel Mode

If LAN doesn't work, use tunnel:

```bash
npx expo start --tunnel
```

Slower but works even if devices are on different networks.

### Step 5: Make sure backend is accessible

On your phone's browser, test:
```
http://192.168.6.237:3001/health
```

If this doesn't work:
1. Check Windows Firewall - allow port 3001
2. Verify both devices on same WiFi
3. Check backend is running: `http://localhost:3001/health`

### Step 6: Update Backend CORS

Make sure `backend/.env` has:
```env
CORS_ORIGIN=*
```

Or specifically:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,exp://192.168.6.237:8082,exp://localhost:8082
```

## Quick Fix Command

```bash
cd mobile
npx expo start --lan --clear
```

The `--lan` flag is the key! It makes Expo use your IP address instead of localhost.



