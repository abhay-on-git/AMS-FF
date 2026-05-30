import { forwardRef, TextareaHTMLAttributes } from 'react'
import { FormField } from './FormField'
import { cn } from '@/lib/cn'

interface FormTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label: string
  error?: string
  description?: string
  wrapperClassName?: string
  textareaClassName?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      error,
      required,
      description,
      wrapperClassName,
      textareaClassName,
      id,
      ...textareaProps
    },
    ref,
  ) => {
    const textareaId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <FormField
        label={label}
        htmlFor={textareaId}
        error={error}
        required={required}
        description={description}
        className={wrapperClassName}
      >
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive',
            textareaClassName,
          )}
          {...textareaProps}
        />
      </FormField>
    )
  },
)

FormTextarea.displayName = 'FormTextarea'
