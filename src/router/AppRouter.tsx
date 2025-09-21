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
const DetailCustomerPage = lazy(
  () => import('@/pages/human-resources/customers/DetailCustomerPage')
);

const MaidsPage = lazy(() => import('@/pages/human-resources/maids/MaidsPage'));
const AddMaidPage = lazy(
  () => import('@/pages/human-resources/maids/AddMaidPage')
);
const EditMaidPage = lazy(
  () => import('@/pages/human-resources/maids/EditMaidPage')
);
const DetailMaidPage = lazy(
  () => import('@/pages/human-resources/maids/DetailMaidPage')
);

const StaffsPage = lazy(
  () => import('@/pages/human-resources/staffs/StaffsPage')
);
const AddStaffPage = lazy(
  () => import('@/pages/human-resources/staffs/AddStaffPage')
);
const EditStaffPage = lazy(
  () => import('@/pages/human-resources/staffs/EditStaffPage')
);
const DetailStaffPage = lazy(
  () => import('@/pages/human-resources/staffs/DetailStaffPage')
);

const OrdersPage = lazy(() => import('@/pages/orders/OrdersPage'));
const AddOrderPage = lazy(() => import('@/pages/orders/AddOrderPage'));
const DetailOrderPage = lazy(() => import('@/pages/orders/DetailOrderPage'));

const ServicesPage = lazy(
  () => import('@/pages/inventory/services/ServicesPage')
);
const AddServicePage = lazy(
  () => import('@/pages/inventory/services/AddServicePage')
);
const EditServicePage = lazy(
  () => import('@/pages/inventory/services/EditServicePage')
);
const DetailServicePage = lazy(
  () => import('@/pages/inventory/services/DetailServicePage')
);

const FinancesPage = lazy(
  () => import('@/pages/inventory/finances/CoefficientPage')
);
const PermissionsPage = lazy(
  () => import('@/pages/inventory/permissions/PermissionsPage')
);
const SystemPage = lazy(() => import('@/pages/inventory/system/SystemPage'));

const ChatPage = lazy(() => import('@/pages/inventory/chat/ChatPage'));

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
          <Route
            path="/customers/detail/:id"
            element={
              <RouteGuard module="customers">
                <DetailCustomerPage />
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
          <Route
            path="/maids/detail/:id"
            element={
              <RouteGuard module="helpers">
                <DetailMaidPage />
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
          <Route
            path="/staffs/edit/:id"
            element={
              <RouteGuard module="staffs">
                <EditStaffPage />
              </RouteGuard>
            }
          />
          <Route
            path="/staffs/detail/:id"
            element={
              <RouteGuard module="staffs">
                <DetailStaffPage />
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
          <Route
            path="/services/add"
            element={
              <RouteGuard module="services">
                <AddServicePage />
              </RouteGuard>
            }
          />
          <Route
            path="/services/edit/:id"
            element={
              <RouteGuard module="services">
                <EditServicePage />
              </RouteGuard>
            }
          />
          <Route
            path="/services/detail/:id"
            element={
              <RouteGuard module="services">
                <DetailServicePage />
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

          <Route path="/messages" element={<ChatPage />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
