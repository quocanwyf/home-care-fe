// components/features/roles/ModulePermissionSection.tsx
import React, { useState } from 'react';

import { PermissionToggleCheckbox } from '@/components/common/checkbox/PermissionToggleCheckbox';
import { ModuleExpansionHeader } from '@/components/table/permissions-table/ModuleExpansionHeader';

interface ModulePermissionSectionProps {
  moduleName: string;
  permissionKeys: string[];
  selectedPermissions: string[];
  onToggle: (permissionKey: string) => void;
}

export const ModulePermissionSection: React.FC<
  ModulePermissionSectionProps
> = ({ moduleName, permissionKeys, selectedPermissions, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-3 rounded-md border">
      <ModuleExpansionHeader
        moduleName={moduleName}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
      />

      {isExpanded && (
        <div className="space-y-3 border-t p-4">
          {permissionKeys.map((key) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm capitalize">{key}</span>
              <PermissionToggleCheckbox
                isChecked={selectedPermissions.includes(key)}
                onToggle={() => onToggle(key)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
