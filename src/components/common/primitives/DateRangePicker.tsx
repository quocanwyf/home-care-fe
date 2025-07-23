import { useCallback, useState } from 'react';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  className?: string;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  numberOfMonths?: number;
  initialRange?: DateRange; // Thêm prop này để nhận giá trị ban đầu
}
// Interface cho formatted date range
export interface FormattedDateRange {
  from: string | undefined;
  to: string | undefined;
}

export function DateRangePicker({
  className,
  onChange,
  placeholder = 'Choose date range',
  numberOfMonths = 2,
  disabled = false,
  initialRange = { from: undefined, to: undefined }, // Sử dụng undefined thay vì null
}: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>(initialRange);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = useCallback(
    (range: DateRange | undefined) => {
      setDate(range);
      // Chỉ gửi Date objects, không format ở đây
      onChange?.(range);
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

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy', { locale: vi });
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
                'h-10 w-full justify-start rounded-2xl pr-10 text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <span className="truncate">
                    {formatDate(date.from)} - {formatDate(date.to)}
                  </span>
                ) : (
                  <span className="truncate">{formatDate(date.from)}</span>
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
              <span className="sr-only">Xóa</span>
            </div>
          )}
        </div>
        <PopoverContent className="w-auto p-0" align="center">
          <div>
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={numberOfMonths}
              className="rounded-2xl border shadow-sm"
            />
            {/* Quick selection buttons */}
            {numberOfMonths !== 1 && (
              <div className="bg-muted/30 border-t p-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        const today = new Date();
                        const range = { from: today, to: today };
                        handleSelect(range);
                      }}
                    >
                      Hôm nay
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        const today = new Date();
                        const yesterday = new Date(today);
                        yesterday.setDate(today.getDate() - 1);
                        const range = { from: yesterday, to: today };
                        handleSelect(range);
                      }}
                    >
                      Hôm qua
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        const today = new Date();
                        const weekAgo = new Date(today);
                        weekAgo.setDate(today.getDate() - 6);
                        const range = { from: weekAgo, to: today };
                        handleSelect(range);
                      }}
                    >
                      7 ngày qua
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        const today = new Date();
                        const monthAgo = new Date(today);
                        monthAgo.setDate(today.getDate() - 29);
                        const range = { from: monthAgo, to: today };
                        handleSelect(range);
                      }}
                    >
                      30 ngày qua
                    </Button>
                  </div>

                  {date && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive h-7 text-xs"
                      onClick={() => handleSelect(undefined)}
                    >
                      Xóa
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
