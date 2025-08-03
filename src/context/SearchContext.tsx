// SearchContext.tsx
import { createContext, useContext, useState } from 'react';
import type { DateRange } from 'react-day-picker';

type SearchConfig = {
  placeholder?: string;
  onSearch?: (value: string) => void;
  enableDateRange?: boolean;
  onDateRangeChange?: (range: DateRange | undefined) => void;
};

const SearchContext = createContext<{
  config: SearchConfig;
  setConfig: (
    cfg: SearchConfig | ((prevConfig: SearchConfig) => SearchConfig)
  ) => void;
}>({
  config: {},
  setConfig: () => {},
});

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<SearchConfig>({});

  return (
    <SearchContext.Provider value={{ config, setConfig }}>
      {children}
    </SearchContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => useContext(SearchContext);
