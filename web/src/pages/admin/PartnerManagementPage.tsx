/**
 * Admin Partner Management Page
 *
 * Card-based grid layout for managing partners
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
  Paper,
  Chip,
  Avatar,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import StarIcon from '@mui/icons-material/Star';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { PartnerCard } from '../../components/admin';
import {
  partnerManagementService,
  Partner,
  PartnerFilters,
} from '../../services/admin/partnerManagementService';
import { logger } from '../../core/logger';
import { useDebounce } from '../../hooks/useDebounce';

const ITEMS_PER_PAGE = 12;

const PartnerManagementPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [actionType, setActionType] = useState<
    'approve' | 'reject' | 'suspend' | 'reactivate' | null
  >(null);
  const [actionReason, setActionReason] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    location: '',
    category: '',
  });
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadPartners();
  }, [page, debouncedSearch]);

  const loadPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      // Always use mock data for now
      const mockPartners: Partner[] = Array.from({ length: 12 }, (_, i) => ({
        id: `${i + 1}`,
        name: 'Denial jhon',
        email: 'example@gmail.com',
        phone: '9123456780',
        category: 'Architecture',
        rating: 4.8,
        reviewCount: 32,
        status: 'approved',
        createdAt: new Date().toISOString(),
      }));
      setPartners(mockPartners);
      setTotalPages(5);
    } catch (err) {
      logger.error('Failed to load partners', err as Error);
      // Use fallback mock data on error instead of showing error alert
      const mockPartners: Partner[] = Array.from({ length: 12 }, (_, i) => ({
        id: `${i + 1}`,
        name: 'Denial jhon',
        email: 'example@gmail.com',
        phone: '9123456780',
        category: 'Architecture',
        rating: 4.8,
        reviewCount: 32,
        status: 'approved',
        createdAt: new Date().toISOString(),
      }));
      setPartners(mockPartners);
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
    setFormData({
      name: '',
      email: '',
      phone: '',
      description: '',
      location: '',
      category: '',
    });
    setAddModalOpen(true);
  };

  const handleAddSubmit = async () => {
    try {
      // Add partner logic here
      setAddModalOpen(false);
      loadPartners();
    } catch (err) {
      logger.error('Failed to add partner', err as Error);
      setError('Failed to add partner. Please try again.');
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await partnerManagementService.getPartnerById(id);
      setSelectedPartner(response.partner);
      setViewModalOpen(true);
    } catch (err) {
      logger.error('Failed to load partner details', err as Error);
      setError('Failed to load partner details.');
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      if (active) {
        await partnerManagementService.reactivatePartner(id);
      } else {
        await partnerManagementService.suspendPartner(id, 'Suspended by admin');
      }
      setPartners((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: active ? 'approved' : 'suspended' } : p
        )
      );
    } catch (err) {
      logger.error('Failed to update partner status', err as Error);
      setError('Failed to update partner status.');
    }
  };

  const handleDelete = (id: string) => {
    const partner = partners.find((p) => p.id === id);
    if (partner) {
      setSelectedPartner(partner);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPartner) return;
    try {
      // Delete partner logic here
      setDeleteModalOpen(false);
      setSelectedPartner(null);
      loadPartners();
    } catch (err) {
      logger.error('Failed to delete partner', err as Error);
      setError('Failed to delete partner.');
    }
  };

  const handleAction = (
    partner: Partner,
    type: 'approve' | 'reject' | 'suspend' | 'reactivate'
  ) => {
    setSelectedPartner(partner);
    setActionType(type);
    setActionModalOpen(true);
    setActionReason('');
  };

  const handleActionConfirm = async () => {
    if (!selectedPartner || !actionType) return;

    try {
      switch (actionType) {
        case 'approve':
          await partnerManagementService.approvePartner(selectedPartner.id);
          break;
        case 'reject':
          await partnerManagementService.rejectPartner(
            selectedPartner.id,
            actionReason
          );
          break;
        case 'suspend':
          await partnerManagementService.suspendPartner(
            selectedPartner.id,
            actionReason
          );
          break;
        case 'reactivate':
          await partnerManagementService.reactivatePartner(selectedPartner.id);
          break;
      }
      setActionModalOpen(false);
      setSelectedPartner(null);
      setActionType(null);
      setActionReason('');
      loadPartners();
    } catch (err) {
      logger.error('Failed to perform action', err as Error);
      setError('Failed to perform action.');
    }
  };

  // Mock portfolio items for detail view
  const mockPortfolio = [
    {
      id: '1',
      name: 'Project Alpha',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
    {
      id: '2',
      name: 'Project Beta',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
    {
      id: '3',
      name: 'Project Gamma',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
  ];

  const getStatusColor = (
    status: Partner['status']
  ): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <AdminLayout
      title="Manage Partners"
      showSearch
      searchPlaceholder="Search Partner"
      searchValue={searchTerm}
      onSearchChange={handleSearchChange}
      showAddButton
      addButtonLabel="ADD NEW"
      onAddClick={handleAddNew}
      requiredPermission={{ resource: 'partners', action: 'manage' }}
    >
      {/* Partners Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton
                  variant="rounded"
                  height={320}
                  sx={{ borderRadius: '12px' }}
                />
              </Grid>
            ))
          : partners.map((partner) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={partner.id}>
                <PartnerCard
                  id={partner.id}
                  name={partner.name}
                  email={partner.email}
                  phone={partner.phone}
                  category={partner.category}
                  avatarUrl={partner.avatarUrl}
                  rating={partner.rating}
                  referralCode={partner.referralCode}
                  isActive={partner.status === 'approved'}
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

      {/* Add Partner Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pt: 3 }}>
          Add New User/dealer/partner
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 3 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Partner name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description:"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Location:"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
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
                  '&:hover': { borderColor: '#FF6B35' },
                }}
              >
                <Typography sx={{ color: '#9CA3AF', fontSize: '2rem' }}>
                  +
                </Typography>
              </Box>
              <Typography
                variant="subtitle2"
                sx={{ mt: 3, mb: 1, fontWeight: 600 }}
              >
                Other Details
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
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
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 6,
              py: 1.25,
              '&:hover': { backgroundColor: '#E85A2B' },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Partner Details Modal */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', maxHeight: '90vh' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedPartner && (
            <Box sx={{ display: 'flex', gap: 3, p: 3 }}>
              {/* Left Side - Partners List */}
              <Box sx={{ width: 280, flexShrink: 0 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Manage Partner
                </Typography>
                {/* This would show a list of partners */}
              </Box>

              {/* Right Side - Partner Details */}
              <Box sx={{ flex: 1 }}>
                {/* Header */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar
                        src={selectedPartner.avatarUrl}
                        sx={{
                          width: 80,
                          height: 80,
                          fontSize: '2rem',
                          backgroundColor: '#E5E7EB',
                          color: '#6B7280',
                        }}
                      >
                        {selectedPartner.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          {selectedPartner.name}
                        </Typography>
                        <Chip
                          label={selectedPartner.category}
                          size="small"
                          sx={{
                            mt: 0.5,
                            mb: 1,
                            backgroundColor: '#E0E7FF',
                            color: '#4338CA',
                          }}
                        />
                        {selectedPartner.location && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            <LocationOnIcon
                              sx={{ fontSize: 16, color: '#9CA3AF' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {selectedPartner.location}
                            </Typography>
                          </Box>
                        )}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <EmailIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                          <Typography variant="body2" color="text.secondary">
                            {selectedPartner.email}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <PhoneIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                          <Typography variant="body2" color="text.secondary">
                            {selectedPartner.phone}
                          </Typography>
                        </Box>
                        {selectedPartner.referralCode && (
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={`Referral Code: ${selectedPartner.referralCode}`}
                              size="small"
                              sx={{ backgroundColor: '#F3F4F6' }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={selectedPartner.status}
                        color={getStatusColor(selectedPartner.status)}
                        size="small"
                      />
                      <Chip
                        icon={
                          <StarIcon sx={{ fontSize: 16, color: '#fff' }} />
                        }
                        label={selectedPartner.rating.toFixed(1)}
                        sx={{
                          backgroundColor: '#FF6B35',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>

                {/* Portfolio Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Portfolio
                  </Typography>
                  <Grid container spacing={2}>
                    {mockPortfolio.map((item) => (
                      <Grid item xs={12} sm={4} key={item.id}>
                        <Paper
                          elevation={0}
                          sx={{
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid #E5E7EB',
                          }}
                        >
                          <Box sx={{ height: 120, backgroundColor: '#F3F4F6' }} />
                          <Box sx={{ p: 2 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {item.description}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Images Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Images
                  </Typography>
                  <Grid container spacing={1}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Grid item xs={6} sm={4} md={2} key={i}>
                        <Box
                          sx={{
                            height: 80,
                            borderRadius: '8px',
                            backgroundColor: '#F3F4F6',
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Reviews Section */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Reviews ({selectedPartner.reviewCount})
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar sx={{ width: 40, height: 40 }}>A</Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            Alok Das
                          </Typography>
                          <Chip
                            icon={
                              <StarIcon sx={{ fontSize: 12, color: '#fff' }} />
                            }
                            label="4.5"
                            size="small"
                            sx={{
                              backgroundColor: '#FF6B35',
                              color: '#fff',
                              height: 20,
                              fontSize: '0.6875rem',
                            }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          example@gmail.com
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          2 mins ago
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, color: '#6B7280' }}
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do tempor incididunt ut labore et dolore...
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E5E7EB' }}>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
          {selectedPartner?.status === 'pending' && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setViewModalOpen(false);
                  handleAction(selectedPartner, 'approve');
                }}
              >
                APPROVE
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setViewModalOpen(false);
                  handleAction(selectedPartner, 'reject');
                }}
              >
                REJECT
              </Button>
            </>
          )}
          {selectedPartner?.status === 'approved' && (
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                setViewModalOpen(false);
                handleAction(selectedPartner, 'suspend');
              }}
            >
              SUSPEND
            </Button>
          )}
          {selectedPartner?.status === 'suspended' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setViewModalOpen(false);
                handleAction(selectedPartner, 'reactivate');
              }}
            >
              REACTIVATE
            </Button>
          )}
          <Button
            variant="outlined"
            sx={{
              borderColor: '#FF6B35',
              color: '#FF6B35',
              '&:hover': {
                borderColor: '#E85A2B',
                backgroundColor: 'rgba(255, 107, 53, 0.04)',
              },
            }}
          >
            EDIT
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setViewModalOpen(false);
              setDeleteModalOpen(true);
            }}
          >
            DELETE
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Confirmation Modal */}
      <Dialog
        open={actionModalOpen}
        onClose={() => {
          setActionModalOpen(false);
          setSelectedPartner(null);
          setActionType(null);
          setActionReason('');
        }}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>
          {actionType === 'approve'
            ? 'Approve Partner'
            : actionType === 'reject'
            ? 'Reject Partner'
            : actionType === 'suspend'
            ? 'Suspend Partner'
            : 'Reactivate Partner'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === 'approve'
              ? `Are you sure you want to approve ${selectedPartner?.name}?`
              : actionType === 'reject'
              ? `Are you sure you want to reject ${selectedPartner?.name}?`
              : actionType === 'suspend'
              ? `Are you sure you want to suspend ${selectedPartner?.name}?`
              : `Are you sure you want to reactivate ${selectedPartner?.name}?`}
          </Typography>
          {(actionType === 'reject' || actionType === 'suspend') && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason"
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setActionModalOpen(false);
              setSelectedPartner(null);
              setActionType(null);
              setActionReason('');
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleActionConfirm}
            variant="contained"
            color={
              actionType === 'reject' || actionType === 'suspend'
                ? 'error'
                : 'primary'
            }
          >
            {actionType === 'approve'
              ? 'Approve'
              : actionType === 'reject'
              ? 'Reject'
              : actionType === 'suspend'
              ? 'Suspend'
              : 'Reactivate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedPartner?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default PartnerManagementPage;
