/**
 * Admin Sidebar Component
 *
 * Dark-themed sidebar matching the PDF design reference
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import HandshakeIcon from '@mui/icons-material/Handshake';
import InventoryIcon from '@mui/icons-material/Inventory';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ArticleIcon from '@mui/icons-material/Article';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ChecklistIcon from '@mui/icons-material/Checklist';
import LinkIcon from '@mui/icons-material/Link';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotesIcon from '@mui/icons-material/Notes';
import StarsIcon from '@mui/icons-material/Stars';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import GavelIcon from '@mui/icons-material/Gavel';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuizIcon from '@mui/icons-material/Quiz';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth.types';

const DRAWER_WIDTH = 260;

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: UserRole[];
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <DashboardIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Manage Users',
    path: '/admin/users',
    icon: <PeopleIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Manage Dealers',
    path: '/admin/dealers',
    icon: <StoreIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Manage Partners',
    path: '/admin/partners',
    icon: <HandshakeIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Manage Products',
    path: '/admin/products',
    icon: <InventoryIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Manage Events',
    path: '/admin/events',
    icon: <EventIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Manage Partner Works',
    path: '/admin/partner-works',
    icon: <WorkIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Inquiries',
    path: '/admin/enquiries',
    icon: <ContactMailIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Manage Feedback',
    path: '/admin/feedback',
    icon: <FeedbackIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'CMS',
    path: '/admin/cms',
    icon: <ArticleIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Offers and Discounts',
    path: '/admin/offers',
    icon: <LocalOfferIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Reports and Analytics',
    path: '/admin/analytics',
    icon: <AnalyticsIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'View Checklists',
    path: '/admin/checklists',
    icon: <ChecklistIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Shortcuts & Links',
    path: '/admin/shortcuts',
    icon: <LinkIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Videos',
    path: '/admin/videos',
    icon: <VideoLibraryIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Apply for Dealership',
    path: '/admin/dealership-applications',
    icon: <AssignmentIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Notes',
    path: '/admin/notes',
    icon: <NotesIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Loyalty Points',
    path: '/admin/loyalty-points',
    icon: <StarsIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Steel Market Updates',
    path: '/admin/steel-market',
    icon: <TrendingUpIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Lectures',
    path: '/admin/lectures',
    icon: <SchoolIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Trading Advices',
    path: '/admin/trading-advice',
    icon: <TipsAndUpdatesIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Upcoming Projects',
    path: '/admin/projects',
    icon: <UpcomingIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Tenders',
    path: '/admin/tenders',
    icon: <GavelIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Education Posts',
    path: '/admin/education-posts',
    icon: <MenuBookIcon />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Quiz',
    path: '/admin/quiz',
    icon: <QuizIcon />,
    roles: [UserRole.ADMIN],
  },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen = false,
  onMobileClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      setOpenItems((prev) =>
        prev.includes(item.path)
          ? prev.filter((p) => p !== item.path)
          : [...prev, item.path]
      );
    } else {
      navigate(item.path);
      if (onMobileClose) onMobileClose();
    }
  };

  const isItemActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const visibleMenuItems = menuItems.filter((item) => {
    if (!user) return false;
    if (item.roles && !item.roles.includes(user.role)) return false;
    return true;
  });

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2D3142',
        color: '#fff',
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MenuIcon sx={{ fontSize: 24 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1.25rem',
            letterSpacing: '0.5px',
          }}
        >
          SOM
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          py: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
          },
        }}
      >
        <List sx={{ px: 1 }}>
          {visibleMenuItems.map((item) => (
            <React.Fragment key={item.path}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleItemClick(item)}
                  selected={isItemActive(item.path)}
                  sx={{
                    borderRadius: '8px',
                    py: 1.25,
                    px: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.15)',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isItemActive(item.path)
                        ? '#FF6B35'
                        : 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isItemActive(item.path) ? 600 : 400,
                      color: isItemActive(item.path)
                        ? '#fff'
                        : 'rgba(255,255,255,0.85)',
                    }}
                  />
                  {item.children && (
                    openItems.includes(item.path) ? (
                      <ExpandLess sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    ) : (
                      <ExpandMore sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    )
                  )}
                </ListItemButton>
              </ListItem>
              {item.children && (
                <Collapse in={openItems.includes(item.path)} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItem key={child.path} disablePadding sx={{ mb: 0.25 }}>
                        <ListItemButton
                          onClick={() => handleItemClick(child)}
                          selected={isItemActive(child.path)}
                          sx={{
                            pl: 5,
                            py: 1,
                            borderRadius: '8px',
                            mx: 1,
                            '&.Mui-selected': {
                              backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.08)',
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 32,
                              color: isItemActive(child.path)
                                ? '#FF6B35'
                                : 'rgba(255,255,255,0.6)',
                            }}
                          >
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={child.label}
                            primaryTypographyProps={{
                              fontSize: '0.8125rem',
                              color: isItemActive(child.path)
                                ? '#fff'
                                : 'rgba(255,255,255,0.75)',
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
        open
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export const ADMIN_SIDEBAR_WIDTH = DRAWER_WIDTH;

export default AdminSidebar;
