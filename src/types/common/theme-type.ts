export type ThemeType = 'green' | 'dark' | 'blue';

export interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const THEMES = {
  blue: {
    name: 'Blue',
    icon: '🔵',
    class: '',
    description: 'Nature blue theme',
  },
  dark: {
    name: 'Dark',
    icon: '🌙',
    class: 'dark',
    description: 'Dark mode',
  },
  green: {
    name: 'Green',
    icon: '🟢',
    class: 'green',
    description: 'Default green theme',
  },
} as const;
