import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react/jsx-runtime';

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
  options = [],
  onSelect = () => {},
  triggerClassName = '',
  showIcon = true,
  minWidth = ' ',
  label,
  children,
  disabled = false,
  className = '',
  classNameItem = '',
  useAutoWidth = true,
}: {
  triggerLabel?: string | number;
  options?: Option[];
  onSelect?: (value: Option | { label: string; value: string }) => void;
  triggerClassName?: string;
  showIcon?: boolean;
  minWidth?: string;
  label?: string | JSX.Element;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  classNameItem?: string;
  useAutoWidth?: boolean;
}) {
  const [triggerWidth, setTriggerWidth] = useState<number>(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Measure trigger width when component mounts or updates
  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [triggerLabel]);

  const shouldUseAutoWidth =
    useAutoWidth &&
    !className.includes('absolute') &&
    !className.includes('fixed');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={` ${minWidth}`}
        disabled={disabled}
        ref={triggerRef}
      >
        {/* <Button
          variant="outline"
          className={`flex items-center gap-2 ${triggerClassName}`}
        >
          {triggerLabel}
          {showIcon && <ChevronDown className="h-4 w-4" />}
        </Button> */}
        {children ? (
          // ✅ Custom trigger
          <div
            className={`cursor-pointer ${triggerClassName} ${triggerClassName} ${disabled ? 'pointer-events-none' : ''}`}
          >
            {children}
          </div>
        ) : (
          // ✅ Default button trigger
          <Button
            variant="outline"
            className={`flex w-full items-center justify-between gap-2 ${triggerClassName}`}
          >
            {triggerLabel}
            {showIcon && <ChevronDown className="h-4 w-4" />}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={`${className}`}
        style={
          shouldUseAutoWidth
            ? {
                width: triggerWidth > 0 ? `${triggerWidth}px` : 'auto',
                minWidth: triggerWidth > 0 ? `${triggerWidth}px` : '200px',
              }
            : undefined
        }
      >
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
            className={`w-full cursor-pointer ${classNameItem} ${disabled ? 'pointer-events-none opacity-50' : ''}`}
            disabled={disabled}
          >
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
