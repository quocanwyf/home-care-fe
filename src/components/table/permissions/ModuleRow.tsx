import { ChevronDown, ChevronRight } from 'lucide-react';

import type { Permission, Role } from '@/types/table/objects/permissions';

interface ModuleRowProps {
  moduleName: string;
  modulePermissions: Permission[];
  roles: Role[];
  isExpanded: boolean;
  onToggleExpansion: (module: string) => void;
}

const ModuleRow = ({
  moduleName,
  modulePermissions,
  roles,
  isExpanded,
  onToggleExpansion,
}: ModuleRowProps) => {
  return (
    <tr className="bg-gray-25">
      <td
        className="cursor-pointer border-r border-gray-200 px-6 py-3 hover:bg-gray-50"
        onClick={() => onToggleExpansion(moduleName)}
      >
        <div className="flex items-center space-x-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
          <span className="font-medium text-gray-900">{moduleName}</span>
        </div>
      </td>
      {roles.map((role) => (
        <td
          key={role._id}
          className="border-r border-gray-200 px-4 py-3 text-center"
        >
          <div className="text-xs text-gray-500">
            {
              modulePermissions.filter((p) => role.permissions?.includes(p.id))
                .length
            }
            /{modulePermissions.length}
          </div>
        </td>
      ))}
      <td className="px-4 py-3"></td>
    </tr>
  );
};

export default ModuleRow;
