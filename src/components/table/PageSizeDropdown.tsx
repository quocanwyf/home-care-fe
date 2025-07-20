import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PAGE_SIZE_TABLE } from '@/constants/pagesize/page-size-table';

interface PageSizeDropdownProps {
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  totalData?: number; // Optional, not used in this component
}

export default function PageSizeDropdown({
  pageSize = 10,
  onPageSizeChange = () => {},
  totalData = 0,
}: PageSizeDropdownProps) {
  const availablePageSizes = PAGE_SIZE_TABLE.filter(
    (size) => size <= totalData
  );
  return (
    <DropdownMenu>
      <span className="text-sm text-gray-600"> Show: </span>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-sm">
          {pageSize}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availablePageSizes.map((size) => (
          <DropdownMenuItem key={size} onClick={() => onPageSizeChange(size)}>
            {size} per page
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
