import { Fragment, useEffect, useState } from 'react';

import { Check, Edit, Trash2, X } from 'lucide-react';

import { PermissionToggleCheckbox } from '@/components/common/checkbox/PermissionToggleCheckbox';
import ConfirmDialog from '@/components/common/float-display/ConfirmDialog';
import { RolePermissionModal } from '@/components/common/float-display/RolePermissionModal';
import TooltipInfo from '@/components/common/primitives/TooltipInfo';
import FailLoadingAndEntry from '@/components/fallback/FailLoadingAndEntry';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import PageHeader from '@/components/table/app-table/PageHeader';
import { ModuleExpansionHeader } from '@/components/table/permissions-table/ModuleExpansionHeader';
import { Button } from '@/components/ui/button';
import {
  useCreateRole,
  useDeleteRole,
  useGetPermissions,
  useGetRoleDetail,
  useGetRoles,
  useUpdatePermissions,
  useUpdateRole,
} from '@/hooks/api/usePermissions.api';
import { useConfirmation } from '@/hooks/common/useConfirmation';

interface Permission {
  id: string;
  module: string;
  action: string;
  permissionKey: string;
  hasPermission: boolean;
  description: string;
}

interface Role {
  _id: string;
  title: string;
  permissions?: string[]; // Make optional since rolesData doesn't have permissions
  description?: string;
}

interface RoleWithPermissions {
  _id: string;
  title: string;
  permissions: string[];
  description?: string;
}

const PermissionsPage = () => {
  const { data: rolesData } = useGetRoles(); // Data nhóm quyền (Admin, Staff,...) - no permissions
  const { data: permissionsData } = useGetPermissions(); // Data quyền chi tiết - has permissions
  const [editingRoleId, setEditingRoleId] = useState<string | undefined>(
    undefined
  );
  const { mutate: updatePermissions, isPending: isUpdating } =
    useUpdatePermissions();
  const { mutate: deleteRole, isPending: isDeletingRole } = useDeleteRole(); // ✅ Add delete role hook
  const { mutate: createRole, isPending: isCreatingRole } = useCreateRole(); // ✅ Hook tạo role
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateRole(); // ✅ Hook update role
  const {
    data: roleDetailData,
    isLoading: isLoadingRoleDetail,
    error: roleDetailError,
  } = useGetRoleDetail(editingRoleId);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(
    null
  );

  const [originalRolePermissions, setOriginalRolePermissions] = useState<
    Record<string, string[]>
  >({});

  const getAllPossiblePermissions = (): Permission[] => {
    const allPermissions = [
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

      // Blogs
      {
        module: 'Blogs',
        action: 'view',
        permissionKey: 'blogs_view',
        description: 'Xem danh sách blog',
      },
      {
        module: 'Blogs',
        action: 'create',
        permissionKey: 'blogs_create',
        description: 'Tạo blog mới',
      },
      {
        module: 'Blogs',
        action: 'edit',
        permissionKey: 'blogs_edit',
        description: 'Chỉnh sửa blog',
      },
      {
        module: 'Blogs',
        action: 'delete',
        permissionKey: 'blogs_delete',
        description: 'Xóa blog',
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

      // Policies
      {
        module: 'Policies',
        action: 'view',
        permissionKey: 'policies_view',
        description: 'Xem chính sách',
      },
      {
        module: 'Policies',
        action: 'create',
        permissionKey: 'policies_create',
        description: 'Tạo chính sách mới',
      },
      {
        module: 'Policies',
        action: 'edit',
        permissionKey: 'policies_edit',
        description: 'Chỉnh sửa chính sách',
      },
      {
        module: 'Policies',
        action: 'delete',
        permissionKey: 'policies_delete',
        description: 'Xóa chính sách',
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

  const [permissions, setPermissions] = useState<Permission[]>(
    getAllPossiblePermissions()
  );

  const [rolePermissions, setRolePermissions] = useState<
    Record<string, string[]>
  >({});

  const [expandedModules, setExpandedModules] = useState<string[]>([
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
  ]);

  const roleDeleteConfirmation = useConfirmation({
    deleteFunction: (roleId: string) => deleteRole(roleId),
    entityName: 'Role',
    onDeleteSuccess: () => {
      // Optional: Add any additional cleanup after successful delete
      console.log('Role deleted successfully!');
    },
    successMessage: 'Role deleted successfully!',
    errorMessage: 'Failed to delete role!',
  });

  useEffect(() => {
    if (permissionsData?.records) {
      const initialRolePermissions: Record<string, string[]> = {};
      permissionsData.records.forEach((role) => {
        initialRolePermissions[role._id] = [...role.permissions];
      });
      setRolePermissions(initialRolePermissions);
      setOriginalRolePermissions(initialRolePermissions);
    }
  }, [permissionsData]);

  useEffect(() => {
    if (roleDetailData?.record && editingRoleId) {
      console.log('Role detail loaded:', roleDetailData.record);

      // ✅ Set selected role với data từ API
      setSelectedRole({
        _id: roleDetailData.record._id,
        title: roleDetailData.record.title,
        description: roleDetailData.record.description,
        permissions: roleDetailData.record.permissions || [],
      });

      // ✅ Mở modal
      setOpen(true);

      // ✅ Reset editingRoleId
      setEditingRoleId(undefined);
    }
  }, [roleDetailData, editingRoleId]);

  // ✅ Handle error khi load role detail
  useEffect(() => {
    if (roleDetailError && editingRoleId) {
      console.error('Failed to load role detail:', roleDetailError);
      setEditingRoleId(undefined);
      // Có thể show toast error ở đây
    }
  }, [roleDetailError, editingRoleId]);

  const hasChanges = (): boolean => {
    // So sánh rolePermissions hiện tại với originalRolePermissions
    const currentRoleIds = Object.keys(rolePermissions);
    const originalRoleIds = Object.keys(originalRolePermissions);

    // Kiểm tra số lượng roles
    if (currentRoleIds.length !== originalRoleIds.length) return true;

    // Kiểm tra từng role
    for (const roleId of currentRoleIds) {
      const currentPerms = rolePermissions[roleId] || [];
      const originalPerms = originalRolePermissions[roleId] || [];

      // So sánh length trước
      if (currentPerms.length !== originalPerms.length) return true;

      // So sánh từng permission
      const currentSorted = [...currentPerms].sort();
      const originalSorted = [...originalPerms].sort();

      for (let i = 0; i < currentSorted.length; i++) {
        if (currentSorted[i] !== originalSorted[i]) return true;
      }
    }

    return false;
  };

  const handleEditRole = (role: Role) => {
    console.log('Editing role:', role);
    setEditingRoleId(role._id); // ✅ Set roleId để trigger useGetRoleDetail
  };

  const handleDeleteRole = (role: Role) => {
    // ✅ Find role data để pass vào confirmation dialog
    roleDeleteConfirmation.openDeleteConfirmation(role._id, {
      roleTitle: role.title,
      roleDescription: role.description || 'No description',
      roleId: role._id,
    });
  };

  const handleUpdateChanges = async () => {
    try {
      console.log('Updating permissions:', rolePermissions);

      const permissionsArray = Object.entries(rolePermissions).map(
        ([roleId, permissions]) => ({
          id: roleId,
          permissions: permissions,
        })
      );

      // ✅ Call API thông qua hook
      updatePermissions(
        { permissions: permissionsArray }, // payload
        {
          onSuccess: () => {
            // ✅ Update originalRolePermissions sau khi save thành công
            setOriginalRolePermissions({ ...rolePermissions });
            console.log('Permissions updated successfully!');
          },
          onError: (error) => {
            console.error('Failed to update permissions:', error);
          },
        }
      );
    } catch (error) {
      console.error('Failed to update permissions:', error);
    }
  };

  //   Function để handle cancel changes
  const handleCancelChanges = () => {
    // Reset lại permissions về trạng thái ban đầu
    setRolePermissions({ ...originalRolePermissions });
    console.log('Changes cancelled');
  };

  // Toggle module expansion
  const toggleModuleExpansion = (moduleName: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleName)
        ? prev.filter((name) => name !== moduleName)
        : [...prev, moduleName]
    );
  };

  // Group permissions by module
  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  // Get unique modules
  const modules = Object.keys(groupedPermissions);

  // Find role permissions from permissionsData by matching _id
  const getRolePermissions = (roleId: string): string[] => {
    return rolePermissions[roleId] || [];
  };

  // Get role permission count for each module
  const getRolePermissionCount = (
    roleId: string,
    modulePermissions: Permission[]
  ) => {
    const currentRolePermissions = getRolePermissions(roleId); //   Sử dụng state
    const modulePermissionKeys = modulePermissions.map((p) => p.permissionKey);
    const hasPermissions = currentRolePermissions.filter((p) =>
      modulePermissionKeys.includes(p)
    );
    return `${hasPermissions.length}/${modulePermissionKeys.length}`;
  };

  // Check if role has specific permission
  const roleHasPermission = (
    roleId: string,
    permissionKey: string
  ): boolean => {
    const currentRolePermissions = getRolePermissions(roleId);
    return currentRolePermissions.includes(permissionKey);
  };

  // Handle permission toggle (for future edit functionality)
  const handlePermissionToggle = (roleId: string, permissionKey: string) => {
    const currentRolePermissions = getRolePermissions(roleId);

    const hasPermission = currentRolePermissions.includes(permissionKey);

    let newPermissions: string[];
    if (hasPermission) {
      // Nếu đang có permission thì remove
      newPermissions = currentRolePermissions.filter(
        (p) => p !== permissionKey
      );
    } else {
      // Nếu chưa có thì add
      newPermissions = [...currentRolePermissions, permissionKey];
    }

    setRolePermissions((prev) => ({
      ...prev,
      [roleId]: newPermissions,
    }));
  };

  const handleOpenModal = (role?: Role) => {
    if (role) {
      // Find the role with permissions from permissionsData
      const roleWithPermissions = permissionsData?.records?.find(
        (r) => r._id === role._id
      );

      if (roleWithPermissions) {
        setSelectedRole(roleWithPermissions);
        setPermissions((prev) =>
          prev.map((permission) => ({
            ...permission,
            hasPermission: roleWithPermissions.permissions.includes(
              permission.permissionKey
            ),
          }))
        );
      }
    } else {
      setSelectedRole(null);
      setPermissions(getAllPossiblePermissions());
    }
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedRole(null);
    setEditingRoleId(undefined); // ✅ Reset editing state
  };

  const handleModalSave = (roleData: {
    title: string;
    description: string;
    permissions: string[];
  }) => {
    if (selectedRole) {
      // ✅ Update existing role
      updateRole(
        {
          roleId: selectedRole._id,
          roleData: {
            title: roleData.title,
            description: roleData.description,
          },
        },
        {
          onSuccess: () => {
            setOpen(false);
            setSelectedRole(null);
            console.log('Role updated successfully!');
          },
          onError: (error) => {
            console.error('Failed to update role:', error);
          },
        }
      );
    } else {
      createRole(
        {
          title: roleData.title,
          description: roleData.description,
          permissions: roleData.permissions,
        },
        {
          onSuccess: () => {
            setOpen(false);
            setSelectedRole(null);
            console.log('Role created successfully!');
          },
          onError: (error) => {
            console.error('Failed to create role:', error);
          },
        }
      );
    }
  };

  const showUpdateButtons = hasChanges();

  if (isLoadingRoleDetail) {
    return <LoadingFallback content="Loading role information..." />;
  }

  //  Show error state
  if (roleDetailError && !roleDetailData) {
    return <FailLoadingAndEntry content="Failed to load role information" />;
  }

  // If data is still loading
  if (!rolesData || !permissionsData) {
    return <div>Loading...</div>;
  }

  const isAnyActionLoading =
    isUpdating ||
    isCreatingRole ||
    isUpdatingRole ||
    isDeletingRole ||
    isLoadingRoleDetail;

  return (
    <div className="h-full w-full rounded-xl bg-white px-6">
      {/* <div className="mb-6 flex items-center justify-between">
        <h2 className="text-md text-overlay-slider font-semibold">
          Management Permissions
        </h2>
        <Button onClick={() => handleOpenModal()}>New Group</Button>
      </div> */}
      <div className="sticky top-0 z-10 rounded-full border-b bg-white px-2 pl-8">
        <PageHeader
          pageHeaderTitle="Management Permissions"
          handleClick={handleOpenModal}
          showAddButton={!showUpdateButtons}
        >
          {showUpdateButtons && (
            <div className="flex gap-4">
              <TooltipInfo content="Update changes" side="bottom">
                <Button
                  onClick={handleUpdateChanges}
                  disabled={isUpdating}
                  className="cursor-pointer rounded-xl px-3 py-1 transition duration-500 ease-in-out hover:scale-105"
                >
                  <div className="">Update</div>
                  <Check className="h-4 w-4" />
                </Button>
              </TooltipInfo>
              <TooltipInfo content="Cancel changes" side="bottom">
                <Button
                  onClick={handleCancelChanges}
                  disabled={isUpdating}
                  className="bg-text-destructive hover:bg-text-destructive cursor-pointer rounded-xl px-3 py-1 transition duration-500 ease-in-out hover:scale-105"
                >
                  <div className="">Cancel</div>
                  <X className="h-4 w-4" />
                </Button>
              </TooltipInfo>
            </div>
          )}
        </PageHeader>
      </div>

      {/* Main Permissions Table */}
      <div className="max-mobile:pb-8 max-h-[82%] overflow-auto rounded-lg pb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="min-w-[250px] p-4 text-left text-sm font-semibold text-gray-600">
                  Module / Action
                </th>
                {rolesData?.records?.map((role: Role) => (
                  <th
                    key={role._id}
                    className="min-w-[200px] p-4 text-center font-medium text-gray-600"
                  >
                    <div className="text-center">
                      <div className="text-sm font-semibold">{role.title}</div>
                      <div className="mt-2 flex justify-center space-x-1">
                        <TooltipInfo content="Edit">
                          <button
                            onClick={() => handleEditRole(role)} // ✅ Click handler
                            disabled={isLoadingRoleDetail} // ✅ Disable khi đang load
                            className="cursor-pointer p-1 text-blue-400 transition-colors hover:text-blue-600"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                        </TooltipInfo>
                        <TooltipInfo content="Delete">
                          <button
                            onClick={() => handleDeleteRole(role)}
                            disabled={isAnyActionLoading}
                            className="cursor-pointer p-1 text-red-400 transition-colors hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </TooltipInfo>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {modules.map((module) => {
                const modulePermissions = groupedPermissions[module];
                const isExpanded = expandedModules.includes(module);

                return (
                  <Fragment key={module}>
                    {/* Module Header Row */}
                    <tr className="border-b bg-gray-50">
                      <td className="p-0">
                        <ModuleExpansionHeader
                          moduleName={module}
                          isExpanded={isExpanded}
                          onToggleExpand={() => toggleModuleExpansion(module)}
                        />
                      </td>
                      {rolesData?.records?.map((role: Role) => (
                        <td
                          key={role._id}
                          className="p-4 text-center text-sm text-gray-600"
                        >
                          {getRolePermissionCount(role._id, modulePermissions)}
                        </td>
                      ))}
                    </tr>

                    {/* Permission Rows */}
                    {isExpanded &&
                      modulePermissions.map((permission) => (
                        <tr
                          key={permission.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-2 pl-12">
                            <div>
                              <div className="text-sm font-medium capitalize">
                                {permission.action}
                              </div>
                              <div className="text-xs text-gray-500">
                                {permission.description}
                              </div>
                            </div>
                          </td>
                          {rolesData?.records?.map((role: Role) => (
                            <td
                              key={role._id}
                              className="p-4 text-center text-sm text-gray-600"
                            >
                              <div className="flex items-center justify-center">
                                <PermissionToggleCheckbox
                                  isChecked={roleHasPermission(
                                    role._id,
                                    permission.permissionKey
                                  )}
                                  onToggle={() =>
                                    handlePermissionToggle(
                                      role._id,
                                      permission.permissionKey
                                    )
                                  }
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog
        open={roleDeleteConfirmation.isDialogOpen}
        onOpenChange={roleDeleteConfirmation.closeDeleteConfirmation}
        title="Delete Role"
        description={roleDeleteConfirmation
          .getDeleteDescription()
          .replace(
            'delete this Role',
            `delete role "${roleDeleteConfirmation.entityData?.roleTitle || 'this role'}"`
          )}
        icon={true}
        danger={true}
        confirmText="Delete Role"
        cancelText="Cancel"
        onConfirm={roleDeleteConfirmation.handleDeleteConfirm}
      >
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <strong>Role:</strong>{' '}
            {roleDeleteConfirmation.entityData?.roleTitle}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Description:</strong>{' '}
            {roleDeleteConfirmation.entityData?.roleDescription}
          </div>
          <div className="text-sm font-medium text-red-600">
            This action cannot be undone. All users with this role will lose
            their permissions.
          </div>
        </div>
      </ConfirmDialog>
      {/* Modal for Add/Edit Role */}
      <RolePermissionModal
        isOpen={open}
        onClose={handleCloseModal}
        selectedRole={selectedRole}
        allPermissions={getAllPossiblePermissions()}
        onSave={handleModalSave}
        isLoading={isCreatingRole || isUpdatingRole}
      />
    </div>
  );
};

export default PermissionsPage;
