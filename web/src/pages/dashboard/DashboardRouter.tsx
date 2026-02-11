import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth.types';
import AdminDashboard from './AdminDashboard';
import PartnerDashboard from './PartnerDashboard';
import DealerDashboard from './DealerDashboard';
import { SkeletonLoader } from '../../components/dashboard/SkeletonLoader';

/**
 * Dynamic Dashboard Router
 * 
 * Maps user roles to their respective dashboard components.
 * This ensures clean separation - no role checks in JSX.
 */
const DASHBOARD_MAP: Record<UserRole, React.ComponentType> = {
  [UserRole.ADMIN]: AdminDashboard,
  [UserRole.PARTNER]: PartnerDashboard,
  [UserRole.DEALER]: DealerDashboard,
  [UserRole.GENERAL_USER]: () => (
    <div>General users should use the mobile app</div>
  )
};

const DashboardRouter: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <SkeletonLoader variant="statCard" count={4} />;
  }

  if (!user) {
    return <div>Please log in to view dashboard</div>;
  }

  const DashboardComponent = DASHBOARD_MAP[user.role];

  if (!DashboardComponent) {
    return <div>No dashboard available for your role</div>;
  }

  return <DashboardComponent />;
};

export default DashboardRouter;






