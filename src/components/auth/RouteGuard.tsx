import { Navigate } from 'react-router-dom';

import { usePermission } from '@/hooks/common/usePermission';
import type { PermissionModule } from '@/types/auth';

interface RouteGuardProps {
  children: React.ReactNode;
  module: PermissionModule;
  fallbackPath?: string;
}

const RouteGuard = ({
  children,
  module,
  fallbackPath = '/unauthorized',
}: RouteGuardProps) => {
  const { canView } = usePermission();

  if (!canView(module)) {
    console.warn(
      `Access denied to ${module} module. User doesn't have ${module}_view permission`
    );
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
