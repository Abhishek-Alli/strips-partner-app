/**
 * Admin Trading Advice Page
 *
 * Trading advice cards with toggle and delete
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdminLayout } from '../../components/layout/AdminLayout';

interface TradingAdvice {
  id: string;
  title: string;
  description: string;
  postedTime: string;
  isActive: boolean;
}

const mockAdvice: TradingAdvice[] = Array.from({ length: 8 }, (_, i) => ({
  id: `${i + 1}`,
  title: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolorealiqua.',
  postedTime: '1 day ago',
  isActive: true,
}));

const TradingAdvicePage: React.FC = () => {
  const [advice, setAdvice] = useState(mockAdvice);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleToggle = (id: string) => {
    setAdvice(advice.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)));
  };

  const handleDelete = (id: string) => {
    setAdvice(advice.filter((a) => a.id !== id));
  };

  const handleSave = () => {
    const newAdvice: TradingAdvice = {
      id: `${advice.length + 1}`,
      title: formData.title || 'Sed ut perspiciatis unde omnis iste natus error sit',
      description: formData.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      postedTime: 'Just now',
      isActive: true,
    };
    setAdvice([...advice, newAdvice]);
    setAddModalOpen(false);
    setFormData({ title: '', description: '' });
  };

  return (
    <AdminLayout
      title="Trading Advice"
      showAddButton
      addButtonLabel="ADD NEW"
      onAddClick={() => setAddModalOpen(true)}
    >
      <Grid container spacing={3}>
        {advice.map((item) => (
          <Grid item xs={12} sm={6} key={item.id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.title}
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
                {item.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Posted: {item.postedTime}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Switch
                    size="small"
                    checked={item.isActive}
                    onChange={() => handleToggle(item.id)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF6B35' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF6B35' },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(item.id)}
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

      {/* Add Advice Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pt: 3 }}>
          Add New Advice
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
          />
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSave}
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

export default TradingAdvicePage;
