import type { AppNotification } from '../types'

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Transfer Pending Approval',
    message:
      'Transfer request TR-045 from HQ-F1 to HQ-F2 needs your approval. Contains 12 assets worth $45,000.',
    source: 'Transfers',
    timestamp: '2024-01-22 14:30',
    occurredAt: '2024-01-22T14:30:00Z',
    isRead: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Inspection Completed',
    message:
      'Inventory inspection INV-089 completed successfully. All 156 assets verified and accounted for.',
    source: 'Inspection',
    timestamp: '2024-01-22 14:15',
    occurredAt: '2024-01-22T14:15:00Z',
    isRead: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'New Assets Registered',
    message:
      '5 new assets added to category "Laptops" — Dell XPS 15 models with RFID tags assigned.',
    source: 'Assets',
    timestamp: '2024-01-22 13:00',
    occurredAt: '2024-01-22T13:00:00Z',
    isRead: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'SAP Sync Completed',
    message:
      'Successfully synced 234 records from SAP ERP. Assets: 156, Locations: 45, Categories: 33.',
    source: 'System',
    timestamp: '2024-01-22 12:30',
    occurredAt: '2024-01-22T12:30:00Z',
    isRead: true,
  },
  {
    id: '5',
    type: 'warning',
    title: 'Asset Location Mismatch',
    message:
      'Asset EPC-001234 (MacBook Pro) found in HQ-F3 but expected in HQ-F1. Please verify the location.',
    source: 'Inventory',
    timestamp: '2024-01-22 11:45',
    occurredAt: '2024-01-22T11:45:00Z',
    isRead: true,
  },
  {
    id: '6',
    type: 'success',
    title: 'Transfer Approved',
    message:
      'Transfer request TR-044 has been approved by the manager. Assets are ready for physical transfer.',
    source: 'Transfers',
    timestamp: '2024-01-22 10:20',
    occurredAt: '2024-01-22T10:20:00Z',
    isRead: true,
  },
  {
    id: '7',
    type: 'warning',
    title: 'Inspection Overdue',
    message:
      'Location HQ-F2 is due for quarterly inspection. Last inspection was 95 days ago.',
    source: 'Inspection',
    timestamp: '2024-01-22 09:00',
    occurredAt: '2024-01-22T09:00:00Z',
    isRead: true,
  },
  {
    id: '8',
    type: 'info',
    title: 'User Role Updated',
    message:
      'User john.doe@company.com role changed from Staff to Manager by admin.',
    source: 'System',
    timestamp: '2024-01-21 16:30',
    occurredAt: '2024-01-21T16:30:00Z',
    isRead: true,
  },
]
