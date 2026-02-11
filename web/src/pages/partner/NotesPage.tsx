/**
 * Notes Page (Partner/Dealer Web)
 * 
 * Manage notes
 */

import React, { useState, useEffect } from 'react';
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
  Chip,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { webBusinessService } from '../../services/business/businessService';
import { Note } from '../../../../shared/types/business.types';
import { DataTable } from '../../components/table/DataTable';
import { logger } from '../../core/logger';

const NotesPage: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    isPinned: false,
  });

  useEffect(() => {
    if (user?.id) {
      loadNotes();
    }
  }, [user?.id]);

  const loadNotes = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await webBusinessService.getNotes(user.id);
      setNotes(data);
    } catch (error) {
      logger.error('Failed to load notes', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '', category: '', isPinned: false });
    setIsDialogOpen(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category || '',
      isPinned: note.isPinned,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Delete this note?')) return;
    try {
      await webBusinessService.deleteNote(noteId);
      loadNotes();
    } catch (error) {
      logger.error('Failed to delete note', error as Error);
      alert('Failed to delete note');
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      if (editingNote) {
        await webBusinessService.updateNote(editingNote.id, formData);
      } else {
        await webBusinessService.createNote({
          ...formData,
          userId: user.id,
        });
      }
      setIsDialogOpen(false);
      loadNotes();
    } catch (error) {
      logger.error('Failed to save note', error as Error);
      alert('Failed to save note');
    }
  };

  const columns = [
    {
      key: 'isPinned',
      label: '',
      render: (value: boolean) => value ? <PushPinOutlinedIcon fontSize="small" /> : null,
    },
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'category',
      label: 'Category',
      render: (value?: string) => value ? <Chip label={value} size="small" /> : '-',
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (value: Date) => new Date(value).toLocaleString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Note) => (
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
          <Typography variant="h4">Notes</Typography>
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={handleAdd}>
            Add Note
          </Button>
        </Box>

        <DataTable data={notes} columns={columns} loading={loading} />

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingNote ? 'Edit Note' : 'Add Note'}</DialogTitle>
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
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              margin="normal"
              multiline
              rows={8}
              required
            />
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

export default NotesPage;

