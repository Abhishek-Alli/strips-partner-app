/**
 * Dealership Applications Management Page
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';

const DealershipApplicationsPage: React.FC = () => {
  return (
    <AdminLayout title="Dealership Applications">
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Apply for Dealership
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage dealership applications here.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default DealershipApplicationsPage;
