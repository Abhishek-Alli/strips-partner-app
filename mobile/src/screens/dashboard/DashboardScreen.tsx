import React from 'react';
import UserDashboard from './UserDashboard';

/**
 * Dashboard Screen Router
 * 
 * For mobile app, only GENERAL_USER can access.
 * Other roles are redirected to AccessDenied screen (handled in AppNavigator).
 */
const DashboardScreen: React.FC = () => {
  return <UserDashboard />;
};

export default DashboardScreen;



