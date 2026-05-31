export const CHART_TOOLTIP_STYLE = {
  backgroundColor: 'var(--background)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  fontSize: '14px',
  padding: '10px 14px',
} as const

export function formatChartTooltipValue(value: number, name: string): [string, string] {
  if (name === 'Value ($)') return [`$${value.toLocaleString()}`, name]
  return [value.toLocaleString(), name]
}
