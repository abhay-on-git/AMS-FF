import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'motion/react'
import { Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/cn'
import { loginSchema, type LoginFormData } from '../schemas/authSchemas'
import { inputBase, inputPassword, btnPrimary, btnSecondary, labelClass, errorBox, pageVariants, spinnerClass } from '../styles'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  onForgotPassword: () => void
  loading: boolean
  error: string
}

export function LoginForm({ onSubmit, onForgotPassword, loading, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data.email, data.password)
  })

  return (
    <motion.div key="login" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="text-center mb-8">
        <h1 className="text-28 font-medium text-brand-navy dark:text-white leading-tight">
          Log in to your account
        </h1>
        <p className="text-15 text-muted-foreground mt-2">
          Welcome back! Choose your log in method.
        </p>
      </div>

      <form onSubmit={onFormSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className={labelClass}>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            className={cn(inputBase, errors.email && 'border-destructive')}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="login-password" className="block text-15 font-medium text-brand-navy dark:text-white">
              Password <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              className="text-13 font-medium text-brand-navy dark:text-brand-teal hover:underline"
              onClick={onForgotPassword}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={cn(inputPassword, errors.password && 'border-destructive')}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
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
          className={btnPrimary}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className={spinnerClass} />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center my-7">
        <div className="flex-1 h-px bg-divider dark:bg-brand-navy-border" />
        <span className="mx-4 text-13 text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-divider dark:bg-brand-navy-border" />
      </div>

      {/* Google SSO */}
      <button
        type="button"
        className={btnSecondary}
        onClick={() => toast.info('Google Sign-In coming soon!')}
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>
    </motion.div>
  )
}
