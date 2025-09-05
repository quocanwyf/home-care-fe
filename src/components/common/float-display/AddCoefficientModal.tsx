import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateCoefficient,
  useUpdateSingleCoefficient,
} from '@/hooks/api/useCoefficient.api';
import { useToast } from '@/hooks/common/useToast';
import type { CoefficientCreatePayload } from '@/types/params/coefficient-params';

import AppModal from './AppModal';

interface AddCoefficientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editData?: CoefficientItem | null;
}

interface FormData {
  title: string;
  description: string;
  value: number;
  status: 'active' | 'inactive';
}

const AddCoefficientModal = ({
  isOpen,
  onClose,
  onSuccess,
  editData,
}: AddCoefficientModalProps) => {
  const { showSuccess, showError } = useToast();
  const createCoefficientMutation = useCreateCoefficient();
  const updateCoefficientMutation = useUpdateSingleCoefficient();

  const isEditMode = !!editData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      value: 1.0,
      status: 'active',
    },
  });

  const watchedStatus = watch('status');

  useEffect(() => {
    if (isEditMode && editData) {
      setValue('title', editData.title);
      setValue('description', editData.description);
      setValue('value', editData.value);
      setValue('status', editData.status);
    } else if (!isOpen) {
      reset();
    }
  }, [isOpen, isEditMode, editData, setValue, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditMode && editData) {
        // Edit mode - update single coefficient
        await updateCoefficientMutation.mutateAsync({
          parentId: editData.parentId!,
          coefficientData: {
            _id: editData._id,
            title: data.title,
            description: data.description,
            value: Number(data.value),
            status: data.status,
          },
        });
        showSuccess('Coefficient updated successfully!');
      } else {
        // Add mode
        const payload: CoefficientCreatePayload = {
          title: data.title,
          description: data.description,
          value: Number(data.value),
          status: data.status,
        };
        await createCoefficientMutation.mutateAsync(payload);
        showSuccess('Helper coefficient created successfully!');
      }

      onSuccess?.();
      onClose();
      reset();
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : `Failed to ${isEditMode ? 'update' : 'create'} coefficient`
      );
    }
  };

  const isLoading =
    createCoefficientMutation.isPending || updateCoefficientMutation.isPending;

  const footer = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="add-coefficient-form"
        disabled={isLoading}
        className="bg-orange-500 hover:bg-orange-600"
      >
        {isLoading
          ? isEditMode
            ? 'Updating...'
            : 'Creating...'
          : isEditMode
            ? 'Update Coefficient'
            : 'Create Coefficient'}
      </Button>
    </>
  );

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Coefficient' : 'Add Helper Coefficient'}
      description={
        isEditMode
          ? 'Update coefficient information'
          : 'Create a new coefficient for helper salary calculation'
      }
      width="max-w-md"
      footer={footer}
    >
      <form
        id="add-coefficient-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="e.g., Senior Helper Level"
            {...register('title', {
              required: 'Title is required',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters',
              },
            })}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="e.g., For helpers with 2+ years experience"
            rows={3}
            {...register('description', {
              required: 'Description is required',
              minLength: {
                value: 10,
                message: 'Description must be at least 10 characters',
              },
            })}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Value (Multiplier) */}
        <div className="space-y-2">
          <Label htmlFor="value">
            Multiplier Value <span className="text-red-500">*</span>
          </Label>
          <Input
            id="value"
            type="number"
            step="0.1"
            min="0.1"
            max="10"
            placeholder="1.3"
            {...register('value', {
              required: 'Multiplier value is required',
              min: {
                value: 0.1,
                message: 'Multiplier must be at least 0.1',
              },
              max: {
                value: 10,
                message: 'Multiplier cannot exceed 10',
              },
            })}
            className={errors.value ? 'border-red-500' : ''}
          />
          {errors.value && (
            <p className="text-sm text-red-500">{errors.value.message}</p>
          )}
          <p className="text-sm text-gray-500">
            Base salary will be multiplied by this value
          </p>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watchedStatus}
            onValueChange={(value: 'active' | 'inactive') =>
              setValue('status', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Info Note */}
        <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
          <p className="text-overlay-slider text-sm">
            <strong>Note:</strong> This coefficient will be added to the helper
            coefficient list. Service coefficients are created automatically
            with services, and other coefficients are fixed (overtime, holiday,
            weekend).
          </p>
        </div>
      </form>
    </AppModal>
  );
};

export default AddCoefficientModal;
