/**
 * Works Management Page (Partner/Dealer Web)
 * 
 * Manage portfolio / works with table layout
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
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { webBusinessService } from '../../services/business/businessService';
import { Work } from '../../../../shared/types/business.types';
import { DataTable } from '../../components/table/DataTable';
import { logger } from '../../core/logger';

const WorksManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
  });

  useEffect(() => {
    if (user?.id) {
      loadWorks();
    }
  }, [user?.id]);

  const loadWorks = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await webBusinessService.getWorks(user.id);
      setWorks(data);
    } catch (error) {
      logger.error('Failed to load works', error as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleAdd = () => {
    setEditingWork(null);
    setFormData({ title: '', description: '', category: '', location: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (work: Work) => {
    setEditingWork(work);
    setFormData({
      title: work.title,
      description: work.description,
      category: work.category,
      location: work.location || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (workId: string) => {
    if (!confirm('Are you sure you want to delete this work?')) return;
    try {
      await webBusinessService.deleteWork(workId);
      loadWorks();
    } catch (error) {
      logger.error('Failed to delete work', error as Error);
      alert('Failed to delete work');
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      if (editingWork) {
        await webBusinessService.updateWork(editingWork.id, formData);
      } else {
        await webBusinessService.createWork({
          ...formData,
          userId: user.id,
          images: [],
        });
      }
      setIsDialogOpen(false);
      loadWorks();
    } catch (error) {
      logger.error('Failed to save work', error as Error);
      alert('Failed to save work');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'location',
      label: 'Location',
      render: (value?: string) => value || '-',
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Work) => (
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
    <ProtectedRoute allowedRoles={[UserRole.PARTNER, UserRole.DEALER]}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">My Works</Typography>
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={handleAdd}>
            Add Work
          </Button>
        </Box>

        <DataTable data={works} columns={columns} loading={loading} />

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingWork ? 'Edit Work' : 'Add Work'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                label="Category"
              >
                <MenuItem value="residential">Residential</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
                <MenuItem value="industrial">Industrial</MenuItem>
                <MenuItem value="infrastructure">Infrastructure</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              margin="normal"
            />
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

export default WorksManagementPage;

