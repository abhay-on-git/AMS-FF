import type { AssetColumnConfig } from '../types'

export const defaultTransferColumns: AssetColumnConfig[] = [
  { key: 'transferId',    label: 'Transfer ID',   visible: true,  category: 'default' },
  { key: 'transferType',  label: 'Type',          visible: true,  category: 'default' },
  { key: 'status',        label: 'Status',        visible: true,  category: 'default' },
  { key: 'fromFieldOffice', label: 'From',        visible: true,  category: 'default' },
  { key: 'toFieldOffice', label: 'To',            visible: true,  category: 'default' },
  { key: 'assets',        label: 'Assets',        visible: true,  category: 'default' },
  { key: 'initiatedBy',   label: 'Initiated By',  visible: true,  category: 'tracking' },
  { key: 'initiatedDate', label: 'Initiated Date',visible: true,  category: 'tracking' },
  { key: 'reason',        label: 'Reason',        visible: false, category: 'default' },
  { key: 'approvedBy',    label: 'Approved By',   visible: false, category: 'tracking' },
  { key: 'completedDate', label: 'Completed Date',visible: false, category: 'tracking' },
]
