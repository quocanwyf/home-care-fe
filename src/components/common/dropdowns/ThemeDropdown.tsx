// src/components/common/theme/ThemeDropdown.tsx
import { useEffect, useRef, useState } from 'react';

import { Check, Palette } from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';
import { THEMES } from '@/types/common/theme-type';
import type { ThemeType } from '@/types/common/theme-type';

import TooltipInfo from '../primitives/TooltipInfo';

const ThemeDropdown = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeSelect = (selectedTheme: ThemeType) => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <TooltipInfo content="Change theme">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-card-foreground cursor-pointer px-3 py-2"
          aria-label="Change theme"
        >
          <Palette className="-mt-1 mr-0.5 h-5.5 w-5.5 transition-all duration-500 ease-in-out hover:scale-110" />
        </button>
      </TooltipInfo>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="border-border bg-popover absolute top-full right-0 z-50 mt-2 w-56 rounded-lg border p-2 shadow-lg">
          <div className="mb-2 px-2 py-1">
            <p className="text-popover-foreground text-sm font-semibold">
              Choose Theme
            </p>
            <p className="text-muted-foreground text-xs">
              Select your preferred theme
            </p>
          </div>

          <div className="space-y-1">
            {Object.entries(THEMES).map(([key, themeData]) => {
              const themeKey = key as ThemeType;
              const isSelected = theme === themeKey;

              return (
                <button
                  key={themeKey}
                  onClick={() => handleThemeSelect(themeKey)}
                  className={`hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    isSelected ? 'bg-accent text-accent-foreground' : ''
                  }`}
                >
                  {/* Theme Icon */}
                  <span className="text-lg">{themeData.icon}</span>

                  {/* Theme Info */}
                  <div className="flex-1">
                    <div className="font-medium">{themeData.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {themeData.description}
                    </div>
                  </div>

                  {/* Check Icon */}
                  {isSelected && <Check className="text-primary h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeDropdown;
