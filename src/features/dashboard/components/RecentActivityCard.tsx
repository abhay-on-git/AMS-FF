import { History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'
import { RECENT_ACTIVITY } from '../constants'
import type { ActivityStatus } from '../types'

function activityDotClass(status: ActivityStatus): string {
  switch (status) {
    case 'success':
      return 'bg-green-500'
    case 'pending':
      return 'bg-amber-500'
    case 'warning':
      return 'bg-red-500'
    case 'info':
      return 'bg-blue-500'
    default:
      return 'bg-gray-400'
  }
}

export function RecentActivityCard() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <History className="w-5 h-5 text-brand-navy dark:text-brand-teal" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
          {RECENT_ACTIVITY.map((item) => (
            <div key={item.id} className="flex gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="text-[11px]">{item.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start gap-2">
                  <span
                    className={cn('w-2 h-2 rounded-full shrink-0 mt-1.5', activityDotClass(item.status))}
                  />
                  <p className="text-[14px] leading-snug">{item.action}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 pl-4">
                  <span className="text-[13px] text-muted-foreground">{item.user}</span>
                  <Badge variant="outline" className="text-[11px] font-normal">
                    {item.module}
                  </Badge>
                  <span className="text-[13px] text-muted-foreground">{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
