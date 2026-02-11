import React from 'react';
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No data available',
  icon
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      {icon || <InboxIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />}
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};






