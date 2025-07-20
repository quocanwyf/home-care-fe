import { Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: SearchInputProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-2xl bg-white pr-9 pl-9 text-sm"
      />
      {value && (
        <X
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 cursor-pointer"
          onClick={() => onChange('')}
        />
      )}
    </div>
  );
}
