import React, { Fragment } from 'react';

import { ModuleExpansionHeader } from '@/components/table/permissions-table/ModuleExpansionHeader';
import type { Permission, Role } from '@/types/table/objects/permissions';

import { PermissionRow } from './PermissionRow';
import { RoleHeader } from './RoleHeader';

interface PermissionsTableProps {
  roles: Role[];
  groupedPermissions: Record<string, Permission[]>;
  modules: string[];
  expandedModules: string[];
  rolePermissions: Record<string, string[]>;
  isAnyActionLoading: boolean;
  onEditRole: (role: Role) => void;
  onDeleteRole: (role: Role) => void;
  onToggleModuleExpansion: (moduleName: string) => void;
  onPermissionToggle: (roleId: string, permissionKey: string) => void;
}

export const PermissionsTable: React.FC<PermissionsTableProps> = ({
  roles,
  groupedPermissions,
  modules,
  expandedModules,
  rolePermissions,
  isAnyActionLoading,
  onEditRole,
  onDeleteRole,
  onToggleModuleExpansion,
  onPermissionToggle,
}) => {
  const getRolePermissions = (roleId: string): string[] => {
    return rolePermissions[roleId] || [];
  };

  const getRolePermissionCount = (
    roleId: string,
    modulePermissions: Permission[]
  ) => {
    const currentRolePermissions = getRolePermissions(roleId);
    const modulePermissionKeys = modulePermissions.map((p) => p.permissionKey);
    const hasPermissions = currentRolePermissions.filter((p) =>
      modulePermissionKeys.includes(p)
    );
    return `${hasPermissions.length}/${modulePermissionKeys.length}`;
  };

  const roleHasPermission = (
    roleId: string,
    permissionKey: string
  ): boolean => {
    const currentRolePermissions = getRolePermissions(roleId);
    return currentRolePermissions.includes(permissionKey);
  };

  return (
    <div className="max-mobile:pb-8 max-h-[80%] overflow-auto rounded-lg pb-10">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="min-w-[250px] p-4 text-left text-sm font-semibold text-gray-600">
                Module / Action
              </th>
              {roles.map((role) => (
                <th
                  key={role._id}
                  className="min-w-[200px] p-4 text-center font-medium text-gray-600"
                >
                  <RoleHeader
                    role={role}
                    onEdit={onEditRole}
                    onDelete={onDeleteRole}
                    isLoading={isAnyActionLoading}
                  />
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
                        onToggleExpand={() => onToggleModuleExpansion(module)}
                      />
                    </td>
                    {roles.map((role) => (
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
                      <PermissionRow
                        key={permission.id}
                        permission={permission}
                        roles={roles}
                        roleHasPermission={roleHasPermission}
                        onPermissionToggle={onPermissionToggle}
                      />
                    ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
