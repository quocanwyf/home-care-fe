// hooks/useDateRangeConfigOrders.ts
import { useEffect, useState } from 'react';

import { useSearch } from '@/context/SearchContext';

export function useDateRangeConfig() {
  const { setConfig } = useSearch();
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  const handleDateRangeChange = (range: any) => {
    //hủy
    if (!range) {
      setDateRange({ from: null, to: null });
      return;
    }

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    const newRange = {
      from: formatDate(range.from || null),
      to: formatDate(range.to || null),
    };

    setDateRange(newRange);

    // console.log('Date range changed:', newRange);
  };

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
  }, [dateRange, setConfig]);

  return { dateRange };
}
