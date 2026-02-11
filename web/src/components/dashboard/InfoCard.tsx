import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  action,
  sx
}) => {
  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ color: '#111827' }}
        >
          {title}
        </Typography>

        {action && <Box>{action}</Box>}
      </Box>

      <Divider />

      {/* Body */}
      <Box sx={{ p: 2.5, flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};
