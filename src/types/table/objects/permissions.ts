export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
}

export interface Role {
  _id: string;
  title: string;
  description: string;
  permissions?: string[];
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
