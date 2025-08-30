import type { PermissionModule } from '@/types/auth';

export interface MenuItem {
  label: string;
  icon?: string;
  path: string;
  permissionModule?: PermissionModule; // Permission cần thiết để hiển thị
  children?: MenuItem[];
}

export const MENU_ITEMS = [
  {
    label: 'Dashboard',
    icon: '/icon-image/chart-column-decreasing.png',
    path: '/dashboard',
    permissionModule: 'dashboard',
  },
  {
    label: 'Orders',
    icon: '/icon-image/scroll-text.png',
    path: '/orders',
    permissionModule: 'orders',
  },
  {
    label: 'Human Resources',
    path: '/hr',
    children: [
      {
        label: 'Maids',
        icon: '/icon-image/user.png',
        path: '/maids',
        permissionModule: 'helpers',
      },
      {
        label: 'Staffs',
        icon: '/icon-image/users.png',
        path: '/staffs',
        permissionModule: 'staffs',
      },
      {
        label: 'Customers',
        icon: '/icon-image/users-round.png',
        path: '/customers',
        permissionModule: 'customers',
      },
    ],
  },
  {
    label: 'Inventory',
    path: '/inventory',
    children: [
      {
        label: 'Services',
        icon: 'icon-image/card-sim.png',
        path: '/services',
        permissionModule: 'services',
      },
      {
        label: 'Cost Coefficients',
        icon: 'icon-image/hand-coins.png',
        path: '/cost-coefficients',
        permissionModule: 'costCoefficients',
      },
      {
        key: 'permissions',
        label: 'Permissions',
        icon: '/icon-image/clipboard-check.png',
        path: '/permissions',
        permissionModule: 'roles',
      },
      {
        label: 'System',
        icon: 'icon-image/settings.png',
        path: '/system',
        permissionModule: 'generalSetting',
      },
    ],
  },
  {
    label: 'Log out',
    path: '/logout',
    icon: '/icon-image/log-out.png',
  },
];
