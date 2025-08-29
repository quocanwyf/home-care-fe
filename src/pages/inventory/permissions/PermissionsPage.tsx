import React, { useState } from 'react';

import { Edit, FileText, Trash2, UserCog } from 'lucide-react';

import { PermissionToggleCheckbox } from '@/components/common/checkbox/PermissionToggleCheckbox';
import AppModal from '@/components/common/float-display/AppModal';
import InputLabel from '@/components/common/input/InputLabel';
import { ModuleExpansionHeader } from '@/components/table/permissions-table/ModuleExpansionHeader';
import { Button } from '@/components/ui/button';
import { useGetPermissions, useGetRoles } from '@/hooks/api/usePermissions.api';

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

  console.log('Roles data:', rolesData);
  console.log('Permissions data:', permissionsData);

  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(
    null
  );
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

  // Tạo danh sách tất cả permissions có thể có với mô tả
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
    const roleWithPermissions = permissionsData?.records?.find(
      (r: RoleWithPermissions) => r._id === roleId
    );
    return roleWithPermissions?.permissions || [];
  };

  // Get role permission count for each module
  const getRolePermissionCount = (
    roleId: string,
    modulePermissions: Permission[]
  ) => {
    const rolePermissions = getRolePermissions(roleId);
    const modulePermissionKeys = modulePermissions.map((p) => p.permissionKey);
    const hasPermissions = rolePermissions.filter((p) =>
      modulePermissionKeys.includes(p)
    );
    return `${hasPermissions.length}/${modulePermissionKeys.length}`;
  };

  // Check if role has specific permission
  const roleHasPermission = (
    roleId: string,
    permissionKey: string
  ): boolean => {
    const rolePermissions = getRolePermissions(roleId);
    return rolePermissions.includes(permissionKey);
  };

  // Handle permission toggle (for future edit functionality)
  const handlePermissionToggle = (roleId: string, permissionKey: string) => {
    console.log(`Toggle permission ${permissionKey} for role ${roleId}`);
    // Implement API call to update role permissions here
  };

  const handleOpenModal = (role?: Role) => {
    if (role) {
      // Find the role with permissions from permissionsData
      const roleWithPermissions = permissionsData?.records?.find(
        (r: RoleWithPermissions) => r._id === role._id
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
    const selectedPermissions = permissions
      .filter((p) => p.hasPermission)
      .map((p) => p.permissionKey);

    console.log('Selected permissions:', selectedPermissions);
    console.log('Selected role:', selectedRole);

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

  // If data is still loading
  if (!rolesData || !permissionsData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full rounded-xl bg-white px-6 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-md text-overlay-slider font-semibold">
          Management Permissions
        </h2>
        <Button onClick={() => handleOpenModal()}>New Group</Button>
      </div>

      {/* Main Permissions Table */}
      <div className="max-mobile:pb-8 max-h-[82%] overflow-auto rounded-lg border border-b-0 pb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="min-w-[250px] p-4 text-left text-xs font-medium text-gray-600">
                  MODULE / ACTION
                </th>
                {rolesData?.records?.map((role: Role) => (
                  <th
                    key={role._id}
                    className="min-w-[200px] p-4 text-center font-medium text-gray-600"
                  >
                    <div className="text-center">
                      <div className="font-medium">{role.title}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        {role.description}
                      </div>
                      <div className="mt-2 flex justify-center space-x-1">
                        <button
                          className="flex h-4 w-4 items-center justify-center rounded bg-blue-100 text-xs text-blue-600 hover:bg-blue-200"
                          onClick={() => handleOpenModal(role)}
                          title="Edit"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          className="flex h-4 w-4 items-center justify-center rounded bg-red-100 text-xs text-red-600 hover:bg-red-200"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
                <th className="w-12 p-4 text-center font-medium text-gray-600">
                  <button
                    className="flex h-6 w-6 items-center justify-center rounded border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400"
                    onClick={() => handleOpenModal()}
                    title="Thêm nhóm quyền mới"
                  >
                    +
                  </button>
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {modules.map((module) => {
                const modulePermissions = groupedPermissions[module];
                const isExpanded = expandedModules.includes(module);

                return (
                  <React.Fragment key={module}>
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
                          <td className="p-4 text-center"></td>
                        </tr>
                      ))}
                  </React.Fragment>
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
        title={selectedRole ? 'Chỉnh sửa nhóm quyền' : 'Thêm nhóm quyền mới'}
        description="Cấu hình quyền cho nhóm người dùng"
        width="max-w-4xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              {selectedRole ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Form inputs */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputLabel
              label={{
                labelTitle: 'Tên nhóm quyền *',
                icon: <UserCog className="h-3 w-3" />,
              }}
              input={{
                inputId: 'role',
                className: 'w-full',
                inputName: 'role',
                placeholder: 'Nhập tên nhóm quyền',
                defaultValue: selectedRole?.title || '',
              }}
            />
            <InputLabel
              label={{
                labelTitle: 'Mô tả',
                icon: <FileText className="h-3 w-3" />,
              }}
              input={{
                inputId: 'description',
                className: 'w-full',
                inputName: 'description',
                placeholder: 'Nhập mô tả',
                defaultValue: selectedRole?.description || '',
              }}
            />
          </div>

          {/* Permissions table trong modal */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Phân quyền chi tiết</h3>
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
