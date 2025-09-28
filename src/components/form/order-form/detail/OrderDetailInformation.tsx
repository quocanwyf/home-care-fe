import { useState } from 'react';

import { TableProperties } from 'lucide-react';

import ConfirmDialog from '@/components/common/float-display/ConfirmDialog';
import OrderEvaluationModal from '@/components/common/float-display/OrderEvaluationModal';
import ViewEvaluationModal from '@/components/common/float-display/ViewEvaluationModal';
import TooltipInfo from '@/components/common/primitives/TooltipInfo';
import { AppTable } from '@/components/table/app-table/AppTable';
import { Button } from '@/components/ui/button';
import {
  useCancelOrderDetail,
  useChangeRequestDetailStatus,
  useChangeRequestDetailStatusWithEvaluation,
  useChangeRequestStatus,
} from '@/hooks/api/useOrders.api';
import { useAppNavigate } from '@/hooks/common/useAppNavigate';
import { useConfirmation } from '@/hooks/common/useConfirmation';
import { orderDetailColumns } from '@/types/table/column/order-column';
import type { OrderEvaluation } from '@/types/table/objects/orders';
import type { RequestDetail } from '@/types/table/objects/orders';

interface OrderDetailInformationProps {
  requestDetails: RequestDetail[] | undefined;
  isLoading?: boolean;
  onRefresh?: () => void;
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
  // Existing hooks
  const cancelDetailMutation = useCancelOrderDetail();
  const changeStatusMutation = useChangeRequestDetailStatus();
  const changeRequestStatusMutation = useChangeRequestStatus();

  // New evaluation hook
  const changeStatusWithEvaluationMutation =
    useChangeRequestDetailStatusWithEvaluation();

  const navigateTo = useAppNavigate();

  // States for modals
  const [evaluationModal, setEvaluationModal] = useState<{
    isOpen: boolean;
    detailId: string;
    helperName: string;
  }>({
    isOpen: false,
    detailId: '',
    helperName: '',
  });

  // New state for view evaluation modal
  const [viewEvaluationModal, setViewEvaluationModal] = useState<{
    isOpen: boolean;
    detailId: string;
    helperName: string;
  }>({
    isOpen: false,
    detailId: '',
    helperName: '',
  });

  // Existing confirmations...
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

  const paymentConfirmation = useConfirmation({
    deleteFunction: (reqId: string) =>
      changeRequestStatusMutation.mutateAsync({
        requestId: reqId,
        status: 'completed',
      }),
    entityName: 'Request',
    onDeleteSuccess: () => {
      onRefresh?.();
      navigateTo('/orders', {
        toast: {
          type: 'success',
          message: 'Điều hướng thành công!',
        },
        delay: 1000,
      });
    },
    successMessage: 'Payment processed successfully!',
    errorMessage: 'Failed to process payment!',
  });

  // Existing handlers...
  const handleDeleteDetail = (detailId: string) => {
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
    const detail = requestDetails?.find((d) => d.detailId === detailId);

    if (detail) {
      setEvaluationModal({
        isOpen: true,
        detailId,
        helperName: detail.helper?.fullName || 'Unknown Helper',
      });
    }
  };

  // New handler for viewing evaluation
  const handleViewEvaluation = (detailId: string) => {
    const detail = requestDetails?.find((d) => d.detailId === detailId);

    if (detail) {
      setViewEvaluationModal({
        isOpen: true,
        detailId,
        helperName: detail.helper?.fullName || 'Unknown Helper',
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
      });
    }
  };

  // Evaluation handlers...
  const handleEvaluationSubmit = (evaluation: OrderEvaluation) => {
    changeStatusWithEvaluationMutation.mutate(
      {
        detailId: evaluationModal.detailId,
        status: 'completed',
        comment: evaluation,
      },
      {
        onSuccess: () => {
          setEvaluationModal({ isOpen: false, detailId: '', helperName: '' });
          onRefresh?.();
        },
      }
    );
  };

  const handleEvaluationClose = () => {
    setEvaluationModal({ isOpen: false, detailId: '', helperName: '' });
  };

  const handleViewEvaluationClose = () => {
    setViewEvaluationModal({ isOpen: false, detailId: '', helperName: '' });
  };

  // Get current detail for view evaluation modal
  const currentViewDetail = requestDetails?.find(
    (d) => d.detailId === viewEvaluationModal.detailId
  );

  // Check if any action is loading
  const isAnyActionLoading =
    cancelDetailMutation.isPending ||
    changeStatusMutation.isPending ||
    changeRequestStatusMutation.isPending ||
    changeStatusWithEvaluationMutation.isPending;

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
            handleDeleteDetail,
            handleStart,
            handleComplete,
            handleViewEvaluation, // Thêm handler mới
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

      {/* Existing Confirmation Dialogs... */}
      <ConfirmDialog
        open={detailDeleteConfirmation.isDialogOpen}
        onOpenChange={detailDeleteConfirmation.closeDeleteConfirmation}
        title="Cancel Request Detail"
        description={detailDeleteConfirmation
          .getDeleteDescription()
          .replace('delete', 'cancel')}
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

      {/* Create Evaluation Modal */}
      <OrderEvaluationModal
        isOpen={evaluationModal.isOpen}
        onClose={handleEvaluationClose}
        onSubmit={handleEvaluationSubmit}
        isLoading={changeStatusWithEvaluationMutation.isPending}
        detailId={evaluationModal.detailId}
        helperName={evaluationModal.helperName}
      />

      {/* View Evaluation Modal */}
      {currentViewDetail?.comment && (
        <ViewEvaluationModal
          isOpen={viewEvaluationModal.isOpen}
          onClose={handleViewEvaluationClose}
          comment={currentViewDetail.comment}
          helperName={viewEvaluationModal.helperName}
        />
      )}
    </div>
  );
};

export default OrderDetailInformation;
