# Run Mobile App in Chrome Browser

## Why Run in Chrome?
- ✅ See errors clearly in browser console (F12)
- ✅ Debug easier with Chrome DevTools
- ✅ Faster development cycle
- ✅ No need for Expo Go app
- ✅ Network issues easier to debug

## How to Run

### Step 1: Stop Current Expo (if running)
Press `Ctrl+C` in the Expo terminal

### Step 2: Start in Web Mode

**Option A: From Expo menu (if already running)**
- In the Expo terminal, press **`w`** to open in web browser

**Option B: Start directly in web mode**
```bash
cd mobile
npm run web
```

OR
```bash
npx expo start --web
```

### Step 3: Chrome will open automatically
- App will open at `http://localhost:19006` (or similar port)
- You can see all errors in browser console (F12)

## Debugging in Chrome

1. **Open DevTools**: Press `F12` or `Ctrl+Shift+I`
2. **Check Console tab**: All errors and logs appear here
3. **Check Network tab**: See API requests and responses
4. **Check Sources tab**: Set breakpoints for debugging

## Important Notes

⚠️ **Some mobile features won't work in web:**
- Camera
- GPS/Location (may have limited support)
- Push notifications
- Native device features

✅ **But you can test:**
- Login/Authentication
- API calls
- Navigation
- UI components
- Most app logic

## If Web Mode Doesn't Work

Check if these packages are installed:
```bash
cd mobile
npm install react-native-web react-dom @expo/metro-runtime
```

## Quick Command

```bash
cd mobile
npm run web
```

Then open Chrome DevTools (F12) to see any errors!



