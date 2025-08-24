import {
  createRoleApi,
  deleteRoleApi,
  getPermissionsApi,
  getRoleDetailApi,
  getRolesApi,
  updatePermissionsApi,
  updateRoleApi,
} from '@/apis/permissions.api';
import type {
  ApiSuccessResponse,
  CreateRoleRequest,
  PermissionsResponse,
  RoleDetailResponse,
  RolesResponse,
  UpdatePermissionsRequest,
  UpdateRoleRequest,
} from '@/types/params/permission-params';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToast } from '../common/useToast';

//  1. Hook lấy quyền (permissions với roles)
export const useGetPermissions = () => {
  return useQuery<PermissionsResponse, Error>({
    queryKey: ['permissions'],
    queryFn: ({ signal }) => getPermissionsApi(signal),
    staleTime: 10 * 60 * 1000, // 10 minutes - stable data
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

//   Hook cập nhật quyền (toggle permissions)
export const useUpdatePermissions = () => {
  const { showError, showSuccess } = useToast();
  const queryClient = useQueryClient();

  return useMutation<ApiSuccessResponse, Error, UpdatePermissionsRequest>({
    mutationFn: (permissions: UpdatePermissionsRequest) =>
      updatePermissionsApi(permissions),

    onSuccess: () => {
      showSuccess('Permissions updated successfully!');
      //   Invalidate permissions cache để refresh data
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },

    onError: (error) => {
      let errorMessage = 'An error occurred while updating permissions';

      if (error.message === 'Server error') {
        errorMessage = 'Server error occurred';
      }

      showError('Error updating permissions: ' + errorMessage);
    },
  });
};

//   3. Hook lấy danh sách roles (basic info)
export const useGetRoles = () => {
  return useQuery<RolesResponse, Error>({
    queryKey: ['roles'],
    queryFn: ({ signal }) => getRolesApi(signal),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });
};

//   4. Hook thêm role mới
export const useCreateRole = () => {
  const { showError, showSuccess } = useToast();
  const queryClient = useQueryClient();

  return useMutation<ApiSuccessResponse, Error, CreateRoleRequest>({
    mutationFn: (roleData: CreateRoleRequest) => createRoleApi(roleData),

    onSuccess: () => {
      showSuccess('Role created successfully!');
      //   Invalidate both roles and permissions cache
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },

    onError: (error) => {
      let errorMessage = 'An error occurred while creating role';

      if (error.message === 'Server error') {
        errorMessage = 'Server error occurred';
      }

      showError('Error creating role: ' + errorMessage);
    },
  });
};

//   5. Hook lấy chi tiết role để edit
export const useGetRoleDetail = (roleId: string | undefined) => {
  return useQuery<RoleDetailResponse, Error>({
    queryKey: ['role-detail', roleId],
    queryFn: ({ signal }) => {
      if (!roleId) {
        throw new Error('Role ID is required');
      }
      return getRoleDetailApi(roleId, signal);
    },
    enabled: !!roleId, // ✅ Only run query if roleId exists
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      //   Don't retry for 404 errors
      if (error.message === 'Role not found') {
        return false;
      }
      return failureCount < 2;
    },
  });
};

//   6. Hook cập nhật role
export const useUpdateRole = () => {
  const { showError, showSuccess } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    ApiSuccessResponse,
    Error,
    { roleId: string; roleData: UpdateRoleRequest }
  >({
    mutationFn: ({ roleId, roleData }) => updateRoleApi(roleId, roleData),

    onSuccess: () => {
      showSuccess('Role updated successfully!');
      //   Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role-detail'] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },

    onError: (error) => {
      let errorMessage = 'An error occurred while updating role';

      if (error.message === 'Role not found') {
        errorMessage = 'Role not found';
      } else if (error.message === 'Server error') {
        errorMessage = 'Server error occurred';
      }

      showError('Error updating role: ' + errorMessage);
    },
  });
};

//   7. Hook xóa role
export const useDeleteRole = () => {
  const { showError, showSuccess } = useToast();
  const queryClient = useQueryClient();

  return useMutation<ApiSuccessResponse, Error, string>({
    mutationFn: (roleId: string) => deleteRoleApi(roleId),

    onSuccess: () => {
      showSuccess('Role deleted successfully!');
      //   Invalidate both roles and permissions cache
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },

    onError: (error) => {
      let errorMessage = 'An error occurred while deleting role';

      if (error.message === 'Role not found') {
        errorMessage = 'Role not found';
      } else if (error.message === 'Server error') {
        errorMessage = 'Server error occurred';
      }

      showError('Error deleting role: ' + errorMessage);
    },
  });
};
