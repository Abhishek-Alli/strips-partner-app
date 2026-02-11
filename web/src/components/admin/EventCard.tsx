/**
 * Event Card Component
 *
 * Card for displaying event information
 * Matches PDF design for Manage Events page
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  Button,
  Chip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  location: string;
  imageUrl?: string;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  postedAgo?: string;
  isActive?: boolean;
  onToggleActive?: (id: string, active: boolean) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  date,
  location,
  imageUrl,
  status,
  postedAgo,
  isActive = true,
  onToggleActive,
  onEdit,
  onDelete,
}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const weekday = dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();

  const getStatusColor = () => {
    switch (status) {
      case 'OPEN':
        return '#10B981';
      case 'CLOSED':
        return '#6B7280';
      case 'CANCELLED':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        backgroundColor: '#fff',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, p: 2.5 }}>
        {/* Event Image */}
        <Box
          sx={{
            width: 120,
            height: 100,
            borderRadius: '8px',
            backgroundColor: '#F3F4F6',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FEE2E2',
              }}
            >
              <Typography sx={{ color: '#EF4444', fontWeight: 700 }}>
                EVENTS
              </Typography>
            </Box>
          )}
        </Box>

        {/* Date Badge */}
        <Box
          sx={{
            textAlign: 'center',
            minWidth: 60,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#111827',
              fontSize: '2rem',
              lineHeight: 1,
            }}
          >
            {day}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            {month}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#9CA3AF',
              fontSize: '0.625rem',
            }}
          >
            {weekday}
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            sx={{
              color: '#374151',
              fontSize: '0.875rem',
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            {postedAgo && (
              <Typography
                variant="caption"
                sx={{ color: '#9CA3AF', fontSize: '0.75rem' }}
              >
                Posted: {postedAgo}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
              <Typography
                variant="caption"
                sx={{ color: '#9CA3AF', fontSize: '0.75rem' }}
              >
                {location}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Status */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 1,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ color: '#9CA3AF', fontSize: '0.625rem' }}
            >
              Status
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: getStatusColor(),
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {status}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 1.5,
          borderTop: '1px solid #F3F4F6',
        }}
      >
        <Switch
          checked={isActive}
          onChange={(e) => onToggleActive?.(id, e.target.checked)}
          size="small"
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#FF6B35',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#FF6B35',
            },
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onEdit && (
            <Button
              variant="text"
              onClick={() => onEdit(id)}
              sx={{
                color: '#FF6B35',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.8125rem',
              }}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="text"
              onClick={() => onDelete(id)}
              sx={{
                color: '#EF4444',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.8125rem',
              }}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default EventCard;
