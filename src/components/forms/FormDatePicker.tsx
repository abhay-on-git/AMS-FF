import { forwardRef, InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'
import { FormField } from './FormField'
import { cn } from '@/lib/cn'

interface FormDatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  label: string
  error?: string
  description?: string
  wrapperClassName?: string
  inputClassName?: string
}

export const FormDatePicker = forwardRef<HTMLInputElement, FormDatePickerProps>(
  (
    {
      label,
      error,
      required,
      description,
      wrapperClassName,
      inputClassName,
      id,
      ...inputProps
    },
    ref,
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <FormField
        label={label}
        htmlFor={inputId}
        error={error}
        required={required}
        description={description}
        className={wrapperClassName}
      >
        <Input
          ref={ref}
          id={inputId}
          type="date"
          aria-invalid={!!error}
          className={cn(error && 'border-destructive', inputClassName)}
          {...inputProps}
        />
      </FormField>
    )
  },
)

FormDatePicker.displayName = 'FormDatePicker'
