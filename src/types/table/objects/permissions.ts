export interface Permission {
  id: string;
  module: string;
  action: string;
  permissionKey: string;
  hasPermission: boolean;
  description: string;
}

export interface Role {
  _id: string;
  title: string;
  permissions?: string[];
  description?: string;
}

export interface PermissionTableData {
  modules: { [key: string]: Permission[] };
  roles: Role[];
  expandedModules: { [key: string]: boolean };
}

export interface RoleFormData {
  title: string;
  description: string;
  permissions: string[];
}

export interface PermissionToggleProps {
  role: Role;
  permission: Permission;
  onToggle: (roleId: string, permissionId: string) => void;
}

export interface RoleWithPermissions {
  _id: string;
  title: string;
  permissions: string[];
  description?: string;
}
