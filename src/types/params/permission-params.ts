import type { Role } from '../table/objects/permissions';

export interface PermissionsResponse {
  success: boolean;
  records: Role[]; // API trả về array of roles với permissions
}

export interface RolesResponse {
  success: boolean;
  records: Array<{
    _id: string;
    title: string;
    description: string;
  }>;
}

export interface RoleDetailResponse {
  success: boolean;
  record: {
    _id: string;
    title: string;
    description: string;
  };
}

export interface CreateRoleRequest {
  title: string;
  description: string;
  permissions: string[];
  deleted: boolean;
}

export interface UpdateRoleRequest {
  title: string;
  description: string;
}

export interface UpdatePermissionsRequest {
  permissions: Array<{
    id: string;
    permissions: string[];
  }>;
}

export interface ApiSuccessResponse {
  success: boolean;
}
