import type { AppNotification } from '../types'

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Transfer Pending Approval',
    message: 'Transfer request TR-045 needs your approval',
    timestamp: '2 min ago',
    isRead: false,
    source: 'Transfers',
  },
  {
    id: '2',
    type: 'success',
    title: 'Inspection Completed',
    message: 'Inventory inspection INV-089 completed successfully',
    timestamp: '15 min ago',
    isRead: false,
    source: 'Inspection',
  },
  {
    id: '3',
    type: 'info',
    title: 'New Asset Registered',
    message: '5 new assets added to category "Laptops"',
    timestamp: '1 hour ago',
    isRead: false,
    source: 'Assets',
  },
  {
    id: '4',
    type: 'info',
    title: 'SAP Sync Completed',
    message: 'Successfully synced 234 records from SAP',
    timestamp: '2 hours ago',
    isRead: true,
    source: 'System',
  },
  {
    id: '5',
    type: 'warning',
    title: 'Asset Location Mismatch',
    message: 'Asset EPC-001234 found in unexpected location',
    timestamp: '3 hours ago',
    isRead: true,
    source: 'Inventory',
  },
]
