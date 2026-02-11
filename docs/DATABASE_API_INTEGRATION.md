# Shree Om Platform - Database & API Integration Guide

## Table of Contents

1. [Database Schema Overview](#database-schema-overview)
2. [API Endpoints Reference](#api-endpoints-reference)
3. [Frontend Connection Examples](#frontend-connection-examples)
4. [Supabase Client Queries](#supabase-client-queries)
5. [Migration Execution Order](#migration-execution-order)

---

## Database Schema Overview

### Existing Tables (Already Created)

| Table | Purpose | Migration |
|-------|---------|-----------|
| `users` | Core user accounts | schema.sql |
| `otps` | OTP verification | schema.sql |
| `contact_enquiries` | Contact form submissions | schema.sql |
| `master_products` | Admin product catalog | 003_dealer_tables.sql |
| `dealer_products` | Dealer product listings | 003_dealer_tables.sql |
| `dealer_enquiries` | User-to-dealer enquiries | 003_dealer_tables.sql |
| `dealer_feedbacks` | Dealer ratings | 003_dealer_tables.sql |
| `dealer_offers` | Dealer liked offers | 003_dealer_tables.sql |
| `events` | Event management | 004_admin_tables.sql |
| `event_invites` | Event RSVPs | 004_admin_tables.sql |
| `partner_works` | Partner portfolio | 004_admin_tables.sql |
| `steel_market_updates` | Market updates | 004_admin_tables.sql |
| `guest_lectures` | Educational content | 004_admin_tables.sql |
| `trading_advices` | Trading advice | 004_admin_tables.sql |
| `upcoming_projects` | Project listings | 004_admin_tables.sql |
| `tenders` | Tender management | 004_admin_tables.sql |
| `education_posts` | Learning content | 004_admin_tables.sql |
| `quizzes` | Quiz management | 004_admin_tables.sql |
| `quiz_attempts` | User quiz results | 004_admin_tables.sql |
| `admin_notes` | Internal notes | 004_admin_tables.sql |
| `offers` | Promotional offers | 004_admin_tables.sql |
| `checklists` | Reference checklists | 004_admin_tables.sql |
| `visualization_requests` | 3D/VR requests | 004_admin_tables.sql |
| `shortcuts_links` | Reference links | 004_admin_tables.sql |
| `videos` | Video library | 004_admin_tables.sql |
| `dealership_applications` | Applications | 004_admin_tables.sql |
| `loyalty_points` | Points tracking | 004_admin_tables.sql |

### New Tables (Migration 005)

| Table | Purpose |
|-------|---------|
| `profiles` | Extended user profiles |
| `product_categories` | Product categorization |
| `orders` | Order management |
| `order_items` | Order line items |
| `payments` | Payment processing |
| `transactions` | Financial transactions |
| `general_enquiries` | Admin enquiries |
| `partner_enquiries` | Partner enquiries |
| `partner_feedbacks` | Partner reviews |
| `product_reviews` | Product reviews |
| `notification_templates` | Notification configs |
| `notifications` | User notifications |
| `push_tokens` | Device tokens |
| `conversations` | Chat conversations |
| `messages` | Chat messages |
| `files` | Uploaded files |
| `activity_logs` | User activity |
| `admin_audit_logs` | Admin actions |
| `favorites` | User favorites |
| `referrals` | Referral tracking |
| `loyalty_transactions` | Points transactions |
| `cost_configurations` | System configs |
| `analytics_events` | Usage analytics |
| `daily_stats` | Aggregated stats |
| `search_history` | Search tracking |

---

## API Endpoints Reference

### Authentication (`/api/auth`)

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login with email/password
POST   /api/auth/login/phone       - Login with phone OTP
POST   /api/auth/otp/send          - Send OTP
POST   /api/auth/otp/verify        - Verify OTP
POST   /api/auth/refresh           - Refresh access token
POST   /api/auth/logout            - Logout
POST   /api/auth/password/reset    - Reset password
```

### Users (`/api/users`) - Admin Only

```
GET    /api/users                  - List all users (paginated)
GET    /api/users/:id              - Get user by ID
POST   /api/users                  - Create new user
PATCH  /api/users/:id              - Update user
DELETE /api/users/:id              - Delete user (soft delete)
GET    /api/users/role/:role       - Get users by role
```

### Profiles (`/api/profiles`)

```
GET    /api/profiles/me            - Get current user profile
PATCH  /api/profiles/me            - Update current user profile
GET    /api/profiles/:id           - Get public profile
GET    /api/profiles/dealers       - List dealer profiles
GET    /api/profiles/partners      - List partner profiles
```

### Products (`/api/products`)

```
GET    /api/products               - List products (paginated)
GET    /api/products/:id           - Get product details
POST   /api/products               - Create product (admin)
PATCH  /api/products/:id           - Update product (admin)
DELETE /api/products/:id           - Delete product (admin)
GET    /api/products/category/:id  - Get products by category
```

### Product Categories (`/api/categories`)

```
GET    /api/categories             - List all categories
GET    /api/categories/:id         - Get category details
POST   /api/categories             - Create category (admin)
PATCH  /api/categories/:id         - Update category (admin)
DELETE /api/categories/:id         - Delete category (admin)
```

### Dealer Module (`/api/dealer`)

```
GET    /api/dealer/dashboard       - Dealer dashboard stats
GET    /api/dealer/products        - List dealer products
POST   /api/dealer/products        - Add dealer product
PATCH  /api/dealer/products/:id    - Update dealer product
DELETE /api/dealer/products/:id    - Remove dealer product
GET    /api/dealer/enquiries       - List enquiries
PATCH  /api/dealer/enquiries/:id   - Respond to enquiry
GET    /api/dealer/feedbacks       - List feedbacks
GET    /api/dealer/customers       - List customers
GET    /api/dealer/orders          - List orders
GET    /api/dealer/analytics       - Get analytics
```

### Partner Module (`/api/partner`)

```
GET    /api/partner/dashboard      - Partner dashboard stats
GET    /api/partner/works          - List works/portfolio
POST   /api/partner/works          - Add work
PATCH  /api/partner/works/:id      - Update work
DELETE /api/partner/works/:id      - Delete work
GET    /api/partner/enquiries      - List enquiries
PATCH  /api/partner/enquiries/:id  - Respond to enquiry
GET    /api/partner/feedbacks      - List feedbacks
GET    /api/partner/orders         - List orders
```

### Orders (`/api/orders`)

```
GET    /api/orders                 - List user orders
GET    /api/orders/:id             - Get order details
POST   /api/orders                 - Create order
PATCH  /api/orders/:id/cancel      - Cancel order
GET    /api/orders/:id/track       - Track order
```

### Payments (`/api/payments`)

```
POST   /api/payments/initiate      - Initiate payment
POST   /api/payments/verify        - Verify payment
GET    /api/payments/:id           - Get payment details
POST   /api/payments/webhook       - Payment gateway webhook
```

### Enquiries (`/api/enquiries`)

```
GET    /api/enquiries              - List user enquiries
POST   /api/enquiries/dealer       - Create dealer enquiry
POST   /api/enquiries/partner      - Create partner enquiry
POST   /api/enquiries/general      - Create general enquiry
GET    /api/enquiries/:id          - Get enquiry details
```

### Feedbacks (`/api/feedbacks`)

```
POST   /api/feedbacks/dealer       - Submit dealer feedback
POST   /api/feedbacks/partner      - Submit partner feedback
POST   /api/feedbacks/product      - Submit product review
GET    /api/feedbacks/dealer/:id   - Get dealer feedbacks
GET    /api/feedbacks/partner/:id  - Get partner feedbacks
GET    /api/feedbacks/product/:id  - Get product reviews
```

### Notifications (`/api/notifications`)

```
GET    /api/notifications          - List user notifications
PATCH  /api/notifications/:id/read - Mark as read
PATCH  /api/notifications/read-all - Mark all as read
DELETE /api/notifications/:id      - Delete notification
POST   /api/notifications/token    - Register push token
DELETE /api/notifications/token    - Remove push token
```

### Messages (`/api/messages`)

```
GET    /api/messages/conversations - List conversations
GET    /api/messages/:conversationId - Get messages
POST   /api/messages               - Send message
POST   /api/messages/conversation  - Start conversation
PATCH  /api/messages/:id/read      - Mark as read
```

### Favorites (`/api/favorites`)

```
GET    /api/favorites              - List favorites
POST   /api/favorites              - Add to favorites
DELETE /api/favorites/:id          - Remove from favorites
GET    /api/favorites/:type        - Get favorites by type
```

### Loyalty (`/api/loyalty`)

```
GET    /api/loyalty/balance        - Get points balance
GET    /api/loyalty/transactions   - List transactions
POST   /api/loyalty/redeem         - Redeem points
GET    /api/loyalty/history        - Get earning history
```

### Referrals (`/api/referrals`)

```
GET    /api/referrals/code         - Get referral code
GET    /api/referrals/stats        - Get referral stats
POST   /api/referrals/apply        - Apply referral code
GET    /api/referrals/history      - Get referral history
```

### CMS Content (`/api/content`)

```
GET    /api/content/offers         - List offers
GET    /api/content/lectures       - List guest lectures
GET    /api/content/projects       - List upcoming projects
GET    /api/content/tenders        - List tenders
GET    /api/content/education      - List education posts
GET    /api/content/videos         - List videos
GET    /api/content/checklists     - List checklists
GET    /api/content/shortcuts      - List shortcuts/links
GET    /api/content/steel-updates  - List market updates
GET    /api/content/trading-advice - List trading advice
```

### Quizzes (`/api/quizzes`)

```
GET    /api/quizzes                - List available quizzes
GET    /api/quizzes/:id            - Get quiz details
POST   /api/quizzes/:id/attempt    - Submit quiz attempt
GET    /api/quizzes/history        - Get user quiz history
GET    /api/quizzes/:id/leaderboard - Get quiz leaderboard
```

### Events (`/api/events`)

```
GET    /api/events                 - List events
GET    /api/events/:id             - Get event details
POST   /api/events/:id/rsvp        - RSVP to event
GET    /api/events/my-invites      - Get my event invites
```

### Search (`/api/search`)

```
GET    /api/search                 - Global search
GET    /api/search/products        - Search products
GET    /api/search/dealers         - Search dealers
GET    /api/search/partners        - Search partners
GET    /api/search/suggestions     - Get search suggestions
```

### Files (`/api/files`)

```
POST   /api/files/upload           - Upload file
POST   /api/files/upload/multiple  - Upload multiple files
DELETE /api/files/:id              - Delete file
GET    /api/files/:id              - Get file details
```

### Admin Module (`/api/admin`)

```
# Dashboard
GET    /api/admin/dashboard        - Dashboard stats

# User Management
GET    /api/admin/users            - List users
POST   /api/admin/users            - Create user
PATCH  /api/admin/users/:id        - Update user
DELETE /api/admin/users/:id        - Delete user
PATCH  /api/admin/users/:id/status - Toggle user status

# Dealer Management
GET    /api/admin/dealers          - List dealers
PATCH  /api/admin/dealers/:id      - Update dealer
GET    /api/admin/dealers/:id/stats - Dealer statistics

# Partner Management
GET    /api/admin/partners         - List partners
PATCH  /api/admin/partners/:id     - Update partner
GET    /api/admin/partners/:id/stats - Partner statistics

# Applications
GET    /api/admin/applications     - List applications
PATCH  /api/admin/applications/:id - Review application

# Orders
GET    /api/admin/orders           - List all orders
PATCH  /api/admin/orders/:id       - Update order
GET    /api/admin/orders/export    - Export orders

# Content Management
POST   /api/admin/offers           - Create offer
PATCH  /api/admin/offers/:id       - Update offer
DELETE /api/admin/offers/:id       - Delete offer
# (Similar CRUD for all CMS modules)

# Analytics
GET    /api/admin/analytics/overview - Analytics overview
GET    /api/admin/analytics/revenue  - Revenue analytics
GET    /api/admin/analytics/users    - User analytics
GET    /api/admin/analytics/orders   - Order analytics
GET    /api/admin/analytics/export   - Export reports

# Configuration
GET    /api/admin/config            - Get configurations
PATCH  /api/admin/config/:key       - Update configuration

# Audit Logs
GET    /api/admin/audit-logs        - List audit logs
```

---

## Frontend Connection Examples

### 1. API Client Setup (Already exists in `web/src/services/apiClient.ts`)

```typescript
// Using the existing apiClient
import api from '@/services/apiClient';

// GET request
const users = await api.get('/users');

// POST request
const newUser = await api.post('/users', { name: 'John', email: 'john@example.com' });

// PATCH request
await api.patch('/users/123', { name: 'Updated Name' });

// DELETE request
await api.delete('/users/123');
```

### 2. Admin Dashboard Metrics

```typescript
// web/src/services/admin.service.ts

import api from './apiClient';

export const adminService = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Usage in component
  // const { data, loading, error } = useQuery('dashboardStats', adminService.getDashboardStats);
};
```

### 3. User List with Pagination

```typescript
// web/src/services/user.service.ts

import api from './apiClient';

interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: 'active' | 'inactive';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const userService = {
  getUsers: async (params: UserListParams) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserDto) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    await api.delete(`/users/${id}`);
  },
};
```

### 4. Dealer Products Management

```typescript
// web/src/services/dealer.service.ts

import api from './apiClient';

export const dealerService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/dealer/dashboard');
    return response.data;
  },

  // Products
  getProducts: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/dealer/products', { params });
    return response.data;
  },

  addProduct: async (productData: {
    product_id: string;
    description: string;
    price: number;
    unit: string;
    images?: string[];
  }) => {
    const response = await api.post('/dealer/products', productData);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<DealerProduct>) => {
    const response = await api.patch(`/dealer/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    await api.delete(`/dealer/products/${id}`);
  },

  // Enquiries
  getEnquiries: async (params?: { status?: string }) => {
    const response = await api.get('/dealer/enquiries', { params });
    return response.data;
  },

  respondToEnquiry: async (id: string, response: string) => {
    const res = await api.patch(`/dealer/enquiries/${id}`, { response, status: 'responded' });
    return res.data;
  },

  // Customers
  getCustomers: async () => {
    const response = await api.get('/dealer/customers');
    return response.data;
  },
};
```

### 5. Order Management

```typescript
// web/src/services/order.service.ts

import api from './apiClient';

export const orderService = {
  // List orders
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    from_date?: string;
    to_date?: string;
  }) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get order details
  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create order
  createOrder: async (orderData: {
    items: Array<{
      product_id: string;
      quantity: number;
      unit_price: number;
    }>;
    shipping_address: ShippingAddress;
    payment_method: string;
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: string, reason: string) => {
    const response = await api.patch(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Admin: Update order status
  updateOrderStatus: async (id: string, status: string, notes?: string) => {
    const response = await api.patch(`/admin/orders/${id}`, { status, admin_notes: notes });
    return response.data;
  },
};
```

### 6. CMS Content Fetching

```typescript
// web/src/services/content.service.ts

import api from './apiClient';

export const contentService = {
  // Offers
  getOffers: async (params?: { type?: 'partners' | 'dealers' | 'both' }) => {
    const response = await api.get('/content/offers', { params });
    return response.data;
  },

  // Guest Lectures
  getLectures: async () => {
    const response = await api.get('/content/lectures');
    return response.data;
  },

  // Upcoming Projects
  getProjects: async () => {
    const response = await api.get('/content/projects');
    return response.data;
  },

  // Tenders
  getTenders: async () => {
    const response = await api.get('/content/tenders');
    return response.data;
  },

  // Education Posts
  getEducationPosts: async () => {
    const response = await api.get('/content/education');
    return response.data;
  },

  // Videos
  getVideos: async (category?: string) => {
    const response = await api.get('/content/videos', { params: { category } });
    return response.data;
  },

  // Checklists
  getChecklists: async (category?: string) => {
    const response = await api.get('/content/checklists', { params: { category } });
    return response.data;
  },

  // Steel Market Updates
  getSteelUpdates: async () => {
    const response = await api.get('/content/steel-updates');
    return response.data;
  },

  // Trading Advice
  getTradingAdvice: async () => {
    const response = await api.get('/content/trading-advice');
    return response.data;
  },
};
```

### 7. Notifications

```typescript
// web/src/services/notification.service.ts

import api from './apiClient';

export const notificationService = {
  getNotifications: async (params?: { page?: number; is_read?: boolean }) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    await api.patch('/notifications/read-all');
  },

  deleteNotification: async (id: string) => {
    await api.delete(`/notifications/${id}`);
  },

  registerPushToken: async (token: string, deviceType: 'ios' | 'android' | 'web') => {
    await api.post('/notifications/token', { token, device_type: deviceType });
  },
};
```

### 8. File Upload

```typescript
// web/src/services/file.service.ts

import api from './apiClient';

export const fileService = {
  uploadFile: async (file: File, entityType?: string, entityId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (entityType) formData.append('entity_type', entityType);
    if (entityId) formData.append('entity_id', entityId);

    const response = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadMultiple: async (files: File[], entityType?: string, entityId?: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (entityType) formData.append('entity_type', entityType);
    if (entityId) formData.append('entity_id', entityId);

    const response = await api.post('/files/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteFile: async (id: string) => {
    await api.delete(`/files/${id}`);
  },
};
```

---

## Supabase Client Queries

If you prefer using Supabase client directly (for real-time features or simpler queries):

### Setup Supabase Client

```typescript
// web/src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Direct Database Queries

```typescript
// Example: Get dealers with profiles

const getDealersWithProfiles = async () => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      name,
      email,
      phone,
      is_active,
      profiles (
        business_name,
        location_name,
        average_rating,
        total_reviews,
        avatar_url
      )
    `)
    .eq('role', 'DEALER')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Example: Get orders with items

const getOrderWithItems = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        product_name,
        quantity,
        unit_price,
        total_price
      ),
      payments (
        id,
        amount,
        status,
        payment_method
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
};

// Example: Real-time notifications

const subscribeToNotifications = (userId: string, callback: (notification: any) => void) => {
  const subscription = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => callback(payload.new)
    )
    .subscribe();

  return () => subscription.unsubscribe();
};

// Example: Real-time chat messages

const subscribeToConversation = (conversationId: string, callback: (message: any) => void) => {
  const subscription = supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => callback(payload.new)
    )
    .subscribe();

  return () => subscription.unsubscribe();
};
```

### Admin Dashboard Query

```typescript
// Using the view we created

const getAdminDashboardStats = async () => {
  const { data, error } = await supabase
    .from('admin_dashboard_stats')
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

// Or using RPC for custom stats
const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
```

---

## Migration Execution Order

### Step 1: Run migrations in order

```bash
# From project root, using psql
psql -d your_database_name -f backend/src/database/schema.sql
psql -d your_database_name -f backend/src/database/migrations/003_dealer_tables.sql
psql -d your_database_name -f backend/src/database/migrations/004_admin_tables.sql
psql -d your_database_name -f backend/src/database/migrations/005_complete_schema.sql

# Or using the migration script
cd backend
npm run migrate
```

### Step 2: Verify tables created

```sql
-- Check all tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### Step 3: Seed initial data

```bash
cd backend
npm run seed
```

### Step 4: Test with sample queries

```sql
-- Test admin dashboard view
SELECT * FROM admin_dashboard_stats;

-- Test dealer dashboard view
SELECT * FROM dealer_dashboard_stats;

-- Test loyalty balance function
SELECT get_loyalty_balance('your-user-id-here');

-- Test average rating function
SELECT calculate_average_rating('dealer', 'dealer-user-id-here');
```

### Step 5: Connect frontend

```typescript
// Test API connection
import api from '@/services/apiClient';

// Health check
const health = await api.get('/health');
console.log('API Status:', health.data);

// Test authenticated endpoint
const dashboard = await api.get('/admin/dashboard');
console.log('Dashboard:', dashboard.data);
```

---

## Request/Response Shapes

### User Creation

**Request:**
```json
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9123456789",
  "role": "DEALER",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9123456789",
    "role": "DEALER",
    "is_active": true,
    "created_at": "2026-01-30T10:00:00Z"
  }
}
```

### Order Creation

**Request:**
```json
POST /api/orders
{
  "items": [
    {
      "product_id": "product-uuid",
      "dealer_product_id": "dealer-product-uuid",
      "quantity": 5,
      "unit_price": 500.00
    }
  ],
  "dealer_id": "dealer-uuid",
  "shipping_address": {
    "name": "John Doe",
    "phone": "9123456789",
    "address_line1": "123 Main St",
    "city": "Guwahati",
    "state": "Assam",
    "pincode": "781001"
  },
  "payment_method": "upi",
  "customer_notes": "Please deliver before 5 PM"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "order_number": "SOM20260130-12345",
    "status": "pending",
    "total_amount": 2500.00,
    "tax_amount": 450.00,
    "final_amount": 2950.00,
    "items": [...],
    "payment": {
      "id": "payment-uuid",
      "gateway_order_id": "razorpay_order_id",
      "amount": 2950.00
    }
  }
}
```

### Paginated List Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

---

## Role-Based Access Summary

| Endpoint Category | ADMIN | DEALER | PARTNER | USER |
|-------------------|-------|--------|---------|------|
| Admin Dashboard | Full | - | - | - |
| User Management | Full | - | - | - |
| Products (Master) | Full | Read | Read | Read |
| Dealer Products | Full | Own | - | Read |
| Partner Works | Full | - | Own | Read |
| Orders | Full | Own | Own | Own |
| Enquiries | Full | Own | Own | Own |
| Feedbacks | Full | Own | Own | Own |
| CMS Content | Full | Read | Read | Read |
| Notifications | Full | Own | Own | Own |
| Messages | Full | Own | Own | Own |
| Analytics | Full | Own | Own | - |

---

## Support

For issues or questions:
- Check the API error response for details
- Review RLS policies if getting permission errors
- Ensure migrations are run in correct order
- Verify JWT tokens are valid and not expired
