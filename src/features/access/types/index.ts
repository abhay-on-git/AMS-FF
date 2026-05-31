// ── Permission actions ────────────────────────────────────────────────────────

export type PermissionAction = 'view' | 'create' | 'edit' | 'approve' | 'delete' | 'export'

/** Typed accessor — replaces all `as any` casts from RoleManagement.tsx */
export function getPermissionValue(
  perm: ModulePermission | SubModulePermission,
  action: PermissionAction,
): boolean {
  return perm[action]
}

// ── Discriminators ────────────────────────────────────────────────────────────

export type RoleType     = 'system' | 'custom'
export type RoleCategory = 'administrator' | 'standard' | 'auditor' | 'approver' | 'custom'
export type DetailTab    = 'permissions' | 'field-access' | 'locations'

// ── Sub-structures ────────────────────────────────────────────────────────────

export interface FieldRestriction {
  field:       string
  label:       string
  restricted:  boolean
  description: string
}

export interface SubModulePermission {
  name:    string
  view:    boolean
  create:  boolean
  edit:    boolean
  approve: boolean
  delete:  boolean
  export:  boolean
}

export interface ModulePermission {
  module:            string
  icon:              string
  view:              boolean
  create:            boolean
  edit:              boolean
  approve:           boolean
  delete:            boolean
  export:            boolean
  subModules:        SubModulePermission[]
  fieldRestrictions: FieldRestriction[]
}

export interface LocationAccess {
  officeId:   string
  officeName: string
  code:       string
  location:   string
  granted:    boolean
}

// ── Core Role interface ───────────────────────────────────────────────────────

export interface Role {
  id:                   string
  name:                 string
  type:                 RoleType
  category:             RoleCategory
  description:          string
  userCount:            number
  createdDate:          string
  lastModified:         string
  isActive:             boolean
  allLocations:         boolean
  permissions:          ModulePermission[]
  locationAccess:       LocationAccess[]
  externalAuditorName?: string
  auditFirm?:           string
}
