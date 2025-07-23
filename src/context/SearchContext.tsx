// SearchContext.tsx
import { createContext, useContext, useState } from 'react';

type SearchConfig = {
  placeholder?: string;
  onSearch?: (value: string) => void;
};

const SearchContext = createContext<{
  config: SearchConfig;
  setConfig: (cfg: SearchConfig) => void;
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

export const useSearch = () => useContext(SearchContext);
