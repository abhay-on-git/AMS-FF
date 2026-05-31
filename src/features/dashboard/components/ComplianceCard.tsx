import { ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/cn'
import { COMPLIANCE_METRICS } from '../constants'
import type { ComplianceStatus } from '../types'

function complianceTextClass(status: ComplianceStatus): string {
  return status === 'good'
    ? 'text-green-700 dark:text-green-400'
    : 'text-amber-700 dark:text-amber-400'
}

export function ComplianceCard() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <ShieldCheck className="w-5 h-5 text-brand-navy dark:text-brand-teal" />
          Compliance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {COMPLIANCE_METRICS.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[14px] font-medium">{metric.label}</p>
              <p className={cn('text-[14px] font-semibold tabular-nums', complianceTextClass(metric.status))}>
                {metric.value}%
              </p>
            </div>
            <Progress value={metric.value} className="h-2" />
            <p className="text-[12px] text-muted-foreground">
              Target: {metric.target}%
              {metric.value >= metric.target ? ' · On target' : ' · Below target'}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
