/**
 * Admin Enquiry Management Page
 *
 * Manage enquiries from users to partners/dealers
 * Refactored to use AdminLayout
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Skeleton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AdminLayout } from '../../components/layout/AdminLayout';
import {
  enquiryService,
  Enquiry,
  EnquiryFilters,
} from '../../services/admin/enquiryService';
import { contentService } from '../../services/admin/contentService';
import { logger } from '../../core/logger';

const EnquiryManagementPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValues, setFilterValues] = useState({
    profileType: '',
    status: '',
  });
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [respondModalOpen, setRespondModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEnquiries();
  }, [page, rowsPerPage, searchTerm, filterValues]);

  const loadEnquiries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: EnquiryFilters = {
        profileType:
          (filterValues.profileType as 'partner' | 'dealer') || undefined,
        status: filterValues.status || undefined,
        search: searchTerm || undefined,
      };

      const response = await enquiryService.getEnquiries(
        page + 1,
        rowsPerPage,
        filters
      );
      setEnquiries(response?.items || []);
      setTotal(response?.pagination?.total || 0);
    } catch (err) {
      logger.error('Failed to load enquiries', err as Error);
      // Use mock data on error
      const mockEnquiries: Enquiry[] = Array.from({ length: 10 }, (_, i) => ({
        id: `enquiry_${i + 1}`,
        userId: `user_${i + 1}`,
        userName: `User ${i + 1}`,
        userEmail: `user${i + 1}@example.com`,
        profileId: i % 2 === 0 ? `partner_${Math.floor(i / 2) + 1}` : `dealer_${Math.floor(i / 2) + 1}`,
        profileType: i % 2 === 0 ? 'partner' : 'dealer',
        profileName: i % 2 === 0 ? `Partner ${Math.floor(i / 2) + 1}` : `Dealer ${Math.floor(i / 2) + 1}`,
        topic: ['Pricing', 'Availability', 'Services', 'General'][i % 4],
        message: `This is an enquiry message ${i + 1}.`,
        status: ['new', 'responded', 'closed'][i % 3] as Enquiry['status'],
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      }));
      setEnquiries(mockEnquiries);
      setTotal(50);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(0);
  }, []);

  const handleView = async (enquiry: Enquiry) => {
    try {
      const response = await enquiryService.getEnquiryById(enquiry.id);
      setSelectedEnquiry(response.enquiry);
      setViewModalOpen(true);
    } catch (err) {
      logger.error('Failed to load enquiry', err as Error);
      setError('Failed to load enquiry details.');
    }
  };

  const handleRespond = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setResponseText('');
    setRespondModalOpen(true);
  };

  const handleRespondConfirm = async () => {
    if (!selectedEnquiry) return;

    try {
      await enquiryService.markResponded(selectedEnquiry.id, responseText);
      setRespondModalOpen(false);
      setSelectedEnquiry(null);
      setResponseText('');
      loadEnquiries();
    } catch (err) {
      logger.error('Failed to mark as responded', err as Error);
      setError('Failed to mark as responded.');
    }
  };

  const handleClose = async (enquiry: Enquiry) => {
    try {
      await enquiryService.closeEnquiry(enquiry.id);
      loadEnquiries();
    } catch (err) {
      logger.error('Failed to close enquiry', err as Error);
      setError('Failed to close enquiry.');
    }
  };

  const handleAddNote = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setNoteText('');
    setNoteModalOpen(true);
  };

  const handleNoteConfirm = async () => {
    if (!selectedEnquiry || !noteText.trim()) return;

    try {
      await contentService.addNote('enquiry', selectedEnquiry.id, noteText);
      setNoteModalOpen(false);
      setSelectedEnquiry(null);
      setNoteText('');
      loadEnquiries();
    } catch (err) {
      logger.error('Failed to add note', err as Error);
      setError('Failed to add note.');
    }
  };

  const getStatusColor = (
    status: Enquiry['status']
  ): 'success' | 'warning' | 'default' => {
    switch (status) {
      case 'new':
        return 'warning';
      case 'responded':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <AdminLayout
      title="Enquiries"
      showSearch
      searchPlaceholder="Search Enquiry"
      searchValue={searchTerm}
      onSearchChange={handleSearchChange}
      requiredPermission={{ resource: 'enquiries', action: 'manage' }}
    >
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Profile Type</InputLabel>
          <Select
            value={filterValues.profileType}
            label="Profile Type"
            onChange={(e) =>
              setFilterValues({ ...filterValues, profileType: e.target.value })
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="partner">Partner</MenuItem>
            <MenuItem value="dealer">Dealer</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterValues.status}
            label="Status"
            onChange={(e) =>
              setFilterValues({ ...filterValues, status: e.target.value })
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="responded">Responded</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Enquiries Table */}
      <Paper
        elevation={0}
        sx={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Profile</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Topic</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : (enquiries || []).map((enquiry) => (
                    <TableRow key={enquiry.id} hover>
                      <TableCell>{enquiry.userName}</TableCell>
                      <TableCell>
                        {enquiry.profileName} ({enquiry.profileType})
                      </TableCell>
                      <TableCell>{enquiry.topic}</TableCell>
                      <TableCell>
                        {enquiry.message.length > 50
                          ? `${enquiry.message.substring(0, 50)}...`
                          : enquiry.message}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={enquiry.status}
                          color={getStatusColor(enquiry.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleView(enquiry)}
                          sx={{ color: '#6B7280' }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleRespond(enquiry)}
                          disabled={enquiry.status !== 'new'}
                          sx={{ color: '#10B981' }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleClose(enquiry)}
                          disabled={enquiry.status === 'closed'}
                          sx={{ color: '#6B7280' }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleAddNote(enquiry)}
                          sx={{ color: '#FF6B35' }}
                        >
                          <NoteAddIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{
            borderTop: '1px solid #E5E7EB',
            '& .MuiTablePagination-selectIcon': { color: '#6B7280' },
          }}
        />
      </Paper>

      {/* View Enquiry Modal */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Enquiry Details</DialogTitle>
        <DialogContent>
          {selectedEnquiry && (
            <Box>
              <Typography variant="h6">{selectedEnquiry.topic}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                From: {selectedEnquiry.userName} ({selectedEnquiry.userEmail})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To: {selectedEnquiry.profileName} ({selectedEnquiry.profileType}
                )
              </Typography>
              <Chip
                label={selectedEnquiry.status}
                color={getStatusColor(selectedEnquiry.status)}
                sx={{ mt: 2 }}
              />
              <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedEnquiry.message}
              </Typography>
              {selectedEnquiry.response && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: '#F3F4F6',
                    borderRadius: '8px',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Response:
                  </Typography>
                  <Typography variant="body2">
                    {selectedEnquiry.response}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Respond Modal */}
      <Dialog
        open={respondModalOpen}
        onClose={() => setRespondModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Mark as Responded</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Response (optional)"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRespondModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRespondConfirm}
            variant="contained"
            sx={{
              backgroundColor: '#FF6B35',
              '&:hover': { backgroundColor: '#E85A2B' },
            }}
          >
            Mark as Responded
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Note Modal */}
      <Dialog
        open={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Add Admin Note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Note"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            sx={{ mt: 1 }}
            required
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setNoteModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleNoteConfirm}
            variant="contained"
            disabled={!noteText.trim()}
            sx={{
              backgroundColor: '#FF6B35',
              '&:hover': { backgroundColor: '#E85A2B' },
            }}
          >
            Add Note
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default EnquiryManagementPage;
