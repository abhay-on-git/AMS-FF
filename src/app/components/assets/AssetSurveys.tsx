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
import { Progress } from '../ui/progress';
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
  Inventory as SurveyIcon,
  Person as UserIcon,
  LocationOn as MapPin,
  Download,
  CheckCircle,
  Warning as AlertCircle,
  Schedule as Clock,
  Assignment as ClipboardIcon,
  ArrowBack,
  FilterList as FilterIcon,
  DoneAll as DoneAllIcon,
  HourglassEmpty as HourglassIcon,
  EditNote as DraftIcon,
  PlayArrow as StartIcon,
  CompareArrows as ReconcileIcon,
  Print as PrintIcon,
  Groups as TeamIcon,
  ReportProblem as DiscrepancyIcon,
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
  SurveyRequest,
  SurveyStatus,
  mockSurveys,
  getSurveyStatusColor,
  getSurveyTypeLabel,
  getSurveyTypeColor,
  getDiscrepancyColor,
} from './surveyTypes';

const CURRENT_USER = 'John Doe';

interface AssetSurveysProps {
  onDetailViewChange?: (isDetailOpen: boolean) => void;
}

export function AssetSurveys({ onDetailViewChange }: AssetSurveysProps) {
  const [surveys, setSurveys] = useState<SurveyRequest[]>(mockSurveys);
  type SubView = 'all' | 'my-surveys' | 'in-progress' | 'pending-approval';
  const [subView, setSubView] = useState<SubView>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedSurvey, setSelectedSurvey] = useState<SurveyRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  const [createForm, setCreateForm] = useState({
    title: '', description: '', surveyType: '' as string,
    teamLead: '', fieldOffice: '', scope: '',
    plannedStartDate: '', plannedEndDate: '',
  });

  const isFilterLocked = subView === 'in-progress' || subView === 'pending-approval';
  const effectiveStatusFilter = subView === 'in-progress' ? 'in-progress'
    : subView === 'pending-approval' ? 'pending-approval'
    : statusFilter;

  const filteredSurveys = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return surveys.filter(sv => {
      const matchesSearch = !q ||
        sv.surveyId.toLowerCase().includes(q) ||
        sv.title.toLowerCase().includes(q) ||
        sv.surveyTeamLead.toLowerCase().includes(q) ||
        sv.fieldOffice.toLowerCase().includes(q) ||
        sv.targetLocations.some(l => l.toLowerCase().includes(q));
      const matchesStatus = effectiveStatusFilter === 'all' || sv.status === effectiveStatusFilter;
      const matchesType = typeFilter === 'all' || sv.surveyType === typeFilter;
      if (subView === 'my-surveys') return matchesSearch && matchesStatus && matchesType && (sv.surveyTeamLead === CURRENT_USER || sv.surveyors.includes(CURRENT_USER));
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [surveys, searchQuery, effectiveStatusFilter, typeFilter, subView]);

  const pagedData = paginateData(filteredSurveys, page, rowsPerPage);

  const stats = useMemo(() => ({
    total: surveys.length,
    planned: surveys.filter(s => s.status === 'planned').length,
    inProgress: surveys.filter(s => s.status === 'in-progress').length,
    reconciliation: surveys.filter(s => s.status === 'reconciliation').length,
    pendingApproval: surveys.filter(s => s.status === 'pending-approval').length,
    completed: surveys.filter(s => s.status === 'completed').length,
    drafts: surveys.filter(s => s.status === 'draft').length,
  }), [surveys]);

  const openDetail = (sv: SurveyRequest) => {
    setSelectedSurvey(sv);
    setShowDetail(true);
    onDetailViewChange?.(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedSurvey(null);
    onDetailViewChange?.(false);
  };

  const handleStartSurvey = (id: string) => {
    setSurveys(prev => prev.map(s => s.id === id ? {
      ...s, status: 'in-progress' as SurveyStatus, actualStartDate: new Date().toISOString(),
      auditTrail: [...s.auditTrail, { id: `at-${Date.now()}`, action: 'Survey Started', user: CURRENT_USER, timestamp: new Date().toISOString() }],
    } : s));
    setSelectedSurvey(prev => prev && prev.id === id ? { ...prev, status: 'in-progress' as SurveyStatus } : prev);
    toast.success('Survey started');
  };

  const handleSubmitForReconciliation = (id: string) => {
    setSurveys(prev => prev.map(s => s.id === id ? {
      ...s, status: 'reconciliation' as SurveyStatus,
      auditTrail: [...s.auditTrail, { id: `at-${Date.now()}`, action: 'Submitted for Reconciliation', user: CURRENT_USER, timestamp: new Date().toISOString() }],
    } : s));
    setSelectedSurvey(prev => prev && prev.id === id ? { ...prev, status: 'reconciliation' as SurveyStatus } : prev);
    toast.success('Survey submitted for reconciliation');
  };

  const handleSubmitForApproval = (id: string) => {
    setSurveys(prev => prev.map(s => s.id === id ? {
      ...s, status: 'pending-approval' as SurveyStatus,
      signatures: s.signatures.map(sig => sig.role === 'surveyor' || sig.role === 'team_lead' ? { ...sig, status: 'signed' as const, signedDate: new Date().toISOString(), method: 'digital' as const } : sig),
      auditTrail: [...s.auditTrail, { id: `at-${Date.now()}`, action: 'Submitted for Approval', user: CURRENT_USER, timestamp: new Date().toISOString() }],
    } : s));
    setSelectedSurvey(prev => prev && prev.id === id ? { ...prev, status: 'pending-approval' as SurveyStatus } : prev);
    toast.success('Survey submitted for approval');
  };

  const handleApprove = (id: string) => {
    setSurveys(prev => prev.map(s => s.id === id ? {
      ...s, status: 'completed' as SurveyStatus, actualEndDate: new Date().toISOString(),
      signatures: s.signatures.map(sig => sig.role === 'approver' ? { ...sig, status: 'signed' as const, signedDate: new Date().toISOString(), method: 'digital' as const } : sig),
      auditTrail: [...s.auditTrail, { id: `at-${Date.now()}`, action: 'Survey Approved', user: CURRENT_USER, timestamp: new Date().toISOString() }],
    } : s));
    setSelectedSurvey(prev => prev && prev.id === id ? { ...prev, status: 'completed' as SurveyStatus } : prev);
    toast.success('Survey approved and completed');
  };

  const handleCreateSubmit = () => {
    if (!createForm.title || !createForm.surveyType || !createForm.teamLead) {
      toast.error('Please fill in all required fields');
      return;
    }
    const newId = `SRV-2026-${String(surveys.length + 1).padStart(4, '0')}`;
    toast.success(`Survey ${newId} created successfully`);
    setCreateDrawerOpen(false);
    setCreateForm({ title: '', description: '', surveyType: '', teamLead: '', fieldOffice: '', scope: '', plannedStartDate: '', plannedEndDate: '' });
  };

  // ── Detail View ──
  if (showDetail && selectedSurvey) {
    return <SurveyDetailView
      survey={selectedSurvey}
      onBack={closeDetail}
      onStart={handleStartSurvey}
      onReconcile={handleSubmitForReconciliation}
      onSubmitApproval={handleSubmitForApproval}
      onApprove={handleApprove}
    />;
  }

  return (
    <div className="space-y-5 min-w-0">
      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatCard label="Total" value={stats.total} icon={<SurveyIcon className="w-5 h-5" />} color="bg-[#121321]" />
        <StatCard label="Planned" value={stats.planned} icon={<Clock className="w-5 h-5" />} color="bg-blue-600" />
        <StatCard label="In Progress" value={stats.inProgress} icon={<Clock className="w-5 h-5" />} color="bg-amber-600" />
        <StatCard label="Reconciliation" value={stats.reconciliation} icon={<ReconcileIcon className="w-5 h-5" />} color="bg-purple-600" />
        <StatCard label="Pending Approval" value={stats.pendingApproval} icon={<HourglassIcon className="w-5 h-5" />} color="bg-orange-600" />
        <StatCard label="Completed" value={stats.completed} icon={<DoneAllIcon className="w-5 h-5" />} color="bg-green-600" />
        <StatCard label="Drafts" value={stats.drafts} icon={<DraftIcon className="w-5 h-5" />} color="bg-gray-500" />
      </div>

      {/* Sub-tabs & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px]">
          {([
            { key: 'all', label: 'All Surveys' },
            { key: 'my-surveys', label: 'My Surveys' },
            { key: 'in-progress', label: 'In Progress', badge: stats.inProgress },
            { key: 'pending-approval', label: 'Pending Approval', badge: stats.pendingApproval },
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
          <Plus className="w-4 h-4" /> Plan Survey
        </Button>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search survey ID, title, team lead, location..." value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }} className="pl-9 text-[15px]" />
            </div>
            <div className="flex gap-2">
              <Select value={effectiveStatusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }} disabled={isFilterLocked}>
                <SelectTrigger className={`w-[155px] text-[15px] ${isFilterLocked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="reconciliation">Reconciliation</SelectItem>
                  <SelectItem value="pending-approval">Pending Approval</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(0); }}>
                <SelectTrigger className="w-[155px] text-[15px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-count">Full Count</SelectItem>
                  <SelectItem value="sample-based">Sample-Based</SelectItem>
                  <SelectItem value="location-based">Location-Based</SelectItem>
                  <SelectItem value="custodian-based">Custodian-Based</SelectItem>
                  <SelectItem value="high-value">High-Value</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSurveys.length > 0 ? (
            <div className="rounded-md border mx-6 mb-0 overflow-hidden">
              <div className="overflow-auto max-h-[calc(100vh-480px)] scrollbar-hide">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[15px]">Survey ID</TableHead>
                      <TableHead className="text-[15px]">Type</TableHead>
                      <TableHead className="text-[15px]">Title</TableHead>
                      <TableHead className="text-[15px]">Team Lead</TableHead>
                      <TableHead className="text-[15px]">Locations</TableHead>
                      <TableHead className="text-[15px]">Status</TableHead>
                      <TableHead className="text-[15px]">Discrepancies</TableHead>
                      <TableHead className="text-[15px]">Dates</TableHead>
                      <TableHead className="w-20 text-[15px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedData.map(sv => (
                      <TableRow key={sv.id} className="cursor-pointer/50" onClick={() => openDetail(sv)}>
                        <TableCell className="font-['Manrope'] font-medium text-[15px]">{sv.surveyId}</TableCell>
                        <TableCell className="text-[15px]">
                          <Badge className={getSurveyTypeColor(sv.surveyType) + ' text-[10px]'}>{getSurveyTypeLabel(sv.surveyType)}</Badge>
                        </TableCell>
                        <TableCell className="text-[15px]">
                          <div className="min-w-[160px]"><p className="font-medium truncate max-w-[240px]">{sv.title}</p></div>
                        </TableCell>
                        <TableCell className="text-[15px]">{sv.surveyTeamLead}</TableCell>
                        <TableCell className="text-[15px]">
                          <div className="min-w-[100px]">
                            <p className="truncate">{sv.targetLocations[0]}</p>
                            {sv.targetLocations.length > 1 && <p className="text-xs text-muted-foreground">+{sv.targetLocations.length - 1} more</p>}
                          </div>
                        </TableCell>
                        <TableCell className="text-[15px]">
                          <Badge className={getSurveyStatusColor(sv.status) + ' text-[10px] whitespace-nowrap'}>{sv.status.replace(/-/g, ' ')}</Badge>
                        </TableCell>
                        <TableCell className="text-[15px]">
                          {sv.totalDiscrepancies > 0 ? (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <AlertCircle className="w-3.5 h-3.5" />{sv.totalDiscrepancies}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap text-[15px]">
                          {formatDate(sv.plannedStartDate)}
                        </TableCell>
                        <TableCell className="text-[15px]">
                          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openDetail(sv); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <TablePagination totalItems={filteredSurveys.length} page={page} rowsPerPage={rowsPerPage} onPageChange={setPage} onRowsPerPageChange={setRowsPerPage} totalUnfilteredItems={surveys.length} itemLabel="surveys" />
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <SurveyIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <h3 className="text-lg mb-1">No surveys found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Plan a survey to get started'}
              </p>
              {searchQuery || statusFilter !== 'all' ? (
                <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setTypeFilter('all'); }}>
                  <FilterIcon className="w-4 h-4 mr-2" /> Clear Filters
                </Button>
              ) : (
                <Button onClick={() => setCreateDrawerOpen(true)}><Plus className="w-4 h-4 mr-2" /> Plan Survey</Button>
              )}
            </div>
          )}
          <div className="h-4" />
        </CardContent>
      </Card>

      {/* Create Survey Drawer */}
      <Sheet open={createDrawerOpen} onOpenChange={setCreateDrawerOpen}>
        <SheetContent side="right" className="!w-full sm:!max-w-xl overflow-y-auto">
          <SheetHeader className="pr-8">
            <SheetTitle className="text-[15px]">Plan New Survey</SheetTitle>
            <SheetDescription className="text-[14px]">Create a physical verification survey. Define scope, assign a team, and set the schedule.</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-24 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ClipboardIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Survey Details</span>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Title <span className="text-destructive">*</span></Label>
                  <Input value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} placeholder="Annual Full Count - HQ" className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">Type <span className="text-destructive">*</span></Label>
                    <Select value={createForm.surveyType} onValueChange={(v) => setCreateForm({ ...createForm, surveyType: v })}>
                      <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                        <SelectItem value="full-count">Full Count</SelectItem>
                        <SelectItem value="sample-based">Sample-Based</SelectItem>
                        <SelectItem value="location-based">Location-Based</SelectItem>
                        <SelectItem value="custodian-based">Custodian-Based</SelectItem>
                        <SelectItem value="high-value">High-Value</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Description</Label>
                  <Textarea value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} placeholder="Describe the purpose and scope..." rows={3} className="text-[15px] placeholder:text-[14px]" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Scope</Label>
                  <Input value={createForm.scope} onChange={(e) => setCreateForm({ ...createForm, scope: e.target.value })} placeholder="e.g., All IT assets at HQ" className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TeamIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Team & Location</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">Team Lead <span className="text-destructive">*</span></Label>
                    <Select value={createForm.teamLead} onValueChange={(v) => setCreateForm({ ...createForm, teamLead: v })}>
                      <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select lead" /></SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                        {['John Doe', 'Jane Smith', 'Bob Wilson', 'Sarah Chen', 'Mike Torres', 'Emily Davis', 'Lisa Park', 'David Lee'].map(n => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">Start Date</Label>
                    <Input type="datetime-local" value={createForm.plannedStartDate} onChange={(e) => setCreateForm({ ...createForm, plannedStartDate: e.target.value })} className="h-[52px] text-[15px] placeholder:text-[14px]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">End Date</Label>
                    <Input type="datetime-local" value={createForm.plannedEndDate} onChange={(e) => setCreateForm({ ...createForm, plannedEndDate: e.target.value })} className="h-[52px] text-[15px] placeholder:text-[14px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateDrawerOpen(false)} className="text-[15px]">Cancel</Button>
            <Button
              variant="outline"
              onClick={() => {
                toast.success('Survey draft saved successfully');
                setCreateDrawerOpen(false);
              }}
              className="text-[15px]"
            >
              Save Draft
            </Button>
            <Button onClick={handleCreateSubmit} className="text-[15px]"><Plus className="w-4 h-4 mr-2" /> Plan Survey</Button>
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

// ── Detail View ──

interface DetailViewProps {
  survey: SurveyRequest;
  onBack: () => void;
  onStart: (id: string) => void;
  onReconcile: (id: string) => void;
  onSubmitApproval: (id: string) => void;
  onApprove: (id: string) => void;
}

function SurveyDetailView({ survey, onBack, onStart, onReconcile, onSubmitApproval, onApprove }: DetailViewProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'assets' | 'discrepancies' | 'documents' | 'signatures' | 'audit'>('details');
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const formatDateLocal = (d?: string) => d ? new Date(d).toLocaleString() : '—';
  const discrepancies = survey.assets.filter(a => a.discrepancy);

  // Overdue threshold: flag if past planned end date and not completed
  const isOverdue = survey.status !== 'completed' && survey.status !== 'cancelled' && formatDate(survey.plannedEndDate) < formatDate();
  const workflowLabel = survey.workflowType === 'hq' ? 'HQ Review' : survey.workflowType === 'field' ? 'Field Review' : 'Local Review';

  return (
    <div className="space-y-5 min-w-0">
      {/* Overdue alert */}
      {isOverdue && (
        <div className="flex items-center gap-3 p-3 rounded-[4px] border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700">
          <AlertBellIcon className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Overdue Survey</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              This survey passed its planned end date ({formatDate(survey.plannedEndDate)}) and is still {survey.status.replace(/-/g, ' ')}. Escalate or complete promptly.
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
              Asset Surveys
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{survey.surveyId}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold">{survey.surveyId}</h2>
            <Badge className={getSurveyStatusColor(survey.status) + ' text-xs'}>{survey.status.replace(/-/g, ' ')}</Badge>
            <Badge className={getSurveyTypeColor(survey.surveyType) + ' text-xs'}>{getSurveyTypeLabel(survey.surveyType)}</Badge>
            <Badge className="bg-[#121321]/10 text-[#121321] dark:text-white text-[10px] gap-1">
              <WorkflowIcon className="w-3 h-3" />{workflowLabel}
            </Badge>
            {survey.assetsLocked && (
              <Badge className="bg-red-500/10 text-red-700 dark:text-red-300 text-[10px] gap-1">
                <LockIcon className="w-3 h-3" />Assets Locked
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {survey.title} · Lead: {survey.surveyTeamLead} · {survey.totalVerified}/{survey.totalExpected} verified
          </p>
          {survey.linkedDisposalId && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <LinkIcon className="w-3 h-3" />
              Linked to Disposal Case: <span className="font-['Manrope'] font-medium text-[#EF652B]">{survey.linkedDisposalId}</span>
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {survey.status === 'planned' && (
            <Button onClick={() => onStart(survey.id)} className="gap-1.5 text-[15px]"><StartIcon className="w-4 h-4" /> Start Survey</Button>
          )}
          {survey.status === 'in-progress' && (
            <Button onClick={() => onReconcile(survey.id)} className="gap-1.5 text-[15px]"><ReconcileIcon className="w-4 h-4" /> Submit for Reconciliation</Button>
          )}
          {survey.status === 'reconciliation' && (
            <Button onClick={() => onSubmitApproval(survey.id)} className="gap-1.5 text-[15px]"><CheckCircle className="w-4 h-4" /> Submit for Approval</Button>
          )}
          {survey.status === 'pending-approval' && (
            <Button onClick={() => onApprove(survey.id)} className="gap-1.5 text-[15px]"><DoneAllIcon className="w-4 h-4" /> Approve</Button>
          )}
          <Button variant="outline" onClick={() => toast.info('Generating PDF...')} className="gap-1.5 text-[15px]"><Download className="w-4 h-4" /> Download</Button>
          <Button variant="outline" onClick={() => toast.info('Printing...')} className="gap-1.5 text-[15px]"><PrintIcon className="w-4 h-4" /> Print</Button>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
        {(['details', 'assets', 'discrepancies', 'documents', 'signatures', 'audit'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-[4px] text-[15px] capitalize transition-colors ${
              activeTab === tab ? 'bg-[#121321] text-white shadow-sm' : 'text-[#121321][#121321]/5 dark:text-white'
            }`}>
            {tab === 'audit' ? 'Audit Trail' : tab}
            {tab === 'discrepancies' && discrepancies.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] bg-red-500 text-white">{discrepancies.length}</span>
            )}
            {tab === 'documents' && survey.attachments.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] bg-blue-500 text-white">{survey.attachments.length}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Survey Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">Team Lead</Label><p className="text-sm font-medium">{survey.surveyTeamLead}</p></div>
                <div><Label className="text-xs text-muted-foreground">Surveyors</Label><p className="text-sm">{survey.surveyors.join(', ')}</p></div>
                <div><Label className="text-xs text-muted-foreground">Field Office</Label><p className="text-sm">{survey.fieldOffice}</p></div>
                <div><Label className="text-xs text-muted-foreground">Target Locations</Label><p className="text-sm">{survey.targetLocations.join(', ')}</p></div>
                <div><Label className="text-xs text-muted-foreground">Scope</Label><p className="text-sm">{survey.scope}</p></div>
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
                    {survey.workflowType === 'hq' ? 'Follows headquarters review chain with director sign-off' :
                     survey.workflowType === 'field' ? 'Regional field office process with field manager approval' :
                     'Local approval process with local supervisor sign-off'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Asset Lock Status</Label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <LockIcon className={`w-4 h-4 ${survey.assetsLocked ? 'text-red-500' : 'text-gray-400'}`} />
                    <p className="text-sm font-medium">{survey.assetsLocked ? 'Locked — assets cannot be disposed until approved' : 'Unlocked'}</p>
                  </div>
                </div>
              </div>
              {survey.linkedDisposalId && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-xs text-muted-foreground">Linked Disposal Case</Label>
                    <div className="flex items-center gap-2 mt-1 p-3 rounded-[4px] border bg-muted/30">
                      <LinkIcon className="w-4 h-4 text-[#EF652B]" />
                      <span className="font-['Manrope'] text-sm font-medium">{survey.linkedDisposalId}</span>
                      <span className="text-xs text-muted-foreground">— Survey must be approved before disposal can proceed</span>
                    </div>
                  </div>
                </>
              )}
              <Separator />
              <div><Label className="text-xs text-muted-foreground">Description</Label><p className="text-sm mt-1">{survey.description || '—'}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Progress & Results</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Verification Progress</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={survey.totalExpected > 0 ? (survey.totalVerified / survey.totalExpected) * 100 : 0} className="h-2 flex-1" />
                  <span className="text-sm font-medium">{survey.totalExpected > 0 ? Math.round((survey.totalVerified / survey.totalExpected) * 100) : 0}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{survey.totalVerified} of {survey.totalExpected} assets verified</p>
              </div>
              <Separator />
              <div><Label className="text-xs text-muted-foreground">Accuracy Rate</Label><p className="text-lg font-bold">{survey.accuracyRate}%</p></div>
              <div><Label className="text-xs text-muted-foreground">Discrepancies</Label><p className="text-sm font-medium text-amber-600">{survey.totalDiscrepancies} found</p></div>
              <Separator />
              <div><Label className="text-xs text-muted-foreground">Planned Start</Label><p className="text-sm">{formatDate(survey.plannedStartDate)}</p></div>
              <div><Label className="text-xs text-muted-foreground">Planned End</Label><p className="text-sm">{formatDate(survey.plannedEndDate)}</p></div>
              <div><Label className="text-xs text-muted-foreground">Actual Start</Label><p className="text-sm">{formatDate(survey.actualStartDate)}</p></div>
              <div><Label className="text-xs text-muted-foreground">Actual End</Label><p className="text-sm">{formatDate(survey.actualEndDate)}</p></div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'assets' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Surveyed Assets ({survey.assets.length})</CardTitle></CardHeader>
          <CardContent>
            {survey.assets.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[15px]">Asset ID</TableHead>
                      <TableHead className="text-[15px]">Name</TableHead>
                      <TableHead className="text-[15px]">Expected Location</TableHead>
                      <TableHead className="text-[15px]">Actual Location</TableHead>
                      <TableHead className="text-[15px]">Condition</TableHead>
                      <TableHead className="text-right text-[15px]">NBV</TableHead>
                      <TableHead className="text-[15px]">Verified</TableHead>
                      <TableHead className="text-[15px]">Discrepancy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {survey.assets.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="font-['Manrope'] text-[15px]">{a.assetId}</TableCell>
                        <TableCell className="font-medium text-[15px]">{a.name}</TableCell>
                        <TableCell className="text-[15px]">{a.expectedLocation}</TableCell>
                        <TableCell className="text-[15px]">{a.actualLocation || <span className="italic text-muted-foreground">Not found</span>}</TableCell>
                        <TableCell className="text-[15px]">
                          <div className="text-xs">
                            <span className="text-muted-foreground">Exp:</span> {a.expectedCondition}
                            {a.actualCondition && a.actualCondition !== a.expectedCondition && (
                              <><br /><span className="text-amber-600">Act: {a.actualCondition}</span></>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-['Manrope'] text-[15px]">{a.nbv != null ? `$${a.nbv.toLocaleString()}` : '—'}</TableCell>
                        <TableCell className="text-[15px]">{a.verified ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-gray-300" />}</TableCell>
                        <TableCell className="text-[15px]">
                          {a.discrepancy ? (
                            <Badge className={getDiscrepancyColor(a.discrepancy) + ' text-[10px]'}>{a.discrepancy.replace(/-/g, ' ')}</Badge>
                          ) : <span className="text-xs text-muted-foreground">—</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No assets surveyed yet.</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'discrepancies' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Discrepancies ({discrepancies.length})</CardTitle></CardHeader>
          <CardContent>
            {discrepancies.length > 0 ? (
              <div className="space-y-3">
                {discrepancies.map(a => (
                  <div key={a.id} className="p-4 rounded-[4px] border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-['Manrope'] text-sm font-medium">{a.assetId}</span>
                        <span className="text-sm text-muted-foreground">— {a.name}</span>
                      </div>
                      <Badge className={getDiscrepancyColor(a.discrepancy!) + ' text-[10px]'}>{a.discrepancy!.replace(/-/g, ' ')}</Badge>
                    </div>
                    {a.discrepancy === 'location-mismatch' && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Expected:</span> {a.expectedLocation}</div>
                        <div><span className="text-amber-600">Actual:</span> {a.actualLocation}</div>
                      </div>
                    )}
                    {a.discrepancy === 'condition-change' && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Expected:</span> {a.expectedCondition}</div>
                        <div><span className="text-amber-600">Actual:</span> {a.actualCondition}</div>
                      </div>
                    )}
                    {a.notes && <p className="text-xs text-muted-foreground">{a.notes}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-muted-foreground">No discrepancies found</p>
              </div>
            )}
          </CardContent>
        </Card>
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
                <Button size="sm" variant="outline" onClick={() => toast.success('Survey report generated (pre-filled with asset details, rationale, and signature placeholders)')} className="gap-1.5">
                  <FileText className="w-4 h-4" /> Generate Report
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Report generation info */}
            <div className="p-3 rounded-[4px] border bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Survey Report</span>
                <Badge className={survey.reportGenerated ? 'bg-green-500/10 text-green-700 text-[10px]' : 'bg-gray-500/10 text-gray-700 text-[10px]'}>
                  {survey.reportGenerated ? 'Generated' : 'Not Generated'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-generated report pre-filled with asset details, verification results, discrepancy findings, and digital signature placeholders.
              </p>
            </div>
            {/* Uploaded attachments */}
            {survey.attachments.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Uploaded Documents ({survey.attachments.length})</p>
                {survey.attachments.map((fileName, idx) => (
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
              <p className="text-xs text-muted-foreground text-center py-4">No documents uploaded yet. Use the upload button to attach scanned or digital files.</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'signatures' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Signatures</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {survey.signatures.map((sig, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-[4px] border">
                  <div>
                    <p className="text-sm font-medium capitalize">{sig.role.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">{sig.name}</p>
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
              {survey.auditTrail.map((entry, i) => (
                <div key={entry.id} className="flex gap-3 pb-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${i === 0 ? 'bg-[#EF652B]' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    {i < survey.auditTrail.length - 1 && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />}
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
        title="Upload Survey Documents"
        description="Attach supporting documents such as survey plans, scanned verification sheets, photos, or reconciliation reports."
        referenceId={survey.surveyId}
        onUploadComplete={(files) => {
          toast.success(`${files.length} document(s) attached to ${survey.surveyId}`);
        }}
      />
    </div>
  );
}
