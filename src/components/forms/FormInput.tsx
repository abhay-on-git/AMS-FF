import { forwardRef, InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'
import { FormField } from './FormField'
import { cn } from '@/lib/cn'

interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
  error?: string
  description?: string
  wrapperClassName?: string
  inputClassName?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
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
          aria-invalid={!!error}
          className={cn(error && 'border-destructive', inputClassName)}
          {...inputProps}
        />
      </FormField>
    )
  },
)

FormInput.displayName = 'FormInput'
