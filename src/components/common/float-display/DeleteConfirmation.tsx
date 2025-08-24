import type { ReactNode } from 'react';

import ConfirmDialog from '@/components/common/float-display/ConfirmDialog';
import { useConfirmation } from '@/hooks/common/useConfirmation';

interface EntityInfo {
  name?: string;
  code?: string;
  title?: string;
  id?: string;
  phone?: string;
  email?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface GenericDeleteConfirmDialogProps {
  children: ReactNode;
  entityId: string;
  entityName: string; // "Order", "Staff", "Maid", etc.
  entityInfo?: EntityInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteFunction: (id: string) => Promise<any>;
  onDeleteSuccess?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDeleteError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function GenericDeleteConfirmDialog({
  children,
  entityId,
  entityName,
  entityInfo,
  deleteFunction,
  onDeleteSuccess,
  onDeleteError,
  successMessage,
  errorMessage,
  confirmText,
  cancelText = 'Cancel',
}: GenericDeleteConfirmDialogProps) {
  const {
    isDialogOpen,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    handleDeleteConfirm,
    getDeleteDescription,
  } = useConfirmation({
    deleteFunction,
    entityName,
    onDeleteSuccess,
    onDeleteError,
    successMessage,
    errorMessage,
  });

  const handleTriggerClick = () => {
    openDeleteConfirmation(entityId, entityInfo);
  };

  return (
    <ConfirmDialog
      open={isDialogOpen}
      onOpenChange={closeDeleteConfirmation}
      title={`Delete ${entityName}`}
      description={getDeleteDescription()}
      icon={true}
      danger={true}
      confirmText={confirmText || `Delete ${entityName}`}
      cancelText={cancelText}
      onConfirm={handleDeleteConfirm}
    >
      <div onClick={handleTriggerClick}>{children}</div>
    </ConfirmDialog>
  );
}
