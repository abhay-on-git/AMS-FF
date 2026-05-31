import { useMemo, useState } from 'react'
import { Bell, Check, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NotificationTypeIcon } from './NotificationTypeIcon'
import { DATE_RANGE_OPTIONS, NOTIFICATION_SOURCES } from '../constants/filterOptions'
import { isWithinDateRange } from '../lib/filterUtils'
import { useMarkNotificationRead } from '../hooks/useNotifications'
import type { AppNotification, NotificationDateRange, NotificationStatusFilter } from '../types'

interface NotificationListCardProps {
  notifications: AppNotification[]
}

export function NotificationListCard({ notifications }: NotificationListCardProps) {
  const markRead = useMarkNotificationRead()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<NotificationStatusFilter>('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [dateRange, setDateRange] = useState<NotificationDateRange>('7days')

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return notifications.filter((n) => {
      const matchesSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'unread' && !n.isRead) ||
        (statusFilter === 'read' && n.isRead)
      const matchesSource = sourceFilter === 'all' || n.source === sourceFilter
      const matchesDate = isWithinDateRange(n.occurredAt, dateRange)
      return matchesSearch && matchesStatus && matchesSource && matchesDate
    })
  }, [notifications, searchQuery, statusFilter, sourceFilter, dateRange])

  const hasActiveFilters =
    !!searchQuery || statusFilter !== 'all' || sourceFilter !== 'all' || dateRange !== '7days'

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setSourceFilter('all')
    setDateRange('7days')
    toast.success('Filters cleared')
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 text-base"
            />
          </div>

          <Select value={dateRange} onValueChange={(v) => setDateRange(v as NotificationDateRange)}>
            <SelectTrigger className="w-44 h-11 text-base">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGE_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value} className="text-base py-2.5">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as NotificationStatusFilter)}>
            <SelectTrigger className="w-44 h-11 text-base">
              <SelectValue placeholder="Read Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-base py-2.5">All Notifications</SelectItem>
              <SelectItem value="unread" className="text-base py-2.5">Unread Only</SelectItem>
              <SelectItem value="read" className="text-base py-2.5">Read Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-44 h-11 text-base">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-base py-2.5">All Categories</SelectItem>
              {NOTIFICATION_SOURCES.map((source) => (
                <SelectItem key={source} value={source} className="text-base py-2.5">{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="h-11 text-base px-4 shrink-0">
              <X className="w-4 h-4 mr-2" /> Clear Filters
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-base text-muted-foreground mb-5">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{' '}
          <span className="font-semibold text-foreground">{notifications.length}</span> notifications
        </p>

        <div className="space-y-3">
          {filtered.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={() => markRead.mutate(notification.id)}
              marking={markRead.isPending}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Bell className="w-16 h-16 mx-auto mb-5 opacity-30" />
            <p className="text-xl font-medium mb-1">No notifications found</p>
            <p className="text-base">Try adjusting your filters or search query</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function NotificationItem({
  notification,
  onMarkRead,
  marking,
}: {
  notification: AppNotification
  onMarkRead: () => void
  marking: boolean
}) {
  return (
    <div
      className={`relative p-5 rounded-xl border transition-all ${
        !notification.isRead
          ? 'bg-muted/60 border-l-4 border-l-brand-navy dark:border-l-brand-teal border-border'
          : 'bg-background border-border'
      }`}
    >
      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <NotificationTypeIcon type={notification.type} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4
            className={`text-17 font-semibold leading-snug mb-1.5 ${
              !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {notification.title}
          </h4>
          <p
            className={`text-15 leading-relaxed mb-3 ${
              !notification.isRead ? 'text-foreground/80' : 'text-muted-foreground'
            }`}
          >
            {notification.message}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-13 text-muted-foreground">
            <span>{notification.source}</span>
            <span>·</span>
            <span>{notification.timestamp}</span>
          </div>
        </div>

        {!notification.isRead && (
          <div className="shrink-0 self-start">
            <Button
              size="sm"
              variant="outline"
              onClick={onMarkRead}
              disabled={marking}
              className="h-10 px-4 text-13 font-medium gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Mark Read</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export function NotificationListHeader({
  unreadCount,
  onMarkAllRead,
  markingAll,
}: {
  unreadCount: number
  onMarkAllRead: () => void
  markingAll: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-base text-muted-foreground">
        You have{' '}
        <span className="font-semibold text-foreground">{unreadCount} unread</span>{' '}
        notification{unreadCount !== 1 ? 's' : ''}
      </p>
      <Button
        onClick={onMarkAllRead}
        disabled={unreadCount === 0 || markingAll}
        className="text-base h-11 px-5"
      >
        <Check className="w-5 h-5 mr-2" />
        Mark All as Read
      </Button>
    </div>
  )
}
