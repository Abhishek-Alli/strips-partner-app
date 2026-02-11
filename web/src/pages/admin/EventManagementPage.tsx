/**
 * Admin Event Management Page
 *
 * Card-based list layout for managing events
 * UI matches PDF design reference
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Skeleton,
  Pagination,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { EventCard } from '../../components/admin';
import { apiClient } from '../../services/apiClient';
import { logger } from '../../core/logger';
import { useDebounce } from '../../hooks/useDebounce';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  location: string;
  imageUrl?: string;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  isActive: boolean;
  createdAt: Date;
}

const ITEMS_PER_PAGE = 10;

const EventManagementPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    status: 'OPEN' as 'OPEN' | 'CLOSED' | 'CANCELLED',
  });
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadEvents();
  }, [page, debouncedSearch]);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      if (apiClient.isMockMode()) {
        // Mock data
        const mockEvents: Event[] = Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 1}`,
          title: 'Steel Industry Conference 2024',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          date: new Date(2024, 5, 15 + i),
          location: 'Mumbai, Maharashtra',
          status: i % 3 === 0 ? 'OPEN' : i % 3 === 1 ? 'CLOSED' : 'CANCELLED',
          isActive: true,
          createdAt: new Date(),
        }));
        setEvents(mockEvents);
        setTotalPages(3);
      } else {
        const response = await apiClient.get<{
          items: Event[];
          pagination: { total: number; pages: number };
        }>('/admin/events', {
          params: {
            page,
            limit: ITEMS_PER_PAGE,
            search: debouncedSearch || undefined,
          },
        });
        setEvents(response.items);
        setTotalPages(response.pagination.pages);
      }
    } catch (err) {
      logger.error('Failed to load events', err as Error);
      // Use mock data on error
      const mockEvents: Event[] = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        title: 'Steel Industry Conference 2024',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        date: new Date(2024, 0, 18),
        location: 'Ganeshgur',
        status: 'OPEN' as const,
        isActive: true,
        createdAt: new Date(),
      }));
      setEvents(mockEvents);
      setTotalPages(3);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const handleAddNew = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      status: 'OPEN',
    });
    setAddModalOpen(true);
  };

  const handleAddSubmit = async () => {
    try {
      if (!apiClient.isMockMode()) {
        await apiClient.post('/admin/events', formData);
      }
      setAddModalOpen(false);
      loadEvents();
    } catch (err) {
      logger.error('Failed to add event', err as Error);
      setError('Failed to add event. Please try again.');
    }
  };

  const handleViewDetails = (id: string) => {
    const event = events.find((e) => e.id === id);
    if (event) {
      setSelectedEvent(event);
      setViewModalOpen(true);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      if (!apiClient.isMockMode()) {
        await apiClient.patch(`/admin/events/${id}`, { isActive: active });
      }
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isActive: active } : e))
      );
    } catch (err) {
      logger.error('Failed to update event status', err as Error);
      setError('Failed to update event status.');
    }
  };

  const handleEdit = (id: string) => {
    const event = events.find((e) => e.id === id);
    if (event) {
      setSelectedEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        date:
          typeof event.date === 'string'
            ? event.date.split('T')[0]
            : event.date.toISOString().split('T')[0],
        location: event.location,
        status: event.status,
      });
      setAddModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const event = events.find((e) => e.id === id);
    if (event) {
      setSelectedEvent(event);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;
    try {
      if (!apiClient.isMockMode()) {
        await apiClient.delete(`/admin/events/${selectedEvent.id}`);
      }
      setDeleteModalOpen(false);
      setSelectedEvent(null);
      loadEvents();
    } catch (err) {
      logger.error('Failed to delete event', err as Error);
      setError('Failed to delete event.');
    }
  };

  const getPostedAgo = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <AdminLayout
      title="Manage Events"
      showSearch
      searchPlaceholder="Search Event"
      searchValue={searchTerm}
      onSearchChange={handleSearchChange}
      showAddButton
      addButtonLabel="ADD NEW"
      onAddClick={handleAddNew}
      requiredPermission={{ resource: 'events', action: 'manage' }}
    >
      {/* Events List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={140}
                sx={{ borderRadius: '12px' }}
              />
            ))
          : events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                date={event.date}
                location={event.location}
                imageUrl={event.imageUrl}
                status={event.status}
                postedAgo={getPostedAgo(event.createdAt)}
                isActive={event.isActive}
                onToggleActive={handleToggleActive}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
      </Box>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                '&.Mui-selected': {
                  backgroundColor: '#FF6B35',
                  color: '#fff',
                },
              },
            }}
          />
        </Box>
      )}

      {/* Add/Edit Event Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setSelectedEvent(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pt: 3 }}>
          {selectedEvent ? 'Edit Event' : 'Add New Event'}
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 3 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Event Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'OPEN' | 'CLOSED' | 'CANCELLED',
                    })
                  }
                >
                  <MenuItem value="OPEN">Open</MenuItem>
                  <MenuItem value="CLOSED">Closed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Box>
            <Box sx={{ width: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Event Image
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 150,
                  border: '2px dashed #E5E7EB',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#FF6B35' },
                }}
              >
                <Typography sx={{ color: '#9CA3AF', fontSize: '2rem' }}>
                  +
                </Typography>
              </Box>
              <Typography
                variant="subtitle2"
                sx={{ mt: 3, mb: 1, fontWeight: 600 }}
              >
                Additional Info
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter additional details..."
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleAddSubmit}
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
            {selectedEvent ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Event Details Modal */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedEvent && (
            <Box sx={{ p: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <Box sx={{ display: 'flex', gap: 3 }}>
                  {/* Event Image */}
                  <Box
                    sx={{
                      width: 200,
                      height: 150,
                      borderRadius: '12px',
                      backgroundColor: '#FEE2E2',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ color: '#EF4444', fontWeight: 700 }}>
                      EVENTS
                    </Typography>
                  </Box>

                  {/* Event Details */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                      {selectedEvent.title}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <CalendarTodayIcon
                          sx={{ fontSize: 16, color: '#9CA3AF' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {typeof selectedEvent.date === 'string'
                            ? new Date(selectedEvent.date).toLocaleDateString()
                            : selectedEvent.date.toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <LocationOnIcon
                          sx={{ fontSize: 16, color: '#9CA3AF' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {selectedEvent.location}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        borderRadius: '4px',
                        backgroundColor:
                          selectedEvent.status === 'OPEN'
                            ? '#D1FAE5'
                            : selectedEvent.status === 'CLOSED'
                            ? '#F3F4F6'
                            : '#FEE2E2',
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color:
                            selectedEvent.status === 'OPEN'
                              ? '#059669'
                              : selectedEvent.status === 'CLOSED'
                              ? '#6B7280'
                              : '#DC2626',
                        }}
                      >
                        {selectedEvent.status}
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ color: '#6B7280' }}>
                      {selectedEvent.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E5E7EB' }}>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
          <Button
            variant="outlined"
            onClick={() => {
              setViewModalOpen(false);
              if (selectedEvent) handleEdit(selectedEvent.id);
            }}
            sx={{
              borderColor: '#FF6B35',
              color: '#FF6B35',
              '&:hover': {
                borderColor: '#E85A2B',
                backgroundColor: 'rgba(255, 107, 53, 0.04)',
              },
            }}
          >
            EDIT
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setViewModalOpen(false);
              setDeleteModalOpen(true);
            }}
          >
            DELETE
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{selectedEvent?.title}&quot;?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default EventManagementPage;
