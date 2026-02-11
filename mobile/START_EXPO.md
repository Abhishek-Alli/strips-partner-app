# Start Expo with Specific Port

## Current Situation
- Port 8081 is already in use by another process (likely another Expo instance)
- Port 8082 is available and works fine

## Option 1: Use Port 8082 (Recommended)

When prompted `Use port 8082 instead?`, press **Y** (Yes) or just press Enter.

OR run directly:
```bash
cd mobile
npx expo start --lan --port 8082
```

## Option 2: Free Port 8081 First

If you want to use port 8081 specifically:

1. **Find what's using port 8081:**
   ```bash
   netstat -ano | findstr :8081
   ```

2. **Kill that process:**
   ```bash
   taskkill /PID 12552 /F
   ```
   (Replace 12552 with the actual PID)

3. **Then start Expo:**
   ```bash
   npx expo start --lan --port 8081
   ```

## Option 3: Use Default Expo Port (19000)

```bash
cd mobile
npx expo start --lan --port 19000
```

## Quick Answer

**Just press Y** to use port 8082 - it works perfectly fine!

The important part is:
- ✅ Using `--lan` flag (so phone can connect)
- ✅ Port doesn't matter as long as it's available
- ✅ QR code will work with any available port



