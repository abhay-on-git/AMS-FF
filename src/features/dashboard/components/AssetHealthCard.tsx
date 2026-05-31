import { Gauge } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  CONDITION_DATA,
  LOCATION_DATA,
  STATUS_BREAKDOWN,
  TOTAL_ASSETS,
} from '../constants'

export function AssetHealthCard() {
  const maxCondition = Math.max(...CONDITION_DATA.map((c) => c.count))

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <Gauge className="w-5 h-5 text-brand-navy dark:text-brand-teal" />
          Asset Health Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-md text-muted-foreground mb-2.5">By Status</p>
          <div className="space-y-2">
            {STATUS_BREAKDOWN.map((s) => (
              <div key={s.status} className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-[15px] flex-1">{s.status}</span>
                <span className="text-[15px] font-medium w-12 text-right">{s.count}</span>
                <div className="w-20">
                  <Progress value={(s.count / TOTAL_ASSETS) * 100} className="h-1.5" />
                </div>
                <span className="text-md text-muted-foreground w-10 text-right">
                  {((s.count / TOTAL_ASSETS) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-md text-muted-foreground mb-2.5">By Condition</p>
          <div className="space-y-2">
            {CONDITION_DATA.map((c) => (
              <div key={c.condition} className="flex items-center gap-3">
                <span className="text-[15px] flex-1">{c.condition}</span>
                <span className="text-[15px] font-medium w-12 text-right tabular-nums">
                  {c.count}
                </span>
                <div className="w-24">
                  <Progress value={(c.count / maxCondition) * 100} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-md text-muted-foreground mb-2.5">By Field Office</p>
          <div className="space-y-2">
            {LOCATION_DATA.map((loc) => (
              <div key={loc.name} className="flex items-center gap-3">
                <span className="text-[15px] flex-1 truncate">{loc.name}</span>
                <span className="text-[15px] font-medium tabular-nums">{loc.assets}</span>
                <span className="text-md text-muted-foreground w-10 text-right">{loc.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
