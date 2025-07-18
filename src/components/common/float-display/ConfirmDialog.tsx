import { useState } from 'react';

import { TriangleAlert, UserRoundCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MESSAGES_DIALOG } from '@/constants/messages/messages-dialog';
import { useToast } from '@/hooks/useToast';

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  icon = false,
  onConfirm,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: boolean;
  onConfirm: () => Promise<void>;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onOpenChange(false);
      showSuccess(MESSAGES_DIALOG.SUCCESS);
    } catch (err) {
      showError(MESSAGES_DIALOG.ERROR + err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={isLoading ? () => {} : onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!max-w-[360px] rounded-2xl">
        <DialogHeader className="space-y-2 text-center">
          {icon && (
            <div
              className={`${danger ? 'bg-red-100' : 'bg-blue-100'} mx-auto flex items-center justify-center rounded-full p-4`}
            >
              {icon && (
                <span
                  className={`${danger ? 'text-text-destructive' : 'text-text-confirm'}`}
                >
                  {danger ? <TriangleAlert /> : <UserRoundCheck />}
                </span>
              )}
            </div>
          )}
          <DialogTitle className="flex justify-center text-xl font-extrabold">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="mx-auto mb-4 max-w-4/5 text-center text-sm break-words text-gray-600">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="flex items-center !justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="bg-background-first min-w-1/2 cursor-pointer rounded-4xl py-5"
          >
            {cancelText}
          </Button>
          <Button
            variant={danger ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isLoading}
            className="min-w-1/2 cursor-pointer rounded-4xl py-5"
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
