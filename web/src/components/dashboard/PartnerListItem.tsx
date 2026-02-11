import React from 'react';
import { Box, Avatar, Typography, Chip } from '@mui/material';

interface PartnerListItemProps {
  avatar?: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  rating?: number;
}

export const PartnerListItem: React.FC<PartnerListItemProps> = ({
  avatar,
  name,
  category,
  email,
  phone,
  rating
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
        pb: 2,
        '&:not(:last-child)': {
          borderBottom: '1px solid #f0f0f0'
        }
      }}
    >
      {/* Avatar */}
      <Avatar
        src={avatar}
        alt={name}
        sx={{
          width: 56,
          height: 56,
          flexShrink: 0,
          bgcolor: '#e0e0e0'
        }}
      />

      {/* Partner Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: '#111827'
            }}
          >
            {name}
          </Typography>
          {rating && (
            <Chip
              label={`${rating}★`}
              size="small"
              sx={{
                bgcolor: '#FF5722',
                color: 'white',
                height: 20,
                fontSize: '0.75rem'
              }}
            />
          )}
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: '#6b7280',
            display: 'block',
            mb: 0.5
          }}
        >
          📂 Category: {category}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            ✉️ {email}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            ☎️ {phone}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
