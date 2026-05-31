import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_COLORS } from '../../constants/reportingData'
import type { AssetValueDataPoint } from '../../types'
import { CHART_TOOLTIP_STYLE, formatChartTooltipValue } from './chartTooltip'

interface AssetValueChartProps {
  data: AssetValueDataPoint[]
}

export function AssetValueChart({ data }: AssetValueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" angle={-15} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          formatter={(value: number, name: string) => formatChartTooltipValue(value, name)}
        />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
        <Bar
          yAxisId="left"
          dataKey="value"
          fill={CHART_COLORS.series1}
          name="Value ($)"
          radius={[3, 3, 0, 0]}
        />
        <Bar
          yAxisId="right"
          dataKey="count"
          fill={CHART_COLORS.series2}
          name="Count"
          radius={[3, 3, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
