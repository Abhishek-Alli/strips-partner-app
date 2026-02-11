import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Sidebar } from './Sidebar';
import { Footer } from '../footer/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Shree Om Admin
            </Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.name} ({user?.role})
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Box sx={{ p: 3, flexGrow: 1 }}>{children}</Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};



