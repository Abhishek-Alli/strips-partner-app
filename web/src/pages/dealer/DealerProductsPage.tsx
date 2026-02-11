/**
 * Dealer Products Page (Web)
 * 
 * Manage product catalogue with DataTable
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { webDealerService } from '../../services/dealer/dealerService';
import { DealerProduct, MasterProduct } from '../../../../shared/types/dealer.types';
import { DataTable } from '../../components/table/DataTable';
import { logger } from '../../core/logger';

const DealerProductsPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<DealerProduct[]>([]);
  const [masterProducts, setMasterProducts] = useState<MasterProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DealerProduct | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    price: '',
    unit: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [dealerProducts, master] = await Promise.all([
        webDealerService.getDealerProducts(user.id),
        webDealerService.getMasterProducts(),
      ]);
      setProducts(dealerProducts);
      setMasterProducts(master);
    } catch (error) {
      logger.error('Failed to load products', error as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ productId: '', price: '', unit: '', status: 'active' });
    setIsDialogOpen(true);
  };

  const handleEdit = (product: DealerProduct) => {
    setEditingProduct(product);
    setFormData({
      productId: product.productId,
      price: product.price?.toString() || '',
      unit: product.unit || '',
      status: product.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await webDealerService.deleteDealerProduct(productId);
      loadData();
    } catch (error) {
      logger.error('Failed to delete product', error as Error);
      alert('Failed to delete product');
    }
  };

  const handleSave = async () => {
    if (!user?.id || !formData.productId) {
      alert('Please select a product');
      return;
    }
    try {
      if (editingProduct) {
        await webDealerService.updateDealerProduct(editingProduct.id, {
          price: formData.price ? parseFloat(formData.price) : undefined,
          unit: formData.unit,
          status: formData.status,
        });
      } else {
        await webDealerService.addDealerProduct({
          dealerId: user.id,
          productId: formData.productId,
          price: formData.price ? parseFloat(formData.price) : undefined,
          unit: formData.unit,
          status: formData.status,
        });
      }
      setIsDialogOpen(false);
      loadData();
    } catch (error) {
      logger.error('Failed to save product', error as Error);
      alert('Failed to save product');
    }
  };

  const columns = [
    {
      key: 'productName',
      label: 'Product Name',
    },
    {
      key: 'price',
      label: 'Price',
      render: (value?: number, row?: DealerProduct) => {
        if (!value) return '-';
        return `₹${value} ${row?.unit ? `per ${row.unit}` : ''}`;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Chip
          label={value.toUpperCase()}
          color={value === 'active' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: DealerProduct) => (
        <Box>
          <IconButton size="small" onClick={() => handleEdit(row)}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(row.id)}>
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Products</Typography>
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={handleAdd}>
            Add Product
          </Button>
        </Box>

        <DataTable data={products} columns={columns} loading={loading} />

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Select Product</InputLabel>
              <Select
                value={formData.productId}
                onChange={(e) => {
                  const selected = masterProducts.find(mp => mp.id === e.target.value);
                  setFormData({
                    ...formData,
                    productId: e.target.value,
                    unit: selected?.unit || formData.unit,
                  });
                }}
                label="Select Product"
                disabled={!!editingProduct}
              >
                {masterProducts.map((mp) => (
                  <MenuItem key={mp.id} value={mp.id}>
                    {mp.name} ({mp.category})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Price (optional)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
};

export default DealerProductsPage;

