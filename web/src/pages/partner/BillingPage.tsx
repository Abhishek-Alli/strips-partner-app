/**
 * Partner/Dealer Billing Page
 * 
 * View payment and subscription history
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button
} from '@mui/material';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { billingService } from '../../services/partner/billingService';
import { PaymentIntent, PaymentStatus } from '@shared/core/payments/paymentTypes';
import { formatAmount, getServicePricing } from '@shared/core/payments/paymentConstants';
import { DataTable } from '../../components/table/DataTable';
import { logger } from '../../core/logger';

const BillingPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentIntent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await billingService.getPaymentHistory({ limit: 50 });
      setPayments(response.payments);
      setTotal(response.total);
    } catch (error) {
      logger.error('Failed to load payment history', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = async (payment: PaymentIntent) => {
    try {
      const receipt = await billingService.getReceipt(payment.id);
      window.open(receipt.downloadUrl, '_blank');
    } catch (error) {
      logger.error('Failed to get receipt', error as Error);
    }
  };

  const columns = [
    {
      key: 'service',
      label: 'Service',
      render: (value: string) => getServicePricing(value as any).name
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
      label: 'Date',
      render: (value: Date) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Receipt',
      render: (_: any, row: PaymentIntent) => (
        row.status === PaymentStatus.SUCCESS ? (
          <Button size="small" onClick={() => handleViewReceipt(row)}>
            Download
          </Button>
        ) : null
      )
    }
  ];

  return (
    <ProtectedRoute allowedRoles={[UserRole.PARTNER, UserRole.DEALER]}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Billing & Payments
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          View your payment and subscription history
        </Typography>

        <DataTable
          data={payments}
          columns={columns}
          loading={loading}
          pagination={{
            total,
            page: 0,
            pageSize: 50,
            onPageChange: () => {},
            onPageSizeChange: () => {}
          }}
        />
      </Box>
    </ProtectedRoute>
  );
};

export default BillingPage;



