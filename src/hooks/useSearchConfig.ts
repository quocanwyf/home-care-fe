// hooks/useSearchConfigOrders.ts
import { useEffect } from 'react';

import { useSearch } from '@/context/SearchContext';

export function useSearchConfig({
  placeholder = 'Search',
  onSearch,
}: {
  placeholder?: string;
  onSearch?: (keyword: string) => void;
}) {
  const { setConfig } = useSearch();

  useEffect(() => {
    setConfig({
      placeholder,
      onSearch,
    });

    return () => {
      setConfig({}); // Reset khi rời trang
    };
  }, []);
}
