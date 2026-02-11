# Dealer Database Setup Guide

## Overview

All Dealer Portal features are now connected to Supabase PostgreSQL database. This document explains the database schema and how to set it up.

## Database Tables

### 1. Master Products (`master_products`)
Admin-managed product list that dealers can select from.

**Columns:**
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Product name
- `category` (VARCHAR) - Product category
- `description` (TEXT) - Optional description
- `unit` (VARCHAR) - Unit of measurement
- `specifications` (JSONB) - Additional specs
- `is_active` (BOOLEAN) - Active status
- `created_at`, `updated_at` (TIMESTAMP)

### 2. Dealer Products (`dealer_products`)
Dealer's product catalogue (selected from master list).

**Columns:**
- `id` (UUID) - Primary key
- `dealer_id` (UUID) - Foreign key to users
- `product_id` (UUID) - Foreign key to master_products
- `product_name` (VARCHAR) - Cached product name
- `description` (TEXT) - Optional description
- `price` (DECIMAL) - Optional price
- `unit` (VARCHAR) - Unit of measurement
- `status` (VARCHAR) - 'active', 'inactive', 'pending'
- `images` (TEXT[]) - Array of image URLs
- `specifications` (JSONB) - Additional specs
- `created_at`, `updated_at` (TIMESTAMP)
- **Unique constraint:** (dealer_id, product_id)

### 3. Dealer Enquiries (`dealer_enquiries`)
User enquiries sent to dealers.

**Columns:**
- `id` (UUID) - Primary key
- `enquiry_id` (UUID) - Reference to main enquiries table
- `dealer_id` (UUID) - Foreign key to users
- `user_id` (UUID) - Foreign key to users (enquirer)
- `user_name`, `user_email`, `user_phone` (VARCHAR) - User contact info
- `topic` (VARCHAR) - Enquiry topic
- `message` (TEXT) - Enquiry message
- `status` (VARCHAR) - 'new', 'responded', 'closed'
- `response` (TEXT) - Dealer's response
- `responded_at` (TIMESTAMP) - Response timestamp
- `created_at`, `updated_at` (TIMESTAMP)

### 4. Dealer Feedbacks (`dealer_feedbacks`)
User feedbacks/ratings for dealers.

**Columns:**
- `id` (UUID) - Primary key
- `dealer_id` (UUID) - Foreign key to users
- `user_id` (UUID) - Foreign key to users
- `user_name` (VARCHAR) - Optional user name
- `rating` (INTEGER) - Rating 1-5
- `comment` (TEXT) - Optional comment
- `is_reported` (BOOLEAN) - Reported flag
- `reported_reason` (TEXT) - Report reason
- `created_at` (TIMESTAMP)

### 5. Dealer Offers (`dealer_offers`)
Tracks which offers dealers have liked/bookmarked.

**Columns:**
- `id` (UUID) - Primary key
- `offer_id` (UUID) - Reference to main offers table
- `dealer_id` (UUID) - Foreign key to users
- `is_liked` (BOOLEAN) - Like status
- `liked_at` (TIMESTAMP) - Like timestamp
- `created_at` (TIMESTAMP)
- **Unique constraint:** (dealer_id, offer_id)

## Setup Instructions

### 1. Run Database Migration

The dealer tables are included in the main `schema.sql` file. Run:

```bash
cd backend
npm run migrate
```

This will create all tables including dealer tables.

### 2. Seed Master Products (Optional)

To populate sample master products:

```bash
npm run seed:dealer
```

### 3. Verify Connection

Test database connection:

```bash
npm run test-db
```

## API Endpoints

All endpoints are prefixed with `/api/dealer` and require:
- Authentication (Bearer token)
- DEALER role

### Products
- `GET /api/dealer/master-products` - Get master products list
- `GET /api/dealer/products/:dealerId` - Get dealer's products
- `POST /api/dealer/products` - Add product to catalogue
- `PUT /api/dealer/products/:productId` - Update product
- `DELETE /api/dealer/products/:productId` - Delete product

### Enquiries
- `GET /api/dealer/enquiries/:dealerId` - Get enquiries (with status filter)
- `GET /api/dealer/enquiries/detail/:enquiryId` - Get enquiry details
- `POST /api/dealer/enquiries/:enquiryId/respond` - Respond to enquiry
- `POST /api/dealer/enquiries/admin` - Send enquiry to admin

### Feedbacks
- `GET /api/dealer/feedbacks/:dealerId` - Get feedbacks
- `POST /api/dealer/feedbacks/:feedbackId/report` - Report feedback

### Offers
- `GET /api/dealer/offers/:dealerId` - Get liked offers
- `POST /api/dealer/offers/:offerId/like` - Like/unlike offer

### Statistics
- `GET /api/dealer/stats/:dealerId` - Get dealer statistics

## Database Connection

The backend connects to Supabase PostgreSQL using:
- Connection string: `DATABASE_URL` in `.env`
- SSL enabled for Supabase
- Connection pooling (max 20 connections)

## Indexes

All tables have appropriate indexes for performance:
- Foreign key indexes
- Status indexes for filtering
- Date indexes for sorting

## Security

- All routes require authentication
- Role-based access control (DEALER only)
- Dealer can only access their own data
- Foreign key constraints ensure data integrity

## Notes

- All timestamps use PostgreSQL `TIMESTAMP` type
- UUIDs are used for all primary keys
- JSONB is used for flexible specifications
- Unique constraints prevent duplicate entries
- Cascade deletes maintain referential integrity






