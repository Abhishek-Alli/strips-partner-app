import React from 'react';
import DashboardRouter from './DashboardRouter';

/**
 * Main Dashboard Page
 * 
 * Uses DashboardRouter to dynamically render role-specific dashboards.
 * All role logic is handled in DashboardRouter - no role checks here.
 */
const DashboardPage: React.FC = () => {
  return <DashboardRouter />;
};

export default DashboardPage;



