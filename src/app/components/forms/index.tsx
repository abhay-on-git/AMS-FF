/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FORM COMPONENTS
 * Reusable, typed form components built on top of React Hook Form + Zod
 *
 * WHY: Repeated form field markup causes:
 *   - Inconsistent validation
 *   - Duplicated markup
 *   - Unmaintainable forms
 *
 * ENTERPRISE BENEFIT:
 *   - Consistent form styling across app
 *   - Centralized validation logic
 *   - Schema-driven validation with Zod
 *   - Accessible by default
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { forwardRef } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "../../lib/cn";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Base Form Field Wrapper ────────────────────────────────────────────────

interface FormFieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormFieldWrapper({
  label,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldWrapperProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

// ─── Form Input ─────────────────────────────────────────────────────────────

export interface FormInputProps
  extends React.ComponentPropsWithoutRef<typeof Input> {
  name: string;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, label, error, hint, required, className, ...props }, ref) => {
    return (
      <FormFieldWrapper
        label={label}
        error={error}
        hint={hint}
        required={required}
      >
        <Input
          ref={ref}
          name={name}
          aria-invalid={!!error}
          className={cn(error && "ring-1 ring-destructive focus-visible:ring-destructive")}
          {...props}
        />
      </FormFieldWrapper>
    );
  }
);

FormInput.displayName = "FormInput";

// ─── Form Textarea ──────────────────────────────────────────────────────────

export interface FormTextareaProps
  extends React.ComponentPropsWithoutRef<typeof Textarea> {
  name: string;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ name, label, error, hint, required, className, ...props }, ref) => {
    return (
      <FormFieldWrapper
        label={label}
        error={error}
        hint={hint}
        required={required}
      >
        <Textarea
          ref={ref}
          name={name}
          aria-invalid={!!error}
          className={cn(error && "ring-1 ring-destructive focus-visible:ring-destructive")}
          {...props}
        />
      </FormFieldWrapper>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

// ─── Form Select ────────────────────────────────────────────────────────────

export interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Select>, "value" | "onChange"> {
  name: string;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: FormSelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      name,
      label,
      error,
      hint,
      required,
      options,
      placeholder = "Select...",
      value,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <FormFieldWrapper
        label={label}
        error={error}
        hint={hint}
        required={required}
      >
        <Select
          value={value}
          onValueChange={onChange}
          {...props}
        >
          <SelectTrigger
            ref={ref}
            className={cn(
              error && "ring-1 ring-destructive focus-visible:ring-destructive"
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldWrapper>
    );
  }
);

FormSelect.displayName = "FormSelect";

// ─── Form Checkbox ──────────────────────────────────────────────────────────

export interface FormCheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "type"> {
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ name, label, error, required, className, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          name={name}
          id={name}
          aria-invalid={!!error}
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary",
            error && "ring-1 ring-destructive",
            className
          )}
          {...props}
        />
        {label && (
          <Label htmlFor={name} className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FormCheckbox.displayName = "FormCheckbox";

// ─── Form Date Picker ────────────────────────────────────────────────────────

export interface FormDatePickerProps
  extends React.ComponentPropsWithoutRef<typeof Input> {
  name: string;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const FormDatePicker = forwardRef<HTMLInputElement, FormDatePickerProps>(
  ({ name, label, error, hint, required, className, ...props }, ref) => {
    return (
      <FormFieldWrapper
        label={label}
        error={error}
        hint={hint}
        required={required}
      >
        <Input
          ref={ref}
          type="date"
          name={name}
          aria-invalid={!!error}
          className={cn(error && "ring-1 ring-destructive focus-visible:ring-destructive")}
          {...props}
        />
      </FormFieldWrapper>
    );
  }
);

FormDatePicker.displayName = "FormDatePicker";

// ─── Form Actions ────────────────────────────────────────────────────────────

interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function FormActions({
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onCancel,
  isLoading = false,
  className,
}: FormActionsProps) {
  return (
    <div className={cn("flex items-center gap-3 pt-4", className)}>
      <Button
        type="submit"
        disabled={isLoading}
        className="min-w-[100px]"
      >
        {isLoading ? "Loading..." : submitLabel}
      </Button>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
      )}
    </div>
  );
}
