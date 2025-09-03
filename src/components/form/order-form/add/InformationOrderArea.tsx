import { useEffect, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';

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
  checkDateRangeIsWeekend,
  getActiveCoefficients,
} from '@/helpers/detect-ot-and-coefficients';
import type { CustomerAreaProps } from '@/types/params/order-params';
import type { ServiceOption } from '@/types/table/objects/services';

const InformationOrderArea = ({
  form,
  serviceList = [],
  systemSetting,
  coefficientOther = [],
  onSetDataForCalculate,
}: CustomerAreaProps) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const watchedServiceTitle = watch('serviceTitle');
  const watchedServiceBasePrice = watch('serviceBasePrice');
  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');
  const watchedStartTime = watch('startTime');
  const watchedEndTime = watch('endTime');
  const watchedCoefficientService = watch('coefficient_service');
  const watchedCoefficientOther = watch('coefficient_other');

  const serviceTypes = useMemo((): ServiceOption[] => {
    return serviceList.map((service: any) => ({
      label: `${service.title} - ${new Intl.NumberFormat('vi-VN').format(service.basicPrice)}₫`,
      value: service.serviceId,
      serviceData: {
        title: service.title,
        cost: service.basicPrice,
        coefficient_service: service.costFactorType?.value || 1,
      },
    }));
  }, [serviceList]);

  const [selectedRequestType, setSelectedRequestType] = useState<{
    label: string;
    value: string | number;
  } | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<{
    label: string;
    value: string | number;
  } | null>(null);

  const requestTypes = [
    { label: 'Short-term', value: 'shortTerm' },
    { label: 'Long-term', value: 'longTerm' },
  ];

  const minTime = systemSetting?.openHour || '06:00';

  //  Handle request type change
  const handleSelectRequestType = (value: {
    label: string;
    value: string | number;
  }) => {
    setSelectedRequestType(value);

    setValue('requestType', value.value as 'shortTerm' | 'longTerm', {
      shouldValidate: true,
    });

    if (value.value === 'shortTerm') {
      // Keep only startDate for shortTerm
      setValue('startDate', watchedStartDate || '', { shouldValidate: true });
      setValue('endDate', watchedStartDate || '', { shouldValidate: true });
    } else {
      // Reset both dates for longTerm
      setValue('startDate', '', { shouldValidate: true });
      setValue('endDate', '', { shouldValidate: true });
    }
  };

  const handleSelectServiceType = (value: {
    label: string;
    value: string | number;
  }) => {
    setSelectedServiceType(value);

    const selectedServiceOption = serviceTypes.find(
      (option) => option.value === value.value
    );

    if (selectedServiceOption?.serviceData) {
      setValue('serviceTitle', selectedServiceOption.serviceData.title, {
        shouldValidate: true,
      });
      setValue('serviceBasePrice', selectedServiceOption.serviceData.cost, {
        shouldValidate: true,
      });
      setValue(
        'coefficient_service',
        selectedServiceOption.serviceData.coefficient_service,
        {
          shouldValidate: true,
        }
      );
    }
  };

  //   Update single date handler
  const handleSingleDateChange = (dateString: string) => {
    setValue('startDate', dateString, { shouldValidate: true });
    setValue('endDate', dateString, { shouldValidate: true }); // Same date for shortTerm
  };

  const handleDateRangeChange = (range: FormattedDateRange | undefined) => {
    if (range) {
      setValue('startDate', range.startDate, { shouldValidate: true });
      setValue('endDate', range.endDate, { shouldValidate: true });
    } else {
      setValue('startDate', '', { shouldValidate: true });
      setValue('endDate', '', { shouldValidate: true });
    }
  };

  const handleStartTimeChange = (time: string) => {
    setValue('startTime', time, { shouldValidate: true });
    setValue('endTime', '', { shouldValidate: true }); // Reset end time when start time changes
  };

  const handleEndTimeChange = (time: string) => {
    setValue('endTime', time, { shouldValidate: true });
  };

  const checkSelectedDateInPastTime = (): string => {
    return watchedStartDate || '';
  };

  useEffect(() => {
    if (
      watchedCoefficientService &&
      watchedStartTime &&
      watchedEndTime &&
      watchedStartDate &&
      watchedEndDate &&
      systemSetting &&
      coefficientOther
    ) {
      const activeCoeffs = getActiveCoefficients(coefficientOther);

      const hoursBreakdown = calculateOvertimeHours(
        watchedStartTime,
        watchedEndTime,
        systemSetting
      );

      let coefficient_ot = 1;
      let coefficient_other = 1;
      const isWeekend = checkDateRangeIsWeekend(
        watchedStartDate,
        watchedEndDate
      );

      if (hoursBreakdown.overtimeHours > 0) {
        coefficient_ot = activeCoeffs.overtime;
      }

      if (isWeekend) {
        coefficient_other = activeCoeffs.weekend;
      }

      //   Update coefficients using setValue
      if (
        watch('coefficient_ot') !== coefficient_ot ||
        watchedCoefficientOther !== coefficient_other
      ) {
        setValue('coefficient_ot', coefficient_ot, { shouldValidate: true });
        setValue('coefficient_other', coefficient_other, {
          shouldValidate: true,
        });
      }

      //   Prepare calculation data with current form values
      const currentFormData = {
        serviceTitle: watchedServiceTitle,
        serviceBasePrice: watchedServiceBasePrice,
        coefficient_service: watchedCoefficientService,
        coefficient_ot,
        coefficient_other,
        startDate: watchedStartDate,
        endDate: watchedEndDate,
        startTime: watchedStartTime,
        endTime: watchedEndTime,
      };

      const dataForCalculation = {
        hoursBreakdown,
        activeCoeffs,
        formData: currentFormData,
      };

      if (onSetDataForCalculate) {
        onSetDataForCalculate(dataForCalculation);
      }
    } else {
      if (onSetDataForCalculate) {
        onSetDataForCalculate(null);
      }
    }
  }, [
    watchedCoefficientService,
    watchedCoefficientOther,
    watchedStartTime,
    watchedEndTime,
    watchedStartDate,
    watchedEndDate,
    watchedServiceBasePrice,
    systemSetting,
    coefficientOther,
    onSetDataForCalculate,
    setValue,
    watch,
  ]);

  //   REPLACE generateEndTimeOptions with this corrected logic
  const generateEndTimeOptions = useMemo(() => {
    if (!watchedStartTime) return [];

    const [startHour, startMinute] = watchedStartTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;

    const closeTime = systemSetting?.closeHour || '22:00';
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
    const maxTotalMinutes = closeHour * 60 + closeMinute;

    const options: string[] = [];

    for (let hourIncrement = 2; hourIncrement <= 24; hourIncrement += 1) {
      const endTotalMinutes = startTotalMinutes + hourIncrement * 60;

      if (endTotalMinutes > maxTotalMinutes) break;

      const endHour = Math.floor(endTotalMinutes / 60);
      const endMinute = startMinute;

      const timeString = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      options.push(timeString);
    }

    return options;
  }, [watchedStartTime, systemSetting?.closeHour]);

  const getMaxStartTime = useMemo(() => {
    const closeTime = systemSetting?.closeHour || '22:00';
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const maxStartHour = closeHour - 2;
    const maxStartMinute = closeMinute;

    return `${maxStartHour.toString().padStart(2, '0')}:${maxStartMinute.toString().padStart(2, '0')}`;
  }, [systemSetting?.closeHour]);

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
            <Controller
              name="serviceTitle"
              control={control}
              render={({ fieldState: { error } }) => (
                <>
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
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="flex-1">
            {/* Request Type doesn't need Controller as it's not a form field */}
            <Controller
              name="requestType"
              control={control}
              render={({ fieldState: { error } }) => (
                <>
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
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>{' '}
        <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-3 gap-4">
          <Controller
            name="startTime"
            control={control}
            render={({ fieldState: { error } }) => (
              <>
                <TimePickerDropdown
                  label="Start Time"
                  value={watchedStartTime || ''}
                  onChange={handleStartTimeChange}
                  minTime={minTime}
                  maxTime={getMaxStartTime}
                  stepMinutes={30}
                  checkSelectedDateInPastTime={checkSelectedDateInPastTime()}
                  placeholder="Select start time"
                />
              </>
            )}
          />

          {/*  End Time Picker */}
          <Controller
            name="endTime"
            control={control}
            render={({ fieldState: { error } }) => (
              <div className="flex-1">
                <TimePickerDropdown
                  label="End Time"
                  value={watchedEndTime || ''}
                  onChange={handleEndTimeChange}
                  disabled={!watchedStartTime}
                  customOptions={generateEndTimeOptions}
                  placeholder={
                    watchedStartTime
                      ? 'Select end time'
                      : 'Select start time first'
                  }
                  className="w-full"
                />
                {error && (
                  <p className="mt-4 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />

          {selectedRequestType?.value === 'longTerm' ? (
            <Controller
              name="startDate"
              control={control}
              render={({ fieldState: { error } }) => (
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
                        startDate: watchedStartDate || '',
                        endDate: watchedEndDate || '',
                      }}
                      quickSelectionMode="future"
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-500">
                        {error.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            />
          ) : selectedRequestType?.value === 'shortTerm' ? (
            <Controller
              name="startDate"
              control={control}
              render={({ fieldState: { error } }) => (
                <div className="w-full flex-1">
                  <DatePicker
                    label="Service Date"
                    classNameTrigger="w-full h-10"
                    value={watchedStartDate || ''}
                    onChange={handleSingleDateChange}
                    minDate={new Date()}
                    required={true}
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />
          ) : (
            <div className="max-desktop:mt-6 flex w-full flex-1 items-center justify-center">
              <div className="text-muted-foreground text-center">
                <p className="desktop:mt-6 text-sm">
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
