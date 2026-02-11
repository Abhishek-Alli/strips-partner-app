/**
 * Marketing Card Component
 * 
 * Used ONLY in public / marketing pages
 * NOT allowed in Admin / ERP UI
 */

import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface MarketingCardProps extends BoxProps {
  children: React.ReactNode;
  interactive?: boolean;
}

export const MarketingCard: React.FC<MarketingCardProps> = ({
  children,
  interactive = false,
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: 3,
        padding: 3,
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.2s ease',
        cursor: interactive ? 'pointer' : 'default',
        '&:hover': interactive
          ? { boxShadow: '0 14px 32px rgba(0,0,0,0.12)' }
          : undefined,
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
