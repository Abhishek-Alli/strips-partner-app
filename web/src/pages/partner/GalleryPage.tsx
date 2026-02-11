/**
 * Gallery Page (Partner/Dealer Web)
 * 
 * Manage gallery images
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { webBusinessService } from '../../services/business/businessService';
import { GalleryItem } from '../../../../shared/types/business.types';
import { logger } from '../../core/logger';

const GalleryPage: React.FC = () => {
  const { user } = useAuth();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
  });

  useEffect(() => {
    if (user?.id) {
      loadGallery();
    }
  }, [user?.id]);

  const loadGallery = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await webBusinessService.getGallery(user.id);
      setGallery(data);
    } catch (error) {
      logger.error('Failed to load gallery', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!user?.id) return;
    try {
      await webBusinessService.addGalleryItem({
        ...formData,
        userId: user.id,
      });
      setIsDialogOpen(false);
      setFormData({ title: '', description: '', imageUrl: '', category: '' });
      loadGallery();
    } catch (error) {
      logger.error('Failed to add gallery item', error as Error);
      alert('Failed to add gallery item');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await webBusinessService.deleteGalleryItem(itemId);
      loadGallery();
    } catch (error) {
      logger.error('Failed to delete gallery item', error as Error);
      alert('Failed to delete gallery item');
    }
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.PARTNER, UserRole.DEALER]}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Gallery</Typography>
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => setIsDialogOpen(true)}>
            Add Image
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={2}>
            {gallery.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.imageUrl}
                    alt={item.title}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.title || 'Untitled'}</Typography>
                    {item.description && (
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item.id)}
                      sx={{ mt: 1 }}
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Gallery Image</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAdd}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
};

export default GalleryPage;

