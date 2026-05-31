export type EntityType = 'Assets' | 'Users' | 'Categories' | 'Locations' | 'Reports'

export type EventType = 'Create' | 'Update' | 'Delete'

export interface AuditLogChange {
  from: unknown
  to: unknown
}

export interface AuditLogJustification {
  reason: string
  context?: string
}

export interface AuditLogMetadata {
  ip_address?: string
  session_id?: string
  user_agent?: string
}

/** Mirrors audit_logs table schema */
export interface AuditLog {
  id: string
  entity_type: string
  entity_id: string
  event_type: string
  actor_id: string
  actor_name: string
  actor_role_at_time: string
  timestamp: string
  changes: Record<string, AuditLogChange> | null
  justification: AuditLogJustification | null
  metadata: AuditLogMetadata
}
