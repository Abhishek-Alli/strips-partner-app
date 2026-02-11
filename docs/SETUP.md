# Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
   ```bash
   node --version
   ```

2. **PostgreSQL** (v14 or higher)
   ```bash
   psql --version
   ```

3. **npm** or **yarn**

## Step-by-Step Setup

### 1. Supabase Database Setup

Your project is configured to use Supabase PostgreSQL.

**Get your database password:**
1. Go to: https://escmgtuixqydcofpguay.supabase.co
2. Navigate to **Settings** → **Database**
3. Copy the **Connection string** (URI format)

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
# See backend/ENV_CONFIG.md for the full configuration
# Or create .env manually with:

# Option 1: Connection String (Recommended)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.escmgtuixqydcofpguay.supabase.co:5432/postgres

# Option 2: Individual Parameters
# DB_HOST=db.escmgtuixqydcofpguay.supabase.co
# DB_PORT=5432
# DB_NAME=postgres
# DB_USER=postgres
# DB_PASSWORD=[YOUR-PASSWORD]
# DB_SSL=true

# Also add:
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
OTP_EXPIRY_MINUTES=10
CORS_ORIGIN=http://localhost:5173,http://localhost:19006

# Test database connection
npm run test-db

# Run database migrations
npm run migrate

# Seed database with test users (optional)
npm run seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Web Admin Panel Setup

```bash
cd web

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file:
# VITE_API_URL=http://localhost:3000/api

# Start development server
npm run dev
```

Web app will run on `http://localhost:5173`

### 4. Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file:
# EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Start Expo
npm start
```

For mobile testing:
- Install Expo Go app on your phone
- Scan QR code from terminal
- Or use Android/iOS emulator

## Testing the Setup

### Backend Health Check
```bash
curl http://localhost:3000/health
```

### Test Login (Backend)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shreeom.com","password":"admin123"}'
```

### Test Credentials

After running `npm run seed` in backend:

- **Admin**: admin@shreeom.com / admin123
- **Dealer**: dealer@shreeom.com / dealer123
- **Partner**: partner@shreeom.com / partner123
- **User**: user@shreeom.com / user123

## Troubleshooting

### Database Connection Issues

1. **Verify Supabase credentials:**
   - Go to Supabase Dashboard → Settings → Database
   - Ensure you're using the correct connection string or password
   - Check that your IP is allowed (Supabase may require IP whitelisting)

2. **Test connection:**
   ```bash
   npm run test-db
   ```

3. **Common errors:**
   - `ENOTFOUND`: Check your DB_HOST or DATABASE_URL
   - `28P01`: Invalid username/password - verify your Supabase password
   - `3D000`: Database doesn't exist - should be `postgres` for Supabase
   - SSL errors: Ensure `DB_SSL=true` or connection string includes SSL

### Port Already in Use

If port 3000 is in use:
```bash
# Change PORT in backend/.env
PORT=3001
```

Update `VITE_API_URL` in `web/.env` accordingly.

### CORS Issues

Ensure `CORS_ORIGIN` in `backend/.env` includes your frontend URLs:
```
CORS_ORIGIN=http://localhost:5173,http://localhost:19006
```

### Mobile App Connection Issues

For physical device testing:
1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Update `EXPO_PUBLIC_API_URL` in `mobile/.env`:
   ```
   EXPO_PUBLIC_API_URL=http://YOUR_IP:3000/api
   ```

3. Ensure backend CORS allows your mobile IP

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use environment-specific database credentials
5. Set up SSL/TLS
6. Use process manager (PM2)

### Web
1. Build for production:
   ```bash
   npm run build
   ```
2. Serve `dist/` folder with Nginx or similar

### Mobile
1. Build native apps:
   ```bash
   expo build:android
   expo build:ios
   ```
2. Update API URL for production

## Next Steps

1. Configure SMS service for OTP (Twilio, AWS SNS, etc.)
2. Add error tracking (Sentry)
3. Set up logging (Winston)
4. Add API rate limiting
5. Implement file uploads
6. Add email notifications
7. Set up CI/CD pipeline

