import { motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/cn'

interface PasswordStrengthIndicatorProps {
  password: string
}

function getPasswordStrength(pw: string): number {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (pw.length >= 12) s++
  return s
}

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent']
const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500']
const strengthTextColors = ['', 'text-red-600', 'text-orange-600', 'text-yellow-600', 'text-green-600', 'text-green-600']

const requirements = [
  { check: (pw: string) => pw.length >= 8, label: 'At least 8 characters' },
  { check: (pw: string) => /[A-Z]/.test(pw), label: 'One uppercase letter' },
  { check: (pw: string) => /[0-9]/.test(pw), label: 'One number' },
  { check: (pw: string) => /[^A-Za-z0-9]/.test(pw), label: 'One special character' },
]

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strengthLevel = getPasswordStrength(password)
  const label = strengthLabels[strengthLevel] || ''
  const barColor = strengthColors[strengthLevel] || ''
  const textColor = strengthTextColors[strengthLevel] || ''

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="pt-2"
    >
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((l) => (
          <div
            key={l}
            className={cn(
              'h-2 flex-1 rounded-full transition-colors',
              l <= strengthLevel ? barColor : 'bg-muted',
            )}
          />
        ))}
      </div>
      <p className={cn('text-[13px] mt-1.5 font-medium', textColor)}>
        {label}
      </p>
      <div className="mt-2 space-y-1.5">
        {requirements.map((r) => {
          const passed = r.check(password)
          return (
            <div key={r.label} className="flex items-center gap-2 text-[13px]">
              <CheckCircle2
                className={cn(
                  'h-4 w-4',
                  passed ? 'text-green-500' : 'text-muted-foreground/40',
                )}
              />
              <span className={passed ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}>
                {r.label}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
