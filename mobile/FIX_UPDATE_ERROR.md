# Fix "Failed to Download Remote Update" Error

## Quick Fix (Try This First)

### Option 1: Use Tunnel Mode (Most Reliable)
```bash
cd mobile
npm run start:tunnel
```
Then scan the QR code again. Tunnel mode works even if your phone and computer aren't on the same network.

### Option 2: Clear Cache and Restart
```bash
cd mobile
npm start -- --clear
```
Wait for Metro to start, then scan the QR code.

### Option 3: Check Network Connection
1. Make sure your phone and computer are on the **same Wi-Fi network**
2. Disable VPN on both devices if active
3. Try restarting your Wi-Fi router

### Option 4: Use LAN Mode with Specific IP
1. Find your computer's IP address:
   - Windows: Open PowerShell and run `ipconfig`
   - Look for "IPv4 Address" under your Wi-Fi adapter (e.g., `192.168.1.100`)

2. Start Expo:
   ```bash
   cd mobile
   npm start
   ```

3. When you see the QR code, press `s` to switch to tunnel mode, or manually enter the connection URL

## What Was Changed

✅ **Updates disabled** in `app.json` - This prevents the remote update error
✅ **Tunnel script added** - Run `npm run start:tunnel` for reliable connection

## Still Having Issues?

1. **Close Expo Go app completely** on your phone
2. **Restart Metro bundler**:
   ```bash
   cd mobile
   npm start -- --clear
   ```
3. **Open Expo Go** and scan QR code again
4. If still failing, use tunnel mode: `npm run start:tunnel`

## Troubleshooting

- **Firewall blocking?** Allow Node.js through Windows Firewall
- **Corporate network?** Use tunnel mode (it works through firewalls)
- **Slow connection?** Tunnel mode might be slower but more reliable
