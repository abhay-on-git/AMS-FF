import { AlertCircle, Package, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { OfficeMetrics } from '../types'

interface ReportsDashboardKPIsProps {
  metrics?: OfficeMetrics
  isLoading: boolean
}

export function ReportsDashboardKPIs({ metrics, isLoading }: ReportsDashboardKPIsProps) {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <StatCard
        label="Total Assets"
        value={metrics.totalAssets.toLocaleString()}
        icon={<Package className="h-5 w-5 text-brand-navy dark:text-brand-teal" />}
      />
      <StatCard
        label="Total Value"
        value={metrics.totalValue}
        icon={<TrendingUp className="h-5 w-5 text-brand-navy dark:text-brand-teal" />}
      />
      <StatCard
        label="Pending Actions"
        value={String(metrics.pendingCount)}
        icon={<AlertCircle className="h-5 w-5 text-brand-navy dark:text-brand-teal" />}
      />
    </div>
  )
}
