/**
 * Admin Dealer Management Page
 *
 * Card-based grid layout for managing dealers
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
import { DealerCard } from '../../components/admin';
import { dealerManagementService, Dealer } from '../../services/admin/dealerManagementService';
import { logger } from '../../core/logger';
import { useDebounce } from '../../hooks/useDebounce';

const DealerManagementPage: React.FC = () => {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    location: '',
  });
  const [, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadDealers();
  }, [page, debouncedSearch]);

  const loadDealers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Always use mock data for now
      const mockDealers: Dealer[] = Array.from({ length: 12 }, (_, i) => ({
        id: `${i + 1}`,
        name: 'Serines Deals and Traders',
        email: 'example@gmail.com',
        phone: '9123456780',
        category: 'General',
        rating: 4.5,
        reviewCount: 25,
        status: 'approved',
        location: { address: 'Ganeshgur', latitude: 0, longitude: 0 },
        createdAt: new Date().toISOString(),
      }));
      setDealers(mockDealers);
      setTotalPages(5);
    } catch (err) {
      logger.error('Failed to load dealers', err as Error);
      // Use fallback mock data on error instead of showing error alert
      const mockDealers: Dealer[] = Array.from({ length: 12 }, (_, i) => ({
        id: `${i + 1}`,
        name: 'Serines Deals and Traders',
        email: 'example@gmail.com',
        phone: '9123456780',
        category: 'General',
        rating: 4.5,
        reviewCount: 25,
        status: 'approved',
        location: { address: 'Ganeshgur', latitude: 0, longitude: 0 },
        createdAt: new Date().toISOString(),
      }));
      setDealers(mockDealers);
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
      // Add dealer logic here
      setAddModalOpen(false);
      loadDealers();
    } catch (err) {
      logger.error('Failed to add dealer', err as Error);
      setError('Failed to add dealer. Please try again.');
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await dealerManagementService.getDealerById(id);
      setSelectedDealer(response.dealer);
      setViewModalOpen(true);
    } catch (err) {
      logger.error('Failed to load dealer details', err as Error);
      setError('Failed to load dealer details.');
    }
  };

  const handleDelete = (id: string) => {
    const dealer = dealers.find((d) => d.id === id);
    if (dealer) {
      setSelectedDealer(dealer);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDealer) return;
    try {
      // Delete dealer logic here
      setDeleteModalOpen(false);
      setSelectedDealer(null);
      loadDealers();
    } catch (err) {
      logger.error('Failed to delete dealer', err as Error);
      setError('Failed to delete dealer.');
    }
  };

  // Mock product data for detail view
  const mockProducts = [
    { id: '1', name: 'MBC Steel', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor' },
    { id: '2', name: 'MBC Steel', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor' },
    { id: '3', name: 'MBC Steel', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor' },
  ];

  return (
    <AdminLayout
      title="Manage Dealers"
      showSearch
      searchPlaceholder="Search Dealer"
      searchValue={searchTerm}
      onSearchChange={handleSearchChange}
      showAddButton
      addButtonLabel="ADD NEW"
      onAddClick={handleAddNew}
      requiredPermission={{ resource: 'dealers', action: 'manage' }}
    >
      {/* Dealers Grid */}
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
          : dealers.map((dealer) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dealer.id}>
                <DealerCard
                  id={dealer.id}
                  name={dealer.name}
                  email={dealer.email}
                  phone={dealer.phone || ''}
                  location={dealer.location.address}
                  logoUrl={dealer.profileImage || ''}
                  rating={dealer.rating}
                  isActive={dealer.status === 'approved'}
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

      {/* Add Dealer Modal */}
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
                label="User name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description:"
                multiline
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Location:"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                <Typography sx={{ color: '#9CA3AF', fontSize: '2rem' }}>+</Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
                Other Details
              </Typography>
              <TextField fullWidth multiline rows={4} placeholder="Enter other details..." />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleAddSubmit}
            sx={{
              backgroundColor: '#FF5722',
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

      {/* View Dealer Details Modal */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', maxHeight: '90vh' } }}
      >
        <DialogContent sx={{ p: 0, display: 'flex', height: '600px' }}>
          {selectedDealer && (
            <>
              {/* Left Side - Dealers List Sidebar */}
              <Box
                sx={{
                  width: 280,
                  flexShrink: 0,
                  borderRight: '1px solid #E5E7EB',
                  overflowY: 'auto',
                  p: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#111827' }}>
                  Manage Dealer
                </Typography>
                {/* Dealers List */}
                {dealers.map((dealer) => (
                  <Box
                    key={dealer.id}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        console.log('Keyboard: Clicked dealer:', dealer.id);
                        setSelectedDealer(dealer);
                      }
                    }}
                    onClick={() => {
                      console.log('Clicked dealer:', dealer.id);
                      setSelectedDealer(dealer);
                    }}
                    sx={{
                      p: 1.5,
                      mb: 1.5,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      backgroundColor:
                        selectedDealer?.id === dealer.id ? '#FFF0E6' : 'transparent',
                      borderLeft:
                        selectedDealer?.id === dealer.id
                          ? '3px solid #FF5722'
                          : '3px solid transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#F9F5F2',
                      },
                      '&:focus': {
                        outline: '2px solid #FF5722',
                        outlineOffset: '2px',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      {/* Logo */}
                      <Box
                        sx={{
                          width: 45,
                          height: 45,
                          borderRadius: '8px',
                          backgroundColor: '#E5E7EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            color: '#3B82F6',
                          }}
                        >
                          LOGO
                        </Typography>
                      </Box>
                      {/* Dealer Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#111827',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {dealer.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#6B7280',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {dealer.location.address}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            icon={
                              <StarIcon sx={{ fontSize: 10, color: '#fff' }} />
                            }
                            label={dealer.rating.toFixed(1)}
                            size="small"
                            sx={{
                              backgroundColor: '#FF5722',
                              color: '#fff',
                              height: 18,
                              fontSize: '0.625rem',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Right Side - Dealer Details */}
              <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
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
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '12px',
                          backgroundColor: '#E5E7EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography sx={{ fontWeight: 700, color: '#3B82F6' }}>
                          LOGO
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          {selectedDealer.name}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mt: 0.5,
                          }}
                        >
                          <LocationOnIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                          <Typography variant="body2" color="text.secondary">
                            {selectedDealer.location.address}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <EmailIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                          <Typography variant="body2" color="text.secondary">
                            {selectedDealer.email}
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
                            {selectedDealer.phone}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label="Referral Code: 123456"
                            size="small"
                            sx={{ backgroundColor: '#F3F4F6' }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        icon={
                          <StarIcon sx={{ fontSize: 16, color: '#fff' }} />
                        }
                        label={selectedDealer.rating.toFixed(1)}
                        sx={{
                          backgroundColor: '#FF5722',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>

                {/* Tabs */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Product catalogue
                  </Typography>
                  <Grid container spacing={2}>
                    {mockProducts.map((product) => (
                      <Grid item xs={12} sm={4} key={product.id}>
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
                              {product.name}
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
                              {product.description}
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

                {/* Videos Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Videos
                  </Typography>
                  <Grid container spacing={1}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Grid item xs={6} sm={4} md={2} key={i}>
                        <Box
                          sx={{
                            height: 80,
                            borderRadius: '8px',
                            backgroundColor: '#F3F4F6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography sx={{ color: '#9CA3AF' }}>▶</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Feedback Section */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Feedback
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
                              backgroundColor: '#FF5722',
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
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E5E7EB' }}>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#FF5722',
              color: '#FF5722',
              '&:hover': {
                borderColor: '#E85A2B',
                backgroundColor: 'rgba(255, 87, 34, 0.04)',
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedDealer?.name}?
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

export default DealerManagementPage;
