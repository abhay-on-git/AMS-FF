import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'motion/react'
import { Eye, EyeOff, AlertTriangle, Lock } from 'lucide-react'
import { cn } from '@/lib/cn'
import { PasswordStrengthIndicator } from '@/components/shared/PasswordStrengthIndicator'
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/authSchemas'
import { inputPassword, btnPrimary, labelClass, iconBox, errorBox, pageVariants, spinnerClass } from '../styles'

interface ResetPasswordFormProps {
  onSubmit: (newPassword: string) => Promise<void>
  loading: boolean
  error: string
}

export function ResetPasswordForm({ onSubmit, loading, error }: ResetPasswordFormProps) {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const newPassword = watch('newPassword', '')
  const confirmPassword = watch('confirmPassword', '')

  const onFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data.newPassword)
  })

  return (
    <motion.div key="forgot-reset" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="text-center mb-8">
        <div className={cn(iconBox, 'bg-brand-navy/8 dark:bg-brand-teal/20')}>
          <Lock className="h-8 w-8 text-brand-navy dark:text-brand-teal" />
        </div>
        <h1 className="text-26 font-medium text-brand-navy dark:text-white">
          Reset Password
        </h1>
        <p className="text-15 text-muted-foreground mt-2">
          Create a new secure password for your account
        </p>
      </div>

      <form onSubmit={onFormSubmit} className="space-y-5">
        {/* New password */}
        <div>
          <label htmlFor="new-password" className={labelClass}>
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              autoFocus
              className={cn(inputPassword, errors.newPassword && 'border-destructive')}
              {...register('newPassword')}
            />
            <button
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-destructive mt-1">{errors.newPassword.message}</p>
          )}
          {newPassword && <PasswordStrengthIndicator password={newPassword} />}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirm-password" className={labelClass}>
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter new password"
              className={cn(inputPassword, errors.confirmPassword && 'border-destructive')}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-13 text-red-600 dark:text-red-400 mt-1">Passwords do not match</p>
          )}
          {errors.confirmPassword && !confirmPassword && (
            <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Server error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={errorBox}
          >
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
            <p className="text-[14px] text-red-700 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={btnPrimary}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className={spinnerClass} />
              Resetting...
            </span>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </motion.div>
  )
}
