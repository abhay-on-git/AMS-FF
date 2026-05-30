import { forwardRef, InputHTMLAttributes } from 'react'
import { FormField } from './FormField'
import { cn } from '@/lib/cn'

interface RadioOption {
  label: string
  value: string
  description?: string
}

interface FormRadioGroupProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type' | 'value'> {
  label: string
  options: RadioOption[]
  value?: string
  error?: string
  description?: string
  orientation?: 'vertical' | 'horizontal'
  wrapperClassName?: string
}

export const FormRadioGroup = forwardRef<HTMLInputElement, FormRadioGroupProps>(
  (
    {
      label,
      options,
      value,
      error,
      required,
      description,
      orientation = 'vertical',
      wrapperClassName,
      name,
      onChange,
      ...inputProps
    },
    ref,
  ) => {
    const groupName = name || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <FormField
        label={label}
        error={error}
        required={required}
        description={description}
        className={wrapperClassName}
      >
        <div
          role="radiogroup"
          aria-label={label}
          className={cn(
            'flex gap-3',
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
          )}
        >
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-start gap-2 cursor-pointer"
            >
              <input
                ref={value === opt.value ? ref : undefined}
                type="radio"
                name={groupName}
                value={opt.value}
                checked={value === opt.value}
                onChange={onChange}
                aria-invalid={!!error}
                className={cn(
                  'mt-0.5 h-4 w-4 border border-input text-primary',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
                {...inputProps}
              />
              <div className="space-y-0.5">
                <span className="text-sm font-medium text-foreground leading-none">
                  {opt.label}
                </span>
                {opt.description && (
                  <p className="text-xs text-muted-foreground">
                    {opt.description}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>
      </FormField>
    )
  },
)

FormRadioGroup.displayName = 'FormRadioGroup'
