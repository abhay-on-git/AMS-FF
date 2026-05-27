// ── Enhanced Asset Types for Enterprise Asset Tracking ──

export interface EnhancedAsset {
  id: string;
  assetId: string;
  epc: string;
  barcode: string;
  serialNumber: string;
  type: string;
  name: string;
  description?: string;
  location: string;
  fieldOffice: string;
  status: 'active' | 'inactive' | 'maintenance' | 'disposed' | 'missing' | 'in-transit';
  publishedDate: string;
  responsiblePerson: string;
  owner: string;
  condition: 'new' | 'good' | 'fair' | 'poor' | 'damaged';
  createdDate: string;
  lastUpdated: string;
  lastStatusChange: string;
  lastLocationUpdate: string;
  lastCustodianChange: string;
  notes?: string;
  rfidHealth?: number;
  lastScanned?: string;
  // Lock state (for survey cases)
  isLocked?: boolean;
  lockReason?: string; // e.g., "Active survey case"
  activeSurveyCaseId?: string; // Reference to survey case
  // Financial
  poNumber?: string;
  grnNumber?: string;
  acquisitionDate?: string;
  acquisitionValue?: number;
  currency?: string;
  nbv?: number;
  // Lifecycle
  lifecycleStage?: 'registered' | 'active' | 'maintenance' | 'survey' | 'pending-disposal' | 'disposed';
  expectedUsefulLife?: number; // in months
  warrantyExpiry?: string;
  depreciationMethod?: 'straight-line' | 'declining-balance';
  annualDepreciationRate?: number;
  residualValue?: number;
  nextMaintenanceDate?: string;
  lastMaintenanceDate?: string;
  maintenanceCount?: number;
  transferCount?: number;
  surveyStatus?: 'not-surveyed' | 'survey-pending' | 'surveyed' | 'recommended-disposal';
  disposalMethod?: string;
  disposalDate?: string;
  disposalApprovalStatus?: 'pending' | 'approved' | 'rejected';
}

export interface LifecycleEvent {
  id: string;
  stage: string;
  action: string;
  date: string;
  user: string;
  details: string;
  icon: string;
}

export interface AuditEvent {
  id: string;
  eventType: 'status_change' | 'location_change' | 'transfer' | 'edit' | 'inspection' | 'disposal' | 'created' | 'custodian_change';
  action: string;
  oldValue?: string;
  newValue?: string;
  user: string;
  timestamp: string;
  fieldOffice: string;
  comment?: string;
  details?: string;
}

export interface LocationCustodianRecord {
  id: string;
  effectiveDate: string;
  previousLocation: string;
  newLocation: string;
  previousCustodian: string;
  newCustodian: string;
  transferId?: string;
  changedBy: string;
}

export interface InspectionRecord {
  id: string;
  batchId: string;
  inspector: string;
  date: string;
  statusResult: 'passed' | 'failed' | 'conditional' | 'pending';
  notes: string;
  reportAvailable: boolean;
}

export type UserRole = 'admin' | 'smio' | 'auditor' | 'senior_management';

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

export interface AdvancedFilterState {
  fieldOffice: string;
  location: string;
  custodian: string;
  assetType: string;
  category: string;
  lifecycleStatus: string;
  poNumber: string;
  grnNumber: string;
  acquisitionDateFrom: string;
  acquisitionDateTo: string;
  lastUpdatedFrom: string;
  lastUpdatedTo: string;
  valueMin: string;
  valueMax: string;
  condition: string;
  supplier: string;
  warrantyStatus: string;
  rfidTagStatus: string;
  inspectionStatus: string;
  usageStatus: string;
}

export const defaultAdvancedFilters: AdvancedFilterState = {
  fieldOffice: 'all',
  location: 'all',
  custodian: '',
  assetType: 'all',
  category: 'all',
  lifecycleStatus: 'all',
  poNumber: '',
  grnNumber: '',
  acquisitionDateFrom: '',
  acquisitionDateTo: '',
  lastUpdatedFrom: '',
  lastUpdatedTo: '',
  valueMin: '',
  valueMax: '',
  condition: 'all',
  supplier: 'all',
  warrantyStatus: 'all',
  rfidTagStatus: 'all',
  inspectionStatus: 'all',
  usageStatus: 'all',
};

// ── Mock Data ──

export const mockEnhancedAssets: EnhancedAsset[] = [
  {
    id: '1', assetId: 'LAP-001234', epc: 'E2801160600002040000001234', barcode: '123456789012',
    serialNumber: 'DL5520-XR7891', type: 'Laptop', category: 'IT Equipment', name: 'Dell Latitude 5520',
    description: 'High-performance business laptop with Intel Core i7 processor, 16GB RAM, and 512GB SSD. Equipped with full HD display and extended battery life for mobile productivity.',
    location: 'Office Floor 1', fieldOffice: 'Headquarters', status: 'active', publishedDate: '2024-01-15',
    responsiblePerson: 'John Doe', owner: 'Organization', condition: 'good',
    createdDate: '2024-01-15', lastUpdated: '2024-02-01', lastStatusChange: '2024-01-19',
    lastLocationUpdate: '2024-02-01', lastCustodianChange: '2024-01-15',
    notes: 'High-performance laptop for software development team', rfidHealth: 95,
    lastScanned: '2024-12-30 09:15:00', poNumber: 'PO-2024-0012', grnNumber: 'GRN-2024-0008',
    acquisitionDate: '2024-01-10', acquisitionValue: 1450.00, currency: 'USD', nbv: 1160.00,
    lifecycleStage: 'active', expectedUsefulLife: 36, warrantyExpiry: '2025-01-10',
    depreciationMethod: 'straight-line', annualDepreciationRate: 2.78, residualValue: 150.00,
    nextMaintenanceDate: '2024-06-15', lastMaintenanceDate: '2024-01-15', maintenanceCount: 1,
    transferCount: 0, surveyStatus: 'not-surveyed', disposalMethod: '',
    disposalDate: '', disposalApprovalStatus: 'pending',
  },
  {
    id: '2', assetId: 'DES-001235', epc: 'E2801160600002040000001235', barcode: '123456789013',
    serialNumber: 'HP800-QW4523', type: 'Desktop', category: 'IT Equipment', name: 'HP EliteDesk 800',
    description: 'Compact desktop workstation for office use. Features Intel Core i5 processor, 8GB RAM, 256GB SSD. Includes integrated graphics and multiple USB ports.',
    location: 'Office A1-02', fieldOffice: 'Headquarters', status: 'active', publishedDate: '2024-01-16',
    responsiblePerson: 'Jane Smith', owner: 'Organization', condition: 'good',
    createdDate: '2024-01-16', lastUpdated: '2024-01-21', lastStatusChange: '2024-01-16',
    lastLocationUpdate: '2024-01-16', lastCustodianChange: '2024-01-16',
    rfidHealth: 88, lastScanned: '2024-12-29 14:30:00', poNumber: 'PO-2024-0012',
    grnNumber: 'GRN-2024-0008', acquisitionDate: '2024-01-12', acquisitionValue: 980.00,
    currency: 'USD', nbv: 784.00,
    lifecycleStage: 'active', expectedUsefulLife: 48, warrantyExpiry: '2025-01-16',
    depreciationMethod: 'straight-line', annualDepreciationRate: 2.08, residualValue: 100.00,
    nextMaintenanceDate: '2024-07-16', lastMaintenanceDate: '2024-01-16', maintenanceCount: 1,
    transferCount: 0, surveyStatus: 'not-surveyed', disposalMethod: '',
    disposalDate: '', disposalApprovalStatus: 'pending',
  },
  {
    id: '3', assetId: 'PRN-001236', epc: 'E2801160600002040000001236', barcode: '123456789014',
    serialNumber: 'CN-IR-8820A', type: 'Printer', category: 'Office Equipment', name: 'Canon ImageRunner',
    location: 'Office Floor 1', fieldOffice: 'Regional Office East', status: 'maintenance', publishedDate: '2024-01-17',
    responsiblePerson: 'Bob Wilson', owner: 'Organization', condition: 'fair',
    createdDate: '2024-01-17', lastUpdated: '2024-01-22', lastStatusChange: '2024-01-20',
    lastLocationUpdate: '2024-01-17', lastCustodianChange: '2024-01-17',
    rfidHealth: 72, lastScanned: '2024-12-28 11:20:00', poNumber: 'PO-2024-0015',
    grnNumber: 'GRN-2024-0010', acquisitionDate: '2024-01-14', acquisitionValue: 3200.00,
    currency: 'USD', nbv: 2720.00,
    lifecycleStage: 'maintenance', expectedUsefulLife: 60, warrantyExpiry: '2025-01-17',
    depreciationMethod: 'declining-balance', annualDepreciationRate: 15.00, residualValue: 500.00,
    nextMaintenanceDate: '2024-08-17', lastMaintenanceDate: '2024-01-17', maintenanceCount: 1,
    transferCount: 0, surveyStatus: 'not-surveyed', disposalMethod: '',
    disposalDate: '', disposalApprovalStatus: 'pending',
  },
  {
    id: '4', assetId: 'MON-001237', epc: 'E2801160600002040000001237', barcode: '123456789015',
    serialNumber: 'DL-U27-99312', type: 'Monitor', category: 'IT Equipment', name: 'Dell U2720Q 27"',
    location: 'Office A1-03', fieldOffice: 'Regional Office West', status: 'missing', publishedDate: '2024-01-10',
    responsiblePerson: 'Sarah Chen', owner: 'Organization', condition: 'good',
    createdDate: '2024-01-10', lastUpdated: '2024-12-25', lastStatusChange: '2024-12-20',
    lastLocationUpdate: '2024-01-10', lastCustodianChange: '2024-01-10',
    notes: '', rfidHealth: 65, lastScanned: '2024-12-15 16:45:00', poNumber: 'PO-2024-0010',
    grnNumber: 'GRN-2024-0006', acquisitionDate: '2024-01-05', acquisitionValue: 620.00,
    currency: 'USD', nbv: 527.00,
    isLocked: true, lockReason: 'Active survey case in progress', activeSurveyCaseId: 'SUR-2026-0042',
    lifecycleStage: 'pending-disposal', expectedUsefulLife: 36, warrantyExpiry: '2025-01-10',
    depreciationMethod: 'straight-line', annualDepreciationRate: 2.78, residualValue: 150.00,
    nextMaintenanceDate: '2024-06-15', lastMaintenanceDate: '2024-01-15', maintenanceCount: 1,
    transferCount: 0, surveyStatus: 'recommended-disposal', disposalMethod: 'recycling',
    disposalDate: '', disposalApprovalStatus: 'pending',
  },
  {
    id: '5', assetId: 'SRV-001238', epc: 'E2801160600002040000001238', barcode: '123456789016',
    serialNumber: 'HP-DL380-XK231', type: 'Server', category: 'IT Equipment', name: 'HP ProLiant DL380',
    location: 'Server Room B2', fieldOffice: 'Headquarters', status: 'active', publishedDate: '2024-02-01',
    responsiblePerson: 'Mike Torres', owner: 'Organization', condition: 'new',
    createdDate: '2024-02-01', lastUpdated: '2024-02-15', lastStatusChange: '2024-02-01',
    lastLocationUpdate: '2024-02-01', lastCustodianChange: '2024-02-01',
    rfidHealth: 99, lastScanned: '2024-12-31 08:00:00', poNumber: 'PO-2024-0020',
    grnNumber: 'GRN-2024-0014', acquisitionDate: '2024-01-28', acquisitionValue: 8500.00,
    currency: 'USD', nbv: 7650.00,
    lifecycleStage: 'active', expectedUsefulLife: 48, warrantyExpiry: '2025-01-28',
    depreciationMethod: 'straight-line', annualDepreciationRate: 2.08, residualValue: 100.00,
    nextMaintenanceDate: '2024-07-28', lastMaintenanceDate: '2024-01-28', maintenanceCount: 1,
    transferCount: 0, surveyStatus: 'not-surveyed', disposalMethod: '',
    disposalDate: '', disposalApprovalStatus: 'pending',
  },
  {
    id: '6', assetId: 'FUR-001239', epc: 'E2801160600002040000001239', barcode: '123456789017',
    serialNumber: 'HM-ERG-5541', type: 'Furniture', category: 'Office Furniture', name: 'Herman Miller Aeron Chair',
    location: 'Office A1-05', fieldOffice: 'Headquarters', status: 'active', publishedDate: '2024-01-20',
    responsiblePerson: 'Emily Davis', owner: 'Facilities', condition: 'good',
    createdDate: '2024-01-20', lastUpdated: '2024-03-10', lastStatusChange: '2024-01-20',
    lastLocationUpdate: '2024-03-10', lastCustodianChange: '2024-03-10',
    rfidHealth: 91, lastScanned: '2024-12-30 10:30:00', poNumber: 'PO-2024-0018',
    grnNumber: 'GRN-2024-0012', acquisitionDate: '2024-01-18', acquisitionValue: 1350.00,
    currency: 'USD', nbv: 1215.00,
    lifecycleStage: 'active', expectedUsefulLife: 60, warrantyExpiry: '2025-01-18',
    depreciationMethod: 'declining-balance', annualDepreciationRate: 15.00, residualValue: 500.00,
    nextMaintenanceDate: '2024-08-18', lastMaintenanceDate: '2024-01-18', maintenanceCount: 1,
    transferCount: 0, surveyStatus: 'not-surveyed', disposalMethod: '',
    disposalDate: '', disposalApprovalStatus: 'pending',
  },
  {
    id: '7', assetId: 'NET-001240', epc: 'E2801160600002040000001240', barcode: '123456789018',
    serialNumber: 'CS-9300-XA871', type: 'Networking', category: 'IT Equipment', name: 'Cisco Catalyst 9300',
    location: 'Server Room B2', fieldOffice: 'Headquarters', status: 'active', publishedDate: '2024-02-05',
    responsiblePerson: 'Mike Torres', owner: 'Organization', condition: 'good',
    createdDate: '2024-02-05', lastUpdated: '2024-02-20', lastStatusChange: '2024-02-05',
    lastLocationUpdate: '2024-02-05', lastCustodianChange: '2024-02-05',
    rfidHealth: 97, lastScanned: '2024-12-31 07:45:00', poNumber: 'PO-2024-0022',
    grnNumber: 'GRN-2024-0016', acquisitionDate: '2024-02-01', acquisitionValue: 4200.00,
    currency: 'USD', nbv: 3780.00,
    lifecycleStage: 'active', expectedUsefulLife: 48, warrantyExpiry: '2025-02-01',
    depreciationMethod: 'straight-line', annualDepreciationRate: 2.08, residualValue: 100.00,
    nextMaintenanceDate: '2024-07-01', lastMaintenanceDate: '2024-02-01', maintenanceCount: 1,
    transferCount: 0, surveyStatus: 'not-surveyed', disposalMethod: '',
    disposalDate: '', disposalApprovalStatus: 'pending',
  },
  {
    id: '8', assetId: 'LAP-001241', epc: 'E2801160600002040000001241', barcode: '123456789019',
    serialNumber: 'LN-T14-VV892', type: 'Laptop', category: 'IT Equipment', name: 'Lenovo ThinkPad T14',
    location: 'Office Floor 2', fieldOffice: 'Regional Office East', status: 'inactive', publishedDate: '2023-06-15',
    responsiblePerson: 'Lisa Park', owner: 'Organization', condition: 'fair',
    createdDate: '2023-06-15', lastUpdated: '2024-11-01', lastStatusChange: '2024-11-01',
    lastLocationUpdate: '2024-09-15', lastCustodianChange: '2024-09-15',
    rfidHealth: 45, lastScanned: '2024-12-20 09:00:00', poNumber: 'PO-2023-0088',
    grnNumber: 'GRN-2023-0060', acquisitionDate: '2023-06-10', acquisitionValue: 1200.00,
    currency: 'USD', nbv: 600.00,
    lifecycleStage: 'pending-disposal', expectedUsefulLife: 36, warrantyExpiry: '2024-06-10',
    depreciationMethod: 'straight-line', annualDepreciationRate: 2.78, residualValue: 150.00,
    nextMaintenanceDate: '2024-06-10', lastMaintenanceDate: '2023-06-10', maintenanceCount: 1,
    transferCount: 0, surveyStatus: 'recommended-disposal', disposalMethod: 'recycling',
    disposalDate: '', disposalApprovalStatus: 'pending',
  },
];

export const mockLifecycleEvents: LifecycleEvent[] = [
  { id: '1', stage: 'registered', action: 'Asset Registered', date: '2024-01-15 10:00:00', user: 'System', details: 'Initial asset registration via SAP sync', icon: 'registered' },
  { id: '2', stage: 'active', action: 'Status Updated', date: '2024-01-19 09:15:00', user: 'Admin', details: 'Returned from maintenance', icon: 'active' },
  { id: '3', stage: 'maintenance', action: 'Custodian Changed', date: '2024-01-18 16:45:00', user: 'Admin', details: 'Team reassignment', icon: 'maintenance' },
  { id: '4', stage: 'survey', action: 'Inspection Completed', date: '2024-01-17 11:00:00', user: 'Inspector Lee', details: 'Quarterly inspection - all checks passed', icon: 'survey' },
  { id: '5', stage: 'active', action: 'Notes Updated', date: '2024-01-16 10:30:00', user: 'John Doe', details: 'High-performance laptop for software development team', icon: 'active' },
  { id: '6', stage: 'transfer', action: 'Asset Transferred', date: '2024-01-15 15:00:00', user: 'Logistics Team', details: 'Inter-office transfer approved by management', icon: 'transfer' },
  { id: '7', stage: 'active', action: 'Asset Created', date: '2024-01-15 10:00:00', user: 'System', details: 'Initial asset registration via SAP sync', icon: 'active' },
];

export const mockAuditEvents: AuditEvent[] = [
  { id: '1', eventType: 'location_change', action: 'Location Changed', oldValue: 'Office A1-05', newValue: 'Office Floor 1', user: 'John Doe', timestamp: '2024-02-01 14:30:00', fieldOffice: 'Headquarters', comment: 'Moved due to office reorganization' },
  { id: '2', eventType: 'status_change', action: 'Status Updated', oldValue: 'inactive', newValue: 'active', user: 'Admin', timestamp: '2024-01-19 09:15:00', fieldOffice: 'Headquarters', comment: 'Returned from maintenance' },
  { id: '3', eventType: 'custodian_change', action: 'Custodian Changed', oldValue: 'Jane Smith', newValue: 'John Doe', user: 'Admin', timestamp: '2024-01-18 16:45:00', fieldOffice: 'Headquarters', comment: 'Team reassignment' },
  { id: '4', eventType: 'inspection', action: 'Inspection Completed', newValue: 'Passed', user: 'Inspector Lee', timestamp: '2024-01-17 11:00:00', fieldOffice: 'Headquarters', comment: 'Quarterly inspection - all checks passed' },
  { id: '5', eventType: 'edit', action: 'Notes Updated', newValue: 'High-performance laptop for software development team', user: 'John Doe', timestamp: '2024-01-16 10:30:00', fieldOffice: 'Headquarters' },
  { id: '6', eventType: 'transfer', action: 'Asset Transferred', oldValue: 'Regional Office East', newValue: 'Headquarters', user: 'Logistics Team', timestamp: '2024-01-15 15:00:00', fieldOffice: 'Headquarters', comment: 'Inter-office transfer approved by management' },
  { id: '7', eventType: 'created', action: 'Asset Created', newValue: 'LAP-001234', user: 'System', timestamp: '2024-01-15 10:00:00', fieldOffice: 'Headquarters', comment: 'Initial asset registration via SAP sync' },
];

export const mockLocationCustodianHistory: LocationCustodianRecord[] = [
  { id: '1', effectiveDate: '2024-02-01', previousLocation: 'Office A1-05', newLocation: 'Office Floor 1', previousCustodian: 'John Doe', newCustodian: 'John Doe', changedBy: 'Admin' },
  { id: '2', effectiveDate: '2024-01-18', previousLocation: 'Office A1-05', newLocation: 'Office A1-05', previousCustodian: 'Jane Smith', newCustodian: 'John Doe', transferId: 'TRF-2024-0003', changedBy: 'Admin' },
  { id: '3', effectiveDate: '2024-01-15', previousLocation: 'Warehouse B1', newLocation: 'Office A1-05', previousCustodian: '—', newCustodian: 'Jane Smith', transferId: 'TRF-2024-0001', changedBy: 'System' },
];

export const mockInspections: InspectionRecord[] = [
  { id: '1', batchId: 'INS-2024-Q4-001', inspector: 'Inspector Lee', date: '2024-12-15', statusResult: 'passed', notes: 'All RFID tags functional. Physical condition good.', reportAvailable: true },
  { id: '2', batchId: 'INS-2024-Q3-012', inspector: 'Inspector Ahmed', date: '2024-09-20', statusResult: 'passed', notes: 'Standard quarterly inspection passed.', reportAvailable: true },
  { id: '3', batchId: 'INS-2024-Q2-008', inspector: 'Inspector Lee', date: '2024-06-18', statusResult: 'conditional', notes: 'Minor scratch on casing. Tag read distance slightly reduced.', reportAvailable: true },
  { id: '4', batchId: 'INS-2024-Q1-003', inspector: 'Inspector Kim', date: '2024-03-12', statusResult: 'passed', notes: 'First quarterly inspection. All checks passed.', reportAvailable: false },
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'inactive': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    case 'maintenance': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
    case 'disposed': return 'bg-red-500/10 text-red-700 dark:text-red-300';
    case 'missing': return 'bg-red-500/10 text-red-700 dark:text-red-300';
    case 'in-transit': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  }
};

export const getConditionColor = (condition: string) => {
  switch (condition) {
    case 'new': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    case 'good': return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'fair': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
    case 'poor': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
    case 'damaged': return 'bg-red-500/10 text-red-700 dark:text-red-300';
    default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  }
};

export const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'status_change': return '#121321';
    case 'location_change': return '#121321';
    case 'transfer': return '#121321';
    case 'edit': return '#121321';
    case 'inspection': return '#121321';
    case 'disposal': return '#121321';
    case 'created': return '#121321';
    case 'custodian_change': return '#121321';
    default: return '#121321';
  }
};

export const getInspectionStatusColor = (status: string) => {
  switch (status) {
    case 'passed': return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'failed': return 'bg-red-500/10 text-red-700 dark:text-red-300';
    case 'conditional': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
    case 'pending': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  }
};

export function calculateAssetAge(createdDate: string): string {
  const created = new Date(createdDate);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);
  return remainingMonths > 0 ? `${years}y ${remainingMonths}mo` : `${years}y`;
}

export function daysSince(dateStr: string): number {
  return Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}