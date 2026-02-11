/**
 * CMS Content Card Component
 *
 * Reusable card for displaying CMS content items
 * (Offers, Steel Market Updates, Lectures, etc.)
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Switch,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface CMSContentCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  date?: Date | string;
  isActive?: boolean;
  onToggleActive?: (id: string, active: boolean) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const CMSContentCard: React.FC<CMSContentCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  category,
  date,
  isActive = true,
  onToggleActive,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateValue: Date | string | undefined) => {
    if (!dateValue) return '';
    const d = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
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
      {/* Image */}
      <Box
        sx={{
          width: '100%',
          height: 160,
          backgroundColor: '#F3F4F6',
          overflow: 'hidden',
          position: 'relative',
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
            }}
          >
            <Typography sx={{ color: '#9CA3AF' }}>No Image</Typography>
          </Box>
        )}
        {/* Category Badge */}
        {category && (
          <Chip
            label={category}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: '#FF6B35',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.6875rem',
            }}
          />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 2.5 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#111827',
            fontSize: '1rem',
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </Typography>

        {/* Date */}
        {date && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 1,
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
            <Typography
              variant="caption"
              sx={{ color: '#9CA3AF', fontSize: '0.75rem' }}
            >
              {formatDate(date)}
            </Typography>
          </Box>
        )}

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: '#6B7280',
            fontSize: '0.8125rem',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>

        {/* Footer Actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 2,
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
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {onEdit && (
              <IconButton
                size="small"
                onClick={() => onEdit(id)}
                sx={{
                  color: '#6B7280',
                  '&:hover': {
                    color: '#FF6B35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                onClick={() => onDelete(id)}
                sx={{
                  color: '#EF4444',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CMSContentCard;
