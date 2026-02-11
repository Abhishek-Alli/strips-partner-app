/**
 * Admin Payment Management Page
 * 
 * View and manage all payments
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { adminPaymentService } from '../../services/admin/paymentService';
import { PaymentIntent, PaymentService, PaymentStatus, PaymentFilter } from '@shared/core/payments/paymentTypes';
import { DataTable } from '../../components/table/DataTable';
import { formatAmount } from '@shared/core/payments/paymentConstants';
import { logger } from '../../core/logger';

const PaymentManagementPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentIntent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentIntent | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [filters, setFilters] = useState<PaymentFilter>({
    limit: 50,
    offset: 0
  });

  useEffect(() => {
    loadPayments();
  }, [filters]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await adminPaymentService.getPayments(filters);
      setPayments(response.payments);
      setTotal(response.total);
    } catch (error) {
      logger.error('Failed to load payments', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (payment: PaymentIntent) => {
    try {
      const details = await adminPaymentService.getPayment(payment.id);
      setSelectedPayment(details);
      setDetailDialogOpen(true);
    } catch (error) {
      logger.error('Failed to load payment details', error as Error);
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Payment ID',
      render: (value: string) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          {value.substring(0, 20)}...
        </Typography>
      )
    },
    {
      key: 'userId',
      label: 'User ID',
      render: (value: string) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          {value.substring(0, 8)}...
        </Typography>
      )
    },
    {
      key: 'service',
      label: 'Service',
      render: (value: PaymentService) => (
        <Chip label={value.replace(/_/g, ' ')} size="small" />
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number, row: PaymentIntent) => (
        <Typography variant="body2" fontWeight="600">
          {formatAmount(value, row.currency)}
        </Typography>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: PaymentStatus) => {
        const color = value === PaymentStatus.SUCCESS ? 'success' : 
                     value === PaymentStatus.FAILED ? 'error' : 
                     value === PaymentStatus.PENDING ? 'warning' : 'default';
        return <Chip label={value.toUpperCase()} size="small" color={color as any} />;
      }
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (value: Date) => new Date(value).toLocaleString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: PaymentIntent) => (
        <Button size="small" onClick={() => handleViewDetails(row)}>
          View Details
        </Button>
      )
    }
  ];

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]} requiredPermission={{ resource: 'payments', action: 'manage' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Payment Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          View and manage all payment transactions
        </Typography>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Service</InputLabel>
                <Select
                  value={filters.service || ''}
                  label="Service"
                  onChange={(e) => setFilters({ ...filters, service: e.target.value as PaymentService || undefined })}
                >
                  <MenuItem value="">All Services</MenuItem>
                  {Object.values(PaymentService).map((service) => (
                    <MenuItem key={service} value={service}>
                      {service.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  label="Status"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as PaymentStatus || undefined })}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {Object.values(PaymentStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="outlined" onClick={() => setFilters({ limit: 50, offset: 0 })}>
                Clear Filters
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <DataTable
          data={payments}
          columns={columns}
          loading={loading}
          pagination={{
            total,
            page: Math.floor((filters.offset || 0) / (filters.limit || 50)),
            pageSize: filters.limit || 50,
            onPageChange: (page) => setFilters({ ...filters, offset: page * (filters.limit || 50) }),
            onPageSizeChange: (pageSize) => setFilters({ ...filters, limit: pageSize, offset: 0 })
          }}
        />

        {/* Payment Details Dialog */}
        <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogContent>
            {selectedPayment && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Payment ID:</strong> {selectedPayment.id}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>User ID:</strong> {selectedPayment.userId}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Service:</strong> {selectedPayment.service.replace(/_/g, ' ')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Amount:</strong> {formatAmount(selectedPayment.amount, selectedPayment.currency)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Status:</strong> {selectedPayment.status.toUpperCase()}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Provider:</strong> {selectedPayment.provider.toUpperCase()}
                </Typography>
                {selectedPayment.providerOrderId && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Order ID:</strong> {selectedPayment.providerOrderId}
                  </Typography>
                )}
                {selectedPayment.providerPaymentId && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Payment ID:</strong> {selectedPayment.providerPaymentId}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Created:</strong> {new Date(selectedPayment.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Updated:</strong> {new Date(selectedPayment.updatedAt).toLocaleString()}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
};

export default PaymentManagementPage;



