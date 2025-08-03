import { useState } from 'react';

import { Factory, Hotel, House, Phone, User } from 'lucide-react';

import SearchableDropdown from '@/components/common/dropdowns/SearchableDropdown';
import InputButtonSearch from '@/components/common/primitives/InputButtonSearch';
import InputLabel from '@/components/common/primitives/InputLabel';

const MOCK_CITIES = [
  'Ho Chi Minh City',
  'Ha Noi',
  'Da Nang',
  'Can Tho',
  'Hai Phong',
  'Bien Hoa',
  'Hue',
  'Nha Trang',
  'Buon Ma Thuot',
  'Quy Nhon',
];

const MOCK_WARDS: { [key: string]: string[] } = {
  'Ho Chi Minh City': [
    'District 1',
    'District 2',
    'District 3',
    'District 4',
    'District 5',
    'District 6',
    'District 7',
    'District 8',
    'District 9',
    'District 10',
    'Binh Thanh',
    'Thu Duc',
    'Phu Nhuan',
    'Tan Binh',
    'Tan Phu',
  ],
  'Ha Noi': [
    'Dong Da',
    'Ba Dinh',
    'Hoan Kiem',
    'Hai Ba Trung',
    'Cau Giay',
    'Tay Ho',
    'Long Bien',
    'Hoang Mai',
    'Thanh Xuan',
    'Nam Tu Liem',
  ],
  'Da Nang': [
    'Hai Chau',
    'Thanh Khe',
    'Son Tra',
    'Ngu Hanh Son',
    'Lien Chieu',
    'Cam Le',
  ],
  'Can Tho': ['Ninh Kieu', 'Binh Thuy', 'Cai Rang', 'O Mon', 'Thot Not'],
};

type CustomerAreaProps = {
  formData: {
    phoneNumberCustomer: string;
    fullNameCustomer: string;
    location: {
      addressNum: string;
      city: string;
      ward: string;
    };
  };
  onUpdateFormData: (newData: Partial<typeof FormData>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSearchCustomer: (phoneNumber: string) => Promise<any>;
};

const CustomerArea = ({
  formData,
  onUpdateFormData,
  onSearchCustomer,
}: CustomerAreaProps) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchCustomer = async () => {
    if (!formData.phoneNumberCustomer.trim()) return;

    setIsSearching(true);
    try {
      const customer = await onSearchCustomer(formData.phoneNumberCustomer);

      if (customer) {
        // Auto fill form data nếu tìm thấy khách hàng
        onUpdateFormData({
          fullNameCustomer: customer.fullName,
          location: {
            addressNum: customer.address,
            city: customer.city,
            ward: customer.ward,
          },
        });
      } else {
        // Thông báo không tìm thấy khách hàng
        console.log('Không tìm thấy thông tin khách hàng');
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khách hàng:', error);
    } finally {
      setIsSearching(false);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onUpdateFormData({
        [parent]: {
          ...formData.location,
          [child]: value,
        },
      });
    } else {
      onUpdateFormData({ [field]: value });
    }
  };

  const handleCitySelect = (city: string) => {
    onUpdateFormData({
      location: {
        ...formData.location,
        city: city,
        ward: '', // Reset ward when city changes
      },
    });
  };

  const handleWardSelect = (ward: string) => {
    onUpdateFormData({
      location: {
        ...formData.location,
        ward: ward,
      },
    });
  };

  // Get wards for selected city
  const availableWards = formData.location.city
    ? MOCK_WARDS[formData.location.city] || []
    : [];

  return (
    <>
      {/* Vùng khách hàng */}
      <div className="my-7 w-full rounded-md bg-blue-200/40 px-4 py-2">
        {/* TITLE */}
        <div className="text-overlay-slider mx-2 my-4 font-bold opacity-80">
          Customer Information
        </div>
        {/* INPUTS Phone, Full Name */}
        <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-2 gap-4">
          <div className="flex-1">
            <InputButtonSearch
              label={{
                labelTitle: 'Search customer by phone number',
                icon: <Phone className="h-3 w-3" />,
              }}
              input={{
                inputId: 'phoneNumberCustomer',
                inputName: 'phoneNumberCustomer',
                placeholder: 'Enter phone number',
                className: 'w-full',
                value: formData.phoneNumberCustomer,
                onChange: (e) =>
                  handleInputChange('phoneNumberCustomer', e.target.value),
              }}
              button={{
                onClick: handleSearchCustomer,
                disabled: !formData.phoneNumberCustomer.trim() || isSearching,
                isLoading: isSearching,
              }}
            />
          </div>

          <div className="flex-1">
            <InputLabel
              label={{
                labelTitle: 'Full name',
                icon: <User className="h-3 w-3" />,
              }}
              input={{
                inputId: 'fullNameCustomer',
                className: 'w-full',
                inputName: 'fullNameCustomer',
                placeholder: 'Enter full name',
                value: formData.fullNameCustomer,
                onChange: (e) =>
                  handleInputChange('fullNameCustomer', e.target.value),
              }}
            />
          </div>
        </div>

        {/* INPUTS Location */}
        <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-3 gap-4">
          <div className="flex-1">
            <InputLabel
              label={{
                labelTitle: 'Address (House number, street)',
                icon: <House className="h-3 w-3" />,
              }}
              input={{
                inputId: 'addressCustomer',
                className: 'w-full',
                inputName: 'addressCustomer',
                placeholder: 'Enter address',
                value: formData.location.addressNum,
                onChange: (e) =>
                  handleInputChange('location.addressNum', e.target.value),
              }}
            />
          </div>
          <div className="flex-1">
            <SearchableDropdown
              label={{
                labelTitle: 'City',
                icon: <Hotel className="h-3 w-3" />,
              }}
              input={{
                inputId: 'cityCustomer',
                inputName: 'cityCustomer',
                className: 'w-full',
                placeholder: 'Select city',
                value: formData.location.city,
              }}
              options={MOCK_CITIES}
              onSelect={handleCitySelect}
            />
          </div>
          <div className="flex-1">
            <SearchableDropdown
              label={{
                labelTitle: 'Ward',
                icon: <Factory className="h-3 w-3" />,
              }}
              input={{
                inputId: 'wardCustomer',
                inputName: 'wardCustomer',
                className: 'w-full',
                placeholder: 'Select ward',
                value: formData.location.ward,
                disabled: !formData.location.city, // Disable if no city selected
              }}
              options={availableWards}
              onSelect={handleWardSelect}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerArea;
