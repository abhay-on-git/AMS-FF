import { useState, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, ShieldCheck, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/cn'
import { btnPrimary, iconBox, pageVariants, spinnerClass } from '../styles'

interface OtpVerificationProps {
  email: string
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<void>
  onBack: () => void
  loading: boolean
  error: string
  resendTimer: number
}

export function OtpVerification({
  email,
  onVerify,
  onResend,
  onBack,
  loading,
  error,
  resendTimer,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 4).split('')
      const newOtp = [...otp]
      digits.forEach((d, i) => {
        if (index + i < 4) newOtp[index + i] = d
      })
      setOtp(newOtp)
      otpRefs.current[Math.min(index + digits.length, 3)]?.focus()
      return
    }
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 3) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const entered = otp.join('')
    if (entered.length === 4) {
      onVerify(entered)
    }
  }

  return (
    <motion.div key="forgot-otp" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[14px] text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-[18px] w-[18px]" />
      </button>

      <div className="text-center mb-8">
        <div className={cn(iconBox, 'bg-brand-teal/20')}>
          <ShieldCheck className="h-[30px] w-[30px] text-brand-navy dark:text-brand-teal" />
        </div>
        <h1 className="text-26 font-medium text-brand-navy dark:text-white">
          Verify Your Email
        </h1>
        <p className="text-15 text-muted-foreground mt-2 leading-relaxed">
          We sent a 4-digit code to{' '}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { otpRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className={cn(
                'w-[66px] h-[66px] text-center text-26 font-medium rounded-2xl bg-white dark:bg-brand-navy-mid outline-none transition-all border-2',
                error
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : digit
                    ? 'border-brand-navy dark:border-brand-teal'
                    : 'border-input-border dark:border-brand-navy-border focus:border-brand-navy dark:focus:border-brand-teal focus:ring-2 focus:ring-brand-navy/10',
              )}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-[14px] text-red-600 dark:text-red-400"
          >
            <AlertTriangle className="h-[18px] w-[18px]" /> {error}
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
              Verifying...
            </span>
          ) : (
            'Verify Code'
          )}
        </button>

        <p className="text-[14px] text-center text-muted-foreground">
          Didn't receive the code?{' '}
          {resendTimer > 0 ? (
            <span>Resend in {resendTimer}s</span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              className="font-medium text-brand-navy dark:text-brand-teal hover:underline"
            >
              Resend Code
            </button>
          )}
        </p>
      </form>
    </motion.div>
  )
}
