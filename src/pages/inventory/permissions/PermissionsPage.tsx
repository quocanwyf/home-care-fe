import { useEffect, useState } from 'react';

import RoleFormModal from '@/components/common/float-display/RoleFormModal';
import FailLoadingAndEntry from '@/components/fallback/FailLoadingAndEntry';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import PermissionsTable from '@/components/table/permissions/PermissionsTable';
import {
  useCreateRole,
  useDeleteRole,
  useGetPermissions,
  useGetRoleDetail,
  useGetRoles,
  useUpdatePermissions,
  useUpdateRole,
} from '@/hooks/api/usePermissions.api';
import type { Role, RoleFormData } from '@/types/table/objects/permissions';

// Mock permissions data - thay thế bằng API call thực
const mockPermissions = [
  {
    id: '1',
    name: 'orders.view',
    description: 'Xem danh sách đơn hàng',
    module: 'Orders',
    action: 'view',
  },
  {
    id: '2',
    name: 'orders.manage',
    description: 'Quản lý đơn hàng',
    module: 'Orders',
    action: 'manage',
  },
  {
    id: '3',
    name: 'product.view',
    description: 'Xem danh sách sản phẩm',
    module: 'Product',
    action: 'view',
  },
  {
    id: '4',
    name: 'product.edit',
    description: 'Chỉnh sửa sản phẩm',
    module: 'Product',
    action: 'edit',
  },
  {
    id: '5',
    name: 'users.view',
    description: 'Xem danh sách người dùng',
    module: 'Users',
    action: 'view',
  },
  {
    id: '6',
    name: 'users.manage',
    description: 'Quản lý người dùng',
    module: 'Users',
    action: 'manage',
  },
];

const PermissionsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    title: '',
    description: '',
    permissions: [],
  });
  const [expandedModules, setExpandedModules] = useState<{
    [key: string]: boolean;
  }>({});

  // API Hooks
  const {
    data: permissionsData,
    isLoading,
    isError,
    error,
  } = useGetPermissions();
  console.log('1PermissionData', permissionsData);
  const { data: rolesData } = useGetRoles();
  console.log('2RolesData', rolesData);
  const { data: roleDetailData } = useGetRoleDetail();
  console.log('3RoleDetailData', roleDetailData);

  const updatePermissionsMutation = useUpdatePermissions();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  const roles = permissionsData?.records || [];
  const permissions = mockPermissions; // Thay thế bằng API call thực

  // Initialize expanded modules
  useEffect(() => {
    const allModules = [...new Set(permissions.map((p) => p.module))];
    const initialExpanded: { [key: string]: boolean } = {};
    allModules.forEach((module) => {
      initialExpanded[module] = true;
    });
    setExpandedModules(initialExpanded);
  }, [permissions]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      permissions: [],
    });
  };

  const handleCreateRole = () => {
    resetForm();
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (roleId: string) => {
    const roleToEdit = roles.find((role) => role._id === roleId);
    if (roleToEdit) {
      setEditingRole(roleToEdit);
      setFormData({
        title: roleToEdit.title,
        description: roleToEdit.description,
        permissions: roleToEdit.permissions || [],
      });
      setIsModalOpen(true);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa nhóm quyền này?')) {
      deleteRoleMutation.mutate(roleId);
    }
  };

  const handleSubmitRole = () => {
    if (editingRole) {
      updateRoleMutation.mutate(
        {
          roleId: editingRole._id,
          roleData: {
            title: formData.title,
            description: formData.description,
          },
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingRole(null);
            resetForm();
          },
        }
      );
    } else {
      createRoleMutation.mutate(
        {
          title: formData.title,
          description: formData.description,
          permissions: formData.permissions,
          deleted: false,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            resetForm();
          },
        }
      );
    }
  };

  const handleTogglePermission = (roleId: string, permissionId: string) => {
    const role = roles.find((r) => r._id === roleId);
    if (!role) return;

    const currentPermissions = role.permissions || [];
    const hasPermission = currentPermissions.includes(permissionId);
    const newPermissions = hasPermission
      ? currentPermissions.filter((id) => id !== permissionId)
      : [...currentPermissions, permissionId];

    updatePermissionsMutation.mutate({
      permissions: [{ id: roleId, permissions: newPermissions }],
    });
  };

  const handleToggleModule = (module: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const handleFormChange = (data: Partial<RoleFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  if (isLoading) {
    return <LoadingFallback content="Đang tải thông tin phân quyền..." />;
  }

  if (isError && error) {
    return <FailLoadingAndEntry content="Không thể tải thông tin phân quyền" />;
  }

  return (
    <div className="bg-pink-25 min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <PermissionsTable
          roles={roles}
          permissions={permissions}
          expandedModules={expandedModules}
          onToggleModule={handleToggleModule}
          onTogglePermission={handleTogglePermission}
          onCreateRole={handleCreateRole}
          onEditRole={handleEditRole}
          onDeleteRole={handleDeleteRole}
        />

        <RoleFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingRole(null);
            resetForm();
          }}
          formData={formData}
          onFormChange={handleFormChange}
          permissions={permissions}
          onSubmit={handleSubmitRole}
          isEditing={!!editingRole}
          isLoading={
            createRoleMutation.isPending || updateRoleMutation.isPending
          }
        />
      </div>
    </div>
  );
};

export default PermissionsPage;
