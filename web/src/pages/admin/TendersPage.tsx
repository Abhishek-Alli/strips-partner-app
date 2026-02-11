/**
 * Admin Tenders Page
 *
 * Tender management with department cards
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import { AdminLayout } from '../../components/layout/AdminLayout';

interface Tender {
  id: string;
  title: string;
  description: string;
  location: string;
  dueDate: string;
  tenderValue: string;
}

const mockTenders: Tender[] = Array.from({ length: 8 }, (_, i) => ({
  id: `${i + 1}`,
  title: 'Department of School Education',
  description: '317241164 bids are invited for interactive flat pannel, annual repair and maintenance of residential quarters in eastern campus.',
  location: 'Ganeshguri',
  dueDate: 'Apr 12, 2022',
  tenderValue: '5.61 Lakhs',
}));

const TendersPage: React.FC = () => {
  const [tenders, setTenders] = useState(mockTenders);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleDelete = (id: string) => {
    setTenders(tenders.filter((t) => t.id !== id));
  };

  const handleSave = () => {
    const newTender: Tender = {
      id: `${tenders.length + 1}`,
      title: formData.title || 'Department of School Education',
      description: formData.description || '317241164 bids are invited for interactive flat pannel, annual repair and maintenance.',
      location: 'Ganeshguri',
      dueDate: 'Apr 12, 2022',
      tenderValue: '5.61 Lakhs',
    };
    setTenders([...tenders, newTender]);
    setAddModalOpen(false);
    setFormData({ title: '', description: '' });
  };

  return (
    <AdminLayout
      title="Tenders"
      showAddButton
      addButtonLabel="ADD NEW"
      onAddClick={() => setAddModalOpen(true)}
    >
      <Grid container spacing={3}>
        {tenders.map((tender) => (
          <Grid item xs={12} sm={6} key={tender.id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {tender.title}
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
                {tender.description}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: '#FF6B35' }} />
                <Typography variant="body2" color="text.secondary">
                  Location: {tender.location}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Due Date: <Box component="span" sx={{ fontWeight: 500, color: '#111' }}>{tender.dueDate}</Box>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tender Val: <Box component="span" sx={{ fontWeight: 500, color: '#111' }}>{tender.tenderValue}</Box>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    size="small"
                    sx={{ color: '#3B82F6', textTransform: 'none', p: 0, minWidth: 'auto' }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleDelete(tender.id)}
                    sx={{ color: '#EF4444', textTransform: 'none', p: 0, minWidth: 'auto' }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add Tender Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pt: 3 }}>
          Add New Tenders
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
            <Box sx={{ width: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Attachment (PDF/Image)
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
            onClick={handleSave}
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

export default TendersPage;
