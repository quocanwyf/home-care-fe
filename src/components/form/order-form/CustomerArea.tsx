import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import {
  Factory,
  Hotel,
  House,
  MemoryStick,
  Phone,
  SquareUser,
  User,
} from 'lucide-react';

import SearchableDropdown from '@/components/common/dropdowns/SearchableDropdown';
import InputButtonSearch from '@/components/common/input/InputButtonSearch';
import InputLabel from '@/components/common/input/InputLabel';
import { checkPhoneRegex } from '@/helpers/check-phone-regex';
import {
  useGetDistricts,
  useGetProvinces,
  useGetWards,
} from '@/hooks/api/useLocations.api';
import { useCheckCustomerExist } from '@/hooks/api/useOrders.api';
import { useToast } from '@/hooks/common/useToast';
import type { CustomerAreaProps } from '@/types/params/order-params';

const CustomerArea = ({ formData, onUpdateFormData }: CustomerAreaProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [provinceSearch, setProvinceSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [wardSearch, setWardSearch] = useState('');
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');

  const { showSuccess, showError, showInfo } = useToast();

  //api check exist phone customer
  const checkCustomerExistPhoneMutation = useCheckCustomerExist();

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 });
  const labelTitle = isTabletOrMobile
    ? 'Address'
    : 'Address (House number, street)';

  // Location API calls
  const {
    data: provincesData,
    isLoading: provincesLoading,
    error: provincesError,
  } = useGetProvinces(provinceSearch);

  const {
    data: districtsData,
    isLoading: districtsLoading,
    error: districtsError,
  } = useGetDistricts(selectedProvinceCode, districtSearch);

  const {
    data: wardsData,
    isLoading: wardsLoading,
    error: wardsError,
  } = useGetWards(selectedProvinceCode, selectedDistrictCode, wardSearch);

  console.log('cc', formData);

  const handleSearchCustomer = async () => {
    if (!formData.phoneNumberCustomer.trim()) return;

    if (!checkPhoneRegex(formData.phoneNumberCustomer.trim(), showError)) {
      return;
    }
    setIsSearching(true);
    try {
      const result = await checkCustomerExistPhoneMutation.mutateAsync(
        formData.phoneNumberCustomer
      );

      console.log('Search result:', result);

      if (result.success && result.customer) {
        // Auto fill form data nếu tìm thấy khách hàng
        onUpdateFormData({
          fullNameCustomer: result.customer.fullName,
          location: {
            addressNum: result.customer.location.addressNum,
            city: result.customer.location.city,
            district: result.customer.location.district,
            ward: result.customer.location.ward,
          },
        });

        // Tìm provinceCode từ city name để load wards
        const matchedProvince = provincesData?.result?.find(
          (p: {
            provinceName: string;
            provinceFullName: string;
            provinceId: string;
          }) =>
            p.provinceName === result.customer.location.city ||
            p.provinceFullName === result.customer.location.city
        );
        if (matchedProvince) {
          setSelectedProvinceCode(matchedProvince.provinceId);
        }

        // Log discount list nếu có
        if (result.discountList?.length > 0) {
          console.log('Available discounts:', result.discountList);
          showInfo(`Có ${result.discountList.length} khuyến mãi khả dụng`);
        }

        showSuccess(`Tìm thấy khách hàng: ${result.customer.fullName}`);
      } else {
        showError('Không tìm thấy thông tin khách hàng');
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khách hàng:', error);
      showError('Lỗi khi tìm kiếm khách hàng: ' + error);
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

  const handleCitySelect = (provinceCode: string, provinceName?: string) => {
    setSelectedProvinceCode(provinceCode);
    onUpdateFormData({
      location: {
        ...formData.location,
        city: provinceName || provinceCode,
        ward: '', // Reset ward when city changes
      },
    });
  };

  const handleDistrictSelect = (
    districtCode: string,
    districtName?: string
  ) => {
    setSelectedDistrictCode(districtCode);
    onUpdateFormData({
      location: {
        ...formData.location,
        district: districtName || districtCode,
        ward: '', //reset ward
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

  // Convert API data to dropdown options
  const provinceOptions =
    provincesData?.result?.map((province) => ({
      label: province.provinceName,
      value: province.provinceId,
    })) || [];

  const districtOptions =
    districtsData?.result?.map((district) => ({
      label: district.districtName,
      value: district.districtCode,
    })) || [];

  const wardOptions =
    wardsData?.result?.map((ward) => ({
      label: ward.wardName,
      value: ward.wardName,
    })) || [];

  return (
    <>
      {/* Vùng khách hàng */}
      <div className="bg-overlay-slider/8 shadow-around my-6 w-full rounded-md px-4 pt-2 pb-4">
        {/* TITLE */}
        <div className="text-overlay-slider mx-2 mt-4 mb-5 flex flex-row items-center font-bold">
          <SquareUser className="-mt-1 mr-2 h-5.5 w-5.5" />
          <p className="text-sm">CUSTOMER INFORMATION</p>
        </div>
        {/* INPUTS Phone, Full Name */}
        <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-2 gap-4">
          <div className="flex-1">
            <InputButtonSearch
              className="px-2"
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

          <div className="mb-2 flex-1">
            <InputLabel
              className="px-2"
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
        <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-2 gap-4">
          <div className="flex-1">
            <InputLabel
              className="px-2"
              label={{
                labelTitle: labelTitle,
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
              className="px-2"
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
              options={provinceOptions}
              onSelect={handleCitySelect}
              onSearch={setProvinceSearch}
              isLoading={provincesLoading}
              error={provincesError?.message}
            />
          </div>
        </div>
        <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-2 gap-4">
          <div className="flex-1">
            <SearchableDropdown
              className="px-2"
              label={{
                labelTitle: 'District',
                icon: <MemoryStick className="h-3 w-3" />,
              }}
              input={{
                inputId: 'districtCustomer',
                inputName: 'districtCustomer',
                className: 'w-full',
                placeholder: 'Select district',
                value: formData.location.district,
                disabled: !selectedProvinceCode, // Disable if no city selected
              }}
              options={districtOptions}
              onSelect={handleDistrictSelect}
              onSearch={setDistrictSearch}
              isLoading={districtsLoading}
              error={districtsError?.message}
            />
          </div>
          <div className="flex-1">
            <SearchableDropdown
              className="px-2"
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
                disabled: !selectedProvinceCode || !selectedDistrictCode, // Disable if no city and district dc chọn
              }}
              options={wardOptions}
              onSelect={handleWardSelect}
              onSearch={setWardSearch}
              isLoading={wardsLoading}
              error={wardsError?.message}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerArea;
