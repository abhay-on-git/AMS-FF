// ── Asset Survey Management Types & Mock Data ──

export type SurveyType = 'full-count' | 'sample-based' | 'location-based' | 'custodian-based' | 'high-value';
export type SurveyStatus = 'draft' | 'planned' | 'in-progress' | 'reconciliation' | 'pending-approval' | 'completed' | 'cancelled';
export type DiscrepancyType = 'missing' | 'location-mismatch' | 'condition-change' | 'untagged' | 'surplus';
export interface SurveyAssetItem {
  id: string;
  assetId: string;
  name: string;
  serialNumber: string;
  type: string;
  expectedLocation: string;
  actualLocation: string;
  expectedCondition: string;
  actualCondition: string;
  verified: boolean;
  discrepancy?: DiscrepancyType;
  notes?: string;
  acquisitionValue?: number;
  nbv?: number;
  disposalReason?: string;
}

export interface SurveySignature {
  role: 'surveyor' | 'team_lead' | 'approver';
  name: string;
  status: 'pending' | 'signed' | 'declined';
  signedDate?: string;
  method?: 'digital' | 'manual';
}

export interface SurveyAuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface SurveyRequest {
  id: string;
  surveyId: string;
  surveyType: SurveyType;
  status: SurveyStatus;

  // Assignment
  surveyTeamLead: string;
  surveyors: string[];
  fieldOffice: string;
  targetLocations: string[];

  // Schedule
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;

  // Details
  title: string;
  description: string;
  scope: string;

  // Results
  assets: SurveyAssetItem[];
  totalExpected: number;
  totalVerified: number;
  totalDiscrepancies: number;
  accuracyRate: number;

  // Cross-link to disposal
  linkedDisposalId?: string;
  assetsLocked: boolean;

  // Workflow configuration
  workflowType: 'hq' | 'field' | 'local';

  // Workflow
  createdBy: string;
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;

  // Signatures
  signatures: SurveySignature[];

  // Documents
  attachments: string[];
  reportGenerated: boolean;

  // Audit
  auditTrail: SurveyAuditEntry[];
}

// ── Status colors ──

export const getSurveyStatusColor = (status: SurveyStatus) => {
  switch (status) {
    case 'draft': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    case 'planned': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'in-progress': return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'reconciliation': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
    case 'pending-approval': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
    case 'completed': return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'cancelled': return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  }
};

export const getSurveyTypeLabel = (type: SurveyType) => {
  switch (type) {
    case 'full-count': return 'Full Count';
    case 'sample-based': return 'Sample-Based';
    case 'location-based': return 'Location-Based';
    case 'custodian-based': return 'Custodian-Based';
    case 'high-value': return 'High-Value';
  }
};

export const getSurveyTypeColor = (type: SurveyType) => {
  switch (type) {
    case 'full-count': return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300';
    case 'sample-based': return 'bg-teal-500/10 text-teal-700 dark:text-teal-300';
    case 'location-based': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'custodian-based': return 'bg-violet-500/10 text-violet-700 dark:text-violet-300';
    case 'high-value': return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
  }
};

export const getDiscrepancyColor = (type: DiscrepancyType) => {
  switch (type) {
    case 'missing': return 'bg-red-500/10 text-red-700 dark:text-red-300';
    case 'location-mismatch': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
    case 'condition-change': return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'untagged': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
    case 'surplus': return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300';
  }
};

// ── Mock Data ──

export const mockSurveys: SurveyRequest[] = [
  {
    id: '1',
    surveyId: 'SRV-2026-0001',
    surveyType: 'full-count',
    status: 'in-progress',
    surveyTeamLead: 'John Doe',
    surveyors: ['John Doe', 'Jane Smith', 'Bob Wilson'],
    fieldOffice: 'Headquarters',
    targetLocations: ['Office Floor 1', 'Office Floor 2', 'Server Room B2'],
    plannedStartDate: '2026-02-25T08:00:00',
    plannedEndDate: '2026-02-28T17:00:00',
    actualStartDate: '2026-02-25T08:30:00',
    title: 'Annual Full Physical Count - HQ IT Assets',
    description: 'Annual comprehensive physical verification of all IT assets at Headquarters. Required per audit policy.',
    scope: 'All IT assets at HQ — laptops, desktops, servers, networking, peripherals',
    assets: [
      { id: '1', assetId: 'LAP-001234', name: 'Dell Latitude 5520', serialNumber: 'DL5520-XR7891', type: 'Laptop', expectedLocation: 'Office Floor 1', actualLocation: 'Office Floor 1', expectedCondition: 'good', actualCondition: 'good', verified: true, acquisitionValue: 1450, nbv: 725 },
      { id: '2', assetId: 'DES-001235', name: 'HP EliteDesk 800', serialNumber: 'HP800-QW4523', type: 'Desktop', expectedLocation: 'Office A1-02', actualLocation: 'Office A1-02', expectedCondition: 'good', actualCondition: 'good', verified: true, acquisitionValue: 980, nbv: 490 },
      { id: '5', assetId: 'SRV-001238', name: 'HP ProLiant DL380', serialNumber: 'HP-DL380-XK231', type: 'Server', expectedLocation: 'Server Room B2', actualLocation: 'Server Room B2', expectedCondition: 'new', actualCondition: 'good', verified: true, discrepancy: 'condition-change', notes: 'Condition downgraded from new to good after 3 months use', acquisitionValue: 8500, nbv: 7650 },
      { id: '4', assetId: 'MON-001237', name: 'Dell U2722D Monitor', serialNumber: 'DL-MON-8891', type: 'Monitor', expectedLocation: 'Office A1-03', actualLocation: '', expectedCondition: 'good', actualCondition: '', verified: false, discrepancy: 'missing', notes: 'Monitor not found at expected location', acquisitionValue: 550, nbv: 275 },
    ],
    totalExpected: 45,
    totalVerified: 38,
    totalDiscrepancies: 3,
    accuracyRate: 84.4,
    assetsLocked: true,
    workflowType: 'hq',
    attachments: ['SRV-2026-0001_plan.pdf'],
    reportGenerated: false,
    createdBy: 'John Doe',
    createdDate: '2026-02-20T10:00:00',
    signatures: [
      { role: 'surveyor', name: 'John Doe', status: 'pending' },
      { role: 'team_lead', name: 'John Doe', status: 'pending' },
      { role: 'approver', name: 'IT Director', status: 'pending' },
    ],
    auditTrail: [
      { id: 'a1', action: 'Survey Created', user: 'John Doe', timestamp: '2026-02-20T10:00:00', details: 'Annual full count survey planned' },
      { id: 'a2', action: 'Survey Started', user: 'John Doe', timestamp: '2026-02-25T08:30:00', details: 'Physical verification commenced' },
      { id: 'a3', action: 'Progress Update', user: 'Jane Smith', timestamp: '2026-02-26T16:00:00', details: '38 of 45 assets verified (84.4%)' },
    ],
  },
  {
    id: '2',
    surveyId: 'SRV-2026-0002',
    surveyType: 'location-based',
    status: 'completed',
    surveyTeamLead: 'Emily Davis',
    surveyors: ['Emily Davis', 'Alice Brown'],
    fieldOffice: 'Headquarters',
    targetLocations: ['Warehouse B1', 'Warehouse B2'],
    plannedStartDate: '2026-02-18T09:00:00',
    plannedEndDate: '2026-02-19T17:00:00',
    actualStartDate: '2026-02-18T09:15:00',
    actualEndDate: '2026-02-19T15:00:00',
    title: 'Warehouse Inventory Verification',
    description: 'Location-based survey of warehouse areas to reconcile physical inventory with system records.',
    scope: 'All assets stored in Warehouse B1 and B2',
    assets: [
      { id: '6', assetId: 'FUR-001239', name: 'Herman Miller Aeron Chair', serialNumber: 'HM-ERG-5541', type: 'Furniture', expectedLocation: 'Warehouse B1', actualLocation: 'Warehouse B1', expectedCondition: 'good', actualCondition: 'good', verified: true },
      { id: '10', assetId: 'FUR-001243', name: 'Standing Desk Frame', serialNumber: 'SD-FRM-2241', type: 'Furniture', expectedLocation: 'Warehouse B2', actualLocation: 'Office Floor 1', expectedCondition: 'new', actualCondition: 'new', verified: true, discrepancy: 'location-mismatch', notes: 'Desk was moved to Office Floor 1 without system update' },
    ],
    totalExpected: 28,
    totalVerified: 28,
    totalDiscrepancies: 2,
    accuracyRate: 92.9,
    assetsLocked: false,
    workflowType: 'hq',
    attachments: ['SRV-2026-0002_report.pdf'],
    reportGenerated: true,
    createdBy: 'Emily Davis',
    createdDate: '2026-02-15T10:00:00',
    approvedBy: 'Facilities Manager',
    approvedDate: '2026-02-20T10:00:00',
    signatures: [
      { role: 'surveyor', name: 'Emily Davis', status: 'signed', signedDate: '2026-02-19T15:00:00', method: 'digital' },
      { role: 'team_lead', name: 'Emily Davis', status: 'signed', signedDate: '2026-02-19T15:05:00', method: 'digital' },
      { role: 'approver', name: 'Facilities Manager', status: 'signed', signedDate: '2026-02-20T10:00:00', method: 'digital' },
    ],
    auditTrail: [
      { id: 'b1', action: 'Survey Created', user: 'Emily Davis', timestamp: '2026-02-15T10:00:00' },
      { id: 'b2', action: 'Survey Started', user: 'Emily Davis', timestamp: '2026-02-18T09:15:00' },
      { id: 'b3', action: 'Survey Completed', user: 'Emily Davis', timestamp: '2026-02-19T15:00:00', details: '28/28 verified, 2 discrepancies found' },
      { id: 'b4', action: 'Reconciliation Done', user: 'Emily Davis', timestamp: '2026-02-19T16:00:00', details: 'Location records updated for standing desk' },
      { id: 'b5', action: 'Approved', user: 'Facilities Manager', timestamp: '2026-02-20T10:00:00' },
    ],
  },
  {
    id: '3',
    surveyId: 'SRV-2026-0003',
    surveyType: 'high-value',
    status: 'reconciliation',
    surveyTeamLead: 'Mike Torres',
    surveyors: ['Mike Torres', 'Sarah Chen'],
    fieldOffice: 'Headquarters',
    targetLocations: ['Server Room B2', 'Office Floor 1'],
    plannedStartDate: '2026-02-24T08:00:00',
    plannedEndDate: '2026-02-25T17:00:00',
    actualStartDate: '2026-02-24T08:00:00',
    actualEndDate: '2026-02-25T12:00:00',
    title: 'High-Value Asset Verification (>$5,000)',
    description: 'Targeted verification of all assets with acquisition value exceeding $5,000.',
    scope: 'Assets with value > $5,000 across HQ',
    assets: [
      { id: '5', assetId: 'SRV-001238', name: 'HP ProLiant DL380', serialNumber: 'HP-DL380-XK231', type: 'Server', expectedLocation: 'Server Room B2', actualLocation: 'Server Room B2', expectedCondition: 'new', actualCondition: 'good', verified: true },
      { id: '11', assetId: 'SRV-001244', name: 'Dell PowerEdge R740', serialNumber: 'PE-R740-ZZ001', type: 'Server', expectedLocation: 'Server Room B2', actualLocation: '', expectedCondition: 'good', actualCondition: '', verified: false, discrepancy: 'missing', notes: 'Server rack position empty. Last scan 45 days ago.' },
    ],
    totalExpected: 12,
    totalVerified: 11,
    totalDiscrepancies: 1,
    accuracyRate: 91.7,
    linkedDisposalId: 'DSP-2026-0001',
    assetsLocked: true,
    workflowType: 'hq',
    attachments: ['SRV-2026-0003_report.pdf'],
    reportGenerated: true,
    createdBy: 'Mike Torres',
    createdDate: '2026-02-23T14:00:00',
    signatures: [
      { role: 'surveyor', name: 'Mike Torres', status: 'signed', signedDate: '2026-02-25T12:00:00', method: 'digital' },
      { role: 'team_lead', name: 'Mike Torres', status: 'signed', signedDate: '2026-02-25T12:05:00', method: 'digital' },
      { role: 'approver', name: 'IT Director', status: 'pending' },
    ],
    auditTrail: [
      { id: 'c1', action: 'Survey Created', user: 'Mike Torres', timestamp: '2026-02-23T14:00:00', details: 'High-value asset survey initiated' },
      { id: 'c2', action: 'Survey Started', user: 'Mike Torres', timestamp: '2026-02-24T08:00:00' },
      { id: 'c3', action: 'Survey Completed', user: 'Mike Torres', timestamp: '2026-02-25T12:00:00', details: '1 missing server identified' },
      { id: 'c4', action: 'Reconciliation Started', user: 'Mike Torres', timestamp: '2026-02-25T13:00:00', details: 'Investigating missing Dell PowerEdge R740' },
    ],
  },
  {
    id: '4',
    surveyId: 'SRV-2026-0004',
    surveyType: 'custodian-based',
    status: 'pending-approval',
    surveyTeamLead: 'Lisa Park',
    surveyors: ['Lisa Park'],
    fieldOffice: 'Regional Office East',
    targetLocations: ['Office Floor 2'],
    plannedStartDate: '2026-02-22T10:00:00',
    plannedEndDate: '2026-02-22T16:00:00',
    actualStartDate: '2026-02-22T10:00:00',
    actualEndDate: '2026-02-22T14:30:00',
    title: 'Custodian Handover Verification - Lisa Park',
    description: 'Verification of all assets under Lisa Park\'s custody as part of role transition.',
    scope: 'All assets assigned to custodian Lisa Park',
    assets: [
      { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', expectedLocation: 'Office Floor 2', actualLocation: 'Office Floor 2', expectedCondition: 'fair', actualCondition: 'fair', verified: true },
    ],
    totalExpected: 8,
    totalVerified: 8,
    totalDiscrepancies: 0,
    accuracyRate: 100,
    assetsLocked: false,
    workflowType: 'field',
    attachments: ['SRV-2026-0004_report.pdf'],
    reportGenerated: true,
    createdBy: 'Lisa Park',
    createdDate: '2026-02-21T10:00:00',
    signatures: [
      { role: 'surveyor', name: 'Lisa Park', status: 'signed', signedDate: '2026-02-22T14:30:00', method: 'digital' },
      { role: 'team_lead', name: 'Lisa Park', status: 'signed', signedDate: '2026-02-22T14:35:00', method: 'digital' },
      { role: 'approver', name: 'HR Manager', status: 'pending' },
    ],
    auditTrail: [
      { id: 'd1', action: 'Survey Created', user: 'Lisa Park', timestamp: '2026-02-21T10:00:00' },
      { id: 'd2', action: 'Survey Completed', user: 'Lisa Park', timestamp: '2026-02-22T14:30:00', details: 'All 8 assets verified, no discrepancies' },
      { id: 'd3', action: 'Submitted for Approval', user: 'Lisa Park', timestamp: '2026-02-22T14:35:00' },
    ],
  },
  {
    id: '5',
    surveyId: 'SRV-2026-0005',
    surveyType: 'sample-based',
    status: 'planned',
    surveyTeamLead: 'David Lee',
    surveyors: ['David Lee', 'Bob Wilson'],
    fieldOffice: 'Headquarters',
    targetLocations: ['Office Floor 1', 'Office A1-01', 'Office A1-02'],
    plannedStartDate: '2026-03-05T09:00:00',
    plannedEndDate: '2026-03-06T17:00:00',
    title: 'Q1 Sample-Based Spot Verification',
    description: 'Random 20% sample verification of assets on Office Floor 1 area.',
    scope: '20% random sample of assets in Office Floor 1 wing',
    assets: [],
    totalExpected: 15,
    totalVerified: 0,
    totalDiscrepancies: 0,
    accuracyRate: 0,
    assetsLocked: false,
    workflowType: 'hq',
    attachments: [],
    reportGenerated: false,
    createdBy: 'David Lee',
    createdDate: '2026-02-27T09:00:00',
    signatures: [
      { role: 'surveyor', name: 'David Lee', status: 'pending' },
      { role: 'team_lead', name: 'David Lee', status: 'pending' },
      { role: 'approver', name: 'Operations Manager', status: 'pending' },
    ],
    auditTrail: [
      { id: 'e1', action: 'Survey Planned', user: 'David Lee', timestamp: '2026-02-27T09:00:00', details: 'Scheduled for March 5-6' },
    ],
  },
  {
    id: '6',
    surveyId: 'SRV-2026-0006',
    surveyType: 'full-count',
    status: 'draft',
    surveyTeamLead: 'Alice Brown',
    surveyors: ['Alice Brown'],
    fieldOffice: 'Field Office North',
    targetLocations: ['Main Building'],
    plannedStartDate: '2026-03-15T08:00:00',
    plannedEndDate: '2026-03-20T17:00:00',
    title: 'Annual Survey - Field Office North',
    description: 'Annual full physical count at Field Office North.',
    scope: 'All assets at Field Office North',
    assets: [],
    totalExpected: 65,
    totalVerified: 0,
    totalDiscrepancies: 0,
    accuracyRate: 0,
    assetsLocked: false,
    workflowType: 'local',
    attachments: [],
    reportGenerated: false,
    createdBy: 'Alice Brown',
    createdDate: '2026-02-27T11:00:00',
    signatures: [
      { role: 'surveyor', name: 'Alice Brown', status: 'pending' },
      { role: 'team_lead', name: 'Alice Brown', status: 'pending' },
      { role: 'approver', name: 'Field Office Manager', status: 'pending' },
    ],
    auditTrail: [
      { id: 'f1', action: 'Draft Created', user: 'Alice Brown', timestamp: '2026-02-27T11:00:00' },
    ],
  },
];