import { CheckIcon, ChevronUpIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { STATUS_ORDERS } from '@/constants/dropdown/status-orders';
import { STATUS_DISPLAY_NAME } from '@/constants/dropdown/status-display';

interface StatusFilterDropdownProps {
  status: string;
  onChange: (status: string) => void;
  availableStatuses?: string[];
  listStatusFilter?: string[];
}

export default function StatusFilterDropdown({
  status,
  onChange,
  listStatusFilter = [],
}: StatusFilterDropdownProps) {
  const getDisplayName = (status: string) => {
    return STATUS_DISPLAY_NAME[status] || status;
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
          <ChevronUpIcon className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {listStatusFilter.map((option) => (
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
