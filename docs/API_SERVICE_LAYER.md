# API Service Layer Implementation Guide

## Overview

Centralized, robust API service layer for both Web and Mobile platforms with automatic token refresh, error handling, and mock support.

## Architecture

### Core Principles
- ✅ Single API client per platform
- ✅ Centralized request/response handling
- ✅ No direct fetch/axios calls in components
- ✅ Automatic token refresh
- ✅ Standardized error format
- ✅ Mock-first development

## File Structure

```
services/
├── apiClient.ts          # Centralized API client (web)
├── authService.ts        # Authentication service
├── userService.ts        # User management service
├── dashboardService.ts   # Dashboard data service
├── dealerService.ts     # Dealer-specific service
├── partnerService.ts    # Partner-specific service
├── index.ts             # Centralized exports
└── mock/
    ├── mockData.ts      # Mock data
    └── mockService.ts   # Mock implementations
```

## API Client Features

### Request Interceptor
- Automatically attaches access token
- Handles token from storage (localStorage/AsyncStorage)

### Response Interceptor
- Handles 401 errors (token expired)
- Automatic token refresh
- Queues failed requests during refresh
- Retries original request after refresh
- Graceful logout on refresh failure

### Error Normalization
All errors are normalized to:
```typescript
{
  code: string;
  message: string;
  details?: any;
  status?: number;
}
```

## Mock Mode

### Enable Mock Mode
Set environment variable:
```env
# Web
VITE_USE_MOCK=true

# Mobile
EXPO_PUBLIC_USE_MOCK=true
```

### Benefits
- ✅ Development without backend
- ✅ Consistent testing
- ✅ Offline development
- ✅ Same API interface

## Service Usage Examples

### 1. Fetch Dashboard Stats

```tsx
import { dashboardService } from '../../services';
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getAdminStats();
      setStats(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SkeletonLoader />;
  if (error) return <Alert>{error.message}</Alert>;
  
  return <DashboardContent stats={stats} />;
};
```

### 2. Fetch Paginated Users (with DataTable)

```tsx
import { userService } from '../../services';
import { DataTable, Column } from '../../components/table/DataTable';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    total: 0
  });

  const loadUsers = async (page: number, limit: number, search: string) => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers(page + 1, limit, search);
      setUsers(response.users);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    loadUsers(newPage, pagination.rowsPerPage, '');
  };

  return (
    <DataTable
      columns={columns}
      rows={users}
      loading={loading}
      pagination={{
        page: pagination.page,
        rowsPerPage: pagination.rowsPerPage,
        total: pagination.total,
        onPageChange: handlePageChange,
        onRowsPerPageChange: (limit) => {
          setPagination(prev => ({ ...prev, rowsPerPage: limit, page: 0 }));
          loadUsers(0, limit, '');
        }
      }}
      onSearch={(term) => {
        setPagination(prev => ({ ...prev, page: 0 }));
        loadUsers(0, pagination.rowsPerPage, term);
      }}
    />
  );
};
```

### 3. Error Handling

```tsx
import { ApiError } from '../../utils/apiError';
import { userService } from '../../services';

const handleDelete = async (userId: string) => {
  try {
    await userService.deleteUser(userId);
    // Success
    showSuccessMessage('User deleted successfully');
    loadUsers();
  } catch (error) {
    const apiError = error as ApiError;
    
    // Handle specific error codes
    if (apiError.code === 'NOT_FOUND') {
      showErrorMessage('User not found');
    } else if (apiError.code === 'FORBIDDEN') {
      showErrorMessage('You do not have permission to delete this user');
    } else {
      showErrorMessage(apiError.message || 'Failed to delete user');
    }
  }
};
```

## Service Methods

### AuthService
- `login(credentials)` - Login with email/password
- `refreshAccessToken()` - Refresh access token
- `sendOTP(phone)` - Send OTP to phone
- `verifyOTP(phone, otp)` - Verify OTP and login
- `getCurrentUser()` - Get current authenticated user
- `logout()` - Clear auth data

### UserService
- `getAllUsers(page, limit, search)` - Get paginated users
- `getUserById(id)` - Get user by ID
- `createUser(data)` - Create new user
- `updateUser(id, data)` - Update user
- `deleteUser(id)` - Delete user

### DashboardService
- `getAdminStats()` - Get admin dashboard stats
- `getPartnerStats()` - Get partner dashboard stats
- `getDealerStats()` - Get dealer dashboard stats

### DealerService
- `getCustomers(page, limit)` - Get assigned customers
- `getOrders(page, limit)` - Get orders
- `createOrder(data)` - Create new order
- `updateOrder(id, status)` - Update order status

### PartnerService
- `getDealers(page, limit)` - Get assigned dealers
- `getDealerReport(dealerId, startDate, endDate)` - Get dealer report

## Error Codes

Common error codes:
- `NETWORK_ERROR` - Network connection issue
- `HTTP_401` - Unauthorized
- `HTTP_403` - Forbidden
- `HTTP_404` - Not found
- `HTTP_500` - Server error
- `INVALID_CREDENTIALS` - Invalid login
- `NOT_FOUND` - Resource not found

## Environment Variables

### Web (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK=false
```

### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_USE_MOCK=false
```

## Best Practices

### 1. Always Handle Errors
```tsx
try {
  const data = await service.getData();
  // Use data
} catch (error) {
  // Handle error
  const apiError = error as ApiError;
  showError(apiError.message);
}
```

### 2. Use Loading States
```tsx
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await service.getData();
    setData(data);
  } finally {
    setLoading(false);
  }
};
```

### 3. Don't Call Services in Render
```tsx
// ❌ Bad
const Component = () => {
  const data = await service.getData(); // Don't do this
  
  // ✅ Good
  useEffect(() => {
    loadData();
  }, []);
};
```

### 4. Use Service Exports
```tsx
// ✅ Good - centralized imports
import { userService, dashboardService } from '../../services';

// ❌ Bad - direct imports
import { userService } from '../../services/userService';
import { dashboardService } from '../../services/dashboardService';
```

## Testing with Mock Mode

1. Set `VITE_USE_MOCK=true` in `.env`
2. All services use mock data
3. Same API interface as real services
4. No backend required for development

## Migration from Old Services

Old services are re-exported for backward compatibility:
- `auth.service.ts` → `authService.ts`
- `user.service.ts` → `userService.ts`
- `api.service.ts` → `apiClient.ts`

## Summary

✅ **Complete Implementation:**
- Centralized API client
- Automatic token refresh
- Standardized error handling
- Mock mode support
- All domain services
- Type-safe interfaces

🚀 **Ready for:**
- Production use
- Easy testing
- Offline development
- Team collaboration

