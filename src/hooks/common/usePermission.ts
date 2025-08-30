import { useMemo } from 'react';

import { getRequiredPermission } from '@/constants/permissions/permissions';
import { useAuth } from '@/context/AuthContext';
import type { PermissionModule } from '@/types/auth';

export const usePermission = () => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user?.permissionList) return [];
    return user.permissionList;
  }, [user?.permissionList]);

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some((permission) =>
      permissions.includes(permission)
    );
  };

  // Helper functions cho từng loại action
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

  // Kiểm tra quyền truy cập route
  const canAccessRoute = (path: string): boolean => {
    const requiredPermission = getRequiredPermission(path);
    if (!requiredPermission) return true; // Nếu không cần permission đặc biệt
    return hasPermission(requiredPermission);
  };

  // Lấy danh sách routes user có thể truy cập
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

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canAccessRoute,
    getAccessibleRoutes,
  };
};
