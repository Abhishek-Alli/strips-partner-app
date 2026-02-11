# Service Layer Usage Examples

## Complete Examples for Common Use Cases

### Example 1: Dashboard with Loading & Error States

```tsx
import React, { useState, useEffect } from 'react';
import { Alert, Button } from '@mui/material';
import { dashboardService } from '../../services';
import { ApiError } from '../../utils/apiError';
import { SkeletonLoader } from '../../components/dashboard/SkeletonLoader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

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
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SkeletonLoader variant="statCard" count={4} />;
  if (error) {
    return (
      <>
        <Alert severity="error">{error.message}</Alert>
        <Button onClick={loadStats}>Retry</Button>
      </>
    );
  }

  return <DashboardContent stats={stats} />;
};
```

### Example 2: DataTable with Pagination & Search

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '../../services';
import { DataTable, Column } from '../../components/table/DataTable';
import { User } from '../../types/auth.types';

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, [pagination.page, pagination.rowsPerPage, searchTerm]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers(
        pagination.page + 1,
        pagination.rowsPerPage,
        searchTerm
      );
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

  const columns: Column<User>[] = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'role', label: 'Role' }
  ];

  return (
    <DataTable
      columns={columns}
      rows={users}
      loading={loading}
      pagination={{
        page: pagination.page,
        rowsPerPage: pagination.rowsPerPage,
        total: pagination.total,
        onPageChange: (page) => setPagination(prev => ({ ...prev, page })),
        onRowsPerPageChange: (limit) => 
          setPagination(prev => ({ ...prev, rowsPerPage: limit, page: 0 }))
      }}
      onSearch={(term) => {
        setSearchTerm(term);
        setPagination(prev => ({ ...prev, page: 0 }));
      }}
    />
  );
};
```

### Example 3: Create with Error Handling

```tsx
import { userService } from '../../services';
import { ApiError } from '../../utils/apiError';

const CreateUserForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateUserData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.createUser(data);
      // Success - show message or redirect
      showSuccessMessage('User created successfully');
      navigate('/users');
    } catch (err) {
      const apiError = err as ApiError;
      
      // Handle specific error codes
      if (apiError.code === 'HTTP_409') {
        setError('User with this email already exists');
      } else if (apiError.code === 'HTTP_422') {
        setError('Validation error: ' + apiError.message);
      } else {
        setError(apiError.message || 'Failed to create user');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}
      {/* Form fields */}
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  );
};
```

### Example 4: Delete with Confirmation Modal

```tsx
import { userService } from '../../services';
import { ActionModal } from '../../components/modals/ActionModal';

const UserManagementPage = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    setDeleting(true);
    try {
      await userService.deleteUser(userToDelete.id);
      setDeleteModalOpen(false);
      setUserToDelete(null);
      loadUsers(); // Refresh list
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* DataTable with delete action */}
      <ActionModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}?`}
        type="delete"
        actions={[
          {
            label: 'Cancel',
            onClick: () => {
              setDeleteModalOpen(false);
              setUserToDelete(null);
            },
            variant: 'outlined'
          },
          {
            label: deleting ? 'Deleting...' : 'Delete',
            onClick: handleDeleteConfirm,
            color: 'error',
            disabled: deleting
          }
        ]}
      />
    </>
  );
};
```

### Example 5: Using Filters with DataTable

```tsx
import { FilterPanel, FilterValues } from '../../components/filters/FilterPanel';
import { userService } from '../../services';

const UserManagementPage = () => {
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [users, setUsers] = useState([]);

  const filterOptions = [
    {
      id: 'search',
      label: 'Search',
      type: 'text' as const,
      placeholder: 'Search by name or email...'
    },
    {
      id: 'role',
      label: 'Role',
      type: 'select' as const,
      options: [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'DEALER', label: 'Dealer' },
        { value: 'PARTNER', label: 'Partner' }
      ]
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ];

  useEffect(() => {
    loadUsers();
  }, [filterValues]);

  const loadUsers = async () => {
    const search = (filterValues.search as string) || '';
    const role = (filterValues.role as string) || '';
    
    // Build query params from filters
    const params = {
      search,
      role: role || undefined,
      status: (filterValues.status as string) || undefined
    };

    const response = await userService.getAllUsers(1, 10, search);
    setUsers(response.users);
  };

  return (
    <>
      <FilterPanel
        filters={filterOptions}
        values={filterValues}
        onChange={setFilterValues}
        onReset={() => setFilterValues({})}
      />
      <DataTable columns={columns} rows={users} />
    </>
  );
};
```

### Example 6: Dealer Service Usage

```tsx
import { dealerService } from '../../services';

const DealerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await dealerService.getOrders(page, limit);
      setOrders(response.items);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await dealerService.updateOrder(orderId, status);
      loadOrders(1, 10); // Refresh
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message);
    }
  };

  return (
    <DataTable
      columns={orderColumns}
      rows={orders}
      loading={loading}
      rowActions={[
        {
          label: 'Mark Complete',
          onClick: (row) => handleUpdateStatus(row.id, 'completed'),
          color: 'success'
        }
      ]}
    />
  );
};
```

## Mock Mode Toggle

### Enable Mock Mode

**Web (.env):**
```env
VITE_USE_MOCK=true
VITE_API_URL=http://localhost:3000/api
```

**Mobile (.env):**
```env
EXPO_PUBLIC_USE_MOCK=true
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Switch to Real API

Simply set `USE_MOCK=false` or remove the variable. All services automatically switch to real API calls.

## Error Handling Patterns

### Pattern 1: Try-Catch with User Feedback
```tsx
try {
  await service.action();
  showSuccess();
} catch (error) {
  const apiError = error as ApiError;
  showError(apiError.message);
}
```

### Pattern 2: Error State Management
```tsx
const [error, setError] = useState<ApiError | null>(null);

try {
  await service.action();
} catch (err) {
  setError(err as ApiError);
}

{error && <Alert severity="error">{error.message}</Alert>}
```

### Pattern 3: Silent Failures (Background Refresh)
```tsx
// Token refresh happens automatically in interceptor
// No need to handle in component
const loadData = async () => {
  try {
    const data = await service.getData();
    setData(data);
  } catch (error) {
    // Only handle non-auth errors
    if ((error as ApiError).code !== 'HTTP_401') {
      handleError(error);
    }
  }
};
```

## Best Practices

1. **Always use loading states**
2. **Handle errors gracefully**
3. **Use TypeScript types**
4. **Don't call services in render**
5. **Use useEffect for data fetching**
6. **Clear errors on retry**
7. **Show user-friendly messages**

