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
    setConfig((prevConfig) => ({
      ...prevConfig,
      placeholder,
      onSearch,
    }));

    return () => {
      setConfig((prevConfig) => ({
        ...prevConfig,
        placeholder: undefined,
        onSearch: undefined,
      }));
    };
  }, []);
}
