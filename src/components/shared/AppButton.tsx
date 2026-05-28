import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import type { LucideIcon } from 'lucide-react'

const appButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-[Manrope] font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shrink-0",
  {
    variants: {
      color: {
        primary: 'bg-brand-navy text-white hover:bg-brand-navy-mid focus-visible:ring-brand-navy/40',
        secondary: 'bg-white text-brand-navy border border-[#D9DEE5] hover:bg-[#F5F7FA] focus-visible:ring-brand-navy/20',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600/40',
        ghost: 'bg-transparent text-brand-navy hover:bg-muted/50',
        teal: 'bg-brand-teal text-brand-navy hover:bg-brand-teal-light focus-visible:ring-brand-teal/40',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded-md gap-1',
        sm: 'h-8 px-3 text-[13px] rounded-md gap-1.5',
        md: 'h-10 px-4 text-[15px] rounded-lg gap-2',
        lg: 'h-11 px-5 text-base rounded-lg gap-2',
        xl: 'h-12 px-6 text-base rounded-lg gap-2.5',
      },
    },
    defaultVariants: {
      color: 'primary',
      size: 'md',
    },
  }
)

interface AppButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof appButtonVariants> {
  startIcon?: LucideIcon
  endIcon?: LucideIcon
  startIconSize?: number
  endIconSize?: number
  loading?: boolean
}

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      className,
      color,
      size,
      startIcon: StartIcon,
      endIcon: EndIcon,
      startIconSize,
      endIconSize,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const iconSize = size === 'xs' || size === 'sm' ? 14 : size === 'lg' || size === 'xl' ? 18 : 16
    const startSize = startIconSize ?? iconSize
    const endSize = endIconSize ?? iconSize

    return (
      <button
        ref={ref}
        className={cn(appButtonVariants({ color, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        ) : StartIcon ? (
          <StartIcon style={{ width: startSize, height: startSize }} className="shrink-0" />
        ) : null}
        {children}
        {EndIcon && !loading && (
          <EndIcon style={{ width: endSize, height: endSize }} className="shrink-0" />
        )}
      </button>
    )
  },
)
AppButton.displayName = 'AppButton'

export { appButtonVariants }
