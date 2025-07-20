import { useCallback, useMemo, useState } from 'react';

interface UsePaginationProps {
  totalItems: number;
  pageSize: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  pageCount: number;
  pageIndex: number; // 0-based for TanStack Table
  canPreviousPage: boolean;
  canNextPage: boolean;
  handlePageChange: (page: number) => void; // 0-based
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  handleFirstPage: () => void;
  handleLastPage: () => void;
  resetPagination: () => void;
  pageInfo: {
    startItem: number;
    endItem: number;
    totalItems: number;
  };
}

export const usePagination = ({
  totalItems,
  pageSize,
  initialPage = 0, // 0-based
}: UsePaginationProps): UsePaginationReturn => {
  const [pageIndex, setPageIndex] = useState<number>(initialPage);

  // Tính toán các giá trị derived
  const pageCount = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  const currentPage = pageIndex + 1; // 1-based for display

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  // Thông tin hiển thị
  const pageInfo = useMemo(() => {
    const startItem = pageIndex * pageSize + 1;
    const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);
    return {
      startItem: totalItems > 0 ? startItem : 0,
      endItem,
      totalItems,
    };
  }, [pageIndex, pageSize, totalItems]);

  // Handlers
  const handlePageChange = useCallback(
    (newPageIndex: number) => {
      const clampedPage = Math.max(0, Math.min(newPageIndex, pageCount - 1));
      setPageIndex(clampedPage);
    },
    [pageCount]
  );

  const handleNextPage = useCallback(() => {
    if (canNextPage) {
      setPageIndex((prev) => prev + 1);
    }
  }, [canNextPage]);

  const handlePreviousPage = useCallback(() => {
    if (canPreviousPage) {
      setPageIndex((prev) => prev - 1);
    }
  }, [canPreviousPage]);

  const handleFirstPage = useCallback(() => {
    setPageIndex(0);
  }, []);

  const handleLastPage = useCallback(() => {
    setPageIndex(pageCount - 1);
  }, [pageCount]);

  const resetPagination = useCallback(() => {
    setPageIndex(initialPage);
  }, [initialPage]);

  return {
    currentPage,
    pageCount,
    pageIndex,
    canPreviousPage,
    canNextPage,
    handlePageChange,
    handleNextPage,
    handlePreviousPage,
    handleFirstPage,
    handleLastPage,
    resetPagination,
    pageInfo,
  };
};
