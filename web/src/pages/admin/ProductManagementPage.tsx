/**
 * Admin Product Management Page
 *
 * Card-based grid layout for managing products
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
} from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ProductCard } from '../../components/admin';
import { apiClient } from '../../services/apiClient';
import { logger } from '../../core/logger';
import { useDebounce } from '../../hooks/useDebounce';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  category?: string;
  createdAt: Date;
}

const ITEMS_PER_PAGE = 12;

const ProductManagementPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
  });
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadProducts();
  }, [page, debouncedSearch]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      if (apiClient.isMockMode()) {
        // Mock data
        const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
          id: `${i + 1}`,
          name: 'MBC Steel',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          isActive: true,
          category: 'Steel',
          createdAt: new Date(),
        }));
        setProducts(mockProducts);
        setTotalPages(5);
      } else {
        const response = await apiClient.get<{
          items: Product[];
          pagination: { total: number; pages: number };
        }>('/admin/products', {
          params: {
            page,
            limit: ITEMS_PER_PAGE,
            search: debouncedSearch || undefined,
          },
        });
        setProducts(response.items);
        setTotalPages(response.pagination.pages);
      }
    } catch (err) {
      logger.error('Failed to load products', err as Error);
      // Use mock data on error
      const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
        id: `${i + 1}`,
        name: 'Acel Switch',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        isActive: true,
        category: 'Electrical',
        createdAt: new Date(),
      }));
      setProducts(mockProducts);
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
    setFormData({ name: '', description: '', category: '' });
    setAddModalOpen(true);
  };

  const handleAddSubmit = async () => {
    try {
      if (!apiClient.isMockMode()) {
        await apiClient.post('/admin/products', formData);
      }
      setAddModalOpen(false);
      loadProducts();
    } catch (err) {
      logger.error('Failed to add product', err as Error);
      setError('Failed to add product. Please try again.');
    }
  };

  const handleViewDetails = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setViewModalOpen(true);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      if (!apiClient.isMockMode()) {
        await apiClient.patch(`/admin/products/${id}`, { isActive: active });
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: active } : p))
      );
    } catch (err) {
      logger.error('Failed to update product status', err as Error);
      setError('Failed to update product status.');
    }
  };

  const handleDelete = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    try {
      if (!apiClient.isMockMode()) {
        await apiClient.delete(`/admin/products/${selectedProduct.id}`);
      }
      setDeleteModalOpen(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (err) {
      logger.error('Failed to delete product', err as Error);
      setError('Failed to delete product.');
    }
  };

  // Mock images for detail view
  const mockImages = Array.from({ length: 6 }, (_, i) => ({ id: `img-${i}` }));

  return (
    <AdminLayout
      title="Manage Products"
      showSearch
      searchPlaceholder="Search Product"
      searchValue={searchTerm}
      onSearchChange={handleSearchChange}
      showAddButton
      addButtonLabel="ADD NEW"
      onAddClick={handleAddNew}
      requiredPermission={{ resource: 'products', action: 'manage' }}
    >
      {/* Products Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton
                  variant="rounded"
                  height={340}
                  sx={{ borderRadius: '12px' }}
                />
              </Grid>
            ))
          : products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  imageUrl={product.imageUrl}
                  isActive={product.isActive}
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

      {/* Add Product Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pt: 3 }}>
          Add New Product
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 3 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Product name"
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
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Box>
            <Box sx={{ width: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Product Images
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
                Specifications
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter specifications..."
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

      {/* View Product Details Modal */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', maxHeight: '90vh' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedProduct && (
            <Box sx={{ display: 'flex', gap: 3, p: 3 }}>
              {/* Left Side - Products List */}
              <Box sx={{ width: 260, flexShrink: 0 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Manage Products
                </Typography>
                {/* Mini product list */}
                {products.slice(0, 5).map((p) => (
                  <Paper
                    key={p.id}
                    elevation={0}
                    onClick={() => setSelectedProduct(p)}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      borderRadius: '8px',
                      border:
                        p.id === selectedProduct.id
                          ? '2px solid #FF6B35'
                          : '1px solid #E5E7EB',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#FF6B35',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '6px',
                          backgroundColor: '#F3F4F6',
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {p.name}
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
                          {p.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* Right Side - Product Details */}
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
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box
                      sx={{
                        width: 180,
                        height: 180,
                        borderRadius: '12px',
                        backgroundColor: '#F3F4F6',
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {selectedProduct.name}
                      </Typography>
                      {selectedProduct.category && (
                        <Typography
                          variant="body2"
                          sx={{ color: '#6B7280', mb: 2 }}
                        >
                          Category: {selectedProduct.category}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        {selectedProduct.description}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Images Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Product Images
                  </Typography>
                  <Grid container spacing={1}>
                    {mockImages.map((img) => (
                      <Grid item xs={6} sm={4} md={2} key={img.id}>
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

                {/* Specifications Section */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Specifications
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Material
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          High Carbon Steel
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Grade
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          A36
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Dimensions
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Various sizes available
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Weight
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Per meter calculation
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E5E7EB' }}>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedProduct?.name}?
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

export default ProductManagementPage;
