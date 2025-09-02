import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import FailLoadingAndEntry from '@/components/fallback/FailLoadingAndEntry';
import LoadingFallback from '@/components/fallback/LoadingFallback';
import OrderDetailInformation from '@/components/form/order-form/detail/OrderDetailInformation';
import OrderInformation from '@/components/form/order-form/detail/OrderInformation';
import { useGetOrderDetail } from '@/hooks/api/useOrders.api';
import { useToast } from '@/hooks/common/useToast';

const OrderDetailForm = () => {
  const { id } = useParams<{ id: string }>();
  const { showError } = useToast();

  const {
    data: orderDetailData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetOrderDetail(id);

  useEffect(() => {
    if (isError && error) {
      showError(error.message);
    }
  }, [isError, error, showError]);

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <LoadingFallback content="Loading order information..." />;
  }

  if (error && !isError) {
    return <FailLoadingAndEntry content="Failed to load order information" />;
  }

  return (
    <div className="h-screen overflow-auto">
      <OrderInformation orderData={orderDetailData} />
      <OrderDetailInformation
        requestDetails={orderDetailData?.requestDetails}
        isLoading={isLoading || isFetching}
        onRefresh={handleRefresh}
        status={orderDetailData?.request.status}
        requestId={orderDetailData?.request.orderId}
      />
    </div>
  );
};

export default OrderDetailForm;
