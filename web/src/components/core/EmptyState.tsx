import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface AdminEmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <Box
      sx={{
        border: '1px dashed #d1d5db',
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        backgroundColor: '#fafafa'
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {description}
        </Typography>
      )}

      {actionLabel && onAction && (
        <Button
          size="small"
          variant="contained"
          sx={{ mt: 2 }}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};
