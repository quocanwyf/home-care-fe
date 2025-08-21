import { TableProperties } from 'lucide-react';

import { AppTable } from '@/components/table/AppTable';
import { useCancelOrderDetail } from '@/hooks/api/useOrders.api';
import { orderDetailColumns } from '@/types/table/column/order-column';
import type { RequestDetail } from '@/types/table/objects/orders';

interface OrderDetailInformationProps {
  requestDetails: RequestDetail[] | undefined;
  isLoading?: boolean;
  onRefresh?: () => void; //callback to refresh the data afteer actions
}

const OrderDetailInformation = ({
  requestDetails,
  isLoading = false,
  onRefresh,
}: OrderDetailInformationProps) => {
  console.log('Request Details:', requestDetails);

  const cancelDetailMutation = useCancelOrderDetail();

  const handleCancel = (detailId: string) => {
    console.log('Cancel action for detailId:', detailId);

    // Execute the mutation
    cancelDetailMutation.mutate(detailId, {
      onSuccess: () => {
        // Refresh data after successful cancellation
        onRefresh?.();
      },
    });
  };

  const handleStart = (detailId: string) => {
    console.log('Start action for detailId:', detailId);
    // TODO: Implement start logic
  };

  const handleComplete = (detailId: string) => {
    console.log('Complete action for detailId:', detailId);
    // TODO: Implement complete logic
  };

  return (
    <div className="bg-overlay-slider/8 shadow-around my-6 w-full rounded-md px-4 pb-4">
      <div className="text-overlay-slider mx-2 mt-4 mb-4 flex flex-row items-center font-bold">
        <TableProperties className="-mt-1 mr-2 h-5 w-5" />
        <p className="text-sm">ORDER DETAIL INFORMATION</p>
      </div>
      <div className="max-h-[40vh] min-h-[200px]">
        <AppTable
          data={requestDetails || []}
          columns={orderDetailColumns(
            handleCancel, // ✅ Pass cancel handler
            handleStart,
            handleComplete,
            cancelDetailMutation.isPending
          )}
          isLoading={isLoading}
          pageHeaderTitle=""
          pageSize={requestDetails?.length || 0}
          totalData={requestDetails?.length || 0}
          isHeader={false}
          isFooter={false}
          heightRow="h-10"
        />
        <div className="h-30"></div>
      </div>
    </div>
  );
};

export default OrderDetailInformation;
