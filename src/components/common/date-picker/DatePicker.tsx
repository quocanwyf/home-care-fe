// src/components/common/date-picker/DatePicker.tsx
import { useState } from 'react';

import { CalendarIcon, ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  formatDateToDDMMYYYY,
  isDateInPast,
  parseDDMMYYYYToDate,
} from '@/helpers/date-utitlity';

interface DatePickerProps {
  label: string;
  className?: string;
  classNameTrigger?: string;
  value?: string;
  onChange?: (dateString: string) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
  allowPastDates?: boolean;
}

const DatePicker = ({
  label,
  className,
  classNameTrigger,
  value,
  onChange,
  disabled = false,
  minDate = new Date(),
  maxDate = new Date(),
  required = false,
  allowPastDates = false,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  const selectedDate: Date | undefined = value
    ? parseDDMMYYYYToDate(value)
    : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = formatDateToDDMMYYYY(date);
      onChange?.(formattedDate);
    } else {
      onChange?.('');
    }
    setOpen(false);
  };

  //  Check if date should be disabled
  const isDateDisabled = (date: Date): boolean => {
    // Check if date is in the past
    if (!allowPastDates && isDateInPast(date)) {
      return true;
    }

    // Check against minDate if provided
    if (minDate) {
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);
      const minCompareDate = new Date(minDate);
      minCompareDate.setHours(0, 0, 0, 0);
      return compareDate < minCompareDate;
    }

    if (maxDate) {
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);
      const maxCompareDate = new Date(maxDate);
      maxCompareDate.setHours(0, 0, 0, 0);
      return compareDate > maxCompareDate;
    }

    return false;
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Label htmlFor="date" className="px-1">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            disabled={disabled}
            className={`w-48 justify-between font-normal ${
              !value ? 'text-muted-foreground' : ''
            } ${classNameTrigger}`}
          >
            {/*  Display formatted date or placeholder */}
            {value || 'Select date'}
            <CalendarIcon className="size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={handleDateSelect}
            disabled={isDateDisabled} //  Use date utility for validation
            defaultMonth={selectedDate || new Date()} // Start from selected date or today
            startMonth={new Date(new Date().getFullYear(), 0)}
            endMonth={new Date(new Date().getFullYear() + 10, 11)}
          />
        </PopoverContent>
      </Popover>

      {!allowPastDates &&
        value &&
        selectedDate &&
        isDateInPast(selectedDate) && (
          <p className="text-xs text-red-500">Cannot select past dates</p>
        )}
    </div>
  );
};

export default DatePicker;
