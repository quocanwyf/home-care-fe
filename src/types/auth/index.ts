export interface LoginRequest {
  hmrId: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  fullName: string;
  role: string;
  permissionList: string[];
}

export interface User {
  success: boolean;
  fullName: string;
  role: string;
  permissionList: string[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  getUserRole: () => string;
  getUserName: () => string;
}

// Permission Types
export type PermissionModule =
  | 'dashboard'
  | 'orders'
  | 'customers'
  | 'helpers'
  | 'staffs'
  | 'services'
  | 'costCoefficients'
  | 'roles'
  | 'generalSetting';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';

export type Permission = `${PermissionModule}_${PermissionAction}`;
