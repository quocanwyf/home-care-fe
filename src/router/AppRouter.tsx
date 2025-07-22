import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import LoadingFallback from '@/components/fallback/LoadingFallback';

const MainLayout = lazy(() => import('@/components/layout/MainLayout'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const CustomersPage = lazy(
  () => import('@/pages/human-resources/customers/CustomersPage')
);
const MaidsPage = lazy(() => import('@/pages/human-resources/maids/MaidsPage'));
const StaffsPage = lazy(
  () => import('@/pages/human-resources/staffs/StaffsPage')
);
const OrdersPage = lazy(() => import('@/pages/orders/OrdersPage'));
const AddOrderPage = lazy(() => import('@/pages/orders/AddOrderPage'));
const FinancesPage = lazy(
  () => import('@/pages/inventory/finances/FianancesPage')
);
const PermissionsPage = lazy(
  () => import('@/pages/inventory/permissions/PermissionsPage')
);
const SystemPage = lazy(() => import('@/pages/inventory/system/SystemPage'));

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            // <ProtectedRoute>
            <MainLayout />
            // </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/maids" element={<MaidsPage />} />
          <Route path="/staffs" element={<StaffsPage />} />

          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/add" element={<AddOrderPage />} />

          <Route path="/finances" element={<FinancesPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
          <Route path="/system" element={<SystemPage />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
