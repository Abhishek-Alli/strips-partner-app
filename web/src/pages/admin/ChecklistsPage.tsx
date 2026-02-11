/**
 * Checklists Management Page
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';

const ChecklistsPage: React.FC = () => {
  return (
    <AdminLayout title="View Checklists">
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          View Checklists
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage checklists here.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default ChecklistsPage;
