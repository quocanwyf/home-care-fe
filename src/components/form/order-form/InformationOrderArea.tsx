import { useState } from 'react';

import { Phone, SquareUser, User } from 'lucide-react';

import LabelDropdown from '@/components/common/dropdowns/LabelDropdown';
import InputButtonSearch from '@/components/common/primitives/InputButtonSearch';
import InputLabel from '@/components/common/primitives/InputLabel';

const InformationOrderArea = ({ formData, onUpdateFormData }) => {
  const [selectedRequestType, setSelectedRequestType] = useState<{
    label: string;
    value: string | number;
  } | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<{
    label: string;
    value: string | number;
  } | null>(null);

  const requestTypes = [
    { label: 'Short-term', value: 'short-term' },
    { label: 'Long-term', value: 'long-term' },
  ];
  const serviceTypes = [
    { label: 'Cleaning', value: 'cleaning' },
    { label: 'Cooking', value: 'cooking' },
    { label: 'Elderly Care', value: 'elderly-care' },
  ];

  const handleSelectRequestType = (value: {
    label: string;
    value: string | number;
  }) => {
    console.log('Selected request type:', value);
    setSelectedRequestType(value);
  };

  const handleSelectServiceType = (value: {
    label: string;
    value: string | number;
  }) => {
    console.log('Selected service type:', value);
    setSelectedServiceType(value);
  };

  return (
    <>
      {/* Vùng khách hàng */}
      <div className="bg-overlay-slider/8 shadow-around my-6 w-full rounded-md px-4 pt-2 pb-4">
        {/* TITLE */}
        <div className="text-overlay-slider mx-2 mt-4 mb-5 flex flex-row items-center font-bold">
          <SquareUser className="-mt-0.5 mr-2 h-6 w-6" />
          <p>CUSTOMER INFORMATION</p>
        </div>
        {/* INPUTS Phone, Full Name */}
        <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-2 gap-4">
          <div className="flex-1">
            <InputButtonSearch
              label={{
                labelTitle: 'Search customer by phone number',
                icon: <Phone className="h-3 w-3" />,
              }}
            />
          </div>

          <div className="mb-2 flex-1">
            <InputLabel
              label={{
                labelTitle: 'Full name',
                icon: <User className="h-3 w-3" />,
              }}
            />
          </div>
        </div>{' '}
        <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-2 gap-4">
          <div className="flex-1">
            <LabelDropdown
              label="Request Type"
              options={requestTypes}
              handleSelect={handleSelectRequestType}
              className="w-full"
              labelClassName="w-full"
              triggerLabel="Choose request type"
              selectedValue={selectedRequestType}
            />
          </div>

          <div className="flex-1">
            <LabelDropdown
              label="Service Type"
              options={serviceTypes}
              handleSelect={handleSelectServiceType}
              className="w-full"
              labelClassName="w-full"
              triggerLabel="Choose service type"
              selectedValue={selectedServiceType}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default InformationOrderArea;
