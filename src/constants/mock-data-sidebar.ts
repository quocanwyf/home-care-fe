import path from 'path';

export type MenuItem = {
  label: string;
  path: string;
  icon: string;
  children?: MenuItem[];
};

export const MENU_ITEMS = [
  {
    label: 'Dashboard',
    icon: '/icon-image/chart-column-decreasing.png',
    path: '/',
  },
  {
    label: 'Orders',
    icon: '/icon-image/scroll-text.png',
    path: '/orders',
  },
  {
    label: 'Human Resources',
    path: '/hr',
    children: [
      { label: 'Maids', icon: '/icon-image/user.png', path: '/hr/maids' },
      { label: 'Staffs', icon: '/icon-image/users.png', path: '/hr/staffs' },
      {
        label: 'Customers',
        icon: '/icon-image/users-round.png',
        path: '/hr/customers',
      },
    ],
  },
  {
    label: 'Inventory',
    path: '/inventory',
    children: [
      {
        label: 'Finances',
        icon: 'icon-image/hand-coins.png',
        path: '/finances',
      },
      {
        key: 'permissions',
        label: 'Permissions',
        icon: '/icon-image/clipboard-check.png',
        path: '/permissions',
      },
      { label: 'System', icon: 'icon-image/settings.png', path: '/system' },
    ],
  },
];
