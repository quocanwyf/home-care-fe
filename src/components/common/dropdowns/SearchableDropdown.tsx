import { useEffect, useMemo, useRef, useState } from 'react';

import { debounce } from 'lodash';
import { ChevronDown } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SearchableDropdownProps = {
  label?: {
    classNameLabel?: string;
    labelTitle?: string;
    icon?: React.ReactNode;
  };
  input?: {
    inputId?: string;
    inputName?: string;
    className?: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
    disabled?: boolean;
  };
  options: string[];
  onSelect: (value: string) => void;
  onSearch?: (searchTerm: string) => void;
  debounceMs?: number;
};

const SearchableDropdown = ({
  label,
  input,
  options,
  onSelect,
  onSearch,
  debounceMs = 500,
}: SearchableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        onSearch?.(term);
      }, debounceMs),
    [onSearch, debounceMs]
  );

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputClick = () => {
    if (!input?.disabled) {
      setIsOpen(true);
    }
  };

  const handleOptionSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="flex flex-col gap-1 px-2" ref={dropdownRef}>
      <Label
        className={`flex items-center gap-2 text-sm ${label?.classNameLabel}`}
        htmlFor={input?.inputId}
      >
        {label?.icon}
        {label?.labelTitle}
      </Label>

      <div className="relative">
        <div
          className={`flex cursor-pointer items-center ${input?.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={handleInputClick}
        >
          <Input
            type="text"
            id={input?.inputId}
            name={input?.inputName}
            className={`${input?.className} focus:border-overlay-slider hover:border-overlay-slider/50 h-9 border-gray-300/60 pr-8 focus:shadow-xs ${input?.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            placeholder={input?.placeholder}
            value={input?.value || ''}
            readOnly={!isOpen}
            disabled={input?.disabled}
            required={input?.required}
          />
          <ChevronDown
            className={`absolute right-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${input?.disabled ? 'text-gray-400' : 'text-gray-600'}`}
          />
        </div>

        {/* Dropdown */}
        {isOpen && !input?.disabled && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg">
            {/* Search input */}
            <div className="border-b p-2">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-8 text-sm"
                autoFocus
              />
            </div>

            {/* Options list */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={index}
                    className="cursor-pointer border-b px-3 py-2 text-sm last:border-b-0 hover:bg-blue-50"
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableDropdown;
