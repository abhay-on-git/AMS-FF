export interface LocationNode {
  id: string
  code: string
  name: string
  fieldOfficeId: string
  parentId: string | null
  locationTypeId: string
  level: number
  path: string[]
  description?: string
  metadata: Record<string, unknown>
  tags: string[]
  status: 'active' | 'maintenance' | 'inactive' | 'planned'
  capacity?: number
  childCount: number
  assetCount: number
  assignedUserCount: number
  createdDate: string
  createdBy: string
  lastUpdated: string
  lastUpdatedBy: string
}

export interface LocationType {
  id: string
  fieldOfficeId: string
  name: string
  icon: string
  level: number
  parentTypeId: string | null
  isActive: boolean
}

export interface FieldOfficeConfig {
  id: string
  code: string
  name: string
  location: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip?: string
  locationTypes: LocationType[]
  rootLocationId: string | null
  isActive: boolean
}

export interface LocationUserAssignment {
  id: string
  userId: string
  userName: string
  locationId: string
  assignmentType: 'direct' | 'inherited'
  permissions: string[]
  assignedDate: string
  assignedBy: string
}

export interface TreeNode extends LocationNode {
  children: TreeNode[]
  isExpanded?: boolean
  isSelected?: boolean
  isFavorite?: boolean
}

export interface LocationStats {
  totalLocations: number
  activeLocations: number
  assetsMapped: number
  unassignedAssets: number
  averageHierarchyDepth: number
  maxHierarchyDepth: number
}

export interface FieldOfficeSummary {
  fieldOfficeId: string
  fieldOfficeName: string
  locationCount: number
  activeLocationCount: number
  assetCount: number
  userCount: number
  hierarchyDepth: number
  lastUpdated: string
}

export interface LocationActivity {
  id: string
  locationId: string
  eventType:
    | 'created'
    | 'updated'
    | 'moved'
    | 'deleted'
    | 'asset_added'
    | 'asset_removed'
    | 'user_assigned'
    | 'user_unassigned'
  description: string
  performedBy: string
  performedDate: string
  oldValue?: string
  newValue?: string
  metadata?: Record<string, unknown>
}

export interface HierarchyTemplate {
  id: string
  name: string
  description: string
  fieldOfficeId: string
  structure: LocationType[]
  isDefault: boolean
  createdBy: string
  createdDate: string
}

export type LocationViewMode = 'overview' | 'explorer' | 'builder' | 'assignments'

export interface LocationFilters {
  searchQuery: string
  fieldOfficeId: string | 'all'
  status: LocationNode['status'] | 'all'
  locationTypeId: string | 'all'
  hasAssets: boolean | 'all'
  hasUsers: boolean | 'all'
}

export type LocationSortField = 'name' | 'code' | 'assetCount' | 'userCount' | 'lastUpdated'
export type LocationSortDirection = 'asc' | 'desc'

export interface LocationSort {
  field: LocationSortField
  direction: LocationSortDirection
}

export type LocationBulkOperation =
  | 'move'
  | 'delete'
  | 'activate'
  | 'deactivate'
  | 'assign_users'
  | 'export'

export interface LocationFormData {
  name: string
  code: string
  description: string
  parentId: string | null
  locationTypeId: string
  status: LocationNode['status']
  capacity: number | null
  tags: string[]
  metadata: Record<string, unknown>
}
