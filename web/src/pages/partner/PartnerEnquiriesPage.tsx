/**
 * Partner Enquiries Page
 * 
 * Partner can view and respond to enquiries from users
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataTable, Column, RowAction, PaginationConfig } from '../../components/table/DataTable';
import { FilterPanel, FilterOption, FilterValues } from '../../components/filters/FilterPanel';
import { enquiryService, Enquiry, EnquiryFilters } from '../../services/admin/enquiryService';
import { logger } from '../../core/logger';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';

const PartnerEnquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [respondModalOpen, setRespondModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    loadEnquiries();
  }, [page, rowsPerPage, searchTerm, filterValues]);

  const loadEnquiries = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Partner can only see enquiries for their own profile
      const filters: EnquiryFilters = {
        profileType: 'partner',
        profileId: user.id,
        status: filterValues.status as string,
        search: searchTerm || (filterValues.search as string) || undefined
      };

      const response = await enquiryService.getEnquiries(page + 1, rowsPerPage, filters);
      setEnquiries(response.items);
      setTotal(response.pagination.total);
    } catch (error) {
      logger.error('Failed to load enquiries', error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(0);
  }, []);

  const handleFilterChange = (values: FilterValues) => {
    setFilterValues(values);
    setPage(0);
  };

  const handleView = async (enquiry: Enquiry) => {
    try {
      const response = await enquiryService.getEnquiryById(enquiry.id);
      setSelectedEnquiry(response.enquiry);
      setViewModalOpen(true);
    } catch (error) {
      logger.error('Failed to load enquiry', error as Error);
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
      // Partner responds via email or panel - mark as responded
      await enquiryService.markResponded(selectedEnquiry.id, responseText);
      setRespondModalOpen(false);
      setSelectedEnquiry(null);
      setResponseText('');
      loadEnquiries();
      alert('Response sent successfully');
    } catch (error) {
      logger.error('Failed to respond to enquiry', error as Error);
      alert('Failed to send response');
    }
  };

  const getStatusColor = (status: Enquiry['status']): 'success' | 'warning' | 'default' => {
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

  const filterOptions: FilterOption[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'new', label: 'New' },
        { value: 'responded', label: 'Responded' },
        { value: 'closed', label: 'Closed' }
      ]
    }
  ];

  const columns: Column<Enquiry>[] = [
    {
      id: 'userName',
      label: 'User',
      sortable: true
    },
    {
      id: 'topic',
      label: 'Topic',
      sortable: true
    },
    {
      id: 'message',
      label: 'Message',
      sortable: false,
      format: (value) => value.length > 50 ? `${value.substring(0, 50)}...` : value
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      format: (value) => (
        <Chip
          label={value}
          color={getStatusColor(value as Enquiry['status'])}
          size="small"
        />
      )
    },
    {
      id: 'createdAt',
      label: 'Date',
      sortable: true,
      format: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const rowActions: RowAction<Enquiry>[] = [
    {
      label: 'View',
      icon: <VisibilityIcon fontSize="small" />,
      onClick: handleView,
      color: 'primary'
    },
    {
      label: 'Respond',
      icon: <CheckCircleIcon fontSize="small" />,
      onClick: handleRespond,
      color: 'primary',
      disabled: (enquiry) => enquiry.status !== 'new'
    }
  ];

  const pagination: PaginationConfig = {
    page,
    rowsPerPage,
    total,
    onPageChange: setPage,
    onRowsPerPageChange: (newRowsPerPage) => {
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.PARTNER]}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Enquiries
        </Typography>

        <FilterPanel
          filters={filterOptions}
          values={filterValues}
          onChange={handleFilterChange}
        />

        <Box sx={{ mt: 2 }}>
          <DataTable
            title="Enquiries"
            columns={columns}
            rows={enquiries}
            loading={isLoading}
            pagination={pagination}
            onSearch={handleSearch}
            rowActions={rowActions}
            searchPlaceholder="Search enquiries..."
          />
        </Box>

        {/* View Enquiry Modal */}
        <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Enquiry Details</DialogTitle>
          <DialogContent>
            {selectedEnquiry && (
              <Box>
                <Typography variant="h6">{selectedEnquiry.topic}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  From: {selectedEnquiry.userName} ({selectedEnquiry.userEmail})
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
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="subtitle2">Your Response:</Typography>
                    <Typography variant="body2">{selectedEnquiry.response}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewModalOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Respond Modal */}
        <Dialog open={respondModalOpen} onClose={() => setRespondModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Respond to Enquiry</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Your Response"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              sx={{ mt: 1 }}
              placeholder="Type your response here..."
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This response will be sent to the user via email.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRespondModalOpen(false)}>Cancel</Button>
            <Button onClick={handleRespondConfirm} variant="contained" disabled={!responseText.trim()}>
              Send Response
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
};

export default PartnerEnquiriesPage;






