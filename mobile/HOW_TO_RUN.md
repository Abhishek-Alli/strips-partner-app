# How to Run Mobile App - Step by Step

## Quick Start (3 Steps)

### Step 1: Navigate to Mobile Folder
Open terminal/command prompt and go to the mobile folder:
```bash
cd "C:\Users\abhis\Desktop\softwares\Shree Om\mobile"
```

### Step 2: Start Backend (If not already running)
In a **separate terminal**, make sure backend is running:
```bash
cd "C:\Users\abhis\Desktop\softwares\Shree Om\backend"
npm run dev
```
Backend should be running on port 3001.

### Step 3: Start Mobile App in Chrome
In the mobile folder terminal, run:
```bash
npm run web
```

OR directly:
```bash
npx expo start --web
```

## What Happens Next?

1. **Expo will compile the app** (takes 30-60 seconds)
2. **Chrome will open automatically** with the app
3. **If Chrome doesn't open**, look in terminal for URL like:
   ```
   Web is waiting on http://localhost:19006
   ```
   Copy that URL and paste in Chrome

## To See Errors (Important!)

Once Chrome opens:
1. Press **F12** (or **Ctrl+Shift+I**) to open DevTools
2. Click the **Console** tab
3. All errors and logs will appear here!

## Alternative: Run on Phone (Expo Go)

If you want to test on your actual phone instead:

```bash
cd mobile
npx expo start --lan
```

Then scan QR code with Expo Go app.

## Troubleshooting

### "Port already in use"
- Stop any running Expo instances (Ctrl+C)
- Or use different port: `npx expo start --web --port 19007`

### "Module not found" errors
- Run: `cd mobile && npm install`
- Then: `npx expo install --fix`

### Backend not connecting
- Make sure backend is running on port 3001
- Check: http://localhost:3001/health
- Verify `.env` file has: `EXPO_PUBLIC_API_URL=http://localhost:3001/api`

## Complete Command Sequence

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Mobile Web):**
```bash
cd mobile
npm run web
```

Then open Chrome DevTools (F12) to see everything!



