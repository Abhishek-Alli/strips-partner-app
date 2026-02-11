import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: { resource: string; action: string };
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission
}) => {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth();

  // Wait until auth is resolved (prevents redirect flicker)
  if (isLoading) {
    return null;
  }

  // Not logged in → redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  // Permission-based access control
  if (
    requiredPermission &&
    !hasPermission(requiredPermission.resource, requiredPermission.action)
  ) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};
