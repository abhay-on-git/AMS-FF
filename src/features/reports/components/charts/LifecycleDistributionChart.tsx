import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CHART_COLORS } from '../../constants/reportingData'
import type { LifecycleDataPoint } from '../../types'
import { CHART_TOOLTIP_STYLE } from './chartTooltip'

const PIE_COLORS = [
  CHART_COLORS.series1,
  CHART_COLORS.series2,
  CHART_COLORS.series3,
  CHART_COLORS.series4,
  CHART_COLORS.series5,
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
]

interface LifecycleDistributionChartProps {
  data: LifecycleDataPoint[]
}

export function LifecycleDistributionChart({ data }: LifecycleDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) => `${name}: ${percentage}%`}
          outerRadius={100}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
