import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Option = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
};

export default function AppDropdown({
  triggerLabel = 'Select',
  options,
  onSelect,
  triggerClassName = '',
  showIcon = true,
  minWidth = ' ',
  label,
  children,
}: {
  triggerLabel?: string;
  options: Option[];
  onSelect: (value: Option) => void;
  triggerClassName?: string;
  showIcon?: boolean;
  minWidth?: string;
  label?: string;
  children?: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={` ${minWidth}`}>
        {/* <Button
          variant="outline"
          className={`flex items-center gap-2 ${triggerClassName}`}
        >
          {triggerLabel}
          {showIcon && <ChevronDown className="h-4 w-4" />}
        </Button> */}
        {children ? (
          // ✅ Custom trigger
          <div className={`cursor-pointer ${triggerClassName}`}>{children}</div>
        ) : (
          // ✅ Default button trigger
          <Button
            variant="outline"
            className={`flex items-center gap-2 ${triggerClassName}`}
          >
            {triggerLabel}
            {showIcon && <ChevronDown className="h-4 w-4" />}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={` ${minWidth}`}>
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onSelect(option)}
            className="cursor-pointer"
          >
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
