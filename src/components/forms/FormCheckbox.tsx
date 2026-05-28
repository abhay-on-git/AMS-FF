import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface FormCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  label: string
  error?: string
  description?: string
  className?: string
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, description, className, id, ...inputProps }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={cn('space-y-1', className)}>
        <div className="flex items-start gap-2">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            aria-invalid={!!error}
            className={cn(
              'mt-0.5 h-4 w-4 rounded border border-input text-primary',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
            {...inputProps}
          />
          <div className="space-y-0.5">
            <label
              htmlFor={inputId}
              className="text-sm font-medium text-foreground leading-none"
            >
              {label}
            </label>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    )
  },
)

FormCheckbox.displayName = 'FormCheckbox'
