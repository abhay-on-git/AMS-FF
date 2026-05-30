import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import type { AuditEvent } from '../../types'

interface HistoryTabProps {
  events: AuditEvent[]
}

export function HistoryTab({ events }: HistoryTabProps) {
  const [filter, setFilter] = useState<string>('all')

  const filteredEvents = filter === 'all'
    ? events
    : events.filter((e) => e.eventType === filter)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-[15px] h-8"
            onClick={() => toast.success('History exported as PDF')}
          >
            <Download className="w-3.5 h-3.5 mr-1" /> PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-0">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-brand-navy ring-2 ring-background" />
                  {index < filteredEvents.length - 1 && (
                    <div className="w-0.5 flex-1 bg-brand-navy" />
                  )}
                </div>
                <div className="flex-1 pb-6 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-[15px]">{event.action}</p>
                        <Badge variant="outline" className="text-sm py-1">
                          {event.eventType.replace('_', ' ')}
                        </Badge>
                      </div>
                      {event.oldValue && event.newValue && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="line-through">{event.oldValue}</span>
                          {' '}→{' '}
                          <span className="font-medium text-foreground">{event.newValue}</span>
                        </p>
                      )}
                      {!event.oldValue && event.newValue && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium text-foreground">{event.newValue}</span>
                        </p>
                      )}
                      {event.comment && (
                        <p className="text-sm text-muted-foreground mt-1 italic">
                          &ldquo;{event.comment}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.user}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
