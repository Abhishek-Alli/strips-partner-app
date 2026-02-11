/**
 * Admin Feedback Moderation Page
 *
 * Moderate feedback: hide/show, delete abusive feedback
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
  Avatar,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import StarIcon from '@mui/icons-material/Star';
import { AdminLayout } from '../../components/layout/AdminLayout';
import {
  feedbackService,
  Feedback,
  FeedbackFilters,
} from '../../services/admin/feedbackService';
import { logger } from '../../core/logger';

const FeedbackModerationPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValues, setFilterValues] = useState({
    profileType: '',
    rating: '',
    status: '',
  });
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'hide' | 'show' | 'delete' | null>(
    null
  );

  useEffect(() => {
    loadFeedbacks();
  }, [page, rowsPerPage, searchTerm, filterValues]);

  const loadFeedbacks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: FeedbackFilters = {
        profileType:
          (filterValues.profileType as 'partner' | 'dealer') || undefined,
        rating: filterValues.rating ? Number(filterValues.rating) : undefined,
        status: filterValues.status || undefined,
        search: searchTerm || undefined,
      };

      const response = await feedbackService.getFeedbacks(
        page + 1,
        rowsPerPage,
        filters
      );
      setFeedbacks(response.items);
      setTotal(response.pagination.total);
    } catch (err) {
      logger.error('Failed to load feedbacks', err as Error);
      setError('Failed to load feedbacks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(0);
  }, []);

  const handleAction = (feedback: Feedback, type: 'hide' | 'show' | 'delete') => {
    setSelectedFeedback(feedback);
    setActionType(type);
    setActionModalOpen(true);
  };

  const handleActionConfirm = async () => {
    if (!selectedFeedback || !actionType) return;

    try {
      switch (actionType) {
        case 'hide':
          await feedbackService.hideFeedback(selectedFeedback.id);
          break;
        case 'show':
          await feedbackService.showFeedback(selectedFeedback.id);
          break;
        case 'delete':
          await feedbackService.deleteFeedback(selectedFeedback.id);
          break;
      }
      setActionModalOpen(false);
      setSelectedFeedback(null);
      setActionType(null);
      loadFeedbacks();
    } catch (err) {
      logger.error('Failed to perform action', err as Error);
      setError('Failed to perform action.');
    }
  };

  const getStatusColor = (
    status: Feedback['status']
  ): 'success' | 'error' | 'default' => {
    switch (status) {
      case 'visible':
        return 'success';
      case 'hidden':
      case 'deleted':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderRatingStars = (rating: number) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            sx={{
              fontSize: 16,
              color: i < rating ? '#FF6B35' : '#E5E7EB',
            }}
          />
        ))}
        <Typography variant="caption" sx={{ ml: 0.5, color: '#6B7280' }}>
          {rating}/5
        </Typography>
      </Box>
    );
  };

  return (
    <AdminLayout
      title="Feedback"
      showSearch
      searchPlaceholder="Search Feedback"
      searchValue={searchTerm}
      onSearchChange={handleSearchChange}
      requiredPermission={{ resource: 'feedback', action: 'moderate' }}
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
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rating</InputLabel>
          <Select
            value={filterValues.rating}
            label="Rating"
            onChange={(e) =>
              setFilterValues({ ...filterValues, rating: e.target.value })
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterValues.status}
            label="Status"
            onChange={(e) =>
              setFilterValues({ ...filterValues, status: e.target.value })
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="visible">Visible</MenuItem>
            <MenuItem value="hidden">Hidden</MenuItem>
            <MenuItem value="deleted">Deleted</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Feedbacks Table */}
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
                <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Comment</TableCell>
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
                : feedbacks.map((feedback) => (
                    <TableRow key={feedback.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                            {feedback.userName?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          {feedback.userName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {feedback.profileName} ({feedback.profileType})
                      </TableCell>
                      <TableCell>{renderRatingStars(feedback.rating)}</TableCell>
                      <TableCell>
                        {feedback.comment.length > 50
                          ? `${feedback.comment.substring(0, 50)}...`
                          : feedback.comment}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={feedback.status}
                          color={getStatusColor(feedback.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleAction(feedback, 'hide')}
                          disabled={feedback.status !== 'visible'}
                          sx={{ color: '#F59E0B' }}
                        >
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleAction(feedback, 'show')}
                          disabled={feedback.status !== 'hidden'}
                          sx={{ color: '#10B981' }}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleAction(feedback, 'delete')}
                          disabled={feedback.status === 'deleted'}
                          sx={{ color: '#EF4444' }}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
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

      {/* Action Confirmation Modal */}
      <Dialog
        open={actionModalOpen}
        onClose={() => {
          setActionModalOpen(false);
          setSelectedFeedback(null);
          setActionType(null);
        }}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {actionType === 'hide'
            ? 'Hide Feedback'
            : actionType === 'show'
            ? 'Show Feedback'
            : 'Delete Feedback'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === 'hide'
              ? 'Are you sure you want to hide this feedback?'
              : actionType === 'show'
              ? 'Are you sure you want to show this feedback?'
              : 'Are you sure you want to delete this feedback? This action cannot be undone.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setActionModalOpen(false);
              setSelectedFeedback(null);
              setActionType(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleActionConfirm}
            variant="contained"
            color={actionType === 'delete' ? 'error' : 'primary'}
            sx={
              actionType !== 'delete'
                ? {
                    backgroundColor: '#FF6B35',
                    '&:hover': { backgroundColor: '#E85A2B' },
                  }
                : {}
            }
          >
            {actionType === 'hide'
              ? 'Hide'
              : actionType === 'show'
              ? 'Show'
              : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default FeedbackModerationPage;
