import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { TREND_DATA_SETS, getTrendPeriodLabel } from '../constants'
import type { TrendPeriod } from '../types'

const PERIODS: TrendPeriod[] = ['weekly', 'monthly', 'quarterly', 'yearly']

const TOOLTIP_STYLE = {
  fontSize: 12,
  borderRadius: 8,
  border: '1px solid hsl(var(--border))',
}

export function AssetTrendChart() {
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>('monthly')
  const [trendOffset, setTrendOffset] = useState(0)

  const periodSet = TREND_DATA_SETS[trendPeriod]
  const maxOffset = periodSet.data.length - 1
  const safeOffset = Math.min(trendOffset, maxOffset)
  const chartData = periodSet.data[safeOffset] ?? periodSet.data[0]
  const periodLabel = getTrendPeriodLabel(trendPeriod, safeOffset)

  const handlePeriodChange = (period: TrendPeriod) => {
    setTrendPeriod(period)
    setTrendOffset(0)
  }

  const canGoBack = safeOffset < maxOffset
  const canGoForward = safeOffset > 0

  const series = useMemo(
    () => [
      { key: 'total', name: 'Total Assets', stroke: '#4F83E3', fill: '#4F83E3' },
      { key: 'acquired', name: 'Acquired', stroke: '#81CCD7', fill: '#81CCD7' },
      { key: 'disposed', name: 'Disposed', stroke: '#EF652B', fill: '#EF652B' },
    ],
    [],
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="w-5 h-5 text-brand-navy dark:text-brand-teal" />
            Asset Trend
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px]">
              {PERIODS.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => handlePeriodChange(period)}
                  className={cn(
                    'px-3 py-1.5 rounded-[4px] text-[13px] transition-colors capitalize',
                    trendPeriod === period
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'text-brand-navy hover:bg-black/5 dark:text-foreground dark:hover:bg-white/10',
                  )}
                >
                  {TREND_DATA_SETS[period].label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={!canGoBack}
                onClick={() => setTrendOffset((o) => Math.min(o + 1, maxOffset))}
                aria-label="Previous period range"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-[13px] text-muted-foreground min-w-[140px] text-center">
                {periodLabel}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={!canGoForward}
                onClick={() => setTrendOffset((o) => Math.max(o - 1, 0))}
                aria-label="Next period range"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number, name: string) => [value.toLocaleString(), name]}
              contentStyle={TOOLTIP_STYLE}
            />
            <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
            {series.map(({ key, name, stroke, fill }) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={name}
                stroke={stroke}
                fill={fill}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
