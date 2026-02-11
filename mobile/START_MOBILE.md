# Start Mobile App - Quick Instructions

## To See the QR Code:

1. **Open a new terminal/command prompt**
2. **Navigate to the mobile folder:**
   ```bash
   cd "C:\Users\abhis\Desktop\softwares\Shree Om\mobile"
   ```

3. **Start Expo:**
   ```bash
   npm start
   ```
   OR
   ```bash
   npx expo start
   ```

4. **You'll see:**
   - A QR code in the terminal
   - Options to press:
     - Press `a` → Open on Android device/emulator
     - Press `i` → Open on iOS simulator  
     - Press `w` → Open in web browser
     - Press `r` → Reload app
     - Press `m` → Toggle menu

## Alternative: Direct URL

The Expo server will also show URLs like:
- `exp://192.168.x.x:8081` - For Expo Go app
- `http://localhost:8081` - Web version

## Make Sure Backend is Running!

Before scanning QR code, ensure:
1. Backend server is running on port 3001
2. Check: http://localhost:3001/health should work

## For Physical Device (Expo Go):

1. Install **Expo Go** app from App Store/Play Store
2. Scan the QR code with:
   - **iOS**: Use Camera app
   - **Android**: Use Expo Go app to scan
3. App will load on your device

**Note:** Phone and computer must be on the same WiFi network!



