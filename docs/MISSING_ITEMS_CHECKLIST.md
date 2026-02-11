# Missing Items & Issues Checklist

## ✅ Fixed Issues

### 1. **Backend Middleware - Syntax Error** ✅
- **Issue**: `authorize` function had incorrect syntax
- **Status**: Already correct in current code

### 2. **Web Auth Service - Old Token Key** ✅
- **Issue**: Was using `auth_token` instead of `auth_access_token`
- **Status**: Fixed - now uses correct key

---

## ⚠️ Potential Issues to Check

### 1. **Shared Folder TypeScript Resolution**
**Issue**: TypeScript might not resolve `shared/` folder correctly

**Check:**
- Web: `web/tsconfig.json` - needs path mapping for shared folder
- Mobile: `mobile/tsconfig.json` - needs path mapping for shared folder

**Fix Needed:**
```json
// web/tsconfig.json
"paths": {
  "@/*": ["./src/*"],
  "../../shared/*": ["../shared/*"]
}
```

### 2. **Backend Logout Endpoint**
**Issue**: No logout endpoint to invalidate tokens server-side

**Current**: Frontend just clears local storage
**Should Have**: `POST /api/auth/logout` to blacklist tokens (optional but recommended)

### 3. **Token Refresh Error Handling**
**Issue**: Need to verify token refresh handles all edge cases

**Check:**
- What happens if refresh token is expired?
- What happens if refresh token is invalid?
- Is user properly logged out on refresh failure?

### 4. **Environment Variables Documentation**
**Issue**: Need to document all required env vars

**Missing:**
- `JWT_ACCESS_EXPIRES_IN` (defaults to 15m)
- `JWT_REFRESH_EXPIRES_IN` (defaults to 7d)
- `JWT_REFRESH_SECRET` (optional, uses JWT_SECRET if not set)

### 5. **Mobile API Service Usage**
**Issue**: Need to verify mobile app uses `api.service.ts` for all API calls

**Check:**
- Are all API calls going through the interceptor?
- Is token refresh working on mobile?

### 6. **Permission Config Import**
**Issue**: Using `require()` in AuthContext instead of proper import

**Current:**
```typescript
const { hasPermission: checkPermission } = require('../constants/permissions');
```

**Should Be:**
```typescript
import { hasPermission as checkPermission } from '../constants/permissions';
```

### 7. **Web Token Refresh Hook**
**Issue**: `useTokenRefresh` hook might have issues with token decoding

**Check:**
- Does it handle errors gracefully?
- Is it properly cleaning up intervals?

### 8. **Database Migration Verification**
**Issue**: Need to verify migration script works with Supabase

**Check:**
- Does Supabase support `CREATE EXTENSION IF NOT EXISTS`?
- Are all SQL statements compatible?

### 9. **CORS Configuration**
**Issue**: Need to verify CORS allows all necessary origins

**Check:**
- Web app origin
- Mobile app origin (if using web version)
- API testing tools

### 10. **Error Boundaries**
**Issue**: No error boundaries for auth failures

**Should Have:**
- Error boundary component for auth errors
- Graceful fallback UI

---

## 🔧 Quick Fixes Needed

### Priority 1: TypeScript Path Resolution
Update `tsconfig.json` files to properly resolve shared folder.

### Priority 2: Permission Import
Change `require()` to `import` in AuthContext files.

### Priority 3: Environment Variables
Document all JWT-related env vars.

### Priority 4: Logout Endpoint (Optional)
Add server-side logout endpoint for token blacklisting.

---

## 📝 Documentation Missing

1. **API Documentation** - Swagger/OpenAPI spec
2. **Error Codes Reference** - List of all error codes
3. **Deployment Guide** - Production deployment steps
4. **Testing Guide** - How to test auth flow
5. **Troubleshooting Guide** - Common issues and solutions

---

## 🧪 Testing Checklist

- [ ] Login with email/password
- [ ] Login with OTP
- [ ] Token refresh on expiry
- [ ] Token refresh on 401 error
- [ ] Logout clears all data
- [ ] Role-based route protection
- [ ] Permission-based UI hiding
- [ ] Access denied screens
- [ ] Mobile app role restrictions
- [ ] Web sidebar menu filtering

---

## Next Steps

1. Fix TypeScript path resolution
2. Fix permission imports
3. Add missing environment variables
4. Test all auth flows
5. Add error boundaries
6. Create API documentation

