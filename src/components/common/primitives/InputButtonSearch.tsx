import { useState } from 'react';

import { Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';

type InputButtonSearchProps = {
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
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  button?: {
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
  };
};

const InputButtonSearch = ({
  label,
  input,
  button,
}: InputButtonSearchProps) => {
  return (
    <div className="flex flex-col gap-1 px-2">
      <Label
        className={`${label?.classNameLabel} flex items-center gap-2 text-sm`}
        htmlFor={input?.inputId}
      >
        {label?.icon}
        {label?.labelTitle}
      </Label>
      <div className="flex gap-2">
        <Input
          type="text"
          id={input?.inputId}
          name={input?.inputName}
          className={`focus:border-overlay-slider hover:border-overlay-slider/50 h-9 border-gray-300/60 focus:shadow-xs ${input?.className}`}
          required={input?.required}
          placeholder={input?.placeholder}
          value={input?.value}
          onChange={input?.onChange}
        />
        <Button
          type="button"
          onClick={button?.onClick}
          disabled={button?.disabled}
          className={`flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-3 text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 ${button?.className}`}
        >
          {button?.isLoading ? (
            <Loader2 className="!h-3 !w-3 animate-spin" />
          ) : (
            <Search className="!h-3 !w-3" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default InputButtonSearch;
