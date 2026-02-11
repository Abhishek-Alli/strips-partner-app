/**
 * Dashboard Stat Card Component
 *
 * Card for displaying metrics on the dashboard (Users, Partners, Dealers, Products)
 * Matches PDF design with icon and count
 */

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HandshakeIcon from '@mui/icons-material/Handshake';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';

export type StatType = 'users' | 'partners' | 'dealers' | 'products';

interface DashboardStatCardProps {
  type: StatType;
  label: string;
  value: number | string;
  onClick?: () => void;
}

const iconConfig: Record<StatType, { icon: React.ReactNode; bgColor: string }> = {
  users: {
    icon: <PeopleIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
    bgColor: 'rgba(255, 107, 53, 0.1)',
  },
  partners: {
    icon: <HandshakeIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
    bgColor: 'rgba(255, 107, 53, 0.1)',
  },
  dealers: {
    icon: <StoreIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
    bgColor: 'rgba(255, 107, 53, 0.1)',
  },
  products: {
    icon: <InventoryIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
    bgColor: 'rgba(255, 107, 53, 0.1)',
  },
};

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  type,
  label,
  value,
  onClick,
}) => {
  const config = iconConfig[type];

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 3,
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        backgroundColor: '#fff',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': onClick
          ? {
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              borderColor: '#FF6B35',
            }
          : {},
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Icon */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '12px',
            backgroundColor: config.bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {config.icon}
        </Box>

        {/* Content */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              fontSize: '0.875rem',
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#111827',
              fontSize: '1.75rem',
            }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default DashboardStatCard;
