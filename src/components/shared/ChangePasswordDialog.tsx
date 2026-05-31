import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DrawerFormFooter } from '@/components/shared/DrawerFormFooter'
import { PasswordStrengthIndicator } from '@/components/shared/PasswordStrengthIndicator'
import { FormInput } from '@/components/forms'
import { handleError } from '@/lib/handleError'
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/features/profile/schemas/changePasswordSchema'
import { changePassword } from '@/features/profile/services/profileService'

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const newPassword = watch('newPassword') ?? ''

  useEffect(() => {
    if (open) {
      setStep('form')
      reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    }
  }, [open, reset])

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => setStep('form'), 300)
  }

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true)
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setStep('success')
      toast.success('Password changed successfully!')
    } catch (err) {
      handleError(err)
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? onOpenChange(true) : handleClose())}>
      <SheetContent side="right" className="!w-full sm:!max-w-md flex flex-col overflow-hidden p-0">
        <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-15">Change Password</SheetTitle>
          <SheetDescription className="text-[14px]">
            Update your account password
          </SheetDescription>
        </SheetHeader>

        {step === 'form' ? (
          <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              <FormInput
                label="Current Password"
                type="password"
                required
                autoComplete="current-password"
                error={errors.currentPassword?.message}
                inputClassName="h-[52px] text-15"
                {...register('currentPassword')}
              />

              <Separator />

              <div className="space-y-2">
                <FormInput
                  label="New Password"
                  type="password"
                  required
                  autoComplete="new-password"
                  error={errors.newPassword?.message}
                  inputClassName="h-[52px] text-15"
                  {...register('newPassword')}
                />
                {newPassword ? <PasswordStrengthIndicator password={newPassword} /> : null}
              </div>

              <FormInput
                label="Confirm New Password"
                type="password"
                required
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                inputClassName="h-[52px] text-15"
                {...register('confirmPassword')}
              />

              <div className="rounded-md border bg-muted/50 px-4 py-4">
                <p className="text-13 font-semibold text-muted-foreground uppercase tracking-wider">
                  Password tips
                </p>
                <ul className="mt-2 space-y-1 text-[14px] text-muted-foreground list-none">
                  <li>• Use a mix of letters, numbers, and symbols</li>
                  <li>• Avoid using personal information</li>
                  <li>• Do not reuse passwords from other accounts</li>
                </ul>
              </div>
            </div>

            <DrawerFormFooter
              onCancel={handleClose}
              submitLabel={submitting ? 'Updating...' : 'Update Password'}
              loading={submitting}
            />
          </form>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy dark:text-white mb-1">
              Password updated
            </h3>
            <p className="text-15 text-muted-foreground mb-8 max-w-xs">
              Your password has been changed successfully. Use your new password next time you sign in.
            </p>
            <Button onClick={handleClose} className="w-full max-w-xs">
              Done
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
