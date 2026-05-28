import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

interface LoadingOverlayProps {
  /** Show as a full-area overlay (absolute positioned) */
  overlay?: boolean
  label?: string
  className?: string
}

export function LoadingOverlay({
  overlay = false,
  label,
  className,
}: LoadingOverlayProps) {
  if (overlay) {
    return (
      <div
        className={cn(
          'absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm',
          className,
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          {label && (
            <span className="text-sm text-muted-foreground">{label}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center py-12',
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        {label && (
          <span className="text-sm text-muted-foreground">{label}</span>
        )}
      </div>
    </div>
  )
}
