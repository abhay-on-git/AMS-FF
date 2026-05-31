import { lazy, Suspense } from 'react'
import { Calendar, ClipboardList, Gavel, MapPin, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { OfficeMetrics } from '../types'

const AssetValueChart = lazy(() =>
  import('./charts/AssetValueChart').then((m) => ({ default: m.AssetValueChart })),
)
const LifecycleDistributionChart = lazy(() =>
  import('./charts/LifecycleDistributionChart').then((m) => ({
    default: m.LifecycleDistributionChart,
  })),
)
const MonthlyTrendsChart = lazy(() =>
  import('./charts/MonthlyTrendsChart').then((m) => ({ default: m.MonthlyTrendsChart })),
)
const DisposalTrendsChart = lazy(() =>
  import('./charts/DisposalTrendsChart').then((m) => ({ default: m.DisposalTrendsChart })),
)
const SurveyVolumeChart = lazy(() =>
  import('./charts/SurveyVolumeChart').then((m) => ({ default: m.SurveyVolumeChart })),
)

function ChartSkeleton() {
  return <Skeleton className="h-[280px] w-full rounded-md" />
}

interface ReportsDashboardChartsProps {
  metrics?: OfficeMetrics
}

export function ReportsDashboardCharts({ metrics }: ReportsDashboardChartsProps) {
  if (!metrics) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[320px] w-full rounded-xl" />
        <Skeleton className="h-[320px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              Asset Value &amp; Count by Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <AssetValueChart data={metrics.assetValueByLocation} />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Lifecycle Stage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <LifecycleDistributionChart data={metrics.lifecycleBreakdown} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Monthly Activity Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <MonthlyTrendsChart data={metrics.monthlyTrends} />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gavel className="h-5 w-5 text-muted-foreground" />
              Disposal Trends by Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <DisposalTrendsChart data={metrics.disposalTrends} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            Survey Case Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ChartSkeleton />}>
            <SurveyVolumeChart data={metrics.surveyCaseVolume} />
          </Suspense>
        </CardContent>
      </Card>
    </>
  )
}
