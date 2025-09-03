import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import FailLoadingAndEntry from '@/components/fallback/FailLoadingAndEntry';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import CustomerInformation from '@/components/form/customer-form/CustomerInformation';
import CustomerOrdersInformation from '@/components/form/customer-form/CustomerOrderInformation';
import {
  useGetCustomerDetail,
  useGetCustomerOrders,
} from '@/hooks/api/useCustomers.api';
import { useToast } from '@/hooks/common/useToast';

const DetailCustomerForm = () => {
  const { id } = useParams<{ id: string }>(); // Changed from phoneNumber to id
  const { showError } = useToast();

  const {
    data: customerDetailData,
    isLoading: isLoadingCustomer,
    isError: isCustomerError,
    error: customerError,
  } = useGetCustomerDetail(id || ''); // Use id as phone number

  const {
    data: customerOrdersData,
    isLoading: isLoadingOrders,
    isError: isOrdersError,
    error: ordersError,
  } = useGetCustomerOrders(id || ''); // Use id as phone number

  console.log('Customer ID (Phone):', id);
  console.log('Customer Detail Data:', customerDetailData);
  console.log('Customer Orders Data:', customerOrdersData);

  useEffect(() => {
    if (isCustomerError && customerError) {
      showError(`Customer Error: ${customerError.message}`);
    }
    if (isOrdersError && ordersError) {
      showError(`Orders Error: ${ordersError.message}`);
    }
  }, [isCustomerError, customerError, isOrdersError, ordersError, showError]);

  if (!id) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">
            Invalid Customer Phone
          </h2>
          <p className="text-gray-500">
            Please provide a valid customer phone number.
          </p>
        </div>
      </div>
    );
  }

  if (isLoadingCustomer) {
    return <LoadingFallback content="Loading customer information..." />;
  }

  if (isCustomerError && customerError) {
    return (
      <FailLoadingAndEntry content="Failed to load customer information" />
    );
  }

  return (
    <div className="h-screen overflow-auto">
      <CustomerInformation customerData={customerDetailData} />
      <CustomerOrdersInformation
        orders={customerOrdersData?.result}
        isLoading={isLoadingOrders}
        totalOrders={customerOrdersData?.totalOrders}
      />
    </div>
  );
};

export default DetailCustomerForm;
