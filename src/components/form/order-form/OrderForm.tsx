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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataForCalculate, setDataForCalculate] = useState<any>(null);
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

  console.log('Order Form Data:', formData);

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
        disabled={!formData.phone || !formData.fullName}
      >
        Add order
      </Button>
    </div>
  );
}
