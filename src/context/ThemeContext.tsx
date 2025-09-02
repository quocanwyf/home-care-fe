// src/contexts/ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

import type { ThemeContextType, ThemeType } from '@/types/common/theme-type';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
}

export const ThemeProvider = ({
  children,
  defaultTheme = 'blue',
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    //  Check local storage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as ThemeType;
      if (stored && ['dark', 'green', 'blue'].includes(stored)) {
        return stored;
      }
    }
    return defaultTheme;
  });

  //  Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove('dark', 'blue', 'green');

    root.classList.add(theme);

    localStorage.setItem('theme', theme);
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
