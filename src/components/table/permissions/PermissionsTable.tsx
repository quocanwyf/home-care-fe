import React from 'react';

import { Edit, Plus, Shield, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Permission, Role } from '@/types/table/objects/permissions';

import ModuleRow from './ModuleRow';
import PermissionRow from './PermissionRow';

interface PermissionsTableProps {
  roles: Role[];
  permissions: Permission[];
  expandedModules: { [key: string]: boolean };
  onToggleModule: (module: string) => void;
  onTogglePermission: (roleId: string, permissionId: string) => void;
  onCreateRole: () => void;
  onEditRole: (roleId: string) => void;
  onDeleteRole: (roleId: string) => void;
}

const PermissionsTable = ({
  roles,
  permissions,
  expandedModules,
  onToggleModule,
  onTogglePermission,
  onCreateRole,
  onEditRole,
  onDeleteRole,
}: PermissionsTableProps) => {
  const getModulePermissions = () => {
    const modules: { [key: string]: Permission[] } = {};
    permissions.forEach((permission) => {
      if (!modules[permission.module]) {
        modules[permission.module] = [];
      }
      modules[permission.module].push(permission);
    });
    return modules;
  };

  const modulePermissions = getModulePermissions();

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 bg-pink-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-pink-400 to-purple-400">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Simple RBAC Permissions Table
              </h2>
              <p className="text-sm text-gray-600">
                Quản lý phân quyền theo từng role và module
              </p>
            </div>
          </div>
          <div className="text-sm font-medium text-pink-600">Permit.io</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-r border-gray-200 px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-500 uppercase">
                Module / Action
              </th>
              {roles.map((role) => (
                <th
                  key={role._id}
                  className="min-w-[150px] border-r border-gray-200 px-4 py-4 text-center text-sm font-medium text-gray-700"
                >
                  <div>
                    <div className="font-semibold">{role.title}</div>
                    <div className="mt-1 text-xs font-normal text-gray-500">
                      {role.description}
                    </div>
                  </div>
                </th>
              ))}
              <th className="px-4 py-4 text-center text-sm font-medium text-gray-500">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCreateRole}
                  className="h-8 w-8 p-0"
                  title="Thêm role mới"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {Object.entries(modulePermissions).map(
              ([moduleName, modulePerms]) => {
                const isExpanded = expandedModules[moduleName];
                return (
                  <React.Fragment key={moduleName}>
                    <ModuleRow
                      moduleName={moduleName}
                      modulePermissions={modulePerms}
                      roles={roles}
                      isExpanded={isExpanded}
                      onToggleExpansion={onToggleModule}
                    />

                    {isExpanded &&
                      modulePerms.map((permission) => (
                        <PermissionRow
                          key={permission.id}
                          permission={permission}
                          roles={roles}
                          onTogglePermission={onTogglePermission}
                        />
                      ))}
                  </React.Fragment>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>Thao tác với roles:</div>
          <div className="flex space-x-2">
            {roles.map((role) => (
              <div key={role._id} className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditRole(role._id)}
                  className="p-1 text-blue-600 hover:bg-blue-50"
                  title={`Chỉnh sửa ${role.title}`}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteRole(role._id)}
                  className="p-1 text-red-600 hover:bg-red-50"
                  title={`Xóa ${role.title}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsTable;
