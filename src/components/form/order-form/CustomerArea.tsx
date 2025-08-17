import { useState } from 'react';
import { Controller } from 'react-hook-form';

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
import { useIsTabletOrMobile } from '@/hooks/common/useIsTabletOrMobile';
import { useToast } from '@/hooks/common/useToast';
import type { CustomerAreaProps } from '@/types/params/order-params';

const CustomerArea = ({
  form,
  handleUpdateAvailableDiscounts,
}: CustomerAreaProps) => {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;
  const watchedPhone = watch('phone');
  const watchedProvince = watch('province');
  const watchedDistrict = watch('district');
  const watchedProvinceCode = watch('provinceCode');
  const watchedDistrictCode = watch('districtCode');

  const selectedProvinceCode = getValues('provinceCode');
  const selectedDistrictCode = getValues('districtCode');

  const [isSearching, setIsSearching] = useState(false);
  const [provinceSearch, setProvinceSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [wardSearch, setWardSearch] = useState('');

  const { showSuccess, showError, showInfo } = useToast();
  const checkCustomerExistPhoneMutation = useCheckCustomerExist();
  const isTabletOrMobile = useIsTabletOrMobile();

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
    if (!watchedPhone?.trim()) return;

    if (!checkPhoneRegex(watchedPhone.trim(), showError)) {
      return;
    }
    setIsSearching(true);
    try {
      const result =
        await checkCustomerExistPhoneMutation.mutateAsync(watchedPhone);

      if (result.success && result.customer) {
        const customerData = result.customer;
        const address = customerData.addresses[0];

        setValue('fullName', customerData.cusName, { shouldValidate: true });
        setValue('address', address.detailAddress, { shouldValidate: true });
        setValue('province', address.province, { shouldValidate: true });
        setValue('district', address.district, { shouldValidate: true });
        setValue('ward', address.ward, { shouldValidate: true });
        setValue('provinceCode', address.provinceId, { shouldValidate: true });
        setValue('districtCode', address.districtId, { shouldValidate: true });
        setValue('wardCode', address.wardId, { shouldValidate: true });
        setValue('isCusHasAcc', true, { shouldValidate: true });

        if (result?.discounts?.length > 0) {
          showInfo(`Có ${result.discounts.length} khuyến mãi khả dụng`);
          handleUpdateAvailableDiscounts(result?.discounts);
        }

        showSuccess(`Tìm thấy khách hàng: ${customerData.cusName}`);
      } else {
        showError('Không tìm thấy thông tin khách hàng');
        setValue('isCusHasAcc', false, { shouldValidate: true });
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khách hàng:', error);
      showError('Lỗi khi tìm kiếm khách hàng: ' + error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCitySelect = (provinceCode: string, provinceName?: string) => {
    setValue('province', provinceName || provinceCode, {
      shouldValidate: true,
    });
    setValue('provinceCode', provinceCode, { shouldValidate: true });
    // Reset dependent fields
    setValue('district', '', { shouldValidate: true });
    setValue('ward', '', { shouldValidate: true });
    setValue('districtCode', '', { shouldValidate: true });
    setValue('wardCode', '', { shouldValidate: true });
  };

  const handleDistrictSelect = (
    districtCode: string,
    districtName?: string
  ) => {
    setValue('district', districtName || districtCode, {
      shouldValidate: true,
    });
    setValue('districtCode', districtCode, { shouldValidate: true });
    // Reset ward
    setValue('ward', '', { shouldValidate: true });
    setValue('wardCode', '', { shouldValidate: true });
  };

  const handleWardSelect = (wardCode: string, wardName?: string) => {
    setValue('ward', wardName || wardCode, { shouldValidate: true });
    setValue('wardCode', wardCode || '', { shouldValidate: true });
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
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <InputButtonSearch
                  className="px-2"
                  label={{
                    labelTitle: 'Search customer by phone number',
                    icon: <Phone className="h-3 w-3" />,
                  }}
                  input={{
                    type: 'tel',
                    inputId: 'phone',
                    inputName: 'phone',
                    placeholder: 'Enter phone number (10 digits)',
                    className: 'w-full',
                    value: field.value || '',
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      //   Chỉ cho phép nhập số
                      const numericValue = e.target.value.replace(/\D/g, '');
                      const limitedValue = numericValue.slice(0, 10);
                      field.onChange(limitedValue);
                    },
                    maxLength: 10,
                  }}
                  button={{
                    onClick: handleSearchCustomer,
                    disabled: !field.value?.trim() || isSearching,
                    isLoading: isSearching,
                  }}
                  error={error?.message}
                />
              )}
            />
          </div>

          <div className="mb-2 flex-1">
            <Controller
              name="fullName"
              control={control}
              render={({ field, fieldState: { error } }) => (
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
                    value: field.value || '',
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      //   Normalize spaces while typing
                      const normalizedValue = e.target.value
                        .replace(/^\s+/, '') // Remove leading spaces
                        .replace(/\s{2,}/g, ' '); // Replace multiple spaces with single space
                      field.onChange(normalizedValue);
                    },
                  }}
                  error={error?.message}
                />
              )}
            />
          </div>
        </div>

        {/* INPUTS Location */}
        <div className="max-tablet:grid-cols-1 mb-4 grid w-full grid-cols-2 gap-4">
          <div className="flex-1">
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <InputLabel
                  className="px-2"
                  label={{
                    labelTitle: isTabletOrMobile
                      ? 'Address'
                      : 'Address (House number, street)',
                    icon: <House className="h-3 w-3" />,
                  }}
                  input={{
                    inputId: 'address',
                    className: 'w-full',
                    inputName: 'address',
                    placeholder: 'Enter address',
                    value: field.value || '',
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      //   Normalize spaces while typing
                      const normalizedValue = e.target.value
                        .replace(/^\s+/, '') // Remove leading spaces
                        .replace(/\s{2,}/g, ' '); // Replace multiple spaces with single space
                      field.onChange(normalizedValue);
                    },
                  }}
                  error={error?.message}
                />
              )}
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
                value: watchedProvince || '',
              }}
              options={provinceOptions}
              onSelect={handleCitySelect}
              onSearch={setProvinceSearch}
              isLoading={provincesLoading}
              error={errors.province?.message || provincesError?.message}
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
                value: watchedDistrict || '',
                disabled: !watchedProvinceCode,
              }}
              options={districtOptions}
              onSelect={handleDistrictSelect}
              onSearch={setDistrictSearch}
              isLoading={districtsLoading}
              error={errors.district?.message || districtsError?.message}
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
                value: watch('ward') || '',
                disabled: !watchedDistrictCode || !watchedProvinceCode,
              }}
              options={wardOptions}
              onSelect={handleWardSelect}
              onSearch={setWardSearch}
              isLoading={wardsLoading}
              error={errors.ward?.message || wardsError?.message}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerArea;
