import React from 'react';
import {
  Box,
  Typography,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 260;

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title
}) => {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#0f172a',
            color: '#ffffff'
          }
        }}
      >
        <Box sx={{ px: 2, py: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            SOM Admin
          </Typography>
          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
            Steel Operations Manager
          </Typography>
        </Box>

        <List>
          {[
            'Dashboard',
            'Manage Users',
            'Manage Dealers',
            'Manage Partners',
            'Manage Products',
            'Events',
            'Inquiries',
            'CMS',
            'Offers & Discounts',
            'Reports & Analytics'
          ].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* MAIN AREA */}
      <Box sx={{ flexGrow: 1 }}>
        {/* TOP BAR */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: '#ffffff',
            color: '#111827',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={600}>
              {title || 'Dashboard'}
            </Typography>

            {user && (
              <Typography variant="body2" color="text.secondary">
                Logged in as {user.name}
              </Typography>
            )}
          </Toolbar>
        </AppBar>

        {/* CONTENT */}
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};
