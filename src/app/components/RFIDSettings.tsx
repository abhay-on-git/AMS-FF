import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { formatDate } from '../utils/dateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { TablePagination, paginateData } from './shared/TablePagination';
import {
  Router as Radio,
  Add as Plus,
  Search,
  FactCheck as InspectionIcon,
  Person as UserIcon,
  LocationOn as MapPin,
  Download,
  CheckCircle,
  Cancel as XCircle,
  Warning as AlertCircle,
  Schedule as Clock,
  Assignment as ClipboardIcon,
  ChevronLeft,
  FilterList as FilterIcon,
  DoneAll as DoneAllIcon,
  HourglassEmpty as HourglassIcon,
  PlayArrow as StartIcon,
  CameraAlt as CameraIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Draw as SignatureIcon,
  QrCode as QrCodeIcon,
  SyncAlt as SyncIcon,
  History as HistoryIcon,
  CalendarMonth as CalendarIcon,
  Visibility as EyeIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Send as SendIcon,
  MoreVert as MoreIcon,
  ReportProblem as OverdueIcon,
  TrendingUp,
  Inventory2 as Package,
  Business as Building2,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';

// ── Types ──

type InspectionTab = 'tasks' | 'scheduling' | 'reports' | 'audit-trail';
type ViewMode = 'list' | 'detail';
type TaskStatus = 'draft' | 'assigned' | 'in-progress' | 'completed' | 'signed-off';
type AssetResult = 'pending' | 'verified' | 'missing' | 'damaged' | 'requires-action';

interface InspectionTask {
  id: string;
  taskId: string;
  title: string;
  description: string;
  location: string;
  fieldOffice: string;
  assignedTo: string;
  supervisor: string;
  custodian: string;
  assetType: string;
  status: TaskStatus;
  scheduledDate: string;
  dueDate: string;
  startedDate?: string;
  completedDate?: string;
  totalAssets: number;
  verified: number;
  missing: number;
  damaged: number;
  requiresAction: number;
  pending: number;
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  inspectorSignature?: { name: string; timestamp: string };
  supervisorSignature?: { name: string; timestamp: string };
  checklistTemplate: string;
  photosAttached: number;
  notes: string;
}

interface TaskAsset {
  id: string;
  assetId: string;
  name: string;
  serialNumber: string;
  barcode: string;
  type: string;
  currentLocation: string;
  condition: string;
  result: AssetResult;
  notes: string;
  photos: number;
  lastScanned?: string;
}

interface InspectionReport {
  id: string;
  taskId: string;
  title: string;
  location: string;
  inspector: string;
  generatedDate: string;
  totalInspected: number;
  verified: number;
  missing: number;
  damaged: number;
  verifiedPct: number;
  status: 'generated' | 'reviewed' | 'shared';
  format: 'pdf' | 'excel';
}

interface AuditEntry {
  id: string;
  taskId: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'create' | 'update' | 'status' | 'signature' | 'scan' | 'sync';
}

interface ChecklistTemplate {
  id: string;
  name: string;
  items: string[];
  assetType: string;
  isDefault: boolean;
}

// ── Status Helpers ──

const getTaskStatusColor = (s: TaskStatus) => {
  switch (s) {
    case 'draft': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    case 'assigned': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'in-progress': return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'completed': return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'signed-off': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
  }
};

const getTaskStatusLabel = (s: TaskStatus) => {
  switch (s) {
    case 'draft': return 'Draft';
    case 'assigned': return 'Assigned';
    case 'in-progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'signed-off': return 'Signed Off';
  }
};

const getAssetResultColor = (r: AssetResult) => {
  switch (r) {
    case 'pending': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    case 'verified': return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'missing': return 'bg-red-500/10 text-red-700 dark:text-red-300';
    case 'damaged': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
    case 'requires-action': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
  }
};

const getAssetResultLabel = (r: AssetResult) => {
  switch (r) {
    case 'pending': return 'Pending';
    case 'verified': return 'Verified';
    case 'missing': return 'Missing';
    case 'damaged': return 'Damaged';
    case 'requires-action': return 'Requires Action';
  }
};

const getPriorityColor = (p: string) => {
  switch (p) {
    case 'low': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    case 'medium': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'high': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
    case 'critical': return 'bg-red-500/10 text-red-700 dark:text-red-300';
    default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  }
};

// ── Mock Data ──

const mockTasks: InspectionTask[] = [
  {
    id: '1', taskId: 'INSP-2026-001', title: 'Q1 Server Room Full Inspection',
    description: 'Quarterly physical verification of all IT assets in Server Room B2.',
    location: 'Server Room B2', fieldOffice: 'Amman Office', assignedTo: 'John Doe',
    supervisor: 'IT Director', custodian: 'IT Department', assetType: 'IT Equipment',
    status: 'in-progress', scheduledDate: '2026-02-28', dueDate: '2026-03-05',
    startedDate: '2026-02-28', totalAssets: 24, verified: 14, missing: 1, damaged: 2,
    requiresAction: 1, pending: 6, progress: 75, priority: 'high',
    checklistTemplate: 'IT Equipment Standard', photosAttached: 8, notes: 'Rack B3 access restricted until 10am.',
  },
  {
    id: '2', taskId: 'INSP-2026-002', title: 'Office Floor 1 Spot Check',
    description: 'Random spot verification of office furniture and IT assets.',
    location: 'Office Floor 1', fieldOffice: 'Amman Office', assignedTo: 'Jane Smith',
    supervisor: 'Admin Manager', custodian: 'Admin Department', assetType: 'All',
    status: 'completed', scheduledDate: '2026-02-20', dueDate: '2026-02-20',
    startedDate: '2026-02-20', completedDate: '2026-02-20', totalAssets: 15,
    verified: 14, missing: 0, damaged: 1, requiresAction: 0, pending: 0, progress: 100,
    priority: 'medium', inspectorSignature: { name: 'Jane Smith', timestamp: '2026-02-20T16:30:00' },
    supervisorSignature: { name: 'Admin Manager', timestamp: '2026-02-21T09:00:00' },
    checklistTemplate: 'General Office', photosAttached: 5, notes: 'One chair with broken caster noted.',
  },
  {
    id: '3', taskId: 'INSP-2026-003', title: 'Warehouse Annual Inventory Count',
    description: 'Annual physical count of all warehouse assets for compliance audit.',
    location: 'Warehouse B1', fieldOffice: 'Bangkok Office', assignedTo: 'Bob Wilson',
    supervisor: 'Operations Manager', custodian: 'Warehouse Lead', assetType: 'All',
    status: 'signed-off', scheduledDate: '2026-02-15', dueDate: '2026-02-18',
    startedDate: '2026-02-15', completedDate: '2026-02-17', totalAssets: 87,
    verified: 82, missing: 3, damaged: 2, requiresAction: 0, pending: 0, progress: 100,
    priority: 'critical', inspectorSignature: { name: 'Bob Wilson', timestamp: '2026-02-17T15:00:00' },
    supervisorSignature: { name: 'Operations Manager', timestamp: '2026-02-18T10:00:00' },
    checklistTemplate: 'Warehouse Full Count', photosAttached: 22, notes: 'Missing items flagged for investigation.',
  },
  {
    id: '4', taskId: 'INSP-2026-004', title: 'Regional Office Equipment Verification',
    description: 'Scheduled verification of all IT equipment at Regional East office.',
    location: 'Office Floor 2', fieldOffice: 'Melbourne Office', assignedTo: 'Mike Torres',
    supervisor: 'Regional IT Lead', custodian: 'IT Support', assetType: 'IT Equipment',
    status: 'assigned', scheduledDate: '2026-03-03', dueDate: '2026-03-05',
    totalAssets: 36, verified: 0, missing: 0, damaged: 0, requiresAction: 0, pending: 36,
    progress: 0, priority: 'medium', checklistTemplate: 'IT Equipment Standard',
    photosAttached: 0, notes: '',
  },
  {
    id: '5', taskId: 'INSP-2026-005', title: 'Vehicle Fleet Inspection',
    description: 'Monthly fleet vehicle inspection and condition assessment.',
    location: 'Vehicle Bay', fieldOffice: 'Phnom Penh Office', assignedTo: 'Sarah Chen',
    supervisor: 'Fleet Manager', custodian: 'Transport Unit', assetType: 'Vehicles',
    status: 'draft', scheduledDate: '2026-03-10', dueDate: '2026-03-12',
    totalAssets: 12, verified: 0, missing: 0, damaged: 0, requiresAction: 0, pending: 12,
    progress: 0, priority: 'high', checklistTemplate: 'Vehicle Inspection',
    photosAttached: 0, notes: '',
  },
  {
    id: '6', taskId: 'INSP-2026-006', title: 'Post-Flood Damage Assessment',
    description: 'Emergency inspection after flooding in basement storage area.',
    location: 'Basement Storage', fieldOffice: 'Afghanistan Office', assignedTo: 'Emily Davis',
    supervisor: 'Facilities Director', custodian: 'Facilities Team', assetType: 'All',
    status: 'completed', scheduledDate: '2026-02-25', dueDate: '2026-02-25',
    startedDate: '2026-02-25', completedDate: '2026-02-25', totalAssets: 18,
    verified: 8, missing: 2, damaged: 6, requiresAction: 2, pending: 0, progress: 100,
    priority: 'critical', inspectorSignature: { name: 'Emily Davis', timestamp: '2026-02-25T17:00:00' },
    checklistTemplate: 'Damage Assessment', photosAttached: 34, notes: 'Significant water damage to electronics. Insurance claim initiated.',
  },
];

const mockTaskAssets: TaskAsset[] = [
  { id: '1', assetId: 'SRV-001238', name: 'HP ProLiant DL380', serialNumber: 'HP-DL380-XK231', barcode: 'BC-SRV-001238', type: 'Server', currentLocation: 'Server Room B2 - Rack A1', condition: 'Good', result: 'verified', notes: 'Operating normally. All LEDs green.', photos: 1, lastScanned: '2026-02-28T09:15:00' },
  { id: '2', assetId: 'SRV-001239', name: 'Dell PowerEdge R740', serialNumber: 'DL-R740-QM456', barcode: 'BC-SRV-001239', type: 'Server', currentLocation: 'Server Room B2 - Rack A1', condition: 'Good', result: 'verified', notes: '', photos: 0, lastScanned: '2026-02-28T09:16:00' },
  { id: '3', assetId: 'NET-001240', name: 'Cisco Catalyst 9300', serialNumber: 'CS-9300-XA871', barcode: 'BC-NET-001240', type: 'Switch', currentLocation: 'Server Room B2 - Rack A2', condition: 'Good', result: 'verified', notes: 'Firmware updated last month.', photos: 0, lastScanned: '2026-02-28T09:20:00' },
  { id: '4', assetId: 'UPS-001241', name: 'APC Smart-UPS 3000', serialNumber: 'APC-3K-BV442', barcode: 'BC-UPS-001241', type: 'UPS', currentLocation: 'Server Room B2 - Rack A3', condition: 'Fair', result: 'damaged', notes: 'Battery capacity degraded to 65%. Replacement needed.', photos: 2, lastScanned: '2026-02-28T09:25:00' },
  { id: '5', assetId: 'SRV-001242', name: 'Lenovo ThinkSystem SR650', serialNumber: 'LS-SR650-TT781', barcode: 'BC-SRV-001242', type: 'Server', currentLocation: 'Server Room B2 - Rack B1', condition: 'Good', result: 'verified', notes: '', photos: 0, lastScanned: '2026-02-28T09:30:00' },
  { id: '6', assetId: 'NET-001243', name: 'Juniper EX4300', serialNumber: 'JN-EX43-PP912', barcode: 'BC-NET-001243', type: 'Switch', currentLocation: 'Server Room B2 - Rack B2', condition: '', result: 'missing', notes: 'Switch not found in expected location. Last seen in Rack B2 during Q4 audit.', photos: 0 },
  { id: '7', assetId: 'SRV-001244', name: 'HP ProLiant DL360', serialNumber: 'HP-DL360-MM556', barcode: 'BC-SRV-001244', type: 'Server', currentLocation: 'Server Room B2 - Rack B2', condition: 'Good', result: 'requires-action', notes: 'RFID tag damaged. Needs new tag affixed.', photos: 1, lastScanned: '2026-02-28T09:35:00' },
  { id: '8', assetId: 'MON-001245', name: 'Dell U2723QE Monitor', serialNumber: 'DL-U27-RR334', barcode: 'BC-MON-001245', type: 'Monitor', currentLocation: 'Server Room B2 - Console', condition: 'Good', result: 'verified', notes: '', photos: 0, lastScanned: '2026-02-28T09:40:00' },
  { id: '9', assetId: 'SRV-001246', name: 'Dell PowerEdge R640', serialNumber: 'DL-R640-SS778', barcode: 'BC-SRV-001246', type: 'Server', currentLocation: 'Server Room B2 - Rack C1', condition: 'Good', result: 'pending', notes: '', photos: 0 },
  { id: '10', assetId: 'NET-001247', name: 'Cisco ASA 5525-X', serialNumber: 'CS-ASA55-UU990', barcode: 'BC-NET-001247', type: 'Firewall', currentLocation: 'Server Room B2 - Rack C1', condition: '', result: 'pending', notes: '', photos: 0 },
  { id: '11', assetId: 'UPS-001248', name: 'Eaton 5P 1500', serialNumber: 'ET-5P15-WW112', barcode: 'BC-UPS-001248', type: 'UPS', currentLocation: 'Server Room B2 - Rack C2', condition: 'Damaged', result: 'damaged', notes: 'Fan making grinding noise. Replace ASAP.', photos: 3, lastScanned: '2026-02-28T10:00:00' },
  { id: '12', assetId: 'SRV-001249', name: 'HPE Synergy 480', serialNumber: 'HPE-SY480-XX445', barcode: 'BC-SRV-001249', type: 'Server', currentLocation: 'Server Room B2 - Rack C2', condition: '', result: 'pending', notes: '', photos: 0 },
];

const mockReports: InspectionReport[] = [
  { id: '1', taskId: 'INSP-2026-002', title: 'Office Floor 1 Spot Check Report', location: 'Office Floor 1', inspector: 'Jane Smith', generatedDate: '2026-02-20T16:35:00', totalInspected: 15, verified: 14, missing: 0, damaged: 1, verifiedPct: 93, status: 'shared', format: 'pdf' },
  { id: '2', taskId: 'INSP-2026-003', title: 'Warehouse Annual Inventory Count Report', location: 'Warehouse B1', inspector: 'Bob Wilson', generatedDate: '2026-02-17T15:05:00', totalInspected: 87, verified: 82, missing: 3, damaged: 2, verifiedPct: 94, status: 'reviewed', format: 'pdf' },
  { id: '3', taskId: 'INSP-2026-006', title: 'Post-Flood Damage Assessment Report', location: 'Basement Storage', inspector: 'Emily Davis', generatedDate: '2026-02-25T17:10:00', totalInspected: 18, verified: 8, missing: 2, damaged: 6, verifiedPct: 44, status: 'generated', format: 'excel' },
];

const mockAuditTrail: AuditEntry[] = [
  { id: '1', taskId: 'INSP-2026-001', action: 'Task Created', user: 'Admin User', timestamp: '2026-02-25T08:00:00', details: 'Created Q1 Server Room inspection task', type: 'create' },
  { id: '2', taskId: 'INSP-2026-001', action: 'Task Assigned', user: 'Admin User', timestamp: '2026-02-25T08:05:00', details: 'Assigned to John Doe', type: 'status' },
  { id: '3', taskId: 'INSP-2026-001', action: 'Batch Synced to PDA', user: 'John Doe', timestamp: '2026-02-28T08:45:00', details: '24 assets synced to device PDA-RF88-003', type: 'sync' },
  { id: '4', taskId: 'INSP-2026-001', action: 'Inspection Started', user: 'John Doe', timestamp: '2026-02-28T09:00:00', details: 'Inspector began on-site verification', type: 'status' },
  { id: '5', taskId: 'INSP-2026-001', action: 'Asset Scanned', user: 'John Doe', timestamp: '2026-02-28T09:15:00', details: 'SRV-001238 scanned via barcode - Verified', type: 'scan' },
  { id: '6', taskId: 'INSP-2026-001', action: 'Asset Marked Missing', user: 'John Doe', timestamp: '2026-02-28T09:32:00', details: 'NET-001243 not found at expected location', type: 'update' },
  { id: '7', taskId: 'INSP-2026-001', action: 'Photo Captured', user: 'John Doe', timestamp: '2026-02-28T09:36:00', details: 'Damage evidence photo for UPS-001241', type: 'update' },
  { id: '8', taskId: 'INSP-2026-002', action: 'Task Created', user: 'Jane Smith', timestamp: '2026-02-20T13:00:00', details: 'Office Floor 1 spot check initiated', type: 'create' },
  { id: '9', taskId: 'INSP-2026-002', action: 'Inspection Completed', user: 'Jane Smith', timestamp: '2026-02-20T16:30:00', details: 'All 15 assets inspected', type: 'status' },
  { id: '10', taskId: 'INSP-2026-002', action: 'Inspector Sign-off', user: 'Jane Smith', timestamp: '2026-02-20T16:30:00', details: 'Digital signature captured', type: 'signature' },
  { id: '11', taskId: 'INSP-2026-002', action: 'Supervisor Approved', user: 'Admin Manager', timestamp: '2026-02-21T09:00:00', details: 'Reviewed and approved inspection results', type: 'signature' },
  { id: '12', taskId: 'INSP-2026-002', action: 'Report Auto-Generated', user: 'System', timestamp: '2026-02-20T16:35:00', details: 'PDF report generated and stored', type: 'create' },
  { id: '13', taskId: 'INSP-2026-003', action: 'Inspector Sign-off', user: 'Bob Wilson', timestamp: '2026-02-17T15:00:00', details: 'Annual count completed and signed', type: 'signature' },
  { id: '14', taskId: 'INSP-2026-003', action: 'Supervisor Sign-off', user: 'Operations Manager', timestamp: '2026-02-18T10:00:00', details: 'Final sign-off for compliance', type: 'signature' },
  { id: '15', taskId: 'INSP-2026-006', action: 'Offline Data Synced', user: 'Emily Davis', timestamp: '2026-02-25T17:05:00', details: 'Offline inspection data synced from PDA-RF88-007', type: 'sync' },
];

const mockChecklists: ChecklistTemplate[] = [
  { id: '1', name: 'IT Equipment Standard', items: ['Physical condition verified', 'Serial number matches record', 'Barcode/RFID tag readable', 'Location matches system record', 'Operating status checked', 'Accessories accounted for', 'Warranty status noted'], assetType: 'IT Equipment', isDefault: true },
  { id: '2', name: 'General Office', items: ['Physical condition verified', 'Asset tag present and readable', 'Location confirmed', 'Assigned custodian verified'], assetType: 'All', isDefault: false },
  { id: '3', name: 'Vehicle Inspection', items: ['Exterior condition', 'Interior condition', 'Mileage recorded', 'Fuel level noted', 'Tire condition', 'Documents present', 'Safety equipment check'], assetType: 'Vehicles', isDefault: false },
  { id: '4', name: 'Warehouse Full Count', items: ['Physical presence confirmed', 'Barcode scanned', 'Condition assessed', 'Storage location verified', 'Packaging integrity', 'Quantity matches record'], assetType: 'All', isDefault: false },
  { id: '5', name: 'Damage Assessment', items: ['Damage extent documented', 'Photo evidence captured', 'Repair feasibility assessed', 'Insurance documentation needed', 'Safety hazard evaluation', 'Data recovery status'], assetType: 'All', isDefault: false },
];

// ── Component ──

export default function RFIDSettings() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<InspectionTab>('tasks');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTask, setSelectedTask] = useState<InspectionTask | null>(null);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [signOffOpen, setSignOffOpen] = useState(false);
  const [reportPreviewOpen, setReportPreviewOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<InspectionReport | null>(null);
  const [emailReportOpen, setEmailReportOpen] = useState(false);
  const [checklistEditorOpen, setChecklistEditorOpen] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<ChecklistTemplate | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditTypeFilter, setAuditTypeFilter] = useState('all');

  // Pagination
  const [tasksPage, setTasksPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(10);
  const [auditPage, setAuditPage] = useState(1);
  const [auditPerPage, setAuditPerPage] = useState(10);
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsPerPage, setReportsPerPage] = useState(10);

  // Task assets state (for detail view)
  const [taskAssets, setTaskAssets] = useState<TaskAsset[]>(mockTaskAssets);
  const [assetNoteEditing, setAssetNoteEditing] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  // Create task form
  const [newTask, setNewTask] = useState({
    title: '', description: '', location: '', fieldOffice: '', assignedTo: '',
    supervisor: '', custodian: '', assetType: '', scheduledDate: '', dueDate: '',
    priority: 'medium' as string, checklistTemplate: '',
  });

  const tabClass ="px-4 py-2 rounded-[4px] text-[15px] transition-colors flex items-center gap-2";
  const activeTabClass ="bg-[#121321] text-white shadow-sm";
  const inactiveTabClass ="bg-transparent text-[#121321] border border-[#121321]/20[#121321]/5 dark:text-white dark:border-white/20";

  const tabs: { id: InspectionTab; label: string; icon: React.ElementType }[] = [
    { id: 'tasks', label: 'Inspection Tasks', icon: InspectionIcon },
    { id: 'scheduling', label: 'Schedule & Progress', icon: CalendarIcon },
    { id: 'reports', label: 'Reports', icon: PdfIcon },
    { id: 'audit-trail', label: 'Audit Trail', icon: HistoryIcon },
  ];

  // ── Computed Data ──

  const filteredTasks = useMemo(() => {
    return mockTasks.filter(task => {
      const matchesSearch = searchQuery === '' || task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.taskId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesLocation = locationFilter === 'all' || task.fieldOffice === locationFilter;
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [searchQuery, statusFilter, locationFilter]);

  const filteredAudit = useMemo(() => {
    return mockAuditTrail.filter(entry => {
      const matchesSearch = auditSearchQuery === '' ||
        entry.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        entry.details.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        entry.taskId.toLowerCase().includes(auditSearchQuery.toLowerCase());
      const matchesType = auditTypeFilter === 'all' || entry.type === auditTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [auditSearchQuery, auditTypeFilter]);

  const taskStats = useMemo(() => ({
    total: mockTasks.length,
    inProgress: mockTasks.filter(t => t.status === 'in-progress').length,
    completed: mockTasks.filter(t => t.status === 'completed' || t.status === 'signed-off').length,
    overdue: mockTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed' && t.status !== 'signed-off').length,
  }), []);

  // ── Handlers ──

  const handleViewTask = (task: InspectionTask) => {
    setSelectedTask(task);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedTask(null);
  };

  const handleAssetResultChange = (assetId: string, result: AssetResult) => {
    setTaskAssets(prev => prev.map(a => a.id === assetId ? { ...a, result } : a));
    toast.success(`Asset marked as"${getAssetResultLabel(result)}"`);
  };

  const handleSaveAssetNote = (assetId: string) => {
    setTaskAssets(prev => prev.map(a => a.id === assetId ? { ...a, notes: tempNote } : a));
    setAssetNoteEditing(null);
    setTempNote('');
    toast.success('Note saved');
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.scheduledDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success(`Inspection task"${newTask.title}" created successfully`);
    setCreateTaskOpen(false);
    setNewTask({ title: '', description: '', location: '', fieldOffice: '', assignedTo: '', supervisor: '', custodian: '', assetType: '', scheduledDate: '', dueDate: '', priority: 'medium', checklistTemplate: '' });
  };

  const handleSignOff = () => {
    toast.success('Digital sign-off recorded. Report auto-generated.');
    setSignOffOpen(false);
  };

  const getAuditTypeIcon = (type: string) => {
    switch (type) {
      case 'create': return <Plus className="w-4 h-4 text-green-600" />;
      case 'update': return <EditIcon className="w-4 h-4 text-blue-600" />;
      case 'status': return <InspectionIcon className="w-4 h-4 text-amber-600" />;
      case 'signature': return <SignatureIcon className="w-4 h-4 text-purple-600" />;
      case 'scan': return <QrCodeIcon className="w-4 h-4 text-teal-600" />;
      case 'sync': return <SyncIcon className="w-4 h-4 text-cyan-600" />;
      default: return <HistoryIcon className="w-4 h-4" />;
    }
  };

  // ── Task Detail View ──
  if (viewMode === 'detail' && selectedTask) {
    const completedAssets = taskAssets.filter(a => a.result !== 'pending').length;
    const verifiedAssets = taskAssets.filter(a => a.result === 'verified').length;
    const missingAssets = taskAssets.filter(a => a.result === 'missing').length;
    const damagedAssets = taskAssets.filter(a => a.result === 'damaged').length;
    const actAssets = taskAssets.filter(a => a.result === 'requires-action').length;
    const progressPct = taskAssets.length > 0 ? Math.round((completedAssets / taskAssets.length) * 100) : 0;

    return (
      <div className="space-y-6">
        {/* Sign-Off Drawer */}
        <Sheet open={signOffOpen} onOpenChange={setSignOffOpen}>
          <SheetContent side="right" className="!w-full sm:!max-w-xl flex flex-col overflow-hidden">
            <SheetHeader className="pr-8">
              <SheetTitle className="text-[15px] flex items-center gap-2">
                <SignatureIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
                Digital Sign-Off
              </SheetTitle>
              <SheetDescription className="text-[14px]">
                Confirm completion and sign off on this inspection task.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4">
              <div className="bg-muted/50 rounded-[4px] border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Task:</span>
                  <span className="font-medium">{selectedTask.taskId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assets Inspected:</span>
                  <span className="font-medium">{completedAssets} / {taskAssets.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Verified:</span>
                  <span className="font-medium text-green-700">{verifiedAssets}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exceptions:</span>
                  <span className="font-medium text-red-700">{missingAssets + damagedAssets + actAssets}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[15px]">Inspector Name</Label>
                <Input defaultValue={selectedTask.assignedTo} readOnly className="bg-muted/50 h-[52px] text-[15px] placeholder:text-[14px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[15px]">Timestamp</Label>
                <Input value={new Date().toLocaleString()} readOnly className="bg-muted/50 h-[52px] text-[15px] placeholder:text-[14px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[15px]">Signature Confirmation</Label>
                <div className="border-2 border-dashed rounded-[4px] p-8 text-center text-muted-foreground text-[14px]">
                  <SignatureIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  Digital signature area — click to sign
                </div>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-muted-foreground bg-amber-50 dark:bg-amber-900/10 p-3 rounded-[4px]">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>By signing, you confirm all inspection data is accurate. This will auto-generate a report and log the sign-off.</span>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSignOffOpen(false)} className="text-[15px]">Cancel</Button>
                <Button onClick={handleSignOff} className="text-[15px]">
                  <SignatureIcon className="w-4 h-4 mr-2" />
                  Confirm & Sign Off
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Button variant="ghost" size="sm" className="self-start" onClick={handleBackToList}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Inspection Tasks
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{selectedTask.title}</h2>
                <Badge className={getTaskStatusColor(selectedTask.status)}>
                  {getTaskStatusLabel(selectedTask.status)}
                </Badge>
                <Badge className={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-0.5">
                {selectedTask.taskId} &middot; {selectedTask.location} &middot; {selectedTask.fieldOffice}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => toast.info('Simulating barcode scan...')}>
                <QrCodeIcon className="w-4 h-4 mr-2" />
                Scan Asset
              </Button>
              <Button variant="outline" onClick={() => toast.info('Camera opened for photo capture')}>
                <CameraIcon className="w-4 h-4 mr-2" />
                Capture Photo
              </Button>
              <Button onClick={() => setSignOffOpen(true)} disabled={selectedTask.status === 'signed-off'}>
                <SignatureIcon className="w-4 h-4 mr-2" />
                Sign Off
              </Button>
            </div>
          </div>
        </div>

        {/* Task Info & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card><CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Total Assets</p>
            <p className="text-2xl font-bold">{taskAssets.length}</p>
          </CardContent></Card>
          <Card className="border-green-200 dark:border-green-800"><CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Verified</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">{verifiedAssets}</p>
          </CardContent></Card>
          <Card className="border-red-200 dark:border-red-800"><CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Missing</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">{missingAssets}</p>
          </CardContent></Card>
          <Card className="border-orange-200 dark:border-orange-800"><CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Damaged</p>
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{damagedAssets}</p>
          </CardContent></Card>
          <Card className="border-purple-200 dark:border-purple-800"><CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Requires Action</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{actAssets}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Progress</p>
            <p className="text-2xl font-bold">{progressPct}%</p>
            <Progress value={progressPct} className="mt-1 h-2" />
          </CardContent></Card>
        </div>

        {/* Task Details Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-[#121321] dark:text-[#81CCD7]" /> Assignment
            </CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Inspector:</span><span className="font-medium">{selectedTask.assignedTo}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Supervisor:</span><span className="font-medium">{selectedTask.supervisor}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Custodian:</span><span className="font-medium">{selectedTask.custodian}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Checklist:</span><span className="font-medium">{selectedTask.checklistTemplate}</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#121321] dark:text-[#81CCD7]" /> Schedule
            </CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Scheduled:</span><span className="font-medium">{selectedTask.scheduledDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Due:</span><span className="font-medium">{selectedTask.dueDate}</span></div>
              {selectedTask.startedDate && <div className="flex justify-between"><span className="text-muted-foreground">Started:</span><span className="font-medium">{selectedTask.startedDate}</span></div>}
              {selectedTask.completedDate && <div className="flex justify-between"><span className="text-muted-foreground">Completed:</span><span className="font-medium">{selectedTask.completedDate}</span></div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2">
              <SignatureIcon className="w-4 h-4 text-[#121321] dark:text-[#81CCD7]" /> Sign-Off Status
            </CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Inspector:</span>
                {selectedTask.inspectorSignature ? (
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" /> Signed
                  </Badge>
                ) : (
                  <Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-300">
                    <Clock className="w-3 h-3 mr-1" /> Pending
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Supervisor:</span>
                {selectedTask.supervisorSignature ? (
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" /> Signed
                  </Badge>
                ) : (
                  <Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-300">
                    <Clock className="w-3 h-3 mr-1" /> Pending
                  </Badge>
                )}
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Photos:</span><span className="font-medium">{selectedTask.photosAttached} attached</span></div>
            </CardContent>
          </Card>
        </div>

        {/* Asset Verification Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Asset Verification Checklist</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search assets..." className="pl-9 w-64 text-[15px]" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[15px]">Asset ID</TableHead>
                    <TableHead className="text-[15px]">Name</TableHead>
                    <TableHead className="text-[15px]">Barcode</TableHead>
                    <TableHead className="text-[15px]">Location</TableHead>
                    <TableHead className="text-[15px]">Condition</TableHead>
                    <TableHead className="text-[15px]">Status</TableHead>
                    <TableHead className="text-[15px]">Notes</TableHead>
                    <TableHead className="text-right text-[15px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-['Manrope'] text-[15px]">{asset.assetId}</TableCell>
                      <TableCell className="text-[15px]">
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-xs text-muted-foreground">{asset.type}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-['Manrope'] text-[15px]">{asset.barcode}</TableCell>
                      <TableCell className="text-[15px]">{asset.currentLocation}</TableCell>
                      <TableCell className="text-[15px]">{asset.condition || '—'}</TableCell>
                      <TableCell className="text-[15px]">
                        <Select value={asset.result} onValueChange={(v: AssetResult) => handleAssetResultChange(asset.id, v)}>
                          <SelectTrigger className="w-[140px] h-8 text-[15px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                            <SelectItem value="pending">
                              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Pending</span>
                            </SelectItem>
                            <SelectItem value="verified">
                              <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-green-600" /> Verified</span>
                            </SelectItem>
                            <SelectItem value="missing">
                              <span className="flex items-center gap-1.5"><XCircle className="w-3 h-3 text-red-600" /> Missing</span>
                            </SelectItem>
                            <SelectItem value="damaged">
                              <span className="flex items-center gap-1.5"><AlertCircle className="w-3 h-3 text-orange-600" /> Damaged</span>
                            </SelectItem>
                            <SelectItem value="requires-action">
                              <span className="flex items-center gap-1.5"><OverdueIcon className="w-3 h-3 text-purple-600" /> Requires Action</span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-[15px]">
                        {assetNoteEditing === asset.id ? (
                          <div className="flex gap-1">
                            <Input value={tempNote} onChange={(e) => setTempNote(e.target.value)} className="h-8 w-40 text-xs" />
                            <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => handleSaveAssetNote(asset.id)}>
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <button
                            className="text-xs text-left max-w-[160px] truncate text-muted-foreground cursor-pointer"
                            onClick={() => { setAssetNoteEditing(asset.id); setTempNote(asset.notes); }}
                          >
                            {asset.notes || 'Add note...'}
                          </button>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-[15px]">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => toast.info(`Simulating barcode scan for ${asset.assetId}...`)}>
                            <QrCodeIcon className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => toast.info('Camera opened')}>
                            <CameraIcon className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Task Notes */}
        {selectedTask.notes && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Inspector Notes</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{selectedTask.notes}</p></CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ── Main Module View ──

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex items-center justify-end">
        {activeTab === 'tasks' && (
          <Button onClick={() => setCreateTaskOpen(true)} className="text-[15px]">
            <Plus className="w-4 h-4 mr-2" />
            Create Inspection Task
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${tabClass} ${activeTab === tab.id ? activeTabClass : inactiveTabClass}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════ TAB: Inspection Tasks ═══════ */}
      {activeTab === 'tasks' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">Total Tasks</p><p className="text-2xl font-bold">{taskStats.total}</p></div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <ClipboardIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">In Progress</p><p className="text-2xl font-bold">{taskStats.inProgress}</p></div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                  <HourglassIcon className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold">{taskStats.completed}</p></div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <DoneAllIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">Overdue</p><p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p></div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <OverdueIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent></Card>
          </div>

          {/* Filters & Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 text-[15px]" />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] text-[15px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="signed-off">Signed Off</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-[160px] text-[15px]"><SelectValue placeholder="Location" /></SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="all">All Offices</SelectItem>
                      <SelectItem value="Amman Office">Amman Office</SelectItem>
                      <SelectItem value="Bangkok Office">Bangkok Office</SelectItem>
                      <SelectItem value="Melbourne Office">Melbourne Office</SelectItem>
                      <SelectItem value="Phnom Penh Office">Phnom Penh Office</SelectItem>
                      <SelectItem value="Afghanistan Office">Afghanistan Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[15px]">Task ID</TableHead>
                      <TableHead className="text-[15px]">Title</TableHead>
                      <TableHead className="text-[15px]">Location</TableHead>
                      <TableHead className="text-[15px]">Assigned To</TableHead>
                      <TableHead className="text-[15px]">Due Date</TableHead>
                      <TableHead className="text-[15px]">Priority</TableHead>
                      <TableHead className="text-[15px]">Progress</TableHead>
                      <TableHead className="text-[15px]">Status</TableHead>
                      <TableHead className="text-right text-[15px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginateData(filteredTasks, tasksPage, tasksPerPage).map((task) => (
                      <TableRow key={task.id} className="cursor-pointer/50" onClick={() => handleViewTask(task)}>
                        <TableCell className="font-['Manrope'] text-[15px]">{task.taskId}</TableCell>
                        <TableCell className="text-[15px]">
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-xs text-muted-foreground">{task.fieldOffice}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[15px]">{task.location}</TableCell>
                        <TableCell className="text-[15px]">{task.assignedTo}</TableCell>
                        <TableCell className="text-[15px]">{task.dueDate}</TableCell>
                        <TableCell className="text-[15px]"><Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge></TableCell>
                        <TableCell className="text-[15px]">
                          <div className="flex items-center gap-2">
                            <Progress value={task.progress} className="h-2 w-16" />
                            <span className="text-xs text-muted-foreground">{task.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-[15px]"><Badge className={getTaskStatusColor(task.status)}>{getTaskStatusLabel(task.status)}</Badge></TableCell>
                        <TableCell className="text-right text-[15px]">
                          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleViewTask(task); }}>
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredTasks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          <InspectionIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No inspection tasks found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <TablePagination page={tasksPage - 1} totalItems={filteredTasks.length} rowsPerPage={tasksPerPage} onPageChange={(p) => setTasksPage(p + 1)} onRowsPerPageChange={(v) => { setTasksPerPage(v); setTasksPage(1); }} totalUnfilteredItems={mockTasks.length} itemLabel="tasks" />
            </CardContent>
          </Card>
        </>
      )}

      {/* ═══════ TAB: Schedule & Progress ═══════ */}
      {activeTab === 'scheduling' && (
        <>
          {/* Progress by Location */}
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Inspections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
                  Upcoming Inspections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTasks.filter(t => t.status === 'assigned' || t.status === 'draft').map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-[4px] border/30 cursor-pointer" onClick={() => handleViewTask(task)}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${task.priority === 'critical' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                        <div>
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{task.assignedTo} &middot; {task.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{task.scheduledDate}</p>
                        <Badge className={getTaskStatusColor(task.status)} >{getTaskStatusLabel(task.status)}</Badge>
                      </div>
                    </div>
                  ))}
                  {mockTasks.filter(t => t.status === 'assigned' || t.status === 'draft').length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No upcoming inspections</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Overdue Inspections */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <OverdueIcon className="w-5 h-5" />
                  Overdue Inspections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed' && t.status !== 'signed-off').length === 0 ? (
                    <div className="text-center py-6">
                      <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-500 opacity-50" />
                      <p className="text-sm text-muted-foreground">No overdue inspections</p>
                    </div>
                  ) : (
                    mockTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed' && t.status !== 'signed-off').map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3 rounded-[4px] border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10 cursor-pointer" onClick={() => handleViewTask(task)}>
                        <div>
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{task.assignedTo} &middot; Due: {task.dueDate}</p>
                        </div>
                        <Badge className="bg-red-500/10 text-red-700 dark:text-red-300">Overdue</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assignment by Custodian */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
                Inspector Workload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[15px]">Inspector</TableHead>
                      <TableHead className="text-[15px]">Active Tasks</TableHead>
                      <TableHead className="text-[15px]">Completed</TableHead>
                      <TableHead className="text-[15px]">Total Assets</TableHead>
                      <TableHead className="text-[15px]">Verified Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: 'John Doe', active: 1, completed: 0, assets: 24, rate: 75 },
                      { name: 'Jane Smith', active: 0, completed: 1, assets: 15, rate: 93 },
                      { name: 'Bob Wilson', active: 0, completed: 1, assets: 87, rate: 94 },
                      { name: 'Mike Torres', active: 1, completed: 0, assets: 36, rate: 0 },
                      { name: 'Sarah Chen', active: 0, completed: 0, assets: 12, rate: 0 },
                      { name: 'Emily Davis', active: 0, completed: 1, assets: 18, rate: 44 },
                    ].map((inspector) => (
                      <TableRow key={inspector.name}>
                        <TableCell className="font-medium text-[15px]">{inspector.name}</TableCell>
                        <TableCell className="text-[15px]">{inspector.active}</TableCell>
                        <TableCell className="text-[15px]">{inspector.completed}</TableCell>
                        <TableCell className="text-[15px]">{inspector.assets}</TableCell>
                        <TableCell className="text-[15px]">
                          <div className="flex items-center gap-2">
                            <Progress value={inspector.rate} className="h-2 w-16" />
                            <span className="text-xs">{inspector.rate}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ═══════ TAB: Reports ═══════ */}
      {activeTab === 'reports' && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PdfIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
                  Auto-Generated Inspection Reports
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">Reports are automatically generated upon task completion and sign-off.</p>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[15px]">Report</TableHead>
                      <TableHead className="text-[15px]">Task ID</TableHead>
                      <TableHead className="text-[15px]">Inspector</TableHead>
                      <TableHead className="text-[15px]">Generated</TableHead>
                      <TableHead className="text-[15px]">Results</TableHead>
                      <TableHead className="text-[15px]">Verified %</TableHead>
                      <TableHead className="text-[15px]">Status</TableHead>
                      <TableHead className="text-right text-[15px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginateData(mockReports, reportsPage, reportsPerPage).map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="text-[15px]">
                          <div className="flex items-center gap-2">
                            {report.format === 'pdf' ? <PdfIcon className="w-4 h-4 text-red-500" /> : <ExcelIcon className="w-4 h-4 text-green-600" />}
                            <div>
                              <div className="font-medium text-sm">{report.title}</div>
                              <div className="text-xs text-muted-foreground">{report.location}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-['Manrope'] text-[15px]">{report.taskId}</TableCell>
                        <TableCell className="text-[15px]">{report.inspector}</TableCell>
                        <TableCell className="text-[15px]">{formatDate(report.generatedDate)}</TableCell>
                        <TableCell className="text-[15px]">
                          <div className="text-xs space-y-0.5">
                            <div>{report.totalInspected} inspected</div>
                            <div className="text-green-700 dark:text-green-400">{report.verified} verified</div>
                            {report.missing > 0 && <div className="text-red-700 dark:text-red-400">{report.missing} missing</div>}
                            {report.damaged > 0 && <div className="text-orange-700 dark:text-orange-400">{report.damaged} damaged</div>}
                          </div>
                        </TableCell>
                        <TableCell className="text-[15px]">
                          <div className="flex items-center gap-2">
                            <Progress value={report.verifiedPct} className="h-2 w-12" />
                            <span className="text-xs font-medium">{report.verifiedPct}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-[15px]">
                          <Badge className={report.status === 'shared' ? 'bg-green-500/10 text-green-700 dark:text-green-300' : report.status === 'reviewed' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300' : 'bg-gray-500/10 text-gray-700 dark:text-gray-300'}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[15px]">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedReport(report); setReportPreviewOpen(true); }}>
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => toast.success(`Downloading ${report.format.toUpperCase()} report...`)}>
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedReport(report); setEmailReportOpen(true); }}>
                              <EmailIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <TablePagination page={reportsPage - 1} totalItems={mockReports.length} rowsPerPage={reportsPerPage} onPageChange={(p) => setReportsPage(p + 1)} onRowsPerPageChange={(v) => { setReportsPerPage(v); setReportsPage(1); }} totalUnfilteredItems={mockReports.length} itemLabel="reports" />
            </CardContent>
          </Card>
        </>
      )}

      {/* ═══════ TAB: Audit Trail ═══════ */}
      {activeTab === 'audit-trail' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <HistoryIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
                Inspection Audit Trail
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => toast.success('Exporting audit log...')}>
                <Download className="w-4 h-4 mr-2" /> Export Log
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search audit trail..." value={auditSearchQuery} onChange={(e) => setAuditSearchQuery(e.target.value)} className="pl-9 text-[15px]" />
              </div>
              <Select value={auditTypeFilter} onValueChange={setAuditTypeFilter}>
                <SelectTrigger className="w-[150px] text-[15px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="signature">Signature</SelectItem>
                  <SelectItem value="scan">Scan</SelectItem>
                  <SelectItem value="sync">Sync</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 text-[15px]"></TableHead>
                    <TableHead className="text-[15px]">Timestamp</TableHead>
                    <TableHead className="text-[15px]">Task ID</TableHead>
                    <TableHead className="text-[15px]">Action</TableHead>
                    <TableHead className="text-[15px]">User</TableHead>
                    <TableHead className="text-[15px]">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginateData(filteredAudit, auditPage, auditPerPage).map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-[15px]">{getAuditTypeIcon(entry.type)}</TableCell>
                      <TableCell className="text-[15px]">{new Date(entry.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="font-['Manrope'] text-[15px]">{entry.taskId}</TableCell>
                      <TableCell className="font-medium text-[15px]">{entry.action}</TableCell>
                      <TableCell className="text-[15px]">{entry.user}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate text-[15px]">{entry.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <TablePagination page={auditPage - 1} totalItems={filteredAudit.length} rowsPerPage={auditPerPage} onPageChange={(p) => setAuditPage(p + 1)} onRowsPerPageChange={(v) => { setAuditPerPage(v); setAuditPage(1); }} totalUnfilteredItems={mockAuditTrail.length} itemLabel="entries" />
          </CardContent>
        </Card>
      )}

      {/* ═══════ DRAWERS & DIALOGS ═══════ */}

      {/* Create Inspection Task Drawer */}
      <Sheet open={createTaskOpen} onOpenChange={(open) => { if (!open) setCreateTaskOpen(false); }}>
        <SheetContent side="right" className="!w-full sm:!max-w-xl flex flex-col overflow-hidden">
          <SheetHeader className="pr-8">
            <SheetTitle className="text-[15px]">Create Inspection Task</SheetTitle>
            <SheetDescription className="text-[14px]">Assign a new physical inspection task by location, custodian, or asset type.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-6">
            <div className="space-y-4">
              <h3 className="text-[14px] text-muted-foreground">Task Details</h3>
              <div className="space-y-2">
                <Label className="text-[15px]">Title <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g., Q1 Server Room Inspection" value={newTask.title} onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))} className="h-[52px] text-[15px] placeholder:text-[14px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[15px]">Description</Label>
                <Textarea placeholder="Describe the inspection scope..." value={newTask.description} onChange={(e) => setNewTask(p => ({ ...p, description: e.target.value }))} rows={3} className="text-[15px] placeholder:text-[14px]" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[14px] text-muted-foreground">Assignment</h3>
              <div className="space-y-2">
                <Label className="text-[15px]">Assign To (Inspector) <span className="text-red-500">*</span></Label>
                <Select value={newTask.assignedTo} onValueChange={(v) => setNewTask(p => ({ ...p, assignedTo: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select inspector" /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    <SelectItem value="Bob Wilson">Bob Wilson</SelectItem>
                    <SelectItem value="Mike Torres">Mike Torres</SelectItem>
                    <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                    <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[15px]">Supervisor (Approver)</Label>
                <Select value={newTask.supervisor} onValueChange={(v) => setNewTask(p => ({ ...p, supervisor: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select supervisor" /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="IT Director">IT Director</SelectItem>
                    <SelectItem value="Admin Manager">Admin Manager</SelectItem>
                    <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                    <SelectItem value="Fleet Manager">Fleet Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[15px]">Custodian / Department</Label>
                <Input placeholder="e.g., IT Department" value={newTask.custodian} onChange={(e) => setNewTask(p => ({ ...p, custodian: e.target.value }))} className="h-[52px] text-[15px] placeholder:text-[14px]" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[14px] text-muted-foreground">Scope</h3>
              <div className="space-y-2">
                <Label className="text-[15px]">Field Office <span className="text-red-500">*</span></Label>
                <Select value={newTask.fieldOffice} onValueChange={(v) => setNewTask(p => ({ ...p, fieldOffice: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select field office" /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="Amman Office">Amman Office</SelectItem>
                    <SelectItem value="Bangkok Office">Bangkok Office</SelectItem>
                    <SelectItem value="Melbourne Office">Melbourne Office</SelectItem>
                    <SelectItem value="Phnom Penh Office">Phnom Penh Office</SelectItem>
                    <SelectItem value="Afghanistan Office">Afghanistan Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[15px]">Location</Label>
                <Input placeholder="e.g., Server Room B2, Warehouse B1" value={newTask.location} onChange={(e) => setNewTask(p => ({ ...p, location: e.target.value }))} className="h-[52px] text-[15px] placeholder:text-[14px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[15px]">Asset Type</Label>
                <Select value={newTask.assetType} onValueChange={(v) => setNewTask(p => ({ ...p, assetType: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="All asset types" /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Vehicles">Vehicles</SelectItem>
                    <SelectItem value="Networking">Networking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[14px] text-muted-foreground">Schedule & Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[15px]">Scheduled Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={newTask.scheduledDate} onChange={(e) => setNewTask(p => ({ ...p, scheduledDate: e.target.value }))} className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[15px]">Due Date</Label>
                  <Input type="date" value={newTask.dueDate} onChange={(e) => setNewTask(p => ({ ...p, dueDate: e.target.value }))} className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[15px]">Priority</Label>
                <Select value={newTask.priority} onValueChange={(v) => setNewTask(p => ({ ...p, priority: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[15px]">Checklist Template</Label>
                <Select value={newTask.checklistTemplate} onValueChange={(v) => setNewTask(p => ({ ...p, checklistTemplate: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select checklist template" /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {mockChecklists.map(cl => (
                      <SelectItem key={cl.id} value={cl.name}>{cl.name} ({cl.items.length} items)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="bg-muted/50 rounded-[4px] border p-4 mb-20">
              <p className="text-[14px] text-muted-foreground mb-2 font-medium">Inspection Task Tips</p>
              <div className="space-y-1 text-[14px] text-muted-foreground">
                <p>- Only assigned inspection batches will be synced to PDA devices</p>
                <p>- Inspectors can work offline and sync results when reconnected</p>
                <p>- A report is auto-generated upon completion and sign-off</p>
                <p>- Supervisor confirmation is optional but recommended for compliance</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateTaskOpen(false)} className="text-[15px]">Cancel</Button>
              <Button onClick={handleCreateTask} className="text-[15px]">Create Task</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Report Preview Dialog */}
      <Dialog open={reportPreviewOpen} onOpenChange={setReportPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
            <DialogDescription>{selectedReport?.title}</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="border rounded-[4px] p-6 space-y-4 bg-white dark:bg-gray-950">
                <div className="text-center border-b pb-4">
                  <h3 className="text-lg font-bold">Inspection Report</h3>
                  <p className="text-sm text-muted-foreground">{selectedReport.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">Generated: {new Date(selectedReport.generatedDate).toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Task ID:</span> <span className="font-medium">{selectedReport.taskId}</span></div>
                  <div><span className="text-muted-foreground">Location:</span> <span className="font-medium">{selectedReport.location}</span></div>
                  <div><span className="text-muted-foreground">Inspector:</span> <span className="font-medium">{selectedReport.inspector}</span></div>
                  <div><span className="text-muted-foreground">Format:</span> <span className="font-medium uppercase">{selectedReport.format}</span></div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Summary Statistics</h4>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="bg-muted/50 rounded-[4px] p-3">
                      <p className="text-2xl font-bold">{selectedReport.totalInspected}</p>
                      <p className="text-xs text-muted-foreground">Total Inspected</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/10 rounded-[4px] p-3">
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">{selectedReport.verified}</p>
                      <p className="text-xs text-muted-foreground">Verified</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/10 rounded-[4px] p-3">
                      <p className="text-2xl font-bold text-red-700 dark:text-red-400">{selectedReport.missing}</p>
                      <p className="text-xs text-muted-foreground">Missing</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/10 rounded-[4px] p-3">
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{selectedReport.damaged}</p>
                      <p className="text-xs text-muted-foreground">Damaged</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-muted/30 p-3 rounded-[4px]">
                  <span className="font-medium">Verification Rate:</span>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedReport.verifiedPct} className="h-3 w-32" />
                    <span className="font-bold">{selectedReport.verifiedPct}%</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => toast.success('Downloading report...')}>
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                <Button variant="outline" onClick={() => toast.success('Printing report...')}>
                  <PrintIcon className="w-4 h-4 mr-2" /> Print
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Report Dialog */}
      <Dialog open={emailReportOpen} onOpenChange={setEmailReportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <EmailIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
              Email Report
            </DialogTitle>
            <DialogDescription>Send this inspection report to focal points.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Recipients <span className="text-red-500">*</span></Label>
              <Input placeholder="email@company.com, another@company.com" />
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input defaultValue={`Inspection Report: ${selectedReport?.title || ''}`} />
            </div>
            <div className="space-y-2">
              <Label>Message (Optional)</Label>
              <Textarea placeholder="Add a message..." rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEmailReportOpen(false)}>Cancel</Button>
              <Button onClick={() => { toast.success('Report emailed successfully'); setEmailReportOpen(false); }}>
                <SendIcon className="w-4 h-4 mr-2" /> Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Checklist Editor Drawer */}
      <Sheet open={checklistEditorOpen} onOpenChange={(open) => { if (!open) setChecklistEditorOpen(false); }}>
        <SheetContent side="right" className="!w-full sm:!max-w-xl flex flex-col overflow-hidden">
          <SheetHeader className="pr-8">
            <SheetTitle className="text-[15px]">{editingChecklist ? 'Edit Checklist Template' : 'New Checklist Template'}</SheetTitle>
            <SheetDescription className="text-[14px]">Define the inspection checklist items for this template.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[15px]">Template Name <span className="text-red-500">*</span></Label>
                <Input defaultValue={editingChecklist?.name || ''} placeholder="e.g., IT Equipment Standard" className="h-[52px] text-[15px] placeholder:text-[14px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[15px]">Asset Type</Label>
                <Select defaultValue={editingChecklist?.assetType || 'All'}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Vehicles">Vehicles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[14px] text-muted-foreground">Checklist Items</h3>
              <div className="space-y-2">
                {(editingChecklist?.items || ['Physical condition verified', 'Serial number matches record', 'Barcode/tag readable', 'Location confirmed']).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[14px] text-muted-foreground w-6">{i + 1}.</span>
                    <Input defaultValue={item} className="flex-1 h-[52px] text-[15px] placeholder:text-[14px]" />
                    <Button size="sm" variant="ghost" className="h-8 px-2 text-red-500">
                      <DeleteIcon className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch defaultChecked={editingChecklist?.isDefault || false} />
              <Label className="text-[15px]">Set as default template for this asset type</Label>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setChecklistEditorOpen(false)} className="text-[15px]">Cancel</Button>
              <Button onClick={() => { toast.success(`Checklist template ${editingChecklist ? 'updated' : 'created'} successfully`); setChecklistEditorOpen(false); }} className="text-[15px]">
                {editingChecklist ? 'Save Changes' : 'Create Template'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

