import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Warning as AlertTriangle } from '@mui/icons-material';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'destructive' | 'warning';
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title = 'Confirm Deletion',
  description,
  itemName,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'destructive',
}: DeleteConfirmDialogProps) {
  const defaultDescription = itemName
    ? `Are you sure you want to delete"${itemName}"? This action cannot be undone.`
    : 'Are you sure you want to proceed? This action cannot be undone.';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              variant === 'destructive' 
                ? 'bg-destructive/10 text-destructive' 
                : 'bg-orange-100 text-orange-600 dark:bg-[#F7F7F8]/30 dark:text-orange-400'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pl-[52px]">
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground/90'
                : 'bg-orange-600 text-white700'
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

