/**
 * User Profile Card Component
 *
 * Card for displaying user information in grid layout
 * Matches PDF design for Manage Users page
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

interface UserProfileCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  referralCode?: string;
  isActive?: boolean;
  onToggleActive?: (id: string, active: boolean) => void;
  onViewDetails?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  id,
  name,
  email,
  phone,
  avatarUrl,
  referralCode,
  isActive = true,
  onToggleActive,
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

      {/* Avatar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Avatar
          src={avatarUrl}
          sx={{
            width: 80,
            height: 80,
            fontSize: '1.5rem',
            backgroundColor: '#E5E7EB',
            color: '#6B7280',
          }}
        >
          {name?.charAt(0)?.toUpperCase()}
        </Avatar>
      </Box>

      {/* Name */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#111827',
          textAlign: 'center',
          fontSize: '1rem',
          mb: 1.5,
        }}
      >
        {name}
      </Typography>

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

export default UserProfileCard;
