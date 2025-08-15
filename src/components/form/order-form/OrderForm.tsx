// src/components/UserForm.jsx
import { useEffect, useState } from 'react';

import FailLoadingAndEntry from '@/components/fallback/FailLoadingAndEntry';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import { Button } from '@/components/ui/button';
import { useGetOrderAddInfo } from '@/hooks/api/useOrders.api';
import { useToast } from '@/hooks/common/useToast';
import type { OrderFormData } from '@/types/params/order-params';
import type { Discount } from '@/types/table/objects/customers';

import CustomerArea from './CustomerArea';
import InformationOrderArea from './InformationOrderArea';
import TotalOrderArea from './TotalOrderArea';

export default function OrderForm() {
  const { showError } = useToast();
  const [availableDiscounts, setAvailableDiscounts] = useState<Discount[]>([]);
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

    // Account status
    isCusHasAcc: false,
  });

  const {
    data: orderAddInfo,
    isLoading: isLoadingOrderInfo,
    error: orderInfoError,
  } = useGetOrderAddInfo();

  console.log('orderAddInfo', orderAddInfo);

  useEffect(() => {
    if (orderInfoError) {
      showError('Failed to load order information');
    }
  }, [orderInfoError, showError]);

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

  const dataForCalculate = {
    serviceTitle: formData.serviceTitle,
    serviceBasePrice: formData.serviceBasePrice,
    coefficient_service: formData.coefficient_service,
    coefficient_other: formData.coefficient_other,
    coefficient_ot: formData.coefficient_ot,
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
      />
      <TotalOrderArea
        formData={formData}
        onUpdateFormData={handleUpdateFormData}
        systemSetting={orderAddInfo?.result?.systemSetting}
        coefficientOther={orderAddInfo?.result?.coefficientOther}
        availableDiscounts={availableDiscounts}
      />
      <Button
        className="float-right mr-6 cursor-pointer disabled:cursor-not-allowed"
        disabled={!formData.phone || !formData.fullName}
      >
        Add order
      </Button>
    </div>
  );
}
