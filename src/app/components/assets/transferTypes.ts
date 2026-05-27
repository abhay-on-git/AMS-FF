// ── Asset Transfer Management Types & Mock Data ──

export type TransferType = 'intra-field' | 'inter-field';
export type TransferStatus = 'draft' | 'pending-custodian' | 'pending-approval' | 'approved' | 'in-transit' | 'pending-acknowledgment' | 'completed' | 'rejected' | 'cancelled';

export interface TransferAssetItem {
  id: string;
  assetId: string;
  name: string;
  serialNumber: string;
  type: string;
  currentLocation: string;
  condition: string;
  acquisitionValue?: number;
}

export interface TransferSignature {
  role: 'initiating_officer' | 'receiving_custodian' | 'approving_officer';
  name: string;
  status: 'pending' | 'signed' | 'declined';
  signedDate?: string;
  method?: 'digital' | 'manual';
}

export interface TransferAuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
  oldValue?: string;
  newValue?: string;
}

export interface TransferRequest {
  id: string;
  transferId: string;
  transferType: TransferType;
  status: TransferStatus;

  // From
  fromCustodian: string;
  fromLocation: string;
  fromBuilding: string;
  fromRoom: string;
  fromFieldOffice: string;

  // To
  toCustodian: string;
  toLocation: string;
  toBuilding: string;
  toRoom: string;
  toFieldOffice: string;

  // Details
  reason: string;
  notes: string;
  assets: TransferAssetItem[];

  // Workflow
  initiatedBy: string;
  initiatedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  receivedBy?: string;
  receivedDate?: string;
  completedDate?: string;
  rejectedBy?: string;
  rejectedDate?: string;
  rejectionReason?: string;

  // Signatures
  signatures: TransferSignature[];

  // Document
  formGenerated: boolean;
  formUploaded: boolean;
  attachments: string[];

  // Notifications
  notificationsSent: boolean;
  acknowledgmentRequired: boolean;
  acknowledged: boolean;

  // Audit
  auditTrail: TransferAuditEntry[];
}

// ── Status colors ──

export const getTransferStatusColor = (status: TransferStatus) => {
  switch (status) {
    case 'draft': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    case 'pending-custodian': return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300';
    case 'pending-approval': return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'approved': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'in-transit': return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300';
    case 'pending-acknowledgment': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
    case 'completed': return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'rejected': return 'bg-red-500/10 text-red-700 dark:text-red-300';
    case 'cancelled': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  }
};

export const getTransferTypeLabel = (type: TransferType) => {
  switch (type) {
    case 'intra-field': return 'Intra-Field';
    case 'inter-field': return 'Inter-Field';
  }
};

export const getTransferTypeColor = (type: TransferType) => {
  switch (type) {
    case 'intra-field': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'inter-field': return 'bg-violet-500/10 text-violet-700 dark:text-violet-300';
  }
};

// ── Reference data ──

export const fieldOffices = [
  'Headquarters', 'Regional Office East', 'Regional Office West', 'Field Office North', 'Field Office South',
];

export const buildings = [
  'Main Building', 'Annex A', 'Annex B', 'Warehouse Complex', 'Field Station Alpha', 'Field Station Beta',
];

export const rooms = [
  'Office Floor 1', 'Office Floor 2', 'Office A1-01', 'Office A1-02', 'Office A1-03', 'Office A1-04', 'Office A1-05',
  'Office B2-03', 'Office B2-04', 'Server Room B2', 'Warehouse B1', 'Warehouse B2', 'Conference Room 1', 'Conference Room 2',
];

export const custodians = [
  'John Doe', 'Jane Smith', 'Bob Wilson', 'Sarah Chen', 'Mike Torres', 'Emily Davis', 'Lisa Park', 'David Lee', 'Alice Brown',
];

// ── Eligible assets for transfer ──

export const eligibleAssets: TransferAssetItem[] = [
  { id: '1', assetId: 'LAP-001234', name: 'Dell Latitude 5520', serialNumber: 'DL5520-XR7891', type: 'Laptop', currentLocation: 'Office Floor 1', condition: 'good', acquisitionValue: 1450.00 },
  { id: '2', assetId: 'DES-001235', name: 'HP EliteDesk 800', serialNumber: 'HP800-QW4523', type: 'Desktop', currentLocation: 'Office A1-02', condition: 'good', acquisitionValue: 980.00 },
  { id: '5', assetId: 'SRV-001238', name: 'HP ProLiant DL380', serialNumber: 'HP-DL380-XK231', type: 'Server', currentLocation: 'Server Room B2', condition: 'new', acquisitionValue: 8500.00 },
  { id: '6', assetId: 'FUR-001239', name: 'Herman Miller Aeron Chair', serialNumber: 'HM-ERG-5541', type: 'Furniture', currentLocation: 'Office A1-05', condition: 'good', acquisitionValue: 1350.00 },
  { id: '7', assetId: 'NET-001240', name: 'Cisco Catalyst 9300', serialNumber: 'CS-9300-XA871', type: 'Networking', currentLocation: 'Server Room B2', condition: 'good', acquisitionValue: 4200.00 },
  { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', currentLocation: 'Office Floor 2', condition: 'fair', acquisitionValue: 1200.00 },
];

// Assets that CANNOT be transferred (disposed, missing, under survey)
export const ineligibleAssetIds = ['3', '4']; // Printer (maintenance), Monitor (missing)

// ── Mock Transfer Requests ──

export const mockTransfers: TransferRequest[] = [
  {
    id: '1',
    transferId: 'TRF-2026-0001',
    transferType: 'inter-field',
    status: 'pending-custodian',
    fromCustodian: 'John Doe',
    fromLocation: 'Office Floor 1',
    fromBuilding: 'Main Building',
    fromRoom: 'Office Floor 1',
    fromFieldOffice: 'Headquarters',
    toCustodian: 'Sarah Chen',
    toLocation: 'Office A1-03',
    toBuilding: 'Field Station Alpha',
    toRoom: 'Office A1-03',
    toFieldOffice: 'Regional Office West',
    reason: 'Staff relocation — IT equipment needed at regional office for new project deployment',
    notes: 'Includes high-value server equipment. Requires management approval per inter-field policy.',
    assets: [
      { id: '1', assetId: 'LAP-001234', name: 'Dell Latitude 5520', serialNumber: 'DL5520-XR7891', type: 'Laptop', currentLocation: 'Office Floor 1', condition: 'good', acquisitionValue: 1450 },
      { id: '5', assetId: 'SRV-001238', name: 'HP ProLiant DL380', serialNumber: 'HP-DL380-XK231', type: 'Server', currentLocation: 'Server Room B2', condition: 'new', acquisitionValue: 8500 },
    ],
    initiatedBy: 'John Doe',
    initiatedDate: '2026-02-25T10:30:00',
    signatures: [
      { role: 'initiating_officer', name: 'John Doe', status: 'signed', signedDate: '2026-02-25T10:30:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'Sarah Chen', status: 'pending' },
      { role: 'approving_officer', name: 'Regional Director', status: 'pending' },
    ],
    formGenerated: true,
    formUploaded: false,
    attachments: ['TRF-2026-0001_form.pdf'],
    notificationsSent: true,
    acknowledgmentRequired: true,
    acknowledged: false,
    auditTrail: [
      { id: 'a1', action: 'Transfer Initiated', user: 'John Doe', timestamp: '2026-02-25T10:30:00', details: 'Inter-field transfer request created with 2 assets' },
      { id: 'a2', action: 'Initiator Signed', user: 'John Doe', timestamp: '2026-02-25T10:30:00', details: 'Digital signature applied by initiating officer' },
      { id: 'a3', action: 'Form Generated', user: 'System', timestamp: '2026-02-25T10:30:05', details: 'Transfer form PDF auto-generated' },
      { id: 'a4', action: 'Notification Sent', user: 'System', timestamp: '2026-02-25T10:30:10', details: 'Email notification sent to Sarah Chen for custodian signature' },
    ],
  },
  {
    id: '9',
    transferId: 'TRF-2026-0009',
    transferType: 'inter-field',
    status: 'pending-approval',
    fromCustodian: 'Mike Torres',
    fromLocation: 'Server Room B2',
    fromBuilding: 'Main Building',
    fromRoom: 'Server Room B2',
    fromFieldOffice: 'Headquarters',
    toCustodian: 'Lisa Park',
    toLocation: 'Office Floor 2',
    toBuilding: 'Field Station Beta',
    toRoom: 'Office Floor 2',
    toFieldOffice: 'Regional Office East',
    reason: 'Laptop provisioning for new HR staff at regional office',
    notes: 'Both initiator and receiving custodian have signed. Awaiting approver decision.',
    assets: [
      { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', currentLocation: 'Office Floor 2', condition: 'fair', acquisitionValue: 1200 },
    ],
    initiatedBy: 'Mike Torres',
    initiatedDate: '2026-02-24T14:00:00',
    signatures: [
      { role: 'initiating_officer', name: 'Mike Torres', status: 'signed', signedDate: '2026-02-24T14:00:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'Lisa Park', status: 'signed', signedDate: '2026-02-25T09:00:00', method: 'digital' },
      { role: 'approving_officer', name: 'IT Director', status: 'pending' },
    ],
    formGenerated: true,
    formUploaded: false,
    attachments: ['TRF-2026-0009_form.pdf'],
    notificationsSent: true,
    acknowledgmentRequired: true,
    acknowledged: false,
    auditTrail: [
      { id: 'i1', action: 'Transfer Initiated', user: 'Mike Torres', timestamp: '2026-02-24T14:00:00', details: 'Inter-field transfer request created' },
      { id: 'i2', action: 'Initiator Signed', user: 'Mike Torres', timestamp: '2026-02-24T14:00:00', details: 'Digital signature applied' },
      { id: 'i3', action: 'Custodian Signed', user: 'Lisa Park', timestamp: '2026-02-25T09:00:00', details: 'Receiving custodian confirmed and signed' },
      { id: 'i4', action: 'Routed to Approver', user: 'System', timestamp: '2026-02-25T09:00:05', details: 'Transfer forwarded to IT Director for final approval' },
    ],
  },
  {
    id: '2',
    transferId: 'TRF-2026-0002',
    transferType: 'intra-field',
    status: 'approved',
    fromCustodian: 'Bob Wilson',
    fromLocation: 'Warehouse B1',
    fromBuilding: 'Warehouse Complex',
    fromRoom: 'Warehouse B1',
    fromFieldOffice: 'Headquarters',
    toCustodian: 'Emily Davis',
    toLocation: 'Office A1-05',
    toBuilding: 'Main Building',
    toRoom: 'Office A1-05',
    toFieldOffice: 'Headquarters',
    reason: 'New office setup — furniture and equipment deployment for newly onboarded staff',
    notes: 'Standard intra-field transfer within HQ campus.',
    assets: [
      { id: '6', assetId: 'FUR-001239', name: 'Herman Miller Aeron Chair', serialNumber: 'HM-ERG-5541', type: 'Furniture', currentLocation: 'Warehouse B1', condition: 'good', acquisitionValue: 1350 },
    ],
    initiatedBy: 'Bob Wilson',
    initiatedDate: '2026-02-24T09:15:00',
    approvedBy: 'Admin Manager',
    approvedDate: '2026-02-24T14:00:00',
    signatures: [
      { role: 'initiating_officer', name: 'Bob Wilson', status: 'signed', signedDate: '2026-02-24T09:15:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'Emily Davis', status: 'signed', signedDate: '2026-02-24T16:00:00', method: 'digital' },
      { role: 'approving_officer', name: 'Admin Manager', status: 'signed', signedDate: '2026-02-24T14:00:00', method: 'digital' },
    ],
    formGenerated: true,
    formUploaded: true,
    attachments: ['TRF-2026-0002_form.pdf', 'TRF-2026-0002_signed.pdf'],
    notificationsSent: true,
    acknowledgmentRequired: true,
    acknowledged: true,
    auditTrail: [
      { id: 'b1', action: 'Transfer Initiated', user: 'Bob Wilson', timestamp: '2026-02-24T09:15:00', details: 'Intra-field transfer request created' },
      { id: 'b2', action: 'Transfer Approved', user: 'Admin Manager', timestamp: '2026-02-24T14:00:00', details: 'Approved for intra-field transfer' },
      { id: 'b3', action: 'Receiving Custodian Signed', user: 'Emily Davis', timestamp: '2026-02-24T16:00:00', details: 'Digital signature applied' },
      { id: 'b4', action: 'Signed Form Uploaded', user: 'Emily Davis', timestamp: '2026-02-24T16:05:00', details: 'Fully signed transfer form uploaded' },
    ],
  },
  {
    id: '3',
    transferId: 'TRF-2026-0003',
    transferType: 'intra-field',
    status: 'completed',
    fromCustodian: 'Jane Smith',
    fromLocation: 'Office A1-02',
    fromBuilding: 'Main Building',
    fromRoom: 'Office A1-02',
    fromFieldOffice: 'Headquarters',
    toCustodian: 'Mike Torres',
    toLocation: 'Server Room B2',
    toBuilding: 'Main Building',
    toRoom: 'Server Room B2',
    toFieldOffice: 'Headquarters',
    reason: 'Equipment consolidation — moving desktop to server room for re-imaging',
    notes: '',
    assets: [
      { id: '2', assetId: 'DES-001235', name: 'HP EliteDesk 800', serialNumber: 'HP800-QW4523', type: 'Desktop', currentLocation: 'Office A1-02', condition: 'good', acquisitionValue: 980 },
    ],
    initiatedBy: 'Jane Smith',
    initiatedDate: '2026-02-20T11:00:00',
    approvedBy: 'IT Manager',
    approvedDate: '2026-02-20T11:30:00',
    receivedBy: 'Mike Torres',
    receivedDate: '2026-02-21T09:00:00',
    completedDate: '2026-02-21T09:00:00',
    signatures: [
      { role: 'initiating_officer', name: 'Jane Smith', status: 'signed', signedDate: '2026-02-20T11:00:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'Mike Torres', status: 'signed', signedDate: '2026-02-21T09:00:00', method: 'manual' },
      { role: 'approving_officer', name: 'IT Manager', status: 'signed', signedDate: '2026-02-20T11:30:00', method: 'digital' },
    ],
    formGenerated: true,
    formUploaded: true,
    attachments: ['TRF-2026-0003_form.pdf', 'TRF-2026-0003_signed_scan.pdf'],
    notificationsSent: true,
    acknowledgmentRequired: false,
    acknowledged: false,
    auditTrail: [
      { id: 'c1', action: 'Transfer Initiated', user: 'Jane Smith', timestamp: '2026-02-20T11:00:00', details: 'Intra-field transfer within same location' },
      { id: 'c2', action: 'Auto-Approved', user: 'System', timestamp: '2026-02-20T11:30:00', details: 'Intra-field transfers auto-approved per policy' },
      { id: 'c3', action: 'Assets In Transit', user: 'System', timestamp: '2026-02-20T12:00:00', details: 'Asset status changed to in-transit' },
      { id: 'c4', action: 'Asset Received', user: 'Mike Torres', timestamp: '2026-02-21T09:00:00', details: 'Manual signature on printed form' },
      { id: 'c5', action: 'Transfer Completed', user: 'System', timestamp: '2026-02-21T09:00:00', details: 'All signatures collected. Asset records updated.' },
    ],
  },
  {
    id: '4',
    transferId: 'TRF-2026-0004',
    transferType: 'inter-field',
    status: 'in-transit',
    fromCustodian: 'Mike Torres',
    fromLocation: 'Server Room B2',
    fromBuilding: 'Main Building',
    fromRoom: 'Server Room B2',
    fromFieldOffice: 'Headquarters',
    toCustodian: 'David Lee',
    toLocation: 'Office Floor 2',
    toBuilding: 'Field Station Beta',
    toRoom: 'Office Floor 2',
    toFieldOffice: 'Regional Office East',
    reason: 'Network infrastructure upgrade at regional office',
    notes: 'Networking equipment for regional LAN upgrade. Fragile — special handling required.',
    assets: [
      { id: '7', assetId: 'NET-001240', name: 'Cisco Catalyst 9300', serialNumber: 'CS-9300-XA871', type: 'Networking', currentLocation: 'Server Room B2', condition: 'good', acquisitionValue: 4200 },
    ],
    initiatedBy: 'Mike Torres',
    initiatedDate: '2026-02-23T08:00:00',
    approvedBy: 'IT Director',
    approvedDate: '2026-02-23T10:00:00',
    signatures: [
      { role: 'initiating_officer', name: 'Mike Torres', status: 'signed', signedDate: '2026-02-23T08:00:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'David Lee', status: 'pending' },
      { role: 'approving_officer', name: 'IT Director', status: 'signed', signedDate: '2026-02-23T10:00:00', method: 'digital' },
    ],
    formGenerated: true,
    formUploaded: false,
    attachments: ['TRF-2026-0004_form.pdf'],
    notificationsSent: true,
    acknowledgmentRequired: true,
    acknowledged: false,
    auditTrail: [
      { id: 'd1', action: 'Transfer Initiated', user: 'Mike Torres', timestamp: '2026-02-23T08:00:00', details: 'Inter-field transfer to Regional Office East' },
      { id: 'd2', action: 'Transfer Approved', user: 'IT Director', timestamp: '2026-02-23T10:00:00', details: 'Approved — high-value network equipment' },
      { id: 'd3', action: 'Assets Shipped', user: 'Logistics Team', timestamp: '2026-02-24T07:00:00', details: 'Shipment dispatched via secured logistics' },
    ],
  },
  {
    id: '5',
    transferId: 'TRF-2026-0005',
    transferType: 'intra-field',
    status: 'pending-acknowledgment',
    fromCustodian: 'Emily Davis',
    fromLocation: 'Office A1-05',
    fromBuilding: 'Main Building',
    fromRoom: 'Office A1-05',
    fromFieldOffice: 'Headquarters',
    toCustodian: 'Alice Brown',
    toLocation: 'Office A1-04',
    toBuilding: 'Main Building',
    toRoom: 'Office A1-04',
    toFieldOffice: 'Headquarters',
    reason: 'Furniture reallocation as part of Q1 workspace optimization',
    notes: 'Chair reassigned per HR request. Awaiting acknowledgment from new custodian.',
    assets: [
      { id: '6', assetId: 'FUR-001239', name: 'Herman Miller Aeron Chair', serialNumber: 'HM-ERG-5541', type: 'Furniture', currentLocation: 'Office A1-05', condition: 'good', acquisitionValue: 1350 },
    ],
    initiatedBy: 'Emily Davis',
    initiatedDate: '2026-02-26T14:00:00',
    approvedBy: 'Facilities Manager',
    approvedDate: '2026-02-26T15:30:00',
    signatures: [
      { role: 'initiating_officer', name: 'Emily Davis', status: 'signed', signedDate: '2026-02-26T14:00:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'Alice Brown', status: 'pending' },
      { role: 'approving_officer', name: 'Facilities Manager', status: 'signed', signedDate: '2026-02-26T15:30:00', method: 'digital' },
    ],
    formGenerated: true,
    formUploaded: false,
    attachments: ['TRF-2026-0005_form.pdf'],
    notificationsSent: true,
    acknowledgmentRequired: true,
    acknowledged: false,
    auditTrail: [
      { id: 'e1', action: 'Transfer Initiated', user: 'Emily Davis', timestamp: '2026-02-26T14:00:00', details: 'Intra-field furniture transfer' },
      { id: 'e2', action: 'Transfer Approved', user: 'Facilities Manager', timestamp: '2026-02-26T15:30:00' },
      { id: 'e3', action: 'Asset Delivered', user: 'Facilities Team', timestamp: '2026-02-27T09:00:00', details: 'Asset physically delivered to Office A1-04' },
      { id: 'e4', action: 'Acknowledgment Requested', user: 'System', timestamp: '2026-02-27T09:05:00', details: 'Awaiting digital acknowledgment from Alice Brown' },
    ],
  },
  {
    id: '6',
    transferId: 'TRF-2026-0006',
    transferType: 'inter-field',
    status: 'rejected',
    fromCustodian: 'Lisa Park',
    fromLocation: 'Office Floor 2',
    fromBuilding: 'Field Station Beta',
    fromRoom: 'Office Floor 2',
    fromFieldOffice: 'Regional Office East',
    toCustodian: 'John Doe',
    toLocation: 'Office Floor 1',
    toBuilding: 'Main Building',
    toRoom: 'Office Floor 1',
    toFieldOffice: 'Headquarters',
    reason: 'Return of underperforming laptop to HQ IT for evaluation',
    notes: 'Laptop has intermittent issues. IT team to assess.',
    assets: [
      { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', currentLocation: 'Office Floor 2', condition: 'fair', acquisitionValue: 1200 },
    ],
    initiatedBy: 'Lisa Park',
    initiatedDate: '2026-02-22T13:00:00',
    rejectedBy: 'Regional Director',
    rejectedDate: '2026-02-22T16:00:00',
    rejectionReason: 'Asset should be sent for local repair first. Transfer not justified at this time.',
    signatures: [
      { role: 'initiating_officer', name: 'Lisa Park', status: 'signed', signedDate: '2026-02-22T13:00:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'John Doe', status: 'pending' },
      { role: 'approving_officer', name: 'Regional Director', status: 'declined' },
    ],
    formGenerated: true,
    formUploaded: false,
    attachments: ['TRF-2026-0006_form.pdf'],
    notificationsSent: true,
    acknowledgmentRequired: false,
    acknowledged: false,
    auditTrail: [
      { id: 'f1', action: 'Transfer Initiated', user: 'Lisa Park', timestamp: '2026-02-22T13:00:00', details: 'Inter-field laptop return request' },
      { id: 'f2', action: 'Transfer Rejected', user: 'Regional Director', timestamp: '2026-02-22T16:00:00', details: 'Reason: Asset should be sent for local repair first.' },
    ],
  },
  {
    id: '7',
    transferId: 'TRF-2026-0007',
    transferType: 'intra-field',
    status: 'draft',
    fromCustodian: 'Mike Torres',
    fromLocation: 'Server Room B2',
    fromBuilding: 'Main Building',
    fromRoom: 'Server Room B2',
    fromFieldOffice: 'Headquarters',
    toCustodian: '',
    toLocation: '',
    toBuilding: '',
    toRoom: '',
    toFieldOffice: 'Headquarters',
    reason: 'Equipment rotation for quarterly maintenance cycle',
    notes: 'Draft — custodian and destination TBD.',
    assets: [
      { id: '5', assetId: 'SRV-001238', name: 'HP ProLiant DL380', serialNumber: 'HP-DL380-XK231', type: 'Server', currentLocation: 'Server Room B2', condition: 'new', acquisitionValue: 8500 },
    ],
    initiatedBy: 'Mike Torres',
    initiatedDate: '2026-02-27T08:00:00',
    signatures: [],
    formGenerated: false,
    formUploaded: false,
    attachments: [],
    notificationsSent: false,
    acknowledgmentRequired: false,
    acknowledged: false,
    auditTrail: [
      { id: 'g1', action: 'Draft Created', user: 'Mike Torres', timestamp: '2026-02-27T08:00:00', details: 'Transfer draft saved for later completion' },
    ],
  },
  {
    id: '8',
    transferId: 'TRF-2026-0008',
    transferType: 'intra-field',
    status: 'completed',
    fromCustodian: 'David Lee',
    fromLocation: 'Office A1-04',
    fromBuilding: 'Main Building',
    fromRoom: 'Office A1-04',
    fromFieldOffice: 'Headquarters',
    toCustodian: 'Bob Wilson',
    toLocation: 'Warehouse B1',
    toBuilding: 'Warehouse Complex',
    toRoom: 'Warehouse B1',
    toFieldOffice: 'Headquarters',
    reason: 'Surplus equipment return to warehouse for storage',
    notes: 'End of project — equipment no longer needed in office.',
    assets: [
      { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', currentLocation: 'Office Floor 2', condition: 'fair', acquisitionValue: 1200 },
    ],
    initiatedBy: 'David Lee',
    initiatedDate: '2026-02-15T10:00:00',
    approvedBy: 'Operations Manager',
    approvedDate: '2026-02-15T11:00:00',
    receivedBy: 'Bob Wilson',
    receivedDate: '2026-02-16T09:00:00',
    completedDate: '2026-02-16T09:00:00',
    signatures: [
      { role: 'initiating_officer', name: 'David Lee', status: 'signed', signedDate: '2026-02-15T10:00:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'Bob Wilson', status: 'signed', signedDate: '2026-02-16T09:00:00', method: 'digital' },
      { role: 'approving_officer', name: 'Operations Manager', status: 'signed', signedDate: '2026-02-15T11:00:00', method: 'digital' },
    ],
    formGenerated: true,
    formUploaded: true,
    attachments: ['TRF-2026-0008_form.pdf', 'TRF-2026-0008_signed.pdf'],
    notificationsSent: true,
    acknowledgmentRequired: true,
    acknowledged: true,
    auditTrail: [
      { id: 'h1', action: 'Transfer Initiated', user: 'David Lee', timestamp: '2026-02-15T10:00:00' },
      { id: 'h2', action: 'Transfer Approved', user: 'Operations Manager', timestamp: '2026-02-15T11:00:00' },
      { id: 'h3', action: 'Asset Received', user: 'Bob Wilson', timestamp: '2026-02-16T09:00:00' },
      { id: 'h4', action: 'Transfer Completed', user: 'System', timestamp: '2026-02-16T09:00:00', details: 'All steps completed. Asset records updated.' },
    ],
  },
];