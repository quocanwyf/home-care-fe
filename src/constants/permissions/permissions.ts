import type { Permission } from '@/types/table/objects/permissions';

export const getAllPossiblePermissions = (): Permission[] => {
  const allPermissions = [
    //Orders
    {
      module: 'Orders',
      action: 'view',
      permissionKey: 'orders_view',
      description: 'Xem danh sách đơn hàng',
    },
    {
      module: 'Orders',
      action: 'create',
      permissionKey: 'orders_create',
      description: 'Tạo đơn hàng mới',
    },
    {
      module: 'Orders',
      action: 'edit',
      permissionKey: 'orders_edit',
      description: 'Chỉnh sửa đơn hàng',
    },
    // Staffs
    {
      module: 'Staffs',
      action: 'view',
      permissionKey: 'staffs_view',
      description: 'Xem danh sách nhân viên',
    },
    {
      module: 'Staffs',
      action: 'create',
      permissionKey: 'staffs_create',
      description: 'Tạo nhân viên mới',
    },
    {
      module: 'Staffs',
      action: 'edit',
      permissionKey: 'staffs_edit',
      description: 'Chỉnh sửa nhân viên',
    },
    {
      module: 'Staffs',
      action: 'delete',
      permissionKey: 'staffs_delete',
      description: 'Xóa nhân viên',
    },

    // Helpers
    {
      module: 'Helpers',
      action: 'view',
      permissionKey: 'helpers_view',
      description: 'Xem danh sách helper',
    },
    {
      module: 'Helpers',
      action: 'create',
      permissionKey: 'helpers_create',
      description: 'Tạo helper mới',
    },
    {
      module: 'Helpers',
      action: 'edit',
      permissionKey: 'helpers_edit',
      description: 'Chỉnh sửa helper',
    },
    {
      module: 'Helpers',
      action: 'delete',
      permissionKey: 'helpers_delete',
      description: 'Xóa helper',
    },

    // Customers
    {
      module: 'Customers',
      action: 'view',
      permissionKey: 'customers_view',
      description: 'Xem danh sách khách hàng',
    },
    {
      module: 'Customers',
      action: 'create',
      permissionKey: 'customers_create',
      description: 'Tạo khách hàng mới',
    },
    {
      module: 'Customers',
      action: 'edit',
      permissionKey: 'customers_edit',
      description: 'Chỉnh sửa khách hàng',
    },
    {
      module: 'Customers',
      action: 'delete',
      permissionKey: 'customers_delete',
      description: 'Xóa khách hàng',
    },

    // Services
    {
      module: 'Services',
      action: 'view',
      permissionKey: 'services_view',
      description: 'Xem danh sách dịch vụ',
    },
    {
      module: 'Services',
      action: 'create',
      permissionKey: 'services_create',
      description: 'Tạo dịch vụ mới',
    },
    {
      module: 'Services',
      action: 'edit',
      permissionKey: 'services_edit',
      description: 'Chỉnh sửa dịch vụ',
    },
    {
      module: 'Services',
      action: 'delete',
      permissionKey: 'services_delete',
      description: 'Xóa dịch vụ',
    },

    // Cost Coefficients
    {
      module: 'Cost Coefficients',
      action: 'view',
      permissionKey: 'costCoefficients_view',
      description: 'Xem hệ số chi phí',
    },
    {
      module: 'Cost Coefficients',
      action: 'create',
      permissionKey: 'costCoefficients_create',
      description: 'Tạo hệ số chi phí',
    },
    {
      module: 'Cost Coefficients',
      action: 'edit',
      permissionKey: 'costCoefficients_edit',
      description: 'Chỉnh sửa hệ số chi phí',
    },
    {
      module: 'Cost Coefficients',
      action: 'delete',
      permissionKey: 'costCoefficients_delete',
      description: 'Xóa hệ số chi phí',
    },

    // General Settings
    {
      module: 'General Settings',
      action: 'view',
      permissionKey: 'generalSetting_view',
      description: 'Xem cài đặt chung',
    },
    {
      module: 'General Settings',
      action: 'edit',
      permissionKey: 'generalSetting_edit',
      description: 'Chỉnh sửa cài đặt chung',
    },

    // Roles
    {
      module: 'Roles',
      action: 'view',
      permissionKey: 'roles_view',
      description: 'Xem danh sách vai trò',
    },
    {
      module: 'Roles',
      action: 'create',
      permissionKey: 'roles_create',
      description: 'Tạo vai trò mới',
    },
    {
      module: 'Roles',
      action: 'edit',
      permissionKey: 'roles_edit',
      description: 'Chỉnh sửa vai trò',
    },
    {
      module: 'Roles',
      action: 'delete',
      permissionKey: 'roles_delete',
      description: 'Xóa vai trò',
    },

    // Dashboard
    {
      module: 'Dashboard',
      action: 'view',
      permissionKey: 'dashboard_view',
      description: 'Xem dashboard',
    },
  ];

  return allPermissions.map((permission, index) => ({
    id: (index + 1).toString(),
    ...permission,
    hasPermission: false,
  }));
};

export const DEFAULT_EXPANDED_MODULES = [
  'Staffs',
  'Helpers',
  'Customers',
  'Services',
  'Blogs',
  'Cost Coefficients',
  'Policies',
  'General Settings',
  'Roles',
  'Dashboard',
];

// Permission Modules
export const PERMISSION_MODULES = {
  DASHBOARD: 'dashboard',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  HELPERS: 'helpers', // maids
  STAFFS: 'staffs',
  SERVICES: 'services',
  COST_COEFFICIENTS: 'costCoefficients',
  ROLES: 'roles', // permissions page
  GENERAL_SETTING: 'generalSetting', // system page
} as const;

// Permission Actions
export const PERMISSION_ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
} as const;

// Route to Permission Mapping
export const ROUTE_PERMISSIONS = {
  '/dashboard': 'dashboard_view',
  '/orders': 'orders_view',
  '/customers': 'customers_view',
  '/maids': 'helpers_view',
  '/staffs': 'staffs_view',
  '/services': 'services_view',
  '/cost-coefficients': 'costCoefficients_view',
  '/permissions': 'roles_view',
  '/system': 'generalSetting_view',
} as const;

// Các routes con cũng cần permission của parent
export const getRequiredPermission = (path: string): string | null => {
  // Exact match trước
  if (ROUTE_PERMISSIONS[path as keyof typeof ROUTE_PERMISSIONS]) {
    return ROUTE_PERMISSIONS[path as keyof typeof ROUTE_PERMISSIONS];
  }

  // Check parent routes cho nested paths
  if (path.startsWith('/orders')) return 'orders_view';
  if (path.startsWith('/customers')) return 'customers_view';
  if (path.startsWith('/maids')) return 'helpers_view';
  if (path.startsWith('/staffs')) return 'staffs_view';
  if (path.startsWith('/services')) return 'services_view';
  if (path.startsWith('/cost-coefficients')) return 'costCoefficients_view';
  if (path.startsWith('/permissions')) return 'roles_view';
  if (path.startsWith('/system')) return 'generalSetting_view';

  return null;
};
