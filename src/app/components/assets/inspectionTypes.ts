// ── Asset Inspection Management Types & Mock Data ──

export type InspectionType = 'scheduled' | 'spot-check' | 'pre-transfer' | 'post-incident' | 'regulatory';
export type InspectionStatus = 'draft' | 'scheduled' | 'in-progress' | 'pending-review' | 'completed' | 'failed' | 'cancelled';
export type InspectionResult = 'pass' | 'fail' | 'conditional-pass' | 'pending';
export interface InspectionAssetItem {
  id: string;
  assetId: string;
  name: string;
  serialNumber: string;
  type: string;
  currentLocation: string;
  condition: string;
  result: InspectionResult;
  findings?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  notes?: string;
}

export interface InspectionSignature {
  role: 'inspector' | 'reviewer' | 'custodian';
  name: string;
  status: 'pending' | 'signed' | 'declined';
  signedDate?: string;
  method?: 'digital' | 'manual';
}

export interface InspectionAuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface InspectionRequest {
  id: string;
  inspectionId: string;
  inspectionType: InspectionType;
  status: InspectionStatus;
  result: InspectionResult;

  // Assignment
  inspector: string;
  reviewer: string;
  fieldOffice: string;
  location: string;

  // Schedule
  scheduledDate: string;
  startedDate?: string;
  completedDate?: string;
  dueDate: string;

  // Details
  title: string;
  description: string;
  assets: InspectionAssetItem[];
  checklist: ChecklistItem[];

  // Findings
  overallFindings: string;
  recommendations: string;
  photosAttached: number;

  // Workflow
  createdBy: string;
  createdDate: string;

  // Signatures
  signatures: InspectionSignature[];

  // Audit
  auditTrail: InspectionAuditEntry[];
}

// ── Status colors ──

export const getInspectionStatusColor = (status: InspectionStatus) => {
  switch (status) {
    case 'draft': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    case 'scheduled': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'in-progress': return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'pending-review': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
    case 'completed': return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'failed': return 'bg-red-500/10 text-red-700 dark:text-red-300';
    case 'cancelled': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  }
};

export const getInspectionTypeLabel = (type: InspectionType) => {
  switch (type) {
    case 'scheduled': return 'Scheduled';
    case 'spot-check': return 'Spot Check';
    case 'pre-transfer': return 'Pre-Transfer';
    case 'post-incident': return 'Post-Incident';
    case 'regulatory': return 'Regulatory';
  }
};

export const getInspectionTypeColor = (type: InspectionType) => {
  switch (type) {
    case 'scheduled': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'spot-check': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
    case 'pre-transfer': return 'bg-teal-500/10 text-teal-700 dark:text-teal-300';
    case 'post-incident': return 'bg-red-500/10 text-red-700 dark:text-red-300';
    case 'regulatory': return 'bg-violet-500/10 text-violet-700 dark:text-violet-300';
  }
};

export const getResultColor = (result: InspectionResult) => {
  switch (result) {
    case 'pass': return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'fail': return 'bg-red-500/10 text-red-700 dark:text-red-300';
    case 'conditional-pass': return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'pending': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  }
};

// ── Mock Data ──

export const mockInspections: InspectionRequest[] = [
  {
    id: '1',
    inspectionId: 'INS-2026-0001',
    inspectionType: 'scheduled',
    status: 'in-progress',
    result: 'pending',
    inspector: 'John Doe',
    reviewer: 'IT Director',
    fieldOffice: 'Headquarters',
    location: 'Server Room B2',
    scheduledDate: '2026-02-27T09:00:00',
    startedDate: '2026-02-27T09:15:00',
    dueDate: '2026-02-28T17:00:00',
    title: 'Q1 Server Room Equipment Inspection',
    description: 'Quarterly inspection of all server room equipment including servers, networking gear, and UPS systems.',
    assets: [
      { id: '5', assetId: 'SRV-001238', name: 'HP ProLiant DL380', serialNumber: 'HP-DL380-XK231', type: 'Server', currentLocation: 'Server Room B2', condition: 'new', result: 'pass', findings: 'Operating within normal parameters' },
      { id: '7', assetId: 'NET-001240', name: 'Cisco Catalyst 9300', serialNumber: 'CS-9300-XA871', type: 'Networking', currentLocation: 'Server Room B2', condition: 'good', result: 'pending' },
    ],
    checklist: [
      { id: 'c1', label: 'Physical condition verified', checked: true },
      { id: 'c2', label: 'Serial numbers confirmed', checked: true },
      { id: 'c3', label: 'RFID tags scanned', checked: true },
      { id: 'c4', label: 'Location accuracy verified', checked: false },
      { id: 'c5', label: 'Operating status checked', checked: false },
      { id: 'c6', label: 'Safety compliance verified', checked: false },
    ],
    overallFindings: '',
    recommendations: '',
    photosAttached: 3,
    createdBy: 'John Doe',
    createdDate: '2026-02-25T10:00:00',
    signatures: [
      { role: 'inspector', name: 'John Doe', status: 'pending' },
      { role: 'reviewer', name: 'IT Director', status: 'pending' },
    ],
    auditTrail: [
      { id: 'a1', action: 'Inspection Created', user: 'John Doe', timestamp: '2026-02-25T10:00:00', details: 'Scheduled Q1 server room inspection' },
      { id: 'a2', action: 'Inspection Started', user: 'John Doe', timestamp: '2026-02-27T09:15:00', details: 'Inspector began on-site inspection' },
    ],
  },
  {
    id: '2',
    inspectionId: 'INS-2026-0002',
    inspectionType: 'spot-check',
    status: 'completed',
    result: 'pass',
    inspector: 'Jane Smith',
    reviewer: 'Admin Manager',
    fieldOffice: 'Headquarters',
    location: 'Office Floor 1',
    scheduledDate: '2026-02-20T14:00:00',
    startedDate: '2026-02-20T14:10:00',
    completedDate: '2026-02-20T16:30:00',
    dueDate: '2026-02-20T17:00:00',
    title: 'Random Spot Check - Office Floor 1',
    description: 'Unannounced spot check of office assets on Floor 1 to verify RFID tag accuracy and physical presence.',
    assets: [
      { id: '1', assetId: 'LAP-001234', name: 'Dell Latitude 5520', serialNumber: 'DL5520-XR7891', type: 'Laptop', currentLocation: 'Office Floor 1', condition: 'good', result: 'pass', findings: 'Asset present and in good condition' },
      { id: '2', assetId: 'DES-001235', name: 'HP EliteDesk 800', serialNumber: 'HP800-QW4523', type: 'Desktop', currentLocation: 'Office A1-02', condition: 'good', result: 'pass', findings: 'Asset verified' },
    ],
    checklist: [
      { id: 'c1', label: 'Physical condition verified', checked: true },
      { id: 'c2', label: 'Serial numbers confirmed', checked: true },
      { id: 'c3', label: 'RFID tags scanned', checked: true },
      { id: 'c4', label: 'Location accuracy verified', checked: true },
    ],
    overallFindings: 'All assets accounted for and in satisfactory condition. No discrepancies found.',
    recommendations: 'Continue quarterly spot checks.',
    photosAttached: 5,
    createdBy: 'Jane Smith',
    createdDate: '2026-02-20T13:00:00',
    signatures: [
      { role: 'inspector', name: 'Jane Smith', status: 'signed', signedDate: '2026-02-20T16:30:00', method: 'digital' },
      { role: 'reviewer', name: 'Admin Manager', status: 'signed', signedDate: '2026-02-21T09:00:00', method: 'digital' },
    ],
    auditTrail: [
      { id: 'b1', action: 'Inspection Created', user: 'Jane Smith', timestamp: '2026-02-20T13:00:00', details: 'Spot check initiated' },
      { id: 'b2', action: 'Inspection Started', user: 'Jane Smith', timestamp: '2026-02-20T14:10:00' },
      { id: 'b3', action: 'Inspection Completed', user: 'Jane Smith', timestamp: '2026-02-20T16:30:00', details: 'All assets passed' },
      { id: 'b4', action: 'Review Approved', user: 'Admin Manager', timestamp: '2026-02-21T09:00:00', details: 'Findings reviewed and accepted' },
    ],
  },
  {
    id: '3',
    inspectionId: 'INS-2026-0003',
    inspectionType: 'pre-transfer',
    status: 'pending-review',
    result: 'conditional-pass',
    inspector: 'Bob Wilson',
    reviewer: 'IT Director',
    fieldOffice: 'Headquarters',
    location: 'Warehouse B1',
    scheduledDate: '2026-02-26T10:00:00',
    startedDate: '2026-02-26T10:05:00',
    completedDate: '2026-02-26T12:00:00',
    dueDate: '2026-02-26T17:00:00',
    title: 'Pre-Transfer Inspection - Warehouse Equipment',
    description: 'Condition assessment before transferring warehouse equipment to Regional Office East.',
    assets: [
      { id: '6', assetId: 'FUR-001239', name: 'Herman Miller Aeron Chair', serialNumber: 'HM-ERG-5541', type: 'Furniture', currentLocation: 'Warehouse B1', condition: 'good', result: 'pass', findings: 'Good condition, minor cosmetic wear' },
      { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', currentLocation: 'Office Floor 2', condition: 'fair', result: 'conditional-pass', findings: 'Battery at 65% health. Recommend battery replacement before transfer.' },
    ],
    checklist: [
      { id: 'c1', label: 'Physical condition verified', checked: true },
      { id: 'c2', label: 'Serial numbers confirmed', checked: true },
      { id: 'c3', label: 'RFID tags scanned', checked: true },
      { id: 'c4', label: 'Functionality tested', checked: true },
      { id: 'c5', label: 'Accessories accounted for', checked: true },
    ],
    overallFindings: 'One asset requires battery replacement before transfer. Chair is in good condition for transfer.',
    recommendations: 'Replace laptop battery (LAP-001241) before proceeding with transfer. Estimated cost: $85.',
    photosAttached: 8,
    createdBy: 'Bob Wilson',
    createdDate: '2026-02-26T09:00:00',
    signatures: [
      { role: 'inspector', name: 'Bob Wilson', status: 'signed', signedDate: '2026-02-26T12:00:00', method: 'digital' },
      { role: 'reviewer', name: 'IT Director', status: 'pending' },
    ],
    auditTrail: [
      { id: 'c1a', action: 'Inspection Created', user: 'Bob Wilson', timestamp: '2026-02-26T09:00:00' },
      { id: 'c2a', action: 'Inspection Started', user: 'Bob Wilson', timestamp: '2026-02-26T10:05:00' },
      { id: 'c3a', action: 'Inspection Completed', user: 'Bob Wilson', timestamp: '2026-02-26T12:00:00', details: 'Conditional pass — review needed' },
      { id: 'c4a', action: 'Submitted for Review', user: 'Bob Wilson', timestamp: '2026-02-26T12:05:00', details: 'Awaiting IT Director review' },
    ],
  },
  {
    id: '4',
    inspectionId: 'INS-2026-0004',
    inspectionType: 'post-incident',
    status: 'completed',
    result: 'fail',
    inspector: 'Sarah Chen',
    reviewer: 'IT Director',
    fieldOffice: 'Regional Office West',
    location: 'Office A1-03',
    scheduledDate: '2026-02-22T08:00:00',
    startedDate: '2026-02-22T08:15:00',
    completedDate: '2026-02-22T11:00:00',
    dueDate: '2026-02-22T12:00:00',
    title: 'Post-Incident Inspection - Water Damage',
    description: 'Assessment of IT equipment after minor flooding incident in Office A1-03.',
    assets: [
      { id: '9', assetId: 'DES-001242', name: 'Dell OptiPlex 7090', serialNumber: 'DO7090-AB123', type: 'Desktop', currentLocation: 'Office A1-03', condition: 'damaged', result: 'fail', findings: 'Water damage to motherboard. Non-functional.' },
    ],
    checklist: [
      { id: 'c1', label: 'Physical condition verified', checked: true },
      { id: 'c2', label: 'Damage extent assessed', checked: true },
      { id: 'c3', label: 'Data recovery attempted', checked: true },
      { id: 'c4', label: 'Insurance documentation prepared', checked: true },
    ],
    overallFindings: 'Desktop suffered irreparable water damage. Data recovered from HDD. Recommend disposal and insurance claim.',
    recommendations: 'Initiate disposal process. File insurance claim. Procure replacement unit.',
    photosAttached: 12,
    createdBy: 'Sarah Chen',
    createdDate: '2026-02-22T07:30:00',
    signatures: [
      { role: 'inspector', name: 'Sarah Chen', status: 'signed', signedDate: '2026-02-22T11:00:00', method: 'digital' },
      { role: 'reviewer', name: 'IT Director', status: 'signed', signedDate: '2026-02-22T14:00:00', method: 'digital' },
    ],
    auditTrail: [
      { id: 'd1', action: 'Inspection Created', user: 'Sarah Chen', timestamp: '2026-02-22T07:30:00', details: 'Emergency post-incident inspection' },
      { id: 'd2', action: 'Inspection Started', user: 'Sarah Chen', timestamp: '2026-02-22T08:15:00' },
      { id: 'd3', action: 'Inspection Completed', user: 'Sarah Chen', timestamp: '2026-02-22T11:00:00', details: 'Asset failed inspection — water damage' },
      { id: 'd4', action: 'Review Completed', user: 'IT Director', timestamp: '2026-02-22T14:00:00', details: 'Disposal recommended' },
    ],
  },
  {
    id: '5',
    inspectionId: 'INS-2026-0005',
    inspectionType: 'scheduled',
    status: 'scheduled',
    result: 'pending',
    inspector: 'Mike Torres',
    reviewer: 'Operations Manager',
    fieldOffice: 'Regional Office East',
    location: 'Office Floor 2',
    scheduledDate: '2026-03-03T10:00:00',
    dueDate: '2026-03-05T17:00:00',
    title: 'Q1 Office Equipment Inspection - Regional East',
    description: 'Quarterly scheduled inspection of all office equipment at Regional Office East.',
    assets: [
      { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', currentLocation: 'Office Floor 2', condition: 'fair', result: 'pending' },
    ],
    checklist: [
      { id: 'c1', label: 'Physical condition verified', checked: false },
      { id: 'c2', label: 'Serial numbers confirmed', checked: false },
      { id: 'c3', label: 'RFID tags scanned', checked: false },
      { id: 'c4', label: 'Location accuracy verified', checked: false },
    ],
    overallFindings: '',
    recommendations: '',
    photosAttached: 0,
    createdBy: 'Mike Torres',
    createdDate: '2026-02-26T14:00:00',
    signatures: [
      { role: 'inspector', name: 'Mike Torres', status: 'pending' },
      { role: 'reviewer', name: 'Operations Manager', status: 'pending' },
    ],
    auditTrail: [
      { id: 'e1', action: 'Inspection Scheduled', user: 'Mike Torres', timestamp: '2026-02-26T14:00:00', details: 'Q1 inspection scheduled for March 3-5' },
    ],
  },
  {
    id: '6',
    inspectionId: 'INS-2026-0006',
    inspectionType: 'regulatory',
    status: 'draft',
    result: 'pending',
    inspector: 'Emily Davis',
    reviewer: 'Compliance Officer',
    fieldOffice: 'Headquarters',
    location: 'Main Building',
    scheduledDate: '2026-03-10T09:00:00',
    dueDate: '2026-03-15T17:00:00',
    title: 'Annual Regulatory Compliance Audit',
    description: 'Mandatory annual inspection for regulatory compliance. Covers fire safety equipment and emergency systems.',
    assets: [],
    checklist: [
      { id: 'c1', label: 'Fire extinguisher inspection', checked: false },
      { id: 'c2', label: 'Emergency exit signage', checked: false },
      { id: 'c3', label: 'First aid kit contents', checked: false },
      { id: 'c4', label: 'Smoke detector testing', checked: false },
    ],
    overallFindings: '',
    recommendations: '',
    photosAttached: 0,
    createdBy: 'Emily Davis',
    createdDate: '2026-02-27T08:00:00',
    signatures: [
      { role: 'inspector', name: 'Emily Davis', status: 'pending' },
      { role: 'reviewer', name: 'Compliance Officer', status: 'pending' },
    ],
    auditTrail: [
      { id: 'f1', action: 'Draft Created', user: 'Emily Davis', timestamp: '2026-02-27T08:00:00', details: 'Annual compliance inspection draft' },
    ],
  },
];
