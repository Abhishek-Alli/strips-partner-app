/**
 * Admin Guest Lectures Page
 *
 * Card-based grid with lecture details
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
  Link,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { AdminLayout } from '../../components/layout/AdminLayout';

interface Lecture {
  id: string;
  title: string;
  date: string;
  day: string;
  zoomLink: string;
  postedTime: string;
  isActive: boolean;
}

const mockLectures: Lecture[] = Array.from({ length: 8 }, (_, i) => ({
  id: `${i + 1}`,
  title: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque...',
  date: '18 Jan',
  day: 'Monday',
  zoomLink: 'https://zoom.us/j/5551112222',
  postedTime: '1 day ago',
  isActive: true,
}));

const LecturesPage: React.FC = () => {
  const [lectures, setLectures] = useState(mockLectures);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    links: '',
  });

  const handleToggle = (id: string) => {
    setLectures(lectures.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l)));
  };

  const handleDelete = (id: string) => {
    setLectures(lectures.filter((l) => l.id !== id));
  };

  const handleAdd = () => {
    const newLecture: Lecture = {
      id: `${lectures.length + 1}`,
      title: formData.title,
      date: formData.date || '18 Jan',
      day: 'Monday',
      zoomLink: formData.links || 'https://zoom.us/j/5551112222',
      postedTime: 'Just now',
      isActive: true,
    };
    setLectures([...lectures, newLecture]);
    setAddModalOpen(false);
    setFormData({ title: '', date: '', description: '', links: '' });
  };

  return (
    <AdminLayout
      title="Guest Lecture"
      showAddButton
      addButtonLabel="ADD NEW"
      onAddClick={() => setAddModalOpen(true)}
    >
      <Grid container spacing={3}>
        {lectures.map((lecture) => (
          <Grid item xs={12} sm={6} key={lecture.id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
              }}
            >
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
                {lecture.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
                <Box
                  sx={{
                    backgroundColor: '#FFF7ED',
                    p: 1,
                    borderRadius: '8px',
                    textAlign: 'center',
                    minWidth: 60,
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#EA580C', lineHeight: 1 }}>
                    {lecture.date.split(' ')[0]}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#EA580C', fontWeight: 600 }}>
                    {lecture.date.split(' ')[1]}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ color: '#9CA3AF' }}>
                    {lecture.day}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Link
                    href={lecture.zoomLink}
                    target="_blank"
                    sx={{ color: '#3B82F6', fontSize: '0.875rem' }}
                  >
                    Zoom link: {lecture.zoomLink}
                  </Link>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    Posted: {lecture.postedTime}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mt: 2 }}>
                <Switch
                  size="small"
                  checked={lecture.isActive}
                  onChange={() => handleToggle(lecture.id)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF6B35' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF6B35' },
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleDelete(lecture.id)}
                  sx={{ color: '#EF4444' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add Lecture Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pt: 3 }}>
          Add New Lecture
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 3 }}>
          <TextField
            fullWidth
            label="Select date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: <CalendarTodayIcon sx={{ color: '#9CA3AF' }} />,
            }}
            sx={{ mb: 2 }}
          />
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
            label="Add Links"
            value={formData.links}
            onChange={(e) => setFormData({ ...formData, links: e.target.value })}
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

export default LecturesPage;
