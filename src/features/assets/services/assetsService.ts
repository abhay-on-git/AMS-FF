import { apiClient } from '@/services/apiClient'
import { IS_MOCK } from '@/services/mockMode'
import type { EnhancedAsset } from '../types'
import type { DraftAsset, RegistrationForm } from '../types/draftTypes'
import type { TransferRequest } from '../types/transferTypes'
import type { InspectionRequest } from '../types/inspectionTypes'
import type { SurveyRequest } from '../types/surveyTypes'
import type { DisposalRequest } from '../types/disposalTypes'
const mockAssets: EnhancedAsset[] = [
  {
    id: '1', assetId: 'LAP-001234', epc: 'E2801160600002040000001234', barcode: '123456789012',
    serialNumber: 'DL5520-XR7891', type: 'Laptop', category: 'IT Equipment', name: 'Dell Latitude 5520',
    description: 'High-performance business laptop with Intel Core i7, 16GB RAM, 512GB SSD.',
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
    transferCount: 0, surveyStatus: 'not-surveyed',
  },
  {
    id: '2', assetId: 'DES-001235', epc: 'E2801160600002040000001235', barcode: '123456789013',
    serialNumber: 'HP800-QW4523', type: 'Desktop', category: 'IT Equipment', name: 'HP EliteDesk 800',
    description: 'Compact desktop workstation for office use.',
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
    transferCount: 0, surveyStatus: 'not-surveyed',
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
    transferCount: 0, surveyStatus: 'not-surveyed',
  },
  {
    id: '4', assetId: 'MON-001237', epc: 'E2801160600002040000001237', barcode: '123456789015',
    serialNumber: 'DL-U27-99312', type: 'Monitor', category: 'IT Equipment', name: 'Dell U2720Q 27"',
    location: 'Office A1-03', fieldOffice: 'Regional Office West', status: 'missing', publishedDate: '2024-01-10',
    responsiblePerson: 'Sarah Chen', owner: 'Organization', condition: 'good',
    createdDate: '2024-01-10', lastUpdated: '2024-12-25', lastStatusChange: '2024-12-20',
    lastLocationUpdate: '2024-01-10', lastCustodianChange: '2024-01-10',
    rfidHealth: 65, lastScanned: '2024-12-15 16:45:00', poNumber: 'PO-2024-0010',
    grnNumber: 'GRN-2024-0006', acquisitionDate: '2024-01-05', acquisitionValue: 620.00,
    currency: 'USD', nbv: 527.00,
    isLocked: true, lockReason: 'Active survey case in progress', activeSurveyCaseId: 'SUR-2026-0042',
    lifecycleStage: 'pending-disposal', expectedUsefulLife: 36, warrantyExpiry: '2025-01-10',
    depreciationMethod: 'straight-line', annualDepreciationRate: 2.78, residualValue: 150.00,
    nextMaintenanceDate: '2024-06-15', lastMaintenanceDate: '2024-01-15', maintenanceCount: 1,
    transferCount: 0, surveyStatus: 'recommended-disposal', disposalMethod: 'recycling',
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
    transferCount: 0, surveyStatus: 'not-surveyed',
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
    transferCount: 0, surveyStatus: 'not-surveyed',
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
    transferCount: 0, surveyStatus: 'not-surveyed',
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
  },
]

export async function getAssets(): Promise<EnhancedAsset[]> {
  if (IS_MOCK) return Promise.resolve(mockAssets)
  const { data } = await apiClient.get<EnhancedAsset[]>('/assets')
  return data
}

// GET /assets/:id
export async function getAssetById(id: string): Promise<EnhancedAsset> {
  if (IS_MOCK) {
    const asset = mockAssets.find((a) => a.id === id)
    if (!asset) throw new Error(`Asset ${id} not found`)
    return { ...asset }
  }
  const { data } = await apiClient.get<EnhancedAsset>(`/assets/${id}`)
  return data
}

// POST /assets
export async function createAsset(
  payload: Omit<EnhancedAsset, 'id'>,
): Promise<EnhancedAsset> {
  if (IS_MOCK) {
    const created = { ...payload, id: `a-${Date.now()}` }
    mockAssets.push(created)
    return created
  }
  const { data } = await apiClient.post<EnhancedAsset>('/assets', payload)
  return data
}

// PATCH /assets/:id
export async function updateAsset(
  id: string,
  payload: Partial<EnhancedAsset>,
): Promise<EnhancedAsset> {
  if (IS_MOCK) {
    const idx = mockAssets.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error(`Asset ${id} not found`)
    mockAssets[idx] = { ...mockAssets[idx], ...payload }
    return { ...mockAssets[idx] }
  }
  const { data } = await apiClient.patch<EnhancedAsset>(`/assets/${id}`, payload)
  return data
}

// DELETE /assets/:id
export async function deleteAsset(id: string): Promise<void> {
  if (IS_MOCK) {
    const idx = mockAssets.findIndex((a) => a.id === id)
    if (idx !== -1) mockAssets.splice(idx, 1)
    return
  }
  await apiClient.delete(`/assets/${id}`)
}

// TODO: Replace with apiClient.get('/assets/drafts') — SAP GRN sync feed
const mockDrafts: DraftAsset[] = [
  {
    id: '1', draftId: 'DRF-2026-0001', poNumber: 'PO-4500012345', grnNumber: 'GRN-5000001001',
    itemDescription: 'Dell Latitude 5540 Laptop', supplier: 'Dell Technologies',
    quantity: 1, unitPrice: 1450.00, totalCost: 1450.00, acquisitionDate: '2026-02-20',
    currency: 'USD', classification: 'Capital', classificationOverridden: false,
    assignmentStatus: 'Unassigned', sapSyncTimestamp: '2026-02-20T08:30:00Z',
    auditTrail: [{ id: 'a1', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-20T08:30:00Z', details: 'GRN-5000001001 posted in SAP ECC 6.0' }],
  },
  {
    id: '2', draftId: 'DRF-2026-0002', poNumber: 'PO-4500012345', grnNumber: 'GRN-5000001001',
    itemDescription: 'Dell U2723QE 27" Monitor', supplier: 'Dell Technologies',
    quantity: 2, unitPrice: 620.00, totalCost: 1240.00, acquisitionDate: '2026-02-20',
    currency: 'USD', classification: 'Attractive', classificationOverridden: false,
    assignmentStatus: 'Unassigned', sapSyncTimestamp: '2026-02-20T08:30:00Z',
    auditTrail: [{ id: 'a2', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-20T08:30:00Z', details: 'GRN-5000001001 posted in SAP ECC 6.0' }],
  },
  {
    id: '3', draftId: 'DRF-2026-0003', poNumber: 'PO-4500012350', grnNumber: 'GRN-5000001005',
    itemDescription: 'Canon imageRUNNER ADVANCE C5560i', supplier: 'Canon Inc.',
    quantity: 1, unitPrice: 8500.00, totalCost: 8500.00, acquisitionDate: '2026-02-18',
    currency: 'USD', classification: 'Capital', classificationOverridden: false,
    assignmentStatus: 'Assigned', assignedTo: 'Field Office Hanoi', sapSyncTimestamp: '2026-02-18T14:15:00Z',
    auditTrail: [
      { id: 'a3', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-18T14:15:00Z', details: 'GRN-5000001005 posted in SAP ECC 6.0' },
      { id: 'a4', action: 'Assignment updated', user: 'Admin', timestamp: '2026-02-19T09:00:00Z', details: 'Assigned to Field Office Hanoi' },
    ],
  },
  {
    id: '4', draftId: 'DRF-2026-0004', poNumber: 'PO-4500012355', grnNumber: 'GRN-5000001008',
    itemDescription: 'Lenovo ThinkPad X1 Carbon Gen 11', supplier: 'Lenovo Group Ltd',
    quantity: 5, unitPrice: 1780.00, totalCost: 8900.00, acquisitionDate: '2026-02-15',
    currency: 'USD', classification: 'Capital', classificationOverridden: false,
    assignmentStatus: 'Unassigned', sapSyncTimestamp: '2026-02-15T11:20:00Z',
    auditTrail: [{ id: 'a5', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-15T11:20:00Z', details: 'GRN-5000001008 posted in SAP ECC 6.0' }],
  },
  {
    id: '5', draftId: 'DRF-2026-0005', poNumber: 'PO-4500012360', grnNumber: 'GRN-5000001010',
    itemDescription: 'HP LaserJet Enterprise M507dn', supplier: 'HP Inc.',
    quantity: 3, unitPrice: 450.00, totalCost: 1350.00, acquisitionDate: '2026-02-14',
    currency: 'USD', classification: 'Attractive', classificationOverridden: false,
    assignmentStatus: 'Assigned', assignedTo: 'Field Office HCMC', sapSyncTimestamp: '2026-02-14T09:45:00Z',
    auditTrail: [
      { id: 'a6', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-14T09:45:00Z', details: 'GRN-5000001010 posted in SAP ECC 6.0' },
      { id: 'a7', action: 'Assignment updated', user: 'Admin', timestamp: '2026-02-14T15:30:00Z', details: 'Assigned to Field Office HCMC' },
    ],
  },
  {
    id: '6', draftId: 'DRF-2026-0006', poNumber: 'PO-4500012365', grnNumber: 'GRN-5000001012',
    itemDescription: 'Cisco Catalyst 9200L Switch', supplier: 'Cisco Systems',
    quantity: 2, unitPrice: 3200.00, totalCost: 6400.00, acquisitionDate: '2026-02-12',
    currency: 'USD', classification: 'Capital', classificationOverridden: false,
    assignmentStatus: 'Unassigned', sapSyncTimestamp: '2026-02-12T07:00:00Z',
    auditTrail: [{ id: 'a8', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-12T07:00:00Z', details: 'GRN-5000001012 posted in SAP ECC 6.0' }],
  },
  {
    id: '7', draftId: 'DRF-2026-0007', poNumber: 'PO-4500012370', grnNumber: 'GRN-5000001015',
    itemDescription: 'Samsung Galaxy Tab S9 FE', supplier: 'Samsung Electronics',
    quantity: 10, unitPrice: 380.00, totalCost: 3800.00, acquisitionDate: '2026-02-10',
    currency: 'USD', classification: 'Attractive', classificationOverridden: false,
    assignmentStatus: 'Unassigned', sapSyncTimestamp: '2026-02-10T10:30:00Z',
    auditTrail: [{ id: 'a9', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-10T10:30:00Z', details: 'GRN-5000001015 posted in SAP ECC 6.0' }],
  },
  {
    id: '8', draftId: 'DRF-2026-0008', poNumber: 'PO-4500012375', grnNumber: 'GRN-5000001018',
    itemDescription: 'Epson WorkForce Pro WF-C5890', supplier: 'Epson America',
    quantity: 1, unitPrice: 550.00, totalCost: 550.00, acquisitionDate: '2026-02-08',
    currency: 'USD', classification: 'Attractive', classificationOverridden: false,
    assignmentStatus: 'Assigned', assignedTo: 'Field Office Da Nang', sapSyncTimestamp: '2026-02-08T13:00:00Z',
    auditTrail: [
      { id: 'a10', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-08T13:00:00Z', details: 'GRN-5000001018 posted in SAP ECC 6.0' },
      { id: 'a11', action: 'Assignment updated', user: 'Admin', timestamp: '2026-02-09T08:00:00Z', details: 'Assigned to Field Office Da Nang' },
    ],
  },
  {
    id: '9', draftId: 'DRF-2026-0009', poNumber: 'PO-4500012380', grnNumber: 'GRN-5000001020',
    itemDescription: 'Microsoft Surface Pro 10', supplier: 'Microsoft Corporation',
    quantity: 4, unitPrice: 1599.00, totalCost: 6396.00, acquisitionDate: '2026-02-05',
    currency: 'USD', classification: 'Capital', classificationOverridden: false,
    assignmentStatus: 'Unassigned', sapSyncTimestamp: '2026-02-05T16:45:00Z',
    auditTrail: [{ id: 'a12', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-05T16:45:00Z', details: 'GRN-5000001020 posted in SAP ECC 6.0' }],
  },
  {
    id: '10', draftId: 'DRF-2026-0010', poNumber: 'PO-4500012385', grnNumber: 'GRN-5000001022',
    itemDescription: 'APC Smart-UPS 3000VA', supplier: 'Schneider Electric',
    quantity: 2, unitPrice: 2100.00, totalCost: 4200.00, acquisitionDate: '2026-02-03',
    currency: 'USD', classification: 'Capital', classificationOverridden: false,
    assignmentStatus: 'Unassigned', sapSyncTimestamp: '2026-02-03T12:00:00Z',
    auditTrail: [{ id: 'a13', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-03T12:00:00Z', details: 'GRN-5000001022 posted in SAP ECC 6.0' }],
  },
  {
    id: '11', draftId: 'DRF-2026-0011', poNumber: 'PO-4500012390', grnNumber: 'GRN-5000001025',
    itemDescription: 'Logitech MX Keys Combo', supplier: 'Logitech',
    quantity: 15, unitPrice: 199.00, totalCost: 2985.00, acquisitionDate: '2026-02-01',
    currency: 'USD', classification: 'Attractive', classificationOverridden: false,
    assignmentStatus: 'Unassigned', sapSyncTimestamp: '2026-02-01T09:30:00Z',
    auditTrail: [{ id: 'a14', action: 'Draft created via SAP GRN sync', user: 'System', timestamp: '2026-02-01T09:30:00Z', details: 'GRN-5000001025 posted in SAP ECC 6.0' }],
  },
]

export async function getDrafts(): Promise<DraftAsset[]> {
  if (IS_MOCK) return Promise.resolve(mockDrafts)
  const { data } = await apiClient.get<DraftAsset[]>('/assets/drafts')
  return data
}

export async function registerAssetFromDraft(
  draftId: string,
  data: RegistrationForm,
): Promise<void> {
  if (IS_MOCK) {
    await new Promise<void>((resolve) => setTimeout(resolve, 1000))
    return
  }
  await apiClient.post(`/assets/drafts/${draftId}/register`, data)
}

// ── Transfers ─────────────────────────────────────────────────────────────────

const mockTransfers: TransferRequest[] = [
  {
    id: '1', transferId: 'TRF-2026-0001', transferType: 'inter-field', status: 'pending-custodian',
    fromCustodian: 'John Doe', fromLocation: 'Office Floor 1', fromBuilding: 'Main Building',
    fromRoom: 'Office Floor 1', fromFieldOffice: 'Headquarters',
    toCustodian: 'Sarah Chen', toLocation: 'Office A1-03', toBuilding: 'Field Station Alpha',
    toRoom: 'Office A1-03', toFieldOffice: 'Regional Office West',
    reason: 'Staff relocation — IT equipment needed at regional office for new project deployment',
    notes: 'Includes high-value server equipment. Requires management approval per inter-field policy.',
    assets: [
      { id: '1', assetId: 'LAP-001234', name: 'Dell Latitude 5520', serialNumber: 'DL5520-XR7891', type: 'Laptop', currentLocation: 'Office Floor 1', condition: 'good', acquisitionValue: 1450 },
      { id: '5', assetId: 'SRV-001238', name: 'HP ProLiant DL380', serialNumber: 'HP-DL380-XK231', type: 'Server', currentLocation: 'Server Room B2', condition: 'new', acquisitionValue: 8500 },
    ],
    initiatedBy: 'John Doe', initiatedDate: '2026-02-25T10:30:00',
    signatures: [
      { role: 'initiating_officer', name: 'John Doe', status: 'signed', signedDate: '2026-02-25T10:30:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'Sarah Chen', status: 'pending' },
      { role: 'approving_officer', name: 'Regional Director', status: 'pending' },
    ],
    formGenerated: true, formUploaded: false, attachments: ['TRF-2026-0001_form.pdf'],
    notificationsSent: true, acknowledgmentRequired: true, acknowledged: false,
    auditTrail: [
      { id: 'a1', action: 'Transfer Initiated', user: 'John Doe', timestamp: '2026-02-25T10:30:00', details: 'Inter-field transfer request created with 2 assets' },
      { id: 'a2', action: 'Initiator Signed', user: 'John Doe', timestamp: '2026-02-25T10:30:00', details: 'Digital signature applied by initiating officer' },
    ],
  },
  {
    id: '2', transferId: 'TRF-2026-0002', transferType: 'intra-field', status: 'approved',
    fromCustodian: 'Bob Wilson', fromLocation: 'Warehouse B1', fromBuilding: 'Warehouse Complex',
    fromRoom: 'Warehouse B1', fromFieldOffice: 'Headquarters',
    toCustodian: 'Emily Davis', toLocation: 'Office A1-05', toBuilding: 'Main Building',
    toRoom: 'Office A1-05', toFieldOffice: 'Headquarters',
    reason: 'New office setup — furniture and equipment deployment for newly onboarded staff',
    notes: 'Standard intra-field transfer within HQ campus.',
    assets: [
      { id: '6', assetId: 'FUR-001239', name: 'Herman Miller Aeron Chair', serialNumber: 'HM-ERG-5541', type: 'Furniture', currentLocation: 'Warehouse B1', condition: 'good', acquisitionValue: 1350 },
    ],
    initiatedBy: 'Bob Wilson', initiatedDate: '2026-02-24T09:15:00',
    approvedBy: 'Admin Manager', approvedDate: '2026-02-24T14:00:00',
    signatures: [
      { role: 'initiating_officer', name: 'Bob Wilson', status: 'signed', signedDate: '2026-02-24T09:15:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'Emily Davis', status: 'signed', signedDate: '2026-02-24T16:00:00', method: 'digital' },
      { role: 'approving_officer', name: 'Admin Manager', status: 'signed', signedDate: '2026-02-24T14:00:00', method: 'digital' },
    ],
    formGenerated: true, formUploaded: true, attachments: ['TRF-2026-0002_form.pdf'],
    notificationsSent: true, acknowledgmentRequired: true, acknowledged: true,
    auditTrail: [
      { id: 'b1', action: 'Transfer Initiated', user: 'Bob Wilson', timestamp: '2026-02-24T09:15:00', details: 'Intra-field transfer request created' },
      { id: 'b2', action: 'Transfer Approved', user: 'Admin Manager', timestamp: '2026-02-24T14:00:00', details: 'Approved for intra-field transfer' },
    ],
  },
  {
    id: '3', transferId: 'TRF-2026-0003', transferType: 'intra-field', status: 'completed',
    fromCustodian: 'Jane Smith', fromLocation: 'Office A1-02', fromBuilding: 'Main Building',
    fromRoom: 'Office A1-02', fromFieldOffice: 'Headquarters',
    toCustodian: 'Mike Torres', toLocation: 'Server Room B2', toBuilding: 'Main Building',
    toRoom: 'Server Room B2', toFieldOffice: 'Headquarters',
    reason: 'Equipment consolidation — moving desktop to server room for re-imaging',
    notes: '',
    assets: [
      { id: '2', assetId: 'DES-001235', name: 'HP EliteDesk 800', serialNumber: 'HP800-QW4523', type: 'Desktop', currentLocation: 'Office A1-02', condition: 'good', acquisitionValue: 980 },
    ],
    initiatedBy: 'Jane Smith', initiatedDate: '2026-02-20T11:00:00',
    approvedBy: 'IT Manager', approvedDate: '2026-02-20T11:30:00',
    receivedBy: 'Mike Torres', receivedDate: '2026-02-21T09:00:00', completedDate: '2026-02-21T09:00:00',
    signatures: [
      { role: 'initiating_officer', name: 'Jane Smith', status: 'signed', signedDate: '2026-02-20T11:00:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'Mike Torres', status: 'signed', signedDate: '2026-02-21T09:00:00', method: 'manual' },
      { role: 'approving_officer', name: 'IT Manager', status: 'signed', signedDate: '2026-02-20T11:30:00', method: 'digital' },
    ],
    formGenerated: true, formUploaded: true, attachments: ['TRF-2026-0003_form.pdf'],
    notificationsSent: true, acknowledgmentRequired: false, acknowledged: false,
    auditTrail: [
      { id: 'c1', action: 'Transfer Initiated', user: 'Jane Smith', timestamp: '2026-02-20T11:00:00', details: 'Intra-field transfer within same location' },
      { id: 'c2', action: 'Transfer Completed', user: 'System', timestamp: '2026-02-21T09:00:00', details: 'All signatures collected. Asset records updated.' },
    ],
  },
  {
    id: '4', transferId: 'TRF-2026-0004', transferType: 'inter-field', status: 'in-transit',
    fromCustodian: 'Mike Torres', fromLocation: 'Server Room B2', fromBuilding: 'Main Building',
    fromRoom: 'Server Room B2', fromFieldOffice: 'Headquarters',
    toCustodian: 'David Lee', toLocation: 'Office Floor 2', toBuilding: 'Field Station Beta',
    toRoom: 'Office Floor 2', toFieldOffice: 'Regional Office East',
    reason: 'Network infrastructure upgrade at regional office',
    notes: 'Networking equipment for regional LAN upgrade. Fragile — special handling required.',
    assets: [
      { id: '7', assetId: 'NET-001240', name: 'Cisco Catalyst 9300', serialNumber: 'CS-9300-XA871', type: 'Networking', currentLocation: 'Server Room B2', condition: 'good', acquisitionValue: 4200 },
    ],
    initiatedBy: 'Mike Torres', initiatedDate: '2026-02-23T08:00:00',
    approvedBy: 'IT Director', approvedDate: '2026-02-23T10:00:00',
    signatures: [
      { role: 'initiating_officer', name: 'Mike Torres', status: 'signed', signedDate: '2026-02-23T08:00:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'David Lee', status: 'pending' },
      { role: 'approving_officer', name: 'IT Director', status: 'signed', signedDate: '2026-02-23T10:00:00', method: 'digital' },
    ],
    formGenerated: true, formUploaded: false, attachments: ['TRF-2026-0004_form.pdf'],
    notificationsSent: true, acknowledgmentRequired: true, acknowledged: false,
    auditTrail: [
      { id: 'd1', action: 'Transfer Initiated', user: 'Mike Torres', timestamp: '2026-02-23T08:00:00', details: 'Inter-field transfer to Regional Office East' },
      { id: 'd2', action: 'Transfer Approved', user: 'IT Director', timestamp: '2026-02-23T10:00:00', details: 'Approved — high-value network equipment' },
      { id: 'd3', action: 'Assets Shipped', user: 'Logistics Team', timestamp: '2026-02-24T07:00:00', details: 'Shipment dispatched via secured logistics' },
    ],
  },
  {
    id: '5', transferId: 'TRF-2026-0005', transferType: 'intra-field', status: 'pending-acknowledgment',
    fromCustodian: 'Emily Davis', fromLocation: 'Office A1-05', fromBuilding: 'Main Building',
    fromRoom: 'Office A1-05', fromFieldOffice: 'Headquarters',
    toCustodian: 'Alice Brown', toLocation: 'Office A1-04', toBuilding: 'Main Building',
    toRoom: 'Office A1-04', toFieldOffice: 'Headquarters',
    reason: 'Furniture reallocation as part of Q1 workspace optimization',
    notes: 'Chair reassigned per HR request. Awaiting acknowledgment from new custodian.',
    assets: [
      { id: '6', assetId: 'FUR-001239', name: 'Herman Miller Aeron Chair', serialNumber: 'HM-ERG-5541', type: 'Furniture', currentLocation: 'Office A1-05', condition: 'good', acquisitionValue: 1350 },
    ],
    initiatedBy: 'Emily Davis', initiatedDate: '2026-02-26T14:00:00',
    approvedBy: 'Facilities Manager', approvedDate: '2026-02-26T15:30:00',
    signatures: [
      { role: 'initiating_officer', name: 'Emily Davis', status: 'signed', signedDate: '2026-02-26T14:00:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'Alice Brown', status: 'pending' },
      { role: 'approving_officer', name: 'Facilities Manager', status: 'signed', signedDate: '2026-02-26T15:30:00', method: 'digital' },
    ],
    formGenerated: true, formUploaded: false, attachments: ['TRF-2026-0005_form.pdf'],
    notificationsSent: true, acknowledgmentRequired: true, acknowledged: false,
    auditTrail: [
      { id: 'e1', action: 'Transfer Initiated', user: 'Emily Davis', timestamp: '2026-02-26T14:00:00', details: 'Intra-field furniture transfer' },
      { id: 'e2', action: 'Asset Delivered', user: 'Facilities Team', timestamp: '2026-02-27T09:00:00', details: 'Asset physically delivered to Office A1-04' },
    ],
  },
  {
    id: '6', transferId: 'TRF-2026-0006', transferType: 'inter-field', status: 'rejected',
    fromCustodian: 'Lisa Park', fromLocation: 'Office Floor 2', fromBuilding: 'Field Station Beta',
    fromRoom: 'Office Floor 2', fromFieldOffice: 'Regional Office East',
    toCustodian: 'John Doe', toLocation: 'Office Floor 1', toBuilding: 'Main Building',
    toRoom: 'Office Floor 1', toFieldOffice: 'Headquarters',
    reason: 'Return of underperforming laptop to HQ IT for evaluation',
    notes: 'Laptop has intermittent issues. IT team to assess.',
    assets: [
      { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', currentLocation: 'Office Floor 2', condition: 'fair', acquisitionValue: 1200 },
    ],
    initiatedBy: 'Lisa Park', initiatedDate: '2026-02-22T13:00:00',
    rejectedBy: 'Regional Director', rejectedDate: '2026-02-22T16:00:00',
    rejectionReason: 'Asset should be sent for local repair first. Transfer not justified at this time.',
    signatures: [
      { role: 'initiating_officer', name: 'Lisa Park', status: 'signed', signedDate: '2026-02-22T13:00:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'John Doe', status: 'pending' },
      { role: 'approving_officer', name: 'Regional Director', status: 'declined' },
    ],
    formGenerated: true, formUploaded: false, attachments: ['TRF-2026-0006_form.pdf'],
    notificationsSent: true, acknowledgmentRequired: false, acknowledged: false,
    auditTrail: [
      { id: 'f1', action: 'Transfer Initiated', user: 'Lisa Park', timestamp: '2026-02-22T13:00:00', details: 'Inter-field laptop return request' },
      { id: 'f2', action: 'Transfer Rejected', user: 'Regional Director', timestamp: '2026-02-22T16:00:00', details: 'Reason: Asset should be sent for local repair first.' },
    ],
  },
  {
    id: '7', transferId: 'TRF-2026-0007', transferType: 'intra-field', status: 'pending-approval',
    fromCustodian: 'Mike Torres', fromLocation: 'Server Room B2', fromBuilding: 'Main Building',
    fromRoom: 'Server Room B2', fromFieldOffice: 'Headquarters',
    toCustodian: 'Lisa Park', toLocation: 'Office Floor 2', toBuilding: 'Field Station Beta',
    toRoom: 'Office Floor 2', toFieldOffice: 'Regional Office East',
    reason: 'Laptop provisioning for new HR staff at regional office',
    notes: 'Both initiator and receiving custodian have signed. Awaiting approver decision.',
    assets: [
      { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', currentLocation: 'Office Floor 2', condition: 'fair', acquisitionValue: 1200 },
    ],
    initiatedBy: 'Mike Torres', initiatedDate: '2026-02-24T14:00:00',
    signatures: [
      { role: 'initiating_officer', name: 'Mike Torres', status: 'signed', signedDate: '2026-02-24T14:00:00', method: 'digital' },
      { role: 'receiving_custodian', name: 'Lisa Park', status: 'signed', signedDate: '2026-02-25T09:00:00', method: 'digital' },
      { role: 'approving_officer', name: 'IT Director', status: 'pending' },
    ],
    formGenerated: true, formUploaded: false, attachments: ['TRF-2026-0007_form.pdf'],
    notificationsSent: true, acknowledgmentRequired: true, acknowledged: false,
    auditTrail: [
      { id: 'i1', action: 'Transfer Initiated', user: 'Mike Torres', timestamp: '2026-02-24T14:00:00', details: 'Inter-field transfer request created' },
      { id: 'i2', action: 'Custodian Signed', user: 'Lisa Park', timestamp: '2026-02-25T09:00:00', details: 'Receiving custodian confirmed and signed' },
    ],
  },
]

export async function getTransfers(): Promise<TransferRequest[]> {
  if (IS_MOCK) return Promise.resolve(mockTransfers)
  const { data } = await apiClient.get<TransferRequest[]>('/transfers')
  return data
}

export async function initiateTransfer(data: Record<string, unknown>): Promise<void> {
  if (IS_MOCK) {
    await new Promise<void>((resolve) => setTimeout(resolve, 1000))
    return
  }
  await apiClient.post('/transfers', data)
}

export async function approveTransfer(id: string): Promise<void> {
  if (IS_MOCK) {
    await new Promise<void>((resolve) => setTimeout(resolve, 800))
    const tr = mockTransfers.find((t) => t.id === id)
    if (tr) {
      tr.status = 'pending-acknowledgment'
      tr.approvedBy = 'Current User'
      tr.approvedDate = new Date().toISOString()
      tr.signatures = tr.signatures.map((s) =>
        s.role === 'approving_officer' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString() } : s
      )
      tr.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Transfer Approved', user: 'Current User', timestamp: new Date().toISOString() })
    }
    return
  }
  await apiClient.patch(`/transfers/${id}/approve`)
}

export async function rejectTransfer(id: string, reason: string): Promise<void> {
  if (IS_MOCK) {
    await new Promise<void>((resolve) => setTimeout(resolve, 800))
    const tr = mockTransfers.find((t) => t.id === id)
    if (tr) {
      tr.status = 'rejected'
      tr.rejectedBy = 'Current User'
      tr.rejectedDate = new Date().toISOString()
      tr.rejectionReason = reason
      tr.signatures = tr.signatures.map((s) =>
        s.role === 'approving_officer' ? { ...s, status: 'declined' as const } : s
      )
      tr.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Transfer Rejected', user: 'Current User', timestamp: new Date().toISOString(), details: `Reason: ${reason}` })
    }
    return
  }
  await apiClient.patch(`/transfers/${id}/reject`, { reason })
}

export async function acknowledgeTransfer(id: string): Promise<void> {
  if (IS_MOCK) {
    await new Promise<void>((resolve) => setTimeout(resolve, 800))
    const tr = mockTransfers.find((t) => t.id === id)
    if (tr) {
      tr.status = 'completed'
      tr.acknowledged = true
      tr.completedDate = new Date().toISOString()
      tr.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Transfer Acknowledged', user: 'Current User', timestamp: new Date().toISOString() })
    }
    return
  }
  await apiClient.patch(`/transfers/${id}/acknowledge`)
}

// ── Inspections ───────────────────────────────────────────────────────────────

const mockInspections: InspectionRequest[] = [
  {
    id: '1', inspectionId: 'INS-2026-0001', inspectionType: 'scheduled', status: 'in-progress', result: 'pending',
    inspector: 'John Doe', reviewer: 'IT Director', fieldOffice: 'Headquarters', location: 'Server Room B2',
    scheduledDate: '2026-02-27T09:00:00', startedDate: '2026-02-27T09:15:00', dueDate: '2026-02-28T17:00:00',
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
    overallFindings: '', recommendations: '', photosAttached: 3, createdBy: 'John Doe', createdDate: '2026-02-25T10:00:00',
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
    id: '2', inspectionId: 'INS-2026-0002', inspectionType: 'spot-check', status: 'completed', result: 'pass',
    inspector: 'Jane Smith', reviewer: 'Admin Manager', fieldOffice: 'Headquarters', location: 'Office Floor 1',
    scheduledDate: '2026-02-20T14:00:00', startedDate: '2026-02-20T14:10:00', completedDate: '2026-02-20T16:30:00', dueDate: '2026-02-20T17:00:00',
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
    photosAttached: 5, createdBy: 'Jane Smith', createdDate: '2026-02-20T13:00:00',
    signatures: [
      { role: 'inspector', name: 'Jane Smith', status: 'signed', signedDate: '2026-02-20T16:30:00', method: 'digital' },
      { role: 'reviewer', name: 'Admin Manager', status: 'signed', signedDate: '2026-02-21T09:00:00', method: 'digital' },
    ],
    auditTrail: [
      { id: 'b1', action: 'Inspection Created', user: 'Jane Smith', timestamp: '2026-02-20T13:00:00' },
      { id: 'b2', action: 'Inspection Started', user: 'Jane Smith', timestamp: '2026-02-20T14:10:00' },
      { id: 'b3', action: 'Inspection Completed', user: 'Jane Smith', timestamp: '2026-02-20T16:30:00', details: 'All assets passed' },
      { id: 'b4', action: 'Review Approved', user: 'Admin Manager', timestamp: '2026-02-21T09:00:00', details: 'Findings reviewed and accepted' },
    ],
  },
  {
    id: '3', inspectionId: 'INS-2026-0003', inspectionType: 'pre-transfer', status: 'pending-review', result: 'conditional-pass',
    inspector: 'Bob Wilson', reviewer: 'IT Director', fieldOffice: 'Headquarters', location: 'Warehouse B1',
    scheduledDate: '2026-02-26T10:00:00', startedDate: '2026-02-26T10:05:00', completedDate: '2026-02-26T12:00:00', dueDate: '2026-02-26T17:00:00',
    title: 'Pre-Transfer Inspection - Warehouse Equipment',
    description: 'Condition assessment before transferring warehouse equipment to Regional Office East.',
    assets: [
      { id: '6', assetId: 'FUR-001239', name: 'Herman Miller Aeron Chair', serialNumber: 'HM-ERG-5541', type: 'Furniture', currentLocation: 'Warehouse B1', condition: 'good', result: 'pass', findings: 'Good condition, minor cosmetic wear' },
      { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', currentLocation: 'Office Floor 2', condition: 'fair', result: 'conditional-pass', findings: 'Battery at 65% health. Recommend replacement before transfer.' },
    ],
    checklist: [
      { id: 'c1', label: 'Physical condition verified', checked: true },
      { id: 'c2', label: 'Serial numbers confirmed', checked: true },
      { id: 'c3', label: 'RFID tags scanned', checked: true },
      { id: 'c4', label: 'Functionality tested', checked: true },
      { id: 'c5', label: 'Accessories accounted for', checked: true },
    ],
    overallFindings: 'One asset requires battery replacement before transfer.',
    recommendations: 'Replace laptop battery (LAP-001241) before proceeding. Estimated cost: $85.',
    photosAttached: 8, createdBy: 'Bob Wilson', createdDate: '2026-02-26T09:00:00',
    signatures: [
      { role: 'inspector', name: 'Bob Wilson', status: 'signed', signedDate: '2026-02-26T12:00:00', method: 'digital' },
      { role: 'reviewer', name: 'IT Director', status: 'pending' },
    ],
    auditTrail: [
      { id: 'c1a', action: 'Inspection Created', user: 'Bob Wilson', timestamp: '2026-02-26T09:00:00' },
      { id: 'c2a', action: 'Inspection Started', user: 'Bob Wilson', timestamp: '2026-02-26T10:05:00' },
      { id: 'c3a', action: 'Inspection Completed', user: 'Bob Wilson', timestamp: '2026-02-26T12:00:00', details: 'Conditional pass — review needed' },
    ],
  },
  {
    id: '4', inspectionId: 'INS-2026-0004', inspectionType: 'post-incident', status: 'completed', result: 'fail',
    inspector: 'Sarah Chen', reviewer: 'IT Director', fieldOffice: 'Regional Office West', location: 'Office A1-03',
    scheduledDate: '2026-02-22T08:00:00', startedDate: '2026-02-22T08:15:00', completedDate: '2026-02-22T11:00:00', dueDate: '2026-02-22T12:00:00',
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
    overallFindings: 'Desktop suffered irreparable water damage. Data recovered. Recommend disposal and insurance claim.',
    recommendations: 'Initiate disposal process. File insurance claim. Procure replacement unit.',
    photosAttached: 12, createdBy: 'Sarah Chen', createdDate: '2026-02-22T07:30:00',
    signatures: [
      { role: 'inspector', name: 'Sarah Chen', status: 'signed', signedDate: '2026-02-22T11:00:00', method: 'digital' },
      { role: 'reviewer', name: 'IT Director', status: 'signed', signedDate: '2026-02-22T14:00:00', method: 'digital' },
    ],
    auditTrail: [
      { id: 'd1', action: 'Inspection Created', user: 'Sarah Chen', timestamp: '2026-02-22T07:30:00', details: 'Emergency post-incident inspection' },
      { id: 'd2', action: 'Inspection Completed', user: 'Sarah Chen', timestamp: '2026-02-22T11:00:00', details: 'Asset failed — water damage' },
      { id: 'd3', action: 'Review Completed', user: 'IT Director', timestamp: '2026-02-22T14:00:00', details: 'Disposal recommended' },
    ],
  },
  {
    id: '5', inspectionId: 'INS-2026-0005', inspectionType: 'scheduled', status: 'scheduled', result: 'pending',
    inspector: 'Mike Torres', reviewer: 'Operations Manager', fieldOffice: 'Regional Office East', location: 'Office Floor 2',
    scheduledDate: '2026-03-03T10:00:00', dueDate: '2026-03-05T17:00:00',
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
    overallFindings: '', recommendations: '', photosAttached: 0, createdBy: 'Mike Torres', createdDate: '2026-02-26T14:00:00',
    signatures: [
      { role: 'inspector', name: 'Mike Torres', status: 'pending' },
      { role: 'reviewer', name: 'Operations Manager', status: 'pending' },
    ],
    auditTrail: [
      { id: 'e1', action: 'Inspection Scheduled', user: 'Mike Torres', timestamp: '2026-02-26T14:00:00', details: 'Q1 inspection scheduled for March 3-5' },
    ],
  },
  {
    id: '6', inspectionId: 'INS-2026-0006', inspectionType: 'regulatory', status: 'draft', result: 'pending',
    inspector: 'Emily Davis', reviewer: 'Compliance Officer', fieldOffice: 'Headquarters', location: 'Main Building',
    scheduledDate: '2026-03-10T09:00:00', dueDate: '2026-03-15T17:00:00',
    title: 'Annual Regulatory Compliance Audit',
    description: 'Mandatory annual inspection for regulatory compliance covering fire safety and emergency systems.',
    assets: [],
    checklist: [
      { id: 'c1', label: 'Fire extinguisher inspection', checked: false },
      { id: 'c2', label: 'Emergency exit signage', checked: false },
      { id: 'c3', label: 'First aid kit contents', checked: false },
      { id: 'c4', label: 'Smoke detector testing', checked: false },
    ],
    overallFindings: '', recommendations: '', photosAttached: 0, createdBy: 'Emily Davis', createdDate: '2026-02-27T08:00:00',
    signatures: [
      { role: 'inspector', name: 'Emily Davis', status: 'pending' },
      { role: 'reviewer', name: 'Compliance Officer', status: 'pending' },
    ],
    auditTrail: [
      { id: 'f1', action: 'Draft Created', user: 'Emily Davis', timestamp: '2026-02-27T08:00:00', details: 'Annual compliance inspection draft' },
    ],
  },
]

export async function getInspections(): Promise<InspectionRequest[]> {
  if (IS_MOCK) return Promise.resolve(mockInspections)
  const { data } = await apiClient.get<InspectionRequest[]>('/inspections')
  return data
}

export async function createInspection(data: Record<string, unknown>): Promise<void> {
  // TODO: Replace with apiClient.post('/assets/inspections', data)
  await new Promise<void>((resolve) => setTimeout(resolve, 1000))
  void data
}

export async function startInspection(id: string): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/inspections/${id}/start`)
  await new Promise<void>((resolve) => setTimeout(resolve, 800))
  const ins = mockInspections.find((i) => i.id === id)
  if (ins) {
    ins.status = 'in-progress'
    ins.startedDate = new Date().toISOString()
    ins.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Inspection Started', user: 'Current User', timestamp: new Date().toISOString() })
  }
}

export async function completeInspection(id: string): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/inspections/${id}/complete`)
  await new Promise<void>((resolve) => setTimeout(resolve, 800))
  const ins = mockInspections.find((i) => i.id === id)
  if (ins) {
    ins.status = 'pending-review'
    ins.completedDate = new Date().toISOString()
    if (ins.result === 'pending') ins.result = 'pass'
    ins.signatures = ins.signatures.map((s) =>
      s.role === 'inspector' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString() } : s
    )
    ins.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Inspection Completed & Submitted for Review', user: 'Current User', timestamp: new Date().toISOString() })
  }
}

export async function approveInspectionReview(id: string): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/inspections/${id}/approve-review`)
  await new Promise<void>((resolve) => setTimeout(resolve, 800))
  const ins = mockInspections.find((i) => i.id === id)
  if (ins) {
    ins.status = 'completed'
    ins.signatures = ins.signatures.map((s) =>
      s.role === 'reviewer' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString() } : s
    )
    ins.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Review Approved', user: 'Current User', timestamp: new Date().toISOString() })
  }
}

// ── Surveys ───────────────────────────────────────────────────────────────────

const mockSurveys: SurveyRequest[] = [
  {
    id: '1', surveyId: 'SRV-2026-0001', surveyType: 'full-count', status: 'in-progress',
    surveyTeamLead: 'John Doe', surveyors: ['John Doe', 'Jane Smith', 'Bob Wilson'],
    fieldOffice: 'Headquarters', targetLocations: ['Office Floor 1', 'Office Floor 2', 'Server Room B2'],
    plannedStartDate: '2026-02-25T08:00:00', plannedEndDate: '2026-02-28T17:00:00', actualStartDate: '2026-02-25T08:30:00',
    title: 'Annual Full Physical Count - HQ IT Assets',
    description: 'Annual comprehensive physical verification of all IT assets at Headquarters. Required per audit policy.',
    scope: 'All IT assets at HQ — laptops, desktops, servers, networking, peripherals',
    assets: [
      { id: '1', assetId: 'LAP-001234', name: 'Dell Latitude 5520', serialNumber: 'DL5520-XR7891', type: 'Laptop', expectedLocation: 'Office Floor 1', actualLocation: 'Office Floor 1', expectedCondition: 'good', actualCondition: 'good', verified: true, acquisitionValue: 1450, nbv: 725 },
      { id: '2', assetId: 'DES-001235', name: 'HP EliteDesk 800', serialNumber: 'HP800-QW4523', type: 'Desktop', expectedLocation: 'Office A1-02', actualLocation: 'Office A1-02', expectedCondition: 'good', actualCondition: 'good', verified: true, acquisitionValue: 980, nbv: 490 },
      { id: '4', assetId: 'MON-001237', name: 'Dell U2722D Monitor', serialNumber: 'DL-MON-8891', type: 'Monitor', expectedLocation: 'Office A1-03', actualLocation: '', expectedCondition: 'good', actualCondition: '', verified: false, discrepancy: 'missing', notes: 'Monitor not found at expected location', acquisitionValue: 550, nbv: 275 },
    ],
    totalExpected: 45, totalVerified: 38, totalDiscrepancies: 3, accuracyRate: 84.4,
    assetsLocked: true, workflowType: 'hq', attachments: ['SRV-2026-0001_plan.pdf'], reportGenerated: false,
    createdBy: 'John Doe', createdDate: '2026-02-20T10:00:00',
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
    id: '2', surveyId: 'SRV-2026-0002', surveyType: 'location-based', status: 'completed',
    surveyTeamLead: 'Emily Davis', surveyors: ['Emily Davis', 'Alice Brown'],
    fieldOffice: 'Headquarters', targetLocations: ['Warehouse B1', 'Warehouse B2'],
    plannedStartDate: '2026-02-18T09:00:00', plannedEndDate: '2026-02-19T17:00:00',
    actualStartDate: '2026-02-18T09:15:00', actualEndDate: '2026-02-19T15:00:00',
    title: 'Warehouse Inventory Verification',
    description: 'Location-based survey of warehouse areas to reconcile physical inventory with system records.',
    scope: 'All assets stored in Warehouse B1 and B2',
    assets: [
      { id: '6', assetId: 'FUR-001239', name: 'Herman Miller Aeron Chair', serialNumber: 'HM-ERG-5541', type: 'Furniture', expectedLocation: 'Warehouse B1', actualLocation: 'Warehouse B1', expectedCondition: 'good', actualCondition: 'good', verified: true },
      { id: '10', assetId: 'FUR-001243', name: 'Standing Desk Frame', serialNumber: 'SD-FRM-2241', type: 'Furniture', expectedLocation: 'Warehouse B2', actualLocation: 'Office Floor 1', expectedCondition: 'new', actualCondition: 'new', verified: true, discrepancy: 'location-mismatch', notes: 'Desk moved to Office Floor 1 without system update' },
    ],
    totalExpected: 28, totalVerified: 28, totalDiscrepancies: 2, accuracyRate: 92.9,
    assetsLocked: false, workflowType: 'hq', attachments: ['SRV-2026-0002_report.pdf'], reportGenerated: true,
    createdBy: 'Emily Davis', createdDate: '2026-02-15T10:00:00',
    approvedBy: 'Facilities Manager', approvedDate: '2026-02-20T10:00:00',
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
    id: '3', surveyId: 'SRV-2026-0003', surveyType: 'high-value', status: 'reconciliation',
    surveyTeamLead: 'Mike Torres', surveyors: ['Mike Torres', 'Sarah Chen'],
    fieldOffice: 'Headquarters', targetLocations: ['Server Room B2', 'Office Floor 1'],
    plannedStartDate: '2026-02-24T08:00:00', plannedEndDate: '2026-02-25T17:00:00',
    actualStartDate: '2026-02-24T08:00:00', actualEndDate: '2026-02-25T12:00:00',
    title: 'High-Value Asset Verification (>$5,000)',
    description: 'Targeted verification of all assets with acquisition value exceeding $5,000.',
    scope: 'Assets with value > $5,000 across HQ',
    assets: [
      { id: '5', assetId: 'SRV-001238', name: 'HP ProLiant DL380', serialNumber: 'HP-DL380-XK231', type: 'Server', expectedLocation: 'Server Room B2', actualLocation: 'Server Room B2', expectedCondition: 'new', actualCondition: 'good', verified: true },
      { id: '11', assetId: 'SRV-001244', name: 'Dell PowerEdge R740', serialNumber: 'PE-R740-ZZ001', type: 'Server', expectedLocation: 'Server Room B2', actualLocation: '', expectedCondition: 'good', actualCondition: '', verified: false, discrepancy: 'missing', notes: 'Server rack position empty. Last scan 45 days ago.' },
    ],
    totalExpected: 12, totalVerified: 11, totalDiscrepancies: 1, accuracyRate: 91.7,
    linkedDisposalId: 'DSP-2026-0001',
    assetsLocked: true, workflowType: 'hq', attachments: ['SRV-2026-0003_report.pdf'], reportGenerated: true,
    createdBy: 'Mike Torres', createdDate: '2026-02-23T14:00:00',
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
    id: '4', surveyId: 'SRV-2026-0004', surveyType: 'custodian-based', status: 'pending-approval',
    surveyTeamLead: 'Lisa Park', surveyors: ['Lisa Park'],
    fieldOffice: 'Regional Office East', targetLocations: ['Office Floor 2'],
    plannedStartDate: '2026-02-22T10:00:00', plannedEndDate: '2026-02-22T16:00:00',
    actualStartDate: '2026-02-22T10:00:00', actualEndDate: '2026-02-22T14:30:00',
    title: 'Custodian Handover Verification - Lisa Park',
    description: "Verification of all assets under Lisa Park's custody as part of role transition.",
    scope: 'All assets assigned to custodian Lisa Park',
    assets: [
      { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', expectedLocation: 'Office Floor 2', actualLocation: 'Office Floor 2', expectedCondition: 'fair', actualCondition: 'fair', verified: true },
    ],
    totalExpected: 8, totalVerified: 8, totalDiscrepancies: 0, accuracyRate: 100,
    assetsLocked: false, workflowType: 'field', attachments: ['SRV-2026-0004_report.pdf'], reportGenerated: true,
    createdBy: 'Lisa Park', createdDate: '2026-02-21T10:00:00',
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
    id: '5', surveyId: 'SRV-2026-0005', surveyType: 'sample-based', status: 'planned',
    surveyTeamLead: 'David Lee', surveyors: ['David Lee', 'Bob Wilson'],
    fieldOffice: 'Headquarters', targetLocations: ['Office Floor 1', 'Office A1-01', 'Office A1-02'],
    plannedStartDate: '2026-03-05T09:00:00', plannedEndDate: '2026-03-06T17:00:00',
    title: 'Q1 Sample-Based Spot Verification',
    description: 'Random 20% sample verification of assets on Office Floor 1 area.',
    scope: '20% random sample of assets in Office Floor 1 wing',
    assets: [], totalExpected: 15, totalVerified: 0, totalDiscrepancies: 0, accuracyRate: 0,
    assetsLocked: false, workflowType: 'hq', attachments: [], reportGenerated: false,
    createdBy: 'David Lee', createdDate: '2026-02-27T09:00:00',
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
    id: '6', surveyId: 'SRV-2026-0006', surveyType: 'full-count', status: 'draft',
    surveyTeamLead: 'Alice Brown', surveyors: ['Alice Brown'],
    fieldOffice: 'Field Office North', targetLocations: ['Main Building'],
    plannedStartDate: '2026-03-15T08:00:00', plannedEndDate: '2026-03-20T17:00:00',
    title: 'Annual Survey - Field Office North',
    description: 'Annual full physical count at Field Office North.',
    scope: 'All assets at Field Office North',
    assets: [], totalExpected: 65, totalVerified: 0, totalDiscrepancies: 0, accuracyRate: 0,
    assetsLocked: false, workflowType: 'local', attachments: [], reportGenerated: false,
    createdBy: 'Alice Brown', createdDate: '2026-02-27T11:00:00',
    signatures: [
      { role: 'surveyor', name: 'Alice Brown', status: 'pending' },
      { role: 'team_lead', name: 'Alice Brown', status: 'pending' },
      { role: 'approver', name: 'Field Office Manager', status: 'pending' },
    ],
    auditTrail: [
      { id: 'f1', action: 'Draft Created', user: 'Alice Brown', timestamp: '2026-02-27T11:00:00' },
    ],
  },
]

export async function getSurveys(): Promise<SurveyRequest[]> {
  if (IS_MOCK) return Promise.resolve(mockSurveys)
  const { data } = await apiClient.get<SurveyRequest[]>('/surveys')
  return data
}

export async function createSurvey(data: Record<string, unknown>): Promise<void> {
  // TODO: Replace with apiClient.post('/assets/surveys', data)
  await new Promise<void>((resolve) => setTimeout(resolve, 1000))
  void data
}

export async function startSurvey(id: string): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/surveys/${id}/start`)
  await new Promise<void>((resolve) => setTimeout(resolve, 800))
  const survey = mockSurveys.find((s) => s.id === id)
  if (survey) {
    survey.status = 'in-progress'
    survey.actualStartDate = new Date().toISOString()
    survey.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Survey Started', user: 'Current User', timestamp: new Date().toISOString() })
  }
}

export async function completeSurvey(id: string): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/surveys/${id}/complete`)
  await new Promise<void>((resolve) => setTimeout(resolve, 800))
  const survey = mockSurveys.find((s) => s.id === id)
  if (survey) {
    survey.status = 'reconciliation'
    survey.actualEndDate = new Date().toISOString()
    survey.signatures = survey.signatures.map((s) =>
      s.role === 'surveyor' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString() } : s
    )
    survey.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Survey Completed — Reconciliation Required', user: 'Current User', timestamp: new Date().toISOString() })
  }
}

export async function submitSurveyForApproval(id: string): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/surveys/${id}/submit`)
  await new Promise<void>((resolve) => setTimeout(resolve, 800))
  const survey = mockSurveys.find((s) => s.id === id)
  if (survey) {
    survey.status = 'pending-approval'
    survey.signatures = survey.signatures.map((s) =>
      s.role === 'team_lead' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString() } : s
    )
    survey.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Submitted for Approval', user: 'Current User', timestamp: new Date().toISOString() })
  }
}

export async function approveSurvey(id: string): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/surveys/${id}/approve`)
  await new Promise<void>((resolve) => setTimeout(resolve, 800))
  const survey = mockSurveys.find((s) => s.id === id)
  if (survey) {
    survey.status = 'completed'
    survey.approvedBy = 'Current User'
    survey.approvedDate = new Date().toISOString()
    survey.signatures = survey.signatures.map((s) =>
      s.role === 'approver' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString() } : s
    )
    survey.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Survey Approved', user: 'Current User', timestamp: new Date().toISOString() })
  }
}

// ── Disposals ─────────────────────────────────────────────────────────────────

const mockDisposals: DisposalRequest[] = [
  {
    id: '1', disposalId: 'DSP-2026-0001', disposalMethod: 'write-off', status: 'pending-approval',
    requestedBy: 'Sarah Chen', reviewedBy: 'Finance Manager', approvedBy: 'IT Director',
    disposalOfficer: 'Bob Wilson', fieldOffice: 'Regional Office West',
    title: 'Write-Off: Water-Damaged Desktop',
    justification: 'Desktop suffered irreparable water damage during flooding incident on Feb 22. Post-incident inspection (INS-2026-0004) confirmed total loss. Data recovered from HDD.',
    notes: 'Insurance claim filed. Replacement procurement in progress.',
    assets: [
      { id: '9', assetId: 'DES-001242', name: 'Dell OptiPlex 7090', serialNumber: 'DO7090-AB123', type: 'Desktop', currentLocation: 'Office A1-03', condition: 'damaged', acquisitionValue: 1250, currentNBV: 625, disposalValue: 0, reason: 'Irreparable water damage' },
    ],
    totalAcquisitionValue: 1250, totalNBV: 625, totalDisposalValue: 0, writeOffAmount: 625,
    certificateOfDestruction: false, environmentalCompliance: true, dataWipeCertified: true,
    requestedDate: '2026-02-23T09:00:00', reviewDate: '2026-02-24T10:00:00',
    targetDisposalDate: '2026-03-15T00:00:00',
    createdBy: 'Sarah Chen', createdDate: '2026-02-23T09:00:00',
    linkedSurveyId: 'SRV-2026-0003', assetsLocked: true, workflowType: 'field',
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
    id: '2', disposalId: 'DSP-2026-0002', disposalMethod: 'donation', status: 'approved',
    requestedBy: 'Emily Davis', reviewedBy: 'Finance Manager', approvedBy: 'Operations Director',
    disposalOfficer: 'Emily Davis', fieldOffice: 'Headquarters',
    title: 'Donation: Surplus Office Furniture',
    justification: 'Office renovation has resulted in surplus furniture. Items are in serviceable condition and suitable for donation to local school.',
    notes: 'Receiving organization: Springfield Elementary School. Donation letter prepared.',
    assets: [
      { id: '12', assetId: 'FUR-001245', name: 'Office Desk (Standard)', serialNumber: 'OD-STD-4401', type: 'Furniture', currentLocation: 'Warehouse B2', condition: 'fair', acquisitionValue: 450, currentNBV: 45, disposalValue: 0, reason: 'Surplus after renovation' },
      { id: '13', assetId: 'FUR-001246', name: 'Office Chair (Basic)', serialNumber: 'OC-BSC-4402', type: 'Furniture', currentLocation: 'Warehouse B2', condition: 'fair', acquisitionValue: 200, currentNBV: 20, disposalValue: 0, reason: 'Surplus after renovation' },
      { id: '14', assetId: 'FUR-001247', name: 'Filing Cabinet (4-Drawer)', serialNumber: 'FC-4D-4403', type: 'Furniture', currentLocation: 'Warehouse B2', condition: 'good', acquisitionValue: 350, currentNBV: 105, disposalValue: 0, reason: 'Surplus after renovation' },
    ],
    totalAcquisitionValue: 1000, totalNBV: 170, totalDisposalValue: 0, writeOffAmount: 170,
    recipientOrganization: 'Springfield Elementary School',
    certificateOfDestruction: false, environmentalCompliance: true, dataWipeCertified: false,
    requestedDate: '2026-02-15T11:00:00', reviewDate: '2026-02-16T09:00:00', approvalDate: '2026-02-17T10:00:00',
    targetDisposalDate: '2026-03-01T00:00:00',
    createdBy: 'Emily Davis', createdDate: '2026-02-15T11:00:00',
    assetsLocked: true, workflowType: 'hq',
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
    id: '3', disposalId: 'DSP-2026-0003', disposalMethod: 'auction', status: 'in-progress',
    requestedBy: 'Mike Torres', reviewedBy: 'Finance Manager', approvedBy: 'IT Director',
    disposalOfficer: 'Bob Wilson', fieldOffice: 'Headquarters',
    title: 'Auction: Decommissioned Network Equipment',
    justification: 'Network equipment decommissioned after infrastructure upgrade. Still functional but no longer meets organizational requirements.',
    notes: 'Listed on government surplus auction platform. Auction ref: AUC-2026-0044.',
    assets: [
      { id: '15', assetId: 'NET-001248', name: 'Cisco Catalyst 3850', serialNumber: 'CS-3850-OLD1', type: 'Networking', currentLocation: 'Warehouse B1', condition: 'fair', acquisitionValue: 3800, currentNBV: 380, disposalValue: 850, reason: 'Replaced by newer model' },
      { id: '16', assetId: 'NET-001249', name: 'Cisco ASA 5506', serialNumber: 'CS-ASA-OLD2', type: 'Networking', currentLocation: 'Warehouse B1', condition: 'fair', acquisitionValue: 2200, currentNBV: 220, disposalValue: 450, reason: 'Replaced by newer model' },
    ],
    totalAcquisitionValue: 6000, totalNBV: 600, totalDisposalValue: 1300, writeOffAmount: 0,
    auctionReferenceNumber: 'AUC-2026-0044',
    certificateOfDestruction: false, environmentalCompliance: true, dataWipeCertified: true,
    requestedDate: '2026-02-10T10:00:00', reviewDate: '2026-02-11T09:00:00', approvalDate: '2026-02-12T14:00:00',
    targetDisposalDate: '2026-03-15T00:00:00',
    createdBy: 'Mike Torres', createdDate: '2026-02-10T10:00:00',
    assetsLocked: true, workflowType: 'hq',
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
    id: '4', disposalId: 'DSP-2026-0004', disposalMethod: 'recycling', status: 'completed',
    requestedBy: 'Jane Smith', reviewedBy: 'Finance Manager', approvedBy: 'Admin Manager',
    disposalOfficer: 'Bob Wilson', fieldOffice: 'Headquarters',
    title: 'Recycling: End-of-Life Printers',
    justification: 'Two printers have reached end-of-life with no available parts for repair. Recycling per e-waste policy.',
    notes: 'Recycled through certified e-waste vendor (GreenTech Recycling).',
    assets: [
      { id: '17', assetId: 'PRT-001250', name: 'HP LaserJet Pro M404', serialNumber: 'HP-LJ-EOL1', type: 'Printer', currentLocation: 'Warehouse B1', condition: 'non-functional', acquisitionValue: 600, currentNBV: 0, disposalValue: 15, reason: 'End of life, no parts available' },
      { id: '18', assetId: 'PRT-001251', name: 'Epson WorkForce WF-2830', serialNumber: 'EP-WF-EOL2', type: 'Printer', currentLocation: 'Warehouse B1', condition: 'non-functional', acquisitionValue: 350, currentNBV: 0, disposalValue: 10, reason: 'End of life, unrepairable' },
    ],
    totalAcquisitionValue: 950, totalNBV: 0, totalDisposalValue: 25, writeOffAmount: 0,
    recipientOrganization: 'GreenTech Recycling Ltd.',
    certificateOfDestruction: true, environmentalCompliance: true, dataWipeCertified: true,
    requestedDate: '2026-02-01T10:00:00', reviewDate: '2026-02-02T09:00:00', approvalDate: '2026-02-03T10:00:00',
    targetDisposalDate: '2026-02-15T00:00:00', actualDisposalDate: '2026-02-14T14:00:00',
    createdBy: 'Jane Smith', createdDate: '2026-02-01T10:00:00',
    assetsLocked: false, workflowType: 'hq',
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
    id: '5', disposalId: 'DSP-2026-0005', disposalMethod: 'scrap', status: 'rejected',
    requestedBy: 'David Lee', reviewedBy: 'Finance Manager', approvedBy: 'Operations Director',
    disposalOfficer: 'Bob Wilson', fieldOffice: 'Headquarters',
    title: 'Scrap: Server with Minor Fault',
    justification: 'Server experiencing intermittent errors. Requesting scrap disposal.',
    notes: '',
    assets: [
      { id: '19', assetId: 'SRV-001252', name: 'Dell PowerEdge T440', serialNumber: 'PE-T440-FF001', type: 'Server', currentLocation: 'Server Room B2', condition: 'fair', acquisitionValue: 6500, currentNBV: 3250, disposalValue: 200, reason: 'Intermittent hardware errors' },
    ],
    totalAcquisitionValue: 6500, totalNBV: 3250, totalDisposalValue: 200, writeOffAmount: 3050,
    certificateOfDestruction: false, environmentalCompliance: true, dataWipeCertified: false,
    requestedDate: '2026-02-20T09:00:00', reviewDate: '2026-02-21T10:00:00',
    targetDisposalDate: '2026-03-10T00:00:00',
    createdBy: 'David Lee', createdDate: '2026-02-20T09:00:00',
    assetsLocked: false, workflowType: 'hq',
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
      { id: 'e3', action: 'Rejected', user: 'Operations Director', timestamp: '2026-02-22T14:00:00', details: 'Server has significant remaining value. Send for professional repair first.' },
    ],
  },
  {
    id: '6', disposalId: 'DSP-2026-0006', disposalMethod: 'trade-in', status: 'draft',
    requestedBy: 'John Doe', reviewedBy: '', approvedBy: '', disposalOfficer: '',
    fieldOffice: 'Headquarters',
    title: 'Trade-In: Laptop Fleet Refresh',
    justification: 'Planning trade-in of older laptops as part of annual fleet refresh. Vendor quote pending.',
    notes: 'Draft — vendor quote expected by March 5.',
    assets: [
      { id: '8', assetId: 'LAP-001241', name: 'Lenovo ThinkPad T14', serialNumber: 'LN-T14-VV892', type: 'Laptop', currentLocation: 'Office Floor 2', condition: 'fair', acquisitionValue: 1200, currentNBV: 480, disposalValue: 350, reason: 'Fleet refresh - newer model available' },
    ],
    totalAcquisitionValue: 1200, totalNBV: 480, totalDisposalValue: 350, writeOffAmount: 130,
    certificateOfDestruction: false, environmentalCompliance: true, dataWipeCertified: false,
    requestedDate: '2026-02-27T10:00:00', targetDisposalDate: '2026-04-01T00:00:00',
    createdBy: 'John Doe', createdDate: '2026-02-27T10:00:00',
    assetsLocked: false, workflowType: 'hq',
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
]

export async function getDisposals(): Promise<DisposalRequest[]> {
  if (IS_MOCK) return Promise.resolve(mockDisposals)
  const { data } = await apiClient.get<DisposalRequest[]>('/disposals')
  return data
}

export async function createDisposal(data: Record<string, unknown>): Promise<void> {
  // TODO: Replace with apiClient.post('/assets/disposals', data)
  await new Promise<void>((resolve) => setTimeout(resolve, 1000))
  void data
}

export async function submitDisposalForReview(id: string): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/disposals/${id}/submit-review`)
  await new Promise<void>((resolve) => setTimeout(resolve, 800))
  const d = mockDisposals.find((x) => x.id === id)
  if (d) {
    d.status = 'pending-review'
    d.signatures = d.signatures.map((s) =>
      s.role === 'requesting_officer' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString() } : s
    )
    d.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Submitted for Finance Review', user: 'Current User', timestamp: new Date().toISOString() })
  }
}

export async function approveDisposalReview(id: string): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/disposals/${id}/approve-review`)
  await new Promise<void>((resolve) => setTimeout(resolve, 800))
  const d = mockDisposals.find((x) => x.id === id)
  if (d) {
    d.status = 'pending-approval'
    d.reviewDate = new Date().toISOString()
    d.signatures = d.signatures.map((s) =>
      s.role === 'finance_reviewer' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString() } : s
    )
    d.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Finance Review Completed', user: 'Current User', timestamp: new Date().toISOString() })
  }
}

export async function approveDisposal(id: string): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/disposals/${id}/approve`)
  await new Promise<void>((resolve) => setTimeout(resolve, 800))
  const d = mockDisposals.find((x) => x.id === id)
  if (d) {
    d.status = 'approved'
    d.approvalDate = new Date().toISOString()
    d.signatures = d.signatures.map((s) =>
      s.role === 'approving_authority' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString() } : s
    )
    d.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Disposal Approved', user: 'Current User', timestamp: new Date().toISOString() })
  }
}

export async function rejectDisposal(id: string, reason: string): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/disposals/${id}/reject`, { reason })
  await new Promise<void>((resolve) => setTimeout(resolve, 800))
  const d = mockDisposals.find((x) => x.id === id)
  if (d) {
    d.status = 'rejected'
    d.signatures = d.signatures.map((s) =>
      s.role === 'approving_authority' ? { ...s, status: 'declined' as const } : s
    )
    d.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Disposal Rejected', user: 'Current User', timestamp: new Date().toISOString(), details: reason })
  }
}

export async function executeDisposal(id: string): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/disposals/${id}/execute`)
  await new Promise<void>((resolve) => setTimeout(resolve, 800))
  const d = mockDisposals.find((x) => x.id === id)
  if (d) {
    d.status = 'in-progress'
    d.signatures = d.signatures.map((s) =>
      s.role === 'disposal_officer' ? { ...s, status: 'signed' as const, signedDate: new Date().toISOString() } : s
    )
    d.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Disposal Execution Started', user: 'Current User', timestamp: new Date().toISOString() })
  }
}

export async function completeDisposal(id: string): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/disposals/${id}/complete`)
  await new Promise<void>((resolve) => setTimeout(resolve, 800))
  const d = mockDisposals.find((x) => x.id === id)
  if (d) {
    d.status = 'completed'
    d.actualDisposalDate = new Date().toISOString()
    d.assetsLocked = true
    d.auditTrail.push({ id: `audit-${Date.now()}`, action: 'Disposal Completed — Assets Locked', user: 'Current User', timestamp: new Date().toISOString() })
  }
}

// ── Generic digital signature ─────────────────────────────────────────────────

export type SignRecordType = 'inspection' | 'transfer' | 'survey' | 'disposal'

export async function signRecord(
  type: SignRecordType,
  id: string,
  role: string,
  signatoryName: string,
): Promise<void> {
  // TODO: Replace with apiClient.post(`/assets/${type}s/${id}/sign`, { role, signatoryName })
  await new Promise<void>((resolve) => setTimeout(resolve, 600))

  type AnyRecord = { id: string; signatures: { role: string; status: string; name: string; signedDate?: string; method?: string }[]; auditTrail: { id: string; action: string; user: string; timestamp: string; details?: string }[] }

  const arrays: Record<SignRecordType, AnyRecord[]> = {
    inspection: mockInspections as unknown as AnyRecord[],
    transfer:   mockTransfers   as unknown as AnyRecord[],
    survey:     mockSurveys     as unknown as AnyRecord[],
    disposal:   mockDisposals   as unknown as AnyRecord[],
  }

  const record = arrays[type].find((r) => r.id === id)
  if (!record) return

  record.signatures = record.signatures.map((sig) =>
    sig.role === role
      ? { ...sig, status: 'signed', signedDate: new Date().toISOString(), method: 'digital', name: signatoryName || sig.name }
      : sig
  )
  record.auditTrail.push({
    id:        `sig-${Date.now()}`,
    action:    `Digitally Signed — ${role.replace(/_/g, ' ')}`,
    user:      signatoryName || 'Current User',
    timestamp: new Date().toISOString(),
    details:   'Digital signature applied',
  })
}
