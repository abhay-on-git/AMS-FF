import { ArrowRight, Hourglass } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'
import { PENDING_ACTIONS } from '../constants'
import type { PendingActionType, PendingActionUrgency } from '../types'
import { PENDING_ACTION_ICONS } from './dashboardIcons'

function urgencyClasses(urgency: PendingActionUrgency): string {
  switch (urgency) {
    case 'high':
      return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
    case 'medium':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    case 'low':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
  }
}

function typeIconClasses(type: PendingActionType): string {
  switch (type) {
    case 'transfer':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
    case 'inspection':
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
    case 'disposal':
      return 'bg-red-100 dark:bg-red-900/30 text-red-600'
    case 'survey':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function PendingActionsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Hourglass className="w-5 h-5 text-[#EF652B]" />
            Pending Approvals & Actions
          </CardTitle>
          <Badge className="bg-[#EF652B]/10 text-[#EF652B] border-[#EF652B]/20 text-md">
            {PENDING_ACTIONS.length} pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {PENDING_ACTIONS.map((action) => {
            const Icon = PENDING_ACTION_ICONS[action.type]
            return (
              <div
                key={action.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer group"
              >
                <div
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                    typeIconClasses(action.type),
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-medium truncate">{action.title}</p>
                    <Badge
                      variant="outline"
                      className={cn('text-[11px] shrink-0', urgencyClasses(action.urgency))}
                    >
                      {action.urgency}
                    </Badge>
                  </div>
                  <p className="text-md text-muted-foreground truncate">{action.desc}</p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-md text-muted-foreground">{action.assignee}</p>
                  <p className="text-md text-muted-foreground">
                    Due:{' '}
                    {new Date(action.due).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
