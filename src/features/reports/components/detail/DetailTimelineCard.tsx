import { Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils/dateFormatter'
import type { DetailTimelineEntry } from '../../types'

interface DetailTimelineCardProps {
  timeline: DetailTimelineEntry[]
}

export function DetailTimelineCard({ timeline }: DetailTimelineCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-5 w-5" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {timeline.map((entry, idx) => (
            <div key={idx} className="relative flex gap-3 pb-4">
              {idx < timeline.length - 1 && (
                <div className="absolute bottom-0 left-[7px] top-5 w-px bg-border" />
              )}
              <div className="w-[15px] shrink-0 pt-0.5">
                <div
                  className={`h-[15px] w-[15px] rounded-full border-2 ${
                    idx === 0 ? 'border-brand-navy bg-brand-navy' : 'border-muted-foreground/30 bg-background'
                  }`}
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  {formatDate(entry.date)} · {entry.user}
                </p>
                <p className="mt-0.5 text-sm">{entry.event}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
