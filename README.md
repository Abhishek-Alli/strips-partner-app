# Shree Om Platform

A production-grade mobile + web platform with role-based access control.

## Project Structure

```
shree-om/
├── backend/          # Node.js + Express + PostgreSQL API
├── web/             # React.js Admin Panel
├── mobile/          # React Native Mobile App
└── shared/          # Shared TypeScript types
```

## Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL
- **Web Frontend**: React.js, TypeScript, Material-UI
- **Mobile**: React Native (Expo), TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT + Role-Based Access Control (RBAC)

## User Roles

1. **General User** - Mobile app only
2. **Partner** - Web + limited features
3. **Dealer** - Web + operational features
4. **Admin** - Full web access

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (database already configured)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Configure environment
# See backend/ENV_CONFIG.md for full configuration
# Create .env file with Supabase connection string:
# DATABASE_URL=postgresql://postgres:[PASSWORD]@db.escmgtuixqydcofpguay.supabase.co:5432/postgres

# Get your password from: https://escmgtuixqydcofpguay.supabase.co → Settings → Database

# Test database connection
npm run test-db

# Run migrations
npm run migrate

# Seed database (optional)
npm run seed

# Start server
npm run dev
```

Backend runs on `http://localhost:3000`

### Web Admin Panel Setup

```bash
cd web
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

Web app runs on `http://localhost:5173`

### Mobile App Setup

```bash
cd mobile
npm install

# Configure environment
cp .env.example .env

# Start Expo
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/otp/send` - Send OTP to phone
- `POST /api/auth/otp/verify` - Verify OTP and login
- `GET /api/auth/me` - Get current user (requires auth)

### Users (Admin only)
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Test Credentials

After seeding the database:

- **Admin**: admin@shreeom.com / admin123
- **Dealer**: dealer@shreeom.com / dealer123
- **Partner**: partner@shreeom.com / partner123
- **User**: user@shreeom.com / user123

## Features

- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ OTP-based phone login
- ✅ Protected routes and components
- ✅ Permission-based UI rendering
- ✅ PostgreSQL database with migrations
- ✅ RESTful API architecture
- ✅ Responsive web admin panel
- ✅ Cross-platform mobile app

## Development

### Backend
- Uses Express.js with async/await
- PostgreSQL connection pooling
- JWT token authentication
- Role-based middleware
- Automatic OTP cleanup via cron

### Web
- React 18 with TypeScript
- Material-UI components
- React Router for navigation
- Axios for API calls
- Context API for state management

### Mobile
- React Native with Expo
- React Navigation
- AsyncStorage for persistence
- Platform-aware UI patterns

## Environment Variables

### Backend (.env)
```
PORT=3000

# Supabase Database (Connection String - Recommended)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.escmgtuixqydcofpguay.supabase.co:5432/postgres

# OR Individual Parameters
# DB_HOST=db.escmgtuixqydcofpguay.supabase.co
# DB_PORT=5432
# DB_NAME=postgres
# DB_USER=postgres
# DB_PASSWORD=[YOUR-PASSWORD]
# DB_SSL=true

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
OTP_EXPIRY_MINUTES=10
CORS_ORIGIN=http://localhost:5173,http://localhost:19006
```

**Get your Supabase database password:**
- Go to: https://escmgtuixqydcofpguay.supabase.co
- Navigate to **Settings** → **Database**
- Copy the connection string or password

### Web (.env)
```
VITE_API_URL=http://localhost:3000/api
```

### Mobile (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## License

MIT

