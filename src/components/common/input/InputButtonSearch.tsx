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
  className?: string;
};

const InputButtonSearch = ({
  label,
  input,
  button,
  className = '',
}: InputButtonSearchProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label
        className={`${label?.classNameLabel} flex items-center gap-2 text-sm`}
        htmlFor={input?.inputId}
      >
        {label?.icon}
        {label?.labelTitle} <span className="text-red-500">*</span>
      </Label>
      <div className="flex gap-2">
        <Input
          type="text"
          id={input?.inputId}
          name={input?.inputName}
          className={`focus:border-overlay-slider hover:border-overlay-slider/50 h-10 border-gray-400/60 bg-white focus:shadow-xs ${input?.className}`}
          required={input?.required}
          placeholder={input?.placeholder}
          value={input?.value}
          onChange={input?.onChange}
        />
        {button?.disabled ? (
          <div className="flex cursor-not-allowed items-center rounded-lg bg-blue-600/60 px-3 text-white">
            {button?.isLoading ? (
              <Loader2 className="!h-3 !w-3 animate-spin" />
            ) : (
              <Search className="!h-3 !w-3" />
            )}
          </div>
        ) : (
          <Button
            type="button"
            onClick={button?.onClick}
            className={`flex h-10 cursor-pointer items-center rounded-lg bg-blue-600 px-3 text-white transition-all hover:bg-blue-700 ${button?.className}`}
          >
            {button?.isLoading ? (
              <Loader2 className="!h-3 !w-3 animate-spin" />
            ) : (
              <Search className="!h-3 !w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InputButtonSearch;
