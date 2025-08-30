import { Fragment, useEffect, useState } from 'react';

import { Check, Edit, FileText, Trash2, UserCog, X } from 'lucide-react';

import { PermissionToggleCheckbox } from '@/components/common/checkbox/PermissionToggleCheckbox';
import AppModal from '@/components/common/float-display/AppModal';
import InputLabel from '@/components/common/input/InputLabel';
import TooltipInfo from '@/components/common/primitives/TooltipInfo';
import PageHeader from '@/components/table/app-table/PageHeader';
import { ModuleExpansionHeader } from '@/components/table/permissions-table/ModuleExpansionHeader';
import { Button } from '@/components/ui/button';
import {
  useGetPermissions,
  useGetRoles,
  useUpdatePermissions,
} from '@/hooks/api/usePermissions.api';

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
  const { mutate: updatePermissions, isPending: isUpdating } =
    useUpdatePermissions();

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

  const handleSave = () => {
    // Call API to save/update role permissions here
    setOpen(false);
    setSelectedRole(null);
    setPermissions(getAllPossiblePermissions());
  };

  const handlePermissionToggleInModal = (id: string) => {
    setPermissions((prev) =>
      prev.map((permission) =>
        permission.id === id
          ? { ...permission, hasPermission: !permission.hasPermission }
          : permission
      )
    );
  };

  const showUpdateButtons = hasChanges();

  // If data is still loading
  if (!rolesData || !permissionsData) {
    return <div>Loading...</div>;
  }

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
                      <div className="font-medium">{role.title}</div>
                      <div className="mt-2 flex justify-center space-x-1">
                        <TooltipInfo content="Edit">
                          <button
                            // onClick={() => onUnban(row)}
                            className="cursor-pointer p-1 text-blue-400 transition-colors hover:text-blue-600"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                        </TooltipInfo>
                        <TooltipInfo content="Delete">
                          <button
                            // onClick={() => onUnban(row)}
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

      {/* Modal for Add/Edit Role */}
      <AppModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setSelectedRole(null);
          setPermissions(getAllPossiblePermissions());
        }}
        title={selectedRole ? 'Edit Role' : 'Add New Role'}
        description="Configure permissions for the user group"
        width="max-w-4xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedRole ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Form inputs */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputLabel
              label={{
                labelTitle: 'Role Name',
                icon: <UserCog className="h-3 w-3" />,
              }}
              input={{
                inputId: 'role',
                className: 'w-full',
                inputName: 'role',
                placeholder: 'Enter role name',
                defaultValue: selectedRole?.title || '',
              }}
            />
            <InputLabel
              label={{
                labelTitle: 'Description',
                icon: <FileText className="h-3 w-3" />,
              }}
              input={{
                inputId: 'description',
                className: 'w-full',
                inputName: 'description',
                placeholder: 'Enter description',
                defaultValue: selectedRole?.description || '',
              }}
            />
          </div>

          {/* Permissions table in modal */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Detailed Permissions</h3>
            <div className="max-h-96 overflow-auto rounded border">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-gray-600">
                      MODULE
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-600">
                      ACTION
                    </th>
                    <th className="p-3 text-center text-xs font-medium text-gray-600">
                      PERMISSION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr
                      key={permission.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3 text-sm">{permission.module}</td>
                      <td className="p-3 text-sm">
                        <div>
                          <div className="capitalize">{permission.action}</div>
                          <div className="text-xs text-gray-500">
                            {permission.description}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <PermissionToggleCheckbox
                          isChecked={permission.hasPermission}
                          onToggle={() =>
                            handlePermissionToggleInModal(permission.id)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default PermissionsPage;
