import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const InputLabel = ({
  label,
  input,
}: {
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
}) => {
  return (
    <div className="flex flex-col gap-1 px-2">
      <Label
        className={`flex items-center gap-2 text-sm ${label?.classNameLabel}`}
        htmlFor={input?.inputId}
      >
        {label?.icon}
        {label?.labelTitle}
      </Label>
      <Input
        type="text"
        id={input?.inputId}
        name={input?.inputName}
        className={`${input?.className} focus:border-overlay-slider hover:border-overlay-slider/50 h-9 border-gray-400/60 focus:shadow-xs`}
        required={input?.required}
        placeholder={input?.placeholder}
        value={input?.value}
        onChange={input?.onChange}
      />
    </div>
  );
};

export default InputLabel;
