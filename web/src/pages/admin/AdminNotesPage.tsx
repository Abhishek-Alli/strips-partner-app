/**
 * Admin Notes Management Page
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';

const AdminNotesPage: React.FC = () => {
  return (
    <AdminLayout title="Notes">
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Notes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage notes and documentation here.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default AdminNotesPage;
