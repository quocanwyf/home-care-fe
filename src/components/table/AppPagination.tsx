import clsx from 'clsx';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface AppPaginationProps {
  pageIndex: number; // 0-based
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function AppPagination({
  pageIndex,
  pageCount,
  onPageChange,
}: AppPaginationProps) {
  const currentPage = pageIndex + 1;

  const generatePages = () => {
    const pages: (number | string)[] = [];

    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', pageCount);
      } else if (currentPage >= pageCount - 3) {
        pages.push(
          1,
          '...',
          pageCount - 4,
          pageCount - 3,
          pageCount - 2,
          pageCount - 1,
          pageCount
        );
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          pageCount
        );
      }
    }

    return pages;
  };

  // Kiểm tra disabled states
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pageCount;

  return (
    <div className="flex items-center space-x-1">
      {/* First Page Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onPageChange(0)} // Go to first page (0-based)
        disabled={isFirstPage}
        title="Trang đầu"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Previous Page Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onPageChange(pageIndex - 1)} // Previous page
        disabled={isFirstPage}
        title="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      {generatePages().map((page, index) =>
        page === '...' ? (
          <span key={index} className="text-muted-foreground px-2">
            ...
          </span>
        ) : (
          <Button
            key={index}
            size="icon"
            variant={page === currentPage ? 'default' : 'ghost'}
            className={clsx(
              'rounded-full',
              page === currentPage && 'bg-blue-500 text-white hover:bg-blue-600'
            )}
            onClick={() => onPageChange(Number(page) - 1)} // Convert to 0-based
            title={`Trang ${page}`}
          >
            {page}
          </Button>
        )
      )}

      {/* Next Page Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onPageChange(pageIndex + 1)} // Next page
        disabled={isLastPage}
        title="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last Page Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onPageChange(pageCount - 1)} // Go to last page (0-based)
        disabled={isLastPage}
        title="Trang cuối"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
