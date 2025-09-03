import { useEffect, useState } from 'react';

import { BriefcaseBusiness, X } from 'lucide-react';

import LabelDropdown from '@/components/common/dropdowns/LabelDropdown';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGetServices } from '@/hooks/api/useServices.api';
import type { MaidFormData } from '@/types/schema/maid-form-schema-type';

interface JobInformationAreaProps {
  data: MaidFormData;
  onUpdate: (updates: Partial<MaidFormData>) => void;
  mode?: 'create' | 'edit';
  coefficientList?: any[];
}

const JobInformationArea: React.FC<JobInformationAreaProps> = ({
  data,
  onUpdate,
  mode,
  coefficientList = [],
}) => {
  const [serviceOptions, setServiceOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [coefficientOptions, setCoefficientOptions] = useState<
    { label: string; value: number }[]
  >([]);

  // Fetch services for dropdown
  const { data: servicesData } = useGetServices({
    page: 1,
    limit: 100, // Get all services
  });

  useEffect(() => {
    if (servicesData?.services) {
      const options = servicesData.services.map((service) => ({
        label: service.title,
        value: service._id,
      }));
      setServiceOptions(options);
    }
  }, [servicesData]);

  // Process coefficient list for dropdown options
  useEffect(() => {
    if (coefficientList && coefficientList.length > 0) {
      const options = coefficientList
        .filter((coeff: any) => !coeff.deleted && coeff.status === 'active')
        .map((coeff: any) => ({
          label: `${coeff.title} (${coeff.value})`,
          value: coeff.value,
        }));
      setCoefficientOptions(options);
    }
  }, [coefficientList]);

  const handleJobSelect = (selectedJob: { label: string; value: string }) => {
    // Check if job already selected
    const isAlreadySelected = data.jobs.some(
      (job) => job.value === selectedJob.value
    );

    if (!isAlreadySelected) {
      onUpdate({
        jobs: [...data.jobs, selectedJob],
      });
    }
  };

  const removeJob = (jobId: string) => {
    onUpdate({
      jobs: data.jobs.filter((job) => job.value !== jobId),
    });
  };

  const handleExperienceChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onUpdate({
      experienceDescription: e.target.value,
    });
  };

  const handleBaseFactorSelect = (selectedFactor: {
    label: string;
    value: number;
  }) => {
    onUpdate({
      baseFactor: selectedFactor,
    });
  };

  return (
    <div className="bg-overlay-slider/8 mb-6 rounded-lg p-6">
      <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
        <BriefcaseBusiness className="-mt-1 mr-2 h-5.5 w-5.5" />
        <p className="text-sm">JOB INFORMATION</p>
      </div>

      <div className="space-y-4">
        {/* Jobs Selection */}
        <div>
          <LabelDropdown
            label="Services"
            triggerLabel="Select services"
            options={serviceOptions}
            handleSelect={handleJobSelect}
          />

          {/* Selected Jobs */}
          {data.jobs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {data.jobs.map((job) => (
                <div
                  key={job.value}
                  className="bg-overlay-slider/10 text-overlay-slider flex items-center gap-2 rounded-full px-3 py-1 text-sm"
                >
                  <span>{job.label}</span>
                  <button
                    type="button"
                    onClick={() => removeJob(job.value)}
                    className="text-overlay-slider/70 hover:text-overlay-slider flex items-center justify-center rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Base Factor Selection - Only show in edit mode */}
        {mode === 'edit' && coefficientOptions.length > 0 && (
          <div>
            <LabelDropdown
              label="Base Factor"
              triggerLabel={data.baseFactor?.label || 'Select base factor'}
              options={coefficientOptions}
              handleSelect={handleBaseFactorSelect}
            />
          </div>
        )}

        {/* Experience Description */}
        <div>
          <Label className="mb-2 block text-sm text-gray-700">
            Experience Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            placeholder="Describe your work experience..."
            value={data.experienceDescription}
            onChange={handleExperienceChange}
            className="focus:border-overlay-slider hover:border-overlay-slider/50 min-h-[120px] border-gray-400/60 bg-white"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default JobInformationArea;
