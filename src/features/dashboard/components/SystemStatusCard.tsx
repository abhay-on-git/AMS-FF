import { useNavigate } from 'react-router-dom'
import { Cloud, Server } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/cn'
import { QUICK_LINKS, SYSTEM_STATUSES } from '../constants'
import { QUICK_LINK_ICONS } from './dashboardIcons'

function statusDotClass(status: string): string {
  const normalized = status.toLowerCase()
  if (normalized.includes('online') || normalized.includes('connected')) {
    return 'bg-green-500'
  }
  if (normalized.includes('scheduled')) {
    return 'bg-amber-500'
  }
  return 'bg-gray-400'
}

export function SystemStatusCard() {
  const navigate = useNavigate()

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-15">
          <Server className="w-5 h-5 text-brand-navy dark:text-brand-teal" />
          System Status & Quick Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {SYSTEM_STATUSES.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg border px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <Cloud className="w-4 h-4 text-muted-foreground" />
                <span className="text-[14px]">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', statusDotClass(item.status))} />
                <span className="text-13 font-medium">{item.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="text-md text-muted-foreground mb-3">Quick Links</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_LINKS.map((link) => {
              const Icon = QUICK_LINK_ICONS[link.iconKey]
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => navigate(link.href)}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left hover:bg-muted/40 transition-colors"
                >
                  <Icon className="w-4 h-4 shrink-0 text-brand-navy dark:text-brand-teal" />
                  <span className="text-[14px] font-medium">{link.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
