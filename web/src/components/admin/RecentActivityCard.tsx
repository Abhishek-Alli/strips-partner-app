/**
 * Recent Activity Card Component
 *
 * Card for displaying recent activity items (users, dealers, partners)
 * Matches PDF design for Dashboard page
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';

export type ActivityType = 'user' | 'dealer' | 'partner';

interface RecentActivityItemProps {
  type: ActivityType;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  location?: string;
  category?: string;
  rating?: number;
}

export const RecentActivityItem: React.FC<RecentActivityItemProps> = ({
  type,
  name,
  email,
  phone,
  avatarUrl,
  location,
  category,
  rating,
}) => {
  const showRating = type !== 'user' && rating !== undefined;
  const showLocation = type === 'dealer' && location;
  const showCategory = type === 'partner' && category;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        backgroundColor: '#fff',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        {/* Avatar/Logo */}
        <Box sx={{ position: 'relative' }}>
          {type === 'dealer' ? (
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '8px',
                backgroundColor: '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #E5E7EB',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: '#3B82F6',
                }}
              >
                LOGO
              </Typography>
            </Box>
          ) : (
            <Avatar
              src={avatarUrl}
              sx={{
                width: 50,
                height: 50,
                fontSize: '1rem',
                backgroundColor: '#E5E7EB',
                color: '#6B7280',
              }}
            >
              {name?.charAt(0)?.toUpperCase()}
            </Avatar>
          )}
          {showRating && (
            <Chip
              icon={<StarIcon sx={{ fontSize: 10, color: '#fff' }} />}
              label={rating!.toFixed(1)}
              size="small"
              sx={{
                position: 'absolute',
                bottom: -6,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#FF6B35',
                color: '#fff',
                fontSize: '0.625rem',
                fontWeight: 600,
                height: 18,
                minWidth: 45,
                '& .MuiChip-icon': {
                  color: '#fff',
                },
                '& .MuiChip-label': {
                  px: 0.5,
                },
              }}
            />
          )}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: '#111827',
              fontSize: '0.875rem',
              mb: 0.25,
            }}
          >
            {name}
          </Typography>

          {showLocation && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 12, color: '#9CA3AF' }} />
              <Typography
                variant="caption"
                sx={{ color: '#6B7280', fontSize: '0.6875rem' }}
              >
                {location}
              </Typography>
            </Box>
          )}

          {showCategory && (
            <Typography
              variant="caption"
              sx={{ color: '#6B7280', fontSize: '0.6875rem', display: 'block', mb: 0.5 }}
            >
              Category: {category}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
            <EmailIcon sx={{ fontSize: 12, color: '#9CA3AF' }} />
            <Typography
              variant="caption"
              sx={{ color: '#6B7280', fontSize: '0.6875rem' }}
            >
              {email}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PhoneIcon sx={{ fontSize: 12, color: '#9CA3AF' }} />
            <Typography
              variant="caption"
              sx={{ color: '#6B7280', fontSize: '0.6875rem' }}
            >
              {phone}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

interface RecentActivitySectionProps {
  title: string;
  items: RecentActivityItemProps[];
  type: ActivityType;
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  title,
  items,
  type,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        backgroundColor: '#fff',
        height: '100%',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#111827',
          fontSize: '1rem',
          mb: 2,
        }}
      >
        {title}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item, index) => (
          <RecentActivityItem key={index} {...item} type={type} />
        ))}
      </Box>
    </Paper>
  );
};

export default RecentActivitySection;
