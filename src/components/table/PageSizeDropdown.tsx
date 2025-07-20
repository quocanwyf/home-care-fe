import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PageSizeDropdownProps {
  pageSize: number;
  onChange: (size: number) => void;
}

export default function PageSizeDropdown({
  pageSize,
  onChange,
}: PageSizeDropdownProps) {
  const options = [10, 20, 50, 100];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-sm">
          Show: {pageSize}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((size) => (
          <DropdownMenuItem key={size} onClick={() => onChange(size)}>
            {size} per page
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
