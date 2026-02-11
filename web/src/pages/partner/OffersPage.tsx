/**
 * Offers & Discounts Page (Partner/Dealer Web)
 * 
 * View available offers
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { webBusinessService } from '../../services/business/businessService';
import { Offer } from '../../../../shared/types/business.types';
import { DataTable } from '../../components/table/DataTable';
import { logger } from '../../core/logger';

const OffersPage: React.FC = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const role = user?.role === UserRole.PARTNER ? 'partners' : 'dealers';
      const data = await webBusinessService.getOffers({ applicableTo: role });
      setOffers(data);
    } catch (error) {
      logger.error('Failed to load offers', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'discountType',
      label: 'Discount Type',
      render: (value: string) => <Chip label={value} size="small" />,
    },
    {
      key: 'discountValue',
      label: 'Discount',
      render: (value: number, row: Offer) => {
        if (row.discountType === 'percentage') return `${value}%`;
        return `₹${value}`;
      },
    },
    {
      key: 'validUntil',
      label: 'Valid Until',
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <ProtectedRoute allowedRoles={[UserRole.PARTNER, UserRole.DEALER]}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Offers & Discounts
        </Typography>
        <DataTable data={offers} columns={columns} loading={loading} />
      </Box>
    </ProtectedRoute>
  );
};

export default OffersPage;






