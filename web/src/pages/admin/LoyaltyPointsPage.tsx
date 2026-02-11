/**
 * Loyalty Points Management Page
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';

const LoyaltyPointsPage: React.FC = () => {
  return (
    <AdminLayout title="Loyalty Points">
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Loyalty Points
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage loyalty points and rewards here.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default LoyaltyPointsPage;
