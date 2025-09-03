import { useEffect, useMemo, useState } from 'react';

import LoadingFallback from '@/components/fallback/LoadingFallback';
import { Button } from '@/components/ui/button';
import { parseDDMMYYYYToDate } from '@/helpers/date-utitlity';
import {
  useCreateHelper,
  useGetHelperEdit,
  useUpdateHelper,
} from '@/hooks/api/useHelpers.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import { useToast } from '@/hooks/common/useToast';
import type { MaidFormData } from '@/types/schema/maid-form-schema-type';

import JobInformationArea from './JobInformationArea';
import PersonalInformationArea from './PersonalInformationArea';
import UploadArea from './UploadArea';

interface MaidFormProps {
  mode?: 'create' | 'edit';
  helperId?: string;
}

const MaidForm: React.FC<MaidFormProps> = ({ mode = 'create', helperId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigateTo = useAppNavigate();

  // Password state for edit mode
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const createHelperMutation = useCreateHelper();
  const updateHelperMutation = useUpdateHelper();

  const { data: helperEditData, isLoading: isLoadingHelper } = useGetHelperEdit(
    mode === 'edit' && helperId ? helperId : ''
  );

  const [formData, setFormData] = useState<MaidFormData>({
    helper_id: '',
    fullName: '',
    birthDate: '',
    phone: '',
    birthPlace: '',
    address: '',
    gender: { label: '', value: '' },
    nationality: '',
    educationLevel: { label: '', value: '' },
    height: '',
    weight: '',
    jobs: [],
    experienceDescription: '',
    avatar: [],
    healthCertificates: [],
    baseFactor: { label: '', value: 1 },
    password: mode === 'edit' ? '' : undefined, // Only initialize for edit mode
  });

  useEffect(() => {
    if (mode === 'edit' && helperEditData?.helper) {
      const helper = helperEditData.helper;
      const coefficientList = helperEditData.coefficientList || [];

      console.log('Helper data received:', helperEditData);

      // Convert jobs from API format to form format
      const jobsFormatted = helper.jobs
        ? helper.jobs.map((job: any) => ({
            label: job.title,
            value: job._id,
          }))
        : [];

      // Convert gender to dropdown format
      const genderFormatted = helper.gender
        ? {
            label: helper.gender === 'male' ? 'Male' : 'Female',
            value: helper.gender === 'male' ? 'Male' : 'Female',
          }
        : { label: '', value: '' };

      // Convert education to dropdown format
      const educationFormatted = helper.educationLevel
        ? {
            label:
              helper.educationLevel.charAt(0).toUpperCase() +
              helper.educationLevel.slice(1),
            value:
              helper.educationLevel.charAt(0).toUpperCase() +
              helper.educationLevel.slice(1),
          }
        : { label: '', value: '' };

      // Find baseFactor in coefficientList
      const baseFactorFormatted = (() => {
        if (helper.baseFactor && coefficientList.length > 0) {
          const matchingCoefficient = coefficientList.find(
            (coeff: any) => coeff.value === helper.baseFactor
          );

          if (matchingCoefficient) {
            return {
              label: `${matchingCoefficient.title} (${matchingCoefficient.value})`,
              value: matchingCoefficient.value,
            };
          }
        }
        // Default fallback
        return { label: 'Hệ số bậc lương 1 (1)', value: 1 };
      })();

      // Set form data
      setFormData({
        helper_id: helper.helper_id || '',
        fullName: helper.fullName || '',
        birthDate: helper.birthDate || '',
        phone: helper.phone || '',
        birthPlace: helper.birthPlace || '',
        address: helper.address || '',
        gender: genderFormatted,
        nationality: helper.nationality || '',
        educationLevel: educationFormatted,
        height: helper.height?.toString() || '',
        weight: helper.weight?.toString() || '',
        jobs: jobsFormatted,
        experienceDescription: helper.experienceDescription || '',
        avatar: [],
        healthCertificates: [],
        baseFactor: baseFactorFormatted,
        password: '', // Initialize as empty for edit mode
      });

      // Reset password editing state
      setIsEditingPassword(false);
    }
  }, [mode, helperEditData]);

  // Handle password edit toggle
  const handlePasswordEditToggle = () => {
    if (isEditingPassword) {
      // Cancel editing - clear password field
      setFormData((prev) => ({ ...prev, password: '' }));
      setIsEditingPassword(false);
    } else {
      // Start editing - clear field
      setFormData((prev) => ({ ...prev, password: '' }));
      setIsEditingPassword(true);
    }
  };

  // Update functions for each section
  const updatePersonalInfo = (updates: Partial<MaidFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const updateJobInfo = (updates: Partial<MaidFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const updateFiles = (updates: Partial<MaidFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Check if form is valid for button state
  const isFormValid = useMemo(() => {
    // Check required text fields
    const requiredFields = [
      'helper_id',
      'fullName',
      'phone',
      'birthDate',
      'birthPlace',
      'address',
      'nationality',
      'height',
      'weight',
    ];

    for (const field of requiredFields) {
      if (
        !formData[field as keyof MaidFormData] ||
        (formData[field as keyof MaidFormData] as string).trim() === ''
      ) {
        return false;
      }
    }

    // Check dropdowns
    if (!formData.gender.value || !formData.educationLevel.value) {
      return false;
    }

    // Check jobs array
    if (formData.jobs.length === 0) {
      return false;
    }

    // Check experience description
    if (!formData.experienceDescription.trim()) {
      return false;
    }

    // Check files (avatar and health certificates required for both modes)
    if (
      formData.avatar.length === 0 ||
      formData.healthCertificates.length === 0
    ) {
      return false;
    }

    return true;
  }, [formData, mode]);

  const validateForm = (): boolean => {
    const requiredFields = [
      'helper_id',
      'fullName',
      'phone',
      'birthDate',
      'birthPlace',
      'address',
      'nationality',
      'height',
      'weight',
    ];

    for (const field of requiredFields) {
      if (
        !formData[field as keyof MaidFormData] ||
        (formData[field as keyof MaidFormData] as string).trim() === ''
      ) {
        showError(`${field.replace('_', ' ')} is required`);
        return false;
      }
    }

    // Age validation
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 13) {
        showError('Helper must be at least 13 years old');
        return false;
      }

      if (age > 100) {
        showError('Helper cannot be older than 100 years');
        return false;
      }

      if (birthDate > today) {
        showError('Birth date cannot be in the future');
        return false;
      }
    }

    if (!formData.gender.value) {
      showError('Gender is required');
      return false;
    }

    if (!formData.educationLevel.value) {
      showError('Education level is required');
      return false;
    }

    if (formData.jobs.length === 0) {
      showError('At least one service must be selected');
      return false;
    }

    if (!formData.experienceDescription.trim()) {
      showError('Experience description is required');
      return false;
    }

    if (formData.avatar.length === 0) {
      showError('Avatar is required');
      return false;
    }

    if (formData.healthCertificates.length === 0) {
      showError('Health certificates are required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare FormData for API
      const apiFormData = new FormData();

      // Add text fields
      apiFormData.append('helper_id', formData.helper_id);
      apiFormData.append('fullName', formData.fullName.trim());
      apiFormData.append('birthDate', parseDDMMYYYYToDate(formData.birthDate));
      apiFormData.append('phone', formData.phone.trim());
      apiFormData.append('birthPlace', formData.birthPlace.trim());
      apiFormData.append('address', formData.address.trim());
      apiFormData.append('gender', formData.gender.value);
      apiFormData.append('nationality', formData.nationality.trim());
      apiFormData.append('educationLevel', formData.educationLevel.value);
      apiFormData.append('height', formData.height);
      apiFormData.append('weight', formData.weight);

      // Handle password for different modes
      if (mode === 'create') {
        // Create mode: Don't send password at all
        // No password field appended
      } else {
        // Edit mode: Handle password change
        if (
          isEditingPassword &&
          formData.password &&
          formData.password.trim()
        ) {
          apiFormData.append('hasNewPassword', 'true');
          apiFormData.append('password', formData.password);
        } else {
          apiFormData.append('hasNewPassword', 'false');
          // Don't append password field when not changing
        }
      }

      // Add baseFactor for edit mode
      if (mode === 'edit' && formData.baseFactor?.value) {
        apiFormData.append('baseFactor', formData.baseFactor.value.toString());
      } else if (mode === 'create') {
        apiFormData.append('baseFactor', '1'); // Default value for create
      }

      // Add jobs array
      formData.jobs.forEach((job) => {
        apiFormData.append('jobs[]', job.value);
      });

      apiFormData.append(
        'experienceDescription',
        formData.experienceDescription
      );

      // Add files
      if (formData.avatar[0]) {
        apiFormData.append('avatar', formData.avatar[0]);
      }

      formData.healthCertificates.forEach((file) => {
        apiFormData.append('healthCertificates', file);
      });

      console.log('Submitting form data:', formData);

      let result;
      if (mode === 'create') {
        result = await createHelperMutation.mutateAsync(apiFormData);
      } else {
        console.log('Updating helper with ID:', helperId);
        result = await updateHelperMutation.mutateAsync({
          id: helperId!,
          formData: apiFormData,
        });
      }

      if (result.success) {
        showSuccess(
          `Helper ${mode === 'create' ? 'created' : 'updated'} successfully!`
        );

        // Reset form after success
        if (mode === 'create') {
          setFormData({
            helper_id: '',
            fullName: '',
            birthDate: '',
            phone: '',
            birthPlace: '',
            address: '',
            gender: { label: '', value: '' },
            nationality: '',
            educationLevel: { label: '', value: '' },
            height: '',
            weight: '',
            jobs: [],
            experienceDescription: '',
            avatar: [],
            healthCertificates: [],
            baseFactor: { label: '', value: 1 },
            password: undefined, // Don't include password for create
          });
        }
        navigateTo('/maids', {
          toast: {
            type: 'success',
            message: 'Success!',
          },
          delay: 1000,
        });
      } else {
        // Handle result.success = false case
        const errorMessage = result.message || '';

        if (errorMessage.toLowerCase().includes('existed')) {
          showError(errorMessage + ' Please use different details.');
        } else {
          showError(
            errorMessage || 'Failed to create helper. Please try again.'
          );
        }
      }
    } catch (error: any) {
      console.error('Error creating helper:', error);
      showError('Network error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled =
    isSubmitting ||
    createHelperMutation.isPending ||
    updateHelperMutation.isPending ||
    (mode === 'edit' && isLoadingHelper);

  if (isLoadingHelper) {
    return <LoadingFallback content="Loading helper information..." />;
  }

  return (
    <div className="h-full w-full overflow-y-auto py-4 pb-26">
      <form onSubmit={handleSubmit}>
        <PersonalInformationArea
          data={formData}
          onUpdate={updatePersonalInfo}
          mode={mode}
          isEditingPassword={isEditingPassword}
          onPasswordEditToggle={handlePasswordEditToggle}
        />
        <JobInformationArea
          data={formData}
          onUpdate={updateJobInfo}
          mode={mode}
          coefficientList={helperEditData?.coefficientList || []}
        />
        <UploadArea
          data={formData}
          onUpdate={updateFiles}
          existingAvatar={
            mode === 'edit' && helperEditData?.helper?.avatar
              ? helperEditData.helper.avatar
              : undefined
          }
          existingHealthCertificates={
            mode === 'edit' && helperEditData?.helper?.healthCertificates
              ? helperEditData.helper.healthCertificates
              : []
          }
          mode={mode}
        />

        {/* Submit Button */}
        <div className="max-mobile:my-20 my-12 mr-6 mb-16">
          <Button
            type="submit"
            className={`float-right cursor-pointer disabled:cursor-not-allowed ${
              isButtonDisabled
                ? 'bg-gray-400 hover:bg-gray-400'
                : 'hover:bg-overlay-slider bg-overlay-slider/90'
            }`}
            disabled={isButtonDisabled}
          >
            {isSubmitting ||
            createHelperMutation.isPending ||
            updateHelperMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </div>
            ) : mode === 'create' ? (
              'Create Maid'
            ) : (
              'Update Maid'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MaidForm;
