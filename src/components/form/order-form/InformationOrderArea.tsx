import { useState } from 'react';

import { ClipboardList } from 'lucide-react';

import DatePicker from '@/components/common/date-picker/DatePicker';
import {
  DateRangePicker,
  type FormattedDateRange,
} from '@/components/common/date-picker/DateRangePicker';
import LabelDropdown from '@/components/common/dropdowns/LabelDropdown';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CustomerAreaProps } from '@/types/params/order-params';

const InformationOrderArea = ({
  formData,
  onUpdateFormData,
}: CustomerAreaProps) => {
  console.log(formData, onUpdateFormData);
  const [selectedRequestType, setSelectedRequestType] = useState<{
    label: string;
    value: string | number;
  } | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<{
    label: string;
    value: string | number;
  } | null>(null);

  const requestTypes = [
    { label: 'Short-term', value: 'short-term' },
    { label: 'Long-term', value: 'long-term' },
  ];
  const serviceTypes = [
    { label: 'Cleaning', value: 'cleaning' },
    { label: 'Cooking', value: 'cooking' },
    { label: 'Elderly Care', value: 'elderly-care' },
  ];

  //  Handle request type change
  const handleSelectRequestType = (value: {
    label: string;
    value: string | number;
  }) => {
    console.log('Selected request type:', value);
    setSelectedRequestType(value);

    onUpdateFormData({
      requestType: value.value as string,
    });

    // Reset dates when changing request type
    if (value.value === 'short-term') {
      // Keep only startDate for short-term
      onUpdateFormData({
        workDates: {
          startDate: formData.workDates?.startDate || '',
          endDate: formData.workDates?.startDate || '',
        },
      });
    }
  };

  const handleSelectServiceType = (value: {
    label: string;
    value: string | number;
  }) => {
    console.log('Selected service type:', value);
    setSelectedServiceType(value);

    onUpdateFormData({
      serviceType: value.value as string,
    });
  };

  // ✅ Handle single date selection (short-term) - now returns string
  const handleSingleDateChange = (dateString: string) => {
    console.log('Selected single date:', dateString);

    onUpdateFormData({
      workDates: {
        startDate: dateString,
        endDate: dateString, // Same date for short-term
      },
    });
  };

  // ✅ Handle date range selection (long-term) - now receives formatted strings
  const handleDateRangeChange = (range: FormattedDateRange | undefined) => {
    console.log('Selected date range:', range);

    if (range) {
      onUpdateFormData({
        workDates: {
          startDate: range.startDate,
          endDate: range.endDate,
        },
      });
    } else {
      onUpdateFormData({
        workDates: {
          startDate: '',
          endDate: '',
        },
      });
    }
  };

  return (
    <>
      {/* Vùng thongtin don hang */}
      <div className="bg-overlay-slider/8 shadow-around max-tablet:mb-20 my-6 w-full rounded-md px-4 pt-2 pb-4">
        {/* TITLE */}
        <div className="text-overlay-slider mx-2 mt-4 mb-5 flex flex-row items-center font-bold">
          <ClipboardList className="-mt-1 mr-2 h-5 w-5" />
          <p className="text-sm">ORDER INFORMATION</p>
        </div>
        {/* INPUTS Phone, Full Name */}
        <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-2 gap-4">
          <div className="flex-1">
            <LabelDropdown
              label="Service Type"
              options={serviceTypes}
              handleSelect={handleSelectServiceType}
              className="w-full"
              labelClassName="w-full"
              triggerLabel="Choose service type"
              triggerClassName="h-10 cursor-pointer"
              selectedValue={selectedServiceType}
            />
          </div>

          <div className="flex-1">
            {' '}
            <LabelDropdown
              label="Request Type"
              options={requestTypes}
              handleSelect={handleSelectRequestType}
              className="w-full"
              labelClassName="w-full"
              triggerLabel="Choose request type"
              triggerClassName="h-10 cursor-pointer"
              selectedValue={selectedRequestType}
            />
          </div>
        </div>{' '}
        <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-3 gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="time-picker" className="px-1">
              Start Time
            </Label>
            <Input
              type="time"
              id="time-picker"
              step="1"
              defaultValue="10:30:00"
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="time-picker" className="px-1">
              End Time
            </Label>
            <Input
              type="time"
              id="time-picker"
              step="1"
              defaultValue="10:30:00"
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
          {selectedRequestType?.value === 'long-term' ? (
            <div className="w-full flex-1">
              <div className="flex flex-col gap-3">
                <Label htmlFor="date-range" className="px-1">
                  Select Date Range
                </Label>
                <DateRangePicker
                  placeholder="Select date range"
                  onChange={handleDateRangeChange}
                  className="cursor-pointer"
                  classNameTrigger="rounded-md h-10"
                  minDate={new Date()}
                  value={{
                    startDate: formData.workDates?.startDate || '',
                    endDate: formData.workDates?.endDate || '',
                  }}
                  quickSelectionMode="future"
                />
              </div>
            </div>
          ) : selectedRequestType?.value === 'short-term' ? (
            <div className="w-full flex-1">
              <DatePicker
                label="Service Date"
                classNameTrigger="w-full h-10"
                value={formData.workDates?.startDate || ''}
                onChange={handleSingleDateChange}
                minDate={new Date()}
                required={true}
              />
            </div>
          ) : (
            <div className="max-desktop:mt-6 flex w-full flex-1 items-center justify-center">
              <div className="text-muted-foreground text-center">
                <p className="text-sm">Please select request type first</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InformationOrderArea;
