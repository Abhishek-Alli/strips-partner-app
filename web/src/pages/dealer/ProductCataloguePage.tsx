/**
 * Dealer Product Catalogue Page
 * 
 * Dealer can manage their product catalogue
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { logger } from '../../core/logger';
import { ActionModal } from '../../components/modals/ActionModal';

interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  price?: string;
  category: string;
}

const ProductCataloguePage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    category: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Mock: Load products for dealer
      // In real implementation, call: dealerService.getProducts(user.id)
      setProducts([
        {
          id: '1',
          name: 'Sample Product 1',
          description: 'High quality product',
          price: '₹1,000',
          category: 'Materials'
        }
      ]);
    } catch (error) {
      logger.error('Failed to load products', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      price: '',
      category: ''
    });
    setProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      image: product.image || '',
      price: product.price || '',
      category: product.category
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!user?.id) return;

    try {
      // Mock: Save product
      // In real implementation, call: dealerService.saveProduct(user.id, formData)
      if (selectedProduct) {
        // Update existing
        setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, ...formData } : p));
      } else {
        // Add new
        const newProduct: Product = {
          id: String(Date.now()),
          ...formData
        };
        setProducts([...products, newProduct]);
      }
      setProductModalOpen(false);
      setSelectedProduct(null);
      alert('Product saved successfully');
    } catch (error) {
      logger.error('Failed to save product', error as Error);
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      // Mock: Delete product
      // In real implementation, call: dealerService.deleteProduct(user.id, selectedProduct.id)
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setDeleteModalOpen(false);
      setSelectedProduct(null);
      alert('Product deleted successfully');
    } catch (error) {
      logger.error('Failed to delete product', error as Error);
      alert('Failed to delete product');
    }
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Product Catalogue
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddProduct}>
            Add Product
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No products yet
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddProduct} sx={{ mt: 2 }}>
              Add Your First Product
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card>
                  {product.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image}
                      alt={product.name}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      {product.price}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.category}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteProduct(product)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add/Edit Product Modal */}
        <Dialog open={productModalOpen} onClose={() => setProductModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mt: 1 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              sx={{ mt: 2 }}
              placeholder="https://example.com/image.jpg"
            />
            <TextField
              fullWidth
              label="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              sx={{ mt: 2 }}
              placeholder="₹1,000"
            />
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              sx={{ mt: 2 }}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProductModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProduct} variant="contained" disabled={!formData.name || !formData.category}>
              {selectedProduct ? 'Update' : 'Add'} Product
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <ActionModal
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedProduct(null);
          }}
          title="Delete Product"
          message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
          type="delete"
          actions={[
            {
              label: 'Cancel',
              onClick: () => {
                setDeleteModalOpen(false);
                setSelectedProduct(null);
              }
            },
            {
              label: 'Delete',
              onClick: handleDeleteConfirm,
              color: 'error'
            }
          ]}
        />
      </Box>
    </ProtectedRoute>
  );
};

export default ProductCataloguePage;






