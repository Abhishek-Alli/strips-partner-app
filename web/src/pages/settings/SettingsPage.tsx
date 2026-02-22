import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
);

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleProfileSave = () => {
    // Profile update logic would go here
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePasswordSave = () => {
    setPasswordError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    // Password update logic would go here
    setPasswordSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  const initials = (user?.name || 'Admin')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: '#F9FAFB',
      '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' },
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 3 }}>
        Settings
      </Typography>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
        }}
      >
        {/* Profile Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #2D3142 0%, #3a4060 100%)',
            p: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                backgroundColor: '#FF6B35',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#FF6B35',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid #2D3142',
              }}
            >
              <EditIcon sx={{ fontSize: 12, color: '#fff' }} />
            </Box>
          </Box>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
              {user?.name || 'Admin User'}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', mb: 1 }}>
              {user?.email || ''}
            </Typography>
            <Chip
              label={user?.role || 'ADMIN'}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 107, 53, 0.2)',
                color: '#FF6B35',
                fontWeight: 600,
                fontSize: '0.75rem',
                border: '1px solid rgba(255, 107, 53, 0.4)',
              }}
            />
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ px: 3, borderBottom: '1px solid #E5E7EB' }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                color: '#6B7280',
                minWidth: 120,
              },
              '& .Mui-selected': { color: '#FF6B35', fontWeight: 600 },
              '& .MuiTabs-indicator': { backgroundColor: '#FF6B35' },
            }}
          >
            <Tab icon={<PersonOutlineIcon />} iconPosition="start" label="Profile" />
            <Tab icon={<LockOutlinedIcon />} iconPosition="start" label="Security" />
          </Tabs>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Profile Tab */}
          <TabPanel value={tab} index={0}>
            {profileSaved && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>
                Profile updated successfully.
              </Alert>
            )}
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: '#374151', mb: 2.5 }}
            >
              Profile Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 520 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={fieldSx}
              />
              <TextField
                fullWidth
                label="Email Address"
                value={user?.email || ''}
                disabled
                helperText="Email cannot be changed from this portal."
                sx={{
                  ...fieldSx,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    backgroundColor: '#F3F4F6',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Role"
                value={user?.role || 'ADMIN'}
                disabled
                sx={{
                  ...fieldSx,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    backgroundColor: '#F3F4F6',
                  },
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Button
              variant="contained"
              onClick={handleProfileSave}
              sx={{
                backgroundColor: '#FF6B35',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.25,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#E85A2B', boxShadow: 'none' },
              }}
            >
              Save Changes
            </Button>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={tab} index={1}>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
                {passwordError}
              </Alert>
            )}
            {passwordSaved && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>
                Password changed successfully.
              </Alert>
            )}
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: '#374151', mb: 2.5 }}
            >
              Change Password
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 520 }}>
              <TextField
                fullWidth
                label="Current Password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrent(!showCurrent)}
                        edge="end"
                        size="small"
                        sx={{ color: '#9CA3AF' }}
                      >
                        {showCurrent ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />
              <TextField
                fullWidth
                label="New Password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                helperText="Minimum 8 characters"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNew(!showNew)}
                        edge="end"
                        size="small"
                        sx={{ color: '#9CA3AF' }}
                      >
                        {showNew ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirm(!showConfirm)}
                        edge="end"
                        size="small"
                        sx={{ color: '#9CA3AF' }}
                      >
                        {showConfirm ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Button
              variant="contained"
              onClick={handlePasswordSave}
              sx={{
                backgroundColor: '#FF6B35',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.25,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#E85A2B', boxShadow: 'none' },
              }}
            >
              Update Password
            </Button>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
