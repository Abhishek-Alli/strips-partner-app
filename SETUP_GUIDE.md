# Shree Om Platform - Setup Guide

## Overview

This guide covers setting up the Shree Om platform with Supabase as the backend database.

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Git

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon Key (public)
   - Service Role Key (private - keep secure!)

### 1.2 Run Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Run the main schema file:
   ```
   backend/src/database/shreeom-database.sql
   ```

### 1.3 Run RLS Policies

After the schema is created, run the RLS policies:
```
backend/src/database/rls-policies.sql
```

### 1.4 Configure Storage Buckets

Run the storage bucket configuration:
```
backend/src/database/storage-buckets.sql
```

## Step 2: Backend Setup

### 2.1 Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# Supabase
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development
```

### 2.2 Install Dependencies

```bash
cd backend
npm install
```

### 2.3 Test Database Connection

```bash
npm run test-db
```

### 2.4 Run Migrations (if needed)

```bash
npm run migrate
```

### 2.5 Seed Test Data

```bash
npm run seed
```

### 2.6 Start Backend Server

```bash
npm run dev
```

Server will start at `http://localhost:3001`

## Step 3: Frontend Setup

### 3.1 Environment Variables

Create `web/.env`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCK=false
VITE_ENV=development
```

### 3.2 Install Dependencies

```bash
cd web
npm install
```

### 3.3 Start Frontend

```bash
npm run dev
```

Frontend will start at `http://localhost:5173`

## Step 4: Test Credentials

After seeding, use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shreeom.com | admin123 |
| Dealer | dealer@shreeom.com | dealer123 |
| Partner | partner@shreeom.com | partner123 |
| User | user@shreeom.com | user123 |

## API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/otp/request` - Request OTP
- `POST /api/auth/otp/verify` - Verify OTP
- `POST /api/auth/refresh` - Refresh access token

### Admin Routes (requires ADMIN role)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET/POST/PUT/DELETE /api/admin/users` - User management
- `GET/POST/PUT/DELETE /api/admin/products` - Product catalogue
- `GET/POST/PUT/DELETE /api/admin/events` - Events
- `GET/POST/PUT/DELETE /api/admin/content/*` - CMS content
- `GET/POST/PUT/DELETE /api/admin/offers` - Offers
- `GET/POST/PUT/DELETE /api/admin/quizzes` - Quizzes
- `GET/POST /api/admin/enquiries` - Enquiries
- `GET/DELETE /api/admin/feedbacks` - Feedback moderation

### Dealer Routes (requires DEALER role)
- `GET /api/dealer/:dealerId/stats` - Dashboard stats
- `GET/POST/PUT/DELETE /api/dealer/products` - Dealer products
- `GET/POST /api/dealer/enquiries` - Enquiries
- `GET/POST /api/dealer/feedbacks` - Feedbacks

### Partner Routes (requires PARTNER role)
- `GET /api/partner/dashboard` - Dashboard stats
- `GET/POST/PUT/DELETE /api/partner/works` - Portfolio works
- `GET/POST /api/partner/enquiries` - Enquiries
- `GET/POST /api/partner/feedbacks` - Feedbacks
- `GET /api/partner/analytics` - Analytics
- `GET /api/partner/gallery` - Gallery

### File Upload
- `POST /api/upload` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `DELETE /api/upload/:id` - Delete file
- `GET /api/upload/my-files` - Get user's files

## Storage Buckets

| Bucket | Purpose | Max Size |
|--------|---------|----------|
| admin-uploads | Admin CMS content | 50MB |
| dealer-uploads | Dealer product images | 20MB |
| partner-uploads | Partner portfolio | 30MB |
| user-uploads | User avatars/attachments | 10MB |
| tenders | Tender documents | 50MB |

## Role-Based Access

### ADMIN
- Full access to all resources
- Can manage users, dealers, partners
- Can create/edit all CMS content
- Can view all analytics

### DEALER
- Access to own products only
- Can respond to enquiries
- Can view own feedbacks
- Can view applicable offers

### PARTNER
- Access to own works/portfolio
- Can respond to enquiries
- Can view own feedbacks
- Can view applicable offers
- Can view analytics

### GENERAL_USER
- Read-only access to public content
- Can submit enquiries
- Can submit feedback
- Can take quizzes

## Database Schema Overview

### Core Tables
- `users` - User accounts
- `profiles` - Extended user info
- `otps` - OTP management

### Products
- `product_categories` - Categories
- `master_products` - Admin product catalogue
- `dealer_products` - Dealer listings

### Orders
- `orders` - Order records
- `order_items` - Order line items
- `payments` - Payment records
- `transactions` - Financial transactions

### Enquiries & Feedback
- `general_enquiries` - General enquiries
- `dealer_enquiries` - Dealer enquiries
- `partner_enquiries` - Partner enquiries
- `dealer_feedbacks` - Dealer reviews
- `partner_feedbacks` - Partner reviews
- `product_reviews` - Product reviews

### CMS Content
- `events` - Events
- `partner_works` - Partner portfolio
- `steel_market_updates` - Market updates
- `guest_lectures` - Lectures
- `trading_advices` - Trading info
- `upcoming_projects` - Projects
- `tenders` - Tenders
- `education_posts` - Educational content
- `quizzes` - Quizzes
- `offers` - Promotional offers
- `videos` - Video content
- `checklists` - Checklists
- `admin_notes` - Notes

### Other
- `notifications` - In-app notifications
- `push_tokens` - Push notification tokens
- `files` - File uploads
- `activity_logs` - User activity
- `loyalty_points` - Loyalty program
- `referrals` - Referral tracking

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies for:
- Admin full access
- Users can only access their own data
- Public read access for appropriate content
- Role-based restrictions

### Authentication
- JWT-based authentication
- Access token (15 min) + Refresh token (7 days)
- Automatic token refresh on expiry

### Input Validation
- Parameterized SQL queries
- Input sanitization on frontend
- Rate limiting on API

## Troubleshooting

### Database Connection Issues
1. Check DATABASE_URL format
2. Ensure IP is whitelisted in Supabase
3. Check password encoding

### CORS Issues
1. Ensure frontend URL is in CORS whitelist
2. Check for trailing slashes in URLs

### File Upload Issues
1. Check storage bucket exists
2. Verify storage policies are applied
3. Check file size limits

### Authentication Issues
1. Check JWT_SECRET is set
2. Verify token format
3. Check role in profiles table

## Production Checklist

- [ ] Use HTTPS for all connections
- [ ] Set strong JWT_SECRET
- [ ] Enable rate limiting
- [ ] Configure proper CORS origins
- [ ] Set up monitoring/logging
- [ ] Enable Supabase realtime if needed
- [ ] Configure backup strategy
- [ ] Set up email/SMS providers
- [ ] Review and test all RLS policies
