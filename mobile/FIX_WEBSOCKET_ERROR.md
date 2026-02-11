# Fix WebSocket Connection Error

## Problem
The app is trying to connect to `ws://localhost:19006/_expo/ws` which fails because:
- On a physical device, `localhost` refers to the device itself, not your computer
- The WebSocket needs to connect to your development server's IP address

## Solution 1: Use Tunnel Mode (Recommended)

This is the easiest and most reliable solution:

```bash
cd mobile
npm run start:tunnel
```

Then scan the QR code. Tunnel mode automatically handles the WebSocket connection correctly.

## Solution 2: Use LAN Mode Properly

1. Make sure your phone and computer are on the **same Wi-Fi network**

2. Start Expo with LAN mode:
   ```bash
   cd mobile
   npm start
   ```

3. When you see the QR code, check the connection URL:
   - It should show something like `exp://192.168.1.100:8081` (your computer's IP)
   - NOT `exp://localhost:8081`

4. If it shows `localhost`, press `s` in the terminal to switch to tunnel mode

## Solution 3: If Running on Web Browser

If you're testing in a web browser, the WebSocket errors are normal and won't affect functionality. The app will still work, but hot reloading might not work.

To run on web properly:
```bash
cd mobile
npm run web
```

## Quick Fix Right Now

1. **Stop the current Expo server** (Ctrl+C)

2. **Start with tunnel mode**:
   ```bash
   cd mobile
   npm run start:tunnel
   ```

3. **Scan the QR code again**

4. The WebSocket errors should disappear!

## Why This Happens

- Expo Go needs to connect to your Metro bundler for hot reloading
- When using `localhost`, the device thinks it's connecting to itself
- Tunnel mode creates a proper connection through Expo's servers
- LAN mode works if both devices are on the same network and the IP is correct
