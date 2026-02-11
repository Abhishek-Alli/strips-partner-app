/**
 * Videos Management Page
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';

const VideosPage: React.FC = () => {
  return (
    <AdminLayout title="Videos">
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Videos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage video content here.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default VideosPage;
