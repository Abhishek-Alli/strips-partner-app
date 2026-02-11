# Mobile App Quick Start Guide

## Prerequisites

1. **Node.js 18+** installed
2. **Expo CLI** (installed automatically with npm install)
3. **Expo Go app** on your phone (for testing):
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment (Optional)

Create a `.env` file in the `mobile` directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_USE_MOCK=false
EXPO_PUBLIC_ENABLE_DEBUG=true
```

**Note:** If running on a physical device, use your computer's IP address instead of `localhost`:
```env
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3001/api
```

To find your IP address:
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` or `ip addr`

### 3. Start the Backend Server

Make sure the backend is running on port 3001:
```bash
cd backend
npm run dev
```

### 4. Run the Mobile App

```bash
cd mobile
npm start
```

This will:
- Start the Expo development server
- Show a QR code in the terminal
- Open Expo DevTools in your browser

## Running on Devices

### Option 1: Expo Go App (Recommended for Development)

1. Install **Expo Go** app on your phone
2. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
3. The app will load on your device

### Option 2: Android Emulator

```bash
npm run android
```

Requires Android Studio and an emulator set up.

### Option 3: iOS Simulator (Mac only)

```bash
npm run ios
```

Requires Xcode installed.

### Option 4: Web Browser

```bash
npm run web
```

Runs the app in a web browser (limited React Native web support).

## Important Notes

### Network Configuration for Physical Devices

When testing on a physical device:
1. **Phone and computer must be on the same WiFi network**
2. Use your computer's local IP address, not `localhost`
3. Update `.env` with: `EXPO_PUBLIC_API_URL=http://YOUR_IP:3001/api`
4. Restart Expo after changing `.env`

### Backend CORS Configuration

Make sure your backend `.env` includes:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,exp://localhost:19000
```

For production, add your app's URLs.

## Troubleshooting

### App can't connect to backend
- Check if backend is running on port 3001
- Verify IP address in `.env` is correct
- Ensure phone and computer are on same WiFi
- Check backend CORS settings

### Metro bundler errors
- Clear cache: `npx expo start -c`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Port already in use
- Change port: `npx expo start --port 8082`
- Or kill the process using the port

## Default Test Credentials

After seeding the backend database:
- **Admin**: admin@shreeom.com / admin123
- **User**: user@shreeom.com / user123
- **Partner**: partner@shreeom.com / partner123
- **Dealer**: dealer@shreeom.com / dealer123



