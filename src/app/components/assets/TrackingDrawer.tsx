import React from 'react';
import { formatDate } from '../../utils/dateFormatter';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import {
  LocationOn as MapPin,
  Person as PersonIcon,
  Schedule as Clock,
  Router as Radio,
  SwapHoriz as TransferIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import {
  EnhancedAsset, AuditEvent, getStatusColor, getEventTypeColor, daysSince,
  mockAuditEvents,
} from './types';

interface TrackingDrawerProps {
  asset: EnhancedAsset | null;
  open: boolean;
  onClose: () => void;
}

export function TrackingDrawer({ asset, open, onClose }: TrackingDrawerProps) {
  if (!asset) return null;

  const last5Events = mockAuditEvents.slice(0, 5);
  const lastInspection = '2024-12-15';
  const transferCount = mockAuditEvents.filter(e => e.eventType === 'transfer').length;
  const statusDays = daysSince(asset.lastStatusChange);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="!w-full sm:!max-w-md flex flex-col overflow-hidden">
        <SheetHeader className="pr-8">
          <SheetTitle className="text-[15px] flex items-center gap-2">
            <Radio className="w-5 h-5" />
            Asset Tracking
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Quick tracking overview for <span className="font-['Manrope'] font-medium text-foreground">{asset.assetId}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-5">
          {/* Current Status Card */}
          <div className="border rounded-[4px] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Status</span>
              <Badge className={getStatusColor(asset.status)}>
                {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              In current status for <span className="font-medium text-foreground">{statusDays} days</span>
            </div>
          </div>

          {/* Current Location */}
          <div className="border rounded-[4px] p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Current Location</span>
            </div>
            <p className="font-medium text-sm">{asset.location}</p>
            <p className="text-xs text-muted-foreground">{asset.fieldOffice}</p>
          </div>

          {/* Current Custodian */}
          <div className="border rounded-[4px] p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <PersonIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Current Custodian</span>
            </div>
            <p className="font-medium text-sm">{asset.responsiblePerson}</p>
            <p className="text-xs text-muted-foreground">{asset.owner}</p>
          </div>

          {/* Tag Health */}
          {asset.rfidHealth !== undefined && (
            <div className="border rounded-[4px] p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tag Health</span>
                <span className="font-medium">{asset.rfidHealth}%</span>
              </div>
              <Progress value={asset.rfidHealth} className="h-1.5" />
              {asset.lastScanned && (
                <p className="text-xs text-muted-foreground">
                  Last scanned: {new Date(asset.lastScanned).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Summary strip */}
          <div className="grid grid-cols-3 gap-2">
            <div className="border rounded-[4px] p-2.5 text-center">
              <p className="text-lg font-medium">{transferCount}</p>
              <p className="text-xs text-muted-foreground">Transfers</p>
            </div>
            <div className="border rounded-[4px] p-2.5 text-center">
              <p className="text-lg font-medium">4</p>
              <p className="text-xs text-muted-foreground">Inspections</p>
            </div>
            <div className="border rounded-[4px] p-2.5 text-center">
              <p className="text-lg font-medium">{mockAuditEvents.length}</p>
              <p className="text-xs text-muted-foreground">Events</p>
            </div>
          </div>

          <Separator />

          {/* Last Inspection */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-green-600" />
              <span className="text-muted-foreground">Last Inspection</span>
            </div>
            <span>{formatDate(lastInspection)}</span>
          </div>

          <Separator />

          {/* Last 5 History Events */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">Recent Activity</p>
            <div className="space-y-3">
              {last5Events.map((event, index) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${getEventTypeColor(event.eventType)}`} />
                    {index < last5Events.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0 pb-3">
                    <p className="text-xs font-medium">{event.action}</p>
                    {event.oldValue && event.newValue && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {event.oldValue} → {event.newValue}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(event.timestamp)} · {event.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

