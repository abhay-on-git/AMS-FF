import type { AssetColumnConfig } from '../types'

export const defaultInspectionColumns: AssetColumnConfig[] = [
  { key: 'inspectionId',   label: 'Inspection ID', visible: true,  category: 'default' },
  { key: 'inspectionType', label: 'Type',           visible: true,  category: 'default' },
  { key: 'title',          label: 'Title',          visible: true,  category: 'default' },
  { key: 'status',         label: 'Status',         visible: true,  category: 'default' },
  { key: 'result',         label: 'Result',         visible: true,  category: 'default' },
  { key: 'inspector',      label: 'Inspector',      visible: true,  category: 'default' },
  { key: 'fieldOffice',    label: 'Field Office',   visible: true,  category: 'default' },
  { key: 'scheduledDate',  label: 'Scheduled Date', visible: true,  category: 'tracking' },
  { key: 'dueDate',        label: 'Due Date',       visible: false, category: 'tracking' },
  { key: 'completedDate',  label: 'Completed Date', visible: false, category: 'tracking' },
  { key: 'assets',         label: 'Assets',         visible: false, category: 'default' },
]
