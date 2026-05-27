import React, { useState, useMemo } from 'react';
import { formatDate } from '../../utils/dateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TablePagination, paginateData } from '../shared/TablePagination';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Add as Plus,
  Search,
  Visibility as Eye,
  FactCheck as InspectionIcon,
  Person as UserIcon,
  LocationOn as MapPin,
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
  PlayArrow as StartIcon,
  RateReview as ReviewIcon,
  CameraAlt as CameraIcon,
  Print as PrintIcon,
  ChevronLeft,
} from '@mui/icons-material';
import { toast } from 'sonner';
import {
  InspectionRequest,
  InspectionStatus,
  mockInspections,
  getInspectionStatusColor,
  getInspectionTypeLabel,
  getInspectionTypeColor,
  getResultColor,
} from './inspectionTypes';

const CURRENT_USER = 'John Doe';

interface AssetInspectionsProps {
  onDetailViewChange?: (isDetailOpen: boolean) => void;
}

export function AssetInspections({ onDetailViewChange }: AssetInspectionsProps) {
  const [inspections, setInspections] = useState<InspectionRequest[]>(mockInspections);
  type SubView = 'all' | 'my-inspections' | 'pending-review' | 'scheduled';
  const [subView, setSubView] = useState<SubView>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedInspection, setSelectedInspection] = useState<InspectionRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState({
    title: '', description: '', inspectionType: '' as string,
    inspector: '', reviewer: '', fieldOffice: '', location: '',
    scheduledDate: '', dueDate: '',
    checklistItems: [] as Array<{ id: string; description: string; category: string }>,
  });

  // Checklist item input state
  const [newChecklistItem, setNewChecklistItem] = useState({ description: '', category: 'physical' });

  const addChecklistItem = () => {
    if (!newChecklistItem.description.trim()) {
      toast.error('Please enter a checklist item description');
      return;
    }
    const item = {
      id: `cl-${Date.now()}`,
      description: newChecklistItem.description,
      category: newChecklistItem.category,
    };
    setCreateForm({ ...createForm, checklistItems: [...createForm.checklistItems, item] });
    setNewChecklistItem({ description: '', category: 'physical' });
    toast.success('Checklist item added');
  };

  const removeChecklistItem = (id: string) => {
    setCreateForm({ ...createForm, checklistItems: createForm.checklistItems.filter(item => item.id !== id) });
  };

  // Computed filters
  const isFilterLocked = subView === 'pending-review' || subView === 'scheduled';
  const effectiveStatusFilter = subView === 'pending-review' ? 'pending-review'
    : subView === 'scheduled' ? 'scheduled'
    : statusFilter;

  const filteredInspections = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return inspections.filter(ins => {
      const matchesSearch = !q ||
        ins.inspectionId.toLowerCase().includes(q) ||
        ins.title.toLowerCase().includes(q) ||
        ins.inspector.toLowerCase().includes(q) ||
        ins.location.toLowerCase().includes(q) ||
        ins.fieldOffice.toLowerCase().includes(q);
      const matchesStatus = effectiveStatusFilter === 'all' || ins.status === effectiveStatusFilter;
      const matchesType = typeFilter === 'all' || ins.inspectionType === typeFilter;
      if (subView === 'my-inspections') return matchesSearch && matchesStatus && matchesType && ins.inspector === CURRENT_USER;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [inspections, searchQuery, effectiveStatusFilter, typeFilter, subView]);

  const pagedData = paginateData(filteredInspections, page, rowsPerPage);

  const stats = useMemo(() => ({
    total: inspections.length,
    scheduled: inspections.filter(i => i.status === 'scheduled').length,
    inProgress: inspections.filter(i => i.status === 'in-progress').length,
    pendingReview: inspections.filter(i => i.status === 'pending-review').length,
    completed: inspections.filter(i => i.status === 'completed').length,
    failed: inspections.filter(i => i.status === 'failed').length,
    drafts: inspections.filter(i => i.status === 'draft').length,
  }), [inspections]);

  const openDetail = (ins: InspectionRequest) => {
    setSelectedInspection(ins);
    setShowDetail(true);
    onDetailViewChange?.(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedInspection(null);
    onDetailViewChange?.(false);
  };

  const handleStartInspection = (id: string) => {
    setInspections(prev => prev.map(i => i.id === id ? {
      ...i, status: 'in-progress' as InspectionStatus, startedDate: new Date().toISOString(),
      auditTrail: [...i.auditTrail, { id: `at-${Date.now()}`, action: 'Inspection Started', user: CURRENT_USER, timestamp: new Date().toISOString() }],
    } : i));
    setSelectedInspection(prev => prev && prev.id === id ? { ...prev, status: 'in-progress' as InspectionStatus } : prev);
    toast.success('Inspection started');
  };

  const handleCompleteInspection = (id: string) => {
    setInspections(prev => prev.map(i => i.id === id ? {
      ...i, status: 'pending-review' as InspectionStatus, completedDate: new Date().toISOString(),
      signatures: i.signatures.map(s => s.role === 'inspector' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString(), method: 'digital' as const } : s),
      auditTrail: [...i.auditTrail, { id: `at-${Date.now()}`, action: 'Inspection Completed', user: CURRENT_USER, timestamp: new Date().toISOString(), details: 'Submitted for review' }],
    } : i));
    setSelectedInspection(prev => prev && prev.id === id ? { ...prev, status: 'pending-review' as InspectionStatus } : prev);
    toast.success('Inspection completed and submitted for review');
  };

  const handleApproveReview = (id: string) => {
    setInspections(prev => prev.map(i => i.id === id ? {
      ...i, status: 'completed' as InspectionStatus,
      signatures: i.signatures.map(s => s.role === 'reviewer' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString(), method: 'digital' as const } : s),
      auditTrail: [...i.auditTrail, { id: `at-${Date.now()}`, action: 'Review Approved', user: CURRENT_USER, timestamp: new Date().toISOString() }],
    } : i));
    setSelectedInspection(prev => prev && prev.id === id ? { ...prev, status: 'completed' as InspectionStatus } : prev);
    toast.success('Inspection review approved');
  };

  const handleCreateSubmit = () => {
    if (!createForm.title || !createForm.inspectionType || !createForm.inspector) {
      toast.error('Please fill in all required fields');
      return;
    }
    const newId = `INS-2026-${String(inspections.length + 1).padStart(4, '0')}`;
    toast.success(`Inspection ${newId} created successfully`);
    setCreateDrawerOpen(false);
    setCreateForm({ title: '', description: '', inspectionType: '', inspector: '', reviewer: '', fieldOffice: '', location: '', scheduledDate: '', dueDate: '', checklistItems: [] });
  };

  // ── Detail View ──
  if (showDetail && selectedInspection) {
    return <InspectionDetailView
      inspection={selectedInspection}
      onBack={closeDetail}
      onStart={handleStartInspection}
      onComplete={handleCompleteInspection}
      onApproveReview={handleApproveReview}
    />;
  }

  return (
    <div className="space-y-5 min-w-0">
      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatCard label="Total" value={stats.total} icon={<InspectionIcon className="w-5 h-5" />} color="bg-[#121321]" />
        <StatCard label="Scheduled" value={stats.scheduled} icon={<Clock className="w-5 h-5" />} color="bg-blue-600" />
        <StatCard label="In Progress" value={stats.inProgress} icon={<Clock className="w-5 h-5" />} color="bg-amber-600" />
        <StatCard label="Pending Review" value={stats.pendingReview} icon={<ReviewIcon className="w-5 h-5" />} color="bg-purple-600" />
        <StatCard label="Completed" value={stats.completed} icon={<DoneAllIcon className="w-5 h-5" />} color="bg-green-600" />
        <StatCard label="Failed" value={stats.failed} icon={<XCircle className="w-5 h-5" />} color="bg-red-600" />
        <StatCard label="Drafts" value={stats.drafts} icon={<DraftIcon className="w-5 h-5" />} color="bg-gray-500" />
      </div>

      {/* Sub-tabs & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px]">
          {([
            { key: 'all', label: 'All Inspections' },
            { key: 'my-inspections', label: 'My Inspections' },
            { key: 'pending-review', label: 'Pending Review', badge: stats.pendingReview },
            { key: 'scheduled', label: 'Scheduled', badge: stats.scheduled },
          ] as { key: SubView; label: string; badge?: number }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => { setSubView(tab.key); setPage(0); }}
              className={`px-3 py-1.5 rounded-[4px] text-[15px] transition-colors flex items-center gap-1.5 ${
                subView === tab.key
                  ? 'bg-[#121321] text-white shadow-sm'
                  : 'text-[#121321][#121321]/5 dark:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Button onClick={() => setCreateDrawerOpen(true)} className="gap-1.5 text-[15px]">
          <Plus className="w-4 h-4" />
          Schedule Inspection
        </Button>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search inspection ID, title, inspector, location..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                className="pl-9 text-[15px]"
              />
            </div>
            <div className="flex gap-2">
              <Select value={effectiveStatusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }} disabled={isFilterLocked}>
                <SelectTrigger className={`w-[155px] text-[15px] ${isFilterLocked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending-review">Pending Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(0); }}>
                <SelectTrigger className="w-[155px] text-[15px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="spot-check">Spot Check</SelectItem>
                  <SelectItem value="pre-transfer">Pre-Transfer</SelectItem>
                  <SelectItem value="post-incident">Post-Incident</SelectItem>
                  <SelectItem value="regulatory">Regulatory</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredInspections.length > 0 ? (
            <div className="rounded-md border mx-6 mb-0 overflow-hidden">
              <div className="overflow-auto max-h-[calc(100vh-480px)] scrollbar-hide">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[15px]">Inspection ID</TableHead>
                      <TableHead className="text-[15px]">Type</TableHead>
                      <TableHead className="text-[15px]">Title</TableHead>
                      <TableHead className="text-[15px]">Inspector</TableHead>
                      <TableHead className="text-[15px]">Location</TableHead>
                      <TableHead className="text-center text-[15px]">Assets</TableHead>
                      <TableHead className="text-[15px]">Status</TableHead>
                      <TableHead className="text-[15px]">Result</TableHead>
                      <TableHead className="text-[15px]">Due Date</TableHead>
                      <TableHead className="w-20 text-[15px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedData.map(ins => (
                      <TableRow key={ins.id} className="cursor-pointer/50" onClick={() => openDetail(ins)}>
                        <TableCell className="font-['Manrope'] font-medium text-[15px]">{ins.inspectionId}</TableCell>
                        <TableCell className="text-[15px]">
                          <Badge className={getInspectionTypeColor(ins.inspectionType) + ' text-[10px]'}>
                            {getInspectionTypeLabel(ins.inspectionType)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[15px]">
                          <div className="min-w-[160px]">
                            <p className="font-medium truncate max-w-[240px]">{ins.title}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-[15px]">{ins.inspector}</TableCell>
                        <TableCell className="text-[15px]">
                          <div className="min-w-[100px]">
                            <p className="truncate">{ins.location}</p>
                            <p className="text-xs text-muted-foreground">{ins.fieldOffice}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-[15px]">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted font-medium">
                            {ins.assets.length}
                          </span>
                        </TableCell>
                        <TableCell className="text-[15px]">
                          <Badge className={getInspectionStatusColor(ins.status) + ' text-[10px] whitespace-nowrap'}>
                            {ins.status.replace(/-/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[15px]">
                          <Badge className={getResultColor(ins.result) + ' text-[10px] whitespace-nowrap'}>
                            {ins.result.replace(/-/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap text-[15px]">
                          {formatDate(ins.dueDate)}
                        </TableCell>
                        <TableCell className="text-[15px]">
                          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openDetail(ins); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <TablePagination
                totalItems={filteredInspections.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                totalUnfilteredItems={inspections.length}
                itemLabel="inspections"
              />
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <InspectionIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <h3 className="text-lg mb-1">No inspections found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Schedule an inspection to get started'}
              </p>
              {searchQuery || statusFilter !== 'all' ? (
                <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setTypeFilter('all'); }}>
                  <FilterIcon className="w-4 h-4 mr-2" /> Clear Filters
                </Button>
              ) : (
                <Button onClick={() => setCreateDrawerOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Schedule Inspection
                </Button>
              )}
            </div>
          )}
          <div className="h-4" />
        </CardContent>
      </Card>

      {/* ── Create Inspection Drawer ── */}
      <Sheet open={createDrawerOpen} onOpenChange={setCreateDrawerOpen}>
        <SheetContent side="right" className="!w-full sm:!max-w-xl flex flex-col overflow-hidden p-0">
          <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
            <SheetTitle className="text-[15px]">Schedule New Inspection</SheetTitle>
            <SheetDescription className="text-[14px]">
              Create a new asset inspection. Assign an inspector, define scope, and set the schedule.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ClipboardIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Inspection Details</span>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Title <span className="text-destructive">*</span></Label>
                  <Input value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} placeholder="Q1 Server Room Inspection" className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">Type <span className="text-destructive">*</span></Label>
                    <Select value={createForm.inspectionType} onValueChange={(v) => setCreateForm({ ...createForm, inspectionType: v })}>
                      <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="spot-check">Spot Check</SelectItem>
                        <SelectItem value="pre-transfer">Pre-Transfer</SelectItem>
                        <SelectItem value="post-incident">Post-Incident</SelectItem>
                        <SelectItem value="regulatory">Regulatory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Description</Label>
                  <Textarea value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} placeholder="Describe the scope and objectives..." rows={3} className="text-[15px] placeholder:text-[14px]" />
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Assignment</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">Inspector <span className="text-destructive">*</span></Label>
                    <Select value={createForm.inspector} onValueChange={(v) => setCreateForm({ ...createForm, inspector: v })}>
                      <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select inspector" /></SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                        {['John Doe', 'Jane Smith', 'Bob Wilson', 'Sarah Chen', 'Mike Torres', 'Emily Davis'].map(n => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">Reviewer</Label>
                    <Select value={createForm.reviewer} onValueChange={(v) => setCreateForm({ ...createForm, reviewer: v })}>
                      <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select reviewer" /></SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                        {['IT Director', 'Admin Manager', 'Operations Manager', 'Compliance Officer'].map(n => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Location & Schedule</span>
              </div>
              <div className="space-y-4">
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
                    <Label className="text-[15px] font-medium">Location</Label>
                    <Select value={createForm.location} onValueChange={(v) => setCreateForm({ ...createForm, location: v })}>
                      <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select location" /></SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                        {['Office Floor 1', 'Office Floor 2', 'Server Room B2', 'Warehouse B1', 'Warehouse B2', 'Main Building'].map(l => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">Scheduled Date</Label>
                    <Input type="datetime-local" value={createForm.scheduledDate} onChange={(e) => setCreateForm({ ...createForm, scheduledDate: e.target.value })} className="h-[52px] text-[15px] placeholder:text-[14px]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">Due Date</Label>
                    <Input type="datetime-local" value={createForm.dueDate} onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })} className="h-[52px] text-[15px] placeholder:text-[14px]" />
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ClipboardIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Checklist</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">Description</Label>
                    <Input value={newChecklistItem.description} onChange={(e) => setNewChecklistItem({ ...newChecklistItem, description: e.target.value })} placeholder="Enter checklist item description" className="h-[52px] text-[15px] placeholder:text-[14px]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">Category</Label>
                    <Select value={newChecklistItem.category} onValueChange={(v) => setNewChecklistItem({ ...newChecklistItem, category: v })}>
                      <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                        <SelectItem value="physical">Physical</SelectItem>
                        <SelectItem value="functional">Functional</SelectItem>
                        <SelectItem value="documentary">Documentary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={addChecklistItem} className="gap-1.5 text-[15px]">
                    <Plus className="w-4 h-4" /> Add Item
                  </Button>
                </div>
                {createForm.checklistItems.length > 0 && (
                  <div className="space-y-2">
                    {createForm.checklistItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-[4px] border">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-5 h-5 rounded-[2px] border-2 flex items-center justify-center bg-gray-300 dark:bg-gray-600 shrink-0">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm flex-1 min-w-0 truncate">{item.description}</span>
                          <span className="text-xs text-muted-foreground capitalize shrink-0">{item.category}</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => removeChecklistItem(item.id)} className="gap-1.5 ml-2 shrink-0">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="border-t px-6 py-4 shrink-0 bg-background">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateDrawerOpen(false)} className="text-[15px]">Cancel</Button>
              <Button
                variant="outline"
                onClick={() => {
                  toast.success('Inspection draft saved successfully');
                  setCreateDrawerOpen(false);
                }}
                className="text-[15px]"
              >
                Save Draft
              </Button>
              <Button onClick={handleCreateSubmit} className="text-[15px]">
                <Plus className="w-4 h-4 mr-2" />Schedule Inspection
              </Button>
            </div>
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
          <div key={i} className={`w-2 h-2 rounded-full ${s.status === 'signed' ? 'bg-green-500' : s.status === 'declined' ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground">{signed}/{total}</span>
    </div>
  );
}

// ── Detail View ──

interface DetailViewProps {
  inspection: InspectionRequest;
  onBack: () => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onApproveReview: (id: string) => void;
}

function InspectionDetailView({ inspection, onBack, onStart, onComplete, onApproveReview }: DetailViewProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'assets' | 'checklist' | 'signatures' | 'audit'>('details');
  const formatDateLocal = (d?: string) => d ? new Date(d).toLocaleString() : '—';

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
              Asset Inspections
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{inspection.inspectionId}</span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{inspection.inspectionId}</h2>
            <Badge className={getInspectionStatusColor(inspection.status) + ' text-xs'}>{inspection.status.replace(/-/g, ' ')}</Badge>
            <Badge className={getInspectionTypeColor(inspection.inspectionType) + ' text-xs'}>{getInspectionTypeLabel(inspection.inspectionType)}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {inspection.title} · Inspector: {inspection.inspector} · {inspection.assets.length} asset{inspection.assets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {inspection.status === 'scheduled' && (
            <Button onClick={() => onStart(inspection.id)} className="gap-1.5 text-[15px]"><StartIcon className="w-4 h-4" /> Start Inspection</Button>
          )}
          {inspection.status === 'in-progress' && (
            <Button onClick={() => onComplete(inspection.id)} className="gap-1.5 text-[15px]"><CheckCircle className="w-4 h-4" /> Complete & Submit</Button>
          )}
          {inspection.status === 'pending-review' && (
            <Button onClick={() => onApproveReview(inspection.id)} className="gap-1.5 text-[15px]"><DoneAllIcon className="w-4 h-4" /> Approve Review</Button>
          )}
          <Button variant="outline" onClick={() => toast.info('Generating PDF...')} className="gap-1.5 text-[15px]"><Download className="w-4 h-4" /> Download</Button>
          <Button variant="outline" onClick={() => toast.info('Printing...')} className="gap-1.5 text-[15px]"><PrintIcon className="w-4 h-4" /> Print</Button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
        {(['details', 'assets', 'checklist', 'signatures', 'audit'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-[4px] text-[15px] capitalize transition-colors ${
              activeTab === tab ? 'bg-[#121321] text-white shadow-sm' : 'text-[#121321][#121321]/5 dark:text-white'
            }`}>
            {tab === 'audit' ? 'Audit Trail' : tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Inspection Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">Inspector</Label><p className="text-sm font-medium">{inspection.inspector}</p></div>
                <div><Label className="text-xs text-muted-foreground">Reviewer</Label><p className="text-sm font-medium">{inspection.reviewer}</p></div>
                <div><Label className="text-xs text-muted-foreground">Field Office</Label><p className="text-sm">{inspection.fieldOffice}</p></div>
                <div><Label className="text-xs text-muted-foreground">Location</Label><p className="text-sm">{inspection.location}</p></div>
                <div><Label className="text-xs text-muted-foreground">Photos</Label><p className="text-sm">{inspection.photosAttached} attached</p></div>
              </div>
              <Separator />
              <div><Label className="text-xs text-muted-foreground">Description</Label><p className="text-sm mt-1">{inspection.description || '—'}</p></div>
              {inspection.overallFindings && (
                <div><Label className="text-xs text-muted-foreground">Overall Findings</Label><p className="text-sm mt-1">{inspection.overallFindings}</p></div>
              )}
              {inspection.recommendations && (
                <div><Label className="text-xs text-muted-foreground">Recommendations</Label><p className="text-sm mt-1">{inspection.recommendations}</p></div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Schedule</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label className="text-xs text-muted-foreground">Scheduled</Label><p className="text-sm">{formatDate(inspection.scheduledDate)}</p></div>
              <div><Label className="text-xs text-muted-foreground">Due Date</Label><p className="text-sm">{formatDate(inspection.dueDate)}</p></div>
              <div><Label className="text-xs text-muted-foreground">Started</Label><p className="text-sm">{formatDate(inspection.startedDate)}</p></div>
              <div><Label className="text-xs text-muted-foreground">Completed</Label><p className="text-sm">{formatDate(inspection.completedDate)}</p></div>
              <Separator />
              <div><Label className="text-xs text-muted-foreground">Result</Label>
                <Badge className={getResultColor(inspection.result) + ' mt-1'}>{inspection.result.replace(/-/g, ' ')}</Badge>
              </div>
              <div><Label className="text-xs text-muted-foreground">Checklist Progress</Label>
                <p className="text-sm">{inspection.checklist.filter(c => c.checked).length}/{inspection.checklist.length} items completed</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'assets' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Inspected Assets ({inspection.assets.length})</CardTitle></CardHeader>
          <CardContent>
            {inspection.assets.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[15px]">Asset ID</TableHead>
                      <TableHead className="text-[15px]">Name</TableHead>
                      <TableHead className="text-[15px]">Type</TableHead>
                      <TableHead className="text-[15px]">Location</TableHead>
                      <TableHead className="text-[15px]">Condition</TableHead>
                      <TableHead className="text-[15px]">Result</TableHead>
                      <TableHead className="text-[15px]">Findings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspection.assets.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="font-['Manrope'] text-[15px]">{a.assetId}</TableCell>
                        <TableCell className="font-medium text-[15px]">{a.name}</TableCell>
                        <TableCell className="text-[15px]">{a.type}</TableCell>
                        <TableCell className="text-[15px]">{a.currentLocation}</TableCell>
                        <TableCell className="text-[15px]"><Badge variant="outline" className="text-[10px]">{a.condition}</Badge></TableCell>
                        <TableCell className="text-[15px]"><Badge className={getResultColor(a.result) + ' text-[10px]'}>{a.result.replace(/-/g, ' ')}</Badge></TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate text-[15px]">{a.findings || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No assets assigned to this inspection yet.</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'checklist' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Inspection Checklist</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inspection.checklist.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-[4px] border">
                  <div className={`w-5 h-5 rounded-[2px] border-2 flex items-center justify-center ${item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                    {item.checked && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}>{item.label}</span>
                  {item.notes && <span className="text-xs text-muted-foreground">{item.notes}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'signatures' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Signatures</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inspection.signatures.map((sig, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-[4px] border">
                  <div>
                    <p className="text-sm font-medium capitalize">{sig.role.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">{sig.name}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={sig.status === 'signed' ? 'bg-green-500/10 text-green-700' : sig.status === 'declined' ? 'bg-red-500/10 text-red-700' : 'bg-gray-500/10 text-gray-700'}>
                      {sig.status}
                    </Badge>
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
              {inspection.auditTrail.map((entry, i) => (
                <div key={entry.id} className="flex gap-3 pb-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${i === 0 ? 'bg-[#EF652B]' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    {i < inspection.auditTrail.length - 1 && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />}
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
    </div>
  );
}
