/**
 * Admin Upcoming Projects Page
 *
 * Card-based grid with project details
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AdminLayout } from '../../components/layout/AdminLayout';

interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  status: 'Planning' | 'Conceptual' | 'In Progress' | 'Completed';
}

const mockProjects: Project[] = Array.from({ length: 8 }, (_, i) => ({
  id: `${i + 1}`,
  name: 'MBC Steel',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolorealiqua.',
  location: 'Ganeshgur',
  status: i % 2 === 0 ? 'Planning' : 'Conceptual',
}));

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    status: 'Planning' as Project['status'],
  });

  const handleEdit = (project: Project) => {
    setEditProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      location: project.location,
      status: project.status,
    });
    setAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    if (editProject) {
      setProjects(projects.map((p) => (p.id === editProject.id ? { ...p, ...formData } : p)));
    } else {
      const newProject: Project = {
        id: `${projects.length + 1}`,
        ...formData,
      };
      setProjects([...projects, newProject]);
    }
    setAddModalOpen(false);
    setEditProject(null);
    setFormData({ name: '', description: '', location: '', status: 'Planning' });
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Planning':
        return { bg: '#FEF3C7', color: '#92400E' };
      case 'Conceptual':
        return { bg: '#DBEAFE', color: '#1E40AF' };
      case 'In Progress':
        return { bg: '#D1FAE5', color: '#065F46' };
      case 'Completed':
        return { bg: '#E5E7EB', color: '#374151' };
      default:
        return { bg: '#E5E7EB', color: '#374151' };
    }
  };

  return (
    <AdminLayout
      title="Upcoming Projects"
      showAddButton
      addButtonLabel="ADD NEW"
      onAddClick={() => {
        setEditProject(null);
        setFormData({ name: '', description: '', location: '', status: 'Planning' });
        setAddModalOpen(true);
      }}
    >
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} key={project.id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {project.name}
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
                {project.description}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: '#EF4444' }} />
                <Typography variant="body2" color="text.secondary">
                  Location: {project.location}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Project Status:
                  </Typography>
                  <Chip
                    label={project.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(project.status).bg,
                      color: getStatusColor(project.status).color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    onClick={() => handleEdit(project)}
                    sx={{ color: '#3B82F6', textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleDelete(project.id)}
                    sx={{ color: '#EF4444', textTransform: 'none' }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Project Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pt: 3 }}>
          {editProject ? 'Edit Project' : 'Add Upcoming Project'}
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 3 }}>
          <TextField
            fullWidth
            label="Title"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
          >
            <MenuItem value="Planning">Planning</MenuItem>
            <MenuItem value="Conceptual">Conceptual</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
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
            {editProject ? 'Save Changes' : 'ADD'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default ProjectsPage;
