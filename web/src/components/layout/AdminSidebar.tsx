/**
 * Admin Sidebar Component
 *
 * Dark-themed collapsible sidebar
 * Collapsed: shows icons only | Expanded: shows icons + labels
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
  Collapse,
  Tooltip,
  IconButton,
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
import SummarizeIcon from '@mui/icons-material/Summarize';
import SpaIcon from '@mui/icons-material/Spa';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth.types';

export const DRAWER_WIDTH = 260;
export const DRAWER_COLLAPSED_WIDTH = 64;

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: UserRole[];
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon />, roles: [UserRole.ADMIN] },
  { label: 'Manage Users', path: '/admin/users', icon: <PeopleIcon />, roles: [UserRole.ADMIN] },
  { label: 'Manage Dealers', path: '/admin/dealers', icon: <StoreIcon />, roles: [UserRole.ADMIN] },
  { label: 'Manage Partners', path: '/admin/partners', icon: <HandshakeIcon />, roles: [UserRole.ADMIN] },
  { label: 'Manage Products', path: '/admin/products', icon: <InventoryIcon />, roles: [UserRole.ADMIN] },
  { label: 'Manage Events', path: '/admin/events', icon: <EventIcon />, roles: [UserRole.ADMIN] },
  { label: 'Manage Partner Works', path: '/admin/partner-works', icon: <WorkIcon />, roles: [UserRole.ADMIN] },
  { label: 'Inquiries', path: '/admin/enquiries', icon: <ContactMailIcon />, roles: [UserRole.ADMIN] },
  { label: 'Manage Feedback', path: '/admin/feedback', icon: <FeedbackIcon />, roles: [UserRole.ADMIN] },
  { label: 'CMS', path: '/admin/cms', icon: <ArticleIcon />, roles: [UserRole.ADMIN] },
  { label: 'Offers and Discounts', path: '/admin/offers', icon: <LocalOfferIcon />, roles: [UserRole.ADMIN] },
  { label: 'Analytics Dashboard', path: '/admin/analytics', icon: <AnalyticsIcon />, roles: [UserRole.ADMIN] },
  { label: 'Reports', path: '/admin/reports', icon: <SummarizeIcon />, roles: [UserRole.ADMIN] },
  { label: 'View Checklists', path: '/admin/checklists', icon: <ChecklistIcon />, roles: [UserRole.ADMIN] },
  { label: 'Shortcuts & Links', path: '/admin/shortcuts', icon: <LinkIcon />, roles: [UserRole.ADMIN] },
  { label: 'Videos', path: '/admin/videos', icon: <VideoLibraryIcon />, roles: [UserRole.ADMIN] },
  { label: 'Apply for Dealership', path: '/admin/dealership-applications', icon: <AssignmentIcon />, roles: [UserRole.ADMIN] },
  { label: 'Notes', path: '/admin/notes', icon: <NotesIcon />, roles: [UserRole.ADMIN] },
  { label: 'Loyalty Points', path: '/admin/loyalty-points', icon: <StarsIcon />, roles: [UserRole.ADMIN] },
  { label: 'Steel Market Updates', path: '/admin/steel-market', icon: <TrendingUpIcon />, roles: [UserRole.ADMIN] },
  { label: 'Lectures', path: '/admin/lectures', icon: <SchoolIcon />, roles: [UserRole.ADMIN] },
  { label: 'Trading Advices', path: '/admin/trading-advice', icon: <TipsAndUpdatesIcon />, roles: [UserRole.ADMIN] },
  { label: 'Upcoming Projects', path: '/admin/projects', icon: <UpcomingIcon />, roles: [UserRole.ADMIN] },
  { label: 'Tenders', path: '/admin/tenders', icon: <GavelIcon />, roles: [UserRole.ADMIN] },
  { label: 'Education Posts', path: '/admin/education-posts', icon: <MenuBookIcon />, roles: [UserRole.ADMIN] },
  { label: 'Quiz', path: '/admin/quiz', icon: <QuizIcon />, roles: [UserRole.ADMIN] },
  { label: 'Vastu Tips', path: '/admin/vastu', icon: <SpaIcon />, roles: [UserRole.ADMIN] },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen = false,
  onMobileClose,
  collapsed = false,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      if (collapsed) return; // don't expand groups in collapsed mode
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

  const isItemActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const visibleMenuItems = menuItems.filter((item) => {
    if (!user) return false;
    if (item.roles && !item.roles.includes(user.role)) return false;
    return true;
  });

  const sidebarContent = (isCollapsed: boolean) => (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2D3142',
        color: '#fff',
        overflow: 'hidden',
        transition: 'width 0.25s ease',
      }}
    >
      {/* Logo / Toggle Section */}
      <Box
        sx={{
          p: isCollapsed ? 1 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          minHeight: 60,
        }}
      >
        {!isCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #FF6B35, #e85a2b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#fff' }}>SRJ</Typography>
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '0.3px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              SRJ Strips & Pipes
            </Typography>
          </Box>
        )}

        {isCollapsed && (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #FF6B35, #e85a2b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#fff' }}>SRJ</Typography>
          </Box>
        )}

        {/* Toggle button — only on desktop */}
        <Tooltip title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
          <IconButton
            onClick={onToggleCollapse}
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: '6px',
              width: 28,
              height: 28,
              flexShrink: 0,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fff',
              },
              ...(isCollapsed && { mt: 1 }),
            }}
          >
            {isCollapsed ? (
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            ) : (
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Navigation Menu */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 1,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
          },
        }}
      >
        <List sx={{ px: isCollapsed ? 0.5 : 1 }}>
          {visibleMenuItems.map((item) => (
            <React.Fragment key={item.path}>
              <ListItem disablePadding sx={{ mb: 0.5, display: 'block' }}>
                <Tooltip
                  title={isCollapsed ? item.label : ''}
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    onClick={() => handleItemClick(item)}
                    selected={isItemActive(item.path)}
                    sx={{
                      borderRadius: '8px',
                      py: 1.1,
                      px: isCollapsed ? 0 : 1.5,
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      minHeight: 42,
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
                      },
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: isCollapsed ? 0 : 36,
                        color: isItemActive(item.path) ? '#FF6B35' : 'rgba(255,255,255,0.7)',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {!isCollapsed && (
                      <>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: isItemActive(item.path) ? 600 : 400,
                            color: isItemActive(item.path) ? '#fff' : 'rgba(255,255,255,0.85)',
                            noWrap: true,
                          }}
                        />
                        {item.children && (
                          openItems.includes(item.path)
                            ? <ExpandLess sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }} />
                            : <ExpandMore sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }} />
                        )}
                      </>
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>

              {item.children && !isCollapsed && (
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
                            '&.Mui-selected': { backgroundColor: 'rgba(255,255,255,0.1)' },
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 32,
                              color: isItemActive(child.path) ? '#FF6B35' : 'rgba(255,255,255,0.6)',
                            }}
                          >
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={child.label}
                            primaryTypographyProps={{
                              fontSize: '0.8125rem',
                              color: isItemActive(child.path) ? '#fff' : 'rgba(255,255,255,0.75)',
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
      {/* Mobile Drawer — always full width */}
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
        {sidebarContent(false)}
      </Drawer>

      {/* Desktop Drawer — collapsible */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            width: collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            overflowX: 'hidden',
            transition: 'width 0.25s ease',
          },
        }}
        open
      >
        {sidebarContent(collapsed)}
      </Drawer>
    </>
  );
};

export const ADMIN_SIDEBAR_WIDTH = DRAWER_WIDTH;
export const ADMIN_SIDEBAR_COLLAPSED_WIDTH = DRAWER_COLLAPSED_WIDTH;

export default AdminSidebar;
