// ── Asset Disposal Management Types & Mock Data ──

export type DisposalMethod = 'auction' | 'donation' | 'scrap' | 'write-off' | 'trade-in' | 'recycling';
export type DisposalStatus = 'draft' | 'pending-review' | 'pending-approval' | 'approved' | 'in-progress' | 'completed' | 'rejected' | 'cancelled';
export interface DisposalAssetItem {
  id: string;
  assetId: string;
  name: string;
  serialNumber: string;
  type: string;
  currentLocation: string;
  condition: string;
  acquisitionValue: number;
  currentNBV: number;
  disposalValue: number;
  reason: string;
}

export interface DisposalSignature {
  role: 'requesting_officer' | 'finance_reviewer' | 'approving_authority' | 'disposal_officer';
  name: string;
  status: 'pending' | 'signed' | 'declined';
  signedDate?: string;
  method?: 'digital' | 'manual';
}

export interface DisposalAuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface DisposalRequest {
  id: string;
  disposalId: string;
  disposalMethod: DisposalMethod;
  status: DisposalStatus;

  // Assignment
  requestedBy: string;
  reviewedBy: string;
  approvedBy: string;
  disposalOfficer: string;
  fieldOffice: string;

  // Details
  title: string;
  justification: string;
  notes: string;
  assets: DisposalAssetItem[];

  // Financial
  totalAcquisitionValue: number;
  totalNBV: number;
  totalDisposalValue: number;
  writeOffAmount: number;

  // Disposal specific
  recipientOrganization?: string;
  auctionReferenceNumber?: string;
  certificateOfDestruction?: boolean;
  environmentalCompliance: boolean;
  dataWipeCertified: boolean;

  // Schedule
  requestedDate: string;
  reviewDate?: string;
  approvalDate?: string;
  targetDisposalDate: string;
  actualDisposalDate?: string;

  // Workflow
  createdBy: string;
  createdDate: string;

  // Cross-link to survey
  linkedSurveyId?: string;
  assetsLocked: boolean;

  // Workflow configuration
  workflowType: 'hq' | 'field' | 'local';

  // Signatures
  signatures: DisposalSignature[];

  // Documents
  attachments: string[];

  // Audit
  auditTrail: DisposalAuditEntry[];
}

// ── Status colors ──

export const getDisposalStatusColor = (status: DisposalStatus) => {
  switch (status) {
    case 'draft': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    case 'pending-review': return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300';
    case 'pending-approval': return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'approved': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'in-progress': return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300';
    case 'completed': return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'rejected': return 'bg-red-500/10 text-red-700 dark:text-red-300';
    case 'cancelled': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  }
};

export const getDisposalMethodLabel = (method: DisposalMethod) => {
  switch (method) {
    case 'auction': return 'Auction';
    case 'donation': return 'Donation';
    case 'scrap': return 'Scrap';
    case 'write-off': return 'Write-Off';
    case 'trade-in': return 'Trade-In';
    case 'recycling': return 'Recycling';
  }
};

export const getDisposalMethodColor = (method: DisposalMethod) => {
  switch (method) {
    case 'auction': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    case 'donation': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'scrap': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
    case 'write-off': return 'bg-red-500/10 text-red-700 dark:text-red-300';
    case 'trade-in': return 'bg-teal-500/10 text-teal-700 dark:text-teal-300';
    case 'recycling': return 'bg-green-500/10 text-green-700 dark:text-green-300';
  }
};

// ── Mock Data ──

export const mockDisposals: DisposalRequest[] = [
  {
    id: '1',
    disposalId: 'DSP-2026-0001',
    disposalMethod: 'write-off',
    status: 'pending-approval',
    requestedBy: 'Sarah Chen',
    reviewedBy: 'Finance Manager',
    approvedBy: 'IT Director',
    disposalOfficer: 'Bob Wilson',
    fieldOffice: 'Regional Office West',
    title: 'Write-Off: Water-Damaged Desktop',
    justification: 'Desktop suffered irreparable water damage during flooding incident on Feb 22. Post-incident inspection (INS-2026-0004) confirmed total loss. Data recovered from HDD.',
    notes: 'Insurance claim filed. Replacement procurement in progress.',
    assets: [
      { id: '9', assetId: 'DES-001242', name: 'Dell OptiPlex 7090', serialNumber: 'DO7090-AB123', type: 'Desktop', currentLocation: 'Office A1-03', condition: 'damaged', acquisitionValue: 1250, currentNBV: 625, disposalValue: 0, reason: 'Irreparable water damage' },
    ],
    totalAcquisitionValue: 1250,
    totalNBV: 625,
    totalDisposalValue: 0,
    writeOffAmount: 625,
    certificateOfDestruction: false,
    environmentalCompliance: true,
    dataWipeCertified: true,
    requestedDate: '2026-02-23T09:00:00',
    reviewDate: '2026-02-24T10:00:00',
    targetDisposalDate: '2026-03-15T00:00:00',
    createdBy: 'Sarah Chen',
    createdDate: '2026-02-23T09:00:00',
    linkedSurveyId: 'SRV-2026-0003',
    assetsLocked: true,
    workflowType: 'field',
    signatures: [
      { role: 'requesting_officer', name: 'Sarah Chen', status: 'signed', signedDate: '2026-02-23T09:00:00', method: 'digital' },
      { role: 'finance_reviewer', name: 'Finance Manager', status: 'signed', signedDate: '2026-02-24T10:00:00', method: 'digital' },
      { role: 'approving_authority', name: 'IT Director', status: 'pending' },
      { role: 'disposal_officer', name: 'Bob Wilson', status: 'pending' },
    ],
    attachments: ['DSP-2026-0001_request.pdf', 'INS-2026-0004_report.pdf', 'insurance_claim_ref.pdf'],
    auditTrail: [
      { id: 'a1', action: 'Disposal Requested', user: 'Sarah Chen', timestamp: '2026-02-23T09:00:00', details: 'Write-off request for water-damaged desktop' },
      { id: 'a2', action: 'Finance Review Completed', user: 'Finance Manager', timestamp: '2026-02-24T10:00:00', details: 'NBV verified at $625. Write-off approved by finance.' },
      { id: 'a3', action: 'Routed for Approval', user: 'System', timestamp: '2026-02-24T10:05:00', details: 'Awaiting IT Director approval' },
    ],
  },
  {
    id: '2',
    disposalId: 'DSP-2026-0002',
    disposalMethod: 'donation',
    status: 'approved',
    requestedBy: 'Emily Davis',
    reviewedBy: 'Finance Manager',
    approvedBy: 'Operations Director',
    disposalOfficer: 'Emily Davis',
    fieldOffice: 'Headquarters',
    title: 'Donation: Surplus Office Furniture',
    justification: 'Office renovation has resulted in surplus furniture. Items are in serviceable condition and suitable for donation to local school.',
    notes: 'Receiving organization: Springfield Elementary School. Donation letter prepared.',
    assets: [
      { id: '12', assetId: 'FUR-001245', name: 'Office Desk (Standard)', serialNumber: 'OD-STD-4401', type: 'Furniture', currentLocation: 'Warehouse B2', condition: 'fair', acquisitionValue: 450, currentNBV: 45, disposalValue: 0, reason: 'Surplus after renovation' },
      { id: '13', assetId: 'FUR-001246', name: 'Office Chair (Basic)', serialNumber: 'OC-BSC-4402', type: 'Furniture', currentLocation: 'Warehouse B2', condition: 'fair', acquisitionValue: 200, currentNBV: 20, disposalValue: 0, reason: 'Surplus after renovation' },
      { id: '14', assetId: 'FUR-001247', name: 'Filing Cabinet (4-Drawer)', serialNumber: 'FC-4D-4403', type: 'Furniture', currentLocation: 'Warehouse B2', condition: 'good', acquisitionValue: 350, currentNBV: 105, disposalValue: 0, reason: 'Surplus after renovation' },
    ],
    totalAcquisitionValue: 1000,
    totalNBV: 170,
    totalDisposalValue: 0,
    writeOffAmount: 170,
    recipientOrganization: 'Springfield Elementary School',
    certificateOfDestruction: false,
    environmentalCompliance: true,
    dataWipeCertified: false,
    requestedDate: '2026-02-15T11:00:00',
    reviewDate: '2026-02-16T09:00:00',
    approvalDate: '2026-02-17T10:00:00',
    targetDisposalDate: '2026-03-01T00:00:00',
    createdBy: 'Emily Davis',
    createdDate: '2026-02-15T11:00:00',
    assetsLocked: true,
    workflowType: 'hq',
    signatures: [
      { role: 'requesting_officer', name: 'Emily Davis', status: 'signed', signedDate: '2026-02-15T11:00:00', method: 'digital' },
      { role: 'finance_reviewer', name: 'Finance Manager', status: 'signed', signedDate: '2026-02-16T09:00:00', method: 'digital' },
      { role: 'approving_authority', name: 'Operations Director', status: 'signed', signedDate: '2026-02-17T10:00:00', method: 'digital' },
      { role: 'disposal_officer', name: 'Emily Davis', status: 'pending' },
    ],
    attachments: ['DSP-2026-0002_request.pdf', 'donation_letter.pdf'],
    auditTrail: [
      { id: 'b1', action: 'Disposal Requested', user: 'Emily Davis', timestamp: '2026-02-15T11:00:00', details: 'Donation of surplus furniture' },
      { id: 'b2', action: 'Finance Reviewed', user: 'Finance Manager', timestamp: '2026-02-16T09:00:00', details: 'Total NBV: $170' },
      { id: 'b3', action: 'Approved', user: 'Operations Director', timestamp: '2026-02-17T10:00:00', details: 'Donation approved' },
    ],
  },
  {
    id: '3',
    disposalId: 'DSP-2026-0003',
    disposalMethod: 'auction',
    status: 'in-progress',
    requestedBy: 'Mike Torres',
    reviewedBy: 'Finance Manager',
    approvedBy: 'IT Director',
    disposalOfficer: 'Bob Wilson',
    fieldOffice: 'Headquarters',
    title: 'Auction: Decommissioned Network Equipment',
    justification: 'Network equipment decommissioned after infrastructure upgrade. Still functional but no longer meets organizational requirements.',
    notes: 'Listed on government surplus auction platform. Auction ref: AUC-2026-0044.',
    assets: [
      { id: '15', assetId: 'NET-001248', name: 'Cisco Catalyst 3850', serialNumber: 'CS-3850-OLD1', type: 'Networking', currentLocation: 'Warehouse B1', condition: 'fair', acquisitionValue: 3800, currentNBV: 380, disposalValue: 850, reason: 'Replaced by newer model' },
      { id: '16', assetId: 'NET-001249', name: 'Cisco ASA 5506', serialNumber: 'CS-ASA-OLD2', type: 'Networking', currentLocation: 'Warehouse B1', condition: 'fair', acquisitionValue: 2200, currentNBV: 220, disposalValue: 450, reason: 'Replaced by newer model' },
    ],
    totalAcquisitionValue: 6000,
    totalNBV: 600,
    totalDisposalValue: 1300,
    writeOffAmount: 0,
    auctionReferenceNumber: 'AUC-2026-0044',
    certificateOfDestruction: false,
    environmentalCompliance: true,
    dataWipeCertified: true,
    requestedDate: '2026-02-10T10:00:00',
    reviewDate: '2026-02-11T09:00:00',
    approvalDate: '2026-02-12T14:00:00',
    targetDisposalDate: '2026-03-15T00:00:00',
    createdBy: 'Mike Torres',
    createdDate: '2026-02-10T10:00:00',
    assetsLocked: true,
    workflowType: 'hq',
    signatures: [
      { role: 'requesting_officer', name: 'Mike Torres', status: 'signed', signedDate: '2026-02-10T10:00:00', method: 'digital' },
      { role: 'finance_reviewer', name: 'Finance Manager', status: 'signed', signedDate: '2026-02-11T09:00:00', method: 'digital' },
      { role: 'approving_authority', name: 'IT Director', status: 'signed', signedDate: '2026-02-12T14:00:00', method: 'digital' },
      { role: 'disposal_officer', name: 'Bob Wilson', status: 'signed', signedDate: '2026-02-13T10:00:00', method: 'digital' },
    ],
    attachments: ['DSP-2026-0003_request.pdf', 'data_wipe_cert.pdf', 'auction_listing.pdf'],
    auditTrail: [
      { id: 'c1', action: 'Disposal Requested', user: 'Mike Torres', timestamp: '2026-02-10T10:00:00' },
      { id: 'c2', action: 'Finance Reviewed', user: 'Finance Manager', timestamp: '2026-02-11T09:00:00' },
      { id: 'c3', action: 'Approved', user: 'IT Director', timestamp: '2026-02-12T14:00:00' },
      { id: 'c4', action: 'Data Wipe Completed', user: 'Bob Wilson', timestamp: '2026-02-13T09:00:00', details: 'DoD 5220.22-M standard wipe applied' },
      { id: 'c5', action: 'Listed for Auction', user: 'Bob Wilson', timestamp: '2026-02-14T10:00:00', details: 'Ref: AUC-2026-0044' },
    ],
  },
  {
    id: '4',
    disposalId: 'DSP-2026-0004',
    disposalMethod: 'recycling',
    status: 'completed',
    requestedBy: 'Jane Smith',
    reviewedBy: 'Finance Manager',
    approvedBy: 'Admin Manager',
    disposalOfficer: 'Bob Wilson',
    fieldOffice: 'Headquarters',
    title: 'Recycling: End-of-Life Printers',
    justification: 'Two printers have reached end-of-life with no available parts for repair. Recycling per e-waste policy.',
    notes: 'Recycled through certified e-waste vendor (GreenTech Recycling).',
    assets: [
      { id: '17', assetId: 'PRT-001250', name: 'HP LaserJet Pro M404', serialNumber: 'HP-LJ-EOL1', type: 'Printer', currentLocation: 'Warehouse B1', condition: 'non-functional', acquisitionValue: 600, currentNBV: 0, disposalValue: 15, reason: 'End of life, no parts available' },
      { id: '18', assetId: 'PRT-001251', name: 'Epson WorkForce WF-2830', serialNumber: 'EP-WF-EOL2', type: 'Printer', currentLocation: 'Warehouse B1', condition: 'non-functional', acquisitionValue: 350, currentNBV: 0, disposalValue: 10, reason: 'End of life, unrepairable' },
    ],
    totalAcquisitionValue: 950,
    totalNBV: 0,
    totalDisposalValue: 25,
    writeOffAmount: 0,
    recipientOrganization: 'GreenTech Recycling Ltd.',
    certificateOfDestruction: true,
    environmentalCompliance: true,
    dataWipeCertified: true,
    requestedDate: '2026-02-01T10:00:00',
    reviewDate: '2026-02-02T09:00:00',
    approvalDate: '2026-02-03T10:00:00',
    targetDisposalDate: '2026-02-15T00:00:00',
    actualDisposalDate: '2026-02-14T14:00:00',
    createdBy: 'Jane Smith',
    createdDate: '2026-02-01T10:00:00',
    assetsLocked: false,
    workflowType: 'hq',
    signatures: [
      { role: 'requesting_officer', name: 'Jane Smith', status: 'signed', signedDate: '2026-02-01T10:00:00', method: 'digital' },
      { role: 'finance_reviewer', name: 'Finance Manager', status: 'signed', signedDate: '2026-02-02T09:00:00', method: 'digital' },
      { role: 'approving_authority', name: 'Admin Manager', status: 'signed', signedDate: '2026-02-03T10:00:00', method: 'digital' },
      { role: 'disposal_officer', name: 'Bob Wilson', status: 'signed', signedDate: '2026-02-14T14:00:00', method: 'digital' },
    ],
    attachments: ['DSP-2026-0004_request.pdf', 'data_wipe_cert.pdf', 'recycling_certificate.pdf', 'certificate_of_destruction.pdf'],
    auditTrail: [
      { id: 'd1', action: 'Disposal Requested', user: 'Jane Smith', timestamp: '2026-02-01T10:00:00' },
      { id: 'd2', action: 'Finance Reviewed', user: 'Finance Manager', timestamp: '2026-02-02T09:00:00' },
      { id: 'd3', action: 'Approved', user: 'Admin Manager', timestamp: '2026-02-03T10:00:00' },
      { id: 'd4', action: 'Data Wipe Completed', user: 'Bob Wilson', timestamp: '2026-02-10T10:00:00' },
      { id: 'd5', action: 'Assets Collected by Vendor', user: 'Bob Wilson', timestamp: '2026-02-14T10:00:00' },
      { id: 'd6', action: 'Disposal Completed', user: 'Bob Wilson', timestamp: '2026-02-14T14:00:00', details: 'Certificate of destruction received' },
    ],
  },
  {
    id: '5',
    disposalId: 'DSP-2026-0005',
    disposalMethod: 'scrap',
    status: 'rejected',
    requestedBy: 'David Lee',
    reviewedBy: 'Finance Manager',
    approvedBy: 'Operations Director',
    disposalOfficer: 'Bob Wilson',
    fieldOffice: 'Headquarters',
    title: 'Scrap: Server with Minor Fault',
    justification: 'Server experiencing intermittent errors. Requesting scrap disposal.',
    notes: '',
    assets: [
      { id: '19', assetId: 'SRV-001252', name: 'Dell PowerEdge T440', serialNumber: 'PE-T440-FF001', type: 'Server', currentLocation: 'Server Room B2', condition: 'fair', acquisitionValue: 6500, currentNBV: 3250, disposalValue: 200, reason: 'Intermittent hardware errors' },
    ],
    totalAcquisitionValue: 6500,
    totalNBV: 3250,
    totalDisposalValue: 200,
    writeOffAmount: 3050,
    certificateOfDestruction: false,
    environmentalCompliance: true,
    dataWipeCertified: false,
    requestedDate: '2026-02-20T09:00:00',
    reviewDate: '2026-02-21T10:00:00',
    targetDisposalDate: '2026-03-10T00:00:00',
    createdBy: 'David Lee',
    createdDate: '2026-02-20T09:00:00',
    assetsLocked: false,
    workflowType: 'hq',
    signatures: [
      { role: 'requesting_officer', name: 'David Lee', status: 'signed', signedDate: '2026-02-20T09:00:00', method: 'digital' },
      { role: 'finance_reviewer', name: 'Finance Manager', status: 'signed', signedDate: '2026-02-21T10:00:00', method: 'digital' },
      { role: 'approving_authority', name: 'Operations Director', status: 'declined' },
      { role: 'disposal_officer', name: 'Bob Wilson', status: 'pending' },
    ],
    attachments: ['DSP-2026-0005_request.pdf'],
    auditTrail: [
      { id: 'e1', action: 'Disposal Requested', user: 'David Lee', timestamp: '2026-02-20T09:00:00' },
      { id: 'e2', action: 'Finance Reviewed', user: 'Finance Manager', timestamp: '2026-02-21T10:00:00', details: 'High NBV flagged ($3,250). Requires careful review.' },
      { id: 'e3', action: 'Rejected', user: 'Operations Director', timestamp: '2026-02-22T14:00:00', details: 'Server has significant remaining value. Send for professional repair first. Scrap not justified at this time.' },
    ],
  },
  {
    id: '6',
    disposalId: 'DSP-2026-0006',
    disposalMethod: 'trade-in',
    status: 'draft',
    requestedBy: 'John Doe',
    reviewedBy: '',
    approvedBy: '',
    disposalOfficer: '',
    fieldOffice: 'Headquarters',
    title: 'Trade-In: Laptop Fleet Refresh',
    justification: 'Planning trade-in of older laptops as part of annual fleet refresh. Vendor quote pending.',
    notes: 'Draft — vendor quote expected by March 5.',
    assets: [
      { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', currentLocation: 'Office Floor 2', condition: 'fair', acquisitionValue: 1200, currentNBV: 480, disposalValue: 350, reason: 'Fleet refresh - newer model available' },
    ],
    totalAcquisitionValue: 1200,
    totalNBV: 480,
    totalDisposalValue: 350,
    writeOffAmount: 130,
    certificateOfDestruction: false,
    environmentalCompliance: true,
    dataWipeCertified: false,
    requestedDate: '2026-02-27T10:00:00',
    targetDisposalDate: '2026-04-01T00:00:00',
    createdBy: 'John Doe',
    createdDate: '2026-02-27T10:00:00',
    assetsLocked: false,
    workflowType: 'hq',
    signatures: [
      { role: 'requesting_officer', name: 'John Doe', status: 'pending' },
      { role: 'finance_reviewer', name: '', status: 'pending' },
      { role: 'approving_authority', name: '', status: 'pending' },
      { role: 'disposal_officer', name: '', status: 'pending' },
    ],
    attachments: [],
    auditTrail: [
      { id: 'f1', action: 'Draft Created', user: 'John Doe', timestamp: '2026-02-27T10:00:00', details: 'Trade-in request draft saved' },
    ],
  },
];