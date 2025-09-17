import { useEffect, useRef, useState } from 'react';

import { Check, Globe } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

import TooltipInfo from '../primitives/TooltipInfo';

const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
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

  const handleLanguageSelect = (languageCode: string) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <TooltipInfo content="Change language">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-card-foreground cursor-pointer px-3 py-2"
          aria-label="Change language"
        >
          <Globe className="-mt-1 mr-0.5 h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110" />
        </button>
      </TooltipInfo>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="border-border bg-popover absolute top-full right-0 z-50 mt-2 w-56 rounded-lg border p-2 shadow-lg">
          <div className="mb-2 px-2 py-1">
            <p className="text-popover-foreground text-sm font-semibold">
              Choose Language
            </p>
            <p className="text-muted-foreground text-xs">
              Select your preferred language
            </p>
          </div>

          <div className="space-y-1">
            {languages.map((language) => {
              const isSelected = currentLanguage === language.code;

              return (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    isSelected ? 'bg-accent text-accent-foreground' : ''
                  }`}
                >
                  {/* Language Flag */}
                  <span className="text-lg">{language.flag}</span>

                  {/* Language Info */}
                  <div className="flex-1">
                    <div className="font-medium">{language.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {language.code.toUpperCase()}
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

export default LanguageSwitcher;
