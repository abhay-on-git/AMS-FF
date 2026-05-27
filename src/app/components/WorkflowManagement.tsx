import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TablePagination, paginateData } from './shared/TablePagination';
import { DeleteConfirmDialog } from './shared/DeleteConfirmDialog';
import { toast } from 'sonner';
import {
  Add as PlusIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as TrashIcon,
  ContentCopy as CopyIcon,
  Archive as ArchiveIcon,
  Visibility as EyeIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  DragIndicator as GripIcon,
  AccountTree as WorkflowIcon,
  ChevronLeft,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  PlayArrow as PlayIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Notifications as NotificationIcon,
  Speed as SpeedIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ExpandMore as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  CallSplit as BranchIcon,
  MergeType as MergeIcon,
  Schedule as ClockIcon,
  ReportProblem as ErrorIcon,
  SwapHoriz as TransferIcon,
  DeleteForever as DisposalIcon,
  FactCheck as InspectionIcon,
  Assignment as SurveyIcon,
  Tune as CustomIcon,
  Email as EmailIcon,
  NotificationsActive as BellIcon,
  TrendingUp as TrendUpIcon,
  Assessment as ChartIcon,
  Restore as RestoreIcon,
  CompareArrows as CompareIcon,
  Lock as LockIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';

// ══════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════

type CaseType = 'transfer' | 'disposal' | 'survey' | 'inspection' | 'custom';
type WorkflowStatus = 'active' | 'draft' | 'archived';
type StepType = 'approval' | 'review' | 'auto-approval' | 'conditional' | 'parallel';
type ViewMode = 'list' | 'editor' | 'preview';

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface NotificationConfig {
  onAssignment: boolean;
  onApproval: boolean;
  onRejection: boolean;
  onSlaBreach: boolean;
  channels: ('in-app' | 'email')[];
}

interface EscalationRule {
  enabled: boolean;
  escalateTo: string;
  autoApproveAfterDays: number;
  notifySupervisor: boolean;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  assignedRole: string;
  slaDays: number;
  requireComments: boolean;
  requireAttachment: boolean;
  statusOutcome: string;
  notifications: NotificationConfig;
  escalation: EscalationRule;
  conditions?: Condition[];
  parallelConfig?: {
    requireAll: boolean;
    branches: { role: string; name: string }[];
  };
}

interface VersionEntry {
  version: string;
  modifiedBy: string;
  modifiedDate: string;
  changeLog: string;
  status: WorkflowStatus;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  caseType: CaseType;
  status: WorkflowStatus;
  version: string;
  lastModified: string;
  modifiedBy: string;
  assignedTo: string;
  steps: WorkflowStep[];
  autoTrigger: boolean;
  triggerCondition: string;
  fieldOffice: string;
  versions: VersionEntry[];
  usageStats: {
    activeCases: number;
    completionRate: number;
    avgApprovalTime: number;
    slaBreaches: number;
  };
}

// ══════════════════════════════════════════════════
// MOCK DATA
// ══════════════════════════════════════════════════

const ROLES = ['System Admin', 'SMIO', 'Field Inspector', 'HQ Manager', 'Regional Manager', 'Finance Officer', 'Auditor', 'Custom Role'];
const FIELDS = ['Asset Value', 'Asset Type', 'Field Office', 'Status', 'Category', 'Custodian', 'Condition'];
const OPERATORS = ['>', '<', '=', '!=', '>=', '<=', 'contains'];
const STATUS_OUTCOMES = ['Pending Review', 'Approved', 'Rejected', 'Escalated', 'Completed', 'Returned for Revision'];

const defaultStep = (): WorkflowStep => ({
  id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  name: '',
  type: 'approval',
  assignedRole: 'System Admin',
  slaDays: 3,
  requireComments: false,
  requireAttachment: false,
  statusOutcome: 'Pending Review',
  notifications: {
    onAssignment: true,
    onApproval: true,
    onRejection: true,
    onSlaBreach: true,
    channels: ['in-app', 'email'],
  },
  escalation: {
    enabled: false,
    escalateTo: 'System Admin',
    autoApproveAfterDays: 0,
    notifySupervisor: false,
  },
});

const mockWorkflows: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Standard Asset Transfer',
    description: 'Default approval workflow for inter-office asset transfers',
    caseType: 'transfer',
    status: 'active',
    version: '2.1',
    lastModified: '2026-02-28',
    modifiedBy: 'Admin User',
    assignedTo: 'Global',
    autoTrigger: true,
    triggerCondition: 'When transfer request is submitted',
    fieldOffice: 'all',
    steps: [
      { id: 's1', name: 'Line Manager Approval', type: 'approval', assignedRole: 'Regional Manager', slaDays: 2, requireComments: false, requireAttachment: false, statusOutcome: 'Pending Review', notifications: { onAssignment: true, onApproval: true, onRejection: true, onSlaBreach: true, channels: ['in-app', 'email'] }, escalation: { enabled: true, escalateTo: 'HQ Manager', autoApproveAfterDays: 5, notifySupervisor: true } },
      { id: 's2', name: 'Asset Value Check', type: 'conditional', assignedRole: 'System Admin', slaDays: 0, requireComments: false, requireAttachment: false, statusOutcome: 'Pending Review', notifications: { onAssignment: false, onApproval: false, onRejection: false, onSlaBreach: false, channels: [] }, escalation: { enabled: false, escalateTo: '', autoApproveAfterDays: 0, notifySupervisor: false }, conditions: [{ id: 'c1', field: 'Asset Value', operator: '>', value: '5000' }] },
      { id: 's3', name: 'HQ Finance Approval', type: 'approval', assignedRole: 'Finance Officer', slaDays: 3, requireComments: true, requireAttachment: true, statusOutcome: 'Approved', notifications: { onAssignment: true, onApproval: true, onRejection: true, onSlaBreach: true, channels: ['in-app', 'email'] }, escalation: { enabled: true, escalateTo: 'System Admin', autoApproveAfterDays: 7, notifySupervisor: true } },
      { id: 's4', name: 'Final Review', type: 'review', assignedRole: 'SMIO', slaDays: 1, requireComments: false, requireAttachment: false, statusOutcome: 'Completed', notifications: { onAssignment: true, onApproval: true, onRejection: false, onSlaBreach: false, channels: ['in-app'] }, escalation: { enabled: false, escalateTo: '', autoApproveAfterDays: 0, notifySupervisor: false } },
    ],
    versions: [
      { version: '2.1', modifiedBy: 'Admin User', modifiedDate: '2026-02-28', changeLog: 'Added HQ Finance approval for high-value transfers', status: 'active' },
      { version: '2.0', modifiedBy: 'Admin User', modifiedDate: '2026-01-15', changeLog: 'Restructured conditional branching logic', status: 'archived' },
      { version: '1.0', modifiedBy: 'System', modifiedDate: '2025-06-01', changeLog: 'Initial workflow creation', status: 'archived' },
    ],
    usageStats: { activeCases: 14, completionRate: 92.3, avgApprovalTime: 2.4, slaBreaches: 2 },
  },
  {
    id: 'wf-002',
    name: 'Disposal Approval Chain',
    description: 'Multi-step approval for asset write-off and disposal',
    caseType: 'disposal',
    status: 'active',
    version: '1.3',
    lastModified: '2026-02-20',
    modifiedBy: 'Admin User',
    assignedTo: 'Global',
    autoTrigger: true,
    triggerCondition: 'When disposal request is submitted',
    fieldOffice: 'all',
    steps: [
      { id: 's1', name: 'Custodian Confirmation', type: 'review', assignedRole: 'Field Inspector', slaDays: 1, requireComments: true, requireAttachment: true, statusOutcome: 'Pending Review', notifications: { onAssignment: true, onApproval: true, onRejection: true, onSlaBreach: true, channels: ['in-app', 'email'] }, escalation: { enabled: false, escalateTo: '', autoApproveAfterDays: 0, notifySupervisor: false } },
      { id: 's2', name: 'Finance Write-Off', type: 'approval', assignedRole: 'Finance Officer', slaDays: 5, requireComments: true, requireAttachment: true, statusOutcome: 'Approved', notifications: { onAssignment: true, onApproval: true, onRejection: true, onSlaBreach: true, channels: ['in-app', 'email'] }, escalation: { enabled: true, escalateTo: 'HQ Manager', autoApproveAfterDays: 10, notifySupervisor: true } },
      { id: 's3', name: 'HQ Final Approval', type: 'approval', assignedRole: 'HQ Manager', slaDays: 3, requireComments: false, requireAttachment: false, statusOutcome: 'Completed', notifications: { onAssignment: true, onApproval: true, onRejection: true, onSlaBreach: false, channels: ['in-app'] }, escalation: { enabled: false, escalateTo: '', autoApproveAfterDays: 0, notifySupervisor: false } },
    ],
    versions: [
      { version: '1.3', modifiedBy: 'Admin User', modifiedDate: '2026-02-20', changeLog: 'Updated SLA for finance step', status: 'active' },
      { version: '1.0', modifiedBy: 'System', modifiedDate: '2025-08-10', changeLog: 'Initial creation', status: 'archived' },
    ],
    usageStats: { activeCases: 3, completionRate: 87.5, avgApprovalTime: 4.1, slaBreaches: 1 },
  },
  {
    id: 'wf-003',
    name: 'Inspection Verification',
    description: 'Workflow for inspection result validation and follow-up actions',
    caseType: 'inspection',
    status: 'active',
    version: '1.0',
    lastModified: '2026-01-10',
    modifiedBy: 'Admin User',
    assignedTo: 'Global',
    autoTrigger: false,
    triggerCondition: '',
    fieldOffice: 'all',
    steps: [
      { id: 's1', name: 'Inspector Submission', type: 'review', assignedRole: 'Field Inspector', slaDays: 1, requireComments: true, requireAttachment: true, statusOutcome: 'Pending Review', notifications: { onAssignment: true, onApproval: false, onRejection: false, onSlaBreach: true, channels: ['in-app'] }, escalation: { enabled: false, escalateTo: '', autoApproveAfterDays: 0, notifySupervisor: false } },
      { id: 's2', name: 'Supervisor Validation', type: 'approval', assignedRole: 'Regional Manager', slaDays: 2, requireComments: false, requireAttachment: false, statusOutcome: 'Approved', notifications: { onAssignment: true, onApproval: true, onRejection: true, onSlaBreach: true, channels: ['in-app', 'email'] }, escalation: { enabled: true, escalateTo: 'SMIO', autoApproveAfterDays: 4, notifySupervisor: true } },
    ],
    versions: [
      { version: '1.0', modifiedBy: 'Admin User', modifiedDate: '2026-01-10', changeLog: 'Initial creation', status: 'active' },
    ],
    usageStats: { activeCases: 3, completionRate: 95.0, avgApprovalTime: 1.8, slaBreaches: 0 },
  },
  {
    id: 'wf-004',
    name: 'Annual Survey Process',
    description: 'End-to-end workflow for annual physical asset survey campaigns',
    caseType: 'survey',
    status: 'draft',
    version: '0.2',
    lastModified: '2026-03-01',
    modifiedBy: 'Admin User',
    assignedTo: 'Field-Specific',
    autoTrigger: false,
    triggerCondition: '',
    fieldOffice: 'Amman Office',
    steps: [
      { id: 's1', name: 'Survey Planning', type: 'review', assignedRole: 'SMIO', slaDays: 5, requireComments: true, requireAttachment: false, statusOutcome: 'Pending Review', notifications: { onAssignment: true, onApproval: false, onRejection: false, onSlaBreach: true, channels: ['in-app'] }, escalation: { enabled: false, escalateTo: '', autoApproveAfterDays: 0, notifySupervisor: false } },
      { id: 's2', name: 'Field Execution Sign-Off', type: 'approval', assignedRole: 'Field Inspector', slaDays: 10, requireComments: true, requireAttachment: true, statusOutcome: 'Approved', notifications: { onAssignment: true, onApproval: true, onRejection: true, onSlaBreach: true, channels: ['in-app', 'email'] }, escalation: { enabled: true, escalateTo: 'Regional Manager', autoApproveAfterDays: 15, notifySupervisor: true } },
      { id: 's3', name: 'Discrepancy Resolution', type: 'conditional', assignedRole: 'System Admin', slaDays: 0, requireComments: false, requireAttachment: false, statusOutcome: 'Pending Review', notifications: { onAssignment: false, onApproval: false, onRejection: false, onSlaBreach: false, channels: [] }, escalation: { enabled: false, escalateTo: '', autoApproveAfterDays: 0, notifySupervisor: false }, conditions: [{ id: 'c1', field: 'Status', operator: '=', value: 'Missing' }] },
      { id: 's4', name: 'Final Report Approval', type: 'approval', assignedRole: 'HQ Manager', slaDays: 3, requireComments: true, requireAttachment: true, statusOutcome: 'Completed', notifications: { onAssignment: true, onApproval: true, onRejection: true, onSlaBreach: true, channels: ['in-app', 'email'] }, escalation: { enabled: false, escalateTo: '', autoApproveAfterDays: 0, notifySupervisor: false } },
    ],
    versions: [
      { version: '0.2', modifiedBy: 'Admin User', modifiedDate: '2026-03-01', changeLog: 'Added discrepancy resolution branch', status: 'draft' },
      { version: '0.1', modifiedBy: 'Admin User', modifiedDate: '2026-02-25', changeLog: 'Initial draft', status: 'draft' },
    ],
    usageStats: { activeCases: 0, completionRate: 0, avgApprovalTime: 0, slaBreaches: 0 },
  },
  {
    id: 'wf-005',
    name: 'High-Value Transfer (North Region)',
    description: 'Specialized approval chain for high-value assets in North regional offices',
    caseType: 'transfer',
    status: 'archived',
    version: '1.2',
    lastModified: '2025-12-15',
    modifiedBy: 'Admin User',
    assignedTo: 'Field-Specific',
    autoTrigger: true,
    triggerCondition: 'Asset Value > 10000 AND Field = North Office',
    fieldOffice: 'North Office',
    steps: [
      { id: 's1', name: 'Regional Manager Review', type: 'approval', assignedRole: 'Regional Manager', slaDays: 2, requireComments: true, requireAttachment: false, statusOutcome: 'Pending Review', notifications: { onAssignment: true, onApproval: true, onRejection: true, onSlaBreach: true, channels: ['in-app', 'email'] }, escalation: { enabled: true, escalateTo: 'HQ Manager', autoApproveAfterDays: 5, notifySupervisor: true } },
      { id: 's2', name: 'Parallel HQ Approval', type: 'parallel', assignedRole: 'System Admin', slaDays: 3, requireComments: true, requireAttachment: true, statusOutcome: 'Approved', notifications: { onAssignment: true, onApproval: true, onRejection: true, onSlaBreach: true, channels: ['in-app', 'email'] }, escalation: { enabled: false, escalateTo: '', autoApproveAfterDays: 0, notifySupervisor: false }, parallelConfig: { requireAll: true, branches: [{ role: 'Finance Officer', name: 'Finance Clearance' }, { role: 'HQ Manager', name: 'HQ Authorization' }] } },
    ],
    versions: [
      { version: '1.2', modifiedBy: 'Admin User', modifiedDate: '2025-12-15', changeLog: 'Archived — replaced by global workflow', status: 'archived' },
    ],
    usageStats: { activeCases: 0, completionRate: 88.0, avgApprovalTime: 3.5, slaBreaches: 4 },
  },
  {
    id: 'wf-006',
    name: 'Custom Equipment Review',
    description: 'Custom workflow for specialized equipment procurement review',
    caseType: 'custom',
    status: 'draft',
    version: '0.1',
    lastModified: '2026-03-02',
    modifiedBy: 'Admin User',
    assignedTo: 'Global',
    autoTrigger: false,
    triggerCondition: '',
    fieldOffice: 'all',
    steps: [
      { id: 's1', name: 'Technical Review', type: 'review', assignedRole: 'Field Inspector', slaDays: 3, requireComments: true, requireAttachment: true, statusOutcome: 'Pending Review', notifications: { onAssignment: true, onApproval: false, onRejection: false, onSlaBreach: true, channels: ['in-app'] }, escalation: { enabled: false, escalateTo: '', autoApproveAfterDays: 0, notifySupervisor: false } },
    ],
    versions: [
      { version: '0.1', modifiedBy: 'Admin User', modifiedDate: '2026-03-02', changeLog: 'Initial draft', status: 'draft' },
    ],
    usageStats: { activeCases: 0, completionRate: 0, avgApprovalTime: 0, slaBreaches: 0 },
  },
];

// ══════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════

const getCaseTypeIcon = (ct: CaseType) => {
  switch (ct) {
    case 'transfer': return TransferIcon;
    case 'disposal': return DisposalIcon;
    case 'inspection': return InspectionIcon;
    case 'survey': return SurveyIcon;
    case 'custom': return CustomIcon;
  }
};

const getCaseTypeColor = (ct: CaseType) => {
  switch (ct) {
    case 'transfer': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    case 'disposal': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
    case 'inspection': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    case 'survey': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    case 'custom': return 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800';
  }
};

const getStatusColor = (s: WorkflowStatus) => {
  switch (s) {
    case 'active': return 'bg-green-500/10 text-green-700 dark:text-green-400';
    case 'draft': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
    case 'archived': return 'bg-gray-500/10 text-gray-500 dark:text-gray-400';
  }
};

const getStepTypeColor = (t: StepType) => {
  switch (t) {
    case 'approval': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700';
    case 'review': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700';
    case 'auto-approval': return 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-700';
    case 'conditional': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700';
    case 'parallel': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700';
  }
};

const getStepTypeLabel = (t: StepType) => {
  switch (t) {
    case 'approval': return 'Approval';
    case 'review': return 'Review';
    case 'auto-approval': return 'Auto-Approval';
    case 'conditional': return 'Conditional Branch';
    case 'parallel': return 'Parallel Approval';
  }
};

// ══════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════

export default function WorkflowManagement() {
  const { t } = useLanguage();

  // ── List view state ──
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [searchQuery, setSearchQuery] = useState('');
  const [caseTypeFilter, setCaseTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ── View state ──
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // ── Editor state ──
  const [editorTab, setEditorTab] = useState<'builder' | 'notifications' | 'escalation' | 'versions' | 'usage'>('builder');
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [stepDrawerOpen, setStepDrawerOpen] = useState(false);

  // ── Delete state ──
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(null);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [workflowToArchive, setWorkflowToArchive] = useState<Workflow | null>(null);

  // ── Activate confirmation ──
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);

  // ── Preview state ──
  const [previewParams, setPreviewParams] = useState({ assetType: 'IT Equipment', value: '3000', field: 'Amman Office', caseType: 'transfer' });

  // ── Editor form state ──
  const [editorForm, setEditorForm] = useState<Workflow | null>(null);

  // ── Filtered data ──
  const filteredWorkflows = workflows.filter((wf) => {
    const matchSearch = wf.name.toLowerCase().includes(searchQuery.toLowerCase()) || wf.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCase = caseTypeFilter === 'all' || wf.caseType === caseTypeFilter;
    const matchStatus = statusFilter === 'all' || wf.status === statusFilter;
    return matchSearch && matchCase && matchStatus;
  });

  // ── Handlers ──
  const handleCreateWorkflow = () => {
    const newWf: Workflow = {
      id: `wf-${Date.now()}`,
      name: '',
      description: '',
      caseType: 'transfer',
      status: 'draft',
      version: '0.1',
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: 'Admin User',
      assignedTo: 'Global',
      autoTrigger: false,
      triggerCondition: '',
      fieldOffice: 'all',
      steps: [defaultStep()],
      versions: [{ version: '0.1', modifiedBy: 'Admin User', modifiedDate: new Date().toISOString().split('T')[0], changeLog: 'Initial draft', status: 'draft' }],
      usageStats: { activeCases: 0, completionRate: 0, avgApprovalTime: 0, slaBreaches: 0 },
    };
    setEditorForm(newWf);
    setIsEditMode(false);
    setEditorTab('builder');
    setViewMode('editor');
  };

  const handleEditWorkflow = (wf: Workflow) => {
    setEditorForm(JSON.parse(JSON.stringify(wf)));
    setIsEditMode(true);
    setEditorTab('builder');
    setViewMode('editor');
  };

  const handleViewWorkflow = (wf: Workflow) => {
    setSelectedWorkflow(wf);
    setEditorForm(JSON.parse(JSON.stringify(wf)));
    setEditorTab('builder');
    setViewMode('editor');
  };

  const handleCloneWorkflow = (wf: Workflow) => {
    const cloned: Workflow = {
      ...JSON.parse(JSON.stringify(wf)),
      id: `wf-${Date.now()}`,
      name: `${wf.name} (Copy)`,
      status: 'draft' as WorkflowStatus,
      version: '0.1',
      lastModified: new Date().toISOString().split('T')[0],
      versions: [{ version: '0.1', modifiedBy: 'Admin User', modifiedDate: new Date().toISOString().split('T')[0], changeLog: 'Cloned from ' + wf.name, status: 'draft' as WorkflowStatus }],
      usageStats: { activeCases: 0, completionRate: 0, avgApprovalTime: 0, slaBreaches: 0 },
    };
    setWorkflows(prev => [...prev, cloned]);
    toast.success(`Workflow"${wf.name}" cloned successfully`);
  };

  const handleArchiveWorkflow = (wf: Workflow) => {
    setWorkflowToArchive(wf);
    setArchiveDialogOpen(true);
  };

  const confirmArchive = () => {
    if (workflowToArchive) {
      setWorkflows(prev => prev.map(w => w.id === workflowToArchive.id ? { ...w, status: 'archived' as WorkflowStatus } : w));
      toast.success(`Workflow"${workflowToArchive.name}" archived`);
      setWorkflowToArchive(null);
    }
    setArchiveDialogOpen(false);
  };

  const handleDeleteWorkflow = (wf: Workflow) => {
    if (wf.status !== 'draft') {
      toast.error('Only draft workflows can be deleted. Archive active workflows instead.');
      return;
    }
    setWorkflowToDelete(wf);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (workflowToDelete) {
      setWorkflows(prev => prev.filter(w => w.id !== workflowToDelete.id));
      toast.success(`Workflow"${workflowToDelete.name}" deleted`);
      setWorkflowToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleSaveWorkflow = () => {
    if (!editorForm) return;
    if (!editorForm.name.trim()) { toast.error('Workflow name is required'); return; }
    if (editorForm.steps.length === 0) { toast.error('At least one step is required'); return; }
    const hasEmptySteps = editorForm.steps.some(s => !s.name.trim());
    if (hasEmptySteps) { toast.error('All steps must have a name'); return; }

    if (isEditMode) {
      const newVersion = (parseFloat(editorForm.version) + 0.1).toFixed(1);
      const updatedWf = {
        ...editorForm,
        version: newVersion,
        lastModified: new Date().toISOString().split('T')[0],
        versions: [{ version: newVersion, modifiedBy: 'Admin User', modifiedDate: new Date().toISOString().split('T')[0], changeLog: 'Updated workflow configuration', status: editorForm.status }, ...editorForm.versions],
      };
      setWorkflows(prev => prev.map(w => w.id === updatedWf.id ? updatedWf : w));
      toast.success(`Workflow"${updatedWf.name}" saved (v${newVersion})`);
    } else {
      setWorkflows(prev => [...prev, editorForm]);
      toast.success(`Workflow"${editorForm.name}" created`);
    }
    setViewMode('list');
    setEditorForm(null);
  };

  const handleActivateWorkflow = () => {
    if (!editorForm) return;
    setActivateDialogOpen(true);
  };

  const confirmActivate = () => {
    if (!editorForm) return;
    const activated = { ...editorForm, status: 'active' as WorkflowStatus };
    setEditorForm(activated);
    setWorkflows(prev => prev.map(w => w.id === activated.id ? activated : w));
    toast.success(`Workflow"${activated.name}" activated`);
    setActivateDialogOpen(false);
  };

  // ── Step handlers ──
  const handleAddStep = () => {
    if (!editorForm) return;
    const ns = defaultStep();
    setEditorForm({ ...editorForm, steps: [...editorForm.steps, ns] });
    setEditingStepId(ns.id);
    setStepDrawerOpen(true);
  };

  const handleEditStep = (stepId: string) => {
    setEditingStepId(stepId);
    setStepDrawerOpen(true);
  };

  const handleDeleteStep = (stepId: string) => {
    if (!editorForm) return;
    setEditorForm({ ...editorForm, steps: editorForm.steps.filter(s => s.id !== stepId) });
    toast.success('Step removed');
  };

  const handleMoveStep = (stepId: string, direction: 'up' | 'down') => {
    if (!editorForm) return;
    const idx = editorForm.steps.findIndex(s => s.id === stepId);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === editorForm.steps.length - 1)) return;
    const newSteps = [...editorForm.steps];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newSteps[idx], newSteps[swapIdx]] = [newSteps[swapIdx], newSteps[idx]];
    setEditorForm({ ...editorForm, steps: newSteps });
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    if (!editorForm) return;
    setEditorForm({ ...editorForm, steps: editorForm.steps.map(s => s.id === stepId ? { ...s, ...updates } : s) });
  };

  const currentEditingStep = editorForm?.steps.find(s => s.id === editingStepId) || null;

  // ══════════════════════════════════════════════════
  // RENDER: LIST VIEW
  // ══════════════════════════════════════════════════

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <WorkflowIcon className="w-7 h-7 text-[#121321] dark:text-[#81CCD7]" />
              Workflow Management
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Configure and manage approval workflows for system cases</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCreateWorkflow} className="bg-[#121321][#2d3154] text-white text-[15px]">
              <PlusIcon className="w-4 h-4 mr-1.5" /> Create Workflow
            </Button>
            
            
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Workflows', value: workflows.filter(w => w.status === 'active').length, icon: CheckCircleIcon },
            { label: 'Drafts', value: workflows.filter(w => w.status === 'draft').length, icon: EditIcon },
            { label: 'Total Active Cases', value: workflows.reduce((s, w) => s + w.usageStats.activeCases, 0), icon: WorkflowIcon },
            { label: 'SLA Breaches (All)', value: workflows.reduce((s, w) => s + w.usageStats.slaBreaches, 0), icon: WarningIcon },
          ].map(card => (
            <Card key={card.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F7F7F8]">
                    <card.icon className="w-5 h-5 text-[#121321]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search workflows..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }} className="pl-9 text-[15px]" />
              </div>
              <Select value={caseTypeFilter} onValueChange={(v) => { setCaseTypeFilter(v); setPage(0); }}>
                <SelectTrigger className="w-44 text-[15px]"><SelectValue placeholder="Case Type" /></SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all" className="text-[15px]">All Case Types</SelectItem>
                  <SelectItem value="transfer" className="text-[15px]">Transfer</SelectItem>
                  <SelectItem value="disposal" className="text-[15px]">Disposal</SelectItem>
                  <SelectItem value="inspection" className="text-[15px]">Inspection</SelectItem>
                  <SelectItem value="survey" className="text-[15px]">Survey</SelectItem>
                  <SelectItem value="custom" className="text-[15px]">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
                <SelectTrigger className="w-36 text-[15px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all" className="text-[15px]">All Statuses</SelectItem>
                  <SelectItem value="active" className="text-[15px]">Active</SelectItem>
                  <SelectItem value="draft" className="text-[15px]">Draft</SelectItem>
                  <SelectItem value="archived" className="text-[15px]">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-auto max-h-[calc(100vh-420px)] scrollbar-hide">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[15px]">Workflow Name</TableHead>
                      <TableHead className="text-[15px]">Case Type</TableHead>
                      <TableHead className="text-[15px]">Status</TableHead>
                      <TableHead className="text-[15px]">Version</TableHead>
                      <TableHead className="text-[15px]">Last Modified</TableHead>
                      <TableHead className="text-[15px]">Modified By</TableHead>
                      <TableHead className="text-[15px]">Assigned To</TableHead>
                      <TableHead className="text-[15px]">Steps</TableHead>
                      <TableHead className="text-[15px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginateData(filteredWorkflows, page, rowsPerPage).map(wf => {
                      const CaseIcon = getCaseTypeIcon(wf.caseType);
                      return (
                        <TableRow key={wf.id} className="/50 cursor-pointer" onClick={() => handleViewWorkflow(wf)}>
                          <TableCell className="text-[15px]">
                            <div className="flex items-center gap-2">
                              <WorkflowIcon className="w-4 h-4 text-[#121321] dark:text-[#81CCD7] shrink-0" />
                              <div>
                                <p className="font-medium text-[#121321] dark:text-[#81CCD7]">{wf.name}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{wf.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-[15px]">
                            <Badge className={getCaseTypeColor(wf.caseType)}>
                              <CaseIcon className="w-3 h-3 mr-1" />
                              {wf.caseType.charAt(0).toUpperCase() + wf.caseType.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[15px]"><Badge className={getStatusColor(wf.status)}>{wf.status.charAt(0).toUpperCase() + wf.status.slice(1)}</Badge></TableCell>
                          <TableCell className="text-[15px]"><span className="font-['Manrope']">v{wf.version}</span></TableCell>
                          <TableCell className="text-[15px]">{wf.lastModified}</TableCell>
                          <TableCell className="text-[15px]">{wf.modifiedBy}</TableCell>
                          <TableCell className="text-[15px]">
                            <Badge variant="outline" className="text-xs">{wf.assignedTo}</Badge>
                          </TableCell>
                          <TableCell className="text-[15px]">
                            <Badge variant="outline" className="text-xs">{wf.steps.length} steps</Badge>
                          </TableCell>
                          <TableCell className="text-[15px]">
                            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                              <Button size="sm" variant="ghost" onClick={() => handleEditWorkflow(wf)} title="Edit">
                                <EditIcon className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleCloneWorkflow(wf)} title="Clone">
                                <CopyIcon className="w-4 h-4" />
                              </Button>
                              {wf.status !== 'archived' && (
                                <Button size="sm" variant="ghost" onClick={() => handleArchiveWorkflow(wf)} title="Archive">
                                  <ArchiveIcon className="w-4 h-4" />
                                </Button>
                              )}
                              {wf.status === 'draft' && (
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteWorkflow(wf)} title="Delete">
                                  <TrashIcon className="w-4 h-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <TablePagination totalItems={filteredWorkflows.length} page={page} rowsPerPage={rowsPerPage} onPageChange={setPage} onRowsPerPageChange={setRowsPerPage} totalUnfilteredItems={workflows.length} itemLabel="workflows" />
            </div>

            {filteredWorkflows.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <WorkflowIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No workflows found</p>
                <p className="text-sm mt-1">Create your first workflow to automate approval processes</p>
                <Button className="mt-4 bg-[#121321][#2d3154] text-white" onClick={handleCreateWorkflow}>
                  <PlusIcon className="w-4 h-4 mr-1.5" /> Create Workflow
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Dialog */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Workflow"
          description={`Are you sure you want to delete"${workflowToDelete?.name || ''}"? This draft workflow will be permanently removed. This action cannot be undone.`}
          confirmLabel="Delete Workflow"
          onConfirm={confirmDelete}
        />

        {/* Archive Dialog */}
        <DeleteConfirmDialog
          open={archiveDialogOpen}
          onOpenChange={setArchiveDialogOpen}
          title="Archive Workflow"
          description={`Are you sure you want to archive"${workflowToArchive?.name || ''}"? It will no longer be available for new cases. Existing cases using this workflow will continue to completion.`}
          confirmLabel="Archive"
          variant="warning"
          onConfirm={confirmArchive}
        />
      </div>
    );
  }

  // ══════════════════════════════════════════════════
  // RENDER: EDITOR / PREVIEW VIEW
  // ══════════════════════════════════════════════════

  if (!editorForm) return null;

  const editorTabs = [
    { id: 'builder' as const, label: 'Workflow Builder', icon: WorkflowIcon },
    { id: 'notifications' as const, label: 'Notifications', icon: NotificationIcon },
    { id: 'escalation' as const, label: 'Escalation Rules', icon: WarningIcon },
    { id: 'versions' as const, label: 'Version History', icon: HistoryIcon },
    { id: 'usage' as const, label: 'Workflow Usage', icon: ChartIcon },
  ];

  return (
    <div className="space-y-6">
      {/* ── Editor Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm mb-2">
            <button
              onClick={() => { setViewMode('list'); setEditorForm(null); }}
              className="text-muted-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setViewMode('list'); setEditorForm(null); }}
              className="text-muted-foreground transition-colors"
            >
              Workflow Management
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{isEditMode ? 'Edit' : 'Create'}</span>
          </div>
          <h1 className="flex items-center gap-2">
            <WorkflowIcon className="w-6 h-6 text-[#121321] dark:text-[#81CCD7]" />
            {isEditMode ? 'Edit Workflow' : 'Create Workflow'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {editorForm.name
              ? `${editorForm.name} — v${editorForm.version}`
              : 'Configure workflow steps, conditions, and approval chains'}
          </p>
        </div>
        <div className="flex gap-2">
          {viewMode === 'preview' ? (
            <Button variant="outline" className="text-[15px]" onClick={() => setViewMode('editor')}>
              <ChevronLeft className="w-4 h-4 mr-1.5" /> Back to Editor
            </Button>
          ) : (
            <>
              <Button variant="outline" className="text-[15px]" onClick={() => setViewMode('preview')}>
                <PlayIcon className="w-4 h-4 mr-1.5" /> Preview
              </Button>
              {editorForm.status === 'draft' && (
                <Button variant="outline" className="border-green-300 text-green-70050 dark:border-green-700 dark:text-green-400 dark:900/20 text-[15px]" onClick={handleActivateWorkflow}>
                  <CheckCircleIcon className="w-4 h-4 mr-1.5" /> Activate
                </Button>
              )}
              <Button className="bg-[#121321][#2d3154] text-white text-[15px]" onClick={handleSaveWorkflow}>
                <SaveIcon className="w-4 h-4 mr-1.5" /> Save Workflow
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ── Preview Mode ── */}
      {viewMode === 'preview' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PlayIcon className="w-5 h-5 text-[#EF652B]" /> Workflow Simulation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <Label>Asset Type</Label>
                  <Select value={previewParams.assetType} onValueChange={v => setPreviewParams(p => ({ ...p, assetType: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      {['IT Equipment', 'Furniture', 'Vehicle', 'Network Equipment'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Asset Value ($)</Label>
                  <Input type="number" value={previewParams.value} onChange={e => setPreviewParams(p => ({ ...p, value: e.target.value }))} />
                </div>
                <div>
                  <Label>Field Office</Label>
                  <Select value={previewParams.field} onValueChange={v => setPreviewParams(p => ({ ...p, field: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      {['Amman Office', 'Bangkok Office', 'Melbourne Office', 'North Office'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Case Type</Label>
                  <Select value={previewParams.caseType} onValueChange={v => setPreviewParams(p => ({ ...p, caseType: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="disposal">Disposal</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="survey">Survey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="mb-6" />

              <h3 className="font-medium mb-4">Generated Approval Chain</h3>
              <div className="space-y-0">
                {editorForm.steps.map((step, idx) => {
                  const isConditional = step.type === 'conditional';
                  const conditionMet = isConditional && step.conditions?.some(c => {
                    if (c.field === 'Asset Value') {
                      const numVal = parseFloat(previewParams.value);
                      const condVal = parseFloat(c.value);
                      if (c.operator === '>') return numVal > condVal;
                      if (c.operator === '<') return numVal < condVal;
                      if (c.operator === '=') return numVal === condVal;
                    }
                    if (c.field === 'Field Office') return c.operator === '=' ? previewParams.field === c.value : previewParams.field !== c.value;
                    return true;
                  });

                  return (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          isConditional ? (conditionMet ? 'bg-green-500' : 'bg-gray-400') : 'bg-[#121321] dark:bg-[#81CCD7] dark:text-[#121321]'
                        }`}>
                          {idx + 1}
                        </div>
                        {idx < editorForm.steps.length - 1 && <div className={`w-0.5 h-12 ${isConditional && !conditionMet ? 'bg-gray-300 dark:bg-gray-600 border-dashed' : 'bg-[#121321]/20 dark:bg-[#81CCD7]/20'}`} />}
                      </div>
                      <div className={`flex-1 pb-6 ${isConditional && !conditionMet ? 'opacity-40' : ''}`}>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{step.name || 'Unnamed Step'}</p>
                          <Badge className={getStepTypeColor(step.type)}>{getStepTypeLabel(step.type)}</Badge>
                          {isConditional && (
                            <Badge className={conditionMet ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-gray-500/10 text-gray-500'}>
                              {conditionMet ? 'Condition Met' : 'Skipped'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.type === 'parallel' && step.parallelConfig
                            ? `Parallel: ${step.parallelConfig.branches.map(b => b.role).join(' + ')} (${step.parallelConfig.requireAll ? 'All required' : 'Any required'})`
                            : `Assigned to: ${step.assignedRole} · SLA: ${step.slaDays}d`}
                        </p>
                        {isConditional && step.conditions?.map(c => (
                          <p key={c.id} className="text-xs text-muted-foreground mt-1 font-['Manrope'] bg-muted/50 px-2 py-1 rounded w-fit">
                            IF {c.field} {c.operator} {c.value}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Editor Mode ── */}
      {viewMode === 'editor' && (
        <>
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <InfoIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
                Workflow Basic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                <div className="lg:col-span-2 space-y-1.5">
                  <Label>Workflow Name *</Label>
                  <Input value={editorForm.name} onChange={e => setEditorForm({ ...editorForm, name: e.target.value })} placeholder="e.g., Standard Asset Transfer" />
                </div>
                <div className="space-y-1.5">
                  <Label>Case Type *</Label>
                  <Select value={editorForm.caseType} onValueChange={v => setEditorForm({ ...editorForm, caseType: v as CaseType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="transfer">Asset Transfer</SelectItem>
                      <SelectItem value="disposal">Disposal</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="survey">Survey</SelectItem>
                      <SelectItem value="custom">Custom Case Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="lg:col-span-2 space-y-1.5">
                  <Label>Description</Label>
                  <Textarea value={editorForm.description} onChange={e => setEditorForm({ ...editorForm, description: e.target.value })} rows={2} placeholder="Describe the purpose of this workflow..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Applicable Field Office</Label>
                  <Select value={editorForm.fieldOffice} onValueChange={v => setEditorForm({ ...editorForm, fieldOffice: v, assignedTo: v === 'all' ? 'Global' : 'Field-Specific' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="all">All Offices (Global)</SelectItem>
                      <SelectItem value="Amman Office">Amman Office</SelectItem>
                      <SelectItem value="Bangkok Office">Bangkok Office</SelectItem>
                      <SelectItem value="Melbourne Office">Melbourne Office</SelectItem>
                      <SelectItem value="North Office">North Office</SelectItem>
                      <SelectItem value="Afghanistan Office">Afghanistan Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Switch checked={editorForm.autoTrigger} onCheckedChange={v => setEditorForm({ ...editorForm, autoTrigger: v })} />
                    <Label className="cursor-pointer">Enable Auto-Trigger</Label>
                  </div>
                </div>
                {editorForm.autoTrigger && (
                  <div className="space-y-1.5">
                    <Label>Trigger Condition</Label>
                    <Input value={editorForm.triggerCondition} onChange={e => setEditorForm({ ...editorForm, triggerCondition: e.target.value })} placeholder="e.g., When transfer request is submitted" />
                  </div>
                )}
                <div className="flex items-center gap-6 pt-2">
                  <div>
                    <Label>Version</Label>
                    <p className="font-['Manrope'] text-sm mt-1.5">v{editorForm.version}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={`mt-1.5 block w-fit ${getStatusColor(editorForm.status)}`}>{editorForm.status.charAt(0).toUpperCase() + editorForm.status.slice(1)}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editor Tabs */}
          <div className="bg-muted/50 p-1 rounded-[4px] w-fit flex gap-1">
            {editorTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setEditorTab(tab.id)}
                className={`px-3 py-1.5 rounded-[3px] text-[15px] flex items-center gap-1.5 transition-colors ${
                  editorTab === tab.id ? 'bg-[#121321] text-white' : 'text-muted-foreground border border-transparent'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab: Workflow Builder ── */}
          {editorTab === 'builder' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <WorkflowIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
                    Visual Workflow Builder
                  </CardTitle>
                  
                </div>
              </CardHeader>
              <CardContent>
                {editorForm.steps.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <WorkflowIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No steps defined. Add your first step to begin building the workflow.</p>
                    <Button className="mt-4 bg-[#121321][#2d3154] text-white" onClick={handleAddStep}>
                      <PlusIcon className="w-4 h-4 mr-1.5" /> Add First Step
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {editorForm.steps.map((step, idx) => (
                      <div key={step.id} className="flex gap-4">
                        {/* Vertical connector */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 ${getStepTypeColor(step.type)}`}>
                            {step.type === 'conditional' ? <BranchIcon className="w-5 h-5" /> :
                             step.type === 'parallel' ? <MergeIcon className="w-5 h-5" /> :
                             idx + 1}
                          </div>
                          {idx < editorForm.steps.length - 1 && (
                            <div className="w-0.5 flex-1 min-h-[16px] bg-border" />
                          )}
                        </div>

                        {/* Step card */}
                        <div className={`flex-1 mb-4 p-4 rounded-lg border-2 transition-colors[#121321]/30 dark:[#81CCD7]/30 ${getStepTypeColor(step.type)}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium">{step.name || <span className="italic text-muted-foreground">Unnamed Step</span>}</p>
                                <Badge className={getStepTypeColor(step.type)}>{getStepTypeLabel(step.type)}</Badge>
                                {step.requireComments && <Badge variant="outline" className="text-[10px]">Comments Required</Badge>}
                                {step.requireAttachment && <Badge variant="outline" className="text-[10px]">Attachment Required</Badge>}
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1">
                                  <SettingsIcon className="w-3.5 h-3.5" />
                                  {step.assignedRole}
                                </span>
                                {step.slaDays > 0 && (
                                  <span className="flex items-center gap-1">
                                    <ClockIcon className="w-3.5 h-3.5" />
                                    {step.slaDays}d SLA
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <ArrowForwardIcon className="w-3.5 h-3.5" />
                                  {step.statusOutcome}
                                </span>
                                {step.escalation.enabled && (
                                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                    <WarningIcon className="w-3.5 h-3.5" />
                                    Escalation enabled
                                  </span>
                                )}
                              </div>
                              {/* Conditional rules */}
                              {step.type === 'conditional' && step.conditions?.map(c => (
                                <div key={c.id} className="mt-2 px-2 py-1 rounded bg-amber-500/5 border border-amber-200 dark:border-amber-800 text-xs font-['Manrope'] w-fit">
                                  IF {c.field} {c.operator} {c.value}
                                </div>
                              ))}
                              {/* Parallel branches */}
                              {step.type === 'parallel' && step.parallelConfig && (
                                <div className="mt-2 space-y-1">
                                  <p className="text-xs text-muted-foreground">
                                    Parallel Approval — {step.parallelConfig.requireAll ? 'All must approve' : 'Any one can approve'}
                                  </p>
                                  <div className="flex gap-2 flex-wrap">
                                    {step.parallelConfig.branches.map((b, bi) => (
                                      <Badge key={bi} variant="outline" className="text-xs">{b.name}: {b.role}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* Actions */}
                            <div className="flex items-center gap-0.5 shrink-0">
                              <Button size="sm" variant="ghost" onClick={() => handleMoveStep(step.id, 'up')} disabled={idx === 0}>
                                <ArrowUpIcon className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleMoveStep(step.id, 'down')} disabled={idx === editorForm.steps.length - 1}>
                                <ArrowDownIcon className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleEditStep(step.id)}>
                                <EditIcon className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteStep(step.id)}>
                                <TrashIcon className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add step at end */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                          <PlusIcon className="w-5 h-5 text-muted-foreground/50" />
                        </div>
                      </div>
                      <Button variant="outline" className="border-dashed" onClick={handleAddStep}>
                        <PlusIcon className="w-4 h-4 mr-1.5" /> Add Step
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── Tab: Notifications ── */}
          {editorTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <NotificationIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
                  Notification Settings Per Step
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editorForm.steps.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">Add steps first to configure notifications.</p>
                ) : (
                  <div className="space-y-4">
                    {editorForm.steps.map((step, idx) => (
                      <div key={step.id} className="p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getStepTypeColor(step.type)}>{idx + 1}</Badge>
                          <span className="font-medium">{step.name || 'Unnamed Step'}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Switch checked={step.notifications.onAssignment} onCheckedChange={v => updateStep(step.id, { notifications: { ...step.notifications, onAssignment: v } })} />
                            <Label className="text-sm cursor-pointer">On Assignment</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={step.notifications.onApproval} onCheckedChange={v => updateStep(step.id, { notifications: { ...step.notifications, onApproval: v } })} />
                            <Label className="text-sm cursor-pointer">On Approval</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={step.notifications.onRejection} onCheckedChange={v => updateStep(step.id, { notifications: { ...step.notifications, onRejection: v } })} />
                            <Label className="text-sm cursor-pointer">On Rejection</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={step.notifications.onSlaBreach} onCheckedChange={v => updateStep(step.id, { notifications: { ...step.notifications, onSlaBreach: v } })} />
                            <Label className="text-sm cursor-pointer">On SLA Breach</Label>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <Label className="text-sm text-muted-foreground">Channels:</Label>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={step.notifications.channels.includes('in-app')}
                              onCheckedChange={v => {
                                const ch = v ? [...step.notifications.channels, 'in-app' as const] : step.notifications.channels.filter(c => c !== 'in-app');
                                updateStep(step.id, { notifications: { ...step.notifications, channels: ch } });
                              }}
                            />
                            <Label className="text-sm cursor-pointer flex items-center gap-1"><BellIcon className="w-3.5 h-3.5" /> In-App</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={step.notifications.channels.includes('email')}
                              onCheckedChange={v => {
                                const ch = v ? [...step.notifications.channels, 'email' as const] : step.notifications.channels.filter(c => c !== 'email');
                                updateStep(step.id, { notifications: { ...step.notifications, channels: ch } });
                              }}
                            />
                            <Label className="text-sm cursor-pointer flex items-center gap-1"><EmailIcon className="w-3.5 h-3.5" /> Email</Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── Tab: Escalation Rules ── */}
          {editorTab === 'escalation' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <WarningIcon className="w-5 h-5 text-[#EF652B]" />
                  Escalation Rules Per Step
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editorForm.steps.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">Add steps first to configure escalation rules.</p>
                ) : (
                  <div className="space-y-4">
                    {editorForm.steps.filter(s => s.type !== 'conditional' && s.type !== 'auto-approval').map((step, idx) => (
                      <div key={step.id} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getStepTypeColor(step.type)}>{editorForm.steps.indexOf(step) + 1}</Badge>
                            <span className="font-medium">{step.name || 'Unnamed Step'}</span>
                            <span className="text-xs text-muted-foreground">SLA: {step.slaDays}d</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={step.escalation.enabled} onCheckedChange={v => updateStep(step.id, { escalation: { ...step.escalation, enabled: v } })} />
                            <Label className="text-sm cursor-pointer">Enable Escalation</Label>
                          </div>
                        </div>
                        {step.escalation.enabled && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3 p-3 rounded bg-muted/30">
                            <div>
                              <Label className="text-xs">Escalate To</Label>
                              <Select value={step.escalation.escalateTo} onValueChange={v => updateStep(step.id, { escalation: { ...step.escalation, escalateTo: v } })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">Auto-Approve After (days)</Label>
                              <Input type="number" min={0} value={step.escalation.autoApproveAfterDays} onChange={e => updateStep(step.id, { escalation: { ...step.escalation, autoApproveAfterDays: parseInt(e.target.value) || 0 } })} />
                            </div>
                            <div className="flex items-center gap-2 mt-5">
                              <Switch checked={step.escalation.notifySupervisor} onCheckedChange={v => updateStep(step.id, { escalation: { ...step.escalation, notifySupervisor: v } })} />
                              <Label className="text-sm cursor-pointer">Notify Supervisor</Label>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── Tab: Version History ── */}
          {editorTab === 'versions' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <HistoryIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
                  Version History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[15px]">Version</TableHead>
                        <TableHead className="text-[15px]">Modified By</TableHead>
                        <TableHead className="text-[15px]">Date</TableHead>
                        <TableHead className="text-[15px]">Change Log</TableHead>
                        <TableHead className="text-[15px]">Status</TableHead>
                        <TableHead className="text-[15px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editorForm.versions.map((v, idx) => (
                        <TableRow key={v.version}>
                          <TableCell className="text-[15px]"><span className="font-['Manrope'] font-medium">v{v.version}</span></TableCell>
                          <TableCell className="text-[15px]">{v.modifiedBy}</TableCell>
                          <TableCell className="text-[15px]">{v.modifiedDate}</TableCell>
                          <TableCell className="text-[15px] max-w-[300px] truncate">{v.changeLog}</TableCell>
                          <TableCell className="text-[15px]"><Badge className={getStatusColor(v.status)}>{v.status.charAt(0).toUpperCase() + v.status.slice(1)}</Badge></TableCell>
                          <TableCell className="text-[15px]">
                            {idx > 0 && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" title="Revert to this version" onClick={() => toast.info(`Reverted to v${v.version}`)}>
                                  <RestoreIcon className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" title="Compare with current" onClick={() => toast.info(`Comparing v${v.version} with current`)}>
                                  <CompareIcon className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                            {idx === 0 && <Badge variant="outline" className="text-xs">Current</Badge>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Tab: Workflow Usage ── */}
          {editorTab === 'usage' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Active Cases', value: editorForm.usageStats.activeCases, icon: WorkflowIcon },
                  { label: 'Completion Rate', value: `${editorForm.usageStats.completionRate}%`, icon: TrendUpIcon },
                  { label: 'Avg. Approval Time', value: `${editorForm.usageStats.avgApprovalTime}d`, icon: ClockIcon },
                  { label: 'SLA Breaches', value: editorForm.usageStats.slaBreaches, icon: ErrorIcon },
                ].map(stat => (
                  <Card key={stat.label}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F7F7F8]">
                          <stat.icon className="w-5 h-5 text-[#121321]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ChartIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
                    Case Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <InfoIcon className="w-4 h-4" />
                    <AlertDescription>
                      This workflow (<strong>{editorForm.name || 'Unnamed'}</strong>) is linked to <strong>{editorForm.caseType.charAt(0).toUpperCase() + editorForm.caseType.slice(1)}</strong> module.
                      {editorForm.usageStats.activeCases > 0
                        ? ` Currently ${editorForm.usageStats.activeCases} active case(s) are using this workflow.`
                        : ' No active cases are currently using this workflow.'}
                    </AlertDescription>
                  </Alert>

                  {editorForm.usageStats.activeCases > 0 && (
                    <div className="mt-4 rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-[15px]">Case ID</TableHead>
                            <TableHead className="text-[15px]">Type</TableHead>
                            <TableHead className="text-[15px]">Current Step</TableHead>
                            <TableHead className="text-[15px]">Status</TableHead>
                            <TableHead className="text-[15px]">Started</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: Math.min(editorForm.usageStats.activeCases, 5) }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell className="text-[15px] font-['Manrope']">{`${editorForm.caseType.toUpperCase().substring(0, 3)}-2026-${String(i + 40).padStart(3, '0')}`}</TableCell>
                              <TableCell className="text-[15px]">
                                <Badge className={getCaseTypeColor(editorForm.caseType)}>{editorForm.caseType.charAt(0).toUpperCase() + editorForm.caseType.slice(1)}</Badge>
                              </TableCell>
                              <TableCell className="text-[15px]">{editorForm.steps[Math.min(i % editorForm.steps.length, editorForm.steps.length - 1)]?.name || 'Step 1'}</TableCell>
                              <TableCell className="text-[15px]"><Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400">In Progress</Badge></TableCell>
                              <TableCell className="text-[15px]">2026-02-{String(20 + i).padStart(2, '0')}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* ══ Step Editing Drawer ══ */}
      <Sheet open={stepDrawerOpen} onOpenChange={setStepDrawerOpen}>
        <SheetContent className="w-full sm:max-w-xl flex flex-col h-full p-0">
          {/* Pinned Header */}
          <div className="px-6 py-4 border-b shrink-0">
            <SheetHeader>
              <SheetTitle className="text-[15px] flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
                {currentEditingStep ? 'Edit Step' : 'New Step'}
              </SheetTitle>
              <SheetDescription className="text-[14px]">Configure step properties, conditions, and parallel approvals</SheetDescription>
            </SheetHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {currentEditingStep && (
              <>
                {/* Basic */}
                <div className="space-y-4">
                  <h4 className="text-[14px] font-medium text-muted-foreground uppercase tracking-wide">Basic Info</h4>
                  <div>
                    <Label>Step Name *</Label>
                    <Input className="h-[52px] text-[15px] placeholder:text-[14px]" value={currentEditingStep.name} onChange={e => updateStep(currentEditingStep.id, { name: e.target.value })} placeholder="e.g., Manager Approval" />
                  </div>
                  <div>
                    <Label>Step Type *</Label>
                    <Select value={currentEditingStep.type} onValueChange={v => {
                      const updates: Partial<WorkflowStep> = { type: v as StepType };
                      if (v === 'conditional') updates.conditions = updates.conditions || [{ id: `c-${Date.now()}`, field: 'Asset Value', operator: '>', value: '5000' }];
                      if (v === 'parallel') updates.parallelConfig = updates.parallelConfig || { requireAll: true, branches: [{ role: 'Finance Officer', name: 'Finance Clearance' }, { role: 'HQ Manager', name: 'HQ Authorization' }] };
                      updateStep(currentEditingStep.id, updates);
                    }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                        <SelectItem value="approval">Approval</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="auto-approval">Auto-Approval</SelectItem>
                        <SelectItem value="conditional">Conditional Branch</SelectItem>
                        <SelectItem value="parallel">Parallel Approval</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Assigned Role *</Label>
                    <Select value={currentEditingStep.assignedRole} onValueChange={v => updateStep(currentEditingStep.id, { assignedRole: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>SLA Duration (days)</Label>
                      <Input type="number" min={0} value={currentEditingStep.slaDays} onChange={e => updateStep(currentEditingStep.id, { slaDays: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div>
                      <Label>Status Outcome</Label>
                      <Select value={currentEditingStep.statusOutcome} onValueChange={v => updateStep(currentEditingStep.id, { statusOutcome: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">{STATUS_OUTCOMES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Switch checked={currentEditingStep.requireComments} onCheckedChange={v => updateStep(currentEditingStep.id, { requireComments: v })} />
                      <Label className="text-sm cursor-pointer">Require Comments</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={currentEditingStep.requireAttachment} onCheckedChange={v => updateStep(currentEditingStep.id, { requireAttachment: v })} />
                      <Label className="text-sm cursor-pointer">Require Attachment</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Conditional Builder */}
                {currentEditingStep.type === 'conditional' && (
                  <>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                        <BranchIcon className="w-4 h-4" /> Condition Rules
                      </h4>
                      {(currentEditingStep.conditions || []).map((cond, ci) => (
                        <div key={cond.id} className="flex items-end gap-2 p-3 rounded-lg border bg-muted/20">
                          <div className="flex-1">
                            <Label className="text-xs">Field</Label>
                            <Select value={cond.field} onValueChange={v => {
                              const newConds = [...(currentEditingStep.conditions || [])];
                              newConds[ci] = { ...newConds[ci], field: v };
                              updateStep(currentEditingStep.id, { conditions: newConds });
                            }}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">{FIELDS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <div className="w-20">
                            <Label className="text-xs">Operator</Label>
                            <Select value={cond.operator} onValueChange={v => {
                              const newConds = [...(currentEditingStep.conditions || [])];
                              newConds[ci] = { ...newConds[ci], operator: v };
                              updateStep(currentEditingStep.id, { conditions: newConds });
                            }}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">{OPERATORS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs">Value</Label>
                            <Input value={cond.value} onChange={e => {
                              const newConds = [...(currentEditingStep.conditions || [])];
                              newConds[ci] = { ...newConds[ci], value: e.target.value };
                              updateStep(currentEditingStep.id, { conditions: newConds });
                            }} />
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => {
                            const newConds = (currentEditingStep.conditions || []).filter(c => c.id !== cond.id);
                            updateStep(currentEditingStep.id, { conditions: newConds });
                          }}>
                            <TrashIcon className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => {
                        const newCond: Condition = { id: `c-${Date.now()}`, field: 'Asset Value', operator: '>', value: '' };
                        updateStep(currentEditingStep.id, { conditions: [...(currentEditingStep.conditions || []), newCond] });
                      }}>
                        <PlusIcon className="w-4 h-4 mr-1" /> Add Condition
                      </Button>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Parallel Config */}
                {currentEditingStep.type === 'parallel' && currentEditingStep.parallelConfig && (
                  <>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                        <MergeIcon className="w-4 h-4" /> Parallel Approval Config
                      </h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={currentEditingStep.parallelConfig.requireAll}
                            onCheckedChange={v => updateStep(currentEditingStep.id, { parallelConfig: { ...currentEditingStep.parallelConfig!, requireAll: v } })}
                          />
                          <Label className="text-sm cursor-pointer">{currentEditingStep.parallelConfig.requireAll ? 'Require ALL approvals' : 'Require ANY approval'}</Label>
                        </div>
                      </div>
                      {currentEditingStep.parallelConfig.branches.map((branch, bi) => (
                        <div key={bi} className="flex items-end gap-2 p-3 rounded-lg border bg-muted/20">
                          <div className="flex-1">
                            <Label className="text-xs">Branch Name</Label>
                            <Input value={branch.name} onChange={e => {
                              const newBranches = [...currentEditingStep.parallelConfig!.branches];
                              newBranches[bi] = { ...newBranches[bi], name: e.target.value };
                              updateStep(currentEditingStep.id, { parallelConfig: { ...currentEditingStep.parallelConfig!, branches: newBranches } });
                            }} />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs">Assigned Role</Label>
                            <Select value={branch.role} onValueChange={v => {
                              const newBranches = [...currentEditingStep.parallelConfig!.branches];
                              newBranches[bi] = { ...newBranches[bi], role: v };
                              updateStep(currentEditingStep.id, { parallelConfig: { ...currentEditingStep.parallelConfig!, branches: newBranches } });
                            }}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => {
                            const newBranches = currentEditingStep.parallelConfig!.branches.filter((_, i) => i !== bi);
                            updateStep(currentEditingStep.id, { parallelConfig: { ...currentEditingStep.parallelConfig!, branches: newBranches } });
                          }}>
                            <TrashIcon className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => {
                        const newBranches = [...currentEditingStep.parallelConfig!.branches, { role: 'System Admin', name: 'New Branch' }];
                        updateStep(currentEditingStep.id, { parallelConfig: { ...currentEditingStep.parallelConfig!, branches: newBranches } });
                      }}>
                        <PlusIcon className="w-4 h-4 mr-1" /> Add Branch
                      </Button>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Escalation (inline in drawer) */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <WarningIcon className="w-4 h-4" /> Escalation
                  </h4>
                  <div className="flex items-center gap-2">
                    <Switch checked={currentEditingStep.escalation.enabled} onCheckedChange={v => updateStep(currentEditingStep.id, { escalation: { ...currentEditingStep.escalation, enabled: v } })} />
                    <Label className="text-sm cursor-pointer">Enable Escalation on SLA Breach</Label>
                  </div>
                  {currentEditingStep.escalation.enabled && (
                    <div className="grid grid-cols-2 gap-4 p-3 rounded bg-muted/30">
                      <div>
                        <Label className="text-xs">Escalate To</Label>
                        <Select value={currentEditingStep.escalation.escalateTo} onValueChange={v => updateStep(currentEditingStep.id, { escalation: { ...currentEditingStep.escalation, escalateTo: v } })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Auto-Approve After (days)</Label>
                        <Input type="number" min={0} value={currentEditingStep.escalation.autoApproveAfterDays} onChange={e => updateStep(currentEditingStep.id, { escalation: { ...currentEditingStep.escalation, autoApproveAfterDays: parseInt(e.target.value) || 0 } })} />
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <Switch checked={currentEditingStep.escalation.notifySupervisor} onCheckedChange={v => updateStep(currentEditingStep.id, { escalation: { ...currentEditingStep.escalation, notifySupervisor: v } })} />
                        <Label className="text-sm cursor-pointer">Notify Supervisor</Label>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Pinned Footer */}
          <div className="px-6 py-4 border-t shrink-0 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStepDrawerOpen(false)}>Cancel</Button>
            <Button className="bg-[#121321][#2d3154] text-white" onClick={() => {
              if (!currentEditingStep?.name.trim()) { toast.error('Step name is required'); return; }
              setStepDrawerOpen(false);
              toast.success(`Step"${currentEditingStep.name}" saved`);
            }}>
              Save Step
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Activate Confirmation Dialog */}
      <DeleteConfirmDialog
        open={activateDialogOpen}
        onOpenChange={setActivateDialogOpen}
        title="Activate Workflow"
        description={`Are you sure you want to activate"${editorForm.name}"? Once active, it will be used for new ${editorForm.caseType} cases. You can archive it later if needed.`}
        confirmLabel="Activate"
        variant="warning"
        onConfirm={confirmActivate}
      />
    </div>
  );
}

