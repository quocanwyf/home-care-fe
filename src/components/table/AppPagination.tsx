import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  return (
    <div className="flex items-center space-x-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onPageChange(currentPage - 2)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

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
              page === currentPage && 'bg-blue-300 text-white'
            )}
            onClick={() => onPageChange(Number(page) - 1)}
          >
            {page}
          </Button>
        )
      )}

      <Button
        size="icon"
        variant="ghost"
        onClick={() => onPageChange(pageIndex + 1)}
        disabled={currentPage === pageCount}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
