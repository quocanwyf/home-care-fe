// src/components/common/date-picker/DateRangePicker.tsx
import { useCallback, useState } from 'react';

import { Calendar as CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { renderQuickSelections } from '@/helpers/renderQuickSelections';
import { cn } from '@/lib/utils';

export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

//  Add formatted date range interface
export interface FormattedDateRange {
  startDate: string; // dd/mm/yyyy
  endDate: string; // dd/mm/yyyy
}

export type QuickSelectionMode = 'none' | 'past' | 'future';

interface DateRangePickerProps {
  className?: string;
  onChange?: (range: FormattedDateRange | undefined) => void; //   Return formatted strings
  placeholder?: string;
  disabled?: boolean;
  constraintChooseDate?: boolean;
  numberOfMonths?: number;
  classNameTrigger?: string;
  initialRange?: DateRange;
  quickSelectionMode?: QuickSelectionMode;
  minDate?: Date;
  value?: FormattedDateRange; // ✅ Accept formatted strings
}

export function DateRangePicker({
  className,
  classNameTrigger,
  onChange,
  placeholder = 'Choose date range',
  numberOfMonths = 2,
  disabled = false,
  constraintChooseDate = true,
  initialRange = { from: undefined, to: undefined },
  quickSelectionMode = 'none',
  minDate = new Date(),
  value,
}: DateRangePickerProps) {
  //  Convert formatted value to Date range for internal state
  const getInitialDateRange = (): DateRange => {
    if (value?.startDate && value?.endDate) {
      return {
        from: parseDDMMYYYYToDate(value.startDate) || undefined,
        to: parseDDMMYYYYToDate(value.endDate) || undefined,
      };
    }
    return initialRange;
  };

  const [date, setDate] = useState<DateRange | undefined>(
    getInitialDateRange()
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = useCallback(
    (range: DateRange | undefined) => {
      setDate(range);

      //  Convert to formatted strings before calling onChange
      if (range?.from) {
        const formattedRange: FormattedDateRange = {
          startDate: formatDateToDDMMYYYY(range.from),
          endDate: range.to
            ? formatDateToDDMMYYYY(range.to)
            : formatDateToDDMMYYYY(range.from),
        };
        onChange?.(formattedRange);
      } else {
        onChange?.(undefined);
      }
    },
    [onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setDate(undefined);
      onChange?.(undefined);
    },
    [onChange]
  );

  //  Check if date should be disabled
  const isDateDisabled = (date: Date): boolean => {
    // Check if date is in the past
    if (isDateInPast(date)) {
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

    return false;
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative">
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              disabled={disabled}
              className={cn(
                'h-10 w-full cursor-pointer justify-start rounded-2xl pr-10 text-left font-normal',
                !date && 'text-muted-foreground',
                classNameTrigger
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <span className="truncate">
                    {/* ✅ Use date utility for formatting */}
                    {formatDateToDDMMYYYY(date.from)} -{' '}
                    {formatDateToDDMMYYYY(date.to)}
                  </span>
                ) : (
                  <span className="truncate">
                    {formatDateToDDMMYYYY(date.from)}
                  </span>
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          {date && !disabled && (
            <div
              className="hover:bg-muted absolute top-1/2 right-2 z-10 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-colors"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear</span>
            </div>
          )}
        </div>
        <PopoverContent className="w-auto p-0" align="center">
          <div>
            <Calendar
              mode="range"
              defaultMonth={date?.from || new Date()}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={numberOfMonths}
              className="shadow-sm"
              disabled={constraintChooseDate ? isDateDisabled : false} //   Use date utility for validation
            />
            {/* Quick selection buttons */}
            {numberOfMonths !== 1 && (
              <div className="bg-muted/30 border-t p-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {renderQuickSelections(quickSelectionMode, handleSelect)}
                  </div>

                  {date && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive h-7 text-xs"
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
