import AppDropdown from './AppDropdown';

const LabelDropdown = ({
  label,
  triggerLabel = 'Choose an option',
  options,
  handleSelect,
  className,
  triggerClassName = '',
  minWidth,
  labelClassName = '',
  selectedValue = { label: '', value: '' },
}: {
  label?: string;
  triggerLabel?: string;
  options?: { label: string; value: string | number }[];
  handleSelect?: (value: { label: string; value: string | number }) => void;
  className?: string;
  triggerClassName?: string;
  minWidth?: string;
  labelClassName?: string;
  selectedValue?: {
    label: string;
    value: string | number;
  } | null;
}) => {
  return (
    <div className="w-full space-y-2">
      <label
        className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="w-full">
        <AppDropdown
          triggerLabel={selectedValue?.label || triggerLabel}
          options={options}
          onSelect={handleSelect}
          triggerClassName={`w-full ${triggerClassName}`}
          minWidth={minWidth}
          className={`w-full ${className}`}
          useAutoWidth={true}
        />
      </div>
    </div>
  );
};

export default LabelDropdown;
