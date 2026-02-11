/**
 * Shortcuts & Links Management Page
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';

const ShortcutsPage: React.FC = () => {
  return (
    <AdminLayout title="Shortcuts & Links">
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Shortcuts & Links
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage shortcuts and useful links here.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default ShortcutsPage;
