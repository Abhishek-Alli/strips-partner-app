import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth.types';

const DRAWER_WIDTH = 240;

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
  permission?: { resource: string; action: string };
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <DashboardOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'dashboard', action: 'view' }
  },
  {
    label: 'Manage Users',
    path: '/admin/users',
    icon: <PeopleOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'users', action: 'view' }
  },
  {
    label: 'Manage Dealers',
    path: '/admin/dealers',
    icon: <StoreOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'dealers', action: 'manage' }
  },
  {
    label: 'Manage Partners',
    path: '/admin/partners',
    icon: <BusinessOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'partners', action: 'manage' }
  },
  {
    label: 'Manage Products',
    path: '/admin/products',
    icon: <InventoryOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'products', action: 'manage' }
  },
  {
    label: 'Manage Events',
    path: '/admin/events',
    icon: <AssessmentOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'events', action: 'manage' }
  },
  {
    label: 'Manage Partner Works',
    path: '/admin/partner-works',
    icon: <BuildOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'partner-works', action: 'manage' }
  },
  {
    label: 'Inquiries',
    path: '/admin/enquiries',
    icon: <QuestionAnswerOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'inquiries', action: 'manage' }
  },
  {
    label: 'Manage feedback',
    path: '/admin/feedback',
    icon: <RateReviewOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'feedback', action: 'moderate' }
  },
  {
    label: 'CMS',
    path: '/admin/cms',
    icon: <SettingsOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'cms', action: 'manage' }
  },
  {
    label: 'Offers and discounts',
    path: '/admin/offers',
    icon: <LocalOfferOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'offers', action: 'manage' }
  },
  {
    label: 'Reports and Analytics',
    path: '/admin/analytics',
    icon: <AnalyticsOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'analytics', action: 'view' }
  },
  {
    label: 'View Checklists',
    path: '/admin/utilities',
    icon: <AssessmentOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'utilities', action: 'view' }
  },
  {
    label: 'Videos',
    path: '/admin/utilities',
    icon: <AssessmentOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'videos', action: 'view' }
  },
  {
    label: 'Notes',
    path: '/admin/utilities',
    icon: <SettingsOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'notes', action: 'view' }
  },
  {
    label: 'Steel Market Updates',
    path: '/admin/steel-market',
    icon: <AnalyticsOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'market', action: 'view' }
  },
  {
    label: 'Lectures',
    path: '/admin/lectures',
    icon: <AssessmentOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'lectures', action: 'manage' }
  },
  {
    label: 'Trading Advices',
    path: '/admin/trading-advice',
    icon: <AssessmentOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'advice', action: 'manage' }
  },
  {
    label: 'Upcoming Projects',
    path: '/admin/projects',
    icon: <BuildOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'projects', action: 'manage' }
  },
  {
    label: 'Tenders',
    path: '/admin/tenders',
    icon: <AssessmentOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'tenders', action: 'manage' }
  },
  {
    label: 'Education Posts',
    path: '/admin/education-posts',
    icon: <AssessmentOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'education', action: 'manage' }
  },
  {
    label: 'Quiz',
    path: '/admin/quiz',
    icon: <QuestionAnswerOutlinedIcon />,
    roles: [UserRole.ADMIN],
    permission: { resource: 'quiz', action: 'manage' }
  }
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  const visibleMenuItems = menuItems.filter(item => {
    if (!user) return false;
    if (!item.roles.includes(user.role)) return false;
    if (item.permission && !hasPermission(item.permission.resource, item.permission.action)) {
      return false;
    }
    return true;
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box'
        }
      }}
    >
      <List>
        {visibleMenuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};



