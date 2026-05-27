import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from './ui/drawer';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Event as Calendar, 
  Refresh as RefreshCw, 
  Schedule as Clock, 
  ShowChart as Activity, 
  CheckCircle as CheckCircle2, 
  Cancel as XCircle, 
  Warning as AlertCircle, 
  Search, 
  Description as FileText, 
  Lock, 
  Storage as Database, 
  ChevronLeft, 
  Close as X 
} from '@mui/icons-material';
import { toast } from 'sonner';

interface SyncRecord {
  id: string;
  triggeredBy: string;
  triggerType: 'manual' | 'scheduled';
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  status: 'success' | 'failed' | 'partial';
  recordsCreated: number;
  recordsUpdated: number;
  recordsFailed: number;
}

interface SyncScope {
  module: string;
  enabled: boolean;
  lastSync: string;
  status: 'healthy' | 'warning' | 'error';
}

interface IntegrationStatus {
  name: string;
  environment: 'production' | 'staging' | 'development';
  connectionStatus: 'connected' | 'disconnected' | 'degraded';
  lastSuccessfulSync: string;
  lastAttempt: string;
  isSyncing: boolean;
}

type ViewMode = 'status' | 'history';

// Mock: Check if current user is admin (in real app, this would come from auth context)
const CURRENT_USER_ROLE = 'admin'; // Change to 'staff' to test read-only mode

export default function Integrations() {
  const [viewMode, setViewMode] = useState<ViewMode>('status');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncConfirmed, setSyncConfirmed] = useState(false);
  const [selectedSyncLog, setSelectedSyncLog] = useState<SyncRecord | null>(null);
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  
  // Filters for history
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [triggerFilter, setTriggerFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7days');

  const isAdmin = CURRENT_USER_ROLE === 'admin';

  const [integrationStatus] = useState<IntegrationStatus>({
    name: 'SAP ERP',
    environment: 'production',
    connectionStatus: 'connected',
    lastSuccessfulSync: '2024-01-22 14:30:00',
    lastAttempt: '2024-01-22 14:30:00',
    isSyncing: false,
  });

  const [syncScopes] = useState<SyncScope[]>([
    { module: 'Assets', enabled: true, lastSync: '2024-01-22 14:30:00', status: 'healthy' },
    { module: 'Locations', enabled: true, lastSync: '2024-01-22 14:30:00', status: 'healthy' },
    { module: 'Categories', enabled: true, lastSync: '2024-01-22 14:30:00', status: 'healthy' },
    { module: 'Departments', enabled: true, lastSync: '2024-01-22 14:30:00', status: 'healthy' },
    { module: 'Custodians', enabled: true, lastSync: '2024-01-22 14:30:00', status: 'warning' },
    { module: 'Field Offices', enabled: false, lastSync: 'Never', status: 'healthy' },
  ]);

  const [syncHistory] = useState<SyncRecord[]>([
    {
      id: 'SYNC-001',
      triggeredBy: 'admin@company.com',
      triggerType: 'manual',
      startTime: '2024-01-22 14:30:00',
      endTime: '2024-01-22 14:35:45',
      duration: 345,
      status: 'success',
      recordsCreated: 42,
      recordsUpdated: 156,
      recordsFailed: 0,
    },
    {
      id: 'SYNC-002',
      triggeredBy: 'System (Scheduled)',
      triggerType: 'scheduled',
      startTime: '2024-01-22 06:00:00',
      endTime: '2024-01-22 06:04:22',
      duration: 262,
      status: 'success',
      recordsCreated: 15,
      recordsUpdated: 89,
      recordsFailed: 0,
    },
    {
      id: 'SYNC-003',
      triggeredBy: 'System (Scheduled)',
      triggerType: 'scheduled',
      startTime: '2024-01-21 18:00:00',
      endTime: '2024-01-21 18:03:18',
      duration: 198,
      status: 'partial',
      recordsCreated: 8,
      recordsUpdated: 45,
      recordsFailed: 3,
    },
    {
      id: 'SYNC-004',
      triggeredBy: 'john.doe@company.com',
      triggerType: 'manual',
      startTime: '2024-01-21 11:15:00',
      endTime: '2024-01-21 11:15:45',
      duration: 45,
      status: 'failed',
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsFailed: 234,
    },
    {
      id: 'SYNC-005',
      triggeredBy: 'System (Scheduled)',
      triggerType: 'scheduled',
      startTime: '2024-01-21 06:00:00',
      endTime: '2024-01-21 06:05:12',
      duration: 312,
      status: 'success',
      recordsCreated: 28,
      recordsUpdated: 134,
      recordsFailed: 0,
    },
  ]);

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'disconnected':
        return 'bg-red-500/10 text-red-700 dark:text-red-300';
      case 'degraded':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const getConnectionStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'failed':
        return 'bg-red-500/10 text-red-700 dark:text-red-300';
      case 'partial':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const getScopeStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleSyncNow = () => {
    if (!isAdmin) {
      toast.error('Access denied: Admin privileges required');
      return;
    }
    setIsSyncModalOpen(true);
    setSyncConfirmed(false);
  };

  const handleConfirmSync = () => {
    if (!syncConfirmed) {
      toast.error('Please confirm that you understand the implications');
      return;
    }
    setIsSyncModalOpen(false);
    toast.success('SAP sync initiated successfully');
    // In real app: POST /api/integrations/sync
  };

  const handleViewLog = (record: SyncRecord) => {
    setSelectedSyncLog(record);
    setIsLogDrawerOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTriggerFilter('all');
    setDateRange('7days');
    toast.success('Filters cleared');
  };

  const getFilteredHistory = () => {
    return syncHistory.filter((record) => {
      const matchesSearch = 
        record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.triggeredBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      const matchesTrigger = triggerFilter === 'all' || record.triggerType === triggerFilter;
      return matchesSearch && matchesStatus && matchesTrigger;
    });
  };

  // Sync History View
  if (viewMode === 'history') {
    const filteredHistory = getFilteredHistory();

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setViewMode('status')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Status
            </Button>
            <div>
              <h1 className="text-3xl">SAP Sync History</h1>
              <p className="text-muted-foreground text-sm">
                Detailed log of all synchronization jobs
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Sync ID or user..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={triggerFilter} onValueChange={setTriggerFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trigger Type" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="all">All Triggers</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
                {(searchQuery || statusFilter !== 'all' || triggerFilter !== 'all') && (
                  <Button variant="outline" size="sm" onClick={handleClearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Results Summary */}
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredHistory.length} of {syncHistory.length} sync records
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sync ID</TableHead>
                    <TableHead>Triggered By</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((record) => (
                    <TableRow key={record.id} className="/50">
                      <TableCell className="font-['Manrope'] font-medium">{record.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{record.triggeredBy}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {record.triggerType}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="">{record.startTime}</TableCell>
                      <TableCell className="">{record.endTime}</TableCell>
                      <TableCell className="font-['Manrope']">
                        {formatDuration(record.duration)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getSyncStatusColor(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="text-green-700 dark:text-green-300">
                            ✓ Created: {record.recordsCreated}
                          </div>
                          <div className="text-blue-700 dark:text-blue-300">
                            ↻ Updated: {record.recordsUpdated}
                          </div>
                          {record.recordsFailed > 0 && (
                            <div className="text-red-700 dark:text-red-300">
                              ✕ Failed: {record.recordsFailed}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleViewLog(record)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Log
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Empty State */}
            {filteredHistory.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No sync records found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Integration Status View (Main)
  const todaysSyncs = syncHistory.filter(s => s.startTime.startsWith('2024-01-22')).length;
  const failedSyncs24h = syncHistory.filter(s => s.status === 'failed' && s.startTime >= '2024-01-21').length;
  const avgDuration = Math.round(syncHistory.reduce((sum, s) => sum + s.duration, 0) / syncHistory.length);
  const lastRunRecords = syncHistory[0] ? 
    syncHistory[0].recordsCreated + syncHistory[0].recordsUpdated + syncHistory[0].recordsFailed : 0;

  return (
    <div className="space-y-6">
      {/* Non-Admin Warning */}
      {!isAdmin && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            You have read-only access to this module. Contact your administrator to trigger manual syncs.
          </AlertDescription>
        </Alert>
      )}

      {/* SAP Connection Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            SAP Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {/* Left Section - Status Info */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Integration Name</Label>
                <p className="text-xl font-bold">{integrationStatus.name}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Environment</Label>
                <div className="mt-1">
                  <Badge variant="outline" className="capitalize">
                    {integrationStatus.environment}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Connection Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  {getConnectionStatusIcon(integrationStatus.connectionStatus)}
                  <Badge className={getConnectionStatusColor(integrationStatus.connectionStatus)}>
                    {integrationStatus.connectionStatus.charAt(0).toUpperCase() + 
                     integrationStatus.connectionStatus.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <Label className="text-sm text-muted-foreground">Last Successful Sync</Label>
                  <p className="font-medium text-sm mt-1">{integrationStatus.lastSuccessfulSync}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Last Attempt</Label>
                  <p className="font-medium text-sm mt-1">{integrationStatus.lastAttempt}</p>
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleSyncNow}
                disabled={integrationStatus.isSyncing || !isAdmin}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${integrationStatus.isSyncing ? 'animate-spin' : ''}`} />
                {integrationStatus.isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setViewMode('history')}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Sync History
              </Button>
              {!isAdmin && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Lock className="w-3 h-3" />
                  <span>Admin only</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Scope Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Scope Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {syncScopes.map((scope) => (
              <div 
                key={scope.module}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className={getScopeStatusColor(scope.status)}>
                    {scope.enabled ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{scope.module}</p>
                    <p className="text-sm text-muted-foreground">
                      Last sync: {scope.lastSync}
                    </p>
                  </div>
                </div>
                <Badge variant={scope.enabled ?"default" :"outline"}>
                  {scope.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sync Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Syncs Today</p>
                <p className="text-2xl font-bold">{todaysSyncs}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed Syncs (24h)</p>
                <p className="text-2xl font-bold text-red-600">{failedSyncs24h}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Sync Duration</p>
                <p className="text-2xl font-bold">{formatDuration(avgDuration)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Records (Last Run)</p>
                <p className="text-2xl font-bold">{lastRunRecords}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Confirmation Modal */}
      <Dialog open={isSyncModalOpen} onOpenChange={setIsSyncModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trigger SAP Sync</DialogTitle>
            <DialogDescription>
              Review the following before proceeding
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This will pull the latest data from SAP and update assets, locations, and categories.
                Existing data may be overridden.
              </AlertDescription>
            </Alert>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="confirm-sync" 
                checked={syncConfirmed}
                onCheckedChange={(checked) => setSyncConfirmed(checked === true)}
              />
              <label
                htmlFor="confirm-sync"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I understand this may override existing data
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsSyncModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSync} disabled={!syncConfirmed}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Confirm Sync
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sync Log Drawer */}
      <Drawer open={isLogDrawerOpen} onOpenChange={setIsLogDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Sync Log Details</DrawerTitle>
            <DrawerDescription>
              {selectedSyncLog && `Sync ID: ${selectedSyncLog.id}`}
            </DrawerDescription>
          </DrawerHeader>
          {selectedSyncLog && (
            <div className="p-6 space-y-6">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sync Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Sync ID</Label>
                      <p className="font-['Manrope'] font-medium">{selectedSyncLog.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Status</Label>
                      <div className="mt-1">
                        <Badge className={getSyncStatusColor(selectedSyncLog.status)}>
                          {selectedSyncLog.status.charAt(0).toUpperCase() + selectedSyncLog.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Triggered By</Label>
                      <p className="font-medium">{selectedSyncLog.triggeredBy}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Duration</Label>
                      <p className="font-medium">{formatDuration(selectedSyncLog.duration)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Modules Affected */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Modules Affected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['Assets', 'Locations', 'Categories', 'Departments'].map((module) => (
                      <div key={module} className="flex items-center justify-between p-2 rounded border">
                        <span className="font-medium">{module}</span>
                        <Badge variant="outline">Synced</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* API Request Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">API Request Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-['Manrope'] text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Endpoint:</span>
                      <span>/api/sap/sync</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Method:</span>
                      <span>POST</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Response Code:</span>
                      <span className="text-green-600">200 OK</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Error Messages (if any) */}
              {selectedSyncLog.recordsFailed > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base text-red-600">Error Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-800">
                        <p className="font-medium text-red-800 dark:text-red-300">
                          Failed to sync {selectedSyncLog.recordsFailed} records
                        </p>
                        <p className="text-red-700 dark:text-red-400 mt-1">
                          Duplicate key constraint violation in Assets table
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              {isAdmin && selectedSyncLog.status === 'failed' && (
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsLogDrawerOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    toast.info('Retry sync initiated');
                    setIsLogDrawerOpen(false);
                  }}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Sync
                  </Button>
                </div>
              )}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
