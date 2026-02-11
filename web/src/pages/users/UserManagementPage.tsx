import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { userService } from '../../services/userService';
import { User } from '../../types/auth.types';
import { DataTable, Column, RowAction, PaginationConfig } from '../../components/table/DataTable';
import { FilterPanel, FilterOption, FilterValues } from '../../components/filters/FilterPanel';
import { ActionModal, ActionModalAction } from '../../components/modals/ActionModal';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage, searchTerm, filterValues]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Combine search and filters
      const combinedSearch = searchTerm || (filterValues.search as string) || '';
      const response = await userService.getAllUsers(page + 1, rowsPerPage, combinedSearch);
      setUsers(response.users);
      setTotal(response.pagination.total);
    } catch (error) {
      const { logger } = await import('../../core/logger');
      logger.error('Failed to load users', error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(0);
  }, []);

  const handleSort = useCallback((columnId: string, order: 'asc' | 'desc') => {
    // Mock sorting - replace with API call
    console.log('Sort by:', columnId, order);
    // In real implementation, add sort params to API call
  }, []);

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      await userService.deleteUser(selectedUser.id);
      setDeleteModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      const { logger } = await import('../../core/logger');
      logger.error('Failed to delete user', error);
      alert(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleFilterChange = (values: FilterValues) => {
    setFilterValues(values);
    setPage(0);
  };

  const getRoleColor = (role: UserRole): 'error' | 'primary' | 'secondary' | 'default' => {
    switch (role) {
      case UserRole.ADMIN:
        return 'error';
      case UserRole.DEALER:
        return 'primary';
      case UserRole.PARTNER:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const columns: Column<User>[] = [
    {
      id: 'name',
      label: 'Name',
      sortable: true
    },
    {
      id: 'email',
      label: 'Email',
      sortable: true
    },
    {
      id: 'phone',
      label: 'Phone',
      format: (value) => value || '-'
    },
    {
      id: 'role',
      label: 'Role',
      render: (row) => (
        <Chip label={row.role} color={getRoleColor(row.role)} size="small" />
      )
    },
    {
      id: 'is_active',
      label: 'Status',
      render: (row) => (
        <Chip
          label={row.is_active ? 'Active' : 'Inactive'}
          color={row.is_active ? 'success' : 'default'}
          size="small"
        />
      )
    }
  ];

  const rowActions: RowAction<User>[] = [
    {
      label: 'Edit',
      icon: <EditIcon fontSize="small" />,
      onClick: (row) => {
        // Navigate to edit page or open edit modal
        console.log('Edit user:', row.id);
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <DeleteIcon fontSize="small" />,
      onClick: handleDeleteClick,
      color: 'error'
    }
  ];

  const filterOptions: FilterOption[] = [
    {
      id: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Search by name or email...'
    },
    {
      id: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: UserRole.ADMIN, label: 'Admin' },
        { value: UserRole.DEALER, label: 'Dealer' },
        { value: UserRole.PARTNER, label: 'Partner' },
        { value: UserRole.GENERAL_USER, label: 'General User' }
      ]
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ];

  const pagination: PaginationConfig = {
    page,
    rowsPerPage,
    total,
    onPageChange: setPage,
    onRowsPerPageChange: (newRowsPerPage) => {
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    }
  };

  const deleteModalActions: ActionModalAction[] = [
    {
      label: 'Cancel',
      onClick: () => {
        setDeleteModalOpen(false);
        setSelectedUser(null);
      },
      variant: 'outlined'
    },
    {
      label: 'Delete',
      onClick: handleDeleteConfirm,
      color: 'error',
      variant: 'contained'
    }
  ];

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <Box>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>

        <FilterPanel
          filters={filterOptions}
          values={filterValues}
          onChange={handleFilterChange}
          onReset={() => {
            setFilterValues({});
            setPage(0);
          }}
        />

        <DataTable
          title="Users"
          columns={columns}
          rows={users}
          loading={isLoading}
          pagination={pagination}
          searchable={true}
          searchPlaceholder="Search users..."
          onSearch={handleSearch}
          sortable={true}
          sortBy="name"
          sortOrder="asc"
          onSort={handleSort}
          rowActions={rowActions}
          getRowId={(row) => row.id}
          emptyMessage="No users found"
        />

        <ActionModal
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedUser(null);
          }}
          title="Delete User"
          message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
          type="delete"
          actions={deleteModalActions}
        />
      </Box>
    </ProtectedRoute>
  );
};

export default UserManagementPage;



