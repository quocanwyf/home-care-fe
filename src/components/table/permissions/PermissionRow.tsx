import PermissionToggleButton from '@/components/common/button/PermissionToggleButton';
import type { Permission, Role } from '@/types/table/objects/permissions';

interface PermissionRowProps {
  permission: Permission;
  roles: Role[];
  onTogglePermission: (roleId: string, permissionId: string) => void;
}

const PermissionRow = ({
  permission,
  roles,
  onTogglePermission,
}: PermissionRowProps) => {
  return (
    <tr className="hover:bg-gray-25">
      <td className="border-r border-gray-200 px-6 py-3">
        <div className="pl-6">
          <div className="font-medium text-gray-700">{permission.action}</div>
          <div className="text-xs text-gray-500">{permission.description}</div>
        </div>
      </td>
      {roles.map((role) => (
        <td
          key={role._id}
          className="border-r border-gray-200 px-4 py-3 text-center"
        >
          <PermissionToggleButton
            role={role}
            permission={permission}
            onToggle={onTogglePermission}
          />
        </td>
      ))}
      <td className="px-4 py-3"></td>
    </tr>
  );
};

export default PermissionRow;
