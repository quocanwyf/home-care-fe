import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { SquareUser } from 'lucide-react';

import OrderStatusBadge from '@/components/common/badge/StatusOrdersBadge';
import OrderInformation from '@/components/form/order-form/detail/OrderInformation';
import { useGetOrderDetail } from '@/hooks/api/useOrders.api';
import { useToast } from '@/hooks/common/useToast';

const DetailOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError } = useToast();

  const {
    data: orderDetailData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetOrderDetail(id);

  console.log(orderDetailData);

  useEffect(() => {
    if (isError && error) {
      showError(error.message);
    }
  }, [isError, error, showError]);

  return (
    <div className="h-full w-full rounded-xl bg-white px-8 py-2">
      {/* <Label className="font-semibold" htmlFor="hmrId">
                   <Phone className="inline-block h-4 w-4" />
                   User ID
                 </Label>
                 <Input
                   type="text"
                   id="hmrId"
                   name="hmrId" // ✅ Thêm name attribute
                   placeholder="Enter your User ID"
                   className="focus:border-border-primary/50 shadow-sm"
                   required
                 /> */}

      <OrderInformation orderData={orderDetailData} />
    </div>
  );
};

export default DetailOrderPage;
