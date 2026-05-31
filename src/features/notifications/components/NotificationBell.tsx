import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/cn'
import { MOCK_NOTIFICATIONS } from '../constants/notificationsData'
import type { AppNotification, NotificationType } from '../types'

function NotificationTypeIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-amber-600" />
    case 'success':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case 'info':
    default:
      return <Info className="h-4 w-4 text-blue-600" />
  }
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  )

  const recent = notifications.slice(0, 5)

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 shrink-0">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-0 bg-destructive p-0 text-[11px] text-destructive-foreground">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-semibold">Notifications</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground"
            onClick={markAllRead}
          >
            Mark all as read
          </Button>
        </div>

        <ScrollArea className="max-h-[400px]">
          {recent.length > 0 ? (
            <div className="divide-y">
              {recent.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onRead={() => markRead(notification.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>No notifications</p>
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-3">
          <Button variant="ghost" className="w-full justify-between" asChild>
            <Link to="/notifications" onClick={() => setOpen(false)}>
              View all notifications
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function NotificationRow({
  notification,
  onRead,
}: {
  notification: AppNotification
  onRead: () => void
}) {
  return (
    <button
      type="button"
      className={cn(
        'w-full p-4 text-left transition-colors hover:bg-muted/40',
        !notification.isRead && 'bg-primary/5',
      )}
      onClick={onRead}
    >
      <div className="flex gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <NotificationTypeIcon type={notification.type} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <p
              className={cn(
                'text-sm',
                !notification.isRead ? 'font-semibold' : 'font-medium',
              )}
            >
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
            )}
          </div>
          <p className="mb-1 line-clamp-1 text-sm text-muted-foreground">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{notification.source}</span>
            <span>•</span>
            <span>{notification.timestamp}</span>
          </div>
        </div>
      </div>
    </button>
  )
}
