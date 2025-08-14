import { useEffect, useMemo, useState } from 'react';

import { on } from 'events';
import { ClipboardList } from 'lucide-react';

import DatePicker from '@/components/common/date-picker/DatePicker';
import {
  DateRangePicker,
  type FormattedDateRange,
} from '@/components/common/date-picker/DateRangePicker';
import LabelDropdown from '@/components/common/dropdowns/LabelDropdown';
import TimePickerDropdown from '@/components/common/dropdowns/TimePickerDropdown';
import { Label } from '@/components/ui/label';
import {
  calculateOvertimeHours,
  getActiveCoefficients,
} from '@/helpers/detect-ot-and-coefficients';
import { addHoursToTime } from '@/helpers/time-utility';
import type { CustomerAreaProps } from '@/types/params/order-params';

const InformationOrderArea = ({
  formData,
  onUpdateFormData,
  serviceList = [],
  systemSetting,
  coefficientOther = [],
}: CustomerAreaProps) => {
  const serviceTypes = useMemo(() => {
    return serviceList.map((service) => ({
      // For dropdown display
      label: `${service.title} - ${new Intl.NumberFormat('vi-VN').format(service.basicPrice)}₫`,
      value: service.serviceId,

      // Data structure theo BE
      serviceData: {
        title: service.title,
        cost: service.basicPrice,
        coefficient_service: service.costFactorType?.value || 1,
        coefficient_other: 1, // Mặc định = 1
      },
    }));
  }, [serviceList]);
  // console.log(formData, onUpdateFormData);
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

  const minTime = systemSetting?.openHour || '06:00';
  const maxTime = systemSetting?.closeHour || '22:00';

  //  Handle request type change
  const handleSelectRequestType = (value: {
    label: string;
    value: string | number;
  }) => {
    setSelectedRequestType(value);

    // Reset dates when changing request type
    if (value.value === 'short-term') {
      // Keep only startDate for short-term
      onUpdateFormData({
        startDate: formData.startDate || '',
        endDate: formData.startDate || '', // Same date for short-term
      });
    } else {
      // Reset both dates for long-term
      onUpdateFormData({
        startDate: '',
        endDate: '',
      });
    }
  };

  const handleSelectServiceType = (value: {
    label: string;
    value: string | number;
  }) => {
    console.log('Selected service type:', value);
    setSelectedServiceType(value);

    // Find selected service data
    const selectedServiceOption = serviceTypes.find(
      (option) => option.value === value.value
    );

    if (selectedServiceOption?.serviceData) {
      onUpdateFormData({
        serviceTitle: selectedServiceOption.serviceData.title,
        serviceBasePrice: selectedServiceOption.serviceData.cost,
        coefficient_service:
          selectedServiceOption.serviceData.coefficient_service,
        coefficient_other: selectedServiceOption.serviceData.coefficient_other,
        // coefficient_ot will be calculated based on time
      });
    }

    console.log('Selected service data:', selectedServiceOption?.serviceData);
  };

  // ✅ Update single date handler
  const handleSingleDateChange = (dateString: string) => {
    console.log('Selected single date:', dateString);

    onUpdateFormData({
      startDate: dateString,
      endDate: dateString, // Same date for short-term
    });
  };

  //  Handle date range selection (long-term) - now receives formatted strings
  const handleDateRangeChange = (range: FormattedDateRange | undefined) => {
    console.log('Selected date range:', range);

    if (range) {
      onUpdateFormData({
        startDate: range.startDate,
        endDate: range.endDate,
      });
    } else {
      onUpdateFormData({
        startDate: '',
        endDate: '',
      });
    }
  };

  const handleStartTimeChange = (time: string) => {
    onUpdateFormData({
      startTime: time,
    });
  };

  const handleEndTimeChange = (time: string) => {
    onUpdateFormData({
      endTime: time,
    });
  };

  const getSelectedDate = (): string => {
    // For short-term, use the single date
    if (selectedRequestType?.value === 'short-term') {
      return formData.startDate || '';
    }
    // For long-term, use the start date
    return formData.startDate || '';
  };

  useEffect(() => {
    if (
      formData.startTime &&
      formData.endTime &&
      systemSetting &&
      coefficientOther
    ) {
      // Get active coefficients
      const activeCoeffs = getActiveCoefficients(coefficientOther);

      // Calculate OT hours
      const hoursBreakdown = calculateOvertimeHours(
        formData.startTime,
        formData.endTime,
        systemSetting
      );

      // ✅ Determine coefficient_ot based on working hours
      let coefficient_ot = 1;

      // If ANY part of work is during OT hours, apply OT coefficient
      if (hoursBreakdown.overtimeHours > 0) {
        coefficient_ot = activeCoeffs.overtime;
      }

      // Update form data with new coefficient and breakdown
      onUpdateFormData({
        coefficient_ot,
      });

      console.log('OT Calculation:', {
        timeRange: `${formData.startTime} - ${formData.endTime}`,
        hoursBreakdown,
        coefficient_ot,
        activeCoeffs,
      });
    }
  }, [
    formData.startTime,
    formData.endTime,
    systemSetting,
    coefficientOther,
    onUpdateFormData,
  ]);

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
          <TimePickerDropdown
            label="Start Time"
            value={formData.startTime || ''}
            onChange={handleStartTimeChange}
            minTime={minTime}
            maxTime={maxTime}
            stepMinutes={30}
            selectedDate={getSelectedDate()}
            placeholder="Select start time"
          />

          {/*  End Time Picker */}
          <TimePickerDropdown
            label="End Time"
            value={formData.endTime || ''}
            onChange={handleEndTimeChange}
            minTime={
              formData.startTime
                ? addHoursToTime(formData.startTime, 2)
                : '07:00'
            } //  Min is start time + 30 min
            maxTime={maxTime}
            stepMinutes={30}
            selectedDate={getSelectedDate()}
            placeholder="Select end time"
          />
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
                    startDate: formData.startDate || '',
                    endDate: formData.endDate || '',
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
                value={formData.startDate || ''}
                onChange={handleSingleDateChange}
                minDate={new Date()}
                required={true}
              />
            </div>
          ) : (
            <div className="max-desktop:mt-6 flex w-full flex-1 items-center justify-center">
              <div className="text-muted-foreground text-center">
                <p className="max-desktop:mt-6 max-tablet:-mt-4 text-sm">
                  Please select request type first
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InformationOrderArea;
