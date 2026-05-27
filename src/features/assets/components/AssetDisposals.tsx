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
  DeleteForever as DisposalIcon,
  Person as UserIcon,
  Download,
  CheckCircle,
  Cancel as XCircle,
  Warning as AlertCircle,
  Schedule as Clock,
  Assignment as ClipboardIcon,
  ArrowBack,
  FilterList as FilterIcon,
  DoneAll as DoneAllIcon,
  HourglassEmpty as HourglassIcon,
  EditNote as DraftIcon,
  Gavel as AuctionIcon,
  Recycling as RecycleIcon,
  Block as BlockIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  Print as PrintIcon,
  Lock as LockIcon,
  Link as LinkIcon,
  Upload as UploadIcon,
  Description as FileText,
  AccountTree as WorkflowIcon,
  NotificationsActive as AlertBellIcon,
  ChevronLeft,
} from '@mui/icons-material';
import { toast } from 'sonner';
import {
  DisposalRequest,
  DisposalStatus,
  mockDisposals,
  getDisposalStatusColor,
  getDisposalMethodLabel,
  getDisposalMethodColor,
} from './disposalTypes';

const CURRENT_USER = 'John Doe';

interface AssetDisposalsProps {
  onDetailViewChange?: (isDetailOpen: boolean) => void;
}

export function AssetDisposals({ onDetailViewChange }: AssetDisposalsProps) {
  const [disposals, setDisposals] = useState<DisposalRequest[]>(mockDisposals);
  type SubView = 'all' | 'my-requests' | 'pending-approval' | 'in-progress';
  const [subView, setSubView] = useState<SubView>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedDisposal, setSelectedDisposal] = useState<DisposalRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  const [createForm, setCreateForm] = useState({
    title: '', justification: '', disposalMethod: '' as string,
    fieldOffice: '', targetDisposalDate: '', notes: '',
  });

  const isFilterLocked = subView === 'pending-approval' || subView === 'in-progress';
  const effectiveStatusFilter = subView === 'pending-approval' ? 'pending-approval'
    : subView === 'in-progress' ? 'in-progress'
    : statusFilter;

  const filteredDisposals = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return disposals.filter(d => {
      const matchesSearch = !q ||
        d.disposalId.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        d.requestedBy.toLowerCase().includes(q) ||
        d.fieldOffice.toLowerCase().includes(q) ||
        d.justification.toLowerCase().includes(q);
      const matchesStatus = effectiveStatusFilter === 'all' || d.status === effectiveStatusFilter;
      const matchesMethod = methodFilter === 'all' || d.disposalMethod === methodFilter;
      if (subView === 'my-requests') return matchesSearch && matchesStatus && matchesMethod && d.requestedBy === CURRENT_USER;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [disposals, searchQuery, effectiveStatusFilter, methodFilter, subView]);

  const pagedData = paginateData(filteredDisposals, page, rowsPerPage);

  const stats = useMemo(() => ({
    total: disposals.length,
    pendingReview: disposals.filter(d => d.status === 'pending-review').length,
    pendingApproval: disposals.filter(d => d.status === 'pending-approval').length,
    approved: disposals.filter(d => d.status === 'approved').length,
    inProgress: disposals.filter(d => d.status === 'in-progress').length,
    completed: disposals.filter(d => d.status === 'completed').length,
    drafts: disposals.filter(d => d.status === 'draft').length,
  }), [disposals]);

  const openDetail = (d: DisposalRequest) => {
    setSelectedDisposal(d);
    setShowDetail(true);
    onDetailViewChange?.(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedDisposal(null);
    onDetailViewChange?.(false);
  };

  const handleReview = (id: string) => {
    setDisposals(prev => prev.map(d => d.id === id ? {
      ...d, status: 'pending-approval' as DisposalStatus, reviewDate: new Date().toISOString(),
      signatures: d.signatures.map(s => s.role === 'finance_reviewer' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString(), method: 'digital' as const } : s),
      auditTrail: [...d.auditTrail, { id: `at-${Date.now()}`, action: 'Finance Review Completed', user: CURRENT_USER, timestamp: new Date().toISOString() }],
    } : d));
    setSelectedDisposal(prev => prev && prev.id === id ? { ...prev, status: 'pending-approval' as DisposalStatus } : prev);
    toast.success('Finance review completed');
  };

  const handleApprove = (id: string) => {
    setDisposals(prev => prev.map(d => d.id === id ? {
      ...d, status: 'approved' as DisposalStatus, approvalDate: new Date().toISOString(),
      signatures: d.signatures.map(s => s.role === 'approving_authority' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString(), method: 'digital' as const } : s),
      auditTrail: [...d.auditTrail, { id: `at-${Date.now()}`, action: 'Disposal Approved', user: CURRENT_USER, timestamp: new Date().toISOString() }],
    } : d));
    setSelectedDisposal(prev => prev && prev.id === id ? { ...prev, status: 'approved' as DisposalStatus } : prev);
    toast.success('Disposal approved');
  };

  const handleReject = (id: string) => {
    setDisposals(prev => prev.map(d => d.id === id ? {
      ...d, status: 'rejected' as DisposalStatus,
      signatures: d.signatures.map(s => s.role === 'approving_authority' ? { ...s, status: 'declined' as const } : s),
      auditTrail: [...d.auditTrail, { id: `at-${Date.now()}`, action: 'Disposal Rejected', user: CURRENT_USER, timestamp: new Date().toISOString() }],
    } : d));
    setSelectedDisposal(prev => prev && prev.id === id ? { ...prev, status: 'rejected' as DisposalStatus } : prev);
    toast.error('Disposal rejected');
  };

  const handleCompleteDisposal = (id: string) => {
    setDisposals(prev => prev.map(d => d.id === id ? {
      ...d, status: 'completed' as DisposalStatus, actualDisposalDate: new Date().toISOString(),
      signatures: d.signatures.map(s => s.role === 'disposal_officer' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString(), method: 'digital' as const } : s),
      auditTrail: [...d.auditTrail, { id: `at-${Date.now()}`, action: 'Disposal Completed', user: CURRENT_USER, timestamp: new Date().toISOString(), details: 'Assets removed from register' }],
    } : d));
    setSelectedDisposal(prev => prev && prev.id === id ? { ...prev, status: 'completed' as DisposalStatus } : prev);
    toast.success('Disposal completed — assets removed from register');
  };

  const handleCreateSubmit = () => {
    if (!createForm.title || !createForm.disposalMethod || !createForm.justification) {
      toast.error('Please fill in all required fields');
      return;
    }
    const newId = `DSP-2026-${String(disposals.length + 1).padStart(4, '0')}`;
    toast.success(`Disposal request ${newId} created successfully`);
    setCreateDrawerOpen(false);
    setCreateForm({ title: '', justification: '', disposalMethod: '', fieldOffice: '', targetDisposalDate: '', notes: '' });
  };

  // ── Detail View ──
  if (showDetail && selectedDisposal) {
    return <DisposalDetailView
      disposal={selectedDisposal}
      onBack={closeDetail}
      onReview={handleReview}
      onApprove={handleApprove}
      onReject={handleReject}
      onComplete={handleCompleteDisposal}
    />;
  }

  return (
    <div className="space-y-5 min-w-0">
      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatCard label="Total" value={stats.total} icon={<DisposalIcon className="w-5 h-5" />} color="bg-[#121321]" />
        <StatCard label="Pending Review" value={stats.pendingReview} icon={<ClipboardIcon className="w-5 h-5" />} color="bg-cyan-600" />
        <StatCard label="Pending Approval" value={stats.pendingApproval} icon={<HourglassIcon className="w-5 h-5" />} color="bg-amber-600" />
        <StatCard label="Approved" value={stats.approved} icon={<CheckCircle className="w-5 h-5" />} color="bg-blue-600" />
        <StatCard label="In Progress" value={stats.inProgress} icon={<Clock className="w-5 h-5" />} color="bg-amber-600" />
        <StatCard label="Completed" value={stats.completed} icon={<DoneAllIcon className="w-5 h-5" />} color="bg-green-600" />
        <StatCard label="Drafts" value={stats.drafts} icon={<DraftIcon className="w-5 h-5" />} color="bg-gray-500" />
      </div>

      {/* Sub-tabs & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px]">
          {([
            { key: 'all', label: 'All Disposals' },
            { key: 'my-requests', label: 'My Requests' },
            { key: 'pending-approval', label: 'Pending Approval', badge: stats.pendingApproval },
            { key: 'in-progress', label: 'In Progress', badge: stats.inProgress },
          ] as { key: SubView; label: string; badge?: number }[]).map(tab => (
            <button key={tab.key} onClick={() => { setSubView(tab.key); setPage(0); }}
              className={`px-3 py-1.5 rounded-[4px] text-[15px] transition-colors flex items-center gap-1.5 ${
                subView === tab.key ? 'bg-[#121321] text-white shadow-sm' : 'text-[#121321][#121321]/5 dark:text-white'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
        <Button onClick={() => setCreateDrawerOpen(true)} className="gap-1.5 text-[15px]">
          <Plus className="w-4 h-4" /> Request Disposal
        </Button>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search disposal ID, title, requester, office..."
                value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }} className="pl-9 text-[15px]" />
            </div>
            <div className="flex gap-2">
              <Select value={effectiveStatusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }} disabled={isFilterLocked}>
                <SelectTrigger className={`w-[155px] text-[15px] ${isFilterLocked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending-review">Pending Review</SelectItem>
                  <SelectItem value="pending-approval">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={(v) => { setMethodFilter(v); setPage(0); }}>
                <SelectTrigger className="w-[155px] text-[15px]"><SelectValue placeholder="Method" /></SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="auction">Auction</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                  <SelectItem value="scrap">Scrap</SelectItem>
                  <SelectItem value="write-off">Write-Off</SelectItem>
                  <SelectItem value="trade-in">Trade-In</SelectItem>
                  <SelectItem value="recycling">Recycling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredDisposals.length > 0 ? (
            <div className="rounded-md border mx-6 mb-0 overflow-hidden">
              <div className="overflow-auto max-h-[calc(100vh-480px)] scrollbar-hide">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[15px]">Disposal ID</TableHead>
                      <TableHead className="text-[15px]">Method</TableHead>
                      <TableHead className="text-[15px]">Title</TableHead>
                      <TableHead className="text-[15px]">Requested By</TableHead>
                      <TableHead className="text-center text-[15px]">Assets</TableHead>
                      <TableHead className="text-right text-[15px]">Total Value</TableHead>
                      <TableHead className="text-right text-[15px]">Write-Off</TableHead>
                      <TableHead className="text-[15px]">Status</TableHead>
                      <TableHead className="text-[15px]">Signatures</TableHead>
                      <TableHead className="w-20 text-[15px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedData.map(d => (
                      <TableRow key={d.id} className="cursor-pointer/50" onClick={() => openDetail(d)}>
                        <TableCell className="font-['Manrope'] font-medium text-[15px]">{d.disposalId}</TableCell>
                        <TableCell className="text-[15px]">
                          <Badge className={getDisposalMethodColor(d.disposalMethod) + ' text-[10px]'}>{getDisposalMethodLabel(d.disposalMethod)}</Badge>
                        </TableCell>
                        <TableCell className="text-[15px]">
                          <div className="min-w-[160px]"><p className="font-medium truncate max-w-[240px]">{d.title}</p></div>
                        </TableCell>
                        <TableCell className="text-[15px]">{d.requestedBy}</TableCell>
                        <TableCell className="text-center text-[15px]">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted font-medium">{d.assets.length}</span>
                        </TableCell>
                        <TableCell className="text-right font-['Manrope'] text-[15px]">${d.totalAcquisitionValue.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-['Manrope'] text-red-600 text-[15px]">{d.writeOffAmount > 0 ? `$${d.writeOffAmount.toLocaleString()}` : '—'}</TableCell>
                        <TableCell className="text-[15px]">
                          <Badge className={getDisposalStatusColor(d.status) + ' text-[10px] whitespace-nowrap'}>{d.status.replace(/-/g, ' ')}</Badge>
                        </TableCell>
                        <TableCell className="text-[15px]">
                          <SignatureProgress signatures={d.signatures} />
                        </TableCell>
                        <TableCell className="text-[15px]">
                          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openDetail(d); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <TablePagination totalItems={filteredDisposals.length} page={page} rowsPerPage={rowsPerPage} onPageChange={setPage} onRowsPerPageChange={setRowsPerPage} totalUnfilteredItems={disposals.length} itemLabel="disposals" />
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <DisposalIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <h3 className="text-lg mb-1">No disposals found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Request a disposal to get started'}
              </p>
              {searchQuery || statusFilter !== 'all' ? (
                <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setMethodFilter('all'); }}>
                  <FilterIcon className="w-4 h-4 mr-2" /> Clear Filters
                </Button>
              ) : (
                <Button onClick={() => setCreateDrawerOpen(true)}><Plus className="w-4 h-4 mr-2" /> Request Disposal</Button>
              )}
            </div>
          )}
          <div className="h-4" />
        </CardContent>
      </Card>

      {/* Create Disposal Drawer */}
      <Sheet open={createDrawerOpen} onOpenChange={setCreateDrawerOpen}>
        <SheetContent side="right" className="!w-full sm:!max-w-xl overflow-y-auto">
          <SheetHeader className="pr-8">
            <SheetTitle className="text-[15px]">Request Asset Disposal</SheetTitle>
            <SheetDescription className="text-[14px]">Submit a disposal request. Specify assets, method, and justification for review and approval.</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-24 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ClipboardIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Disposal Details</span>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Title <span className="text-destructive">*</span></Label>
                  <Input value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} placeholder="Write-Off: Damaged Equipment" className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">Disposal Method <span className="text-destructive">*</span></Label>
                    <Select value={createForm.disposalMethod} onValueChange={(v) => setCreateForm({ ...createForm, disposalMethod: v })}>
                      <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select method" /></SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                        <SelectItem value="auction">Auction</SelectItem>
                        <SelectItem value="donation">Donation</SelectItem>
                        <SelectItem value="scrap">Scrap</SelectItem>
                        <SelectItem value="write-off">Write-Off</SelectItem>
                        <SelectItem value="trade-in">Trade-In</SelectItem>
                        <SelectItem value="recycling">Recycling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Justification <span className="text-destructive">*</span></Label>
                  <Textarea value={createForm.justification} onChange={(e) => setCreateForm({ ...createForm, justification: e.target.value })}
                    placeholder="Explain why these assets need to be disposed of..." rows={3} className="text-[15px] placeholder:text-[14px]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">Field Office</Label>
                    <Select value={createForm.fieldOffice} onValueChange={(v) => setCreateForm({ ...createForm, fieldOffice: v })}>
                      <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select office" /></SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                        {['Headquarters', 'Regional Office East', 'Regional Office West', 'Field Office North', 'Field Office South'].map(o => (
                          <SelectItem key={o} value={o}>{o}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">Target Disposal Date</Label>
                    <Input type="date" value={createForm.targetDisposalDate} onChange={(e) => setCreateForm({ ...createForm, targetDisposalDate: e.target.value })} className="h-[52px] text-[15px] placeholder:text-[14px]" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Additional Notes</Label>
                  <Textarea value={createForm.notes} onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })} placeholder="Any additional information..." rows={2} className="text-[15px] placeholder:text-[14px]" />
                </div>
              </div>
            </div>
            <Separator />
            <div className="bg-muted/50 rounded-[4px] border p-4">
              <p className="text-[14px] text-muted-foreground mb-2">Disposal Workflow</p>
              <div className="space-y-1 text-[14px] text-muted-foreground">
                <p>1. Request submitted by officer → Finance review</p>
                <p>2. Finance reviews NBV and financial impact</p>
                <p>3. Approving authority reviews and approves/rejects</p>
                <p>4. Disposal officer executes (data wipe, handover, etc.)</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateDrawerOpen(false)} className="text-[15px]">Cancel</Button>
            <Button
              variant="outline"
              onClick={() => {
                toast.success('Disposal request draft saved successfully');
                setCreateDrawerOpen(false);
              }}
              className="text-[15px]"
            >
              Save Draft
            </Button>
            <Button onClick={handleCreateSubmit} className="text-[15px]"><Plus className="w-4 h-4 mr-2" /> Submit Request</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ── Sub-components ──

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-[4px] border bg-background">
      <div className={`w-9 h-9 rounded-[4px] ${color} flex items-center justify-center text-white shrink-0`}>{icon}</div>
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
          <div key={i} className={`w-2 h-2 rounded-full ${s.status === 'signed' ? 'bg-green-500' : s.status === 'declined' ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground">{signed}/{total}</span>
    </div>
  );
}

// ── Detail View ──

interface DetailViewProps {
  disposal: DisposalRequest;
  onBack: () => void;
  onReview: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onComplete: (id: string) => void;
}

function DisposalDetailView({ disposal, onBack, onReview, onApprove, onReject, onComplete }: DetailViewProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'assets' | 'financial' | 'documents' | 'signatures' | 'audit'>('details');
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const formatDateLocal = (d?: string) => d ? new Date(d).toLocaleString() : '—';

  // Overdue: past target disposal date and not completed
  const isOverdue = disposal.status !== 'completed' && disposal.status !== 'cancelled' && disposal.status !== 'rejected' && formatDate(disposal.targetDisposalDate) < formatDate();
  const workflowLabel = disposal.workflowType === 'hq' ? 'HQ Review' : disposal.workflowType === 'field' ? 'Field Review' : 'Local Review';

  return (
    <div className="space-y-5 min-w-0">
      {/* Overdue alert */}
      {isOverdue && (
        <div className="flex items-center gap-3 p-3 rounded-[4px] border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700">
          <AlertBellIcon className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Overdue Disposal</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              This disposal passed its target date ({formatDate(disposal.targetDisposalDate)}) and is still {disposal.status.replace(/-/g, ' ')}. Escalate or complete promptly.
            </p>
          </div>
        </div>
      )}

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
              Asset Disposals
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{disposal.disposalId}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold">{disposal.disposalId}</h2>
            <Badge className={getDisposalStatusColor(disposal.status) + ' text-xs'}>{disposal.status.replace(/-/g, ' ')}</Badge>
            <Badge className={getDisposalMethodColor(disposal.disposalMethod) + ' text-xs'}>{getDisposalMethodLabel(disposal.disposalMethod)}</Badge>
            <Badge className="bg-[#121321]/10 text-[#121321] dark:text-white text-[10px] gap-1">
              <WorkflowIcon className="w-3 h-3" />{workflowLabel}
            </Badge>
            {disposal.assetsLocked && (
              <Badge className="bg-red-500/10 text-red-700 dark:text-red-300 text-[10px] gap-1">
                <LockIcon className="w-3 h-3" />Assets Locked
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Requested by {disposal.requestedBy} · {disposal.assets.length} asset{disposal.assets.length !== 1 ? 's' : ''} · Write-off: ${disposal.writeOffAmount.toLocaleString()}
          </p>
          {disposal.linkedSurveyId && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <LinkIcon className="w-3 h-3" />
              Linked Survey Case: <span className="font-['Manrope'] font-medium text-[#81CCD7]">{disposal.linkedSurveyId}</span>
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {disposal.status === 'pending-review' && (
            <Button onClick={() => onReview(disposal.id)} className="gap-1.5 text-[15px]"><CheckCircle className="w-4 h-4" /> Complete Review</Button>
          )}
          {disposal.status === 'pending-approval' && (
            <>
              <Button onClick={() => onApprove(disposal.id)} className="gap-1.5 text-[15px]"><CheckCircle className="w-4 h-4" /> Approve</Button>
              <Button variant="destructive" onClick={() => onReject(disposal.id)} className="gap-1.5 text-[15px]"><XCircle className="w-4 h-4" /> Reject</Button>
            </>
          )}
          {(disposal.status === 'approved' || disposal.status === 'in-progress') && (
            <Button onClick={() => onComplete(disposal.id)} className="gap-1.5 text-[15px]"><DoneAllIcon className="w-4 h-4" /> Complete Disposal</Button>
          )}
          <Button variant="outline" onClick={() => toast.info('Generating PDF...')} className="gap-1.5 text-[15px]"><Download className="w-4 h-4" /> Download</Button>
          <Button variant="outline" onClick={() => toast.info('Printing...')} className="gap-1.5 text-[15px]"><PrintIcon className="w-4 h-4" /> Print</Button>
        </div>
      </div>

      {/* Rejection */}
      {disposal.status === 'rejected' && (
        <Alert variant="destructive">
          <BlockIcon className="w-4 h-4" />
          <AlertDescription>
            <span className="font-medium">Disposal rejected.</span> {disposal.auditTrail.find(a => a.action === 'Rejected')?.details || 'Contact approving authority for details.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
        {(['details', 'assets', 'financial', 'documents', 'signatures', 'audit'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-[4px] text-[15px] capitalize transition-colors ${
              activeTab === tab ? 'bg-[#121321] text-white shadow-sm' : 'text-[#121321][#121321]/5 dark:text-white'
            }`}>
            {tab === 'audit' ? 'Audit Trail' : tab}
            {tab === 'documents' && disposal.attachments.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] bg-blue-500 text-white">{disposal.attachments.length}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Disposal Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">Requested By</Label><p className="text-sm font-medium">{disposal.requestedBy}</p></div>
                <div><Label className="text-xs text-muted-foreground">Disposal Officer</Label><p className="text-sm font-medium">{disposal.disposalOfficer || '—'}</p></div>
                <div><Label className="text-xs text-muted-foreground">Field Office</Label><p className="text-sm">{disposal.fieldOffice}</p></div>
                {disposal.recipientOrganization && (
                  <div className="col-span-2"><Label className="text-xs text-muted-foreground">Recipient Organization</Label><p className="text-sm">{disposal.recipientOrganization}</p></div>
                )}
                {disposal.auctionReferenceNumber && (
                  <div><Label className="text-xs text-muted-foreground">Auction Reference</Label><p className="text-sm font-['Manrope']">{disposal.auctionReferenceNumber}</p></div>
                )}
              </div>
              <Separator />
              {/* Workflow config & cross-link */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Workflow Process</Label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <WorkflowIcon className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{workflowLabel}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {disposal.workflowType === 'hq' ? 'Follows headquarters review chain with director sign-off' :
                     disposal.workflowType === 'field' ? 'Regional field office process with field manager approval' :
                     'Local approval process with local supervisor sign-off'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Asset Lock Status</Label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <LockIcon className={`w-4 h-4 ${disposal.assetsLocked ? 'text-red-500' : 'text-gray-400'}`} />
                    <p className="text-sm font-medium">{disposal.assetsLocked ? 'Locked — assets cannot be deleted until case resolved' : 'Unlocked'}</p>
                  </div>
                </div>
              </div>
              {disposal.linkedSurveyId && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-xs text-muted-foreground">Linked Survey Case</Label>
                    <div className="flex items-center gap-2 mt-1 p-3 rounded-[4px] border bg-muted/30">
                      <LinkIcon className="w-4 h-4 text-[#81CCD7]" />
                      <span className="font-['Manrope'] text-sm font-medium">{disposal.linkedSurveyId}</span>
                      <span className="text-xs text-muted-foreground">— Survey must be completed before disposal is finalized</span>
                    </div>
                  </div>
                </>
              )}
              <Separator />
              <div><Label className="text-xs text-muted-foreground">Justification</Label><p className="text-sm mt-1">{disposal.justification}</p></div>
              {disposal.notes && <div><Label className="text-xs text-muted-foreground">Notes</Label><p className="text-sm mt-1">{disposal.notes}</p></div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Compliance & Schedule</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Data Wipe Certified</span>
                  <Badge className={disposal.dataWipeCertified ? 'bg-green-500/10 text-green-700' : 'bg-gray-500/10 text-gray-700'}>{disposal.dataWipeCertified ? 'Yes' : 'No'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Environmental Compliance</span>
                  <Badge className={disposal.environmentalCompliance ? 'bg-green-500/10 text-green-700' : 'bg-gray-500/10 text-gray-700'}>{disposal.environmentalCompliance ? 'Yes' : 'No'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Certificate of Destruction</span>
                  <Badge className={disposal.certificateOfDestruction ? 'bg-green-500/10 text-green-700' : 'bg-gray-500/10 text-gray-700'}>{disposal.certificateOfDestruction ? 'Yes' : 'No'}</Badge>
                </div>
              </div>
              <Separator />
              <div><Label className="text-xs text-muted-foreground">Requested Date</Label><p className="text-sm">{formatDate(disposal.requestedDate)}</p></div>
              <div><Label className="text-xs text-muted-foreground">Review Date</Label><p className="text-sm">{formatDate(disposal.reviewDate)}</p></div>
              <div><Label className="text-xs text-muted-foreground">Approval Date</Label><p className="text-sm">{formatDate(disposal.approvalDate)}</p></div>
              <div><Label className="text-xs text-muted-foreground">Target Disposal</Label><p className="text-sm">{formatDate(disposal.targetDisposalDate)}</p></div>
              <div><Label className="text-xs text-muted-foreground">Actual Disposal</Label><p className="text-sm">{formatDate(disposal.actualDisposalDate)}</p></div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'assets' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Assets for Disposal ({disposal.assets.length})</CardTitle></CardHeader>
          <CardContent>
            {disposal.assets.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[15px]">Asset ID</TableHead>
                      <TableHead className="text-[15px]">Name</TableHead>
                      <TableHead className="text-[15px]">Type</TableHead>
                      <TableHead className="text-[15px]">Condition</TableHead>
                      <TableHead className="text-right text-[15px]">Acquisition</TableHead>
                      <TableHead className="text-right text-[15px]">NBV</TableHead>
                      <TableHead className="text-right text-[15px]">Disposal Value</TableHead>
                      <TableHead className="text-[15px]">Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disposal.assets.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="font-['Manrope'] text-[15px]">{a.assetId}</TableCell>
                        <TableCell className="font-medium text-[15px]">{a.name}</TableCell>
                        <TableCell className="text-[15px]">{a.type}</TableCell>
                        <TableCell className="text-[15px]"><Badge variant="outline" className="text-[10px]">{a.condition}</Badge></TableCell>
                        <TableCell className="text-right font-['Manrope'] text-[15px]">${a.acquisitionValue.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-['Manrope'] text-[15px]">${a.currentNBV.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-['Manrope'] text-[15px]">{a.disposalValue > 0 ? `$${a.disposalValue.toLocaleString()}` : '—'}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate text-[15px]">{a.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No assets added to this disposal request yet.</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'financial' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader><CardTitle className="text-base">Financial Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-[4px] border text-center">
                  <p className="text-xs text-muted-foreground">Total Acquisition Value</p>
                  <p className="text-2xl font-bold mt-1">${disposal.totalAcquisitionValue.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-[4px] border text-center">
                  <p className="text-xs text-muted-foreground">Current NBV</p>
                  <p className="text-2xl font-bold mt-1">${disposal.totalNBV.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-[4px] border text-center">
                  <p className="text-xs text-muted-foreground">Expected Disposal Value</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">{disposal.totalDisposalValue > 0 ? `$${disposal.totalDisposalValue.toLocaleString()}` : '$0'}</p>
                </div>
                <div className="p-4 rounded-[4px] border text-center">
                  <p className="text-xs text-muted-foreground">Write-Off Amount</p>
                  <p className="text-2xl font-bold mt-1 text-red-600">${disposal.writeOffAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Asset Value Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {disposal.assets.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-[4px] border">
                    <div>
                      <p className="text-sm font-medium">{a.assetId}</p>
                      <p className="text-xs text-muted-foreground">{a.name}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p>Acq: <span className="font-['Manrope']">${a.acquisitionValue.toLocaleString()}</span></p>
                      <p>NBV: <span className="font-['Manrope']">${a.currentNBV.toLocaleString()}</span></p>
                      <p className="text-green-600">Recv: <span className="font-['Manrope']">${a.disposalValue.toLocaleString()}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'documents' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Documents & Reports</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setUploadDrawerOpen(true)} className="gap-1.5">
                  <UploadIcon className="w-4 h-4" /> Upload Document
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.success('Disposal report generated (pre-filled with asset details, rationale, financial impact, and signature placeholders)')} className="gap-1.5">
                  <FileText className="w-4 h-4" /> Generate Report
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-[4px] border bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Disposal Report</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-generated disposal report pre-filled with asset details, disposal rationale, NBV/write-off calculations, and digital signature/approval placeholders.
              </p>
            </div>
            {disposal.attachments.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Uploaded Documents ({disposal.attachments.length})</p>
                {disposal.attachments.map((fileName, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-[4px] border">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{fileName}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => toast.info(`Downloading ${fileName}...`)}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">No documents uploaded yet. Use the upload button to attach scanned approvals, certificates, or digital files.</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'signatures' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Approval Chain</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disposal.signatures.map((sig, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-[4px] border">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                      sig.status === 'signed' ? 'bg-green-500' : sig.status === 'declined' ? 'bg-red-500' : 'bg-gray-300'
                    }`}>{i + 1}</div>
                    <div>
                      <p className="text-sm font-medium capitalize">{sig.role.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground">{sig.name || 'TBD'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={sig.status === 'signed' ? 'bg-green-500/10 text-green-700' : sig.status === 'declined' ? 'bg-red-500/10 text-red-700' : 'bg-gray-500/10 text-gray-700'}>{sig.status}</Badge>
                    {sig.signedDate && <p className="text-[10px] text-muted-foreground mt-1">{formatDateLocal(sig.signedDate)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Audit Trail</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-0">
              {disposal.auditTrail.map((entry, i) => (
                <div key={entry.id} className="flex gap-3 pb-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${i === 0 ? 'bg-[#EF652B]' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    {i < disposal.auditTrail.length - 1 && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-medium">{entry.action}</p>
                    <p className="text-xs text-muted-foreground">{entry.user} · {formatDateLocal(entry.timestamp)}</p>
                    {entry.details && <p className="text-xs text-muted-foreground mt-0.5">{entry.details}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Upload Drawer */}
      <FileUploadDrawer
        open={uploadDrawerOpen}
        onOpenChange={setUploadDrawerOpen}
        title="Upload Disposal Documents"
        description="Attach supporting documents such as disposal approvals, certificates of destruction, data wipe certificates, or environmental compliance reports."
        referenceId={disposal.disposalId}
        onUploadComplete={(files) => {
          toast.success(`${files.length} document(s) attached to ${disposal.disposalId}`);
        }}
      />
    </div>
  );
}
