import { motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { AuthLayout, LoginForm, ForgotEmailForm, OtpVerification, ResetPasswordForm } from '@/features/auth/components'

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
}

export default function AuthPage() {
  const auth = useAuth()

  const renderStep = () => {
    switch (auth.step) {
      case 'login':
        return (
          <LoginForm
            onSubmit={auth.handleLogin}
            onForgotPassword={auth.goToForgot}
            loading={auth.loading}
            error={auth.error}
          />
        )
      case 'forgot-email':
        return (
          <ForgotEmailForm
            onSubmit={auth.handleForgotEmail}
            onBack={auth.resetToLogin}
            loading={auth.loading}
          />
        )
      case 'forgot-otp':
        return (
          <OtpVerification
            email={auth.forgotEmail}
            onVerify={auth.handleVerifyOtp}
            onResend={auth.handleResendOtp}
            onBack={auth.goBackToForgotEmail}
            loading={auth.loading}
            error={auth.error}
            resendTimer={auth.resendTimer}
          />
        )
      case 'forgot-reset':
        return (
          <ResetPasswordForm
            onSubmit={auth.handleResetPassword}
            loading={auth.loading}
            error={auth.error}
          />
        )
      case 'forgot-success':
        return (
          <motion.div key="forgot-success" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="h-10 w-10 text-foreground dark:text-white" />
            </motion.div>
            <h1 className="text-2xl font-medium text-foreground mb-3">
              Password Reset Complete
            </h1>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button
              onClick={auth.resetToLogin}
              className="w-full h-[52px] text-15 font-medium rounded-xl bg-brand-navy hover:bg-brand-navy-mid text-white transition-all"
            >
              Back to Sign In
            </button>
          </motion.div>
        )
    }
  }

  return <AuthLayout>{renderStep()}</AuthLayout>
}
