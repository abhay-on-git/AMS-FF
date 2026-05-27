import React, { useState, useMemo } from 'react';
import { formatDate } from '../../utils/dateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { MuiCheckbox } from '../shared/MuiCheckbox';
import { TablePagination, paginateData } from '../shared/TablePagination';
import { FileUploadDrawer } from '../shared/FileUploadDrawer';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
import {
  Add as Plus,
  Search,
  Visibility as Eye,
  SwapHoriz as TransferIcon,
  Person as UserIcon,
  LocationOn as MapPin,
  Business as BuildingIcon,
  Description as FileText,
  Download,
  Upload,
  CheckCircle,
  Cancel as XCircle,
  Warning as AlertCircle,
  Schedule as Clock,
  Assignment as ClipboardIcon,
  LocalShipping as TruckIcon,
  Notifications as BellIcon,
  DriveFileRenameOutline as PenIcon,
  ArrowBack,
  ChevronLeft,
  ArrowForward as ArrowRight,
  Block as BlockIcon,
  Refresh as RotateCcw,
  Print as PrintIcon,
  MoreHoriz as MoreHorizontal,
  Send as SendIcon,
  Inventory as InventoryIcon,
  FilterList as FilterIcon,
  Close as XIcon,
  DoneAll as DoneAllIcon,
  HourglassEmpty as HourglassIcon,
  EditNote as DraftIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { InitiateTransferDrawer, TransferFormData } from './InitiateTransferDrawer';
import { DigitalSignatureModal, DigitalSignatureData } from '../shared/DigitalSignatureModal';
import {
  TransferRequest,
  TransferType,
  TransferStatus,
  TransferAssetItem,
  mockTransfers,
  eligibleAssets,
  ineligibleAssetIds,
  getTransferStatusColor,
  getTransferTypeLabel,
  getTransferTypeColor,
  fieldOffices,
  buildings,
  rooms,
  custodians,
} from './transferTypes';

type SubView = 'all' | 'my-transfers' | 'pending-approvals' | 'pending-ack';

const CURRENT_USER = 'John Doe';

interface AssetTransfersProps {
  onDetailViewChange?: (isDetailOpen: boolean) => void;
}

export function AssetTransfers({ onDetailViewChange }: AssetTransfersProps) {
  // ── State ──
  const [transfers, setTransfers] = useState<TransferRequest[]>(mockTransfers);
  const [subView, setSubView] = useState<SubView>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [officeFilter, setOfficeFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Detail / Create
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ── Computed: are filters locked by sub-tab? ──
  const isFilterLocked = subView === 'pending-approvals' || subView === 'pending-ack';
  const effectiveStatusFilter = subView === 'pending-approvals' ? 'pending-approval'
    : subView === 'pending-ack' ? 'pending-acknowledgment'
    : statusFilter;
  const effectiveTypeFilter = subView === 'pending-approvals' ? 'inter-field'
    : subView === 'pending-ack' ? 'all'
    : typeFilter;
  const effectiveOfficeFilter = isFilterLocked ? 'all' : officeFilter;

  // ── Filtering ──
  const filteredTransfers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return transfers.filter(t => {
      const matchesSearch = !q ||
        t.transferId.toLowerCase().includes(q) ||
        t.fromCustodian.toLowerCase().includes(q) ||
        t.toCustodian.toLowerCase().includes(q) ||
        t.reason.toLowerCase().includes(q) ||
        t.fromFieldOffice.toLowerCase().includes(q) ||
        t.toFieldOffice.toLowerCase().includes(q);
      const matchesStatus = effectiveStatusFilter === 'all' || t.status === effectiveStatusFilter;
      const matchesType = effectiveTypeFilter === 'all' || t.transferType === effectiveTypeFilter;
      const matchesOffice = effectiveOfficeFilter === 'all' ||
        t.fromFieldOffice === effectiveOfficeFilter || t.toFieldOffice === effectiveOfficeFilter;

      // Sub-view filters
      if (subView === 'my-transfers') return matchesSearch && matchesStatus && matchesType && matchesOffice && t.initiatedBy === CURRENT_USER;
      if (subView === 'pending-approvals') return matchesSearch && matchesStatus && matchesType && matchesOffice;
      if (subView === 'pending-ack') return matchesSearch && matchesStatus && matchesType && matchesOffice;

      return matchesSearch && matchesStatus && matchesType && matchesOffice;
    });
  }, [transfers, searchQuery, effectiveStatusFilter, effectiveTypeFilter, effectiveOfficeFilter, subView]);

  const pagedData = paginateData(filteredTransfers, page, rowsPerPage);

  // ── Stats ──
  const stats = useMemo(() => ({
    total: transfers.length,
    pendingCustodian: transfers.filter(t => t.status === 'pending-custodian').length,
    pending: transfers.filter(t => t.status === 'pending-approval').length,
    inTransit: transfers.filter(t => t.status === 'in-transit').length,
    pendingAck: transfers.filter(t => t.status === 'pending-acknowledgment').length,
    completed: transfers.filter(t => t.status === 'completed').length,
    drafts: transfers.filter(t => t.status === 'draft').length,
  }), [transfers]);

  // ── Handlers ──
  const openDetail = (t: TransferRequest) => {
    setSelectedTransfer(t);
    setShowDetail(true);
    if (onDetailViewChange) onDetailViewChange(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedTransfer(null);
    if (onDetailViewChange) onDetailViewChange(false);
  };

  const handleCustodianSign = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? {
      ...t,
      status: 'pending-approval' as TransferStatus,
      signatures: t.signatures.map(s =>
        s.role === 'receiving_custodian'
          ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString(), method: 'digital' as const }
          : s
      ),
      auditTrail: [...t.auditTrail, {
        id: `audit-${Date.now()}`, action: 'Custodian Signed', user: CURRENT_USER,
        timestamp: new Date().toISOString(), details: 'Receiving custodian signed — transfer routed to approving officer',
      }],
    } : t));
    toast.success('Signed as custodian — transfer routed to approving officer');
    closeDetail();
  };

  const handleApprove = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? {
      ...t,
      status: 'in-transit' as TransferStatus,
      approvedBy: CURRENT_USER,
      approvedDate: new Date().toISOString(),
      signatures: t.signatures.map(s =>
        s.role === 'approving_officer'
          ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString(), method: 'digital' as const }
          : s
      ),
      auditTrail: [...t.auditTrail, {
        id: `audit-${Date.now()}`, action: 'Transfer Approved', user: CURRENT_USER,
        timestamp: new Date().toISOString(), details: 'Approving officer approved — assets marked in-transit',
      }],
    } : t));
    toast.success('Transfer approved — assets are now in transit');
    closeDetail();
  };

  const handleReject = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? {
      ...t,
      status: 'rejected' as TransferStatus,
      rejectedBy: CURRENT_USER,
      rejectedDate: new Date().toISOString(),
      rejectionReason: 'Transfer not justified at this time.',
      signatures: t.signatures.map(s =>
        s.role === 'approving_officer'
          ? { ...s, status: 'declined' as const }
          : s
      ),
      auditTrail: [...t.auditTrail, {
        id: `audit-${Date.now()}`, action: 'Transfer Rejected', user: CURRENT_USER,
        timestamp: new Date().toISOString(), details: 'Approving officer rejected the transfer request',
      }],
    } : t));
    toast.error('Transfer rejected');
    closeDetail();
  };

  const handleAcknowledge = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? {
      ...t,
      status: 'completed' as TransferStatus,
      acknowledged: true,
      receivedBy: CURRENT_USER,
      receivedDate: new Date().toISOString(),
      completedDate: new Date().toISOString(),
      auditTrail: [...t.auditTrail, {
        id: `audit-${Date.now()}`, action: 'Asset Receipt Acknowledged', user: CURRENT_USER,
        timestamp: new Date().toISOString(), details: 'Receiving custodian confirmed asset receipt. Transfer completed.',
      }],
    } : t));
    toast.success('Asset receipt acknowledged — transfer completed');
    closeDetail();
  };

  const handlePullback = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? {
      ...t,
      status: 'cancelled' as TransferStatus,
      auditTrail: [...t.auditTrail, {
        id: `audit-${Date.now()}`, action: 'Transfer Pulled Back', user: CURRENT_USER,
        timestamp: new Date().toISOString(), details: 'Transfer request cancelled by initiator',
      }],
    } : t));
    toast.info('Transfer request pulled back');
    closeDetail();
  };

  const handleDrawerSubmit = (formData: TransferFormData, selectedAssets: TransferAssetItem[]) => {
    const newTransfer: TransferRequest = {
      id: String(transfers.length + 1),
      transferId: `TRF-2026-${String(transfers.length + 1).padStart(4, '0')}`,
      transferType: formData.transferType,
      status: 'pending-custodian',
      fromCustodian: formData.fromCustodian,
      fromLocation: formData.fromRoom,
      fromBuilding: formData.fromBuilding,
      fromRoom: formData.fromRoom,
      fromFieldOffice: formData.fromFieldOffice,
      toCustodian: formData.toCustodian,
      toLocation: formData.toRoom,
      toBuilding: formData.toBuilding,
      toRoom: formData.toRoom,
      toFieldOffice: formData.toFieldOffice,
      reason: formData.reason,
      notes: formData.notes,
      assets: selectedAssets,
      initiatedBy: CURRENT_USER,
      initiatedDate: new Date().toISOString(),
      signatures: [
        { role: 'initiating_officer', name: CURRENT_USER, status: 'signed', signedDate: new Date().toISOString(), method: 'digital' },
        { role: 'receiving_custodian', name: formData.toCustodian, status: 'pending' },
        { role: 'approving_officer', name: 'Approving Officer', status: 'pending' },
      ],
      formGenerated: true,
      formUploaded: false,
      attachments: [],
      notificationsSent: formData.sendNotifications,
      acknowledgmentRequired: formData.acknowledgmentRequired,
      acknowledged: false,
      auditTrail: [
        { id: `audit-${Date.now()}`, action: 'Transfer Initiated', user: CURRENT_USER, timestamp: new Date().toISOString(), details: `${getTransferTypeLabel(formData.transferType)} transfer with ${selectedAssets.length} asset(s)` },
      ],
    };
    setTransfers(prev => [newTransfer, ...prev]);
    toast.success(`Transfer ${newTransfer.transferId} created and submitted for approval`);
    setCreateDrawerOpen(false);
  };

  // ── Detail View ──
  if (showDetail && selectedTransfer) {
    return <TransferDetailView
      transfer={selectedTransfer}
      onBack={closeDetail}
      onCustodianSign={handleCustodianSign}
      onApprove={handleApprove}
      onReject={handleReject}
      onAcknowledge={handleAcknowledge}
      onPullback={handlePullback}
    />;
  }

  // ── List View ──
  return (
    <div className="space-y-5 min-w-0">
      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatCard label="Total" value={stats.total} icon={<TransferIcon className="w-5 h-5" />} color="bg-[#121321]" />
        <StatCard label="Awaiting Custodian" value={stats.pendingCustodian} icon={<PenIcon className="w-5 h-5" />} color="bg-cyan-600" />
        <StatCard label="Pending Approval" value={stats.pending} icon={<HourglassIcon className="w-5 h-5" />} color="bg-amber-600" />
        <StatCard label="In Transit" value={stats.inTransit} icon={<TruckIcon className="w-5 h-5" />} color="bg-indigo-600" />
        <StatCard label="Pending Ack." value={stats.pendingAck} icon={<BellIcon className="w-5 h-5" />} color="bg-purple-600" />
        <StatCard label="Completed" value={stats.completed} icon={<DoneAllIcon className="w-5 h-5" />} color="bg-green-600" />
        <StatCard label="Drafts" value={stats.drafts} icon={<DraftIcon className="w-5 h-5" />} color="bg-gray-500" />
      </div>

      {/* Sub-tabs & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px]">
          {([
            { key: 'all', label: 'All Transfers' },
            { key: 'my-transfers', label: 'My Transfers' },
            { key: 'pending-approvals', label: 'Pending Approvals', badge: stats.pending },
            { key: 'pending-ack', label: 'Pending Ack.', badge: stats.pendingAck },
          ] as { key: SubView; label: string; badge?: number }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => { setSubView(tab.key); setPage(0); }}
              className={`px-3 py-1.5 rounded-[4px] text-sm transition-colors flex items-center gap-1.5 ${
                subView === tab.key
                  ? 'bg-[#121321] text-white shadow-sm'
                  : 'text-[#121321][#121321]/5 dark:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Button onClick={() => { setCreateDrawerOpen(true); }} className="gap-1.5">
          <Plus className="w-4 h-4" />
          Initiate Transfer
        </Button>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transfer ID, custodian, reason, field office..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={effectiveStatusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }} disabled={isFilterLocked}>
                <SelectTrigger className={`w-[155px] ${isFilterLocked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending-custodian">Pending Custodian</SelectItem>
                  <SelectItem value="pending-approval">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="pending-acknowledgment">Pending Ack.</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={effectiveTypeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(0); }} disabled={isFilterLocked}>
                <SelectTrigger className={`w-[155px] ${isFilterLocked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="intra-field">Intra-Field</SelectItem>
                  <SelectItem value="inter-field">Inter-Field</SelectItem>
                </SelectContent>
              </Select>
              <Select value={effectiveOfficeFilter} onValueChange={(v) => { setOfficeFilter(v); setPage(0); }} disabled={isFilterLocked}>
                <SelectTrigger className={`w-[155px] ${isFilterLocked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder="Field Office" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all">All Offices</SelectItem>
                  {fieldOffices.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransfers.length > 0 ? (
            <div className="rounded-md border mx-6 mb-0 overflow-hidden">
              <div className="overflow-auto max-h-[calc(100vh-480px)] scrollbar-hide">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transfer ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead></TableHead>
                      <TableHead>To</TableHead>
                      <TableHead className="text-center">Assets</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Signatures</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedData.map(t => (
                      <TableRow key={t.id} className="cursor-pointer/50" onClick={() => openDetail(t)}>
                        <TableCell className="font-['Manrope'] font-medium">{t.transferId}</TableCell>
                        <TableCell>
                          <Badge className={getTransferTypeColor(t.transferType) + ' text-[10px]'}>
                            {getTransferTypeLabel(t.transferType)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm min-w-[120px]">
                            <p className="font-medium truncate">{t.fromCustodian}</p>
                            <p className="text-xs text-muted-foreground truncate">{t.fromFieldOffice} · {t.fromRoom || t.fromLocation}</p>
                          </div>
                        </TableCell>
                        <TableCell className="px-1">
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm min-w-[120px]">
                            <p className="font-medium truncate">{t.toCustodian || <span className="italic text-muted-foreground">TBD</span>}</p>
                            <p className="text-xs text-muted-foreground truncate">{t.toFieldOffice} · {t.toRoom || t.toLocation || '—'}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-sm font-medium">
                            {t.assets.length}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTransferStatusColor(t.status) + ' text-[10px] whitespace-nowrap'}>
                            {t.status.replace(/-/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {formatDate(t.initiatedDate)}
                        </TableCell>
                        <TableCell>
                          <SignatureProgress signatures={t.signatures} />
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openDetail(t); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <TablePagination
                totalItems={filteredTransfers.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                totalUnfilteredItems={transfers.length}
                itemLabel="transfers"
              />
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <TransferIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <h3 className="text-lg mb-1">No transfers found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {isFilterLocked ? `No ${subView === 'pending-approvals' ? 'pending approval' : 'pending acknowledgment'} transfers found`
                  : searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Initiate a transfer to get started'}
              </p>
              {!isFilterLocked && (searchQuery || statusFilter !== 'all') ? (
                <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setTypeFilter('all'); setOfficeFilter('all'); }}>
                  <FilterIcon className="w-4 h-4 mr-2" /> Clear Filters
                </Button>
              ) : (
                <Button onClick={() => setCreateDrawerOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Initiate Transfer
                </Button>
              )}
            </div>
          )}
          {/* Bottom padding for pagination */}
          <div className="h-4" />
        </CardContent>
      </Card>

      {/* ── Create Transfer Drawer ── */}
      <InitiateTransferDrawer
        open={createDrawerOpen}
        onOpenChange={(open) => { setCreateDrawerOpen(open); if (!open) setFormErrors({}); }}
        availableAssets={eligibleAssets}
        onSubmit={handleDrawerSubmit}
      />
    </div>
  );
}

// ── Sub-components ──

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-[4px] border bg-background">
      <div className={`w-9 h-9 rounded-[4px] ${color} flex items-center justify-center text-white shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold">{value}</p>
        <p className="text-[11px] text-muted-foreground truncate">{label}</p>
      </div>
    </div>
  );
}

function SignatureProgress({ signatures }: { signatures: { status: string }[] }) {
  if (signatures.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
  const signed = signatures.filter(s => s.status === 'signed').length;
  const total = signatures.length;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {signatures.map((s, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              s.status === 'signed' ? 'bg-green-500' :
              s.status === 'declined' ? 'bg-red-500' :
              'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground">{signed}/{total}</span>
    </div>
  );
}

// ── Transfer Detail View ──

interface DetailViewProps {
  transfer: TransferRequest;
  onBack: () => void;
  onCustodianSign: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onAcknowledge: (id: string) => void;
  onPullback: (id: string) => void;
}

function TransferDetailView({ transfer, onBack, onCustodianSign, onApprove, onReject, onAcknowledge, onPullback }: DetailViewProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'assets' | 'signatures' | 'audit'>('details');
  const [uploadSignedFormOpen, setUploadSignedFormOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [signatureRole, setSignatureRole] = useState<'custodian' | 'approver'>('custodian');

  const formatDateLocal = (d?: string) => d ? new Date(d).toLocaleString() : '—';

  const handleDigitalSignature = (role: 'custodian' | 'approver') => {
    setSignatureRole(role);
    setSignatureModalOpen(true);
  };

  const handleSignatureConfirm = (signatureData: DigitalSignatureData) => {
    if (signatureRole === 'custodian') {
      onCustodianSign(transfer.id);
    } else {
      onApprove(transfer.id);
    }
  };

  return (
    <div className="space-y-5 min-w-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm mb-2">
            <button
              onClick={onBack}
              className="text-muted-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onBack}
              className="text-muted-foreground transition-colors"
            >
              Transfers
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{transfer.transferId}</span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{transfer.transferId}</h2>
            <Badge className={getTransferStatusColor(transfer.status) + ' text-xs'}>
              {transfer.status.replace(/-/g, ' ')}
            </Badge>
            <Badge className={getTransferTypeColor(transfer.transferType) + ' text-xs'}>
              {getTransferTypeLabel(transfer.transferType)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Initiated by {transfer.initiatedBy} on {formatDate(transfer.initiatedDate)} · {transfer.assets.length} asset{transfer.assets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {/* Step 2: Custodian signs */}
          {transfer.status === 'pending-custodian' && (
            <Button onClick={() => handleDigitalSignature('custodian')} className="gap-1.5">
              <PenIcon className="w-4 h-4" /> Sign as Custodian
            </Button>
          )}
          {/* Step 3: Approver approves or rejects */}
          {transfer.status === 'pending-approval' && (
            <>
              <Button onClick={() => handleDigitalSignature('approver')} className="gap-1.5">
                <CheckCircle className="w-4 h-4" /> Approve
              </Button>
              <Button variant="destructive" onClick={() => onReject(transfer.id)} className="gap-1.5">
                <XCircle className="w-4 h-4" /> Reject
              </Button>
            </>
          )}
          {transfer.status === 'pending-acknowledgment' && (
            <Button onClick={() => onAcknowledge(transfer.id)} className="gap-1.5">
              <DoneAllIcon className="w-4 h-4" /> Acknowledge Receipt
            </Button>
          )}
          {(transfer.status === 'draft' || transfer.status === 'pending-custodian') && transfer.initiatedBy === CURRENT_USER && (
            <Button variant="outline" onClick={() => onPullback(transfer.id)} className="gap-1.5">
              <RotateCcw className="w-4 h-4" /> Pull Back
            </Button>
          )}
          <Button variant="outline" onClick={() => toast.info('Generating PDF...')} className="gap-1.5">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
          <Button variant="outline" onClick={() => toast.info('Print transfer form')} className="gap-1.5">
            <PrintIcon className="w-4 h-4" /> Print
          </Button>
        </div>
      </div>

      {/* Rejection reason */}
      {transfer.status === 'rejected' && transfer.rejectionReason && (
        <Alert variant="destructive">
          <BlockIcon className="w-4 h-4" />
          <AlertDescription>
            <span className="font-medium">Rejected by {transfer.rejectedBy}:</span> {transfer.rejectionReason}
          </AlertDescription>
        </Alert>
      )}

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
        {(['details', 'assets', 'signatures', 'audit'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-[4px] text-sm capitalize transition-colors ${
              activeTab === tab
                ? 'bg-[#121321] text-white shadow-sm'
                : 'text-[#121321][#121321]/5 dark:text-white'
            }`}
          >
            {tab === 'audit' ? 'Audit Trail' : tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Transfer flow card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Transfer Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
                {/* From */}
                <div className="space-y-3 p-4 rounded-[4px] bg-red-50/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">From</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">{transfer.fromCustodian}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="text-sm">
                        <p>{transfer.fromFieldOffice}</p>
                        <p className="text-muted-foreground text-xs">{transfer.fromBuilding} · {transfer.fromRoom}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center pt-10">
                  <div className="flex flex-col items-center gap-1">
                    <ArrowRight className="w-6 h-6 text-[#121321] dark:text-[#81CCD7]" />
                    <span className="text-[10px] text-muted-foreground">{transfer.assets.length} asset{transfer.assets.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* To */}
                <div className="space-y-3 p-4 rounded-[4px] bg-green-50/50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/30">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">To</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">{transfer.toCustodian || <span className="italic text-muted-foreground">TBD</span>}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="text-sm">
                        <p>{transfer.toFieldOffice}</p>
                        <p className="text-muted-foreground text-xs">{transfer.toBuilding || '—'} · {transfer.toRoom || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="mt-5 p-3 rounded-[4px] bg-muted/50 border">
                <p className="text-xs text-muted-foreground mb-1">Reason</p>
                <p className="text-sm">{transfer.reason}</p>
                {transfer.notes && (
                  <>
                    <p className="text-xs text-muted-foreground mb-1 mt-3">Notes</p>
                    <p className="text-sm text-muted-foreground">{transfer.notes}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {(() => {
                    const custodianSig = transfer.signatures.find(s => s.role === 'receiving_custodian');
                    const approverSig = transfer.signatures.find(s => s.role === 'approving_officer');
                    const custodianSigned = custodianSig?.status === 'signed';
                    const approverSigned = approverSig?.status === 'signed';
                    const passedCustodian = custodianSigned || ['pending-approval', 'approved', 'in-transit', 'pending-acknowledgment', 'completed'].includes(transfer.status);
                    const passedApproval = approverSigned || ['approved', 'in-transit', 'pending-acknowledgment', 'completed'].includes(transfer.status);
                    return [
                      { label: 'Initiator Signed', date: transfer.initiatedDate, by: transfer.initiatedBy, done: true },
                      { label: 'Custodian Signed', date: custodianSig?.signedDate, by: custodianSig?.name, done: passedCustodian },
                      ...(transfer.status === 'rejected' ? [{ label: 'Rejected', date: transfer.rejectedDate, by: transfer.rejectedBy, done: true, isRejected: true }] : []),
                      ...(transfer.status !== 'rejected' ? [
                        { label: 'Approver Approved', date: transfer.approvedDate, by: transfer.approvedBy, done: passedApproval },
                        { label: 'In Transit', date: passedApproval ? transfer.approvedDate : undefined, done: ['in-transit', 'pending-acknowledgment', 'completed'].includes(transfer.status) },
                        { label: 'Received', date: transfer.receivedDate, by: transfer.receivedBy, done: !!transfer.receivedDate },
                        { label: 'Completed', date: transfer.completedDate, done: transfer.status === 'completed' },
                      ] : []),
                    ];
                  })().map((step, i, arr) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${
                          (step as any).isRejected ? 'bg-red-500' :
                          step.done ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`} />
                        {i < arr.length - 1 && <div className="w-px h-10 bg-border" />}
                      </div>
                      <div className="pb-4 min-w-0">
                        <p className={`text-sm ${step.done ? 'font-medium' : 'text-muted-foreground'}`}>{step.label}</p>
                        {step.date && <p className="text-[10px] text-muted-foreground">{formatDate(step.date)}</p>}
                        {step.by && <p className="text-[10px] text-muted-foreground">by {step.by}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Document Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {transfer.formGenerated && (
                  <div className="flex items-center justify-between p-2 rounded-[4px] border bg-muted/30">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Transfer Form</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => toast.info('Downloading transfer form...')}>
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
                {transfer.formUploaded && (
                  <div className="flex items-center justify-between p-2 rounded-[4px] border bg-green-50/50 dark:bg-green-900/10">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Signed Form</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => toast.info('Downloading signed form...')}>
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
                {!transfer.formUploaded && transfer.formGenerated && (
                  <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={() => setUploadSignedFormOpen(true)}>
                    <Upload className="w-4 h-4" /> Upload Signed Form
                  </Button>
                )}
                {transfer.attachments.length === 0 && !transfer.formGenerated && (
                  <p className="text-sm text-muted-foreground text-center py-2">No documents yet</p>
                )}
              </CardContent>
            </Card>

            {/* Acknowledgment */}
            {transfer.acknowledgmentRequired && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Acknowledgment</CardTitle>
                </CardHeader>
                <CardContent>
                  {transfer.acknowledged ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">Acknowledged</p>
                        {transfer.receivedBy && <p className="text-xs text-muted-foreground">by {transfer.receivedBy} on {formatDate(transfer.receivedDate)}</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-600">
                      <HourglassIcon className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">Pending</p>
                        <p className="text-xs text-muted-foreground">Awaiting confirmation from {transfer.toCustodian}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'assets' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Assets in Transfer ({transfer.assets.length})</CardTitle>
              <span className="text-sm text-muted-foreground">
                Total Value: ${transfer.assets.reduce((s, a) => s + (a.acquisitionValue || 0), 0).toLocaleString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Current Location</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfer.assets.map(asset => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-['Manrope'] font-medium">{asset.assetId}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell className="font-['Manrope']">{asset.serialNumber}</TableCell>
                      <TableCell>{asset.type}</TableCell>
                      <TableCell className="text-muted-foreground">{asset.currentLocation}</TableCell>
                      <TableCell>
                        <Badge className={
                          asset.condition === 'new' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' :
                          asset.condition === 'good' ? 'bg-green-500/10 text-green-700 dark:text-green-300' :
                          asset.condition === 'fair' ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300' :
                          'bg-gray-500/10 text-gray-700 dark:text-gray-300'
                        }>
                          {asset.condition}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-['Manrope']">${asset.acquisitionValue?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'signatures' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Signature Workflow</CardTitle>
              <Badge className={
                transfer.signatures.every(s => s.status === 'signed')
                  ? 'bg-green-500/10 text-green-700'
                  : transfer.signatures.some(s => s.status === 'declined')
                  ? 'bg-red-500/10 text-red-700'
                  : 'bg-amber-500/10 text-amber-700'
              }>
                {transfer.signatures.filter(s => s.status === 'signed').length}/{transfer.signatures.length} signed
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Sequential 3-step signature flow */}
            <div className="space-y-3">
              {transfer.signatures.map((sig, i) => {
                const stepLabels = ['Step 1', 'Step 2', 'Step 3'];
                const stepDescriptions = [
                  'Initiator signs to start the transfer',
                  'Receiving custodian reviews and signs',
                  'Approving officer gives final approval or rejection',
                ];
                const isCurrentStep =
                  (i === 0 && sig.status === 'pending') ||
                  (i === 1 && sig.status === 'pending' && transfer.signatures[0]?.status === 'signed') ||
                  (i === 2 && sig.status === 'pending' && transfer.signatures[1]?.status === 'signed');
                return (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-[4px] border bg-background ${isCurrentStep ? 'ring-2 ring-[#121321]/30 dark:ring-[#81CCD7]/30' : ''}`}>
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        sig.status === 'signed' ? 'bg-green-100 dark:bg-green-900/30' :
                        sig.status === 'declined' ? 'bg-red-100 dark:bg-[#F7F7F8]/30' :
                        isCurrentStep ? 'bg-[#121321]/10 dark:bg-[#81CCD7]/20' :
                        'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        {sig.status === 'signed' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                         sig.status === 'declined' ? <XCircle className="w-5 h-5 text-red-600" /> :
                         <span className="text-sm font-medium text-muted-foreground">{i + 1}</span>}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm capitalize">{sig.role.replace(/_/g, ' ')}</p>
                        <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-muted rounded">{stepLabels[i]}</span>
                      </div>
                      <p className="text-sm">{sig.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{stepDescriptions[i]}</p>
                      {sig.signedDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Signed on {formatDateLocal(sig.signedDate)}
                          {sig.method && <span className="ml-1">({sig.method})</span>}
                        </p>
                      )}
                      {sig.status === 'pending' && isCurrentStep && (
                        <p className="text-xs text-[#121321] dark:text-[#81CCD7] mt-1 font-medium">← Current step — awaiting signature</p>
                      )}
                      {sig.status === 'pending' && !isCurrentStep && (
                        <p className="text-xs text-muted-foreground mt-1">Waiting for previous step</p>
                      )}
                    </div>
                    <Badge className={
                      sig.status === 'signed' ? 'bg-green-500/10 text-green-700 dark:text-green-300' :
                      sig.status === 'declined' ? 'bg-red-500/10 text-red-700 dark:text-red-300' :
                      isCurrentStep ? 'bg-[#121321]/10 text-[#121321] dark:bg-[#81CCD7]/10 dark:text-[#81CCD7]' :
                      'bg-gray-500/10 text-gray-700 dark:text-gray-300'
                    }>
                      {sig.status === 'pending' && isCurrentStep ? 'action required' : sig.status}
                    </Badge>
                  </div>
                );
              })}
            </div>

            {/* Flow summary */}
            <div className="mt-4 p-3 bg-muted/50 rounded-[4px] border">
              <p className="text-xs text-muted-foreground mb-2">Signature Flow</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">Initiator signs</span>
                <ArrowRight className="w-3 h-3" />
                <span className="font-medium">Custodian signs</span>
                <ArrowRight className="w-3 h-3" />
                <span className="font-medium">Approver decides</span>
              </div>
            </div>

            {/* Transfer form info */}
            <div className="mt-6 p-4 bg-muted/50 rounded-[4px] border">
              <p className="text-xs text-muted-foreground mb-2">Transfer Form</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Form generated</span>
                  <span>{transfer.formGenerated ? '✓ Yes' : '✗ No'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Signed form uploaded</span>
                  <span>{transfer.formUploaded ? '✓ Yes' : '✗ Pending'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Supported formats</span>
                  <span className="text-xs">Adobe Acrobat, DocuSign, Manual Scan</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Audit Trail</CardTitle>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info('Exporting audit trail...')}>
                <Download className="w-4 h-4" /> Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {transfer.auditTrail.map((entry, i) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#121321] dark:bg-[#81CCD7] shrink-0 mt-1.5" />
                    {i < transfer.auditTrail.length - 1 && <div className="w-px flex-1 bg-border min-h-[40px]" />}
                  </div>
                  <div className="pb-5 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-[10px] text-muted-foreground whitespace-nowrap">{formatDateLocal(entry.timestamp)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">by {entry.user}</p>
                    {entry.details && <p className="text-xs text-muted-foreground mt-1">{entry.details}</p>}
                    {entry.oldValue && entry.newValue && (
                      <p className="text-xs mt-1">
                        <span className="text-red-600 line-through">{entry.oldValue}</span>
                        <span className="mx-1">→</span>
                        <span className="text-green-600">{entry.newValue}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Upload Signed Form Drawer ── */}
      <FileUploadDrawer
        open={uploadSignedFormOpen}
        onOpenChange={setUploadSignedFormOpen}
        title="Upload Signed Transfer Form"
        description={`Upload the signed transfer form for ${transfer.transferId}. Accepted formats: PDF or scanned images.`}
        acceptedTypes={['application/pdf', 'image/*']}
        maxFiles={1}
        maxFileSize={25}
        referenceId={transfer.transferId}
        onUploadComplete={(files) => {
          toast.success(`Signed form"${files[0]?.name}" uploaded for ${transfer.transferId} — pending verification`);
        }}
      />

      {/* ── Digital Signature Modal ── */}
      <DigitalSignatureModal
        open={signatureModalOpen}
        onOpenChange={setSignatureModalOpen}
        signatoryName={CURRENT_USER}
        signatoryRole={signatureRole === 'custodian' ? 'Receiving Custodian' : 'Approving Officer'}
        title={signatureRole === 'custodian' ? 'Sign as Receiving Custodian' : 'Sign as Approving Officer'}
        description={signatureRole === 'custodian' 
          ? `Confirm receipt of assets for transfer ${transfer.transferId}` 
          : `Approve transfer request ${transfer.transferId}`}
        onConfirm={handleSignatureConfirm}
      />
    </div>
  );
}
