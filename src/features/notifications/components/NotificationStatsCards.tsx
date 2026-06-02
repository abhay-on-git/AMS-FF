import { Bell, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface NotificationStatsCardsProps {
  total: number
  unread: number
}

export function NotificationStatsCards({ total, unread }: NotificationStatsCardsProps) {
  const read = total - unread

  const items = [
    { label: 'Total Notifications', value: total, icon: Bell },
    { label: 'Unread', value: unread, icon: AlertCircle },
    { label: 'Read', value: read, icon: CheckCircle2 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-muted-foreground font-medium">{label}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Icon className="w-7 h-7 text-brand-navy dark:text-brand-teal" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
