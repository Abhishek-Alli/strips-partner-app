/**
 * Admin Education Posts Page
 *
 * Education posts with image cards
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
import AddIcon from '@mui/icons-material/Add';
import { AdminLayout } from '../../components/layout/AdminLayout';

interface EducationPost {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  postedTime: string;
}

const mockPosts: EducationPost[] = Array.from({ length: 8 }, (_, i) => ({
  id: `${i + 1}`,
  title: 'Sed ut perspiciatis unde omnis iste natus voluptatem accusantium doloremque',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing tempor incididunt ut labore et dolorealiqua.',
  imageUrl: '',
  postedTime: '1 day ago',
}));

const EducationPostsPage: React.FC = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleDelete = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    const newPost: EducationPost = {
      id: `${posts.length + 1}`,
      title: formData.title || 'Sed ut perspiciatis unde omnis iste natus',
      description: formData.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
      imageUrl: '',
      postedTime: 'Just now',
    };
    setPosts([...posts, newPost]);
    setAddModalOpen(false);
    setFormData({ title: '', description: '' });
  };

  return (
    <AdminLayout
      title="Education Posts"
      showAddButton
      addButtonLabel="ADD NEW"
      onAddClick={() => setAddModalOpen(true)}
    >
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} key={post.id}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                display: 'flex',
                gap: 2,
              }}
            >
              {/* Image Thumbnail */}
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '8px',
                  backgroundColor: '#FEF3C7',
                  backgroundImage: 'linear-gradient(135deg, #FEF3C7 0%, #FBBF24 100%)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: '#EF4444',
                      borderRadius: '50%',
                    }}
                  />
                </Box>
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    fontSize: '0.75rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Posted: {post.postedTime}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      sx={{ color: '#3B82F6', textTransform: 'none', p: 0, minWidth: 'auto', fontSize: '0.75rem' }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleDelete(post.id)}
                      sx={{ color: '#EF4444', textTransform: 'none', p: 0, minWidth: 'auto', fontSize: '0.75rem' }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add Post Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pt: 3 }}>
          Add New Education Post
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
                Attachment (Image)
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

export default EducationPostsPage;
