// hooks/useDateRangeConfigOrders.ts
import { useCallback, useEffect, useState } from 'react';

import { useSearch } from '@/context/SearchContext';

export function useDateRangeConfig() {
  const { setConfig } = useSearch();
  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateRangeChange = useCallback((range: any) => {
    //hủy
    if (!range) {
      setDateRange({ startDate: null, endDate: null });
      return;
    }

    // const formatDate = (date: Date) => {
    //   return date.toLocaleDateString('vi-VN', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric',
    //   });
    // };

    setDateRange(range);
  }, []);

  useEffect(() => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      enableDateRange: true,
      dateRange,
      onDateRangeChange: handleDateRangeChange,
    }));

    return () => {
      setConfig((prevConfig) => ({
        ...prevConfig,
        enableDateRange: false,
        dateRange: undefined,
        onDateRangeChange: undefined,
      }));
    };
  }, [dateRange, setConfig, handleDateRangeChange]);

  return { dateRange };
}
