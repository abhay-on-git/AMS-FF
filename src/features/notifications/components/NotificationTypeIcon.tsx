import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import type { NotificationType } from '../types'

interface NotificationTypeIconProps {
  type: NotificationType
  className?: string
}

export function NotificationTypeIcon({ type, className = 'w-6 h-6' }: NotificationTypeIconProps) {
  switch (type) {
    case 'warning':
      return <AlertCircle className={`${className} text-amber-600`} />
    case 'success':
      return <CheckCircle2 className={`${className} text-green-600`} />
    case 'info':
    default:
      return <Info className={`${className} text-blue-600`} />
  }
}
