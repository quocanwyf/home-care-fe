import { useEffect, useMemo, useRef, useState } from 'react';

import { debounce } from 'lodash';
import { ChevronDown, Loader2 } from 'lucide-react';

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
  options: Array<{ label: string; value: string }>;
  onSelect: (value: string, label?: string) => void;
  onSearch?: (searchTerm: string) => void;
  debounceMs?: number;
  isLoading?: boolean;
  error?: string;
  className?: string;
};

const SearchableDropdown = ({
  label,
  input,
  options,
  onSelect,
  onSearch,
  debounceMs = 500,
  isLoading = false,
  error,
  className = '',
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
    option?.label?.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (input?.disabled) return;
    calculateDropdownPosition();
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: { label: string; value: string }) => {
    onSelect(option.value, option.label);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, ''); // Loại bỏ mọi ký tự không phải số
    setSearchTerm(numericValue);
    debouncedSearch(numericValue);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`} ref={dropdownRef}>
      <Label
        className={`flex items-center gap-2 text-sm ${label?.classNameLabel}`}
        htmlFor={input?.inputId}
      >
        {label?.icon}
        {label?.labelTitle} <span className="text-red-500">*</span>
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
                ? 'border-gray-400 bg-gray-200/80'
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
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={`${option.value}-${index}`}
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SearchableDropdown;
