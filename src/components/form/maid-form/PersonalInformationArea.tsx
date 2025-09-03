import { SquareUser } from 'lucide-react';

import DatePicker from '@/components/common/date-picker/DatePicker';
import LabelDropdown from '@/components/common/dropdowns/LabelDropdown';
import InputLabel from '@/components/common/input/InputLabel';
import { maxAgeDate, minAgeDate } from '@/helpers/date-utitlity';
import type { MaidFormData } from '@/types/schema/maid-form-schema-type';

interface PersonalInformationAreaProps {
  data: MaidFormData;
  onUpdate: (updates: Partial<MaidFormData>) => void;
}

const PersonalInformationArea: React.FC<PersonalInformationAreaProps> = ({
  data,
  onUpdate,
}) => {
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  const educationOptions = [
    { label: 'Elementary', value: 'Elementary' },
    { label: 'Middle School', value: 'Middle School' },
    { label: 'High School', value: 'High School' },
    { label: 'College', value: 'College' },
    { label: 'University', value: 'University' },
    { label: 'Master', value: 'Master' },
    { label: 'PhD', value: 'PhD' },
  ];

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleDropdownChange = (
    field: string,
    value: { label: string; value: string }
  ) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="bg-overlay-slider/8 mb-6 rounded-lg px-6 py-2 pb-6">
      <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
        <SquareUser className="-mt-1 mr-2 h-5.5 w-5.5" />
        <p className="text-sm">PERSONAL INFORMATION</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Helper ID */}
        <InputLabel
          label={{
            labelTitle: 'ID Card',
            classNameLabel: 'text-gray-700',
          }}
          input={{
            placeholder: 'Enter helper ID',
            value: data.helper_id,
            onChange: (e) =>
              handleInputChange('helper_id', e.target.value.replace(/\D/g, '')),
            required: true,
          }}
        />

        {/* Full Name */}
        <InputLabel
          label={{
            labelTitle: 'Full Name',
            classNameLabel: 'text-gray-700',
          }}
          input={{
            placeholder: 'Enter full name',
            value: data.fullName,
            onChange: (e) => handleInputChange('fullName', e.target.value),
            required: true,
          }}
        />

        {/* Phone */}
        <InputLabel
          label={{
            labelTitle: 'Phone Number',
            classNameLabel: 'text-gray-700',
          }}
          input={{
            placeholder: 'Enter phone number',
            value: data.phone,
            onChange: (e) =>
              handleInputChange('phone', e.target.value.replace(/\D/g, '')),
            required: true,
          }}
        />

        {/* Birth Date */}
        <div>
          <DatePicker
            label="Birth Date"
            value={data.birthDate}
            onChange={(date) => handleInputChange('birthDate', date)}
            minDate={maxAgeDate} // Không được quá 100 tuổi
            maxDate={minAgeDate} // Phải ít nhất 13 tuổi
            required
            allowPastDates={true}
          />
          <p className="mt-1 text-xs text-gray-500">
            Age must be between 13-100 years old
          </p>
        </div>

        {/* Birth Place */}
        <InputLabel
          label={{
            labelTitle: 'Birth Place',
            classNameLabel: 'text-gray-700',
          }}
          input={{
            placeholder: 'Enter birth place',
            value: data.birthPlace,
            onChange: (e) => handleInputChange('birthPlace', e.target.value),
            required: true,
          }}
        />

        {/* Address */}
        <InputLabel
          label={{
            labelTitle: 'Address',
            classNameLabel: 'text-gray-700',
          }}
          input={{
            placeholder: 'Enter address',
            value: data.address,
            onChange: (e) => handleInputChange('address', e.target.value),
            required: true,
          }}
        />

        {/* Gender */}
        <LabelDropdown
          label="Gender"
          triggerLabel="Select gender"
          options={genderOptions}
          selectedValue={data.gender}
          handleSelect={(value) => handleDropdownChange('gender', value)}
        />

        {/* Nationality */}
        <InputLabel
          label={{
            labelTitle: 'Nationality',
            classNameLabel: 'text-gray-700',
          }}
          input={{
            placeholder: 'Enter nationality',
            value: data.nationality,
            onChange: (e) => handleInputChange('nationality', e.target.value),
            required: true,
          }}
        />

        {/* Education Level */}
        <LabelDropdown
          label="Education Level"
          triggerLabel="Select education level"
          options={educationOptions}
          selectedValue={data.educationLevel}
          handleSelect={(value) =>
            handleDropdownChange('educationLevel', value)
          }
        />

        {/* Height */}
        <InputLabel
          label={{
            labelTitle: 'Height (cm)',
            classNameLabel: 'text-gray-700',
          }}
          input={{
            placeholder: 'Enter height',
            value: data.height,
            onChange: (e) =>
              handleInputChange('height', e.target.value.replace(/\D/g, '')),
            required: true,
          }}
        />

        {/* Weight */}
        <InputLabel
          label={{
            labelTitle: 'Weight (kg)',
            classNameLabel: 'text-gray-700',
          }}
          input={{
            placeholder: 'Enter weight',
            value: data.weight,
            onChange: (e) =>
              handleInputChange('weight', e.target.value.replace(/\D/g, '')),
            required: true,
          }}
        />
        <InputLabel
          label={{
            labelTitle: 'Password',
            classNameLabel: 'text-gray-700',
          }}
          input={{
            placeholder: 'Enter password',
            value: data.password,
            onChange: (e) => handleInputChange('password', e.target.value),
            required: true,
          }}
        />
      </div>
    </div>
  );
};

export default PersonalInformationArea;
