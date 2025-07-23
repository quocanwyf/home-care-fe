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
      from: range.from || null,
      to: range.to || null,
    };

    setDateRange(newRange);

    // Format và log theo yêu cầu
    if (range.from && range.to) {
      const formattedRange = {
        from: formatDate(range.from),
        to: formatDate(range.to),
      };
      console.log('Formatted date range:', formattedRange);
    } else if (range.from) {
      console.log('Selected from date:', formatDate(range.from));
    }
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
}
