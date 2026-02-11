/**
 * Admin Header Component
 *
 * Top header with page title, search, action button, and profile
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  title: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showAddButton?: boolean;
  addButtonLabel?: string;
  onAddClick?: () => void;
  onMenuClick?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  showSearch = false,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  showAddButton = false,
  addButtonLabel = 'ADD NEW',
  onAddClick,
  onMenuClick,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleCloseMenu();
    await logout();
    navigate('/login');
  };

  const handleSettings = () => {
    handleCloseMenu();
    navigate('/settings');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
        px: 3,
        backgroundColor: '#fff',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left Section - Menu Button (mobile) and Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={onMenuClick}
          sx={{
            display: { xs: 'flex', lg: 'none' },
            color: '#374151',
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: '#111827',
            fontSize: { xs: '1.25rem', md: '1.5rem' },
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Right Section - Search, Add Button, Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Search Bar */}
        {showSearch && (
          <TextField
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            size="small"
            sx={{
              width: { xs: 150, sm: 200, md: 280 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#F9FAFB',
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: '#E5E7EB',
                },
                '&:hover fieldset': {
                  borderColor: '#D1D5DB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF6B35',
                  borderWidth: 1,
                },
              },
              '& .MuiInputBase-input': {
                fontSize: '0.875rem',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* Add Button */}
        {showAddButton && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            sx={{
              backgroundColor: '#FF6B35',
              color: '#fff',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              fontSize: '0.875rem',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#E85A2B',
                boxShadow: 'none',
              },
            }}
          >
            {addButtonLabel}
          </Button>
        )}

        {/* Profile Section */}
        <Box
          onClick={handleProfileClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            ml: 1,
            padding: '4px 8px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#F3F4F6',
            },
          }}
        >
          <Avatar
            src={undefined}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: '#FF6B35',
            }}
          >
            {user?.name?.charAt(0) || 'A'}
          </Avatar>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: '#374151',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Admin
          </Typography>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: '12px',
              '& .MuiMenuItem-root': {
                py: 1.5,
                px: 2,
                fontSize: '0.875rem',
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.name || 'Admin User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || 'admin@example.com'}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleSettings}>
            <SettingsIcon sx={{ mr: 1.5, fontSize: 20, color: '#6B7280' }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: '#DC2626' }}>
            <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default AdminHeader;
