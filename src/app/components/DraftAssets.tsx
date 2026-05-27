import React, { useState, useMemo, useCallback } from 'react';
import { formatDate } from '../utils/dateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { TableSkeleton } from './shared/SkeletonLoaders';
import { TablePagination, paginateData } from './shared/TablePagination';
import { DeleteConfirmDialog } from './shared/DeleteConfirmDialog';
import {
  Search,
  Sync as RefreshIcon,
  Upload,
  Visibility as Eye,
  Delete as Trash2,
  CheckCircle,
  Warning as AlertCircle,
  Edit as EditIcon,
  Timeline as TimelineIcon,
  Close as XIcon,
  Description as FileText,
  LocalShipping as ShippingIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  QrCode as BarcodeIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  MoreHoriz as MoreHorizontal,
  GridOn as TableIcon,
  Download,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { ColumnToggle } from './assets/ColumnToggle';
import type { ColumnConfig } from './assets/types';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface DraftAsset {
  id: string;
  draftId: string;
  poNumber: string;
  grnNumber: string;
  itemDescription: string;
  supplier: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  acquisitionDate: string;
  currency: string;
  classification: 'Capital' | 'Attractive';
  classificationOverridden: boolean;
  assignmentStatus: 'Unassigned' | 'Assigned';
  assignedTo?: string;
  sapSyncTimestamp: string;
  auditTrail: AuditEntry[];
}

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

interface RegistrationForm {
  serialNumber: string;
  fieldOffice: string;
  location: string;
  custodian: string;
  assetCondition: string;
  barcodeTagId: string;
  classificationOverride: string;
}

type UserRole = 'smio' | 'admin' | 'auditor';

// ──────────────────────────────────────────────
// Field Office, Location and Custodian Data
// ──────────────────────────────────────────────

const FIELD_OFFICES = [
  { code: 'FO-HQ', name: 'Headquarters' },
  { code: 'FO-ROE', name: 'Regional Office East' },
  { code: 'FO-ROW', name: 'Regional Office West' },
];

// Field Office to Locations mapping
const FIELD_OFFICE_LOCATIONS: Record<string, string[]> = {
  'FO-HQ': ['Office Floor 1', 'Office A1-01', 'Office A1-02'],
  'FO-ROE': ['Office A1-03', 'Warehouse B1'],
  'FO-ROW': ['Warehouse B2'],
};

// Location-to-Custodian mapping
const LOCATION_CUSTODIANS: Record<string, string[]> = {
  'Office Floor 1': ['John Doe', 'Jane Smith', 'Bob Wilson'],
  'Office A1-01': ['Sarah Chen', 'Michael Tran'],
  'Office A1-02': ['Emily Nguyen', 'David Park'],
  'Office A1-03': ['Lisa Wang', 'Ahmed Hassan'],
  'Warehouse B1': ['Maria Garcia', 'John Doe'],
  'Warehouse B2': ['Bob Wilson', 'Sarah Chen'],
};

// ──────────────────────────────────────────────
// Mock Data
// ──────────────────────────────────────────────

const MOCK_DRAFTS: DraftAsset[] = [
  {
    id: '1', draftId: 'DRF-2026-0001', poNumber: 'PO-4500012345', grnNumber: 'GRN-5000001001',
    itemDescription: 'Dell Latitude 5540 Laptop', supplier: 'Dell Technologies', quantity: 1,
    unitPrice: 1450.00, totalCost: 1450.00, acquisitionDate: '2026-02-20', currency: 'USD',
    classification: 'Capital', classificationOverridden: false, assignmentStatus: 'Unassigned',
    sapSyncTimestamp: '2026-02-20T08:30:00Z',
    auditTrail: [
      { id: 'a1', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-20T08:30:00Z', details: 'GRN-5000001001 posted in SAP ECC 6.0' },
    ],
  },
  {
    id: '2', draftId: 'DRF-2026-0002', poNumber: 'PO-4500012345', grnNumber: 'GRN-5000001001',
    itemDescription: 'Dell U2723QE 27" Monitor', supplier: 'Dell Technologies', quantity: 2,
    unitPrice: 620.00, totalCost: 1240.00, acquisitionDate: '2026-02-20', currency: 'USD',
    classification: 'Attractive', classificationOverridden: false, assignmentStatus: 'Unassigned',
    sapSyncTimestamp: '2026-02-20T08:30:00Z',
    auditTrail: [
      { id: 'a2', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-20T08:30:00Z', details: 'GRN-5000001001 posted in SAP ECC 6.0' },
    ],
  },
  {
    id: '3', draftId: 'DRF-2026-0003', poNumber: 'PO-4500012350', grnNumber: 'GRN-5000001005',
    itemDescription: 'Canon imageRUNNER ADVANCE C5560i', supplier: 'Canon Inc.', quantity: 1,
    unitPrice: 8500.00, totalCost: 8500.00, acquisitionDate: '2026-02-18', currency: 'USD',
    classification: 'Capital', classificationOverridden: false, assignmentStatus: 'Assigned',
    assignedTo: 'Field Office Hanoi',
    sapSyncTimestamp: '2026-02-18T14:15:00Z',
    auditTrail: [
      { id: 'a3', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-18T14:15:00Z', details: 'GRN-5000001005 posted in SAP ECC 6.0' },
      { id: 'a4', action: 'Assignment updated', user: 'Admin', timestamp: '2026-02-19T09:00:00Z', details: 'Assigned to Field Office Hanoi' },
    ],
  },
  {
    id: '4', draftId: 'DRF-2026-0004', poNumber: 'PO-4500012355', grnNumber: 'GRN-5000001008',
    itemDescription: 'Lenovo ThinkPad X1 Carbon Gen 11', supplier: 'Lenovo Group Ltd', quantity: 5,
    unitPrice: 1780.00, totalCost: 8900.00, acquisitionDate: '2026-02-15', currency: 'USD',
    classification: 'Capital', classificationOverridden: false, assignmentStatus: 'Unassigned',
    sapSyncTimestamp: '2026-02-15T11:20:00Z',
    auditTrail: [
      { id: 'a5', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-15T11:20:00Z', details: 'GRN-5000001008 posted in SAP ECC 6.0' },
    ],
  },
  {
    id: '5', draftId: 'DRF-2026-0005', poNumber: 'PO-4500012360', grnNumber: 'GRN-5000001010',
    itemDescription: 'HP LaserJet Enterprise M507dn', supplier: 'HP Inc.', quantity: 3,
    unitPrice: 450.00, totalCost: 1350.00, acquisitionDate: '2026-02-14', currency: 'USD',
    classification: 'Attractive', classificationOverridden: false, assignmentStatus: 'Assigned',
    assignedTo: 'Field Office HCMC',
    sapSyncTimestamp: '2026-02-14T09:45:00Z',
    auditTrail: [
      { id: 'a6', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-14T09:45:00Z', details: 'GRN-5000001010 posted in SAP ECC 6.0' },
      { id: 'a7', action: 'Assignment updated', user: 'Admin', timestamp: '2026-02-14T15:30:00Z', details: 'Assigned to Field Office HCMC' },
    ],
  },
  {
    id: '6', draftId: 'DRF-2026-0006', poNumber: 'PO-4500012365', grnNumber: 'GRN-5000001012',
    itemDescription: 'Cisco Catalyst 9200L Switch', supplier: 'Cisco Systems', quantity: 2,
    unitPrice: 3200.00, totalCost: 6400.00, acquisitionDate: '2026-02-12', currency: 'USD',
    classification: 'Capital', classificationOverridden: false, assignmentStatus: 'Unassigned',
    sapSyncTimestamp: '2026-02-12T07:00:00Z',
    auditTrail: [
      { id: 'a8', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-12T07:00:00Z', details: 'GRN-5000001012 posted in SAP ECC 6.0' },
    ],
  },
  {
    id: '7', draftId: 'DRF-2026-0007', poNumber: 'PO-4500012370', grnNumber: 'GRN-5000001015',
    itemDescription: 'Samsung Galaxy Tab S9 FE', supplier: 'Samsung Electronics', quantity: 10,
    unitPrice: 380.00, totalCost: 3800.00, acquisitionDate: '2026-02-10', currency: 'USD',
    classification: 'Attractive', classificationOverridden: false, assignmentStatus: 'Unassigned',
    sapSyncTimestamp: '2026-02-10T10:30:00Z',
    auditTrail: [
      { id: 'a9', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-10T10:30:00Z', details: 'GRN-5000001015 posted in SAP ECC 6.0' },
    ],
  },
  {
    id: '8', draftId: 'DRF-2026-0008', poNumber: 'PO-4500012375', grnNumber: 'GRN-5000001018',
    itemDescription: 'Epson WorkForce Pro WF-C5890', supplier: 'Epson America', quantity: 1,
    unitPrice: 550.00, totalCost: 550.00, acquisitionDate: '2026-02-08', currency: 'USD',
    classification: 'Attractive', classificationOverridden: false, assignmentStatus: 'Assigned',
    assignedTo: 'Field Office Da Nang',
    sapSyncTimestamp: '2026-02-08T13:00:00Z',
    auditTrail: [
      { id: 'a10', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-08T13:00:00Z', details: 'GRN-5000001018 posted in SAP ECC 6.0' },
      { id: 'a11', action: 'Assignment updated', user: 'Admin', timestamp: '2026-02-09T08:00:00Z', details: 'Assigned to Field Office Da Nang' },
    ],
  },
  {
    id: '9', draftId: 'DRF-2026-0009', poNumber: 'PO-4500012380', grnNumber: 'GRN-5000001020',
    itemDescription: 'Microsoft Surface Pro 10', supplier: 'Microsoft Corporation', quantity: 4,
    unitPrice: 1599.00, totalCost: 6396.00, acquisitionDate: '2026-02-05', currency: 'USD',
    classification: 'Capital', classificationOverridden: false, assignmentStatus: 'Unassigned',
    sapSyncTimestamp: '2026-02-05T16:45:00Z',
    auditTrail: [
      { id: 'a12', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-05T16:45:00Z', details: 'GRN-5000001020 posted in SAP ECC 6.0' },
    ],
  },
  {
    id: '10', draftId: 'DRF-2026-0010', poNumber: 'PO-4500012385', grnNumber: 'GRN-5000001022',
    itemDescription: 'APC Smart-UPS 3000VA', supplier: 'Schneider Electric', quantity: 2,
    unitPrice: 2100.00, totalCost: 4200.00, acquisitionDate: '2026-02-03', currency: 'USD',
    classification: 'Capital', classificationOverridden: false, assignmentStatus: 'Unassigned',
    sapSyncTimestamp: '2026-02-03T12:00:00Z',
    auditTrail: [
      { id: 'a13', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-03T12:00:00Z', details: 'GRN-5000001022 posted in SAP ECC 6.0' },
    ],
  },
  {
    id: '11', draftId: 'DRF-2026-0011', poNumber: 'PO-4500012390', grnNumber: 'GRN-5000001025',
    itemDescription: 'Logitech MX Keys Combo', supplier: 'Logitech', quantity: 15,
    unitPrice: 199.00, totalCost: 2985.00, acquisitionDate: '2026-02-01', currency: 'USD',
    classification: 'Attractive', classificationOverridden: false, assignmentStatus: 'Unassigned',
    sapSyncTimestamp: '2026-02-01T09:30:00Z',
    auditTrail: [
      { id: 'a14', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-01T09:30:00Z', details: 'GRN-5000001025 posted in SAP ECC 6.0' },
    ],
  },
  {
    id: '12', draftId: 'DRF-2026-0012', poNumber: 'PO-4500012395', grnNumber: 'GRN-5000001028',
    itemDescription: 'Zebra ZT411 RFID Printer', supplier: 'Zebra Technologies', quantity: 1,
    unitPrice: 4200.00, totalCost: 4200.00, acquisitionDate: '2026-01-28', currency: 'USD',
    classification: 'Capital', classificationOverridden: false, assignmentStatus: 'Assigned',
    assignedTo: 'Field Office Hanoi',
    sapSyncTimestamp: '2026-01-28T14:00:00Z',
    auditTrail: [
      { id: 'a15', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-01-28T14:00:00Z', details: 'GRN-5000001028 posted in SAP ECC 6.0' },
      { id: 'a16', action: 'Assignment updated', user: 'Admin', timestamp: '2026-01-29T10:00:00Z', details: 'Assigned to Field Office Hanoi' },
    ],
  },
];

export const DRAFT_COUNT = MOCK_DRAFTS.length;

const CUSTODIANS = [
  'John Doe', 'Jane Smith', 'Bob Wilson', 'Sarah Chen', 'Michael Tran',
  'Emily Nguyen', 'David Park', 'Lisa Wang', 'Ahmed Hassan', 'Maria Garcia',
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Refurbished'];

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

interface DraftAssetsProps {
  onEditDraft?: (draft: DraftAsset) => void;
}

const defaultColumns: ColumnConfig[] = [
  { key: 'draftId', label: 'Draft ID', visible: true, category: 'default' },
  { key: 'poNumber', label: 'PO Number', visible: true, category: 'default' },
  { key: 'grnNumber', label: 'GRN Number', visible: true, category: 'default' },
  { key: 'itemDescription', label: 'Item Description', visible: true, category: 'default' },
  { key: 'quantity', label: 'Qty', visible: true, category: 'default' },
  { key: 'unitPrice', label: 'Unit Price', visible: true, category: 'default' },
  { key: 'totalCost', label: 'Total Cost', visible: true, category: 'default' },
  { key: 'acquisitionDate', label: 'Acq. Date', visible: true, category: 'default' },
  { key: 'classification', label: 'Classification', visible: true, category: 'default' },
  { key: 'assignment', label: 'Assignment', visible: true, category: 'default' },
];

export default function DraftAssets({ onEditDraft }: DraftAssetsProps = {}) {
  const [drafts] = useState<DraftAsset[]>(MOCK_DRAFTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<string>('all');
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('2026-04-14T09:30:00Z'); // Last sync timestamp
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null); // Success message

  // Registration drawer
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<DraftAsset | null>(null);
  const [showAuditTrail, setShowAuditTrail] = useState(false);

  // Detail view
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailDraft, setDetailDraft] = useState<DraftAsset | null>(null);

  // Form state
  const [form, setForm] = useState<RegistrationForm>({
    serialNumber: '',
    fieldOffice: '',
    location: '',
    custodian: '',
    assetCondition: '',
    barcodeTagId: '',
    classificationOverride: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof RegistrationForm, string>>>({});
  const [classificationOverrideActive, setClassificationOverrideActive] = useState(false);

  // Simulated role
  const [userRole] = useState<UserRole>('admin');
  const [draftPage, setDraftPage] = useState(0);
  const [draftRowsPerPage, setDraftRowsPerPage] = useState(10);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<DraftAsset | null>(null);

  const toggleColumn = (key: string) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.key === key ? { ...c, visible: !c.visible } : c,
      ),
    );
  };

  const filteredDrafts = useMemo(() => {
    return drafts.filter((d) => {
      const matchSearch =
        d.draftId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.grnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = classificationFilter === 'all' || d.classification === classificationFilter;
      const matchAssign = assignmentFilter === 'all' || d.assignmentStatus === assignmentFilter;
      return matchSearch && matchClass && matchAssign;
    });
  }, [drafts, searchQuery, classificationFilter, assignmentFilter]);

  // ── SAP Sync ──
  const handleSapSync = useCallback(() => {
    setIsSyncing(true);
    setSyncError(null);
    setSyncSuccess(null);
    
    // Simulate random success/error for demo
    const willSucceed = Math.random() > 0.15; // 85% success rate
    
    setTimeout(() => {
      setIsSyncing(false);
      if (willSucceed) {
        const newDraftsCount = Math.floor(Math.random() * 5); // 0-4 new drafts
        const now = new Date().toISOString();
        setLastSyncTime(now);
        setSyncSuccess(`Sync complete — ${newDraftsCount} new draft${newDraftsCount !== 1 ? 's' : ''} added`);
        toast.success(`SAP sync completed. ${newDraftsCount} new drafts found.`);
        
        // Auto-dismiss success message after 5 seconds
        setTimeout(() => setSyncSuccess(null), 5000);
      } else {
        setSyncError('SAP sync failed. Please retry or contact your administrator.');
        toast.error('SAP sync failed. Please check your connection.');
      }
    }, 2500);
  }, []);

  // ── Registration Drawer ──
  const openRegistration = useCallback((draft: DraftAsset) => {
    if (userRole === 'auditor') {
      toast.error('Auditors have read-only access.');
      return;
    }
    // Use the parent's unified form instead of local form
    if (onEditDraft) {
      onEditDraft(draft);
    } else {
      // Fallback to old behavior if prop not provided
      setSelectedDraft(draft);
      setForm({
        serialNumber: '',
        custodian: '',
        site: '',
        building: '',
        room: '',
        assetCondition: '',
        barcodeTagId: '',
        classificationOverride: '',
      });
      setFormErrors({});
      setClassificationOverrideActive(false);
      setShowAuditTrail(false);
      setRegistrationOpen(true);
    }
  }, [userRole, onEditDraft]);

  const openDetail = useCallback((draft: DraftAsset) => {
    setDetailDraft(draft);
    setDetailOpen(true);
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<keyof RegistrationForm, string>> = {};

    if (!form.serialNumber.trim()) {
      errors.serialNumber = 'Serial number is required';
    } else {
      // check duplicate
      const existingSerials = ['SN-EXIST-001', 'SN-EXIST-002'];
      if (existingSerials.includes(form.serialNumber.trim().toUpperCase())) {
        errors.serialNumber = 'Duplicate serial number detected';
      }
    }
    if (!form.fieldOffice) errors.fieldOffice = 'Field office is required';
    if (!form.location) errors.location = 'Location is required';
    if (!form.custodian) errors.custodian = 'Custodian is required';
    if (!form.assetCondition) errors.assetCondition = 'Asset condition is required';
    if (!form.barcodeTagId.trim()) errors.barcodeTagId = 'Barcode / Tag ID is required';

    if (classificationOverrideActive && !form.classificationOverride) {
      errors.classificationOverride = 'Select a classification if overriding';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form, classificationOverrideActive]);

  const handleRegister = useCallback(() => {
    if (!validateForm()) {
      toast.error('Please fix validation errors before submitting.');
      return;
    }
    toast.success(`Asset registered successfully from draft ${selectedDraft?.draftId}`);
    setRegistrationOpen(false);
    setSelectedDraft(null);
  }, [validateForm, selectedDraft]);

  const handleDeleteDraft = useCallback((draft: DraftAsset) => {
    if (userRole !== 'admin') {
      toast.error('Only admins can delete draft entries.');
      return;
    }
    toast.success(`Draft ${draft.draftId} deleted.`);
  }, [userRole]);

  const isFormComplete = useMemo(() => {
    return (
      form.serialNumber.trim() !== '' &&
      form.fieldOffice !== '' &&
      form.location !== '' &&
      form.custodian !== '' &&
      form.assetCondition !== '' &&
      form.barcodeTagId.trim() !== ''
    );
  }, [form]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };


  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────

  return (
    <div className="min-w-0 w-full">
      {/* ── Top Controls ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-muted-foreground">
            {filteredDrafts.length} draft{filteredDrafts.length !== 1 ? 's' : ''} pending completion
          </div>
          {lastSyncTime && (
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <RefreshIcon className="w-3 h-3" />
              Last synced: {formatTimestamp(lastSyncTime)}
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleSapSync} disabled={isSyncing}>
            <RefreshIcon className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync from SAP'}
          </Button>
          
          
        </div>
      </div>

      {/* ── Sync Error ── */}
      {syncError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{syncError}</span>
            <Button variant="ghost" size="sm" onClick={handleSapSync}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Sync Success ── */}
      {syncSuccess && (
        <Alert className="mb-4 flex items-center border-green-500/30 bg-green-50/50 dark:bg-green-900/10">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="flex items-center justify-between text-green-900 dark:text-green-100">
            <span>{syncSuccess}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Filters ── */}
      <Card className="min-w-0 overflow-hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search Draft ID, PO, GRN, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-[15px]"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Select value={classificationFilter} onValueChange={setClassificationFilter}>
                <SelectTrigger className="w-36 h-10 text-[15px]">
                  <SelectValue placeholder="Classification" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all" className="text-[15px]">All Classes</SelectItem>
                  <SelectItem value="Capital" className="text-[15px]">Capital</SelectItem>
                  <SelectItem value="Attractive" className="text-[15px]">Attractive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                <SelectTrigger className="w-36 h-10 text-[15px]">
                  <SelectValue placeholder="Assignment" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="all" className="text-[15px]">All Status</SelectItem>
                  <SelectItem value="Assigned" className="text-[15px]">Assigned</SelectItem>
                  <SelectItem value="Unassigned" className="text-[15px]">Unassigned</SelectItem>
                </SelectContent>
              </Select>
              <ColumnToggle columns={columns} onToggle={toggleColumn} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('Downloading assets as Excel...')}
                    className="h-8 w-10"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download as Excel</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Loading State */}
          {isSyncing ? (
            <TableSkeleton rows={6} columns={8} />
          ) : filteredDrafts.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-auto max-w-full max-h-[calc(100vh-370px)] scrollbar-hide">
                <Table className="min-w-[1200px]">
                  <TableHeader>
                    <TableRow>
                      {columns.filter(col => col.visible).map(col => (
                        <TableHead
                          key={col.key}
                          className={
                            col.key === 'itemDescription' ? 'min-w-[180px] text-[15px]' :
                            (col.key === 'quantity' || col.key === 'unitPrice' || col.key === 'totalCost') ? 'text-right text-[15px]' : 'text-[15px]'
                          }
                        >
                          {col.label}
                        </TableHead>
                      ))}
                      <TableHead className="w-36 text-[15px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginateData(filteredDrafts, draftPage, draftRowsPerPage).map((draft) => (
                      <TableRow key={draft.id} className="/50">
                        {columns.filter(col => col.visible).map(col => {
                          if (col.key === 'draftId' || col.key === 'poNumber' || col.key === 'grnNumber') {
                            return <TableCell key={col.key} className="text-[15px] font-['Manrope']">{draft[col.key]}</TableCell>;
                          } else if (col.key === 'itemDescription') {
                            return (
                              <TableCell key={col.key} className="max-w-[220px] truncate text-[15px]" title={draft.itemDescription}>
                                {draft.itemDescription}
                              </TableCell>
                            );
                          } else if (col.key === 'quantity') {
                            return <TableCell key={col.key} className="text-right text-[15px] font-['Manrope']">{draft.quantity}</TableCell>;
                          } else if (col.key === 'unitPrice') {
                            return (
                              <TableCell key={col.key} className="text-right text-[15px] font-['Manrope']">
                                {formatCurrency(draft.unitPrice, draft.currency)}
                              </TableCell>
                            );
                          } else if (col.key === 'totalCost') {
                            return (
                              <TableCell key={col.key} className="text-right text-[15px] font-['Manrope']">
                                {formatCurrency(draft.totalCost, draft.currency)}
                              </TableCell>
                            );
                          } else if (col.key === 'acquisitionDate') {
                            return <TableCell key={col.key} className="whitespace-nowrap text-[15px]">{formatDate(draft.acquisitionDate)}</TableCell>;
                          } else if (col.key === 'classification') {
                            return (
                              <TableCell key={col.key} className="text-[15px]">
                                {draft.unitPrice >= 2000 ? 'Capital' : 'Attractive'}
                              </TableCell>
                            );
                          } else if (col.key === 'assignment') {
                            return (
                              <TableCell key={col.key} className="text-[15px]">
                                {draft.assignmentStatus}
                              </TableCell>
                            );
                          }
                          return <TableCell key={col.key} className="text-[15px]">—</TableCell>;
                        })}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="w-4 h-4 rotate-90" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {userRole !== 'auditor' && (
                                <DropdownMenuItem onClick={() => openRegistration(draft)}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Complete Registration
                                </DropdownMenuItem>
                              )}
                              {userRole === 'admin' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setDraftToDelete(draft);
                                      setDeleteConfirmOpen(true);
                                    }}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Draft
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                totalItems={filteredDrafts.length}
                page={draftPage}
                rowsPerPage={draftRowsPerPage}
                onPageChange={setDraftPage}
                onRowsPerPageChange={setDraftRowsPerPage}
                totalUnfilteredItems={drafts.length}
                itemLabel="drafts"
              />
            </div>
          ) : (
            /* ── Empty State ── */
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center opacity-40">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg mb-2">No draft assets from SAP</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Click"Sync from SAP" to fetch new GRN entries.
              </p>
              <Button variant="outline" onClick={handleSapSync}>
                <RefreshIcon className="w-4 h-4 mr-2" />
                Sync from SAP
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ════════════════════════════════════════════════════════════
         REGISTRATION DRAWER
         ════════════════════════════════════════════════════════════ */}
      <Sheet open={registrationOpen} onOpenChange={setRegistrationOpen}>
        <SheetContent side="right" className="!w-full sm:!max-w-xl flex flex-col h-full p-0">
          <SheetHeader className="pr-8 px-6 pt-6 pb-4 shrink-0">
            <SheetTitle className="text-[15px]">Complete Asset Registration</SheetTitle>
            <SheetDescription className="text-[14px]">
              {selectedDraft
                ? `Completing draft ${selectedDraft.draftId} from GRN ${selectedDraft.grnNumber}`
                : ''}
            </SheetDescription>
          </SheetHeader>

          {selectedDraft && (
            <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-6">
              {/* ── SAP Pre-filled Data (read-only) ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <LockIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Pre-filled from SAP (read-only)</span>
                </div>
                <div className="bg-muted/50 rounded-[4px] border p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">PO Number</Label>
                      <p className="font-['Manrope'] text-sm">{selectedDraft.poNumber}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">GRN Number</Label>
                      <p className="font-['Manrope'] text-sm">{selectedDraft.grnNumber}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Supplier</Label>
                      <p className="text-sm">{selectedDraft.supplier}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Quantity</Label>
                      <p className="text-sm">{selectedDraft.quantity}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Unit Price</Label>
                      <p className="font-['Manrope'] text-sm">{formatCurrency(selectedDraft.unitPrice, selectedDraft.currency)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Total Cost</Label>
                      <p className="font-['Manrope'] text-sm">{formatCurrency(selectedDraft.totalCost, selectedDraft.currency)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Acquisition Date</Label>
                      <p className="text-sm">{formatDate(selectedDraft.acquisitionDate)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Currency</Label>
                      <p className="text-sm">{selectedDraft.currency}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-xs text-muted-foreground">Item Description</Label>
                    <p className="text-sm">{selectedDraft.itemDescription}</p>
                  </div>
                </div>
              </div>

              {/* ── Classification ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-[15px] font-medium">Classification</Label>
                  <Badge
                    variant="outline"
                    className={
                      selectedDraft.classification === 'Capital'
                        ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700'
                    }
                  >
                    Auto: {selectedDraft.classification}
                  </Badge>
                </div>

                {userRole === 'admin' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="override-classification"
                        checked={classificationOverrideActive}
                        onChange={(e) => {
                          setClassificationOverrideActive(e.target.checked);
                          if (!e.target.checked) {
                            setForm({ ...form, classificationOverride: '' });
                            const newErrors = { ...formErrors };
                            delete newErrors.classificationOverride;
                            setFormErrors(newErrors);
                          }
                        }}
                        className="rounded border-border"
                      />
                      <Label htmlFor="override-classification" className="text-[14px] text-muted-foreground cursor-pointer">
                        Override classification (Admin only)
                      </Label>
                    </div>
                    {classificationOverrideActive && (
                      <>
                        <Alert className="border-[#EF652B]/30 bg-[#EF652B]/5">
                          <AlertCircle className="h-4 w-4 text-[#EF652B]" />
                          <AlertDescription className="text-[14px]">
                            Overriding auto-classification will be logged in the audit trail.
                          </AlertDescription>
                        </Alert>
                        <Select
                          value={form.classificationOverride}
                          onValueChange={(v) => setForm({ ...form, classificationOverride: v })}
                        >
                          <SelectTrigger className={formErrors.classificationOverride ? 'h-[52px] text-[15px] border-red-500' : 'h-[52px] text-[15px]'}>
                            <SelectValue placeholder="Select classification" />
                          </SelectTrigger>
                          <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                            <SelectItem value="Capital">Capital</SelectItem>
                            <SelectItem value="Attractive">Attractive</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.classificationOverride && (
                          <p className="text-[14px] text-red-500">{formErrors.classificationOverride}</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* ── Editable Fields ── */}
              <div className="space-y-4">
                <h4 className="text-[14px] flex items-center gap-2">
                  <EditIcon className="w-4 h-4 text-muted-foreground" />
                  Required Information
                </h4>

                {/* Serial Number */}
                <div className="space-y-1.5">
                  <Label htmlFor="serialNumber" className="text-[15px] font-medium">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={form.serialNumber}
                    onChange={(e) => {
                      setForm({ ...form, serialNumber: e.target.value });
                      if (formErrors.serialNumber) {
                        const ne = { ...formErrors };
                        delete ne.serialNumber;
                        setFormErrors(ne);
                      }
                    }}
                    placeholder="e.g. SN-2026-XXXXXX"
                    className={formErrors.serialNumber ? 'h-[52px] text-[15px] placeholder:text-[14px] border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20' : 'h-[52px] text-[15px] placeholder:text-[14px]'}
                  />
                  {formErrors.serialNumber && (
                    <p className="text-[14px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.serialNumber}
                    </p>
                  )}
                </div>

                {/* Field Office */}
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Field Office *</Label>
                  <Select
                    value={form.fieldOffice}
                    onValueChange={(v) => {
                      setForm({ ...form, fieldOffice: v, location: '', custodian: '' });
                      if (formErrors.fieldOffice) {
                        const ne = { ...formErrors };
                        delete ne.fieldOffice;
                        setFormErrors(ne);
                      }
                    }}
                  >
                    <SelectTrigger className={formErrors.fieldOffice ? 'h-[52px] text-[15px] border-red-500' : 'h-[52px] text-[15px]'}>
                      <SelectValue placeholder="Select field office" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      {FIELD_OFFICES.map((fo) => (
                        <SelectItem key={fo.code} value={fo.code}>
                          {fo.code} - {fo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.fieldOffice && (
                    <p className="text-[14px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.fieldOffice}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Location *</Label>
                  <Select
                    value={form.location}
                    onValueChange={(v) => {
                      setForm({ ...form, location: v, custodian: '' });
                      if (formErrors.location) {
                        const ne = { ...formErrors };
                        delete ne.location;
                        setFormErrors(ne);
                      }
                    }}
                    disabled={!form.fieldOffice}
                  >
                    <SelectTrigger className={formErrors.location ? 'h-[52px] text-[15px] border-red-500' : 'h-[52px] text-[15px]'}>
                      <SelectValue placeholder={form.fieldOffice ?"Select location" :"Select a field office first"} />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      {form.fieldOffice && FIELD_OFFICE_LOCATIONS[form.fieldOffice]?.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.location && (
                    <p className="text-[14px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.location}
                    </p>
                  )}
                  {!form.fieldOffice && (
                    <p className="text-[14px] text-muted-foreground">Please select a field office to view available locations</p>
                  )}
                </div>

                {/* Custodian */}
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Custodian *</Label>
                  <Select
                    value={form.custodian}
                    onValueChange={(v) => {
                      setForm({ ...form, custodian: v });
                      if (formErrors.custodian) {
                        const ne = { ...formErrors };
                        delete ne.custodian;
                        setFormErrors(ne);
                      }
                    }}
                    disabled={!form.location}
                  >
                    <SelectTrigger className={formErrors.custodian ? 'h-[52px] text-[15px] border-red-500' : 'h-[52px] text-[15px]'}>
                      <SelectValue placeholder={form.location ?"Select custodian" :"Select a location first"} />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      {form.location && LOCATION_CUSTODIANS[form.location]?.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.custodian && (
                    <p className="text-[14px] text-red-500">{formErrors.custodian}</p>
                  )}
                  {!form.location && (
                    <p className="text-[14px] text-muted-foreground">Please select a location to view available custodians</p>
                  )}
                </div>

                {/* Asset Condition */}
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Asset Condition *</Label>
                  <Select
                    value={form.assetCondition}
                    onValueChange={(v) => {
                      setForm({ ...form, assetCondition: v });
                      if (formErrors.assetCondition) {
                        const ne = { ...formErrors };
                        delete ne.assetCondition;
                        setFormErrors(ne);
                      }
                    }}
                  >
                    <SelectTrigger className={formErrors.assetCondition ? 'h-[52px] text-[15px] border-red-500' : 'h-[52px] text-[15px]'}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      {CONDITIONS.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.assetCondition && (
                    <p className="text-[14px] text-red-500">{formErrors.assetCondition}</p>
                  )}
                </div>

                {/* Barcode / Tag ID */}
                <div className="space-y-1.5">
                  <Label htmlFor="barcodeTagId" className="text-[15px] font-medium">Barcode / Tag ID *</Label>
                  <Input
                    id="barcodeTagId"
                    value={form.barcodeTagId}
                    onChange={(e) => {
                      setForm({ ...form, barcodeTagId: e.target.value });
                      if (formErrors.barcodeTagId) {
                        const ne = { ...formErrors };
                        delete ne.barcodeTagId;
                        setFormErrors(ne);
                      }
                    }}
                    placeholder="Scan or enter barcode..."
                    className={formErrors.barcodeTagId ? 'h-[52px] text-[15px] placeholder:text-[14px] border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20' : 'h-[52px] text-[15px] placeholder:text-[14px]'}
                  />
                  {formErrors.barcodeTagId && (
                    <p className="text-[14px] text-red-500">{formErrors.barcodeTagId}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* ── Audit Trail ── */}
              <div>
                

                {showAuditTrail && (
                  null
                )}
              </div>

              {/* ── Role Indicator ── */}
              <div className="bg-muted/30 border rounded-[4px] px-3 py-2 flex items-center gap-2 text-[14px] text-muted-foreground">
                <InfoIcon className="w-3.5 h-3.5" />
                Acting as: <span className="font-medium text-foreground capitalize">{userRole}</span>
                {userRole === 'auditor' && ' (Read-only)'}
              </div>
            </div>
          )}

          {/* ── Fixed Footer ── */}
          <div className="shrink-0 bg-background border-t p-4 flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setRegistrationOpen(false)} className="text-[15px]">
              Cancel
            </Button>
            <Button
              onClick={handleRegister}
              disabled={!isFormComplete || userRole === 'auditor'}
              className="text-[15px]"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Register Asset
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ════════════════════════════════════════════════════════════
         DETAIL VIEW SHEET
         ════════════════════════════════════════════════════════════ */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col h-full p-0">
          <SheetHeader className="pr-8 px-6 pt-6 pb-4 shrink-0">
            <SheetTitle className="text-[15px]">Draft Details</SheetTitle>
            <SheetDescription className="text-[14px]">
              {detailDraft ? detailDraft.draftId : ''}
            </SheetDescription>
          </SheetHeader>

          {detailDraft && (
            <div className="flex-1 overflow-y-auto px-6 space-y-5 pb-6">
              {/* SAP Source Info */}
              <div className="space-y-3">
                <h4 className="text-[14px] flex items-center gap-2">
                  <ShippingIcon className="w-4 h-4 text-muted-foreground" />
                  SAP Source
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <Label className="text-xs text-muted-foreground">PO Number</Label>
                    <p className="font-['Manrope']">{detailDraft.poNumber}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">GRN Number</Label>
                    <p className="font-['Manrope']">{detailDraft.grnNumber}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Supplier</Label>
                    <p>{detailDraft.supplier}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Synced</Label>
                    <p>{formatTimestamp(detailDraft.sapSyncTimestamp)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Item Info */}
              <div className="space-y-3">
                <h4 className="text-[14px] flex items-center gap-2">
                  <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                  Item Information
                </h4>
                <div className="text-sm space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <p>{detailDraft.itemDescription}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Qty</Label>
                      <p className="font-['Manrope']">{detailDraft.quantity}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Unit Price</Label>
                      <p className="font-['Manrope']">{formatCurrency(detailDraft.unitPrice, detailDraft.currency)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Total</Label>
                      <p className="font-['Manrope']">{formatCurrency(detailDraft.totalCost, detailDraft.currency)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Acquisition Date</Label>
                      <p>{formatDate(detailDraft.acquisitionDate)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Currency</Label>
                      <p>{detailDraft.currency}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Classification & Assignment */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[15px] font-medium">Classification</Label>
                  <Badge
                    variant="outline"
                    className={
                      detailDraft.classification === 'Capital'
                        ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700'
                    }
                  >
                    {detailDraft.classification}
                    {detailDraft.classificationOverridden && ' (Overridden)'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[15px] font-medium">Assignment</Label>
                  <Badge
                    variant="outline"
                    className={
                      detailDraft.assignmentStatus === 'Assigned'
                        ? 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
                        : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                    }
                  >
                    {detailDraft.assignmentStatus}
                    {detailDraft.assignedTo && ` - ${detailDraft.assignedTo}`}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Audit Trail */}
              <div>
                <h4 className="text-[14px] flex items-center gap-2 mb-3">
                  <TimelineIcon className="w-4 h-4 text-muted-foreground" />
                  Activity Log
                </h4>
                <div className="space-y-3 pl-2 border-l-2 border-border ml-3">
                  {detailDraft.auditTrail.map((entry) => (
                    <div key={entry.id} className="relative pl-4">
                      <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-[#121321] border-2 border-background" />
                      <p className="text-[15px]">{entry.action}</p>
                      {entry.details && (
                        <p className="text-[14px] text-muted-foreground">{entry.details}</p>
                      )}
                      <p className="text-[14px] text-muted-foreground mt-0.5">
                        {formatTimestamp(entry.timestamp)} &middot; {entry.user}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {userRole !== 'auditor' && (
                <div className="pt-2">
                  <Button className="w-full text-[15px]" onClick={() => {
                    setDetailOpen(false);
                    openRegistration(detailDraft);
                  }}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Registration
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Delete Confirm Dialog ── */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Draft"
        description={`Are you sure you want to delete draft"${draftToDelete?.draftId || ''}" (${draftToDelete?.itemDescription || ''})? This action cannot be undone.`}
        confirmLabel="Delete Draft"
        onConfirm={() => {
          handleDeleteDraft(draftToDelete!);
          setDraftToDelete(null);
          setDeleteConfirmOpen(false);
        }}
      />
    </div>
  );
}
