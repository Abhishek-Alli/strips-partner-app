/**
 * Dealer Card Component
 *
 * Card for displaying dealer information in grid layout
 * Matches PDF design for Manage Dealers page
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';

interface DealerCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  logoUrl?: string;
  rating: number;
  referralCode?: string;
  isActive?: boolean;
  onToggleActive?: (id: string, active: boolean) => void;
  onViewDetails?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const DealerCard: React.FC<DealerCardProps> = ({
  id,
  name,
  email,
  phone,
  location,
  logoUrl,
  rating,
  referralCode,
  isActive: _isActive = true,
  onToggleActive: _onToggleActive,
  onViewDetails,
  onDelete,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        backgroundColor: '#fff',
        position: 'relative',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        },
      }}
    >
      {/* Delete Button */}
      {onDelete && (
        <IconButton
          size="small"
          onClick={() => onDelete(id)}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: '#EF4444',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}

      {/* Logo with Rating Badge */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, position: 'relative' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '12px',
            backgroundColor: logoUrl ? 'transparent' : '#E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
          }}
        >
          {logoUrl ? (
            <Box
              component="img"
              src={logoUrl}
              alt={name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.5rem',
                color: '#3B82F6',
              }}
            >
              LOGO
            </Typography>
          )}
        </Box>
        {/* Rating Badge */}
        <Chip
          icon={<StarIcon sx={{ fontSize: 14, color: '#fff' }} />}
          label={rating.toFixed(1)}
          size="small"
          sx={{
            position: 'absolute',
            bottom: -8,
            right: 'calc(50% - 50px)',
            backgroundColor: '#FF5722',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 600,
            height: 24,
            '& .MuiChip-icon': {
              color: '#fff',
            },
          }}
        />
      </Box>

      {/* Name */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#111827',
          textAlign: 'center',
          fontSize: '1rem',
          mb: 0.5,
        }}
      >
        {name}
      </Typography>

      {/* Location */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1.5 }}>
        <LocationOnIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
        <Typography
          variant="body2"
          sx={{ color: '#6B7280', fontSize: '0.75rem' }}
        >
          {location}
        </Typography>
      </Box>

      {/* Contact Info */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
          <EmailIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '0.8125rem' }}
          >
            {email}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '0.8125rem' }}
          >
            {phone}
          </Typography>
        </Box>
      </Box>

      {/* Referral Code */}
      {referralCode && (
        <Box
          sx={{
            backgroundColor: '#F3F4F6',
            borderRadius: '6px',
            px: 1.5,
            py: 0.75,
            mb: 2,
            display: 'inline-block',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#6B7280', fontWeight: 500 }}
          >
            Referral Code:{' '}
            <Box component="span" sx={{ color: '#111827', fontWeight: 600 }}>
              {referralCode}
            </Box>
          </Typography>
        </Box>
      )}

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
        {/* Orange Dot Indicator */}
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#FF5722',
          }}
        />
        <Button
          variant="text"
          onClick={() => onViewDetails?.(id)}
          sx={{
            color: '#6B7280',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.8125rem',
            '&:hover': {
              color: '#FF5722',
              backgroundColor: 'transparent',
            },
          }}
        >
          VIEW DETAILS
        </Button>
      </Box>
    </Paper>
  );
};

export default DealerCard;
