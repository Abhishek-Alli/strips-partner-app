/**
 * Premium Skeleton Loader Component
 * 
 * Subtle loading state with shimmer effect
 */

import React from 'react';
import { Box, Skeleton, SkeletonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { theme } from '../../theme';

const StyledSkeleton = styled(Skeleton)({
  backgroundColor: theme.colors.background.secondary,
  borderRadius: theme.radius.md,
  
  '&::after': {
    background: `linear-gradient(90deg, transparent, ${theme.colors.background.tertiary}, transparent)`,
  },
});

interface SkeletonLoaderProps extends SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangular',
  width,
  height,
  lines,
  ...props
}) => {
  if (lines && variant === 'text') {
    return (
      <Box>
        {Array.from({ length: lines }).map((_, index) => (
          <StyledSkeleton
            key={index}
            variant="text"
            width={index === lines - 1 ? '60%' : '100%'}
            height={20}
            sx={{ marginBottom: index < lines - 1 ? theme.spacing[2] : 0 }}
            {...props}
          />
        ))}
      </Box>
    );
  }

  return (
    <StyledSkeleton
      variant={variant}
      width={width}
      height={height}
      {...props}
    />
  );
};

// Pre-configured skeleton components
export const CardSkeleton = () => (
  <Box sx={{ padding: theme.spacing[6] }}>
    <SkeletonLoader variant="rectangular" height={200} />
    <Box sx={{ marginTop: theme.spacing[4] }}>
      <SkeletonLoader variant="text" width="60%" height={24} />
      <SkeletonLoader variant="text" width="40%" height={16} lines={2} />
    </Box>
  </Box>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <Box>
    {Array.from({ length: rows }).map((_, index) => (
      <Box
        key={index}
        sx={{
          display: 'flex',
          gap: theme.spacing[4],
          padding: theme.spacing[4],
          borderBottom: `1px solid ${theme.colors.border.light}`,
        }}
      >
        <SkeletonLoader variant="rectangular" width="40%" height={20} />
        <SkeletonLoader variant="rectangular" width="30%" height={20} />
        <SkeletonLoader variant="rectangular" width="20%" height={20} />
        <SkeletonLoader variant="rectangular" width="10%" height={20} />
      </Box>
    ))}
  </Box>
);






