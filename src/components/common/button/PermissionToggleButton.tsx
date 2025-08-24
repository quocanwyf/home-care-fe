import { Check, Minus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { PermissionToggleProps } from '@/types/table/objects/permissions';

const PermissionToggleButton = ({
  role,
  permission,
  onToggle,
}: PermissionToggleProps) => {
  const hasPermission = role.permissions?.includes(permission.id) || false;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onToggle(role._id, permission.id)}
      className="h-6 w-6 rounded p-0"
    >
      {hasPermission ? (
        <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-500 hover:bg-purple-600">
          <Check className="h-4 w-4 text-white" />
        </div>
      ) : permission.action === 'view' ? (
        <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-500 hover:bg-purple-600">
          <Minus className="h-0.5 w-3 bg-white" />
        </div>
      ) : (
        <div className="h-6 w-6 rounded border-2 border-gray-300 hover:border-gray-400" />
      )}
    </Button>
  );
};

export default PermissionToggleButton;
