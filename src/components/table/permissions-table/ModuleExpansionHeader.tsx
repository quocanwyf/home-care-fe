// components/features/roles/ModuleExpansionHeader.tsx
import React from 'react';

import { ChevronDown, ChevronRight } from 'lucide-react';

interface ModuleExpansionHeaderProps {
  moduleName: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ModuleExpansionHeader: React.FC<ModuleExpansionHeaderProps> = ({
  moduleName,
  isExpanded,
  onToggleExpand,
}) => {
  return (
    <div
      className="flex cursor-pointer items-center space-x-2 p-3 hover:bg-gray-50"
      onClick={onToggleExpand}
    >
      {isExpanded ? (
        <ChevronDown className="h-4 w-4 text-gray-500" />
      ) : (
        <ChevronRight className="h-4 w-4 text-gray-500" />
      )}
      <span className="text-sm font-medium text-gray-900">{moduleName}</span>
    </div>
  );
};
