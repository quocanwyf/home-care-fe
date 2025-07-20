'use client';

import { useMemo } from 'react';

import { RefreshCw } from 'lucide-react';

import TooltipInfo from '../common/primitives/TooltipInfo';
import AppPagination from './AppPagination';
import PageSizeDropdown from './PageSizeDropdown';
import StatusFilterDropdown from './StatusFilterDropdown';

interface PageFooterProps {
  status: string;
  onStatusFilterChange?: (status: string) => void;
  className?: string;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  onResetFilters?: () => void;
  pageIndex?: number; // 0-based
  pageCount?: number;
  onPageChange?: (page: number) => void; // 0-based
  totalData?: number;
}

export default function PageFooter({
  className = '',
  //status filter
  status,
  onStatusFilterChange,
  //pagesize
  pageSize = 10,
  onPageSizeChange,
  //pagination
  pageIndex = 0,
  pageCount = 1,
  onPageChange,
  //reset filters
  onResetFilters,
  totalData = 0,
}: PageFooterProps) {
  const isResetting = useMemo(() => {
    return status !== 'all' || pageSize !== 10;
  }, [status, pageSize]);

  return (
    <div
      className={`my-2 flex w-full flex-col items-center justify-between gap-4 md:flex-row ${className}`}
    >
      {/* Thêm pagination component */}
      <div className="">
        {pageCount > 1 && onPageChange && (
          <AppPagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            onPageChange={onPageChange}
          />
        )}
      </div>
      <div className="mr-12 flex items-center justify-between gap-4">
        {isResetting ? (
          <>
            {' '}
            <div className="text-sm">Reset:</div>
            <TooltipInfo content="Reset filters">
              <button
                onClick={() => onResetFilters?.()}
                className="cursor-pointer p-1 text-blue-400 transition-colors hover:text-blue-600"
                title="Reset filters"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </TooltipInfo>
          </>
        ) : null}
        <StatusFilterDropdown
          status={status}
          onChange={onStatusFilterChange || (() => {})}
        />
        <PageSizeDropdown
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange || (() => {})}
          totalData={totalData}
        />
      </div>
    </div>
  );
}
