/**
 * Admin Layout Component
 *
 * Wrapper layout for admin pages with sidebar and header
 */

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { AdminSidebar, ADMIN_SIDEBAR_WIDTH } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ProtectedRoute } from '../guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showAddButton?: boolean;
  addButtonLabel?: string;
  onAddClick?: () => void;
  requiredPermission?: { resource: string; action: string };
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  showSearch = false,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  showAddButton = false,
  addButtonLabel,
  onAddClick,
  requiredPermission,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F3F4F6',
      }}
    >
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { lg: ADMIN_SIDEBAR_WIDTH, xs: 0 },
          flexShrink: 0,
        }}
      >
        <AdminSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <AdminHeader
          title={title}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          showAddButton={showAddButton}
          addButtonLabel={addButtonLabel}
          onAddClick={onAddClick}
          onMenuClick={handleMobileToggle}
        />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: '#F3F4F6',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );

  return (
    <ProtectedRoute
      allowedRoles={[UserRole.ADMIN]}
      requiredPermission={requiredPermission}
    >
      {content}
    </ProtectedRoute>
  );
};

export default AdminLayout;
