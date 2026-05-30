import type { AuditEvent, LifecycleEvent } from '../types'

export const mockAuditEvents: AuditEvent[] = [
  { id: '1', eventType: 'location_change', action: 'Location Changed', oldValue: 'Office A1-05', newValue: 'Office Floor 1', user: 'John Doe', timestamp: '2024-02-01 14:30:00', fieldOffice: 'Headquarters', comment: 'Moved due to office reorganization' },
  { id: '2', eventType: 'status_change', action: 'Status Updated', oldValue: 'inactive', newValue: 'active', user: 'Admin', timestamp: '2024-01-19 09:15:00', fieldOffice: 'Headquarters', comment: 'Returned from maintenance' },
  { id: '3', eventType: 'custodian_change', action: 'Custodian Changed', oldValue: 'Jane Smith', newValue: 'John Doe', user: 'Admin', timestamp: '2024-01-18 16:45:00', fieldOffice: 'Headquarters', comment: 'Team reassignment' },
  { id: '4', eventType: 'inspection', action: 'Inspection Completed', newValue: 'Passed', user: 'Inspector Lee', timestamp: '2024-01-17 11:00:00', fieldOffice: 'Headquarters', comment: 'Quarterly inspection - all checks passed' },
  { id: '5', eventType: 'edit', action: 'Notes Updated', newValue: 'High-performance laptop for software development team', user: 'John Doe', timestamp: '2024-01-16 10:30:00', fieldOffice: 'Headquarters' },
  { id: '6', eventType: 'transfer', action: 'Asset Transferred', oldValue: 'Regional Office East', newValue: 'Headquarters', user: 'Logistics Team', timestamp: '2024-01-15 15:00:00', fieldOffice: 'Headquarters', comment: 'Inter-office transfer approved by management' },
  { id: '7', eventType: 'created', action: 'Asset Created', newValue: 'LAP-001234', user: 'System', timestamp: '2024-01-15 10:00:00', fieldOffice: 'Headquarters', comment: 'Initial asset registration via SAP sync' },
]

export const mockLifecycleEvents: LifecycleEvent[] = [
  { id: '1', stage: 'registered', action: 'Asset Registered', date: '2024-01-15 10:00:00', user: 'System', details: 'Initial asset registration via SAP sync', icon: 'registered' },
  { id: '2', stage: 'active', action: 'Status Updated', date: '2024-01-19 09:15:00', user: 'Admin', details: 'Returned from maintenance', icon: 'active' },
  { id: '3', stage: 'maintenance', action: 'Custodian Changed', date: '2024-01-18 16:45:00', user: 'Admin', details: 'Team reassignment', icon: 'maintenance' },
  { id: '4', stage: 'survey', action: 'Inspection Completed', date: '2024-01-17 11:00:00', user: 'Inspector Lee', details: 'Quarterly inspection - all checks passed', icon: 'survey' },
  { id: '5', stage: 'active', action: 'Notes Updated', date: '2024-01-16 10:30:00', user: 'John Doe', details: 'High-performance laptop for software development team', icon: 'active' },
  { id: '6', stage: 'transfer', action: 'Asset Transferred', date: '2024-01-15 15:00:00', user: 'Logistics Team', details: 'Inter-office transfer approved by management', icon: 'transfer' },
  { id: '7', stage: 'active', action: 'Asset Created', date: '2024-01-15 10:00:00', user: 'System', details: 'Initial asset registration via SAP sync', icon: 'active' },
]
