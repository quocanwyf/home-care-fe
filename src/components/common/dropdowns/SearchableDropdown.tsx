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
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>(
    'bottom'
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

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

  // Calculate dropdown position when opening
  const calculateDropdownPosition = () => {
    if (!inputRef.current) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 240; // Max height của dropdown (max-h-60 = 15rem = 240px)

    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;

    // Nếu không đủ chỗ bên dưới và có đủ chỗ bên trên
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownPosition('top');
    } else {
      setDropdownPosition('bottom');
    }
  };

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
      calculateDropdownPosition();
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
    <div className="flex flex-col gap-2 px-2" ref={dropdownRef}>
      <Label
        className={`flex items-center gap-2 text-sm ${label?.classNameLabel}`}
        htmlFor={input?.inputId}
      >
        {label?.icon}
        {label?.labelTitle}
      </Label>

      <div className="relative" ref={inputRef}>
        <div
          className={`flex items-center ${input?.disabled ? 'cursor-not-allowed opacity-80' : ''}`}
          onClick={handleInputClick}
        >
          <Input
            type="text"
            id={input?.inputId}
            name={input?.inputName}
            className={`${input?.className} focus:border-overlay-slider hover:border-overlay-slider/50 h-10 bg-white pr-8 focus:shadow-xs ${
              input?.disabled
                ? 'border-gray-400 bg-gray-400/20'
                : 'hover:border-overlay-slider/50 cursor-pointer border-gray-400/60'
            }`}
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
          <div
            className={`absolute z-50 max-h-60 w-full overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg ${
              dropdownPosition === 'top'
                ? 'bottom-full mb-1' // Hiển thị lên trên
                : 'top-full mt-1' // Hiển thị xuống dưới
            }`}
          >
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
