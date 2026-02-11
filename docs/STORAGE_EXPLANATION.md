# Data Storage Explanation

## What's Stored WHERE?

### 🔐 **Local Storage (Web) / AsyncStorage (Mobile)**

**Purpose:** Temporary client-side storage for authentication session

**Stored Data:**
1. `auth_access_token` - JWT access token (expires in 15 minutes)
2. `auth_refresh_token` - JWT refresh token (expires in 7 days)
3. `auth_user` - Cached user object (id, email, name, role, phone)

**Why Local Storage?**
- ✅ Fast access (no database query needed)
- ✅ Persists across page refreshes
- ✅ Works offline (for cached user data)
- ⚠️ **NOT secure** - can be accessed by JavaScript
- ⚠️ **Cleared on logout** - session data only

**This is NORMAL and EXPECTED behavior** - all web apps store auth tokens locally.

---

### 🗄️ **Supabase Database (PostgreSQL)**

**Purpose:** Permanent server-side storage

**Stored Data:**

#### `users` Table
- `id` - UUID (primary key)
- `email` - User email (unique)
- `phone` - Phone number (unique, optional)
- `name` - User's full name
- `password_hash` - Bcrypt hashed password
- `role` - User role (GENERAL_USER, PARTNER, DEALER, ADMIN)
- `is_active` - Account status
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

#### `otps` Table
- `id` - UUID (primary key)
- `phone` - Phone number
- `code` - 6-digit OTP code
- `expires_at` - Expiration timestamp
- `is_used` - Whether OTP was used
- `created_at` - Creation timestamp

**Why Database?**
- ✅ Secure (server-side only)
- ✅ Permanent storage
- ✅ Can be queried and managed
- ✅ Supports relationships and complex queries

---

## Data Flow

### Login Flow:
```
1. User enters credentials
2. Frontend sends to: POST /api/auth/login
3. Backend validates against DATABASE (users table)
4. Backend returns: { user, accessToken, refreshToken }
5. Frontend stores tokens in LOCAL STORAGE
6. Frontend caches user object in LOCAL STORAGE
```

### API Request Flow:
```
1. Frontend reads accessToken from LOCAL STORAGE
2. Frontend sends request with: Authorization: Bearer <token>
3. Backend validates token (JWT verification)
4. Backend queries DATABASE if needed (e.g., get user details)
5. Backend returns response
```

### Token Refresh Flow:
```
1. Access token expires (15 min)
2. Frontend detects 401 error
3. Frontend reads refreshToken from LOCAL STORAGE
4. Frontend sends: POST /api/auth/refresh { refreshToken }
5. Backend validates refreshToken
6. Backend queries DATABASE to verify user still exists/active
7. Backend returns new token pair
8. Frontend updates LOCAL STORAGE with new tokens
```

---

## Important Notes

### ✅ **What's CORRECT:**
- Tokens stored locally (standard practice)
- User data cached locally (for performance)
- All permanent data in Supabase database
- Passwords NEVER stored locally (only hashed in database)

### ⚠️ **Security Considerations:**
1. **Local Storage is NOT secure** - Anyone with browser access can see tokens
2. **Tokens expire** - Access tokens expire in 15 minutes
3. **HTTPS required** - In production, always use HTTPS
4. **Refresh tokens** - Should be rotated on each refresh (implemented)
5. **Database passwords** - Never stored, only bcrypt hashes

### 🔄 **Data Sync:**
- User data in local storage is a **cache**
- Always verify with database when needed
- Use `/api/auth/me` endpoint to get fresh user data
- Local storage is cleared on logout

---

## Summary

| Data Type | Location | Purpose | Persistence |
|-----------|----------|---------|-------------|
| Access Token | Local Storage | API Authentication | 15 minutes |
| Refresh Token | Local Storage | Token Refresh | 7 days |
| User Cache | Local Storage | Fast UI rendering | Until logout |
| User Data | Supabase DB | Permanent storage | Permanent |
| Passwords | Supabase DB (hashed) | Authentication | Permanent |
| OTP Codes | Supabase DB | Phone auth | Temporary (10 min) |

**Everything is working as designed!** 🎉

The local storage is just for session management - all important data is in your Supabase database.

