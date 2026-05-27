import React, { useState } from 'react';
import { formatDate } from '../utils/dateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination, paginateData } from './shared/TablePagination';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  SwapHoriz,
  Warning,
  CheckCircle,
  Lock,
  History,
  Visibility as Eye,
  Info,
  ArrowForward,
  Schedule,
  ReportProblem,
  Block,
  FiberManualRecord as DotIcon,
  ArrowBack,
  Edit as EditIcon,
  Description as DescriptionIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  ChevronLeft,
} from '@mui/icons-material';
import { Stepper, Step, StepLabel, StepConnector, StepContent } from '@mui/material';
import { toast } from 'sonner';

type LifecycleStatus = 'registered' | 'in-use' | 'transferred' | 'under-verification' | 'available' | 'damaged' | 'retired' | 'disposed';

interface LifecycleAsset {
  id: string;
  assetId: string;
  name: string;
  type: string;
  status: LifecycleStatus;
  previousStatus?: LifecycleStatus;
  custodian: string;
  location: string;
  lastStatusChange: string;
  changedBy: string;
  daysInStatus: number;
  isLocked: boolean;
  justification?: string;
}

interface StatusTransition {
  id: string;
  assetId: string;
  assetName: string;
  fromStatus: LifecycleStatus;
  toStatus: LifecycleStatus;
  requestedBy: string;
  requestedDate: string;
  justification: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Valid status transitions
const validTransitions: Record<LifecycleStatus, LifecycleStatus[]> = {
  'registered': ['in-use', 'available'],
  'in-use': ['transferred', 'under-verification', 'available', 'damaged'],
  'transferred': ['in-use', 'available'],
  'under-verification': ['in-use', 'available', 'damaged', 'retired'],
  'available': ['in-use', 'transferred', 'under-verification', 'retired'],
  'damaged': ['under-verification', 'retired', 'disposed'],
  'retired': ['disposed'],
  'disposed': [], // Terminal state - no transitions
};

export default function AssetLifecycle() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showTransitionDialog, setShowTransitionDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<LifecycleAsset | null>(null);
  const [targetStatus, setTargetStatus] = useState<LifecycleStatus | ''>('');
  const [justification, setJustification] = useState('');
  const [viewMode, setViewMode] = useState<'overview' | 'transitions' | 'stuck'>('overview');
  const [detailAsset, setDetailAsset] = useState<LifecycleAsset | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [assets] = useState<LifecycleAsset[]>([
    { id: '1', assetId: 'LAP-001234', name: 'Dell Latitude 5520', type: 'Laptop', status: 'in-use', custodian: 'John Doe', location: 'HQ Floor 1', lastStatusChange: '2026-01-15', changedBy: 'Admin', daysInStatus: 42, isLocked: false },
    { id: '2', assetId: 'DES-001235', name: 'HP EliteDesk 800', type: 'Desktop', status: 'under-verification', custodian: 'Jane Smith', location: 'HQ Floor 2', lastStatusChange: '2026-02-20', changedBy: 'Inspector', daysInStatus: 6, isLocked: false },
    { id: '3', assetId: 'PRN-001236', name: 'Canon ImageRunner', type: 'Printer', status: 'damaged', custodian: 'Bob Wilson', location: 'HQ Floor 1', lastStatusChange: '2026-02-10', changedBy: 'Bob Wilson', daysInStatus: 16, isLocked: false, justification: 'Paper feed mechanism broken' },
    { id: '4', assetId: 'MON-001237', name: 'Dell U2720Q 27"', type: 'Monitor', status: 'available', custodian: 'Unassigned', location: 'Warehouse B1', lastStatusChange: '2026-02-01', changedBy: 'Admin', daysInStatus: 25, isLocked: false },
    { id: '5', assetId: 'SRV-001238', name: 'Dell PowerEdge R740', type: 'Server', status: 'retired', custodian: 'IT Department', location: 'Server Room', lastStatusChange: '2026-01-20', changedBy: 'Admin', daysInStatus: 37, isLocked: true, justification: 'End of life - 7 years old' },
    { id: '6', assetId: 'LAP-001239', name: 'HP ProBook 450', type: 'Laptop', status: 'disposed', previousStatus: 'retired', custodian: 'N/A', location: 'N/A', lastStatusChange: '2026-02-15', changedBy: 'Admin', daysInStatus: 11, isLocked: true, justification: 'Approved disposal DSP-2026-003' },
    { id: '7', assetId: 'LAP-001240', name: 'Lenovo ThinkPad T14', type: 'Laptop', status: 'registered', custodian: 'Unassigned', location: 'Receiving', lastStatusChange: '2026-02-25', changedBy: 'System', daysInStatus: 1, isLocked: false },
    { id: '8', assetId: 'MON-001241', name: 'Samsung 32" Curved', type: 'Monitor', status: 'transferred', custodian: 'In Transit', location: 'HQ → Field Office A', lastStatusChange: '2026-02-24', changedBy: 'Jane Smith', daysInStatus: 2, isLocked: false },
  ]);

  const [pendingTransitions] = useState<StatusTransition[]>([
    { id: 'ST-001', assetId: 'PRN-001236', assetName: 'Canon ImageRunner', fromStatus: 'damaged', toStatus: 'retired', requestedBy: 'Bob Wilson', requestedDate: '2026-02-25', justification: 'Beyond economic repair - parts unavailable', status: 'pending' },
    { id: 'ST-002', assetId: 'SRV-001238', assetName: 'Dell PowerEdge R740', fromStatus: 'retired', toStatus: 'disposed', requestedBy: 'Admin', requestedDate: '2026-02-24', justification: 'Approved by disposal committee DSP-2026-008', status: 'pending' },
  ]);

  const getStatusColor = (status: LifecycleStatus) => {
    const colors: Record<LifecycleStatus, string> = {
      'registered': 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
      'in-use': 'bg-green-500/10 text-green-700 dark:text-green-300',
      'transferred': 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
      'under-verification': 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
      'available': 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
      'damaged': 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
      'retired': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
      'disposed': 'bg-red-500/10 text-red-700 dark:text-red-300',
    };
    return colors[status];
  };

  const allStatuses: LifecycleStatus[] = ['registered', 'in-use', 'transferred', 'under-verification', 'available', 'damaged', 'retired', 'disposed'];

  const statusCounts = allStatuses.reduce((acc, status) => {
    acc[status] = assets.filter(a => a.status === status).length;
    return acc;
  }, {} as Record<LifecycleStatus, number>);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = searchQuery === '' ||
      asset.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stuckAssets = assets.filter(a => a.daysInStatus > 30 && !['disposed', 'in-use'].includes(a.status));

  // Mock status history per asset for detail view
  const getAssetHistory = (asset: LifecycleAsset): { status: LifecycleStatus; date: string; changedBy: string; justification: string }[] => {
    const historyMap: Record<string, { status: LifecycleStatus; date: string; changedBy: string; justification: string }[]> = {
      '1': [
        { status: 'registered', date: '2025-11-01', changedBy: 'System', justification: 'Asset received and catalogued' },
        { status: 'available', date: '2025-11-05', changedBy: 'Admin', justification: 'Configured and ready for assignment' },
        { status: 'in-use', date: '2026-01-15', changedBy: 'Admin', justification: 'Assigned to John Doe — IT Dept' },
      ],
      '2': [
        { status: 'registered', date: '2025-09-10', changedBy: 'System', justification: 'Asset received' },
        { status: 'in-use', date: '2025-09-20', changedBy: 'Admin', justification: 'Assigned to Jane Smith' },
        { status: 'under-verification', date: '2026-02-20', changedBy: 'Inspector', justification: 'Scheduled quarterly verification' },
      ],
      '3': [
        { status: 'registered', date: '2025-06-15', changedBy: 'System', justification: 'Asset received' },
        { status: 'in-use', date: '2025-06-20', changedBy: 'Admin', justification: 'Installed on HQ Floor 1' },
        { status: 'damaged', date: '2026-02-10', changedBy: 'Bob Wilson', justification: 'Paper feed mechanism broken' },
      ],
      '4': [
        { status: 'registered', date: '2025-12-10', changedBy: 'System', justification: 'Asset received' },
        { status: 'available', date: '2026-02-01', changedBy: 'Admin', justification: 'Stored in warehouse pending assignment' },
      ],
      '5': [
        { status: 'registered', date: '2019-03-15', changedBy: 'System', justification: 'Asset received' },
        { status: 'in-use', date: '2019-04-01', changedBy: 'Admin', justification: 'Deployed in server room' },
        { status: 'under-verification', date: '2025-12-01', changedBy: 'Admin', justification: 'End-of-life assessment' },
        { status: 'retired', date: '2026-01-20', changedBy: 'Admin', justification: 'End of life — 7 years old' },
      ],
      '6': [
        { status: 'registered', date: '2018-08-01', changedBy: 'System', justification: 'Asset received' },
        { status: 'in-use', date: '2018-08-10', changedBy: 'Admin', justification: 'Assigned to IT pool' },
        { status: 'retired', date: '2025-12-20', changedBy: 'Admin', justification: 'Exceeded useful life' },
        { status: 'disposed', date: '2026-02-15', changedBy: 'Admin', justification: 'Approved disposal DSP-2026-003' },
      ],
      '7': [
        { status: 'registered', date: '2026-02-25', changedBy: 'System', justification: 'Asset received at dock' },
      ],
      '8': [
        { status: 'registered', date: '2025-10-05', changedBy: 'System', justification: 'Asset received' },
        { status: 'in-use', date: '2025-10-15', changedBy: 'Admin', justification: 'Assigned to HQ office' },
        { status: 'transferred', date: '2026-02-24', changedBy: 'Jane Smith', justification: 'Transfer to Field Office A — TRF-2026-041' },
      ],
    };
    return historyMap[asset.id] || [{ status: asset.status, date: asset.lastStatusChange, changedBy: asset.changedBy, justification: asset.justification || 'No details' }];
  };

  // Canonical lifecycle path for stepper
  const lifecycleSteps: LifecycleStatus[] = ['registered', 'available', 'in-use', 'under-verification', 'damaged', 'retired', 'disposed'];

  const getStepperStatusColor = (status: LifecycleStatus) => {
    const solidColors: Record<LifecycleStatus, string> = {
      'registered': 'bg-cyan-500',
      'in-use': 'bg-green-500',
      'transferred': 'bg-purple-500',
      'under-verification': 'bg-blue-500',
      'available': 'bg-gray-500',
      'damaged': 'bg-orange-500',
      'retired': 'bg-yellow-500',
      'disposed': 'bg-red-500',
    };
    return solidColors[status];
  };

  const getStepperStatusHex = (status: LifecycleStatus) => {
    const hexColors: Record<LifecycleStatus, string> = {
      'registered': '#06b6d4',
      'in-use': '#22c55e',
      'transferred': '#a855f7',
      'under-verification': '#3b82f6',
      'available': '#6b7280',
      'damaged': '#f97316',
      'retired': '#eab308',
      'disposed': '#ef4444',
    };
    return hexColors[status];
  };

  const handleInitiateTransition = (asset: LifecycleAsset) => {
    if (asset.isLocked && asset.status === 'disposed') {
      toast.error('Disposed assets cannot be transitioned. Admin override required.');
      return;
    }
    setSelectedAsset(asset);
    setTargetStatus('');
    setJustification('');
    setShowTransitionDialog(true);
  };

  const handleSubmitTransition = () => {
    if (!targetStatus) {
      toast.error('Please select a target status');
      return;
    }
    if (!justification.trim()) {
      toast.error('Justification is required for all status changes');
      return;
    }
    toast.success(`Status transition request submitted: ${selectedAsset?.assetId} → ${targetStatus}`);
    setShowTransitionDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Detail View */}
      {detailAsset ? (
        <>
          {/* Detail Header */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setDetailAsset(null)}
                className="text-muted-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDetailAsset(null)}
                className="text-muted-foreground transition-colors"
              >
                Asset Lifecycle
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{detailAsset.assetId}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold font-['Manrope']">{detailAsset.assetId}</h2>
                  {detailAsset.isLocked && (
                    <Badge variant="outline" className="gap-1 text-red-600 border-red-300 dark:text-red-400 dark:border-red-600">
                      <Lock className="w-3 h-3" /> Locked
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-0.5">{detailAsset.name}</p>
              </div>
              {detailAsset.status !== 'disposed' && (
                <Button onClick={() => handleInitiateTransition(detailAsset)}>
                  <SwapHoriz className="w-4 h-4 mr-2" />
                  Change Status
                </Button>
              )}
            </div>
          </div>

          {/* Lifecycle Stepper */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TimelineIcon className="w-5 h-5" />
                Lifecycle Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const history = getAssetHistory(detailAsset);
                const visitedStatuses = new Set(history.map(h => h.status));
                const isTransferred = visitedStatuses.has('transferred');

                // Determine active step index for MUI Stepper
                const currentStepIndex = lifecycleSteps.indexOf(detailAsset.status);
                // For statuses not on the canonical path (e.g. 'transferred'), find the last visited canonical step
                const activeStep = currentStepIndex >= 0
                  ? currentStepIndex
                  : lifecycleSteps.reduce((last, step, idx) => visitedStatuses.has(step) ? idx : last, 0);

                return (
                  <div className="space-y-4">
                    <Stepper
                      activeStep={activeStep}
                      alternativeLabel
                      sx={{
                        '& .MuiStepConnector-line': {
                          borderColor: 'var(--border)',
                        },
                        '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                          borderColor: '#121321',
                        },
                        '.dark & .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                          borderColor: '#81CCD7',
                        },
                        '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                          borderColor: '#121321',
                        },
                        '.dark & .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                          borderColor: '#81CCD7',
                        },
                      }}
                    >
                      {lifecycleSteps.map((step, idx) => {
                        const isVisited = visitedStatuses.has(step);
                        const isCurrent = detailAsset.status === step;
                        const isPast = isVisited && !isCurrent;

                        const stepIconColor = getStepperStatusHex(step);

                        return (
                          <Step key={step} completed={isPast}>
                            <StepLabel
                              StepIconProps={{
                                sx: {
                                  ...(isCurrent && {
                                    color: `${stepIconColor} !important`,
                                    '& .MuiStepIcon-text': { fill: '#fff' },
                                  }),
                                  ...(isPast && {
                                    color: `${stepIconColor} !important`,
                                    opacity: 0.7,
                                    '& .MuiStepIcon-text': { fill: '#fff' },
                                  }),
                                  ...(!isCurrent && !isPast && {
                                    color: 'var(--muted) !important',
                                    '& .MuiStepIcon-text': { fill: 'var(--muted-foreground)' },
                                  }),
                                },
                              }}
                              sx={{
                                '& .MuiStepLabel-label': {
                                  fontSize: '11px !important',
                                  marginTop: '6px !important',
                                  color: isCurrent
                                    ? 'var(--foreground) !important'
                                    : isPast
                                      ? 'var(--muted-foreground) !important'
                                      : 'color-mix(in srgb, var(--muted-foreground) 50%, transparent) !important',
                                  fontWeight: isCurrent ? '700 !important' : isPast ? '500 !important' : '400 !important',
                                },
                                '& .MuiStepLabel-label.Mui-completed': {
                                  color: 'var(--muted-foreground) !important',
                                  fontWeight: '500 !important',
                                },
                                '& .MuiStepLabel-label.Mui-active': {
                                  color: 'var(--foreground) !important',
                                  fontWeight: '700 !important',
                                },
                              }}
                            >
                              {step.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                              {isCurrent && (
                                <span style={{ display: 'block', fontSize: '9px', marginTop: '2px' }}>
                                  {detailAsset.daysInStatus}d ago
                                </span>
                              )}
                            </StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                    {/* Transferred badge (off canonical path) */}
                    {isTransferred && detailAsset.status === 'transferred' && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-purple-500/5 border border-purple-500/20">
                        <SwapHoriz className="w-4 h-4 text-purple-500" />
                        <p className="text-xs">
                          <span className="font-medium text-purple-700 dark:text-purple-300">Currently in transit</span>
                          {' '}— this is a temporary operational state outside the canonical lifecycle path.
                        </p>
                      </div>
                    )}
                    {/* Valid next transitions */}
                    {validTransitions[detailAsset.status].length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">Valid next:</span>
                          {validTransitions[detailAsset.status].map(ns => (
                            <Badge key={ns} variant="outline" className="text-[10px] px-2 py-0.5">
                              {ns.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
                          <Info className="w-3 h-3 shrink-0" />
                          Determined by the transition rule matrix — each status defines its allowed target statuses. Only permitted transitions are shown.
                        </p>
                      </div>
                    )}
                    {detailAsset.status === 'disposed' && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-red-500/5 border border-red-500/20">
                        <Lock className="w-4 h-4 text-red-500" />
                        <p className="text-xs">
                          <span className="font-medium text-red-700 dark:text-red-300">Terminal state</span>
                          {' '}— no further transitions are allowed. Admin override is required for any changes.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Detail Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <DescriptionIcon className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wide">Asset Details</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Asset ID</span>
                    <span className="font-['Manrope'] font-medium">{detailAsset.assetId}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span>{detailAsset.name}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span>{detailAsset.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <PersonIcon className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wide">Assignment</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Custodian</span>
                    <span>{detailAsset.custodian}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span>{detailAsset.location}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Changed By</span>
                    <span>{detailAsset.changedBy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wide">Status Info</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Status</span>
                    <Badge className={getStatusColor(detailAsset.status)}>
                      {detailAsset.status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days in Status</span>
                    <span className={detailAsset.daysInStatus > 30 && !['disposed', 'in-use'].includes(detailAsset.status) ? 'text-yellow-600 font-medium' : ''}>
                      {detailAsset.daysInStatus} days
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Changed</span>
                    <span>{formatDate(detailAsset.lastStatusChange)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Justification (if any) */}
          {detailAsset.justification && (
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                <span className="font-medium">Justification:</span> {detailAsset.justification}
              </AlertDescription>
            </Alert>
          )}

          {/* Status History Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="w-5 h-5" />
                Status History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const history = getAssetHistory(detailAsset);
                const lastIdx = history.length - 1;
                return (
                  <Stepper
                    activeStep={lastIdx}
                    orientation="vertical"
                    sx={{
                      '& .MuiStepConnector-line': {
                        borderColor: 'var(--border)',
                        minHeight: '24px',
                      },
                      '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                        borderColor: '#121321',
                      },
                      '.dark & .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                        borderColor: '#81CCD7',
                      },
                      '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                        borderColor: '#121321',
                      },
                      '.dark & .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                        borderColor: '#81CCD7',
                      },
                    }}
                  >
                    {history.map((entry, idx) => {
                      const isCurrent = idx === lastIdx;
                      const isPast = idx < lastIdx;
                      const hexColor = getStepperStatusHex(entry.status);

                      return (
                        <Step key={idx} completed={isPast}>
                          <StepLabel
                            StepIconProps={{
                              sx: {
                                color: `${hexColor} !important`,
                                opacity: isCurrent ? 1 : 0.7,
                                '& .MuiStepIcon-text': { fill: '#fff' },
                              },
                            }}
                            sx={{
                              '& .MuiStepLabel-label': {
                                color: 'var(--foreground) !important',
                                fontWeight: isCurrent ? '600 !important' : '400 !important',
                              },
                              '& .MuiStepLabel-label.Mui-completed': {
                                color: 'var(--foreground) !important',
                              },
                              '& .MuiStepLabel-label.Mui-active': {
                                color: 'var(--foreground) !important',
                                fontWeight: '600 !important',
                              },
                            }}
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={getStatusColor(entry.status)}>
                                {entry.status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(entry.date)}
                              </span>
                              {isCurrent && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">Current</Badge>
                              )}
                            </div>
                          </StepLabel>
                          <StepContent
                            sx={{
                              borderColor: isPast ? '#121321' : 'var(--border)',
                              '.dark &': {
                                borderColor: isPast ? '#81CCD7' : 'var(--border)',
                              },
                            }}
                          >
                            <div className="pb-2">
                              <p className="text-sm">{entry.justification}</p>
                              <p className="text-xs text-muted-foreground mt-1">by {entry.changedBy}</p>
                            </div>
                          </StepContent>
                        </Step>
                      );
                    })}
                  </Stepper>
                );
              })()}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Status Distribution */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {allStatuses.map(status => (
              <Card key={status} className={`cursor-pointer transition-all ${statusFilter === status ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold">{statusCounts[status]}</p>
                  <Badge className={`${getStatusColor(status)} mt-1`}>
                    {status.replace('-', ' ')}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2">
            <Button variant={viewMode === 'overview' ? 'default' : 'outline'} onClick={() => setViewMode('overview')} className="text-[15px]">
              <Eye className="w-4 h-4 mr-2" />
              All Assets
            </Button>
            <Button variant={viewMode === 'transitions' ? 'default' : 'outline'} onClick={() => setViewMode('transitions')} className="text-[15px]">
              <SwapHoriz className="w-4 h-4 mr-2" />
              Pending Transitions
              {pendingTransitions.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">{pendingTransitions.length}</Badge>
              )}
            </Button>
            <Button variant={viewMode === 'stuck' ? 'default' : 'outline'} onClick={() => setViewMode('stuck')} className="text-[15px]">
              <Warning className="w-4 h-4 mr-2" />
              Stuck Assets
              {stuckAssets.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">{stuckAssets.length}</Badge>
              )}
            </Button>
          </div>

          {/* Pending Transitions View */}
          {viewMode === 'transitions' && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Status Transitions</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingTransitions.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[15px]">ID</TableHead>
                          <TableHead className="text-[15px]">Asset</TableHead>
                          <TableHead className="text-[15px]">From</TableHead>
                          <TableHead className="text-[15px]"></TableHead>
                          <TableHead className="text-[15px]">To</TableHead>
                          <TableHead className="text-[15px]">Requested By</TableHead>
                          <TableHead className="text-[15px]">Justification</TableHead>
                          <TableHead className="text-[15px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingTransitions.map(t => (
                          <TableRow key={t.id}>
                            <TableCell className="font-['Manrope'] text-[15px]">{t.id}</TableCell>
                            <TableCell className="text-[15px]">
                              <div>
                                <p className="font-['Manrope'] font-medium">{t.assetId}</p>
                                <p className="text-xs text-muted-foreground">{t.assetName}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-[15px]"><Badge className={getStatusColor(t.fromStatus)}>{t.fromStatus.replace('-', ' ')}</Badge></TableCell>
                            <TableCell className="text-[15px]"><ArrowForward className="w-4 h-4 text-muted-foreground" /></TableCell>
                            <TableCell className="text-[15px]"><Badge className={getStatusColor(t.toStatus)}>{t.toStatus.replace('-', ' ')}</Badge></TableCell>
                            <TableCell className="text-[15px]">{t.requestedBy}</TableCell>
                            <TableCell className="max-w-[200px] truncate text-[15px]">{t.justification}</TableCell>
                            <TableCell className="text-[15px]">
                              <div className="flex gap-1">
                                <Button size="sm" onClick={() => toast.success('Transition approved')}>
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => toast.error('Transition rejected')}>
                                  <Block className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No pending transitions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Stuck Assets View */}
          {viewMode === 'stuck' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Warning className="w-5 h-5 text-yellow-600" />
                  Assets Stuck in Status ({'>'}30 days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stuckAssets.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[15px]">Asset ID</TableHead>
                          <TableHead className="text-[15px]">Name</TableHead>
                          <TableHead className="text-[15px]">Status</TableHead>
                          <TableHead className="text-[15px]">Days in Status</TableHead>
                          <TableHead className="text-[15px]">Last Changed</TableHead>
                          <TableHead className="text-[15px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stuckAssets.map(a => (
                          <TableRow key={a.id} className="bg-yellow-500/5">
                            <TableCell className="font-['Manrope'] font-medium text-[15px]">{a.assetId}</TableCell>
                            <TableCell className="text-[15px]">{a.name}</TableCell>
                            <TableCell className="text-[15px]"><Badge className={getStatusColor(a.status)}>{a.status.replace('-', ' ')}</Badge></TableCell>
                            <TableCell className="text-[15px]">
                              <span className="font-medium text-yellow-600">{a.daysInStatus} days</span>
                            </TableCell>
                            <TableCell className="text-[15px]">{a.lastStatusChange}</TableCell>
                            <TableCell className="text-[15px]">
                              <Button size="sm" variant="outline" onClick={() => handleInitiateTransition(a)}>
                                <SwapHoriz className="w-4 h-4 mr-1" />
                                Change Status
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No stuck assets found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Overview */}
          {viewMode === 'overview' && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by Asset ID or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 text-[15px]"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48 text-[15px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="all" className="text-[15px]">All Statuses</SelectItem>
                      {allStatuses.map(s => (
                        <SelectItem key={s} value={s} className="text-[15px]">{s.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-auto max-h-[calc(100vh-380px)] scrollbar-hide">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[15px]">Asset ID</TableHead>
                        <TableHead className="text-[15px]">Name</TableHead>
                        <TableHead className="text-[15px]">Type</TableHead>
                        <TableHead className="text-[15px]">Status</TableHead>
                        <TableHead className="text-[15px]">Custodian</TableHead>
                        <TableHead className="text-[15px]">Location</TableHead>
                        <TableHead className="text-[15px]">Days in Status</TableHead>
                        <TableHead className="text-[15px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginateData(filteredAssets, page, rowsPerPage).map(asset => (
                        <TableRow key={asset.id} className={`/50 cursor-pointer ${asset.daysInStatus > 30 && !['disposed', 'in-use'].includes(asset.status) ? 'bg-yellow-500/5' : ''}`} onClick={() => setDetailAsset(asset)}>
                          <TableCell className="font-['Manrope'] font-medium text-[15px]">
                            <div className="flex items-center gap-2">
                              <span className="text-[#121321] dark:text-[#81CCD7]">{asset.assetId}</span>
                              {asset.isLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
                            </div>
                          </TableCell>
                          <TableCell className="text-[15px]">{asset.name}</TableCell>
                          <TableCell className="text-[15px]">{asset.type}</TableCell>
                          <TableCell className="text-[15px]">
                            <Badge className={getStatusColor(asset.status)}>
                              {asset.status.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[15px]">{asset.custodian}</TableCell>
                          <TableCell className="text-[15px]">{asset.location}</TableCell>
                          <TableCell className="text-[15px]">
                            <span className={asset.daysInStatus > 30 && !['disposed', 'in-use'].includes(asset.status) ? 'text-yellow-600 font-medium' : ''}>
                              {asset.daysInStatus}d
                            </span>
                          </TableCell>
                          <TableCell className="text-[15px]">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setDetailAsset(asset); }}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              {asset.status !== 'disposed' ? (
                                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleInitiateTransition(asset); }}>
                                  <SwapHoriz className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Lock className="w-4 h-4 text-muted-foreground ml-2" />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                  <TablePagination
                    totalItems={filteredAssets.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={setPage}
                    onRowsPerPageChange={setRowsPerPage}
                    totalUnfilteredItems={assets.length}
                    itemLabel="assets"
                  />
                </div>

                {filteredAssets.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No assets found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Status Transition Drawer — always mounted */}
      <Sheet open={showTransitionDialog} onOpenChange={setShowTransitionDialog}>
        <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
          <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
            <SheetTitle className="text-[15px] flex items-center gap-2">
              <SwapHoriz className="w-5 h-5" />
              Change Asset Status
            </SheetTitle>
            <SheetDescription className="text-[14px]">
              Submit a status transition request. Changes will be routed for approval based on your role.
            </SheetDescription>
          </SheetHeader>

          {selectedAsset && (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {/* Asset Info Card */}
                <div className="rounded-[4px] border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[14px] text-muted-foreground">Asset</p>
                      <p className="font-['Manrope'] font-medium">{selectedAsset.assetId}</p>
                    </div>
                    {selectedAsset.isLocked && (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </Badge>
                    )}
                  </div>
                  <p className="text-[14px]">{selectedAsset.name}</p>
                  <div className="grid grid-cols-2 gap-3 text-[14px]">
                    <div>
                      <p className="text-[14px] text-muted-foreground">Type</p>
                      <p>{selectedAsset.type}</p>
                    </div>
                    <div>
                      <p className="text-[14px] text-muted-foreground">Location</p>
                      <p>{selectedAsset.location}</p>
                    </div>
                    <div>
                      <p className="text-[14px] text-muted-foreground">Custodian</p>
                      <p>{selectedAsset.custodian}</p>
                    </div>
                    <div>
                      <p className="text-[14px] text-muted-foreground">Days in Status</p>
                      <p className={selectedAsset.daysInStatus > 30 ? 'text-yellow-600 font-medium' : ''}>
                        {selectedAsset.daysInStatus} days
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Current Status */}
                <div>
                  <Label className="text-[15px] font-medium mb-2 block">Current Status</Label>
                  <div className="flex items-center gap-3 p-3 rounded-[4px] border bg-muted/20">
                    <DotIcon className={`w-3 h-3 ${
                      selectedAsset.status === 'in-use' ? 'text-green-500' :
                      selectedAsset.status === 'disposed' ? 'text-red-500' :
                      selectedAsset.status === 'damaged' ? 'text-orange-500' :
                      selectedAsset.status === 'retired' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <Badge className={getStatusColor(selectedAsset.status)}>
                      {selectedAsset.status.replace('-', ' ')}
                    </Badge>
                    <span className="text-[14px] text-muted-foreground ml-auto">
                      Since {formatDate(selectedAsset.lastStatusChange)}
                    </span>
                  </div>
                </div>

                {/* Target Status Selection */}
                <div className="space-y-2">
                  <Label className="text-[15px]">New Status <span className="text-destructive">*</span></Label>
                  {validTransitions[selectedAsset.status].length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {validTransitions[selectedAsset.status].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setTargetStatus(s)}
                          className={`p-3 rounded-[4px] border text-left transition-all ${
                            targetStatus === s
                              ? 'border-[#121321] bg-[#121321]/5 dark:border-[#81CCD7] dark:bg-[#81CCD7]/10'
                              : 'border-border[#121321]/40 dark:[#81CCD7]/40'
                          }`}
                        >
                          <Badge className={`${getStatusColor(s)} pointer-events-none`}>
                            {s.replace('-', ' ')}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <Warning className="h-4 w-4" />
                      <AlertDescription>No valid transitions from this status. Admin override required.</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Transition Arrow Preview */}
                {targetStatus && (
                  <div className="flex items-center justify-center gap-3 py-2">
                    <Badge className={getStatusColor(selectedAsset.status)}>
                      {selectedAsset.status.replace('-', ' ')}
                    </Badge>
                    <ArrowForward className="w-4 h-4 text-muted-foreground" />
                    <Badge className={getStatusColor(targetStatus)}>
                      {targetStatus.replace('-', ' ')}
                    </Badge>
                  </div>
                )}

                <Separator />

                {/* Justification */}
                <div className="space-y-2">
                  <Label className="text-[15px]">Justification <span className="text-destructive">*</span></Label>
                  <Textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Provide reason for status change..."
                    rows={4}
                    className="text-[15px] placeholder:text-[14px]"
                  />
                  <p className="text-[14px] text-muted-foreground">
                    This will be recorded in the audit trail and visible to approvers.
                  </p>
                </div>

                {/* Contextual Warnings */}
                {targetStatus === 'disposed' && (
                  <Alert variant="destructive">
                    <Warning className="h-4 w-4" />
                    <AlertDescription>
                      <span className="font-medium">Terminal State:</span> The asset will be permanently locked after disposal. This action cannot be reversed without an admin override.
                    </AlertDescription>
                  </Alert>
                )}

                {targetStatus === 'retired' && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This asset will be flagged for survey/disposal processing. A disposal request should be created after approval.
                    </AlertDescription>
                  </Alert>
                )}

                {targetStatus === 'damaged' && (
                  <Alert>
                    <Warning className="h-4 w-4" />
                    <AlertDescription>
                      Damaged assets are restricted from transfers and assignments until status is resolved.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Pinned Footer */}
              <div className="border-t px-6 py-4 shrink-0 bg-background">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowTransitionDialog(false)} className="text-[15px]">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitTransition}
                    disabled={!targetStatus || !justification.trim()}
                    className="text-[15px]"
                  >
                    <SwapHoriz className="w-4 h-4 mr-2" />
                    Submit for Approval
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
