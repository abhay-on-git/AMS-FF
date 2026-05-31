// ── User Status & Roles ───────────────────────────────────────────────────────

export type UserStatus = 'active' | 'inactive' | 'locked'

export type UserRole =
  | 'Admin'
  | 'Manager'
  | 'Inventory Staff'
  | 'Auditor'
  | 'Approver / Reviewer'
  | 'Disposal Focal Point'
  | 'PDA User'
  | string // allows custom roles created via RoleManagement

export type DrawerMode = 'create' | 'edit'

export type ResetMethod = 'manual' | 'email-link' | 'temp-password'

// ── Core Interfaces ───────────────────────────────────────────────────────────

export interface UserData {
  id:           string
  name:         string
  email:        string
  mobile?:      string
  countryCode?: string
  role:         string
  fieldOffice:  string
  status:       UserStatus
  lastLogin?:   string
  createdDate:  string
}

export interface ActivityLog {
  id:          string
  action:      string
  description: string
  timestamp:   string
  ipAddress?:  string
}

// ── Form shapes ───────────────────────────────────────────────────────────────

export interface UserFormData {
  firstName:         string
  lastName:          string
  email:             string
  countryCode:       string
  mobile:            string
  role:              string
  fieldOffice:       string
  assignedLocations: string[]
  status?:           UserStatus // edit mode only
}

export interface ResetPasswordData {
  method:              ResetMethod
  newPassword?:        string
  confirmPassword?:    string
  forceChange:         boolean
  notifyUser:          boolean
  revokeOtherSessions: boolean
}
