import React from 'react';
import { Skeleton, Box, Grid, Divider } from '@mui/material';

interface SkeletonLoaderProps {
  variant?: 'statCard' | 'infoCard' | 'table' | 'list';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'statCard',
  count = 1
}) => {

  // Dashboard Stat Cards
  if (variant === 'statCard') {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 2,
                p: 2.5
              }}
            >
              <Skeleton width="40%" height={20} />
              <Skeleton width="60%" height={36} sx={{ mt: 1 }} />
              <Skeleton width="80%" height={18} sx={{ mt: 1 }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  // InfoCard Skeleton (matches InfoCard component)
  if (variant === 'infoCard') {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Box
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 2
              }}
            >
              {/* Header */}
              <Box sx={{ px: 2.5, py: 1.5 }}>
                <Skeleton width="35%" height={22} />
              </Box>
              <Divider />
              {/* Body */}
              <Box sx={{ p: 2.5 }}>
                <Skeleton height={18} sx={{ mb: 1 }} />
                <Skeleton height={18} sx={{ mb: 1 }} />
                <Skeleton height={18} width="80%" />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Table Skeleton (ERP-style)
  if (variant === 'table') {
    return (
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', p: 2 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              width={`${20 + i * 5}%`}
              height={20}
              sx={{ mr: 2 }}
            />
          ))}
        </Box>
        <Divider />
        {/* Rows */}
        {Array.from({ length: count }).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', p: 2 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                width={`${20 + i * 5}%`}
                height={18}
                sx={{ mr: 2 }}
              />
            ))}
          </Box>
        ))}
      </Box>
    );
  }

  // List Skeleton (Dealer/User lists)
  if (variant === 'list') {
    return (
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 2 }}>
        {Array.from({ length: count }).map((_, index) => (
          <Box key={index} sx={{ p: 2 }}>
            <Skeleton width="50%" height={18} />
            <Skeleton width="30%" height={16} sx={{ mt: 0.5 }} />
            {index < count - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Box>
    );
  }

  return <Skeleton height={200} />;
};
