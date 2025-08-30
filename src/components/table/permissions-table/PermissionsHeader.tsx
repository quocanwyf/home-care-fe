import React from 'react';

import { Check, X } from 'lucide-react';

import TooltipInfo from '@/components/common/primitives/TooltipInfo';
import PageHeader from '@/components/table/app-table/PageHeader';
import { Button } from '@/components/ui/button';

interface PermissionsHeaderProps {
  showUpdateButtons: boolean;
  isUpdating: boolean;
  onOpenModal: () => void;
  onUpdateChanges: () => void;
  onCancelChanges: () => void;
}

export const PermissionsHeader: React.FC<PermissionsHeaderProps> = ({
  showUpdateButtons,
  isUpdating,
  onOpenModal,
  onUpdateChanges,
  onCancelChanges,
}) => {
  return (
    <div className="sticky top-0 z-10 rounded-full border-b bg-white">
      <PageHeader
        pageHeaderTitle="Management Permissions"
        handleClick={onOpenModal}
        showAddButton={!showUpdateButtons}
      >
        {showUpdateButtons && (
          <div className="flex gap-4">
            <TooltipInfo content="Update changes" side="bottom">
              <Button
                onClick={onUpdateChanges}
                disabled={isUpdating}
                className="cursor-pointer rounded-xl px-3 py-1 transition duration-500 ease-in-out hover:scale-105"
              >
                <div>Update</div>
                <Check className="h-4 w-4" />
              </Button>
            </TooltipInfo>
            <TooltipInfo content="Cancel changes" side="bottom">
              <Button
                onClick={onCancelChanges}
                disabled={isUpdating}
                className="bg-text-destructive hover:bg-text-destructive cursor-pointer rounded-xl px-3 py-1 transition duration-500 ease-in-out hover:scale-105"
              >
                <div>Cancel</div>
                <X className="h-4 w-4" />
              </Button>
            </TooltipInfo>
          </div>
        )}
      </PageHeader>
    </div>
  );
};
