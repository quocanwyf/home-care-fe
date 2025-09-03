import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Building, DollarSign, FileText, Settings } from 'lucide-react';

import LabelDropdown from '@/components/common/dropdowns/LabelDropdown';
import InputLabel from '@/components/common/input/InputLabel';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateService,
  useGetServiceEdit,
  useUpdateService,
} from '@/hooks/api/useServices.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import { useToast } from '@/hooks/common/useToast';
import {
  type ServiceFormData,
  serviceFormSchema,
} from '@/schema/service-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';

interface ServiceFormProps {
  mode?: 'create' | 'edit';
  serviceId?: string;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  mode = 'create',
  serviceId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigateTo = useAppNavigate();

  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();

  const { data: editInfo, isLoading: isLoadingEdit } = useGetServiceEdit(
    mode === 'edit' && serviceId ? serviceId : ''
  );

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      serviceTitle: '',
      basicPrice: '',
      serviceDescription: '',
      serviceStatus: { label: 'Active', value: 'active' },
      coefficientTitle: '',
      coefficientDescription: '',
      coefficientValue: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = form;

  // Load data for edit mode
  useEffect(() => {
    if (mode === 'edit' && editInfo?.result) {
      const service = editInfo.result;
      const coefficient = service.coefficient;

      console.log('Service edit data received:', editInfo);

      // Set form data
      reset({
        serviceTitle: service?.title || '',
        basicPrice: service?.basicPrice ? service.basicPrice.toString() : '',
        serviceDescription: service?.description || '',
        serviceStatus: {
          label: service?.status === 'active' ? 'Active' : 'Inactive',
          value: service?.status,
        },
        coefficientTitle: coefficient?.title || '',
        coefficientDescription: coefficient?.description || '',
        coefficientValue: coefficient?.value
          ? coefficient.value.toString()
          : '',
      });
    }
  }, [mode, editInfo, reset]);

  // Status options
  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // Form validation
  const isFormValid = useMemo(() => {
    return isValid;
  }, [isValid]);

  const handleSubmitService = handleSubmit(
    async (data: ServiceFormData) => {
      setIsSubmitting(true);

      try {
        // Prepare payload according to API spec
        const payload = {
          service: {
            title: data.serviceTitle,
            basicPrice: Number(data.basicPrice.replace(/,/g, '')),
            description: data.serviceDescription,
            status: data.serviceStatus.value,
          },
          coefficient: {
            title: data.coefficientTitle,
            description: data.coefficientDescription,
            value: Number(data.coefficientValue),
            status: 'active', // Default to active for coefficient
          },
        };

        console.log('Submitting service payload:', payload);

        let response;
        if (mode === 'create') {
          response = await createServiceMutation.mutateAsync(payload);
        } else {
          response = await updateServiceMutation.mutateAsync({
            id: serviceId!,
            payload,
          });
        }

        if (response.success) {
          showSuccess(
            `Service ${mode === 'create' ? 'created' : 'updated'} successfully!`
          );
          navigateTo('/services', {
            toast: {
              type: 'success',
              message: 'Success!',
            },
            delay: 1000,
          });
        } else {
          showError(response.message || `Failed to ${mode} service`);
        }
      } catch (error: any) {
        console.error(`Error ${mode} service:`, error);
        if (error.message.includes('Server error')) {
          showError('Server error occurred. Please try again later.');
        } else {
          showError('Network error occurred. Please try again later.');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    (errors) => {
      console.log('Form validation errors:', errors);
      const firstErrorField = Object.keys(errors)[0];
      const firstError = errors[firstErrorField as keyof typeof errors];

      if (firstError?.message) {
        showError(`Validation Error: ${firstError.message}`);
      }
    }
  );

  // Loading states
  if (mode === 'edit' && isLoadingEdit) {
    return <LoadingFallback content={`Loading service ${mode} form...`} />;
  }

  return (
    <div className="h-full w-full overflow-y-auto py-4 pb-26">
      <form onSubmit={handleSubmitService}>
        {/* Service Information Section */}
        <div className="bg-overlay-slider/8 shadow-around my-6 w-full rounded-md px-4 pt-2 pb-4">
          <div className="text-overlay-slider mx-2 mt-4 mb-5 flex flex-row items-center font-bold">
            <Building className="-mt-1 mr-2 h-5.5 w-5.5" />
            <p className="text-sm">SERVICE INFORMATION</p>
          </div>

          <div className="space-y-4">
            {/* Service Title, Basic Price */}
            <div className="max-tablet:grid-cols-1 grid w-full grid-cols-2 gap-4">
              <Controller
                name="serviceTitle"
                control={control}
                render={({ field }) => (
                  <InputLabel
                    label={{
                      labelTitle: 'Service Title',
                      icon: <Building className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'serviceTitle',
                      className: 'w-full',
                      placeholder: 'Enter service title',
                      required: true,
                      value: field.value,
                      onChange: field.onChange,
                    }}
                    error={errors.serviceTitle?.message}
                  />
                )}
              />

              <Controller
                name="basicPrice"
                control={control}
                render={({ field }) => (
                  <InputLabel
                    label={{
                      labelTitle: 'Basic Price (VND)',
                      icon: <DollarSign className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'basicPrice',
                      className: 'w-full',
                      placeholder: 'Enter basic price (e.g., 500,000)',
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
                    error={errors.basicPrice?.message}
                  />
                )}
              />
            </div>

            {/* Service Status */}
            <div className="max-tablet:grid-cols-1 grid w-full grid-cols-2 gap-4">
              <Controller
                name="serviceStatus"
                control={control}
                render={({ fieldState: { error } }) => (
                  <>
                    <LabelDropdown
                      label="Service Status"
                      options={statusOptions}
                      handleSelect={(selected) => {
                        setValue('serviceStatus', {
                          label: selected.label,
                          value: selected.value as 'active' | 'inactive',
                        });
                      }}
                      triggerLabel="Select status"
                      selectedValue={
                        watch('serviceStatus').value
                          ? watch('serviceStatus')
                          : null
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

            {/* Service Description */}
            <div>
              <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
                <FileText className="mr-2 h-3 w-3" />
                Service Description
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="serviceDescription"
                control={control}
                render={({ field }) => (
                  <>
                    <Textarea
                      {...field}
                      placeholder="Enter detailed description of the service..."
                      className="min-h-[100px] w-full"
                      required
                    />
                    {errors.serviceDescription && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.serviceDescription.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Coefficient Information Section */}
        <div className="bg-overlay-slider/8 shadow-around my-6 w-full rounded-md px-4 pt-2 pb-4">
          <div className="text-overlay-slider mx-2 mt-4 mb-5 flex flex-row items-center font-bold">
            <Settings className="-mt-1 mr-2 h-5.5 w-5.5" />
            <p className="text-sm">COEFFICIENT INFORMATION</p>
          </div>

          <div className="space-y-4">
            {/* Coefficient Title, Value */}
            <div className="max-tablet:grid-cols-1 grid w-full grid-cols-2 gap-4">
              <Controller
                name="coefficientTitle"
                control={control}
                render={({ field }) => (
                  <InputLabel
                    label={{
                      labelTitle: 'Coefficient Title',
                      icon: <Settings className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'coefficientTitle',
                      className: 'w-full',
                      placeholder: 'Enter coefficient title',
                      required: true,
                      value: field.value,
                      onChange: field.onChange,
                    }}
                    error={errors.coefficientTitle?.message}
                  />
                )}
              />

              <Controller
                name="coefficientValue"
                control={control}
                render={({ field }) => (
                  <InputLabel
                    label={{
                      labelTitle: 'Coefficient Value',
                      icon: <Settings className="h-3 w-3" />,
                    }}
                    input={{
                      inputId: 'coefficientValue',
                      className: 'w-full',
                      type: 'number',
                      step: '0.1',
                      min: '0.1',
                      max: '10',
                      placeholder: 'Enter coefficient value (e.g., 1.5)',
                      required: true,
                      value: field.value,
                      onChange: field.onChange,
                    }}
                    error={errors.coefficientValue?.message}
                  />
                )}
              />
            </div>

            {/* Coefficient Description */}
            <div>
              <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
                <FileText className="mr-2 h-3 w-3" />
                Coefficient Description
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="coefficientDescription"
                control={control}
                render={({ field }) => (
                  <>
                    <Textarea
                      {...field}
                      placeholder="Enter description for the coefficient..."
                      className="min-h-[80px] w-full"
                      required
                    />
                    {errors.coefficientDescription && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.coefficientDescription.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="max-mobile:my-20 my-12 mr-6 mb-16">
          <Button
            type="submit"
            className={`float-right cursor-pointer disabled:cursor-not-allowed ${
              !isFormValid || isSubmitting
                ? 'bg-gray-400 hover:bg-gray-400'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ||
            createServiceMutation.isPending ||
            updateServiceMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </div>
            ) : mode === 'create' ? (
              'Create Service'
            ) : (
              'Update Service'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
