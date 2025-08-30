import React from 'react';

import { Edit, Trash2 } from 'lucide-react';

import TooltipInfo from '@/components/common/primitives/TooltipInfo';
import type { Role } from '@/types/table/objects/permissions';

interface RoleHeaderProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  isLoading?: boolean;
}

export const RoleHeader: React.FC<RoleHeaderProps> = ({
  role,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  return (
    <div className="text-center">
      <div className="text-sm font-semibold">{role.title}</div>
      <div className="mt-2 flex justify-center space-x-1">
        <TooltipInfo content="Edit">
          <button
            onClick={() => onEdit(role)}
            disabled={isLoading}
            className="cursor-pointer p-1 text-blue-400 transition-colors hover:text-blue-600 disabled:opacity-50"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
        </TooltipInfo>
        <TooltipInfo content="Delete">
          <button
            onClick={() => onDelete(role)}
            disabled={isLoading}
            className="cursor-pointer p-1 text-red-400 transition-colors hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </TooltipInfo>
      </div>
    </div>
  );
};
