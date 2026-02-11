# Authentication & RBAC Implementation Guide

## Overview

Complete JWT-based authentication with refresh tokens and role-based access control (RBAC) implemented across both mobile and web platforms.

## Architecture

### Backend (Node.js + Express)

**Token System:**
- **Access Token**: Short-lived (15 minutes) - used for API requests
- **Refresh Token**: Long-lived (7 days) - used to get new access tokens
- Both tokens are JWT-based and signed with the same secret (configurable)

**Endpoints:**
- `POST /api/auth/login` - Returns `{ user, accessToken, refreshToken }`
- `POST /api/auth/refresh` - Returns new token pair
- `POST /api/auth/otp/send` - Send OTP to phone
- `POST /api/auth/otp/verify` - Verify OTP and login
- `GET /api/auth/me` - Get current user (requires access token)

### Frontend (Web + Mobile)

**Auth State:**
```typescript
{
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Token Storage:**
- **Web**: localStorage (`auth_access_token`, `auth_refresh_token`, `auth_user`)
- **Mobile**: AsyncStorage (`@auth_access_token`, `@auth_refresh_token`, `@auth_user`)

## Permission Configuration

**Centralized Config:** `shared/config/permissions.config.ts`

This is the **single source of truth** for all permissions. No role checks should be hardcoded in components.

**Roles:**
- `GENERAL_USER` - Mobile app only
- `PARTNER` - Web admin panel (limited)
- `DEALER` - Web admin panel (operational)
- `ADMIN` - Web admin panel (full access)

**Usage:**
```typescript
import { hasPermission } from '../constants/permissions';

// In component
const canView = hasPermission(user.role, 'reports', 'view');
```

## Token Refresh Flow

### Automatic Refresh (Web)

1. **Interceptor-based**: Axios interceptor catches 401 errors
2. **Queue system**: Multiple failed requests are queued during refresh
3. **Auto-refresh hook**: `useTokenRefresh` checks token expiry every minute
4. **Graceful logout**: If refresh fails, user is logged out

### Manual Refresh (Mobile)

1. **API interceptor**: Catches 401 errors
2. **Automatic retry**: Refreshes token and retries original request
3. **Logout on failure**: If refresh fails, clears auth state

## Navigation Guards

### Web (`ProtectedRoute`)

```tsx
<ProtectedRoute 
  allowedRoles={[UserRole.ADMIN]} 
  requiredPermission={{ resource: 'users', action: 'view' }}
>
  <UserManagementPage />
</ProtectedRoute>
```

**Behavior:**
- Unauthenticated → Redirect to `/login`
- Wrong role → Redirect to `/access-denied`
- No permission → Redirect to `/access-denied`
- Authorized → Render children

### Mobile (`AppNavigator`)

**Navigation Rules:**
- Unauthenticated → Login/OTP screens
- `GENERAL_USER` → Dashboard tabs
- Other roles → Access Denied screen (mobile app restricted to general users)

## Access Denied Screens

### Web
- Route: `/access-denied`
- Component: `web/src/pages/auth/AccessDeniedPage.tsx`
- Shows error message with "Go to Dashboard" button

### Mobile
- Screen: `AccessDeniedScreen`
- Shows message: "This mobile app is only available for General Users"
- Provides logout button

## Component Guards

### `PermissionGuard` (Web + Mobile)

```tsx
<PermissionGuard resource="reports" action="export">
  <ExportButton />
</PermissionGuard>
```

**Behavior:**
- If user has permission → Renders children
- If no permission → Renders nothing (or fallback)

### `RoleGuard` (Mobile)

```tsx
<RoleGuard allowedRoles={[UserRole.GENERAL_USER]}>
  <GeneralUserContent />
</RoleGuard>
```

## Sidebar Menu (Web)

**Dynamic Generation:**
- Menu items defined in `Sidebar.tsx`
- Filtered by:
  1. User role (must be in `roles` array)
  2. Permission check (if `permission` specified)
- Hidden items don't appear in sidebar

## Key Files

### Backend
- `backend/src/utils/jwt.js` - Token generation/verification
- `backend/src/controllers/auth.controller.js` - Auth endpoints
- `backend/src/middleware/auth.js` - Authentication middleware

### Shared
- `shared/config/permissions.config.ts` - **Permission configuration**
- `shared/types/auth.types.ts` - TypeScript types

### Web
- `web/src/contexts/AuthContext.tsx` - Auth state management
- `web/src/services/auth.service.ts` - Auth API calls
- `web/src/services/api.service.ts` - Axios with token refresh
- `web/src/components/guards/ProtectedRoute.tsx` - Route protection
- `web/src/hooks/useTokenRefresh.ts` - Auto token refresh

### Mobile
- `mobile/src/contexts/AuthContext.tsx` - Auth state management
- `mobile/src/services/auth.service.ts` - Auth API calls
- `mobile/src/services/api.service.ts` - Axios with token refresh
- `mobile/src/navigation/AppNavigator.tsx` - Navigation with role checks

## Testing

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shreeom.com","password":"admin123"}'
```

### Test Refresh
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

## Security Notes

1. **Access tokens** expire in 15 minutes (configurable)
2. **Refresh tokens** expire in 7 days (configurable)
3. **Token rotation**: New refresh token issued on each refresh
4. **HTTPS required** in production
5. **JWT secret** must be strong and kept secure
6. **No role checks in components** - use permission config only

## Migration Notes

If upgrading from old token system:
- Old `token` field → `accessToken`
- Add `refreshToken` to auth state
- Update all API calls to use `accessToken`
- Update storage keys

## Troubleshooting

**Token refresh fails:**
- Check refresh token is stored correctly
- Verify JWT secret matches
- Check token expiry times

**Permission checks fail:**
- Verify user role is correct
- Check permission config matches expected format
- Ensure `hasPermission` is imported from shared config

**Navigation redirects incorrectly:**
- Check `allowedRoles` array includes user role
- Verify `requiredPermission` matches user permissions
- Check auth state is loaded before navigation

