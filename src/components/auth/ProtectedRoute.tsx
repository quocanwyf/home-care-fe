import { Navigate, useLocation } from 'react-router-dom';

import LoadingFallback from '@/components/fallback/LoadingFallbackApp';
import { useAuth } from '@/context/AuthContext';
import { usePermission } from '@/hooks/common/usePermission';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { canAccessRoute } = usePermission();
  const location = useLocation();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra permission cho current route
  if (!canAccessRoute(location.pathname)) {
    console.warn(`Access denied to ${location.pathname}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
