import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

interface DrawerFormFooterProps {
  onCancel: () => void
  onSubmit?: () => void
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
  disabled?: boolean
  variant?: 'default' | 'destructive'
  className?: string
}

export function DrawerFormFooter({
  onCancel,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  disabled = false,
  variant = 'default',
  className,
}: DrawerFormFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 border-t px-6 py-4',
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={loading}
      >
        {cancelLabel}
      </Button>
      <Button
        type={onSubmit ? 'button' : 'submit'}
        variant={variant}
        onClick={onSubmit}
        disabled={disabled || loading}
      >
        {loading ? 'Saving...' : submitLabel}
      </Button>
    </div>
  )
}
