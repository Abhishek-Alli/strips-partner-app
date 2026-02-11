/**
 * Product Card Component
 *
 * Card for displaying product information in grid layout
 * Matches PDF design for Manage Products page
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Switch,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isActive?: boolean;
  onToggleActive?: (id: string, active: boolean) => void;
  onViewDetails?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  imageUrl,
  isActive = true,
  onToggleActive,
  onViewDetails,
  onDelete,
}) => {
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
      {/* Product Image */}
      <Box
        sx={{
          width: '100%',
          height: 180,
          backgroundColor: '#F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Typography sx={{ color: '#9CA3AF' }}>No Image</Typography>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 2.5 }}>
        {/* Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#111827',
            fontSize: '1rem',
            mb: 1,
          }}
        >
          {name}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: '#6B7280',
            fontSize: '0.8125rem',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 4,
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          <Button
            variant="text"
            onClick={() => onViewDetails?.(id)}
            sx={{
              color: '#6B7280',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.8125rem',
              '&:hover': {
                color: '#FF6B35',
                backgroundColor: 'transparent',
              },
            }}
          >
            VIEW DETAILS
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductCard;
