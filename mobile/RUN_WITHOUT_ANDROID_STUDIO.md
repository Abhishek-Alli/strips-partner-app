# Run Mobile App Without Android Studio

## ✅ Easiest Method: Use Expo Go on Your Phone

### Step 1: Install Expo Go
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS**: https://apps.apple.com/app/expo-go/id982107779

### Step 2: Start Expo (Just show QR code, don't open Android)

In the terminal where Expo is running:
- **Don't press `a`** (that tries to open Android emulator)
- **Just wait** - the QR code will appear automatically
- OR press `Ctrl+C` to stop, then run:
  ```bash
  cd mobile
  npx expo start --tunnel
  ```

### Step 3: Scan QR Code
- **iOS**: Open Camera app → Scan QR code → Opens in Expo Go
- **Android**: Open Expo Go app → Tap "Scan QR code"

### Step 4: Make sure phone and computer are on same WiFi!

---

## ✅ Alternative: Run in Web Browser

In the Expo terminal, press **`w`** to open in web browser.

```bash
# Or run directly:
cd mobile
npm run web
```

---

## ✅ If You Want Android Emulator (Requires Android Studio)

1. **Download Android Studio**: https://developer.android.com/studio
2. **Install Android Studio** (includes Android SDK)
3. **Set up Android Virtual Device (AVD)**
4. **Set ANDROID_HOME environment variable**
5. **Then you can use**: `npm run android`

---

## Current Status

Your Expo server is running! Just:
- **Don't press `a`** (Android)
- **Press `w`** for web, or
- **Wait for QR code** and scan with Expo Go app



