import React from 'react';

import { PermissionToggleCheckbox } from '@/components/common/checkbox/PermissionToggleCheckbox';
import type { Permission, Role } from '@/types/table/objects/permissions';

interface PermissionRowProps {
  permission: Permission;
  roles: Role[];
  roleHasPermission: (roleId: string, permissionKey: string) => boolean;
  onPermissionToggle: (roleId: string, permissionKey: string) => void;
}

export const PermissionRow: React.FC<PermissionRowProps> = ({
  permission,
  roles,
  roleHasPermission,
  onPermissionToggle,
}) => {
  return (
    <tr key={permission.id} className="border-b hover:bg-gray-50">
      <td className="p-2 pl-12">
        <div>
          <div className="text-sm font-medium capitalize">
            {permission.action}
          </div>
          <div className="text-xs text-gray-500">{permission.description}</div>
        </div>
      </td>
      {roles.map((role) => (
        <td key={role._id} className="p-4 text-center text-sm text-gray-600">
          <div className="flex items-center justify-center">
            <PermissionToggleCheckbox
              isChecked={roleHasPermission(role._id, permission.permissionKey)}
              onToggle={() =>
                onPermissionToggle(role._id, permission.permissionKey)
              }
            />
          </div>
        </td>
      ))}
    </tr>
  );
};
