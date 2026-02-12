import { type RolePermissions, UserRole } from '../types/auth.types';

/**
 * Centralized Permission Configuration
 * 
 * This is the single source of truth for all role-based permissions.
 * No role checks should be hardcoded in components - use this config instead.
 */

export const PERMISSION_CONFIG: RolePermissions = {
  [UserRole.GENERAL_USER]: [
    { resource: 'dashboard', actions: ['view'] },
    { resource: 'profile', actions: ['view', 'edit'] },
    { resource: 'notifications', actions: ['view'] }
  ],

  [UserRole.PARTNER]: [
    { resource: 'dashboard', actions: ['view'] },
    { resource: 'profile', actions: ['view', 'edit'] },
    { resource: 'reports', actions: ['view'] },
    { resource: 'settings', actions: ['view'] }
  ],

  [UserRole.DEALER]: [
    { resource: 'dashboard', actions: ['view'] },
    { resource: 'profile', actions: ['view', 'edit'] },
    { resource: 'reports', actions: ['view', 'export'] },
    { resource: 'orders', actions: ['view', 'create', 'update'] },
    { resource: 'settings', actions: ['view', 'edit'] }
  ],

  [UserRole.ADMIN]: [
    { resource: '*', actions: ['*'] }, // Admin has all permissions
    { resource: 'contact', actions: ['view'] }
  ]
};

/**
 * Check if a user role has permission for a resource and action
 */
export const hasPermission = (
  userRole: UserRole,
  resource: string,
  action: string
): boolean => {
  const permissions = PERMISSION_CONFIG[userRole];
  if (!permissions) return false;

  // Admin has all permissions
  const adminPermission = permissions.find(
    p => p.resource === '*' && p.actions.includes('*')
  );
  if (adminPermission) return true;

  // Check for specific permission
  const permission = permissions.find(p => {
    const resourceMatch = p.resource === resource || p.resource === '*';
    const actionMatch = p.actions.includes(action) || p.actions.includes('*');
    return resourceMatch && actionMatch;
  });

  return !!permission;
};

/**
 * Get all resources a role can access
 */
export const getRoleResources = (userRole: UserRole): string[] => {
  const permissions = PERMISSION_CONFIG[userRole];
  if (!permissions) return [];

  // Admin has access to all
  if (permissions.some(p => p.resource === '*' && p.actions.includes('*'))) {
    return ['*'];
  }

  return permissions.map(p => p.resource).filter(r => r !== '*');
};

/**
 * Get all actions a role can perform on a resource
 */
export const getResourceActions = (
  userRole: UserRole,
  resource: string
): string[] => {
  const permissions = PERMISSION_CONFIG[userRole];
  if (!permissions) return [];

  // Admin can do everything
  if (permissions.some(p => p.resource === '*' && p.actions.includes('*'))) {
    return ['*'];
  }

  const permission = permissions.find(
    p => p.resource === resource || p.resource === '*'
  );

  return permission?.actions || [];
};

