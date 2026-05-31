import { apiClient } from '@/services/apiClient'
import { IS_MOCK } from '@/services/mockMode'
import type { Role, ModulePermission, RoleType, RoleCategory } from '../types'

// ─── Filters shape ────────────────────────────────────────────────────────────

export interface RoleFilters {
  search?:   string
  type?:     RoleType
  category?: RoleCategory
}

// ─── Mock seed data ───────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const fieldOfficesList = [
  { officeId: '1', officeName: 'Amman Office',      code: 'FO-AMM', location: 'Amman, Jordan',       granted: true },
  { officeId: '2', officeName: 'Afghanistan Office', code: 'FO-AFA', location: 'Kabul, Afghanistan',   granted: true },
  { officeId: '3', officeName: 'Bangkok Office',     code: 'FO-BKK', location: 'Bangkok, Thailand',    granted: true },
  { officeId: '4', officeName: 'Melbourne Office',   code: 'FO-MEL', location: 'Melbourne, Australia', granted: true },
  { officeId: '5', officeName: 'Phnom Penh Office',  code: 'FO-PNH', location: 'Phnom Penh, Cambodia', granted: true },
  { officeId: '6', officeName: 'Geneva HQ',          code: 'HQ-GVA', location: 'Geneva, Switzerland',  granted: true },
]

const defaultModulePermissions: ModulePermission[] = [
  {
    module: 'Dashboard', icon: '📊',
    view: true, create: false, edit: false, approve: false, delete: false, export: true,
    subModules: [],
    fieldRestrictions: [
      { field: 'financial_summary', label: 'Financial Summary Widget', restricted: false, description: 'Total asset value, depreciation overview' },
      { field: 'cost_analytics',    label: 'Cost Analytics Charts',    restricted: false, description: 'Budget vs actual spending charts' },
    ],
  },
  {
    module: 'Assets', icon: '📦',
    view: true, create: true, edit: true, approve: false, delete: true, export: true,
    subModules: [
      { name: 'Published Assets',  view: true, create: true,  edit: true,  approve: false, delete: true,  export: true },
      { name: 'Draft Assets',      view: true, create: true,  edit: true,  approve: false, delete: true,  export: true },
      { name: 'Asset Transfers',   view: true, create: true,  edit: true,  approve: true,  delete: false, export: true },
      { name: 'Asset Inspections', view: true, create: true,  edit: true,  approve: true,  delete: false, export: true },
      { name: 'Asset Surveys',     view: true, create: true,  edit: true,  approve: false, delete: false, export: true },
      { name: 'Asset Disposals',   view: true, create: true,  edit: false, approve: true,  delete: false, export: true },
    ],
    fieldRestrictions: [
      { field: 'purchase_price', label: 'Purchase Price',        restricted: false, description: 'Original purchase cost of asset' },
      { field: 'current_value',  label: 'Current Value',         restricted: false, description: 'Current depreciated value' },
      { field: 'depreciation',   label: 'Depreciation Data',     restricted: false, description: 'Monthly/annual depreciation rates' },
      { field: 'insurance_info', label: 'Insurance Information', restricted: false, description: 'Insurance policy and coverage details' },
      { field: 'vendor_info',    label: 'Vendor/Supplier Info',  restricted: false, description: 'Vendor contacts and contract details' },
    ],
  },
  { module: 'Categories',            icon: '🏷️', view: true,  create: true,  edit: true,  approve: false, delete: true,  export: true,  subModules: [], fieldRestrictions: [] },
  { module: 'Locations',             icon: '📍', view: true,  create: false, edit: false, approve: false, delete: false, export: true,  subModules: [], fieldRestrictions: [] },
  {
    module: 'Asset Lifecycle', icon: '🔄',
    view: true, create: false, edit: true, approve: true, delete: false, export: true,
    subModules: [
      { name: 'Lifecycle Transitions', view: true,  create: false, edit: true,  approve: true,  delete: false, export: true  },
      { name: 'Admin Override',        view: false, create: false, edit: false, approve: false, delete: false, export: false },
    ],
    fieldRestrictions: [],
  },
  { module: 'Find Extra',            icon: '🔍', view: true,  create: true,  edit: true,  approve: false, delete: false, export: true,  subModules: [], fieldRestrictions: [] },
  {
    module: 'Reporting & Analytics', icon: '📈',
    view: true, create: false, edit: false, approve: false, delete: false, export: true,
    subModules: [
      { name: 'Predefined Reports',    view: true, create: false, edit: false, approve: false, delete: false, export: true },
      { name: 'Custom Report Builder', view: true, create: true,  edit: true,  approve: false, delete: true,  export: true },
      { name: 'Scheduled Reports',     view: true, create: true,  edit: true,  approve: false, delete: true,  export: true },
    ],
    fieldRestrictions: [
      { field: 'financial_reports', label: 'Financial Report Data', restricted: false, description: 'Cost, depreciation, and budget reports' },
    ],
  },
  {
    module: 'Users & Roles', icon: '👥',
    view: true, create: false, edit: false, approve: false, delete: false, export: false,
    subModules: [
      { name: 'User Management',     view: true, create: false, edit: false, approve: false, delete: false, export: false },
      { name: 'Field Offices',       view: true, create: false, edit: false, approve: false, delete: false, export: false },
      { name: 'Roles & Permissions', view: true, create: false, edit: false, approve: false, delete: false, export: false },
    ],
    fieldRestrictions: [],
  },
  { module: 'Integrations',  icon: '🔗', view: false, create: false, edit: false, approve: false, delete: false, export: false, subModules: [], fieldRestrictions: [] },
  { module: 'Notifications', icon: '🔔', view: true,  create: false, edit: true,  approve: false, delete: false, export: false, subModules: [], fieldRestrictions: [] },
  { module: 'Action Log',    icon: '📋', view: true,  create: false, edit: false, approve: false, delete: false, export: true,  subModules: [], fieldRestrictions: [] },
  { module: 'RFID Settings', icon: '📡', view: false, create: false, edit: false, approve: false, delete: false, export: false, subModules: [], fieldRestrictions: [] },
  { module: 'System Config', icon: '⚙️', view: false, create: false, edit: false, approve: false, delete: false, export: false, subModules: [], fieldRestrictions: [] },
]

const fullAccess = (): ModulePermission[] =>
  defaultModulePermissions.map((m) => ({
    ...m, view: true, create: true, edit: true, approve: true, delete: true, export: true,
    subModules:        m.subModules.map((s) => ({ ...s, view: true, create: true, edit: true, approve: true, delete: true, export: true })),
    fieldRestrictions: m.fieldRestrictions.map((f) => ({ ...f, restricted: false })),
  }))

const readOnly = (): ModulePermission[] =>
  defaultModulePermissions.map((m) => ({
    ...m, view: true, create: false, edit: false, approve: false, delete: false, export: true,
    subModules:        m.subModules.map((s) => ({ ...s, view: true, create: false, edit: false, approve: false, delete: false, export: true })),
    fieldRestrictions: m.fieldRestrictions.map((f) => ({ ...f, restricted: false })),
  }))

let _roles: Role[] = [
  {
    id: '1', name: 'Administrator', type: 'system', category: 'administrator',
    userCount: 3,  createdDate: '2024-01-01', lastModified: '2025-12-15', isActive: true, allLocations: true,
    permissions: fullAccess(), locationAccess: fieldOfficesList.map((f) => ({ ...f, granted: true })),
    description: 'Full access to all functionalities, including asset registration, editing, transfers, lifecycle management, user management, and reporting.',
  },
  {
    id: '2', name: 'Standard User', type: 'system', category: 'standard',
    userCount: 15, createdDate: '2024-01-01', lastModified: '2025-11-20', isActive: true, allLocations: false,
    permissions: defaultModulePermissions, locationAccess: fieldOfficesList.map((f, i) => ({ ...f, granted: i < 2 })),
    description: 'Can register and update asset information, perform transfers, submit disposal requests, and run reports for their assigned region.',
  },
  {
    id: '3', name: 'Auditor', type: 'system', category: 'auditor',
    userCount: 4,  createdDate: '2024-01-01', lastModified: '2025-10-10', isActive: true, allLocations: true,
    permissions: readOnly(), locationAccess: fieldOfficesList.map((f) => ({ ...f, granted: true })),
    description: 'View-only access to all asset data, history, and reports for audit and compliance purposes.',
    externalAuditorName: 'Rachel Anderson', auditFirm: 'KPMG International',
  },
  {
    id: '4', name: 'Approver / Reviewer', type: 'system', category: 'approver',
    userCount: 6,  createdDate: '2024-01-01', lastModified: '2025-12-01', isActive: true, allLocations: false,
    permissions: defaultModulePermissions, locationAccess: fieldOfficesList.map((f, i) => ({ ...f, granted: i < 3 })),
    description: 'May approve asset transfers, survey cases, disposal requests, or lifecycle changes based on workflow rules.',
  },
  {
    id: '5', name: 'Disposal Focal Point', type: 'custom', category: 'custom',
    userCount: 3,  createdDate: '2024-06-15', lastModified: '2025-11-05', isActive: true, allLocations: false,
    permissions: defaultModulePermissions, locationAccess: fieldOfficesList.map((f, i) => ({ ...f, granted: i === 0 })),
    description: 'Specialized role for managing asset disposal workflows, including creating disposal requests, conducting surveys, and generating disposal reports.',
  },
  {
    id: '6', name: 'PDA User', type: 'custom', category: 'custom',
    userCount: 8,  createdDate: '2024-08-20', lastModified: '2025-09-12', isActive: true, allLocations: false,
    permissions: defaultModulePermissions, locationAccess: fieldOfficesList.map((f, i) => ({ ...f, granted: i < 2 })),
    description: 'Mobile-only access for PDA/handheld device users performing inventory scans, asset verification, and basic lookups in the field.',
  },
]

// ─── getRoles ─────────────────────────────────────────────────────────────────
// GET /roles?search=&type=&category=

export async function getRoles(filters?: RoleFilters): Promise<Role[]> {
  if (IS_MOCK) {
    await delay(600)
    let result = [..._roles]
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
      )
    }
    if (filters?.type)     result = result.filter((r) => r.type     === filters.type)
    if (filters?.category) result = result.filter((r) => r.category === filters.category)
    return result
  }

  const { data } = await apiClient.get<Role[]>('/roles', { params: filters })
  return data
}

// ─── getRoleById ──────────────────────────────────────────────────────────────
// GET /roles/:id

export async function getRoleById(id: string): Promise<Role> {
  if (IS_MOCK) {
    await delay(400)
    const role = _roles.find((r) => r.id === id)
    if (!role) throw new Error(`Role ${id} not found`)
    return { ...role }
  }

  const { data } = await apiClient.get<Role>(`/roles/${id}`)
  return data
}

// ─── createRole ───────────────────────────────────────────────────────────────
// POST /roles

export async function createRole(
  data: Omit<Role, 'id' | 'createdDate' | 'lastModified' | 'userCount'>,
): Promise<Role> {
  if (IS_MOCK) {
    await delay(800)
    const now     = new Date().toISOString().split('T')[0]
    const newRole = { ...data, id: `r-${Date.now()}`, userCount: 0, createdDate: now, lastModified: now }
    _roles = [..._roles, newRole]
    return newRole
  }

  const { data: created } = await apiClient.post<Role>('/roles', data)
  return created
}

// ─── updateRole ───────────────────────────────────────────────────────────────
// PATCH /roles/:id

export async function updateRole(id: string, data: Partial<Role>): Promise<Role> {
  if (IS_MOCK) {
    await delay(800)
    const now = new Date().toISOString().split('T')[0]
    _roles    = _roles.map((r) => (r.id === id ? { ...r, ...data, lastModified: now } : r))
    return { ..._roles.find((r) => r.id === id)! }
  }

  const { data: updated } = await apiClient.patch<Role>(`/roles/${id}`, data)
  return updated
}

// ─── deleteRole ───────────────────────────────────────────────────────────────
// DELETE /roles/:id

export async function deleteRole(id: string): Promise<void> {
  if (IS_MOCK) {
    await delay(600)
    _roles = _roles.filter((r) => r.id !== id)
    return
  }

  await apiClient.delete(`/roles/${id}`)
}

// ─── cloneRole ────────────────────────────────────────────────────────────────
// POST /roles/:id/clone

export async function cloneRole(id: string): Promise<Role> {
  if (IS_MOCK) {
    await delay(800)
    const source = _roles.find((r) => r.id === id)
    if (!source) throw new Error(`Role ${id} not found`)
    const now    = new Date().toISOString().split('T')[0]
    const cloned = { ...source, id: `r-${Date.now()}`, name: `${source.name} (Copy)`, type: 'custom' as const, userCount: 0, createdDate: now, lastModified: now }
    _roles = [..._roles, cloned]
    return cloned
  }

  const { data } = await apiClient.post<Role>(`/roles/${id}/clone`)
  return data
}

// ─── updatePermissions ────────────────────────────────────────────────────────
// PATCH /roles/:id/permissions

export async function updatePermissions(id: string, permissions: ModulePermission[]): Promise<Role> {
  if (IS_MOCK) {
    await delay(800)
    const now = new Date().toISOString().split('T')[0]
    _roles    = _roles.map((r) => (r.id === id ? { ...r, permissions, lastModified: now } : r))
    return { ..._roles.find((r) => r.id === id)! }
  }

  const { data } = await apiClient.patch<Role>(`/roles/${id}/permissions`, { permissions })
  return data
}
