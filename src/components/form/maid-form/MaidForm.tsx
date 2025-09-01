import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { parseDDMMYYYYToDate } from '@/helpers/date-utitlity';
import { useCreateHelper } from '@/hooks/api/useHelpers.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import { useToast } from '@/hooks/common/useToast';
import type { MaidFormData } from '@/types/schema/maid-form-schema-type';

import JobInformationArea from './JobInformationArea';
import PersonalInformationArea from './PersonalInformationArea';
import UploadArea from './UploadArea';

const MaidForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigateTo = useAppNavigate();

  const createHelperMutation = useCreateHelper();

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
  });

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

    // Check files
    if (
      formData.avatar.length === 0 ||
      formData.healthCertificates.length === 0
    ) {
      return false;
    }

    return true;
  }, [formData]);

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

    if (formData.birthDate) {
      // Fix: Sử dụng parseDDMMYYYYToDate thay vì new Date()
      const birthDate = parseDDMMYYYYToDate(formData.birthDate);

      // Check if date is valid
      if (!birthDate || isNaN(birthDate.getTime())) {
        showError('Please enter a valid birth date');
        return false;
      }

      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today

      console.log('Birth date string:', formData.birthDate);
      console.log('Parsed birth date:', birthDate);
      console.log('Today:', today);
      console.log('Is birth date > today?', birthDate > today);

      // Check if birth date is in the future
      if (birthDate > today) {
        showError('Birth date cannot be in the future');
        return false;
      }

      // Calculate age
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      console.log('Calculated age:', age);

      if (age < 13) {
        showError('Helper must be at least 13 years old');
        return false;
      }

      if (age > 100) {
        showError('Helper cannot be older than 100 years');
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
      console.log('test loz', formData.jobs);
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

      const result = await createHelperMutation.mutateAsync(apiFormData);

      console.log('Create helper result:', result);

      if (result.success) {
        showSuccess('Helper created successfully!');

        // Reset form after success
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
        });
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
          showError(errorMessage + 'Please use different details.');
        } else {
          showError(
            errorMessage || 'Failed to create helper. Please try again.'
          );
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error creating helper:', error);
      showError('Network error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled =
    !isFormValid || isSubmitting || createHelperMutation.isPending;

  return (
    <div className="h-full w-full overflow-y-auto py-4 pb-26">
      <form onSubmit={handleSubmit}>
        <PersonalInformationArea
          data={formData}
          onUpdate={updatePersonalInfo}
        />
        <JobInformationArea data={formData} onUpdate={updateJobInfo} />
        <UploadArea onUpdate={updateFiles} />

        {/* Submit Button */}
        <div className="max-mobile:my-20 my-12 mr-6 mb-16">
          <Button
            type="submit"
            className={`float-right cursor-pointer disabled:cursor-not-allowed ${
              isButtonDisabled
                ? 'bg-gray-400 hover:bg-gray-400'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isButtonDisabled}
          >
            {isSubmitting || createHelperMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating...
              </div>
            ) : (
              'Create Helper'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MaidForm;
