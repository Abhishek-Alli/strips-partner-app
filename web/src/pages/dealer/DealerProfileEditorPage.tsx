/**
 * Dealer Profile Editor Page
 * 
 * Dealer can edit their own profile, manage gallery and products
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Tabs, Tab, Grid, CardMedia } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { dealerManagementService } from '../../services/admin/dealerManagementService';
import { logger } from '../../core/logger';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DealerProfileEditorPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    description: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  const [gallery, setGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await dealerManagementService.getDealerById(user.id);
      const dealer = response.dealer;
      setFormData({
        name: dealer.name || '',
        email: dealer.email || '',
        phone: dealer.phone || '',
        category: dealer.category || '',
        description: dealer.description || '',
        address: dealer.location?.address || '',
        latitude: dealer.location?.latitude?.toString() || '',
        longitude: dealer.location?.longitude?.toString() || ''
      });
    } catch (error) {
      logger.error('Failed to load profile', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      await dealerManagementService.updateDealer(user.id, {
        ...formData,
        location: {
          address: formData.address,
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0
        }
      });
      alert('Profile updated successfully');
    } catch (error) {
      logger.error('Failed to update profile', error as Error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGalleryImage = (url: string) => {
    setGallery([...gallery, url]);
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Profile Details" />
            <Tab label="Gallery" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Card>
            <CardContent>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Latitude"
                type="number"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              />
              <TextField
                fullWidth
                label="Longitude"
                type="number"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 2 }}
            />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={loading}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gallery Management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add images to showcase your products and services
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                {gallery.map((url, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={url}
                        alt={`Gallery image ${index + 1}`}
                      />
                      <CardContent>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleRemoveGalleryImage(index)}
                          fullWidth
                        >
                          Remove
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  onClick={() => {
                    const url = prompt('Enter image URL:');
                    if (url) {
                      handleAddGalleryImage(url);
                    }
                  }}
                >
                  Add Gallery Image
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </Box>
    </ProtectedRoute>
  );
};

export default DealerProfileEditorPage;

