import type {
  ApiSuccessResponse,
  CreateRoleRequest,
  PermissionsResponse,
  RoleDetailResponse,
  RolesResponse,
  UpdatePermissionsRequest,
  UpdateRoleRequest,
} from '@/types/params/permission-params';

//  Lấy quyền - GET /admin/roles/permissions
export const getPermissionsApi = async (
  signal?: AbortSignal
): Promise<PermissionsResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/roles/permissions`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch permissions: ${response.status}`);
    }

    const data: PermissionsResponse = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching permissions:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    throw new Error('Server error');
  }
};

//  Cập nhật quyền - PATCH /admin/roles/permissions
export const updatePermissionsApi = async (
  permissions: UpdatePermissionsRequest,
  signal?: AbortSignal
): Promise<ApiSuccessResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/roles/permissions`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(permissions),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to update permissions: ${response.status}`);
    }

    const data: ApiSuccessResponse = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error updating permissions:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    throw new Error('Server error');
  }
};

//   Lấy danh sách nhóm quyền - GET /admin/roles
export const getRolesApi = async (
  signal?: AbortSignal
): Promise<RolesResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/roles`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.status}`);
    }

    const data: RolesResponse = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching roles:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    throw new Error('Server error');
  }
};

//   Thêm nhóm quyền - POST /admin/roles/create
export const createRoleApi = async (
  roleData: CreateRoleRequest,
  signal?: AbortSignal
): Promise<ApiSuccessResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/roles/create`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(roleData),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to create role: ${response.status}`);
    }

    const data: ApiSuccessResponse = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error creating role:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    throw new Error('Server error');
  }
};

// .lấy thông tin để sửa nhóm quyền - GET /admin/roles/edit/:id
export const getRoleDetailApi = async (
  roleId: string,
  signal?: AbortSignal
): Promise<RoleDetailResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/roles/edit/${roleId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Role not found');
      }
      throw new Error(`Failed to fetch role detail: ${response.status}`);
    }

    const data: RoleDetailResponse = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching role detail:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    if (error.message === 'Role not found') {
      throw error;
    }

    throw new Error('Server error');
  }
};

//  Cập nhật thông tin nhóm quyền - PATCH /admin/roles/edit/:id
export const updateRoleApi = async (
  roleId: string,
  roleData: UpdateRoleRequest,
  signal?: AbortSignal
): Promise<ApiSuccessResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/roles/edit/${roleId}`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(roleData),
      signal,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Role not found');
      }
      throw new Error(`Failed to update role: ${response.status}`);
    }

    const data: ApiSuccessResponse = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error updating role:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    if (error.message === 'Role not found') {
      throw error;
    }

    throw new Error('Server error');
  }
};

//    DELETE /admin/roles/delete/:id
export const deleteRoleApi = async (
  roleId: string,
  signal?: AbortSignal
): Promise<ApiSuccessResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/roles/delete/${roleId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Role not found');
      }
      throw new Error(`Failed to delete role: ${response.status}`);
    }

    const data: ApiSuccessResponse = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error deleting role:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }

    if (error.message === 'Role not found') {
      throw error;
    }

    throw new Error('Server error');
  }
};
