import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

interface UserListItemProps {
  avatar?: string;
  name: string;
  email: string;
  phone: string;
}

export const UserListItem: React.FC<UserListItemProps> = ({
  avatar,
  name,
  email,
  phone
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

      {/* User Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: '#111827',
            mb: 0.5
          }}
        >
          {name}
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
