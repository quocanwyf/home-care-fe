import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import FailLoadingAndEntry from '@/components/fallback/FailLoadingAndEntry';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import { Button } from '@/components/ui/button';
import { useAddOrder, useGetOrderAddInfo } from '@/hooks/api/useOrders.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import { useToast } from '@/hooks/common/useToast';
import { orderFormSchema } from '@/schema/order-form-schema';
import {
  type OrderFormSchemaType,
  defaultOrderFormValues,
} from '@/types/schema/order-form-schema-type';
import type { Discount } from '@/types/table/objects/customers';
import { zodResolver } from '@hookform/resolvers/zod';

import CustomerArea from './CustomerArea';
import InformationOrderArea from './InformationOrderArea';
import TotalOrderArea from './TotalOrderArea';

export default function OrderForm() {
  const navigateTo = useAppNavigate<{ from: string }>();
  const { showError, showSuccess } = useToast();
  const [availableDiscounts, setAvailableDiscounts] = useState<Discount[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataForCalculate, setDataForCalculate] = useState<any>(null);

  const addOrderMutation = useAddOrder();

  const form = useForm<OrderFormSchemaType>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: defaultOrderFormValues,
    mode: 'onChange', // Validate on change for   UX
    criteriaMode: 'all', // Show all validation errors
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isValid, isSubmitting },
  } = form;

  const formData = watch();

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

  const handleUpdateFormData = useCallback(
    (newData: Partial<OrderFormSchemaType>) => {
      Object.entries(newData).forEach(([key, value]) => {
        setValue(key as keyof OrderFormSchemaType, value, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      });
    },
    [setValue]
  );

  const handleSubmitOrder = handleSubmit(async (data: OrderFormSchemaType) => {
    try {
      sessionStorage.setItem('admin-creating-order', 'true');

      const orderPayload = {
        // Service info
        serviceTitle: data.serviceTitle,
        serviceBasePrice: data.serviceBasePrice,
        coefficient_service: data.coefficient_service,
        coefficient_other: data.coefficient_other,
        coefficient_ot: data.coefficient_ot,

        requestType: data.requestType,

        // Date and time
        startDate: data.startDate,
        startTime: data.startTime,
        endDate: data.endDate,
        endTime: data.endTime,

        // Cost calculation
        totalCost: data.totalCost,
        detailCost: data.detailCost,

        // Customer information
        fullName: data.fullName.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),

        // Location codes
        wardCode: data.wardCode,
        districtCode: data.districtCode,
        provinceCode: data.provinceCode,

        // Location names
        ward: data.ward,
        province: data.province,

        // Account status
        isCusHasAcc: data.isCusHasAcc,
      };

      const response = await addOrderMutation.mutateAsync(orderPayload);

      if (response.success) {
        showSuccess('Order added successfully!');
        navigateTo('/orders', {
          state: { from: 'login' },
          delay: 700,
        });
      } else {
        sessionStorage.removeItem('admin-creating-order');
        showError(response.message || 'Failed to add order');
      }
    } catch (error: any) {
      sessionStorage.removeItem('admin-creating-order');
      console.error('Submit order error:', error);
      showError(
        error?.response?.data?.message ||
          error?.message ||
          'An unexpected error occurred while adding the order'
      );
    }
  });

  if (isLoadingOrderInfo) {
    return <LoadingFallback content="Loading order information..." />;
  }

  //  Show error state
  if (orderInfoError && !orderAddInfo) {
    return <FailLoadingAndEntry content="Failed to load order information" />;
  }

  const handleUpdateAvailableDiscounts = (discounts: Discount[]) => {
    setAvailableDiscounts(discounts);
  };

  return (
    <div className="h-full w-full overflow-y-auto pb-26">
      <form onSubmit={handleSubmitOrder}>
        <CustomerArea
          formData={formData}
          onUpdateFormData={handleUpdateFormData}
          handleUpdateAvailableDiscounts={handleUpdateAvailableDiscounts}
          form={form} // Pass form object for direct field control
        />
        <InformationOrderArea
          formData={formData}
          onUpdateFormData={handleUpdateFormData}
          serviceList={orderAddInfo?.result?.serviceList}
          systemSetting={orderAddInfo?.result?.systemSetting}
          coefficientOther={orderAddInfo?.result?.coefficientOther}
          onSetDataForCalculate={setDataForCalculate}
          form={form} // Pass form object
        />
        <TotalOrderArea
          formData={formData}
          onUpdateFormData={handleUpdateFormData}
          availableDiscounts={availableDiscounts}
          dataForCalculate={dataForCalculate}
          form={form} // Pass form object
        />
        <Button
          type="submit"
          className="float-right mr-6 cursor-pointer disabled:cursor-not-allowed"
          disabled={!isValid || isSubmitting}
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
      </form>
    </div>
  );
}
