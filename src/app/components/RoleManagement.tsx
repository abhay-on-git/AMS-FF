import React, { useState, useMemo, useEffect } from 'react';
import { formatDate } from '../utils/dateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { MuiCheckbox } from './shared/MuiCheckbox';
import { TablePagination, paginateData } from './shared/TablePagination';
import { DeleteConfirmDialog } from './shared/DeleteConfirmDialog';
import {
  Add as Plus, Search, Security as Shield, Edit, Delete as Trash2,
  Visibility as Eye, ChevronLeft, People as Users, ContentCopy as Copy,
  ExpandMore, ExpandLess, Business as Building2, Lock as LockIcon,
  CheckCircle, RemoveCircle, Tune as TuneIcon, LocationOn,
  VisibilityOff, Info as InfoIcon, FilterList, Close,
  BarChart, Inventory2, Folder, SwapHoriz, Storage, Notifications, Description, Help as HelpIcon,
  MoreHoriz
} from '@mui/icons-material';
import { toast } from 'sonner';
import { ColumnToggle } from './assets/ColumnToggle';
import type { ColumnConfig } from './assets/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FieldRestriction {
  field: string;
  label: string;
  restricted: boolean;
  description: string;
}

interface SubModulePermission {
  name: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  approve: boolean;
  delete: boolean;
  export: boolean;
}

interface ModulePermission {
  module: string;
  icon: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  approve: boolean;
  delete: boolean;
  export: boolean;
  subModules: SubModulePermission[];
  fieldRestrictions: FieldRestriction[];
}

interface LocationAccess {
  officeId: string;
  officeName: string;
  code: string;
  location: string;
  granted: boolean;
}

interface Role {
  id: string;
  name: string;
  type: 'system' | 'custom';
  category: 'administrator' | 'standard' | 'auditor' | 'approver' | 'custom';
  description: string;
  userCount: number;
  createdDate: string;
  lastModified: string;
  isActive: boolean;
  allLocations: boolean;
  permissions: ModulePermission[];
  locationAccess: LocationAccess[];
  externalAuditorName?: string; // For external auditor roles
  auditFirm?: string; // For external auditor roles
}

type ViewMode = 'list' | 'detail';
type DetailTab = 'permissions' | 'field-access' | 'locations';

// ─── Default Data ────────────────────────────────────────────────────────────

const fieldOfficesList: LocationAccess[] = [
  { officeId: '1', officeName: 'Amman Office', code: 'FO-AMM', location: 'Amman, Jordan', granted: true },
  { officeId: '2', officeName: 'Afghanistan Office', code: 'FO-AFA', location: 'Kabul, Afghanistan', granted: true },
  { officeId: '3', officeName: 'Bangkok Office', code: 'FO-BKK', location: 'Bangkok, Thailand', granted: true },
  { officeId: '4', officeName: 'Melbourne Office', code: 'FO-MEL', location: 'Melbourne, Australia', granted: true },
  { officeId: '5', officeName: 'Phnom Penh Office', code: 'FO-PNH', location: 'Phnom Penh, Cambodia', granted: true },
  { officeId: '6', officeName: 'Geneva HQ', code: 'HQ-GVA', location: 'Geneva, Switzerland', granted: true },
];

const defaultModulePermissions: ModulePermission[] = [
  {
    module: 'Dashboard', icon: '📊',
    view: true, create: false, edit: false, approve: false, delete: false, export: true,
    subModules: [],
    fieldRestrictions: [
      { field: 'financial_summary', label: 'Financial Summary Widget', restricted: false, description: 'Total asset value, depreciation overview' },
      { field: 'cost_analytics', label: 'Cost Analytics Charts', restricted: false, description: 'Budget vs actual spending charts' },
    ],
  },
  {
    module: 'Assets', icon: '📦',
    view: true, create: true, edit: true, approve: false, delete: true, export: true,
    subModules: [
      { name: 'Published Assets', view: true, create: true, edit: true, approve: false, delete: true, export: true },
      { name: 'Draft Assets', view: true, create: true, edit: true, approve: false, delete: true, export: true },
      { name: 'Asset Transfers', view: true, create: true, edit: true, approve: true, delete: false, export: true },
      { name: 'Asset Inspections', view: true, create: true, edit: true, approve: true, delete: false, export: true },
      { name: 'Asset Surveys', view: true, create: true, edit: true, approve: false, delete: false, export: true },
      { name: 'Asset Disposals', view: true, create: true, edit: false, approve: true, delete: false, export: true },
    ],
    fieldRestrictions: [
      { field: 'purchase_price', label: 'Purchase Price', restricted: false, description: 'Original purchase cost of asset' },
      { field: 'current_value', label: 'Current Value', restricted: false, description: 'Current depreciated value' },
      { field: 'depreciation', label: 'Depreciation Data', restricted: false, description: 'Monthly/annual depreciation rates' },
      { field: 'insurance_info', label: 'Insurance Information', restricted: false, description: 'Insurance policy and coverage details' },
      { field: 'vendor_info', label: 'Vendor/Supplier Info', restricted: false, description: 'Vendor contacts and contract details' },
    ],
  },
  {
    module: 'Categories', icon: '🏷️',
    view: true, create: true, edit: true, approve: false, delete: true, export: true,
    subModules: [],
    fieldRestrictions: [],
  },
  {
    module: 'Locations', icon: '📍',
    view: true, create: false, edit: false, approve: false, delete: false, export: true,
    subModules: [],
    fieldRestrictions: [],
  },
  {
    module: 'Asset Lifecycle', icon: '🔄',
    view: true, create: false, edit: true, approve: true, delete: false, export: true,
    subModules: [
      { name: 'Lifecycle Transitions', view: true, create: false, edit: true, approve: true, delete: false, export: true },
      { name: 'Admin Override', view: false, create: false, edit: false, approve: false, delete: false, export: false },
    ],
    fieldRestrictions: [],
  },
  {
    module: 'Find Extra', icon: '🔍',
    view: true, create: true, edit: true, approve: false, delete: false, export: true,
    subModules: [],
    fieldRestrictions: [],
  },
  {
    module: 'Reporting & Analytics', icon: '📈',
    view: true, create: false, edit: false, approve: false, delete: false, export: true,
    subModules: [
      { name: 'Predefined Reports', view: true, create: false, edit: false, approve: false, delete: false, export: true },
      { name: 'Custom Report Builder', view: true, create: true, edit: true, approve: false, delete: true, export: true },
      { name: 'Scheduled Reports', view: true, create: true, edit: true, approve: false, delete: true, export: true },
    ],
    fieldRestrictions: [
      { field: 'financial_reports', label: 'Financial Report Data', restricted: false, description: 'Cost, depreciation, and budget reports' },
    ],
  },
  {
    module: 'Users & Roles', icon: '👥',
    view: true, create: false, edit: false, approve: false, delete: false, export: false,
    subModules: [
      { name: 'User Management', view: true, create: false, edit: false, approve: false, delete: false, export: false },
      { name: 'Field Offices', view: true, create: false, edit: false, approve: false, delete: false, export: false },
      { name: 'Roles & Permissions', view: true, create: false, edit: false, approve: false, delete: false, export: false },
    ],
    fieldRestrictions: [],
  },
  {
    module: 'Integrations', icon: '🔗',
    view: false, create: false, edit: false, approve: false, delete: false, export: false,
    subModules: [],
    fieldRestrictions: [],
  },
  {
    module: 'Notifications', icon: '🔔',
    view: true, create: false, edit: true, approve: false, delete: false, export: false,
    subModules: [],
    fieldRestrictions: [],
  },
  {
    module: 'Action Log', icon: '📋',
    view: true, create: false, edit: false, approve: false, delete: false, export: true,
    subModules: [],
    fieldRestrictions: [],
  },
  {
    module: 'RFID Settings', icon: '📡',
    view: false, create: false, edit: false, approve: false, delete: false, export: false,
    subModules: [],
    fieldRestrictions: [],
  },
  {
    module: 'System Config', icon: '⚙️',
    view: false, create: false, edit: false, approve: false, delete: false, export: false,
    subModules: [],
    fieldRestrictions: [],
  },
];

const createFullAccessPermissions = (): ModulePermission[] =>
  defaultModulePermissions.map(m => ({
    ...m,
    view: true, create: true, edit: true, approve: true, delete: true, export: true,
    subModules: m.subModules.map(s => ({ ...s, view: true, create: true, edit: true, approve: true, delete: true, export: true })),
    fieldRestrictions: m.fieldRestrictions.map(f => ({ ...f, restricted: false })),
  }));

const createReadOnlyPermissions = (): ModulePermission[] =>
  defaultModulePermissions.map(m => ({
    ...m,
    view: true, create: false, edit: false, approve: false, delete: false, export: true,
    subModules: m.subModules.map(s => ({ ...s, view: true, create: false, edit: false, approve: false, delete: false, export: true })),
    fieldRestrictions: m.fieldRestrictions.map(f => ({ ...f, restricted: false })),
  }));

const initialRoles: Role[] = [
  {
    id: '1', name: 'Administrator', type: 'system', category: 'administrator',
    description: 'Full access to all functionalities, including asset registration, editing, transfers, lifecycle management, user management, and reporting.',
    userCount: 3, createdDate: '2024-01-01', lastModified: '2025-12-15', isActive: true, allLocations: true,
    permissions: createFullAccessPermissions(),
    locationAccess: fieldOfficesList.map(f => ({ ...f, granted: true })),
  },
  {
    id: '2', name: 'Standard User', type: 'system', category: 'standard',
    description: 'Can register and update asset information, perform transfers, submit disposal requests, and run reports for their assigned region.',
    userCount: 15, createdDate: '2024-01-01', lastModified: '2025-11-20', isActive: true, allLocations: false,
    permissions: defaultModulePermissions,
    locationAccess: fieldOfficesList.map((f, i) => ({ ...f, granted: i < 2 })),
  },
  {
    id: '3', name: 'Auditor', type: 'system', category: 'auditor',
    description: 'View-only access to all asset data, history, and reports for audit and compliance purposes.',
    userCount: 4, createdDate: '2024-01-01', lastModified: '2025-10-10', isActive: true, allLocations: true,
    permissions: createReadOnlyPermissions(),
    locationAccess: fieldOfficesList.map(f => ({ ...f, granted: true })),
    externalAuditorName: 'Rachel Anderson',
    auditFirm: 'KPMG International',
  },
  {
    id: '4', name: 'Approver / Reviewer', type: 'system', category: 'approver',
    description: 'May approve asset transfers, survey cases, disposal requests, or lifecycle changes based on workflow rules.',
    userCount: 6, createdDate: '2024-01-01', lastModified: '2025-12-01', isActive: true, allLocations: false,
    permissions: defaultModulePermissions.map(m => ({
      ...m,
      approve: ['Assets', 'Asset Lifecycle'].includes(m.module) ? true : m.approve,
      subModules: m.subModules.map(s => ({
        ...s,
        approve: ['Asset Transfers', 'Asset Inspections', 'Asset Disposals', 'Lifecycle Transitions'].includes(s.name) ? true : s.approve,
      })),
    })),
    locationAccess: fieldOfficesList.map((f, i) => ({ ...f, granted: i < 3 })),
  },
  {
    id: '5', name: 'Disposal Focal Point', type: 'custom', category: 'custom',
    description: 'Specialized role for managing asset disposal workflows, including creating disposal requests, conducting surveys, and generating disposal reports.',
    userCount: 3, createdDate: '2024-06-15', lastModified: '2025-11-05', isActive: true, allLocations: false,
    permissions: defaultModulePermissions.map(m => {
      if (m.module === 'Assets') {
        return {
          ...m,
          subModules: m.subModules.map(s => {
            if (s.name === 'Asset Disposals') return { ...s, view: true, create: true, edit: true, approve: false, delete: false, export: true };
            if (s.name === 'Asset Surveys') return { ...s, view: true, create: true, edit: true, approve: false, delete: false, export: true };
            return { ...s, view: true, create: false, edit: false, approve: false, delete: false, export: true };
          }),
        };
      }
      return m;
    }),
    locationAccess: fieldOfficesList.map((f, i) => ({ ...f, granted: i === 0 })),
  },
  {
    id: '6', name: 'PDA User', type: 'custom', category: 'custom',
    description: 'Mobile-only access for PDA/handheld device users performing inventory scans, asset verification, and basic lookups in the field.',
    userCount: 8, createdDate: '2024-08-20', lastModified: '2025-09-12', isActive: true, allLocations: false,
    permissions: defaultModulePermissions.map(m => ({
      ...m,
      view: ['Assets', 'Locations', 'Find Extra'].includes(m.module),
      create: m.module === 'Find Extra',
      edit: m.module === 'Assets',
      approve: false, delete: false,
      export: false,
      subModules: m.subModules.map(s => ({
        ...s, view: true, create: false, edit: false, approve: false, delete: false, export: false,
      })),
      fieldRestrictions: m.fieldRestrictions.map(f => ({
        ...f, restricted: ['purchase_price', 'current_value', 'depreciation', 'insurance_info', 'vendor_info', 'financial_reports', 'financial_summary', 'cost_analytics'].includes(f.field),
      })),
    })),
    locationAccess: fieldOfficesList.map((f, i) => ({ ...f, granted: i < 2 })),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getCategoryBadge = (category: Role['category']) => {
  const map: Record<string, { label: string; className: string }> = {
    administrator: { label: 'Administrator', className: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' },
    standard: { label: 'Standard User', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    auditor: { label: 'Auditor (Read-Only)', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
    approver: { label: 'Approver / Reviewer', className: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' },
    custom: { label: 'Custom Role', className: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  };
  return map[category] || map.custom;
};

const countPermissions = (perms: ModulePermission[]) => {
  let total = 0, granted = 0;
  perms.forEach(p => {
    const actions: (keyof ModulePermission)[] = ['view', 'create', 'edit', 'approve', 'delete', 'export'];
    actions.forEach(a => { total++; if (p[a]) granted++; });
    p.subModules.forEach(s => {
      actions.forEach(a => { total++; if (s[a as keyof SubModulePermission]) granted++; });
    });
  });
  return { total, granted, percentage: total > 0 ? Math.round((granted / total) * 100) : 0 };
};

const countFieldRestrictions = (perms: ModulePermission[]) => {
  let total = 0, restricted = 0;
  perms.forEach(p => p.fieldRestrictions.forEach(f => { total++; if (f.restricted) restricted++; }));
  return { total, restricted };
};

// ─── Component ───────────────────────────────────────────────────────────────

interface RoleManagementProps {
  hideListHeader?: boolean;
  createTrigger?: number;
  onDetailViewChange?: (isDetail: boolean, detailName?: string) => void;
}

const defaultColumns: ColumnConfig[] = [
  { key: 'roleName', label: 'Role Name', visible: true, category: 'default' },
  { key: 'description', label: 'Description', visible: true, category: 'default' },
  { key: 'users', label: 'Users', visible: true, category: 'default' },
];

export default function RoleManagement({ hideListHeader, createTrigger, onDetailViewChange }: RoleManagementProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [detailTab, setDetailTab] = useState<DetailTab>('permissions');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Column visibility
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);

  // Working copy for permission editing
  const [workingPermissions, setWorkingPermissions] = useState<ModulePermission[]>([]);
  const [workingLocations, setWorkingLocations] = useState<LocationAccess[]>([]);
  const [workingAllLocations, setWorkingAllLocations] = useState(true);

  const isReadOnly = selectedRole?.type === 'system';

  // React to parent create trigger
  useEffect(() => {
    if (createTrigger && createTrigger > 0) {
      handleOpenCreateDrawer();
    }
  }, [createTrigger]);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<Role['category']>('custom');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filteredRoles = useMemo(() => {
    return roles.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || r.type === filterType || r.category === filterType;
      return matchesSearch && matchesType;
    });
  }, [roles, searchQuery, filterType]);

  const paginatedRoles = paginateData(filteredRoles, currentPage, rowsPerPage);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const toggleColumn = (key: string) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.key === key ? { ...c, visible: !c.visible } : c,
      ),
    );
  };

  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    setWorkingPermissions(JSON.parse(JSON.stringify(role.permissions)));
    setWorkingLocations(JSON.parse(JSON.stringify(role.locationAccess)));
    setWorkingAllLocations(role.allLocations);
    setDetailTab('permissions');
    setExpandedModules(new Set());
    setViewMode('detail');
    onDetailViewChange?.(true, role.name);
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedRole(null);
    setExpandedModules(new Set());
    onDetailViewChange?.(false, undefined);
  };

  const handleOpenCreateDrawer = () => {
    setIsEditMode(false);
    setFormName('');
    setFormDescription('');
    setFormCategory('custom');
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (role: Role) => {
    setIsEditMode(true);
    setFormName(role.name);
    setFormDescription(role.description);
    setFormCategory(role.category);
    setDrawerOpen(true);
  };

  const handleDrawerClose = (open: boolean) => {
    if (!open) setDrawerOpen(false);
  };

  const handleSaveRole = () => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.formName = 'Role name is required';
    if (!formDescription.trim()) errors.formDescription = 'Description is required';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    if (isEditMode && selectedRole) {
      setRoles(prev => prev.map(r => r.id === selectedRole.id ? { ...r, name: formName, description: formDescription, category: formCategory, lastModified: new Date().toISOString().split('T')[0] } : r));
      setSelectedRole(prev => prev ? { ...prev, name: formName, description: formDescription, category: formCategory } : null);
      toast.success('Role updated successfully');
    } else {
      const newRole: Role = {
        id: String(Date.now()), name: formName, type: 'custom', category: formCategory,
        description: formDescription, userCount: 0, createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0], isActive: true, allLocations: false,
        permissions: JSON.parse(JSON.stringify(defaultModulePermissions)),
        locationAccess: fieldOfficesList.map(f => ({ ...f, granted: false })),
      };
      setRoles(prev => [...prev, newRole]);
      toast.success('Role created successfully');
    }
    setDrawerOpen(false);
  };

  const handleCloneRole = (role: Role) => {
    const cloned: Role = {
      ...JSON.parse(JSON.stringify(role)),
      id: String(Date.now()),
      name: `${role.name} (Copy)`,
      type: 'custom',
      category: 'custom',
      userCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    };
    setRoles(prev => [...prev, cloned]);
    toast.success(`Role"${role.name}" cloned successfully`);
  };

  const handleDeleteRole = (role: Role) => {
    if (role.type === 'system') {
      toast.error('System roles cannot be deleted');
      return;
    }
    setRoleToDelete(role);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteRole = () => {
    if (roleToDelete) {
      setRoles(prev => prev.filter(r => r.id !== roleToDelete.id));
      toast.success(`Role"${roleToDelete.name}" deleted`);
      setRoleToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  // ── Permission Handlers ────────────────────────────────────────────────────

  const toggleModuleExpand = (module: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      next.has(module) ? next.delete(module) : next.add(module);
      return next;
    });
  };

  const handleToggleModulePermission = (moduleIndex: number, action: string) => {
    setWorkingPermissions(prev => {
      const next = [...prev];
      const m = { ...next[moduleIndex] };
      (m as any)[action] = !(m as any)[action];
      next[moduleIndex] = m;
      return next;
    });
  };

  const handleToggleSubModulePermission = (moduleIndex: number, subIndex: number, action: string) => {
    setWorkingPermissions(prev => {
      const next = [...prev];
      const m = { ...next[moduleIndex], subModules: [...next[moduleIndex].subModules] };
      m.subModules[subIndex] = { ...m.subModules[subIndex], [action]: !(m.subModules[subIndex] as any)[action] };
      next[moduleIndex] = m;
      return next;
    });
  };

  const handleToggleFieldRestriction = (moduleIndex: number, fieldIndex: number) => {
    setWorkingPermissions(prev => {
      const next = [...prev];
      const m = { ...next[moduleIndex], fieldRestrictions: [...next[moduleIndex].fieldRestrictions] };
      m.fieldRestrictions[fieldIndex] = { ...m.fieldRestrictions[fieldIndex], restricted: !m.fieldRestrictions[fieldIndex].restricted };
      next[moduleIndex] = m;
      return next;
    });
  };

  const handleSetModulePreset = (moduleIndex: number, preset: 'full' | 'readonly' | 'none') => {
    setWorkingPermissions(prev => {
      const next = [...prev];
      const m = { ...next[moduleIndex] };
      if (preset === 'full') {
        m.view = true; m.create = true; m.edit = true; m.delete = true; m.export = true;
        m.subModules = m.subModules.map(s => ({ ...s, view: true, create: true, edit: true, delete: true, export: true }));
      } else if (preset === 'readonly') {
        m.view = true; m.create = false; m.edit = false; m.delete = false; m.export = true;
        m.subModules = m.subModules.map(s => ({ ...s, view: true, create: false, edit: false, delete: false, export: true }));
      } else {
        m.view = false; m.create = false; m.edit = false; m.delete = false; m.export = false;
        m.subModules = m.subModules.map(s => ({ ...s, view: false, create: false, edit: false, delete: false, export: false }));
      }
      next[moduleIndex] = m;
      return next;
    });
  };

  const handleToggleLocationAccess = (officeId: string) => {
    setWorkingLocations(prev => prev.map(l => l.officeId === officeId ? { ...l, granted: !l.granted } : l));
  };

  const handleSavePermissions = () => {
    if (!selectedRole) return;
    const updated = { ...selectedRole, permissions: workingPermissions, locationAccess: workingLocations, allLocations: workingAllLocations, lastModified: new Date().toISOString().split('T')[0] };
    setRoles(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedRole(updated);
    toast.success('Permissions saved successfully');
  };

  // ── Detail Tab Items ───────────────────────────────────────────────────────

  const detailTabs: { id: DetailTab; label: string }[] = [
    { id: 'permissions', label: 'Module & Actions' },
    { id: 'field-access', label: 'Field-Level Access' },
    { id: 'locations', label: 'Location Access' },
  ];

  // ── Actions Column Helper ──────────────────────────────────────────────────

  const actions = ['view', 'create', 'edit', 'delete', 'export'] as const;
  const actionLabels: Record<string, string> = {
    view: 'View', create: 'Create', edit: 'Edit', delete: 'Delete', export: 'Export',
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DETAIL VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  if (viewMode === 'detail' && selectedRole) {
    const badge = getCategoryBadge(selectedRole.category);

    return (
      <div className="space-y-6">
        {/* Header - flex-col matching other modules */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-base">
            <button
              onClick={handleBack}
              className="text-muted-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleBack}
              className="text-muted-foreground transition-colors"
            >
              Role and Permission
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{selectedRole.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl">{selectedRole.name}</h1>
              </div>
              <p className="text-muted-foreground text-base mt-1">{selectedRole.description}</p>
            </div>
            <div className="flex gap-2">
              {!isReadOnly && (
                <Button className="text-[15px]" onClick={handleSavePermissions}>
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Detail Tabs */}
        {/* <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
          {detailTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setDetailTab(tab.id)}
              className={`px-4 py-2 rounded-[4px] text-[15px] transition-colors ${
                detailTab === tab.id
                  ? 'bg-[#121321] text-white shadow-sm'
                  : 'bg-transparent text-[#121321] border border-[#121321]/20[#121321]/5 dark:text-white dark:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div> */}

        {/* ── MODULE & ACTION PERMISSIONS TAB ─────────────────────────────── */}
        {detailTab === 'permissions' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" className="text-[15px]" onClick={() => setExpandedModules(new Set(workingPermissions.filter(p => p.subModules.length > 0).map(p => p.module)))}>
                  Expand All
                </Button>
                <Button variant="outline" className="text-[15px]" onClick={() => setExpandedModules(new Set())}>
                  Collapse All
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="w-72 text-[15px] font-semibold">Module / Sub-module</TableHead>
                        {actions.map(a => (
                          <TableHead key={a} className="text-center w-20 text-[15px] font-semibold">{actionLabels[a]}</TableHead>
                        ))}
                        <TableHead className="text-center w-32 text-[15px] font-semibold">Quick Set</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workingPermissions.flatMap((perm, mi) => {
                        const isExpanded = expandedModules.has(perm.module);
                        const hasChildren = perm.subModules.length > 0;
                        const moduleRow = (
                            <TableRow key={perm.module} className="/50 bg-muted/10">
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {hasChildren ? (
                                    <button onClick={() => toggleModuleExpand(perm.module)} className="p-0.5 rounded">
                                      {isExpanded ? <ExpandLess className="w-4 h-4" /> : <ExpandMore className="w-4 h-4" />}
                                    </button>
                                  ) : (
                                    <span className="w-5" />
                                  )}
                                  {(() => {
                                    const iconClass ="w-4 h-4 text-[#121321] dark:text-[#81CCD7]";
                                    const moduleIcons: Record<string, React.ReactNode> = {
                                      'Dashboard': <BarChart className={iconClass} />,
                                      'Assets': <Inventory2 className={iconClass} />,
                                      'Categories': <Folder className={iconClass} />,
                                      'Locations': <LocationOn className={iconClass} />,
                                      'Asset Lifecycle': <SwapHoriz className={iconClass} />,
                                      'Find Extra': <Search className={iconClass} />,
                                      'Reporting & Analytics': <BarChart className={iconClass} />,
                                      'Users & Roles': <Users className={iconClass} />,
                                      'Integrations': <Storage className={iconClass} />,
                                      'Notifications': <Notifications className={iconClass} />,
                                      'Action Log': <Description className={iconClass} />,
                                      'System Config': <Shield className={iconClass} />,
                                      'Help': <HelpIcon className={iconClass} />,
                                    };
                                    return moduleIcons[perm.module] || <Folder className={iconClass} />;
                                  })()}
                                  <span className="font-medium text-[15px]">{perm.module}</span>
                                  {hasChildren && (
                                    null
                                  )}
                                </div>
                              </TableCell>
                              {actions.map(a => (
                                <TableCell key={a} className="text-center">
                                  <div className="flex justify-center">
                                    <MuiCheckbox
                                      checked={(perm as any)[a]}
                                      onCheckedChange={() => handleToggleModulePermission(mi, a)}
                                      disabled={isReadOnly}
                                    />
                                  </div>
                                </TableCell>
                              ))}
                              <TableCell className="text-center">
                                <div className="flex justify-center gap-1.5">
                                  <button
                                    onClick={() => handleSetModulePreset(mi, 'full')}
                                    disabled={isReadOnly}
                                    className="p-1.5 rounded cursor-pointer dark:bg-green-900/30 text-green-700 dark:text-green-400 disabled:opacity-40 disabled:cursor-not-allowed"
                                    title="Full Access"
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleSetModulePreset(mi, 'readonly')}
                                    disabled={isReadOnly}
                                    className="p-1.5 rounded cursor-pointer dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 disabled:opacity-40 disabled:cursor-not-allowed"
                                    title="Read Only"
                                  >
                                    <Eye className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleSetModulePreset(mi, 'none')}
                                    disabled={isReadOnly}
                                    className="p-1.5 rounded cursor-pointer dark:bg-red-900/30 text-red-700 dark:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed"
                                    title="No Access"
                                  >
                                    <RemoveCircle className="w-5 h-5" />
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                        );
                        const subRows = isExpanded ? perm.subModules.map((sub, si) => (
                              <TableRow key={`${perm.module}-${sub.name}`} className="/30">
                                <TableCell>
                                  <div className="flex items-center gap-2 pl-12">
                                    <span className="text-muted-foreground text-md">└</span>
                                    <span className="text-[15px]">{sub.name}</span>
                                  </div>
                                </TableCell>
                                {actions.map(a => (
                                  <TableCell key={a} className="text-center">
                                    <div className="flex justify-center">
                                      <MuiCheckbox
                                        checked={(sub as any)[a]}
                                        onCheckedChange={() => handleToggleSubModulePermission(mi, si, a)}
                                        size="small"
                                        disabled={isReadOnly}
                                      />
                                    </div>
                                  </TableCell>
                                ))}
                                <TableCell />
                              </TableRow>
                            )) : [];
                        return [moduleRow, ...subRows];
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── FIELD-LEVEL ACCESS TAB ──────────────────────────────────────── */}
        {detailTab === 'field-access' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <InfoIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[15px] font-medium text-amber-800 dark:text-amber-200">Field-Level Restrictions</p>
                <p className="text-[15px] text-amber-700 dark:text-amber-300 mt-1">
                  Restrict specific data fields from being visible to users with this role. Useful for hiding sensitive financial, vendor, or insurance data from non-authorized personnel.
                </p>
              </div>
            </div>

            {workingPermissions.filter(p => p.fieldRestrictions.length > 0).map((perm, _) => {
              const mi = workingPermissions.findIndex(wp => wp.module === perm.module);
              return (
                <Card key={perm.module}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      {(() => {
                        const iconClass ="w-5 h-5 text-[#121321] dark:text-[#81CCD7]";
                        const moduleIcons: Record<string, React.ReactNode> = {
                          'Dashboard': <BarChart className={iconClass} />,
                          'Assets': <Inventory2 className={iconClass} />,
                          'Categories': <Folder className={iconClass} />,
                          'Locations': <LocationOn className={iconClass} />,
                          'Asset Lifecycle': <SwapHoriz className={iconClass} />,
                          'Find Extra': <Search className={iconClass} />,
                          'Reporting & Analytics': <BarChart className={iconClass} />,
                          'Users & Roles': <Users className={iconClass} />,
                          'Integrations': <Storage className={iconClass} />,
                          'Notifications': <Notifications className={iconClass} />,
                          'Action Log': <Description className={iconClass} />,
                          'System Config': <Shield className={iconClass} />,
                          'Help': <HelpIcon className={iconClass} />,
                        };
                        return moduleIcons[perm.module] || <Folder className={iconClass} />;
                      })()}
                      {perm.module}
                      <Badge variant="outline" className="text-md ml-2">
                        {perm.fieldRestrictions.filter(f => f.restricted).length} restricted
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {perm.fieldRestrictions.map((field, fi) => (
                        <div
                          key={field.field}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            field.restricted
                              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                              : 'bg-background border-border/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {field.restricted ? (
                              <VisibilityOff className="w-5 h-5 text-red-600 dark:text-red-400" />
                            ) : (
                              <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
                            )}
                            <div>
                              <p className="text-[15px] font-medium">{field.label}</p>
                              <p className="text-md text-muted-foreground">{field.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-md px-2.5 py-1 rounded-full ${
                              field.restricted
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            }`}>
                              {field.restricted ? 'Hidden' : 'Visible'}
                            </span>
                            <MuiCheckbox
                              checked={field.restricted}
                              onCheckedChange={() => handleToggleFieldRestriction(mi, fi)}
                              disabled={isReadOnly}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {workingPermissions.filter(p => p.fieldRestrictions.length > 0).length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <VisibilityOff className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No field-level restrictions are configured for any module.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── LOCATION ACCESS TAB ─────────────────────────────────────────── */}
        {detailTab === 'locations' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <LocationOn className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[15px] font-medium text-blue-800 dark:text-blue-200">Location-Based Access</p>
                <p className="text-[15px] text-blue-700 dark:text-blue-300 mt-1">
                  Restrict this role's access to specific field offices. Users with this role will only see assets, transfers, and reports for their assigned locations.
                </p>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Field Office Access</CardTitle>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-[15px] cursor-pointer">
                      <MuiCheckbox
                        checked={workingAllLocations}
                        onCheckedChange={(checked) => setWorkingAllLocations(checked)}
                        disabled={isReadOnly}
                      />
                      <span className={workingAllLocations ? 'font-medium' : 'text-muted-foreground'}>
                        All Locations (Global Access)
                      </span>
                    </label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {workingAllLocations ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <LocationOn className="w-10 h-10 mx-auto mb-3 text-green-600 dark:text-green-400 opacity-60" />
                    <p className="text-[15px]">This role has access to <strong>all field offices</strong>.</p>
                    <p className="text-md mt-1">Uncheck"All Locations" to restrict access to specific offices.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {workingLocations.map(loc => (
                      <div
                        key={loc.officeId}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          isReadOnly ? 'cursor-default' : 'cursor-pointer'
                        } ${
                          loc.granted
                            ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                            : 'bg-background border-border/30'
                        }`}
                        onClick={() => !isReadOnly && handleToggleLocationAccess(loc.officeId)}
                      >
                        <div className="flex items-center gap-3">
                          <MuiCheckbox
                            checked={loc.granted}
                            onCheckedChange={() => handleToggleLocationAccess(loc.officeId)}
                            disabled={isReadOnly}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-5 h-5 text-muted-foreground" />
                              <span className="text-[15px] font-medium">{loc.officeName}</span>
                              <Badge variant="outline" className="text-md">{loc.code}</Badge>
                            </div>
                            <p className="text-md text-muted-foreground mt-0.5 pl-7">{loc.location}</p>
                          </div>
                        </div>
                        <span className={`text-md px-2.5 py-1 rounded-full ${
                          loc.granted
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {loc.granted ? 'Granted' : 'Denied'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Create/Edit Sheet Drawer ────────────────────────────────────── */}
        <Sheet open={drawerOpen} onOpenChange={handleDrawerClose}>
          <SheetContent side="right" className="!w-full sm:!max-w-xl flex flex-col h-full p-0">
            <SheetHeader className="pr-8 px-6 pt-6 pb-4 shrink-0">
              <SheetTitle className="text-[15px]">{isEditMode ? 'Edit Role' : 'Add Role'}</SheetTitle>
              <SheetDescription className="text-[14px]">
                {isEditMode ? 'Update role details. Permissions are managed in the detail view.' : 'Define a new custom role. You can configure permissions after creation.'}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-6">
              <div className="space-y-2">
                <Label htmlFor="roleName" className="text-[15px] font-medium">Role Name <span className="text-red-500">*</span></Label>
                <Input
                  id="roleName"
                  placeholder="e.g., Disposal Focal Point"
                  value={formName}
                  onChange={(e) => { setFormName(e.target.value); setFormErrors(p => ({ ...p, formName: '' })); }}
                  className={formErrors.formName ? 'h-[52px] text-[15px] placeholder:text-[14px] border-red-500' : 'h-[52px] text-[15px] placeholder:text-[14px]'}
                />
                {formErrors.formName && <p className="text-[14px] text-red-500">{formErrors.formName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleDescription" className="text-[15px] font-medium">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="roleDescription"
                  placeholder="Describe the responsibilities and scope of this role..."
                  rows={4}
                  value={formDescription}
                  onChange={(e) => { setFormDescription(e.target.value); setFormErrors(p => ({ ...p, formDescription: '' })); }}
                  className={formErrors.formDescription ? 'text-[15px] placeholder:text-[14px] border-red-500' : 'text-[15px] placeholder:text-[14px]'}
                />
                {formErrors.formDescription && <p className="text-[14px] text-red-500">{formErrors.formDescription}</p>}
              </div>
            </div>

            <div className="shrink-0 border-t pt-4 flex justify-end gap-3 bg-background px-6 pb-4">
              <Button variant="outline" onClick={() => setDrawerOpen(false)} className="text-[15px]">Cancel</Button>
              <Button onClick={handleSaveRole} className="text-[15px]">
                {isEditMode ? 'Update Role' : 'Add Role'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="space-y-6">
      {/* Header */}
      {!hideListHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl">Roles & Permissions</h1>
            <p className="text-muted-foreground text-base mt-1">
              Manage user roles and configure access controls at module, action, field, and location levels
            </p>
          </div>
          <Button onClick={handleOpenCreateDrawer} className="text-[15px]">
            Add Role
          </Button>
        </div>
      )}

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(0); }}
                className="pl-9 text-[15px]"
              />
            </div>
            <ColumnToggle columns={columns} onToggle={toggleColumn} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.filter(col => col.visible).map(col => (
                    <TableHead key={col.key} className="text-[15px]">{col.label}</TableHead>
                  ))}
                  <TableHead className="w-40 text-[15px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRoles.map((role) => {
                  const badge = getCategoryBadge(role.category);
                  const permStats = countPermissions(role.permissions);
                  const locCount = role.allLocations ? 'All' : `${role.locationAccess.filter(l => l.granted).length}/${role.locationAccess.length}`;
                  return (
                    <TableRow key={role.id} className="/50 cursor-pointer" onClick={() => handleViewRole(role)}>
                      {columns.filter(col => col.visible).map(col => {
                        if (col.key === 'roleName') {
                          return (
                            <TableCell key={col.key} className="text-[15px]">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{role.name}</span>
                              </div>
                            </TableCell>
                          );
                        } else if (col.key === 'users') {
                          return (
                            <TableCell key={col.key} className="text-[15px]">
                              <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>{role.userCount}</span>
                              </div>
                            </TableCell>
                          );
                        } else if (col.key === 'category') {
                          return (
                            <TableCell key={col.key} className="text-[15px]">
                              {badge}
                            </TableCell>
                          );
                        } else if (col.key === 'description') {
                          return (
                            <TableCell key={col.key} className="max-w-[220px] text-[15px]">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="block truncate cursor-default">{role.description}</span>
                                </TooltipTrigger>
                                <TooltipContent>{role.description}</TooltipContent>
                              </Tooltip>
                            </TableCell>
                          );
                        } else if (col.key === 'created') {
                          return <TableCell key={col.key} className="text-[15px] text-muted-foreground">{formatDate(role.createdDate)}</TableCell>;
                        } else if (col.key === 'modified') {
                          return <TableCell key={col.key} className="text-[15px] text-muted-foreground">{formatDate(role.lastModified)}</TableCell>;
                        }
                        return <TableCell key={col.key} className="text-[15px]">—</TableCell>;
                      })}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {role.type === 'custom' ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHoriz className="w-4 h-4 rotate-90" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-[15px]">
                              <DropdownMenuItem onClick={() => handleViewRole(role)} className="text-[15px] py-2.5">
                                <Shield className="w-4 h-4 mr-2" />
                                Manage Permissions
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenEditDrawer(role)} className="text-[15px] py-2.5">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteRole(role)} className="text-[15px] py-2.5 text-red-600 dark:text-red-400">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex cursor-default">
                                <LockIcon className="w-3 h-3 text-muted-foreground" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>This is the System Role</TooltipContent>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredRoles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No roles found matching your search.</p>
            </div>
          )}

          <TablePagination
            totalItems={filteredRoles.length}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={(rpp) => { setRowsPerPage(rpp); setCurrentPage(0); }}
            totalUnfilteredItems={roles.length}
            itemLabel="roles"
          />
        </CardContent>
      </Card>

      {/* Create/Edit Sheet Drawer */}
      <Sheet open={drawerOpen} onOpenChange={handleDrawerClose}>
        <SheetContent side="right" className="!w-full sm:!max-w-xl flex flex-col h-full p-0">
          <SheetHeader className="pr-8 px-6 pt-6 pb-4 shrink-0">
            <SheetTitle className="text-[15px]">{isEditMode ? 'Edit Role' : 'Add Role'}</SheetTitle>
            <SheetDescription className="text-[14px]">
              {isEditMode ? 'Update role details.' : 'Define a new custom role. You can configure permissions after creation.'}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-6">
            <div className="space-y-2">
              <Label htmlFor="roleName2" className="text-[15px] font-medium">Role Name <span className="text-red-500">*</span></Label>
              <Input
                id="roleName2"
                placeholder="e.g., Disposal Focal Point"
                value={formName}
                onChange={(e) => { setFormName(e.target.value); setFormErrors(p => ({ ...p, formName: '' })); }}
                className={formErrors.formName ? 'h-[52px] text-[15px] placeholder:text-[14px] border-red-500' : 'h-[52px] text-[15px] placeholder:text-[14px]'}
              />
              {formErrors.formName && <p className="text-[14px] text-red-500">{formErrors.formName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleDescription2" className="text-[15px] font-medium">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="roleDescription2"
                placeholder="Describe the responsibilities and scope of this role..."
                rows={4}
                value={formDescription}
                onChange={(e) => { setFormDescription(e.target.value); setFormErrors(p => ({ ...p, formDescription: '' })); }}
                className={formErrors.formDescription ? 'text-[15px] placeholder:text-[14px] border-red-500' : 'text-[15px] placeholder:text-[14px]'}
              />
              {formErrors.formDescription && <p className="text-[14px] text-red-500">{formErrors.formDescription}</p>}
            </div>
          </div>

          <div className="shrink-0 border-t pt-4 flex justify-end gap-3 bg-background px-6 pb-4">
            <Button variant="outline" onClick={() => setDrawerOpen(false)} className="text-[15px]">Cancel</Button>
            <Button onClick={handleSaveRole} className="text-[15px]">
              {isEditMode ? 'Update Role' : 'Add Role'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Delete Confirm Dialog ── */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Role"
        itemName={roleToDelete?.name}
        description={`Are you sure you want to delete the role"${roleToDelete?.name || ''}"? All users assigned to this role will need to be reassigned. This action cannot be undone.`}
        confirmLabel="Delete Role"
        onConfirm={confirmDeleteRole}
      />
    </div>
  );
}

