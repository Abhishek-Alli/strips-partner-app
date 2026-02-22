/**
 * Admin Vastu Page
 *
 * Manage Vastu Shastra tips and guidance content for the app
 */

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import NorthIcon from '@mui/icons-material/North';
import { AdminLayout } from '../../components/layout/AdminLayout';

interface VastuTip {
  id: string;
  title: string;
  description: string;
  category: string;
  direction: string;
  isActive: boolean;
}

const CATEGORIES = ['Home', 'Office', 'Factory', 'Kitchen', 'Bedroom', 'Bathroom', 'Living Room'];
const DIRECTIONS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West', 'Centre'];

const MOCK_TIPS: VastuTip[] = [
  {
    id: '1',
    title: 'Main Entrance Direction',
    description: 'The main entrance of the house should ideally face North, East, or North-East for positive energy flow and prosperity.',
    category: 'Home',
    direction: 'North',
    isActive: true,
  },
  {
    id: '2',
    title: 'Kitchen Placement',
    description: 'The kitchen should be placed in the South-East direction (Agni corner) of the house, as it is governed by the fire element.',
    category: 'Kitchen',
    direction: 'South-East',
    isActive: true,
  },
  {
    id: '3',
    title: 'Master Bedroom',
    description: 'The master bedroom should be located in the South-West direction. The head while sleeping should point South or East.',
    category: 'Bedroom',
    direction: 'South-West',
    isActive: true,
  },
  {
    id: '4',
    title: 'Office Desk Position',
    description: 'Sit facing North or East while working for improved concentration, productivity, and career growth.',
    category: 'Office',
    direction: 'North',
    isActive: true,
  },
  {
    id: '5',
    title: 'Water Elements',
    description: 'Place water features like aquariums or fountains in the North or North-East direction to attract wealth and positive energy.',
    category: 'Home',
    direction: 'North-East',
    isActive: false,
  },
  {
    id: '6',
    title: 'Safe & Locker Placement',
    description: 'The safe or money locker should face North — the direction ruled by Kuber, the lord of wealth.',
    category: 'Home',
    direction: 'North',
    isActive: true,
  },
];

const directionColor: Record<string, string> = {
  North: '#1976d2',
  South: '#d32f2f',
  East: '#388e3c',
  West: '#f57c00',
  'North-East': '#7b1fa2',
  'North-West': '#0288d1',
  'South-East': '#c62828',
  'South-West': '#e65100',
  Centre: '#455a64',
};

const VastuPage: React.FC = () => {
  const [tips, setTips] = useState<VastuTip[]>(MOCK_TIPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editTip, setEditTip] = useState<VastuTip | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'Home', direction: 'North' });

  const filtered = tips.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const newTip: VastuTip = {
      id: Date.now().toString(),
      ...form,
      isActive: true,
    };
    setTips((prev) => [newTip, ...prev]);
    setForm({ title: '', description: '', category: 'Home', direction: 'North' });
    setAddOpen(false);
  };

  const handleEdit = () => {
    if (!editTip) return;
    setTips((prev) => prev.map((t) => (t.id === editTip.id ? { ...editTip } : t)));
    setEditTip(null);
  };

  const handleDelete = () => {
    setTips((prev) => prev.filter((t) => t.id !== deleteId));
    setDeleteId(null);
  };

  const handleToggle = (id: string) => {
    setTips((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)));
  };

  return (
    <AdminLayout
      title="Vastu Tips"
      showSearch
      searchPlaceholder="Search tips or category..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      showAddButton
      addButtonLabel="ADD TIP"
      onAddClick={() => setAddOpen(true)}
    >
      {/* Stats Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Tips', value: tips.length, color: '#2D3142' },
          { label: 'Active', value: tips.filter((t) => t.isActive).length, color: '#16a34a' },
          { label: 'Inactive', value: tips.filter((t) => !t.isActive).length, color: '#9CA3AF' },
          { label: 'Categories', value: CATEGORIES.length, color: '#FF6B35' },
        ].map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: stat.color }}>
                {stat.value}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', mt: 0.5 }}>
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tips Grid */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <HomeIcon sx={{ fontSize: 64, color: '#E5E7EB', mb: 2 }} />
          <Typography sx={{ color: '#9CA3AF' }}>No tips found</Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map((tip) => (
            <Grid item xs={12} sm={6} md={4} key={tip.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: '14px',
                  border: '1px solid',
                  borderColor: tip.isActive ? '#E5E7EB' : '#F3F4F6',
                  height: '100%',
                  opacity: tip.isActive ? 1 : 0.6,
                  transition: 'all 0.2s',
                  '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  {/* Header row */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={tip.category}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,107,53,0.1)',
                          color: '#FF6B35',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                      <Chip
                        icon={<NorthIcon sx={{ fontSize: '12px !important' }} />}
                        label={tip.direction}
                        size="small"
                        sx={{
                          backgroundColor: `${directionColor[tip.direction]}15`,
                          color: directionColor[tip.direction] || '#374151',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                    <Chip
                      label={tip.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      onClick={() => handleToggle(tip.id)}
                      sx={{
                        backgroundColor: tip.isActive ? 'rgba(22,163,74,0.1)' : '#F3F4F6',
                        color: tip.isActive ? '#16a34a' : '#9CA3AF',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                      }}
                    />
                  </Box>

                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: '#111827', mb: 1, fontSize: '0.95rem' }}
                  >
                    {tip.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: '#6B7280', lineHeight: 1.6, fontSize: '0.85rem', mb: 2 }}
                  >
                    {tip.description}
                  </Typography>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      onClick={() => setEditTip({ ...tip })}
                      sx={{
                        color: '#6B7280',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '8px',
                        '&:hover': { backgroundColor: '#FF6B35', color: '#fff' },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteId(tip.id)}
                      sx={{
                        color: '#6B7280',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '8px',
                        '&:hover': { backgroundColor: '#DC2626', color: '#fff' },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Vastu Tip</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
              fullWidth label="Title" value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            <TextField
              fullWidth multiline rows={3} label="Description" value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={form.category} label="Category"
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                sx={{ borderRadius: '10px' }}>
                {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Direction</InputLabel>
              <Select value={form.direction} label="Direction"
                onChange={(e) => setForm((p) => ({ ...p, direction: e.target.value }))}
                sx={{ borderRadius: '10px' }}>
                {DIRECTIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ textTransform: 'none', color: '#6B7280' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!form.title || !form.description}
            sx={{ backgroundColor: '#FF6B35', textTransform: 'none', borderRadius: '10px', px: 3, boxShadow: 'none', '&:hover': { backgroundColor: '#E85A2B', boxShadow: 'none' } }}>
            Add Tip
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      {editTip && (
        <Dialog open onClose={() => setEditTip(null)} maxWidth="sm" fullWidth
          PaperProps={{ sx: { borderRadius: '16px' } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>Edit Vastu Tip</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
              <TextField fullWidth label="Title" value={editTip.title}
                onChange={(e) => setEditTip((p) => p ? { ...p, title: e.target.value } : p)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
              <TextField fullWidth multiline rows={3} label="Description" value={editTip.description}
                onChange={(e) => setEditTip((p) => p ? { ...p, description: e.target.value } : p)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={editTip.category} label="Category"
                  onChange={(e) => setEditTip((p) => p ? { ...p, category: e.target.value } : p)}
                  sx={{ borderRadius: '10px' }}>
                  {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Direction</InputLabel>
                <Select value={editTip.direction} label="Direction"
                  onChange={(e) => setEditTip((p) => p ? { ...p, direction: e.target.value } : p)}
                  sx={{ borderRadius: '10px' }}>
                  {DIRECTIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setEditTip(null)} sx={{ textTransform: 'none', color: '#6B7280' }}>Cancel</Button>
            <Button variant="contained" onClick={handleEdit}
              sx={{ backgroundColor: '#FF6B35', textTransform: 'none', borderRadius: '10px', px: 3, boxShadow: 'none', '&:hover': { backgroundColor: '#E85A2B', boxShadow: 'none' } }}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Tip</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this Vastu tip? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ textTransform: 'none', color: '#6B7280' }}>Cancel</Button>
          <Button variant="contained" onClick={handleDelete}
            sx={{ backgroundColor: '#DC2626', textTransform: 'none', borderRadius: '10px', px: 3, boxShadow: 'none', '&:hover': { backgroundColor: '#B91C1C', boxShadow: 'none' } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default VastuPage;
