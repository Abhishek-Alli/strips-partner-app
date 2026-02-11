import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface PermissionGuardProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  resource,
  action,
  children,
  fallback = null
}) => {
  const { hasPermission, isLoading } = useAuth();

  // Prevent permission flicker before auth is ready
  if (isLoading) {
    return null;
  }

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
