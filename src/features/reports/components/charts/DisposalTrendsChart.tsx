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
import { CHART_COLORS } from '../../constants/reportingData'
import type { DisposalTrendPoint } from '../../types'
import { CHART_TOOLTIP_STYLE } from './chartTooltip'

interface DisposalTrendsChartProps {
  data: DisposalTrendPoint[]
}

const AREAS = [
  { key: 'auction', name: 'Auction', color: CHART_COLORS.series1 },
  { key: 'donation', name: 'Donation', color: CHART_COLORS.series2 },
  { key: 'recycling', name: 'Recycling', color: CHART_COLORS.series3 },
  { key: 'writeOff', name: 'Write-Off', color: CHART_COLORS.series4 },
] as const

export function DisposalTrendsChart({ data }: DisposalTrendsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
        {AREAS.map(({ key, name, color }) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="1"
            stroke={color}
            fill={color}
            fillOpacity={0.55}
            name={name}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
