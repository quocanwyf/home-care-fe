// src/components/common/time-picker/TimePickerDropdown.tsx
import { useMemo, useState } from 'react';

import { ChevronDown, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TimePickerDropdownProps {
  label: string;
  value?: string; // Format: "HH:MM"
  onChange?: (time: string) => void;
  className?: string;
  disabled?: boolean;
  minTime?: string; // Format: "HH:MM"
  maxTime?: string; // Format: "HH:MM"
  stepMinutes?: number; // Default: 30
  checkSelectedDateInPastTime?: string; // Format: "dd/mm/yyyy" - để check current date
  placeholder?: string;
  customOptions?: string[];
}

export default function TimePickerDropdown({
  label,
  value,
  onChange,
  className,
  disabled = false,
  minTime = '06:00',
  maxTime = '22:00',
  stepMinutes = 30,
  checkSelectedDateInPastTime,
  placeholder = 'Select time',
  customOptions,
}: TimePickerDropdownProps) {
  const [open, setOpen] = useState(false);

  //  Generate time options
  const timeOptions = useMemo(() => {
    if (customOptions && customOptions.length > 0) {
      return customOptions;
    }

    const options: string[] = [];
    const [minHour, minMinute] = minTime.split(':').map(Number);
    const [maxHour, maxMinute] = maxTime.split(':').map(Number);

    const startMinutes = minHour * 60 + minMinute;
    const endMinutes = maxHour * 60 + maxMinute;

    for (
      let minutes = startMinutes;
      minutes <= endMinutes;
      minutes += stepMinutes
    ) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(timeString);
    }

    return options;
  }, [minTime, maxTime, stepMinutes, customOptions]);

  //  Check if time is disabled based on current date/time
  const isTimeDisabled = (timeString: string): boolean => {
    if (!checkSelectedDateInPastTime) return false;

    // Check if selected date is today
    const today = new Date();
    const todayString = today.toLocaleDateString('en-GB'); // dd/mm/yyyy format

    if (checkSelectedDateInPastTime === todayString) {
      // If it's today, disable past times
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      return timeString <= currentTime;
    }

    return false;
  };

  //  Filter out disabled times
  const availableTimeOptions = timeOptions.filter(
    (time) => !isTimeDisabled(time)
  );

  const handleTimeSelect = (timeString: string) => {
    onChange?.(timeString);
    setOpen(false);
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Label className="px-1">{label}</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            onClick={(e) => {
              if (disabled) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
            }}
            className={cn(
              'h-10 w-full justify-between font-normal',
              !value && 'text-muted-foreground',
              disabled
                ? 'hover:text-muted-foreground cursor-not-allowed bg-gray-100 opacity-80 hover:bg-gray-100'
                : 'cursor-pointer'
            )}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {value || placeholder}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search time..." />
            <CommandList>
              <CommandEmpty>No time found.</CommandEmpty>
              <CommandGroup>
                {availableTimeOptions.map((timeString) => (
                  <CommandItem
                    key={timeString}
                    value={timeString}
                    onSelect={() => handleTimeSelect(timeString)}
                    className={cn(
                      'cursor-pointer',
                      value === timeString && 'bg-accent'
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {timeString}
                    {isTimeDisabled(timeString) && (
                      <span className="text-muted-foreground ml-auto text-xs">
                        (Past)
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/*  Show info about disabled times */}
      {checkSelectedDateInPastTime && isTimeDisabled(value || '') && (
        <p className="text-xs text-red-500">Selected time is in the past</p>
      )}
    </div>
  );
}
