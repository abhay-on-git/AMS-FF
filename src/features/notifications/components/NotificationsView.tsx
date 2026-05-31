import {
  useMarkAllNotificationsRead,
  useNotifications,
} from '../hooks/useNotifications'
import { NotificationStatsCards } from './NotificationStatsCards'
import { NotificationListCard, NotificationListHeader } from './NotificationListCard'

export function NotificationsView() {
  const { data: notifications = [], isLoading } = useNotifications()
  const markAllRead = useMarkAllNotificationsRead()

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (isLoading) {
    return <div className="p-6 text-muted-foreground text-[15px]">Loading notifications…</div>
  }

  return (
    <div className="space-y-6">
      <NotificationListHeader
        unreadCount={unreadCount}
        onMarkAllRead={() => markAllRead.mutate()}
        markingAll={markAllRead.isPending}
      />
      <NotificationStatsCards total={notifications.length} unread={unreadCount} />
      <NotificationListCard notifications={notifications} />
    </div>
  )
}
