import { forwardRef, SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { FormField } from './FormField'
import { cn } from '@/lib/cn'

interface SelectOption {
  label: string
  value: string
}

interface FormSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label: string
  options: SelectOption[]
  error?: string
  description?: string
  placeholder?: string
  wrapperClassName?: string
  selectClassName?: string
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      options,
      error,
      required,
      description,
      placeholder,
      wrapperClassName,
      selectClassName,
      id,
      ...selectProps
    },
    ref,
  ) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <FormField
        label={label}
        htmlFor={selectId}
        error={error}
        required={required}
        description={description}
        className={wrapperClassName}
      >
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            className={cn(
              'flex h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive',
              selectClassName,
            )}
            {...selectProps}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </FormField>
    )
  },
)

FormSelect.displayName = 'FormSelect'
