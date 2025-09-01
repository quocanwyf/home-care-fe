import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/common/useToast';
import type { MaidFormData } from '@/types/schema/maid-form-schema-type';

import JobInformationArea from './JobInformationArea';
import PersonalInformationArea from './PersonalInformationArea';
import UploadArea from './UploadArea';

const MaidForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

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
      apiFormData.append('fullName', formData.fullName);
      apiFormData.append('birthDate', formData.birthDate);
      apiFormData.append('phone', formData.phone);
      apiFormData.append('birthPlace', formData.birthPlace);
      apiFormData.append('address', formData.address);
      apiFormData.append('gender', formData.gender.value);
      apiFormData.append('nationality', formData.nationality);
      apiFormData.append('educationLevel', formData.educationLevel.value);
      apiFormData.append('height', formData.height);
      apiFormData.append('weight', formData.weight);

      // Add jobs array
      apiFormData.append(
        'jobs',
        JSON.stringify(formData.jobs.map((job) => job.value))
      );
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

      console.log('Form data ready for submission:', formData);
      console.log('API FormData prepared');

      // TODO: Call API here
      // const result = await createHelperApi(apiFormData);

      showSuccess('Helper created successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      showError('Failed to create helper');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="float-right cursor-pointer disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
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
