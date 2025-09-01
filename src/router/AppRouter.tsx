import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RouteGuard from '@/components/auth/RouteGuard';
import LoadingFallback from '@/components/fallback/LoadingFallbackApp';

const MainLayout = lazy(() => import('@/components/layout/MainLayout'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const CustomersPage = lazy(
  () => import('@/pages/human-resources/customers/CustomersPage')
);

const MaidsPage = lazy(() => import('@/pages/human-resources/maids/MaidsPage'));
const AddMaidPage = lazy(
  () => import('@/pages/human-resources/maids/AddMaidPage')
);
const EditMaidPage = lazy(
  () => import('@/pages/human-resources/maids/EditMaidPage')
);

const StaffsPage = lazy(
  () => import('@/pages/human-resources/staffs/StaffsPage')
);
const AddStaffPage = lazy(
  () => import('@/pages/human-resources/staffs/AddStaffPage')
);

const OrdersPage = lazy(() => import('@/pages/orders/OrdersPage'));
const AddOrderPage = lazy(() => import('@/pages/orders/AddOrderPage'));
const DetailOrderPage = lazy(() => import('@/pages/orders/DetailOrderPage'));

const ServicesPage = lazy(
  () => import('@/pages/inventory/services/ServicesPage')
);
const FinancesPage = lazy(
  () => import('@/pages/inventory/finances/FianancesPage')
);
const PermissionsPage = lazy(
  () => import('@/pages/inventory/permissions/PermissionsPage')
);
const SystemPage = lazy(() => import('@/pages/inventory/system/SystemPage'));

const UnauthorizedPage = lazy(
  () => import('@/pages/unauthorized-access/FallbackPage')
);

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard - cần dashboard_view */}
          <Route
            path="/dashboard"
            element={
              <RouteGuard module="dashboard">
                <DashboardPage />
              </RouteGuard>
            }
          />

          {/* Customers - cần customers_view */}
          <Route
            path="/customers"
            element={
              <RouteGuard module="customers">
                <CustomersPage />
              </RouteGuard>
            }
          />

          {/* Maids - cần helpers_view */}
          <Route
            path="/maids"
            element={
              <RouteGuard module="helpers">
                <MaidsPage />
              </RouteGuard>
            }
          />
          <Route
            path="/maids/add"
            element={
              <RouteGuard module="helpers">
                <AddMaidPage />
              </RouteGuard>
            }
          />
          <Route
            path="/maids/edit/:id"
            element={
              <RouteGuard module="helpers">
                <EditMaidPage />
              </RouteGuard>
            }
          />

          {/* Staffs - cần staffs_view */}
          <Route
            path="/staffs"
            element={
              <RouteGuard module="staffs">
                <StaffsPage />
              </RouteGuard>
            }
          />
          <Route
            path="/staffs/add"
            element={
              <RouteGuard module="staffs">
                <AddStaffPage />
              </RouteGuard>
            }
          />

          {/* Orders - cần orders_view */}
          <Route
            path="/orders"
            element={
              <RouteGuard module="orders">
                <OrdersPage />
              </RouteGuard>
            }
          />
          <Route
            path="/orders/add"
            element={
              <RouteGuard module="orders">
                <AddOrderPage />
              </RouteGuard>
            }
          />
          <Route
            path="/orders/detail/:id"
            element={
              <RouteGuard module="orders">
                <DetailOrderPage />
              </RouteGuard>
            }
          />

          {/* Services - cần services_view */}
          <Route
            path="/services"
            element={
              <RouteGuard module="services">
                <ServicesPage />
              </RouteGuard>
            }
          />

          {/* Cost Coefficients - cần costCoefficients_view */}
          <Route
            path="/cost-coefficients"
            element={
              <RouteGuard module="costCoefficients">
                <FinancesPage />
              </RouteGuard>
            }
          />

          {/* Permissions - cần roles_view */}
          <Route
            path="/permissions"
            element={
              <RouteGuard module="roles">
                <PermissionsPage />
              </RouteGuard>
            }
          />

          {/* System - cần generalSetting_view */}
          <Route
            path="/system"
            element={
              <RouteGuard module="generalSetting">
                <SystemPage />
              </RouteGuard>
            }
          />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
