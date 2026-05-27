import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Notifications as BellIcon, 
  Warning as AlertCircleIcon, 
  CheckCircle as CheckCircle2Icon, 
  Info as InfoIcon, 
  ArrowForward as ArrowRightIcon 
} from '@mui/icons-material';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  source: string;
}

interface NotificationBellProps {
  onViewAll: () => void;
}

export default function NotificationBell({ onViewAll }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Transfer Pending Approval',
      message: 'Transfer request TR-045 needs your approval',
      timestamp: '2 min ago',
      isRead: false,
      source: 'Transfers',
    },
    {
      id: '2',
      type: 'success',
      title: 'Inspection Completed',
      message: 'Inventory inspection INV-089 completed successfully',
      timestamp: '15 min ago',
      isRead: false,
      source: 'Inspection',
    },
    {
      id: '3',
      type: 'info',
      title: 'New Asset Registered',
      message: '5 new assets added to category"Laptops"',
      timestamp: '1 hour ago',
      isRead: false,
      source: 'Assets',
    },
    {
      id: '4',
      type: 'info',
      title: 'SAP Sync Completed',
      message: 'Successfully synced 234 records from SAP',
      timestamp: '2 hours ago',
      isRead: true,
      source: 'System',
    },
    {
      id: '5',
      type: 'warning',
      title: 'Asset Location Mismatch',
      message: 'Asset EPC-001234 found in unexpected location',
      timestamp: '3 hours ago',
      isRead: true,
      source: 'Inventory',
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircleIcon className="w-4 h-4 text-yellow-600" />;
      case 'success':
        return <CheckCircle2Icon className="w-4 h-4 text-green-600" />;
      case 'info':
      default:
        return <InfoIcon className="w-4 h-4 text-blue-600" />;
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <BellIcon className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-auto p-0 text-xs text-muted-foreground"
            onClick={handleMarkAllRead}
          >
            Mark all as read
          </Button>
        </div>

        {/* Notification List */}
        <ScrollArea className="max-h-[400px]">
          {recentNotifications.length > 0 ? (
            <div className="divide-y">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 cursor-pointer transition-colors/50 ${
                    !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <InfoIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-medium'}`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{notification.source}</span>
                        <span>•</span>
                        <span>{notification.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <BellIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-between" 
            onClick={() => {
              setIsOpen(false);
              onViewAll();
            }}
          >
            View All Notifications
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
