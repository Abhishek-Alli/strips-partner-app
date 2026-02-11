# Shree Om Backend API

Node.js backend with Express and PostgreSQL for the Shree Om platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. **Configure Database:**
   - Set up your PostgreSQL database (Supabase, local, or other provider)
   - Navigate to **Settings** → **Database** in your database provider
   - Copy the **Connection string** (URI format)
   - Update `DATABASE_URL` in `.env` file with your connection string
   - Format: `postgresql://user:password@host:port/database`

4. Run migrations:
```bash
npm run migrate
```

5. Seed database (optional):
```bash
npm run seed
```

6. Start server:
```bash
# Development
npm run dev

# Production
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

After seeding:
- Admin: admin@shreeom.com / admin123
- Dealer: dealer@shreeom.com / dealer123
- Partner: partner@shreeom.com / partner123
- User: user@shreeom.com / user123

