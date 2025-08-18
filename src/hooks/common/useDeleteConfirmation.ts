import { useState } from 'react';

import { useToast } from '@/hooks/common/useToast';

interface EntityInfo {
  cost?: number;
  orderDate?: string;
  phoneNumberCustomers?: string;
  serviceCategory?: string;
  status?: string;
  [key: string]: any; // Allow any additional fields
}

interface UseDeleteConfirmationProps {
  deleteFunction: (id: string) => Promise<any>; // Generic delete function
  entityName: string; // "Order", "Staff", "Maid", etc.
  onDeleteSuccess?: () => void;
  onDeleteError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useDeleteConfirmation = ({
  deleteFunction,
  entityName,
  onDeleteSuccess,
  onDeleteError,
  successMessage,
  errorMessage,
}: UseDeleteConfirmationProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEntityInfo, setSelectedEntityInfo] =
    useState<EntityInfo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showSuccess, showError } = useToast();

  const openDeleteConfirmation = (id: string, entityInfo?: EntityInfo) => {
    setSelectedId(id);
    console.log('Opening delete confirmation for:', id, entityInfo);
    setSelectedEntityInfo(entityInfo || null);
    setIsDialogOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDialogOpen(false);
    setSelectedId(null);
    setSelectedEntityInfo(null);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!selectedId) {
      throw new Error(`No ${entityName.toLowerCase()} selected for deletion`);
    }

    setIsDeleting(true);

    try {
      const response = await deleteFunction(selectedId);

      // Handle different response formats
      if (response?.success !== false) {
        // Consider success if not explicitly false
        showSuccess(successMessage || `${entityName} deleted successfully!`);
        onDeleteSuccess?.();
      } else {
        throw new Error(
          response?.message || `Failed to delete ${entityName.toLowerCase()}`
        );
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        errorMessage ||
        `Failed to delete ${entityName.toLowerCase()}`;

      showError(errorMsg);
      onDeleteError?.(error);
      throw error; // Re-throw để ConfirmDialog handle loading state
    } finally {
      setIsDeleting(false);
    }
  };

  const getDeleteDescription = (): string => {
    if (!selectedEntityInfo) {
      return `Are you sure you want to cancel this ${entityName.toLowerCase()}?\n\nThis action cannot be undone.`;
    }
    let description = `Are you sure you want to cancel this ${entityName.toLowerCase()}?\n\n`;
    if (selectedId) {
      description += `ID: ${selectedId}\n`;
    }
    description += 'This action cannot be undone.';

    return description;
  };

  return {
    // States
    isDialogOpen,
    selectedId,
    selectedEntityInfo,
    isDeleting,

    // Actions
    openDeleteConfirmation,
    closeDeleteConfirmation,
    handleDeleteConfirm,
    getDeleteDescription,
  };
};
