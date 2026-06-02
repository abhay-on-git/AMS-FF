import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { KpiCardItem } from '../types'
import { KPI_ICONS } from './dashboardIcons'

interface KpiCardProps {
  kpi: KpiCardItem
}

export function KpiCard({ kpi }: KpiCardProps) {
  const navigate = useNavigate()
  const Icon = KPI_ICONS[kpi.iconKey]

  return (
    <Card
      className="transition-shadow cursor-pointer group"
      onClick={() => navigate(kpi.href)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
            <Icon className="w-5 h-5 text-brand-navy dark:text-white" />
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-2xl font-bold">{kpi.value}</p>
        <p className="text-md text-muted-foreground mt-0.5">{kpi.label}</p>
      </CardContent>
    </Card>
  )
}
