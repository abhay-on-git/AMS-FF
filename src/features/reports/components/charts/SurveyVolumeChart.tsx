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
import type { SurveyVolumePoint } from '../../types'
import { CHART_TOOLTIP_STYLE } from './chartTooltip'

interface SurveyVolumeChartProps {
  data: SurveyVolumePoint[]
}

export function SurveyVolumeChart({ data }: SurveyVolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
        <Bar dataKey="opened" fill={CHART_COLORS.series1} name="Opened" radius={[3, 3, 0, 0]} />
        <Bar dataKey="completed" fill={CHART_COLORS.series2} name="Completed" radius={[3, 3, 0, 0]} />
        <Bar dataKey="inProgress" fill={CHART_COLORS.series3} name="In Progress" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
