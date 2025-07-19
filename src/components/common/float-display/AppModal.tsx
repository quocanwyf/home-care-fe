import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  width?: string; // tailwind max-w class
  children: React.ReactNode;
  footer?: React.ReactNode;
  showClose?: boolean;
}

export default function AppModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'max-w-xl',
}: AppModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`rounded-2xl ${width}`}>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-2">{children}</div>

        {footer && (
          <DialogFooter className="justify-end gap-4 pt-4">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
