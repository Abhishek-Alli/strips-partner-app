/**
 * Dealer Enquiries Page (Web)
 * 
 * View and respond to user enquiries - split view layout
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { webDealerService } from '../../services/dealer/dealerService';
import { DealerEnquiry } from '../../../../shared/types/dealer.types';
import { DataTable } from '../../components/table/DataTable';
import { logger } from '../../core/logger';

const DealerEnquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<DealerEnquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<DealerEnquiry | null>(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user?.id) {
      loadEnquiries();
    }
  }, [user?.id, statusFilter]);

  const loadEnquiries = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined;
      const data = await webDealerService.getDealerEnquiries(user.id, filters);
      setEnquiries(data);
      if (data.length > 0 && !selectedEnquiry) {
        setSelectedEnquiry(data[0]);
        setResponseText(data[0].response || '');
      }
    } catch (error) {
      logger.error('Failed to load enquiries', error as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, statusFilter]);

  const handleEnquirySelect = (enquiry: DealerEnquiry) => {
    setSelectedEnquiry(enquiry);
    setResponseText(enquiry.response || '');
  };

  const handleSendResponse = async () => {
    if (!selectedEnquiry || !responseText.trim()) {
      alert('Please enter a response');
      return;
    }
    try {
      await webDealerService.respondToEnquiry(selectedEnquiry.id, responseText);
      loadEnquiries();
      alert('Response sent successfully');
    } catch (error) {
      logger.error('Failed to send response', error as Error);
      alert('Failed to send response');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'warning';
      case 'responded': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const enquiryColumns = [
    {
      key: 'topic',
      label: 'Topic',
    },
    {
      key: 'userName',
      label: 'User',
      render: (value?: string, row?: DealerEnquiry) => value || row?.userEmail || 'User',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => <Chip label={value.toUpperCase()} color={getStatusColor(value) as any} size="small" />,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">User Enquiries</Typography>
          <Button
            variant="outlined"
            onClick={() => {
              // Navigate to send enquiry to admin
              window.location.href = '/dealer/send-enquiry';
            }}
          >
            Send Enquiry to Admin
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Left: Enquiry List */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                fullWidth
                size="small"
                SelectProps={{ native: true }}
              >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </TextField>
            </Box>
            <DataTable
              data={enquiries}
              columns={enquiryColumns}
              loading={loading}
              onRowClick={handleEnquirySelect}
            />
          </Grid>

          {/* Right: Enquiry Details & Response */}
          <Grid item xs={12} md={7}>
            {selectedEnquiry ? (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedEnquiry.topic}
                </Typography>
                <Chip
                  label={selectedEnquiry.status.toUpperCase()}
                  color={getStatusColor(selectedEnquiry.status) as any}
                  sx={{ mb: 2 }}
                />
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  From: {selectedEnquiry.userName || selectedEnquiry.userEmail || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date: {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedEnquiry.message}
                </Typography>
                {selectedEnquiry.response && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Your Previous Response:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {selectedEnquiry.response}
                    </Typography>
                  </>
                )}
                <Divider sx={{ my: 2 }} />
                <TextField
                  fullWidth
                  label="Your Response"
                  multiline
                  rows={6}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleSendResponse}
                  disabled={!responseText.trim()}
                >
                  Send Response
                </Button>
              </Paper>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Select an enquiry to view details and respond
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </ProtectedRoute>
  );
};

export default DealerEnquiriesPage;
