export type ThemeType = 'green' | 'dark' | 'blue';

export interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const THEMES = {
  green: {
    name: 'Green Nature',
    icon: '🟢',
    class: '',
    description: 'Fresh and natural', //default
  },
  dark: {
    name: 'Dark Mode',
    icon: '🌙',
    class: 'dark',
    description: 'Easy on the eyes',
  },
  blue: {
    name: 'Ocean Blue',
    icon: '🔵',
    class: 'blue',
    description: 'Cool and professional',
  },
} as const;
