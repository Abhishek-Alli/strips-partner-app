/**
 * Dealer Feedbacks Page (Web)
 * 
 * View feedbacks and report abusive content
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Chip,
  Rating,
} from '@mui/material';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { webDealerService } from '../../services/dealer/dealerService';
import { DealerFeedback } from '../../../../shared/types/dealer.types';
import { DataTable } from '../../components/table/DataTable';
import { logger } from '../../core/logger';

const DealerFeedbacksPage: React.FC = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<DealerFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<DealerFeedback | null>(null);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadFeedbacks();
    }
  }, [user?.id]);

  const loadFeedbacks = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await webDealerService.getDealerFeedbacks(user.id);
      setFeedbacks(data);
    } catch (error) {
      logger.error('Failed to load feedbacks', error as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleReport = (feedback: DealerFeedback) => {
    setSelectedFeedback(feedback);
    setReportReason('');
    setIsReportDialogOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!selectedFeedback || !reportReason.trim()) {
      alert('Please provide a reason for reporting');
      return;
    }
    try {
      await webDealerService.reportFeedback(selectedFeedback.id, reportReason);
      setIsReportDialogOpen(false);
      setSelectedFeedback(null);
      setReportReason('');
      loadFeedbacks();
      alert('Feedback reported to admin');
    } catch (error) {
      logger.error('Failed to report feedback', error as Error);
      alert('Failed to report feedback');
    }
  };

  const averageRating = feedbacks.length > 0
    ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbacks.filter(f => f.rating === rating).length,
  }));

  const columns = [
    {
      key: 'userName',
      label: 'User',
      render: (value?: string) => value || 'Anonymous',
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (value: number) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={value} readOnly size="small" />
          <Typography variant="body2">{value}/5</Typography>
        </Box>
      ),
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (value?: string) => value || '-',
    },
    {
      key: 'isReported',
      label: 'Status',
      render: (value: boolean) => (
        <Chip
          label={value ? 'Reported' : 'Active'}
          color={value ? 'warning' : 'success'}
          size="small"
        />
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: DealerFeedback) => (
        <IconButton
          size="small"
          onClick={() => handleReport(row)}
          disabled={row.isReported}
          color="error"
        >
          <ReportOutlinedIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Feedbacks
        </Typography>

        {/* Rating Summary */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h5">{averageRating.toFixed(1)}</Typography>
            <Rating value={averageRating} readOnly precision={0.1} />
            <Typography variant="body2" color="text.secondary">
              ({feedbacks.length} reviews)
            </Typography>
          </Box>
          <Box>
            {ratingDistribution.map(({ rating, count }) => (
              <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="body2" sx={{ minWidth: 40 }}>{rating} star</Typography>
                <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'grey.200', borderRadius: 1, position: 'relative' }}>
                  <Box
                    sx={{
                      height: '100%',
                      bgcolor: 'primary.main',
                      borderRadius: 1,
                      width: `${feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0}%`,
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 30 }}>{count}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <DataTable data={feedbacks} columns={columns} loading={loading} />

        {/* Report Dialog */}
        <Dialog open={isReportDialogOpen} onClose={() => setIsReportDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Report Feedback</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Please provide a reason for reporting this feedback. It will be reviewed by admin.
            </Typography>
            {selectedFeedback && (
              <Box sx={{ my: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Feedback: {selectedFeedback.comment || 'No comment'}
                </Typography>
              </Box>
            )}
            <TextField
              fullWidth
              label="Reason for Reporting"
              multiline
              rows={4}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsReportDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleSubmitReport}>
              Report
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
};

export default DealerFeedbacksPage;

