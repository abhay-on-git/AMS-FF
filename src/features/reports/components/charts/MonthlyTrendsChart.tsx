import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_COLORS } from '../../constants/reportingData'
import type { MonthlyTrendPoint } from '../../types'
import { CHART_TOOLTIP_STYLE } from './chartTooltip'

interface MonthlyTrendsChartProps {
  data: MonthlyTrendPoint[]
}

export function MonthlyTrendsChart({ data }: MonthlyTrendsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
        <Line
          type="monotone"
          dataKey="acquisitions"
          stroke={CHART_COLORS.series1}
          name="Acquisitions"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="disposals"
          stroke={CHART_COLORS.series3}
          name="Disposals"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="transfers"
          stroke={CHART_COLORS.series2}
          name="Transfers"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
