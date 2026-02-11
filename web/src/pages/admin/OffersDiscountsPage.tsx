/**
 * Admin Offers and Discounts Page
 *
 * Manage discount offers with cards
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdminLayout } from '../../components/layout/AdminLayout';

interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  isActive: boolean;
}

const mockOffers: Offer[] = Array.from({ length: 8 }, (_, i) => ({
  id: `${i + 1}`,
  title: 'Discount 20%',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et doloreealiqua.',
  code: 'SOM20',
  isActive: true,
}));

const OffersDiscountsPage: React.FC = () => {
  const [offers, setOffers] = useState(mockOffers);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
  });

  const handleToggle = (id: string) => {
    setOffers(offers.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o)));
  };

  const handleDelete = (id: string) => {
    setOffers(offers.filter((o) => o.id !== id));
  };

  const handleAdd = () => {
    const newOffer: Offer = {
      id: `${offers.length + 1}`,
      ...formData,
      isActive: true,
    };
    setOffers([...offers, newOffer]);
    setAddModalOpen(false);
    setFormData({ title: '', description: '', code: '' });
  };

  return (
    <AdminLayout
      title="Offers and Discounts"
      showAddButton
      addButtonLabel="ADD NEW"
      onAddClick={() => setAddModalOpen(true)}
    >
      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={offer.id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {offer.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {offer.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip
                  label={`CODE: ${offer.code}`}
                  size="small"
                  sx={{
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    fontWeight: 600,
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Switch
                    size="small"
                    checked={offer.isActive}
                    onChange={() => handleToggle(offer.id)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#FF6B35',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#FF6B35',
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(offer.id)}
                    sx={{ color: '#EF4444' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add Offer Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pt: 3 }}>
          Add Offers and discounts
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 3 }}>
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
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Add Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleAdd}
            fullWidth
            sx={{
              backgroundColor: '#FF6B35',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              '&:hover': { backgroundColor: '#E85A2B' },
            }}
          >
            ADD
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default OffersDiscountsPage;
