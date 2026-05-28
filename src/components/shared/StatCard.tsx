import { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type TrendDirection = 'up' | 'down' | 'neutral'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: string
    direction: TrendDirection
  }
  className?: string
}

const trendColorMap: Record<TrendDirection, string> = {
  up: 'text-emerald-600',
  down: 'text-red-600',
  neutral: 'text-muted-foreground',
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-5 shadow-sm',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {icon && (
          <span className="text-muted-foreground">{icon}</span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {trend && (
          <span
            className={cn('text-xs font-medium', trendColorMap[trend.direction])}
          >
            {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}
