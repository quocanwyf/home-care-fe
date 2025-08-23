import { TableProperties } from 'lucide-react';

import ConfirmDialog from '@/components/common/float-display/ConfirmDialog';
import TooltipInfo from '@/components/common/primitives/TooltipInfo';
import { AppTable } from '@/components/table/AppTable';
import { Button } from '@/components/ui/button';
import {
  useCancelOrderDetail,
  useChangeRequestDetailStatus,
  useChangeRequestStatus,
} from '@/hooks/api/useOrders.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import { useConfirmation } from '@/hooks/common/useConfirmation';
import { orderDetailColumns } from '@/types/table/column/order-column';
import type { RequestDetail } from '@/types/table/objects/orders';

interface OrderDetailInformationProps {
  requestDetails: RequestDetail[] | undefined;
  isLoading?: boolean;
  onRefresh?: () => void; //callback to refresh the data afteer actions
  status?: string;
  requestId?: string;
}

const OrderDetailInformation = ({
  requestDetails,
  isLoading = false,
  onRefresh,
  status,
  requestId,
}: OrderDetailInformationProps) => {
  const cancelDetailMutation = useCancelOrderDetail();
  const changeStatusMutation = useChangeRequestDetailStatus(); //   Add status change hook
  const changeRequestStatusMutation = useChangeRequestStatus(); //   Add payment mutation
  const navigateTo = useAppNavigate();

  const detailDeleteConfirmation = useConfirmation({
    deleteFunction: (requestDetailId: string) =>
      cancelDetailMutation.mutateAsync(requestDetailId),
    entityName: 'Request Detail',
    onDeleteSuccess: () => {
      onRefresh?.();
    },
    successMessage: 'Request detail cancelled successfully!',
    errorMessage: 'Request detail cancelled fail!',
  });

  const startWorkConfirmation = useConfirmation({
    deleteFunction: (detailId: string) =>
      changeStatusMutation.mutateAsync({ detailId, status: 'inProgress' }),
    entityName: 'Request Detail',
    onDeleteSuccess: () => {
      onRefresh?.();
    },
    successMessage: 'Work started successfully!',
    errorMessage: 'Failed to start work!',
  });

  const completeWorkConfirmation = useConfirmation({
    deleteFunction: (detailId: string) =>
      changeStatusMutation.mutateAsync({ detailId, status: 'completed' }),
    entityName: 'Request Detail',
    onDeleteSuccess: () => {
      onRefresh?.();
    },
    successMessage: 'Work completed successfully!',
    errorMessage: 'Failed to complete work!',
  });

  const paymentConfirmation = useConfirmation({
    deleteFunction: (reqId: string) =>
      changeRequestStatusMutation.mutateAsync({
        requestId: reqId,
        status: 'completed',
      }),
    entityName: 'Request',
    onDeleteSuccess: () => {
      onRefresh?.();
    },
    successMessage: 'Payment processed successfully!',
    errorMessage: 'Failed to process payment!',
  });

  const handleDeleteDetail = (detailId: string) => {
    // Find detail data để pass vào confirmation dialog
    const detail = requestDetails?.find((d) => d.detailId === detailId);

    if (detail) {
      detailDeleteConfirmation.openDeleteConfirmation(detailId, {
        workingDate: detail.workingDate,
        startTime: detail.startTime,
        endTime: detail.endTime,
        helperName: detail.helper?.fullName || 'Has not assigned',
        status: detail.status,
      });
    }
  };

  const handleStart = (detailId: string) => {
    // Find detail data để pass vào confirmation dialog
    const detail = requestDetails?.find((d) => d.detailId === detailId);

    if (detail) {
      startWorkConfirmation.openDeleteConfirmation(detailId, {
        workingDate: detail.workingDate,
        startTime: detail.startTime,
        endTime: detail.endTime,
        helperName: detail.helper?.fullName || 'Has not assigned',
        status: detail.status,
      });
    }
  };

  const handleComplete = (detailId: string) => {
    // Find detail data để pass vào confirmation dialog
    const detail = requestDetails?.find((d) => d.detailId === detailId);

    if (detail) {
      completeWorkConfirmation.openDeleteConfirmation(detailId, {
        workingDate: detail.workingDate,
        startTime: detail.startTime,
        endTime: detail.endTime,
        helperName: detail.helper?.fullName || 'Has not assigned',
        status: detail.status,
      });
    }
  };

  const handlePayment = () => {
    if (requestId) {
      paymentConfirmation.openDeleteConfirmation(requestId, {
        requestId,
        status: status || 'waitPayment',
        totalDetails: requestDetails?.length || 0,
        completedDetails:
          requestDetails?.filter((d) => d.status === 'completed').length || 0,
        onDeleteSuccess: () => {
          console.log('cdaicaon di mêmya');
          navigateTo('/dashboard', {
            toast: {
              type: 'success',
              message: 'Điều hướng thành công!',
            },
            delay: 1000,
          });
        },
      });
    }
  };

  //   Check if any action is loading
  const isAnyActionLoading =
    cancelDetailMutation.isPending ||
    changeStatusMutation.isPending ||
    changeRequestStatusMutation.isPending;

  return (
    <div className="bg-overlay-slider/8 shadow-around my-6 w-full rounded-md px-4 pb-4">
      <div className="text-overlay-slider mx-2 mt-4 mb-4 flex flex-row items-center justify-between font-bold">
        <div className="flex">
          <TableProperties className="mt-4 mr-2 h-5 w-5" />
          <p className="mt-4 text-sm">ORDER DETAIL INFORMATION</p>
        </div>
        {status === 'waitPayment' && (
          <TooltipInfo content="Please make a payment" side="top">
            <Button
              onClick={handlePayment}
              disabled={isAnyActionLoading}
              className="mx-4 mt-4 cursor-pointer rounded-xl bg-orange-100 text-orange-800 transition duration-500 ease-in-out hover:scale-105 hover:bg-orange-100"
            >
              Payment
            </Button>
          </TooltipInfo>
        )}
      </div>
      <div className="max-h-[40vh] min-h-[200px]">
        <AppTable
          data={requestDetails || []}
          columns={orderDetailColumns(
            handleDeleteDetail, // Pass cancel handler
            handleStart,
            handleComplete,
            isAnyActionLoading
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
      <ConfirmDialog
        open={detailDeleteConfirmation.isDialogOpen}
        onOpenChange={detailDeleteConfirmation.closeDeleteConfirmation}
        title="Cancel Request Detail"
        description={detailDeleteConfirmation
          .getDeleteDescription()
          .replace('delete', 'cancel')} //   Change wording to "cancel"
        icon={true}
        danger={true}
        confirmText="Cancel Detail"
        cancelText="Keep Detail"
        onConfirm={detailDeleteConfirmation.handleDeleteConfirm}
      >
        <div />
      </ConfirmDialog>
      <ConfirmDialog
        open={startWorkConfirmation.isDialogOpen}
        onOpenChange={startWorkConfirmation.closeDeleteConfirmation}
        title="Start Work"
        description={startWorkConfirmation.getDeleteDescription()}
        icon={true}
        confirmText="Start Work"
        cancelText="Don't Start"
        onConfirm={startWorkConfirmation.handleDeleteConfirm}
      >
        <div />
      </ConfirmDialog>
      <ConfirmDialog
        open={completeWorkConfirmation.isDialogOpen}
        onOpenChange={completeWorkConfirmation.closeDeleteConfirmation}
        title="Complete Request Detail"
        description={completeWorkConfirmation.getDeleteDescription()}
        icon={true}
        confirmText="Complete Detail"
        cancelText="Don't Complete"
        onConfirm={completeWorkConfirmation.handleDeleteConfirm}
      >
        <div />
      </ConfirmDialog>
      <ConfirmDialog
        open={paymentConfirmation.isDialogOpen}
        onOpenChange={paymentConfirmation.closeDeleteConfirmation}
        title="Complete Payment"
        description={paymentConfirmation.getDeleteDescription()}
        icon={true}
        confirmText="Complete Payment"
        cancelText="Don't Payment"
        onConfirm={paymentConfirmation.handleDeleteConfirm}
      >
        <div />
      </ConfirmDialog>
    </div>
  );
};

export default OrderDetailInformation;
