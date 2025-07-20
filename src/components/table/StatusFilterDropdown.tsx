import { CheckIcon, ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { STATUS_ORDERS_PROCESSING } from '@/constants/dropdown/status-orders';
import { STATUS_DISPLAY_ORDERS_PROCESSING_NAME } from '@/constants/dropdown/status-orders';

interface StatusFilterDropdownProps {
  status: string;
  onChange: (status: string) => void;
  availableStatuses?: string[];
}

export default function StatusFilterDropdown({
  status,
  onChange,
}: StatusFilterDropdownProps) {
  const getDisplayName = (status: string) => {
    return STATUS_DISPLAY_ORDERS_PROCESSING_NAME[status] || status;
  };
  return (
    <DropdownMenu>
      <span className="text-sm text-gray-600">Filter by status:</span>

      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="min-w-[100px] cursor-pointer justify-between"
        >
          {getDisplayName(status)}
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {STATUS_ORDERS_PROCESSING.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onChange(option)}
            className="flex cursor-pointer items-center justify-between"
          >
            {getDisplayName(option)}
            {status === option && (
              <CheckIcon className="text-primary h-2 w-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
