// src/components/UserForm.jsx
import { useEffect, useState } from 'react';

import FailLoadingAndEntry from '@/components/fallback/FailLoadingAndEntry';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import { Button } from '@/components/ui/button';
import { useAddOrder, useGetOrderAddInfo } from '@/hooks/api/useOrders.api';
import { useToast } from '@/hooks/common/useToast';
import type { OrderFormData } from '@/types/params/order-params';
import type { Discount } from '@/types/table/objects/customers';

import CustomerArea from './CustomerArea';
import InformationOrderArea from './InformationOrderArea';
import TotalOrderArea from './TotalOrderArea';

export default function OrderForm() {
  const { showError, showSuccess } = useToast();
  const [availableDiscounts, setAvailableDiscounts] = useState<Discount[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataForCalculate, setDataForCalculate] = useState<any>(null);

  const addOrderMutation = useAddOrder();

  const [formData, setFormData] = useState<OrderFormData>({
    // Service information
    serviceTitle: '',
    serviceBasePrice: 0,
    coefficient_service: 0,
    coefficient_other: 1,
    coefficient_ot: 1,

    // Date and time
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',

    // Cost calculation
    totalCost: 0,
    detailCost: [],

    // Customer information
    fullName: '',
    phone: '',
    address: '',

    // Location codes
    wardCode: '',
    districtCode: '',
    provinceCode: '',

    // Location names
    ward: '',
    district: '',
    province: '',

    //selectedDiscountId:
    selectedDiscountId: null,

    // Account status
    isCusHasAcc: false,
  });

  const {
    data: orderAddInfo,
    isLoading: isLoadingOrderInfo,
    error: orderInfoError,
  } = useGetOrderAddInfo();

  useEffect(() => {
    if (orderInfoError) {
      showError('Failed to load order information');
    }
  }, [orderInfoError, showError]);

  const resetForm = () => {
    setFormData({
      // Service information
      serviceTitle: '',
      serviceBasePrice: 0,
      coefficient_service: 0,
      coefficient_other: 1,
      coefficient_ot: 1,

      // Date and time
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',

      // Cost calculation
      totalCost: 0,
      detailCost: [],

      // Customer information
      fullName: '',
      phone: '',
      address: '',

      // Location codes
      wardCode: '',
      districtCode: '',
      provinceCode: '',

      // Location names
      ward: '',
      district: '',
      province: '',

      //selectedDiscountId:
      selectedDiscountId: null,

      // Account status
      isCusHasAcc: false,
    });
  };

  const handleSubmitOrder = async () => {
    try {
      const validationErrors: string[] = [];

      if (!formData.fullName?.trim())
        validationErrors.push('Full name is required');
      if (!formData.phone?.trim())
        validationErrors.push('Phone number is required');
      if (!formData.address?.trim())
        validationErrors.push('Address is required');
      if (!formData.serviceTitle)
        validationErrors.push('Service must be selected');
      if (!formData.startDate) validationErrors.push('Start date is required');
      if (!formData.endDate) validationErrors.push('End date is required');
      if (!formData.startTime) validationErrors.push('Start time is required');
      if (!formData.endTime) validationErrors.push('End time is required');

      if (validationErrors.length > 0) {
        showError(`Please fix the following:\n${validationErrors.join('\n')}`);
        return;
      }

      const orderPayload = {
        // Service info
        serviceTitle: formData.serviceTitle,
        serviceBasePrice: formData.serviceBasePrice,
        coefficient_service: formData.coefficient_service,
        coefficient_other: formData.coefficient_other,
        coefficient_ot: formData.coefficient_ot,

        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime,

        // Cost (use final cost if discount applied)
        totalCost: formData.totalCost || 0,

        // Customer info
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        wardCode: formData.wardCode || '',
        districtCode: formData.districtCode || '',
        provinceCode: formData.provinceCode || '',
        ward: formData.ward || '',
        district: formData.district || '',
        province: formData.province || '',

        // selectedDiscountId: formData.selectedDiscountId || null,

        // Detail cost
        detailCost: formData.detailCost,

        // Customer account status
        isCusHasAcc: formData.isCusHasAcc || false,
      };

      console.log('Submitting orderrrrrrrrrrrrrrrr:', orderPayload);

      const response = await addOrderMutation.mutateAsync(orderPayload);

      if (response.success) {
        showSuccess('Order added successfully!');
        // resetForm();
      } else {
        showError('Failed to add order');
      }
    } catch (error: any) {
      console.error('Submit order error:', error);
      // Error already handled by the hook's onError
    }
  };

  if (isLoadingOrderInfo) {
    return <LoadingFallback content="Loading order information..." />;
  }

  //  Show error state
  if (orderInfoError && !orderAddInfo) {
    return <FailLoadingAndEntry content="Failed to load order information" />;
  }

  const handleUpdateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleUpdateAvailableDiscounts = (discounts: Discount[]) => {
    setAvailableDiscounts(discounts);
  };

  return (
    <div className="h-full w-full overflow-y-auto pb-20">
      <CustomerArea
        formData={formData}
        onUpdateFormData={handleUpdateFormData}
        handleUpdateAvailableDiscounts={handleUpdateAvailableDiscounts}
      />
      <InformationOrderArea
        formData={formData}
        onUpdateFormData={handleUpdateFormData}
        serviceList={orderAddInfo?.result?.serviceList}
        systemSetting={orderAddInfo?.result?.systemSetting}
        coefficientOther={orderAddInfo?.result?.coefficientOther}
        onSetDataForCalculate={setDataForCalculate}
      />
      <TotalOrderArea
        formData={formData}
        onUpdateFormData={handleUpdateFormData}
        availableDiscounts={availableDiscounts}
        dataForCalculate={dataForCalculate}
      />
      <Button
        className="float-right mr-6 cursor-pointer disabled:cursor-not-allowed"
        disabled={
          !formData.phone || !formData.fullName || addOrderMutation.isPending
        }
        onClick={handleSubmitOrder}
      >
        {addOrderMutation.isPending ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Adding...
          </div>
        ) : (
          'Add order'
        )}
      </Button>
    </div>
  );
}
