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

const CustomerArea = ({
  formData,
  onUpdateFormData,
  handleUpdateAvailableDiscounts,
}: CustomerAreaProps) => {
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

  const handleSearchCustomer = async () => {
    if (!formData.phone.trim()) return;

    if (!checkPhoneRegex(formData.phone.trim(), showError)) {
      return;
    }
    setIsSearching(true);
    try {
      const result = await checkCustomerExistPhoneMutation.mutateAsync(
        formData.phone
      );

      console.log('Search result:', result);

      if (result.success && result.customer) {
        // Auto fill form data nếu tìm thấy khách hàng
        onUpdateFormData({
          fullName: result.customer.cusName,
          address: result.customer.addresses[0].detailAddress,
          province: result.customer.addresses[0].province,
          district: result.customer.addresses[0].district,
          ward: result.customer.addresses[0].ward,
          provinceCode: result.customer.addresses[0].provinceId,
          districtCode: result.customer.addresses[0].districtId,
          wardCode: result.customer.addresses[0].wardId,
          isCusHasAcc: true,
        });

        setSelectedDistrictCode(result.customer.addresses[0].districtId);
        setSelectedProvinceCode(result.customer.addresses[0].provinceId);

        // Log discount list nếu có
        if (result?.discounts?.length > 0) {
          showInfo(`Có ${result.discounts.length} khuyến mãi khả dụng`);
          handleUpdateAvailableDiscounts(result?.discounts);
        }

        showSuccess(`Tìm thấy khách hàng: ${result.customer.cusName}`);
      } else {
        showError('Không tìm thấy thông tin khách hàng');
        onUpdateFormData({ isCusHasAcc: false });
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khách hàng:', error);
      showError('Lỗi khi tìm kiếm khách hàng: ' + error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    onUpdateFormData({ [field]: value });
  };

  const handleCitySelect = (provinceCode: string, provinceName?: string) => {
    setSelectedProvinceCode(provinceCode);
    onUpdateFormData({
      province: provinceName || provinceCode,
      provinceCode: provinceCode,
      district: '',
      ward: '',
      districtCode: '',
      wardCode: '',
    });
    setSelectedDistrictCode('');
  };

  const handleDistrictSelect = (
    districtCode: string,
    districtName?: string
  ) => {
    setSelectedDistrictCode(districtCode);
    onUpdateFormData({
      district: districtName || districtCode,
      districtCode: districtCode,
      ward: '', // Reset ward
      wardCode: '',
    });
  };

  const handleWardSelect = (wardCode: string, wardName?: string) => {
    onUpdateFormData({
      ward: wardName || wardCode,
      wardCode: wardCode || '',
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
      value: ward.wardCode || ward.wardName,
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
                inputId: 'phone',
                inputName: 'phone',
                placeholder: 'Enter phone number',
                className: 'w-full',
                value: formData.phone,
                onChange: (e) => handleInputChange('phone', e.target.value),
              }}
              button={{
                onClick: handleSearchCustomer,
                disabled: !formData.phone.trim() || isSearching,
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
                inputId: 'fullName',
                className: 'w-full',
                inputName: 'fullName',
                placeholder: 'Enter full name',
                value: formData.fullName,
                onChange: (e) => handleInputChange('fullName', e.target.value),
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
                value: formData.address,
                onChange: (e) => handleInputChange('address', e.target.value),
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
                value: formData.province,
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
                value: formData.district,
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
                value: formData.ward,
                disabled: !selectedDistrictCode || !selectedProvinceCode, // Disable if no city and district dc chọn
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
