import { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface PageShellProps {
  children: ReactNode
  className?: string
  /** Constrain content width (default: full) */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const maxWidthMap = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
} as const

export function PageShell({
  children,
  className,
  maxWidth = 'full',
}: PageShellProps) {
  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto p-6',
        maxWidthMap[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  )
}
