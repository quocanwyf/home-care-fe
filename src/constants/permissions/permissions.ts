export const PERMISSION_MODULES = {
  staffs: 'Nhân viên',
  customers: 'Khách hàng',
  services: 'Dịch vụ',
  helpers: 'Người giúp việc',
  blogs: 'Blog',
  costCoefficients: 'Hệ số chi phí',
  policies: 'Chính sách',
  generalSetting: 'Cài đặt chung',
  roles: 'Phân quyền',
  dashboard: 'Thống kê',
};

export const PERMISSION_ACTIONS = {
  view: 'Xem',
  create: 'Tạo mới',
  edit: 'Chỉnh sửa',
  delete: 'Xóa',
};

export const parsePermission = (permission: string) => {
  const [module, action] = permission.split('_');
  return {
    module:
      PERMISSION_MODULES[module as keyof typeof PERMISSION_MODULES] || module,
    action:
      PERMISSION_ACTIONS[action as keyof typeof PERMISSION_ACTIONS] || action,
    fullName: permission,
  };
};
