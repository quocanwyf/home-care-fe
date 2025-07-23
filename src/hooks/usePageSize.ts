import { useCallback, useEffect, useState } from 'react';

interface UsePageSizeProps {
  initialPageSize?: number;
}

interface UsePageSizeReturn {
  pageSize: number;
  handlePageSizeChange: (size: number) => void;
  resetPageSize: () => void;
}

export const usePageSize = ({
  initialPageSize = 10,
}: UsePageSizeProps = {}): UsePageSizeReturn => {
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  // Chỉ cần update state nội bộ
  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
  }, []);

  const resetPageSize = useCallback(() => {
    setPageSize(initialPageSize);
  }, [initialPageSize]);

  // Log mỗi khi pageSize thay đổi
  useEffect(() => {
    console.log('Current page size:', pageSize);
  }, [pageSize]);

  return {
    pageSize,
    handlePageSizeChange,
    resetPageSize,
  };
};
