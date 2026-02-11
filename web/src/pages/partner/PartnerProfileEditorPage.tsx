/**
 * Partner Profile Editor Page
 * 
 * Partner can edit their own profile, upload media
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Tabs, Tab, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import LinkIcon from '@mui/icons-material/Link';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { partnerManagementService } from '../../services/admin/partnerManagementService';
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

const PartnerProfileEditorPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    description: '',
    location: ''
  });
  const [media, setMedia] = useState<Array<{ id: string; type: 'image' | 'video' | 'link'; url: string; title?: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await partnerManagementService.getPartnerById(user.id);
      const partner = response.partner;
      setFormData({
        name: partner.name || '',
        email: partner.email || '',
        phone: partner.phone || '',
        category: partner.category || '',
        description: partner.description || '',
        location: partner.location || ''
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
      await partnerManagementService.updatePartner(user.id, formData);
      alert('Profile updated successfully');
    } catch (error) {
      logger.error('Failed to update profile', error as Error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedia = (type: 'image' | 'video' | 'link', url: string, title?: string) => {
    const newMedia = {
      id: String(Date.now()),
      type,
      url,
      title
    };
    setMedia([...media, newMedia]);
  };

  const handleRemoveMedia = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.PARTNER]}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Profile Details" />
            <Tab label="Media" />
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
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              sx={{ mb: 2 }}
            />
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
                Upload Media (Images, Videos, Links)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add images, videos, or links to showcase your work
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {media.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card>
                      <CardContent>
                        {item.type === 'image' && <ImageIcon sx={{ fontSize: 40 }} />}
                        {item.type === 'video' && <VideoLibraryIcon sx={{ fontSize: 40 }} />}
                        {item.type === 'link' && <LinkIcon sx={{ fontSize: 40 }} />}
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {item.title || item.url}
                        </Typography>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveMedia(item.id)}
                          sx={{ mt: 1 }}
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
                      const title = prompt('Enter title (optional):');
                      handleAddMedia('image', url, title || undefined);
                    }
                  }}
                  sx={{ mr: 1 }}
                >
                  Add Image
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<VideoLibraryIcon />}
                  onClick={() => {
                    const url = prompt('Enter video URL:');
                    if (url) {
                      const title = prompt('Enter title (optional):');
                      handleAddMedia('video', url, title || undefined);
                    }
                  }}
                  sx={{ mr: 1 }}
                >
                  Add Video
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LinkIcon />}
                  onClick={() => {
                    const url = prompt('Enter link URL:');
                    if (url) {
                      const title = prompt('Enter title (optional):');
                      handleAddMedia('link', url, title || undefined);
                    }
                  }}
                >
                  Add Link
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </Box>
    </ProtectedRoute>
  );
};

export default PartnerProfileEditorPage;

