export enum UserRole {
  GENERAL_USER = 'GENERAL_USER',
  PARTNER = 'PARTNER',
  DEALER = 'DEALER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  is_active?: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Legacy support - will be deprecated
export interface AuthStateLegacy {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Permission {
  resource: string;
  actions: string[];
}

export type RolePermissions = Record<UserRole, Permission[]>;

