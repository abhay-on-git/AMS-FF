import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'motion/react'
import { ArrowLeft, Mail } from 'lucide-react'
import { cn } from '@/lib/cn'
import { forgotEmailSchema, type ForgotEmailFormData } from '../schemas/authSchemas'
import { inputBase, btnPrimary, labelClass, iconBox, pageVariants, spinnerClass } from '../styles'

interface ForgotEmailFormProps {
  onSubmit: (email: string) => Promise<void>
  onBack: () => void
  loading: boolean
}

export function ForgotEmailForm({ onSubmit, onBack, loading }: ForgotEmailFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotEmailFormData>({
    resolver: zodResolver(forgotEmailSchema),
  })

  const onFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data.email)
  })

  return (
    <motion.div key="forgot-email" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[14px] text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-[18px] w-[18px]" />
      </button>

      <div className="text-center mb-8">
        <div className={cn(iconBox, 'bg-brand-navy/8 dark:bg-brand-teal/20')}>
          <Mail className="h-8 w-8 text-brand-navy dark:text-brand-teal" />
        </div>
        <h1 className="text-26 font-medium text-brand-navy dark:text-white">
          Forgot Password?
        </h1>
        <p className="text-15 text-muted-foreground mt-2 leading-relaxed">
          Enter your email and we'll send you a 4-digit verification code
        </p>
      </div>

      <form onSubmit={onFormSubmit} className="space-y-5">
        <div>
          <label htmlFor="forgot-email-input" className={labelClass}>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="forgot-email-input"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            autoFocus
            className={cn(inputBase, errors.email && 'border-destructive')}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={btnPrimary}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className={spinnerClass} />
              Sending OTP...
            </span>
          ) : (
            'Send Verification Code'
          )}
        </button>
      </form>
    </motion.div>
  )
}
