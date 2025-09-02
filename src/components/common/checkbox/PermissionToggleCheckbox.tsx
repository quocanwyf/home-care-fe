// components/features/roles/PermissionToggleCheckbox.tsx
import React from 'react';

import { Check } from 'lucide-react';

interface PermissionToggleCheckboxProps {
  isChecked: boolean;
  onToggle: () => void;
}

export const PermissionToggleCheckbox: React.FC<
  PermissionToggleCheckboxProps
> = ({ isChecked, onToggle }) => {
  const backgroundColor = isChecked
    ? 'bg-overlay-slider hover:bg-overlay-slider/90'
    : 'border-gray-300 hover:border-gray-400';
  const icon = isChecked ? (
    <div className="p">
      <Check className="h-3 w-3 text-white" />
    </div>
  ) : null;

  return (
    <button
      onClick={onToggle}
      className={`flex h-4.5 w-4.5 cursor-pointer items-center justify-center rounded-sm transition-all ${isChecked ? backgroundColor : 'border-2'}`}
    >
      {icon}
    </button>
  );
};
