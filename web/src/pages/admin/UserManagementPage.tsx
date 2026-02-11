/**
 * User Management Page
 *
 * Admin page for managing users with card-based grid layout
 * UI matches PDF design reference
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Skeleton,
  Pagination,
  Alert,
} from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { UserProfileCard } from '../../components/admin';
import { apiClient } from '../../services/apiClient';
import { logger } from '../../core/logger';
import { useDebounce } from '../../hooks/useDebounce';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  referralCode?: string;
  isActive: boolean;
  createdAt: Date;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  description?: string;
  location?: string;
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    description: '',
    location: '',
  });
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadUsers();
  }, [page, debouncedSearch]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Always use mock data for now
      const mockUsers: User[] = Array.from({ length: 12 }, (_, i) => ({
        id: `${i + 1}`,
        name: 'Alok Das',
        email: 'example@gmail.com',
        phone: '9123456780',
        referralCode: '123456',
        isActive: true,
        createdAt: new Date(),
      }));
      setUsers(mockUsers);
      setTotalPages(5);
    } catch (err) {
      logger.error('Failed to load users', err as Error);
      // Use fallback mock data on error instead of showing error alert
      const mockUsers: User[] = Array.from({ length: 12 }, (_, i) => ({
        id: `${i + 1}`,
        name: 'Alok Das',
        email: 'example@gmail.com',
        phone: '9123456780',
        referralCode: '123456',
        isActive: true,
        createdAt: new Date(),
      }));
      setUsers(mockUsers);
      setTotalPages(5);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const handleAddNew = () => {
    setFormData({ name: '', email: '', phone: '', description: '', location: '' });
    setAddModalOpen(true);
  };

  const handleAddSubmit = async () => {
    try {
      if (!apiClient.isMockMode()) {
        await apiClient.post('/admin/users', formData);
      }
      setAddModalOpen(false);
      loadUsers();
    } catch (err) {
      logger.error('Failed to add user', err as Error);
      setError('Failed to add user. Please try again.');
    }
  };

  const handleViewDetails = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
      setViewModalOpen(true);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      if (!apiClient.isMockMode()) {
        await apiClient.patch(`/admin/users/${id}`, { isActive: active });
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isActive: active } : u))
      );
    } catch (err) {
      logger.error('Failed to update user status', err as Error);
      setError('Failed to update user status.');
    }
  };

  const handleDelete = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      if (!apiClient.isMockMode()) {
        await apiClient.delete(`/admin/users/${selectedUser.id}`);
      }
      setDeleteModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err) {
      logger.error('Failed to delete user', err as Error);
      setError('Failed to delete user.');
    }
  };

  return (
    <AdminLayout
      title="Manage Users"
      showSearch
      searchPlaceholder="Search User"
      searchValue={searchTerm}
      onSearchChange={handleSearchChange}
      showAddButton
      addButtonLabel="ADD NEW"
      onAddClick={handleAddNew}
    >
      {/* Greeting */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: '#2D3142',
            fontSize: '1.5rem',
          }}
        >
          Hello Abhishek 👋
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            mt: 0.5,
          }}
        >
          Manage your users efficiently
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Users Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton
                  variant="rounded"
                  height={280}
                  sx={{ borderRadius: '12px' }}
                />
              </Grid>
            ))
          : users.map((user) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                <UserProfileCard
                  id={user.id}
                  name={user.name}
                  email={user.email}
                  phone={user.phone}
                  avatarUrl={user.avatarUrl}
                  referralCode={user.referralCode}
                  isActive={user.isActive}
                  onToggleActive={handleToggleActive}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
      </Grid>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                '&.Mui-selected': {
                  backgroundColor: '#FF6B35',
                  color: '#fff',
                },
              },
            }}
          />
        </Box>
      )}

      {/* Add User Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '1.25rem',
            pt: 3,
          }}
        >
          Add New User/dealer/partner
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 3 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="User name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                sx={{ mb: 2 }}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Description:"
                multiline
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                sx={{ mb: 2 }}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Location:"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                variant="outlined"
              />
            </Box>
            <Box sx={{ width: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Images (optional)
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 150,
                  border: '2px dashed #E5E7EB',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#FF6B35',
                  },
                }}
              >
                <Typography sx={{ color: '#9CA3AF', fontSize: '2rem' }}>
                  +
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
                Other Details
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Enter other details..."
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleAddSubmit}
            sx={{
              backgroundColor: '#FF6B35',
              color: '#fff',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 6,
              py: 1.25,
              '&:hover': {
                backgroundColor: '#E85A2B',
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Modal */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography variant="h6">{selectedUser.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser.phone}
              </Typography>
              {selectedUser.referralCode && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Referral Code: {selectedUser.referralCode}
                </Typography>
              )}
              <Typography variant="body2" sx={{ mt: 1 }}>
                Status: {selectedUser.isActive ? 'Active' : 'Inactive'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{
          sx: { borderRadius: '16px' },
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedUser?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default UserManagementPage;
