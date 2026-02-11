# Database Verification - Supabase PostgreSQL

## Connection Configuration

The backend is configured to connect to Supabase PostgreSQL via:
- **Connection String**: `DATABASE_URL` environment variable
- **SSL**: Automatically enabled for Supabase connections
- **Connection Pooling**: Max 20 connections

## All Tables Connected to Supabase

### Core Tables (schema.sql)

1. **users**
   - id (UUID), email, phone, name, password_hash, role, is_active, created_at, updated_at

2. **otps**
   - id (UUID), phone, code, expires_at, is_used, created_at

3. **contact_enquiries**
   - id (UUID), name, email, phone, subject, message, created_at

### Dealer Tables (schema.sql)

4. **master_products**
   - id (UUID), name, category, description, unit, specifications (JSONB), is_active, created_at, updated_at

5. **dealer_products**
   - id (UUID), dealer_id (FK), product_id (FK), product_name, description, price, unit, status, images (TEXT[]), specifications (JSONB), created_at, updated_at

6. **dealer_enquiries**
   - id (UUID), enquiry_id, dealer_id (FK), user_id (FK), user_name, user_email, user_phone, topic, message, status, response, responded_at, created_at, updated_at

7. **dealer_feedbacks**
   - id (UUID), dealer_id (FK), user_id (FK), user_name, rating, comment, is_reported, reported_reason, created_at

8. **dealer_offers**
   - id (UUID), offer_id, dealer_id (FK), is_liked, liked_at, created_at

### Admin Tables (004_admin_tables.sql)

9. **events**
   - id (UUID), title, description, location, location_lat, location_lng, event_date, created_by (FK), is_active, created_at, updated_at

10. **event_invites**
    - id (UUID), event_id (FK), user_id (FK), user_role, status, responded_at, created_at

11. **partner_works**
    - id (UUID), partner_id (FK), title, description, images (TEXT[]), videos (TEXT[]), links (TEXT[]), category, is_approved, is_active, created_at, updated_at

12. **steel_market_updates**
    - id (UUID), title, description, image_url, created_by (FK), is_active, created_at, updated_at

13. **guest_lectures**
    - id (UUID), title, description, meeting_link, lecture_date, created_by (FK), is_active, created_at, updated_at

14. **trading_advices**
    - id (UUID), title, description, image_url, visible_to_dealers, visible_to_partners, created_by (FK), is_active, created_at, updated_at

15. **upcoming_projects**
    - id (UUID), title, description, location, location_lat, location_lng, created_by (FK), is_active, created_at, updated_at

16. **tenders**
    - id (UUID), title, description, attachments (TEXT[]), created_by (FK), is_active, created_at, updated_at

17. **education_posts**
    - id (UUID), title, body, video_links (TEXT[]), documents (TEXT[]), images (TEXT[]), created_by (FK), is_active, created_at, updated_at

18. **quizzes**
    - id (UUID), name, description, questions (JSONB), created_by (FK), is_active, created_at, updated_at

19. **quiz_attempts**
    - id (UUID), quiz_id (FK), user_id (FK), answers (JSONB), score, total_questions, completed_at

20. **admin_notes**
    - id (UUID), title, content, visible_to_partners, visible_to_dealers, created_by (FK), created_at, updated_at

21. **offers**
    - id (UUID), title, description, discount_type, discount_value, valid_until, applicable_to, created_by (FK), is_active, created_at, updated_at

22. **checklists**
    - id (UUID), category, title, items (JSONB), created_by (FK), is_active, created_at, updated_at

23. **visualization_requests**
    - id (UUID), user_id (FK), request_type, description, status, response_video, response_image, response_message, responded_by (FK), responded_at, created_at, updated_at

24. **shortcuts_links**
    - id (UUID), category, title, link_url, description, created_by (FK), is_active, created_at, updated_at

25. **videos**
    - id (UUID), title, youtube_url, category, description, created_by (FK), is_active, created_at, updated_at

26. **dealership_applications**
    - id (UUID), user_id (FK), business_name, contact_email, contact_phone, location, description, status, reviewed_by (FK), reviewed_at, created_at, updated_at

27. **loyalty_points**
    - id (UUID), user_id (FK), points, source, description, created_by (FK), created_at

## Database Features

### All Tables Include:
- ✅ UUID primary keys (using `uuid_generate_v4()`)
- ✅ Foreign key constraints with CASCADE deletes
- ✅ Proper indexes for performance
- ✅ Timestamps (created_at, updated_at)
- ✅ Audit tracking (created_by where applicable)
- ✅ Status/active flags where needed
- ✅ CHECK constraints for data validation

### PostgreSQL-Specific Features Used:
- ✅ UUID extension (`uuid-ossp`)
- ✅ JSONB for flexible data storage
- ✅ TEXT[] arrays for multiple values
- ✅ DECIMAL for precise numeric values
- ✅ Triggers for auto-updating `updated_at`
- ✅ Functions for reusable logic

## Migration Process

1. **Main Schema** (`schema.sql`): Core + Dealer tables
2. **Admin Migration** (`004_admin_tables.sql`): All admin portal tables

Both migrations are automatically run by `npm run migrate`

## Connection Verification

To verify connection:
```bash
cd backend
npm run test-db
```

To run migrations:
```bash
cd backend
npm run migrate
```

## All Backend Controllers Use:

- `query()` function from `database.js`
- Direct SQL queries with parameterized statements
- Proper error handling
- Transaction support where needed

## Status

✅ **All 27 tables are properly defined**
✅ **All columns have correct data types**
✅ **All foreign keys are properly configured**
✅ **All indexes are created for performance**
✅ **All triggers are set up for auto-updates**
✅ **Connection is configured for Supabase PostgreSQL**

All backend API endpoints connect directly to Supabase PostgreSQL through the `query()` function.






