import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { useAuth } from '../../contexts/AuthContext';

const ReportsPage: React.FC = () => {
  const { hasPermission } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <PermissionGuard resource="reports" action="view">
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Sales Report
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Report data will be displayed here
          </Typography>
          {hasPermission('reports', 'export') && (
            <Button variant="contained" sx={{ mt: 2 }}>
              Export Report
            </Button>
          )}
        </Paper>
      </PermissionGuard>
    </Box>
  );
};

export default ReportsPage;








