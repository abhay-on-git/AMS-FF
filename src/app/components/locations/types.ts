// ── Location Module Types for Enterprise Asset Management System ──

/**
 * Core location node supporting unlimited hierarchy depth
 * Each node can have multiple children, forming a tree structure
 */
export interface LocationNode {
  id: string;
  code: string;
  name: string;
  fieldOfficeId: string;
  parentId: string | null;
  locationTypeId: string;
  level: number; // 0 = root, 1+ = children
  path: string[]; // Array of ancestor IDs for fast querying

  // Metadata
  description?: string;
  metadata: Record<string, any>;
  tags: string[];

  // Status & Capacity
  status: 'active' | 'maintenance' | 'inactive' | 'planned';
  capacity?: number;

  // Computed counts (aggregated from relationships)
  childCount: number;
  assetCount: number;
  assignedUserCount: number;

  // Audit fields
  createdDate: string;
  createdBy: string;
  lastUpdated: string;
  lastUpdatedBy: string;
}

/**
 * Configurable location type (e.g., Campus, Building, Floor, Room)
 * Different Field Offices can have different type configurations
 */
export interface LocationType {
  id: string;
  fieldOfficeId: string;
  name: string; // "Campus", "Building", "Floor", "Room", etc.
  icon: string; // Material icon name
  level: number; // Order in hierarchy (0 = top level)
  parentTypeId: string | null;
  isActive: boolean;
}

/**
 * Field Office configuration with hierarchy settings
 */
export interface FieldOfficeConfig {
  id: string;
  code: string;
  name: string;
  location: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  locationTypes: LocationType[]; // Ordered hierarchy configuration
  rootLocationId: string | null;
  isActive: boolean;
}

/**
 * User assignment to location with permissions
 */
export interface LocationUserAssignment {
  id: string;
  userId: string;
  userName: string;
  locationId: string;
  assignmentType: 'direct' | 'inherited';
  permissions: string[];
  assignedDate: string;
  assignedBy: string;
}

/**
 * Tree node for rendering (includes children)
 */
export interface TreeNode extends LocationNode {
  children: TreeNode[];
  isExpanded?: boolean;
  isSelected?: boolean;
  isFavorite?: boolean;
}

/**
 * Location statistics for analytics
 */
export interface LocationStats {
  totalLocations: number;
  activeLocations: number;
  assetsMapped: number;
  unassignedAssets: number;
  averageHierarchyDepth: number;
  maxHierarchyDepth: number;
}

/**
 * Field Office summary for overview
 */
export interface FieldOfficeSummary {
  fieldOfficeId: string;
  fieldOfficeName: string;
  locationCount: number;
  activeLocationCount: number;
  assetCount: number;
  userCount: number;
  hierarchyDepth: number;
  lastUpdated: string;
}

/**
 * Location activity/audit event
 */
export interface LocationActivity {
  id: string;
  locationId: string;
  eventType: 'created' | 'updated' | 'moved' | 'deleted' | 'asset_added' | 'asset_removed' | 'user_assigned' | 'user_unassigned';
  description: string;
  performedBy: string;
  performedDate: string;
  oldValue?: string;
  newValue?: string;
  metadata?: Record<string, any>;
}

/**
 * Hierarchy template for quick setup
 */
export interface HierarchyTemplate {
  id: string;
  name: string;
  description: string;
  fieldOfficeId: string;
  structure: LocationType[];
  isDefault: boolean;
  createdBy: string;
  createdDate: string;
}

/**
 * View mode for location module
 */
export type LocationViewMode = 'overview' | 'explorer' | 'builder' | 'assignments';

/**
 * Filter state for locations
 */
export interface LocationFilters {
  searchQuery: string;
  fieldOfficeId: string | 'all';
  status: LocationNode['status'] | 'all';
  locationTypeId: string | 'all';
  hasAssets: boolean | 'all';
  hasUsers: boolean | 'all';
}

/**
 * Sort options for location lists
 */
export type LocationSortField = 'name' | 'code' | 'assetCount' | 'userCount' | 'lastUpdated';
export type LocationSortDirection = 'asc' | 'desc';

export interface LocationSort {
  field: LocationSortField;
  direction: LocationSortDirection;
}

/**
 * Bulk operation types
 */
export type LocationBulkOperation = 'move' | 'delete' | 'activate' | 'deactivate' | 'assign_users' | 'export';

/**
 * Location form data for create/edit
 */
export interface LocationFormData {
  name: string;
  code: string;
  description: string;
  parentId: string | null;
  locationTypeId: string;
  status: LocationNode['status'];
  capacity: number | null;
  tags: string[];
  metadata: Record<string, any>;
}
