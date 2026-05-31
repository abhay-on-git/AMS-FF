import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info, Copy } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { DrawerFormFooter, PasswordStrengthIndicator } from '@/components/shared'
import { FormInput, FormSelect } from '@/components/forms'
import { useResetPassword } from '../../hooks/useUserMutations'
import { resetPasswordSchema } from '../../schemas/userSchemas'
import type { ResetPasswordFormData } from '../../schemas/userSchemas'
import type { UserData } from '../../types'

const METHOD_OPTIONS = [
  { value: 'manual',        label: 'Set manually' },
  { value: 'email-link',    label: 'Send email link' },
  { value: 'temp-password', label: 'Generate temporary password' },
]

const TEMP_PASSWORD = 'Temp@2024!'

interface ResetPasswordDrawerProps {
  open:         boolean
  onOpenChange: (open: boolean) => void
  user:         UserData | null
}

export function ResetPasswordDrawer({ open, onOpenChange, user }: ResetPasswordDrawerProps) {
  const mutation = useResetPassword()

  const { register, handleSubmit, control, reset, watch, formState: { errors } } =
    useForm<ResetPasswordFormData>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
        method:              'manual',
        forceChange:         true,
        notifyUser:          true,
        revokeOtherSessions: false,
      },
    })

  useEffect(() => {
    if (open) {
      reset({ method: 'manual', forceChange: true, notifyUser: true, revokeOtherSessions: false })
    }
  }, [open, reset])

  const method      = watch('method')
  const newPassword = watch('newPassword') ?? ''

  const onSubmit = handleSubmit((data) => {
    if (!user) return
    mutation.mutate({ id: user.id, data }, { onSuccess: () => onOpenChange(false) })
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="text-[18px]">Reset Password</SheetTitle>
          <SheetDescription className="text-13">
            {user ? `Reset password for ${user.name}` : 'Reset user password'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
            <FormSelect
              label="Reset Method"
              required
              options={METHOD_OPTIONS}
              {...register('method')}
            />

            {method === 'manual' && (
              <div className="flex flex-col gap-4">
                <div>
                  <FormInput
                    label="New Password"
                    type="password"
                    required
                    error={errors.newPassword?.message}
                    {...register('newPassword')}
                  />
                  {newPassword && <PasswordStrengthIndicator password={newPassword} />}
                </div>
                <FormInput
                  label="Confirm Password"
                  type="password"
                  required
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>
            )}

            {method === 'email-link' && (
              <div className="flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 p-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <p className="text-13 text-blue-700">
                  A password-reset link will be sent to <strong>{user?.email}</strong>.
                  The link expires in 24 hours.
                </p>
              </div>
            )}

            {method === 'temp-password' && (
              <div className="flex flex-col gap-2">
                <Label className="text-13 font-medium">Generated Password</Label>
                <div className="flex items-center gap-2 rounded-md border bg-muted px-4 py-2.5">
                  <span className="flex-1 font-mono text-13 tracking-widest">{TEMP_PASSWORD}</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(TEMP_PASSWORD)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[12px] text-muted-foreground">
                  User will be required to change this on first login.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 rounded-md border p-4">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                Options
              </p>
              {(
                [
                  { name: 'forceChange',        label: 'Force change on next login' },
                  { name: 'notifyUser',          label: 'Notify user by email' },
                  { name: 'revokeOtherSessions', label: 'Revoke all other active sessions' },
                ] as const
              ).map(({ name, label }) => (
                <Controller
                  key={name}
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={name}
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor={name} className="text-13 font-normal cursor-pointer">
                        {label}
                      </Label>
                    </div>
                  )}
                />
              ))}
            </div>
          </div>

          <DrawerFormFooter
            onCancel={() => onOpenChange(false)}
            isSubmitting={mutation.isPending}
            submitLabel="Reset Password"
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
