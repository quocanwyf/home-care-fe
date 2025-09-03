import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Building, DollarSign, Settings, User } from 'lucide-react';

import DatePicker from '@/components/common/date-picker/DatePicker';
import LabelDropdown from '@/components/common/dropdowns/LabelDropdown';
import InputLabel from '@/components/common/input/InputLabel';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import { Button } from '@/components/ui/button';
import {
  maxAgeDate,
  minAgeDate,
  parseDDMMYYYYToDate,
} from '@/helpers/date-utitlity';
import {
  useCreateStaff,
  useGetStaffCreateInfo,
} from '@/hooks/api/useStaffs.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import { useToast } from '@/hooks/common/useToast';
import {
  type StaffFormData,
  staffFormSchema,
} from '@/schema/staff-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';

import StaffUploadArea from './StaffUploadArea';

interface StaffFormProps {
  mode?: 'create' | 'edit';
  staffId?: string;
}

const StaffForm: React.FC<StaffFormProps> = ({ mode = 'create' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigateTo = useAppNavigate();

  const createStaffMutation = useCreateStaff();
  const { data: createInfo, isLoading: isLoadingInfo } =
    useGetStaffCreateInfo();

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      staff_id: '',
      fullName: '',
      password: '',
      birthDate: '',
      phone: '',
      email: '',
      birthPlace: '',
      salary: '',
      role: { label: '', value: '' },
      status: { label: 'Active', value: 'active' },
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = form;

  // State for avatar
  const [avatar, setAvatar] = useState<File[]>([]);

  // Status options
  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // Role options from API
  const roleOptions = useMemo(() => {
    if (createInfo?.roles) {
      return createInfo.roles.map((role) => ({
        label: role.title,
        value: role._id,
      }));
    }
    return [];
  }, [createInfo]);

  // Form validation
  const isFormValid = useMemo(() => {
    return isValid && avatar.length > 0;
  }, [isValid, avatar]);

  const validateForm = (): boolean => {
    if (avatar.length === 0) {
      showError('Avatar is required');
      return false;
    }
    return true;
  };

  const handleSubmitStaff = handleSubmit(
    async (data: StaffFormData) => {
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const formData = new FormData();

        // Add form fields
        formData.append('staff_id', data.staff_id);
        formData.append('fullName', data.fullName);
        formData.append('password', data.password);
        formData.append('birthDate', parseDDMMYYYYToDate(data.birthDate));
        formData.append('phone', data.phone);
        formData.append('email', data.email);
        formData.append('birthPlace', data.birthPlace);
        formData.append('salary', data.salary.replace(/,/g, ''));
        formData.append('role_id', data.role.value);
        formData.append('status', data.status.value);

        // Add avatar file
        if (avatar[0]) {
          formData.append('avatar', avatar[0]);
        }

        const response = await createStaffMutation.mutateAsync(formData);

        if (response.success) {
          showSuccess('Staff created successfully!');
          navigateTo('/staffs', {
            toast: {
              type: 'success',
              message: 'Success!',
            },
            delay: 1000,
          });
        } else {
          showError(response.message || 'Failed to create staff');
        }
      } catch (error: any) {
        console.error('Error creating staff:', error);
        if (error.message.includes('Email existed')) {
          showError('Email already exists. Please use a different email.');
        } else if (error.message.includes('Phone existed')) {
          showError(
            'Phone number already exists. Please use a different phone number.'
          );
        } else {
          showError('Network error occurred. Please try again later.');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    (errors) => {
      console.log('Form validation errors:', errors);

      // Find first error and show it
      const firstErrorField = Object.keys(errors)[0];
      const firstError = errors[firstErrorField as keyof typeof errors];

      if (firstError?.message) {
        showError(`Validation Error: ${firstError.message}`);
      } else if (firstErrorField) {
        showError(
          `Please check the ${firstErrorField.replace(/([A-Z])/g, ' $1').toLowerCase()} field`
        );
      }

      // Check avatar separately since it's not in form
      if (avatar.length === 0) {
        showError('Avatar is required');
      }
    }
  );

  const handleAvatarChange = (files: File[]) => {
    setAvatar(files);
  };

  if (isLoadingInfo) {
    return <LoadingFallback content="Loading staff creation form..." />;
  }

  return (
    <div className="h-full w-full overflow-y-auto py-4 pb-26">
      <form onSubmit={handleSubmitStaff}>
        {/* Personal Information Section */}
        <div className="bg-overlay-slider/8 shadow-around my-6 w-full rounded-md px-4 pt-2 pb-4">
          <div className="text-overlay-slider mx-2 mt-4 mb-5 flex flex-row items-center font-bold">
            <User className="-mt-1 mr-2 h-5.5 w-5.5" />
            <p className="text-sm">PERSONAL INFORMATION</p>
          </div>

          <div className="space-y-4">
            {/* Staff ID, Full Name */}
            <div className="max-tablet:grid-cols-1 grid w-full grid-cols-2 gap-4">
              <Controller
                name="staff_id"
                control={control}
                render={({ field }) => (
                  <InputLabel
                    label={{
                      labelTitle: 'Staff ID',
                      icon: <Building className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'staff_id',
                      className: 'w-full',
                      placeholder: 'Enter staff ID',
                      required: true,
                      value: field.value,
                      onChange: field.onChange,
                    }}
                    error={errors.staff_id?.message}
                  />
                )}
              />

              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <InputLabel
                    label={{
                      labelTitle: 'Full Name',
                      icon: <User className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'fullName',
                      className: 'w-full',
                      placeholder: 'Enter full name',
                      required: true,
                      value: field.value,
                      onChange: field.onChange,
                    }}
                    error={errors.fullName?.message}
                  />
                )}
              />
            </div>

            {/* Password, Birth Date */}
            <div className="max-tablet:grid-cols-1 grid w-full grid-cols-2 gap-4">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <InputLabel
                    label={{
                      labelTitle: 'Password',
                      icon: <Settings className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'password',
                      className: 'w-full',
                      type: 'password',
                      placeholder: 'Enter password',
                      required: true,
                      value: field.value,
                      onChange: field.onChange,
                    }}
                    error={errors.password?.message}
                  />
                )}
              />

              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <div>
                    <DatePicker
                      label="Birth Date"
                      classNameTrigger="w-full h-10"
                      value={field.value}
                      onChange={field.onChange}
                      minDate={maxAgeDate}
                      maxDate={minAgeDate}
                      required={true}
                      allowPastDates={true}
                    />
                    {errors.birthDate && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.birthDate.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Phone, Email */}
            <div className="max-tablet:grid-cols-1 grid w-full grid-cols-2 gap-4">
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <InputLabel
                    label={{
                      labelTitle: 'Phone',
                      icon: <User className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'phone',
                      className: 'w-full',
                      placeholder: 'Enter phone number (e.g., 0901234567)',
                      required: true,
                      value: field.value,
                      onChange: (e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          field.onChange(value);
                        }
                      },
                    }}
                    error={errors.phone?.message}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <InputLabel
                    label={{
                      labelTitle: 'Email',
                      icon: <User className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'email',
                      className: 'w-full',
                      type: 'email',
                      placeholder: 'Enter email (example@domain.com)',
                      required: true,
                      value: field.value,
                      onChange: field.onChange,
                    }}
                    error={errors.email?.message}
                  />
                )}
              />
            </div>

            {/* Birth Place */}
            <Controller
              name="birthPlace"
              control={control}
              render={({ field }) => (
                <InputLabel
                  label={{
                    labelTitle: 'Birth Place',
                    icon: <Building className="h-3 w-3" />,
                  }}
                  input={{
                    inputId: 'birthPlace',
                    className: 'w-full',
                    placeholder: 'Enter birth place',
                    required: true,
                    value: field.value,
                    onChange: field.onChange,
                  }}
                  error={errors.birthPlace?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Job Information Section */}
        <div className="bg-overlay-slider/8 shadow-around my-6 w-full rounded-md px-4 pt-2 pb-4">
          <div className="text-overlay-slider mx-2 mt-4 mb-5 flex flex-row items-center font-bold">
            <Building className="-mt-1 mr-2 h-5.5 w-5.5" />
            <p className="text-sm">JOB INFORMATION</p>
          </div>

          <div className="space-y-4">
            {/* Salary, Role */}
            <div className="max-tablet:grid-cols-1 grid w-full grid-cols-2 gap-4">
              <Controller
                name="salary"
                control={control}
                render={({ field }) => (
                  <InputLabel
                    label={{
                      labelTitle: 'Salary (VND)',
                      icon: <DollarSign className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'salary',
                      className: 'w-full',
                      placeholder: 'Enter salary (e.g., 15,000,000)',
                      required: true,
                      value: field.value
                        ? Number(field.value.replace(/,/g, '')).toLocaleString(
                            'en-US'
                          )
                        : '',
                      onChange: (e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      },
                    }}
                    error={errors.salary?.message}
                  />
                )}
              />

              <Controller
                name="role"
                control={control}
                render={({ fieldState: { error } }) => (
                  <>
                    <LabelDropdown
                      label="Role"
                      options={roleOptions}
                      handleSelect={(selected) => {
                        form.setValue('role', {
                          label: selected.label,
                          value: selected.value as string,
                        });
                      }}
                      triggerLabel="Select role"
                      selectedValue={watch('role').value ? watch('role') : null}
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-500">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Status */}
            <div className="max-tablet:grid-cols-1 grid w-full grid-cols-2 gap-4">
              <Controller
                name="status"
                control={control}
                render={({ fieldState: { error } }) => (
                  <>
                    <LabelDropdown
                      label="Status"
                      options={statusOptions}
                      handleSelect={(selected) => {
                        form.setValue('status', {
                          label: selected.label,
                          value: selected.value as 'active' | 'inactive',
                        });
                      }}
                      triggerLabel="Select status"
                      selectedValue={
                        watch('status').value ? watch('status') : null
                      }
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-500">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Avatar Upload Section */}
        <StaffUploadArea
          avatar={avatar}
          onAvatarChange={handleAvatarChange}
          mode={mode}
        />

        {/* Submit Button */}
        <div className="max-mobile:my-20 my-12 mr-6 mb-16">
          <Button
            type="submit"
            className={`float-right cursor-pointer disabled:cursor-not-allowed ${
              isSubmitting
                ? 'bg-gray-400 hover:bg-gray-400'
                : 'hover:bg-overlay-slider bg-overlay-slider/90 text-white'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting || createStaffMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating...
              </div>
            ) : (
              'Create Staff'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;
