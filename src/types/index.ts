/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SHARED TYPE DEFINITIONS
 * Centralized TypeScript interfaces used across the application
 *
 * WHY: Scattered types cause:
 *   - Inconsistent interfaces between components
 *   - Difficulty in refactoring
 *   - No single source of truth
 *
 * ENTERPRISE BENEFIT:
 *   - Consistent typing across entire codebase
 *   - Easy to find and update shared types
 *   - Better IDE support and type checking
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Page types for routing
export type PageType =
  | "dashboard"
  | "categories"
  | "assets"
  | "locations"
  | "reporting"
  | "users"
  | "notifications"
  | "action-log"
  | "rfid-settings"
  | "pending-action-detail"
  | "compliance-gap-detail"
  | "profile";

// User roles for access control
export type UserRole = "admin" | "smio" | "auditor" | "senior_management";

// Asset statuses
export type AssetStatus =
  | "active"
  | "inactive"
  | "maintenance"
  | "disposed"
  | "missing"
  | "in-transit";

// Asset conditions
export type AssetCondition = "new" | "good" | "fair" | "poor" | "damaged";

// Lifecycle stages
export type LifecycleStage =
  | "registered"
  | "active"
  | "maintenance"
  | "survey"
  | "pending-disposal"
  | "disposed";

// Audit event types
export type AuditEventType =
  | "status_change"
  | "location_change"
  | "transfer"
  | "edit"
  | "inspection"
  | "disposal"
  | "created"
  | "custodian_change";

// Common component prop types
export interface CommonProps {
  className?: string;
  id?: string;
  "data-testid"?: string;
}

// Navigation item for sidebar/menu
export interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string | number;
  children?: NavigationItem[];
  onClick?: () => void;
}

// Breadcrumb item
export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

// KPI Card data
export interface KPIData {
  label: string;
  value: string | number;
  change?: string;
  up?: boolean;
  icon?: React.ReactNode;
  href?: string;
}

// Table column configuration
export interface ColumnConfig<T = unknown> {
  key: string;
  label: string;
  visible?: boolean;
  sortable?: boolean;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

// Filter state for advanced filtering
export interface FilterState {
  search?: string;
  status?: string;
  condition?: string;
  fieldOffice?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Pagination state
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// Loading state
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Form field props
export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
}

// Select option type
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Dialog/Drawer state helper
export interface DialogState {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Re-export commonly used types from specific modules
export type {
  EnhancedAsset,
  AuditEvent,
  LifecycleEvent,
  LocationNode,
  FieldOfficeConfig,
} from "../components/assets/types";

export type {
  AdvancedFilterState,
} from "../components/assets/types";

// Signature workflow — reused by Transfers, Inspections, Surveys, Disposals
export interface SignatureStep {
  id:        string
  role:      string
  label:     string
  signedBy?: string
  signedAt?: string
  status:    'pending' | 'signed' | 'rejected'
  comment?:  string
}