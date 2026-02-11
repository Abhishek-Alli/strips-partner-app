# Supabase PostgreSQL Connection Guide

## ✅ Confirmation: All Tables Connected to Supabase

All database tables and columns are properly configured to connect to your Supabase PostgreSQL database.

## Connection Details

**Supabase Project**: `https://escmgtuixqydcofpguay.supabase.co`

**Connection Configuration**:
- Location: `backend/src/config/database.js`
- Uses `DATABASE_URL` environment variable
- SSL automatically enabled for Supabase
- Connection pooling (max 20 connections)

## All Tables (27 Total)

### Core Tables (3)
1. `users` - User accounts
2. `otps` - OTP verification
3. `contact_enquiries` - Contact form submissions

### Dealer Tables (5)
4. `master_products` - Admin-managed product catalogue
5. `dealer_products` - Dealer product listings
6. `dealer_enquiries` - User enquiries to dealers
7. `dealer_feedbacks` - User feedbacks for dealers
8. `dealer_offers` - Dealer offer likes/bookmarks

### Admin Portal Tables (19)
9. `events` - Event management
10. `event_invites` - Event invitation tracking
11. `partner_works` - Partner portfolio submissions
12. `steel_market_updates` - Steel market content
13. `guest_lectures` - Lecture management
14. `trading_advices` - Trading advice content
15. `upcoming_projects` - Project announcements
16. `tenders` - Tender management
17. `education_posts` - Educational content
18. `quizzes` - Quiz management
19. `quiz_attempts` - Quiz performance tracking
20. `admin_notes` - Internal admin notes
21. `offers` - Offers & discounts (main table)
22. `checklists` - Civil engineering checklists
23. `visualization_requests` - VR/3D visualization requests
24. `shortcuts_links` - Engineering shortcuts & links
25. `videos` - YouTube video links
26. `dealership_applications` - Dealer/Partner applications
27. `loyalty_points` - Loyalty points tracking

## Verification Commands

### 1. Test Database Connection
```bash
cd backend
npm run test-db
```

### 2. Run All Migrations
```bash
cd backend
npm run migrate
```

This will:
- Run `schema.sql` (core + dealer tables)
- Run `004_admin_tables.sql` (admin portal tables)

### 3. Verify All Tables Exist
```bash
cd backend
npm run verify-tables
```

This will:
- List all tables in your database
- Check if all expected tables exist
- Show columns for key tables
- Report any missing tables

## Backend API Connection

All backend controllers use the `query()` function from `database.js`:

```javascript
import { query } from '../config/database.js';

// Example: All queries connect directly to Supabase
const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
```

**All API endpoints**:
- ✅ Use parameterized queries (SQL injection safe)
- ✅ Connect directly to Supabase PostgreSQL
- ✅ Handle errors gracefully
- ✅ Support transactions where needed

## Database Features Used

### PostgreSQL-Specific Features:
- ✅ **UUID Extension**: `uuid-ossp` for primary keys
- ✅ **JSONB**: Flexible JSON storage (specifications, questions, answers)
- ✅ **TEXT[]**: Array columns (images, videos, links, attachments)
- ✅ **DECIMAL**: Precise numeric values (prices, coordinates)
- ✅ **Triggers**: Auto-update `updated_at` timestamps
- ✅ **Functions**: Reusable SQL functions
- ✅ **Foreign Keys**: Referential integrity with CASCADE deletes
- ✅ **Indexes**: Performance optimization
- ✅ **CHECK Constraints**: Data validation

## Environment Setup

Ensure your `.env` file has:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.escmgtuixqydcofpguay.supabase.co:5432/postgres
```

Get your password from:
- Supabase Dashboard → Settings → Database → Connection string

## Status Summary

✅ **27 tables defined**
✅ **All columns properly typed**
✅ **All foreign keys configured**
✅ **All indexes created**
✅ **All triggers set up**
✅ **Connection configured for Supabase**
✅ **All backend APIs connected**

**All tables and columns are ready and connected to Supabase PostgreSQL!**






