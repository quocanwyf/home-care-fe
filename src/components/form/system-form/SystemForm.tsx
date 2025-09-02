import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  Building,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Settings,
} from 'lucide-react';

import TimePickerDropdown from '@/components/common/dropdowns/TimePickerDropdown';
import InputLabel from '@/components/common/input/InputLabel';
import FailLoadingAndEntry from '@/components/fallback/FailLoadingAndEntry';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import PageHeader from '@/components/table/app-table/PageHeader';
import { Button } from '@/components/ui/button';
import {
  useGetSystemConfig,
  useUpdateSystemConfig,
} from '@/hooks/api/useSystem.api';
import {
  type SystemFormData,
  systemFormSchema,
} from '@/schema/system-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';

const SystemForm = () => {
  const { data: systemData, isLoading, error } = useGetSystemConfig();
  const updateSystemMutation = useUpdateSystemConfig();

  const form = useForm<SystemFormData>({
    resolver: zodResolver(systemFormSchema),
    defaultValues: {
      baseSalary: 0,
      openHour: '',
      closeHour: '',
      officeStartTime: '',
      officeEndTime: '',
      companyName: '',
      companyEmail: '',
      companyAddress: '',
      companyPhone: '',
    },
  });

  const { control, handleSubmit, reset, watch } = form;

  // Watch values for validation
  const watchedOpenHour = watch('openHour');
  const watchedCloseHour = watch('closeHour');
  const watchedOfficeStartTime = watch('officeStartTime');

  // Helper function to calculate minimum time (add 30 minutes)
  const addThirtyMinutes = (timeString: string): string => {
    if (!timeString) return '00:30';

    const [hours, minutes] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + 30; // Add 30 minutes

    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;

    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  // Helper function to calculate maximum time (subtract 30 minutes)
  const subtractThirtyMinutes = (timeString: string): string => {
    if (!timeString) return '23:30';

    const [hours, minutes] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes - 30; // Subtract 30 minutes

    // Handle negative minutes (e.g., 00:00 - 30 minutes = 23:30 previous day)
    const adjustedMinutes =
      totalMinutes < 0 ? totalMinutes + 24 * 60 : totalMinutes;

    const newHours = Math.floor(adjustedMinutes / 60) % 24;
    const newMinutes = adjustedMinutes % 60;

    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  // Helper function to calculate minimum time (add 2 hours)
  const addTwoHours = (timeString: string): string => {
    if (!timeString) return '02:00';

    const [hours, minutes] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + 120; // Add 2 hours (120 minutes)

    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;

    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  // Load data when API response is available
  useEffect(() => {
    if (systemData?.success && systemData.generalSetting) {
      reset(systemData.generalSetting);
    }
  }, [systemData, reset]);

  const onSubmit = (data: SystemFormData) => {
    updateSystemMutation.mutate(data);
  };

  if (isLoading) {
    return <LoadingFallback content="Loading order information..." />;
  }

  //  Show error state
  if (error) {
    return <FailLoadingAndEntry content="Failed to load order information" />;
  }

  return (
    <div className="">
      {/* Page Header */}
      <PageHeader
        pageHeaderTitle="System Configuration"
        showAddButton={false}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information Section */}
        <div className="bg-overlay-slider/8 shadow-around my-6 w-full rounded-md px-4 pt-2 pb-4">
          {/* TITLE */}
          <div className="text-overlay-slider mx-2 mt-4 mb-5 flex flex-row items-center font-bold">
            <Building className="-mt-1 mr-2 h-5.5 w-5.5" />
            <p className="text-sm">COMPANY INFORMATION</p>
          </div>

          {/* INPUTS Company Name, Email */}
          <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-2 gap-4">
            <div className="flex-1">
              <Controller
                name="companyName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <InputLabel
                    className="px-2"
                    label={{
                      labelTitle: 'Company Name',
                      icon: <Building className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'companyName',
                      className: 'w-full',
                      inputName: 'companyName',
                      placeholder: 'Enter company name',
                      required: true,
                      value: field.value || '',
                      onChange: field.onChange,
                    }}
                    error={error?.message}
                  />
                )}
              />
            </div>

            <div className="flex-1">
              <Controller
                name="companyEmail"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <InputLabel
                    className="px-2"
                    label={{
                      labelTitle: 'Company Email',
                      icon: <Mail className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'companyEmail',
                      className: 'w-full',
                      inputName: 'companyEmail',
                      placeholder: 'Enter company email',
                      required: true,
                      value: field.value || '',
                      onChange: field.onChange,
                    }}
                    error={error?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* INPUTS Phone, Address */}
          <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-2 gap-4">
            <div className="flex-1">
              <Controller
                name="companyPhone"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <InputLabel
                    className="px-2"
                    label={{
                      labelTitle: 'Company Phone',
                      icon: <Phone className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'companyPhone',
                      className: 'w-full',
                      inputName: 'companyPhone',
                      placeholder: 'Enter company phone (10 digits)',
                      required: true,
                      value: field.value || '',
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          field.onChange(value);
                        }
                      },
                    }}
                    error={error?.message}
                  />
                )}
              />
            </div>

            <div className="flex-1">
              <Controller
                name="companyAddress"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <InputLabel
                    className="px-2"
                    label={{
                      labelTitle: 'Company Address',
                      icon: <MapPin className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'companyAddress',
                      className: 'w-full',
                      inputName: 'companyAddress',
                      placeholder: 'Enter company address',
                      required: true,
                      value: field.value || '',
                      onChange: field.onChange,
                    }}
                    error={error?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Business Settings Section */}
        <div className="bg-overlay-slider/8 shadow-around my-6 w-full rounded-md px-4 pt-2 pb-4">
          {/* TITLE */}
          <div className="text-overlay-slider mx-2 mt-4 mb-5 flex flex-row items-center font-bold">
            <DollarSign className="-mt-1 mr-2 h-5.5 w-5.5" />
            <p className="text-sm">BUSINESS SETTINGS</p>
          </div>

          <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-2 gap-4">
            <div className="flex-1">
              <Controller
                name="baseSalary"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <InputLabel
                    className="px-2"
                    label={{
                      labelTitle: 'Base Salary (VND)',
                      icon: <DollarSign className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'baseSalary',
                      className: 'w-full',
                      inputName: 'baseSalary',
                      placeholder: 'Enter base salary',
                      required: true,
                      value: field.value
                        ? field.value.toLocaleString('en-US')
                        : '',
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value ? Number(value) : 0);
                      },
                    }}
                    error={error?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Operating Hours Section */}
        <div className="bg-overlay-slider/8 shadow-around my-6 w-full rounded-md px-4 pt-2 pb-4">
          {/* TITLE */}
          <div className="text-overlay-slider mx-2 mt-4 mb-5 flex flex-row items-center font-bold">
            <Clock className="-mt-1 mr-2 h-5.5 w-5.5" />
            <p className="text-sm">OPERATING HOURS</p>
          </div>

          {/* Business Hours */}
          <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-2 gap-4">
            <div className="flex-1">
              <Controller
                name="openHour"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TimePickerDropdown
                      className="px-2"
                      label="Opening Hour"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select opening hour"
                      minTime="00:00"
                      maxTime="21:30"
                      stepMinutes={30}
                    />
                    {error && (
                      <p className="mt-2 px-2 text-sm text-red-500">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="flex-1">
              <Controller
                name="closeHour"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TimePickerDropdown
                      className="px-2"
                      label="Closing Hour"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select closing hour"
                      minTime={
                        watchedOpenHour ? addTwoHours(watchedOpenHour) : '02:00'
                      }
                      maxTime="23:30"
                      stepMinutes={30}
                    />
                    {error && (
                      <p className="mt-2 px-2 text-sm text-red-500">
                        {error.message}
                      </p>
                    )}
                    {watchedOpenHour && (
                      <p className="mt-1 px-2 text-xs text-gray-500">
                        Minimum time: {addTwoHours(watchedOpenHour)} (2 hours
                        after opening)
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Office Hours */}
          <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-2 gap-4">
            <div className="flex-1">
              <Controller
                name="officeStartTime"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TimePickerDropdown
                      className="px-2"
                      label="Office Start Time"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select office start time"
                      minTime={
                        watchedOpenHour
                          ? addThirtyMinutes(watchedOpenHour)
                          : '00:30'
                      }
                      maxTime={
                        watchedCloseHour
                          ? subtractThirtyMinutes(watchedCloseHour)
                          : '21:30'
                      }
                      stepMinutes={30}
                    />
                    {error && (
                      <p className="mt-2 px-2 text-sm text-red-500">
                        {error.message}
                      </p>
                    )}
                    {watchedOpenHour && (
                      <p className="mt-1 px-2 text-xs text-gray-500">
                        Must be after opening hour:{' '}
                        {addThirtyMinutes(watchedOpenHour)} or later
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="flex-1">
              <Controller
                name="officeEndTime"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TimePickerDropdown
                      className="px-2"
                      label="Office End Time"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select office end time"
                      minTime={
                        watchedOfficeStartTime
                          ? addTwoHours(watchedOfficeStartTime)
                          : '02:00'
                      }
                      maxTime={
                        watchedCloseHour
                          ? subtractThirtyMinutes(watchedCloseHour)
                          : '23:00'
                      }
                      stepMinutes={30}
                    />
                    {error && (
                      <p className="mt-2 px-2 text-sm text-red-500">
                        {error.message}
                      </p>
                    )}
                    <div className="px-2">
                      {watchedOfficeStartTime && (
                        <p className="mt-1 text-xs text-gray-500">
                          Must be at least:{' '}
                          {addTwoHours(watchedOfficeStartTime)} (2 hours after
                          office start)
                        </p>
                      )}
                      {watchedCloseHour && (
                        <p className="mt-1 text-xs text-gray-500">
                          Must be before closing hour:{' '}
                          {subtractThirtyMinutes(watchedCloseHour)} or earlier
                        </p>
                      )}
                    </div>
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end px-4">
          <Button
            type="submit"
            disabled={updateSystemMutation.isPending}
            className="bg-overlay-slider hover:bg-overlay-slider/90 px-8 py-2 text-white"
          >
            {updateSystemMutation.isPending ? (
              <>
                <Settings className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Settings className="mr-2 h-4 w-4" />
                Update System Configuration
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SystemForm;
