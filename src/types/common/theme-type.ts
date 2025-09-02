export type ThemeType = 'green' | 'dark' | 'blue';

export interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const THEMES = {
  blue: {
    name: 'Ocean Blue',
    icon: '🔵',
    class: 'blue',
    description: 'Cool and professional',
  },
  dark: {
    name: 'Dark Mode',
    icon: '🌙',
    class: 'dark',
    description: 'Easy on the eyes',
  },
  green: {
    name: 'Green Nature',
    icon: '🟢',
    class: '',
    description: 'Fresh and natural', //default
  },
} as const;
