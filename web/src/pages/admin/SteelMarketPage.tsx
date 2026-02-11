/**
 * Admin Steel Market Updates Page
 *
 * Card-based grid with market updates
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AdminLayout } from '../../components/layout/AdminLayout';

interface MarketUpdate {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
}

const mockUpdates: MarketUpdate[] = Array.from({ length: 6 }, (_, i) => ({
  id: `${i + 1}`,
  title: 'Sed ut perspiciatis',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, incididunt ut labore et doloreealiqua. Ut enim ad',
  imageUrl: '',
  isActive: true,
}));

const SteelMarketPage: React.FC = () => {
  const [updates, setUpdates] = useState(mockUpdates);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<MarketUpdate | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleToggle = (id: string) => {
    setUpdates(updates.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)));
  };

  const handleViewDetails = (update: MarketUpdate) => {
    setSelectedUpdate(update);
  };

  const handleAdd = () => {
    const newUpdate: MarketUpdate = {
      id: `${updates.length + 1}`,
      ...formData,
      isActive: true,
    };
    setUpdates([...updates, newUpdate]);
    setAddModalOpen(false);
    setFormData({ title: '', description: '' });
  };

  return (
    <AdminLayout
      title="Steel Market Update"
      showAddButton
      addButtonLabel="ADD NEW"
      onAddClick={() => setAddModalOpen(true)}
    >
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left Side - Grid */}
        <Box sx={{ flex: 1 }}>
          <Grid container spacing={3}>
            {updates.map((update) => (
              <Grid item xs={12} sm={6} key={update.id}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: 150,
                      backgroundColor: '#F97316',
                      backgroundImage: 'linear-gradient(135deg, #F97316 0%, #DC2626 100%)',
                    }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {update.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {update.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Switch
                        size="small"
                        checked={update.isActive}
                        onChange={() => handleToggle(update.id)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF6B35' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF6B35' },
                        }}
                      />
                      <Button
                        size="small"
                        onClick={() => handleViewDetails(update)}
                        sx={{ color: '#6B7280', textTransform: 'none' }}
                      >
                        VIEW DETAILS
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Right Side - Detail View */}
        {selectedUpdate && (
          <Paper
            elevation={0}
            sx={{
              width: 350,
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              p: 2,
            }}
          >
            <Box
              sx={{
                height: 150,
                backgroundColor: '#F97316',
                backgroundImage: 'linear-gradient(135deg, #F97316 0%, #DC2626 100%)',
                borderRadius: '8px',
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {selectedUpdate.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Add Update Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pt: 3 }}>
          Add New Update
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 3 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description:"
                multiline
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Box>
            <Box sx={{ width: 150 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Images
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 120,
                  border: '2px dashed #E5E7EB',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#FF6B35' },
                }}
              >
                <AddIcon sx={{ fontSize: 32, color: '#9CA3AF' }} />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleAdd}
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
    </AdminLayout>
  );
};

export default SteelMarketPage;
