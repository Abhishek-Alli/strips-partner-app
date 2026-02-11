/**
 * Contact Enquiries Page - Admin
 *
 * Matches admin_portal.pdf exactly
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Paper
} from '@mui/material';

import { DataTable, Column } from '../../components/table/DataTable';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { contactService, ContactEnquiry } from '../../services/contactService';
import { logger } from '../../core/logger';
import { ActivityTimestamp } from '../../components/core/ActivityTimestamp';

const ContactEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    total: 0
  });

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await contactService.getAllEnquiries(
        pagination.page + 1,
        pagination.rowsPerPage,
        searchTerm
      );
      setEnquiries(response.enquiries);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (error) {
      logger.error('Failed to load contact enquiries', error as Error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.rowsPerPage, searchTerm]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  const columns: Column<ContactEnquiry>[] = [
    {
      id: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => row.name
    },
    {
      id: 'email',
      label: 'Email',
      sortable: true,
      render: (row) => row.email
    },
    {
      id: 'phone',
      label: 'Phone',
      render: (row) => row.phone
    },
    {
      id: 'subject',
      label: 'Subject',
      sortable: true,
      render: (row) => row.subject
    },
    {
      id: 'message',
      label: 'Message',
      render: (row) => (
        <Box
          sx={{
            maxWidth: 320,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {row.message}
        </Box>
      )
    },
    {
      id: 'created_at',
      label: 'Received',
      sortable: true,
      render: (row) =>
        row.created_at ? (
          <ActivityTimestamp date={row.created_at} />
        ) : (
          '-'
        )
    }
  ];

  return (
    <AdminLayout title="Contact Enquiries">
      {/* Header action bar (PDF style) */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <TextField
          size="small"
          placeholder="Search enquiries..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPagination(prev => ({ ...prev, page: 0 }));
          }}
          sx={{ width: 280 }}
        />
      </Box>

      {/* Table container */}
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #e5e7eb',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <DataTable
          columns={columns}
          rows={enquiries}
          loading={loading}
          pagination={{
            page: pagination.page,
            rowsPerPage: pagination.rowsPerPage,
            total: pagination.total,
            onPageChange: (page) => {
              setPagination(prev => ({ ...prev, page }));
            },
            onRowsPerPageChange: (limit) => {
              setPagination(prev => ({
                ...prev,
                rowsPerPage: limit,
                page: 0
              }));
            }
          }}
        />
      </Paper>
    </AdminLayout>
  );
};

export default ContactEnquiriesPage;
