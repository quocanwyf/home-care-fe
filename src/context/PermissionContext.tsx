import { createContext, useContext, useMemo } from 'react';

import { getRequiredPermission } from '@/constants/permissions/permissions';
import type { PermissionModule } from '@/types/auth';

import { useAuth } from './AuthContext';

interface PermissionContextType {
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  canView: (module: PermissionModule) => boolean;
  canCreate: (module: PermissionModule) => boolean;
  canEdit: (module: PermissionModule) => boolean;
  canDelete: (module: PermissionModule) => boolean;
  canAccessRoute: (path: string) => boolean;
  getAccessibleRoutes: () => string[];
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

interface PermissionProviderProps {
  children: React.ReactNode;
}

export const PermissionProvider = ({ children }: PermissionProviderProps) => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    return user?.permissionList || [];
  }, [user?.permissionList]);

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const canView = (module: PermissionModule): boolean => {
    return hasPermission(`${module}_view`);
  };

  const canCreate = (module: PermissionModule): boolean => {
    return hasPermission(`${module}_create`);
  };

  const canEdit = (module: PermissionModule): boolean => {
    return hasPermission(`${module}_edit`);
  };

  const canDelete = (module: PermissionModule): boolean => {
    return hasPermission(`${module}_delete`);
  };

  const canAccessRoute = (path: string): boolean => {
    const requiredPermission = getRequiredPermission(path);
    if (!requiredPermission) return true;
    return hasPermission(requiredPermission);
  };

  const getAccessibleRoutes = (): string[] => {
    const allRoutes = [
      '/dashboard',
      '/orders',
      '/customers',
      '/maids',
      '/staffs',
      '/services',
      '/cost-coefficients',
      '/permissions',
      '/system',
    ];

    return allRoutes.filter((route) => canAccessRoute(route));
  };

  const value: PermissionContextType = {
    permissions,
    hasPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canAccessRoute,
    getAccessibleRoutes,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

// Custom hook to use permission context
// eslint-disable-next-line react-refresh/only-export-components
export const usePermissionContext = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error(
      'usePermissionContext must be used within a PermissionProvider'
    );
  }
  return context;
};
