import { useMemo, useState } from 'react'
import { Folder } from 'lucide-react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/cn'
import { CATEGORY_DISTRIBUTION } from '../constants'
import { renderPieLabel } from './pieLabel'

const TOOLTIP_STYLE = {
  fontSize: 12,
  borderRadius: 8,
  border: '1px solid hsl(var(--border))',
}

export function CategoryPieChart() {
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null)

  const totalCategoryAssets = useMemo(
    () => CATEGORY_DISTRIBUTION.reduce((sum, c) => sum + c.value, 0),
    [],
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <Folder className="w-5 h-5 text-brand-navy dark:text-brand-teal" />
          Assets By Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-[200px] shrink-0 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={renderPieLabel}
                  onMouseEnter={(_, index) => setActivePieIndex(index)}
                  onMouseLeave={() => setActivePieIndex(null)}
                >
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell
                      key={`cell-cat-${entry.name}`}
                      fill={entry.color}
                      opacity={
                        activePieIndex === null || activePieIndex === index ? 1 : 0.4
                      }
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value} assets`, name]}
                  contentStyle={TOOLTIP_STYLE}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 w-full space-y-1.5">
            {CATEGORY_DISTRIBUTION.map((cat, index) => (
              <div
                key={cat.name}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2 py-1 transition-colors cursor-default',
                  activePieIndex === index ? 'bg-muted/60' : 'hover:bg-muted/30',
                )}
                onMouseEnter={() => setActivePieIndex(index)}
                onMouseLeave={() => setActivePieIndex(null)}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-[13px] flex-1 truncate">{cat.name}</span>
                <span className="text-[13px] font-medium tabular-nums">
                  {cat.value.toLocaleString()}
                </span>
                <span className="text-[11px] text-muted-foreground w-10 text-right tabular-nums">
                  {((cat.value / totalCategoryAssets) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
