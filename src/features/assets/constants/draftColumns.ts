import type { AssetColumnConfig } from '../types'

export const defaultDraftColumns: AssetColumnConfig[] = [
  { key: 'draftId',          label: 'Draft ID',         visible: true,  category: 'default' },
  { key: 'poNumber',         label: 'PO Number',        visible: true,  category: 'default' },
  { key: 'grnNumber',        label: 'GRN Number',       visible: true,  category: 'default' },
  { key: 'itemDescription',  label: 'Description',      visible: true,  category: 'default' },
  { key: 'supplier',         label: 'Supplier',         visible: true,  category: 'default' },
  { key: 'quantity',         label: 'Qty',              visible: true,  category: 'default' },
  { key: 'unitPrice',        label: 'Unit Price',       visible: true,  category: 'financial' },
  { key: 'totalCost',        label: 'Total Cost',       visible: true,  category: 'financial' },
  { key: 'classification',   label: 'Classification',   visible: true,  category: 'default' },
  { key: 'assignmentStatus', label: 'Status',           visible: true,  category: 'default' },
  { key: 'acquisitionDate',  label: 'Acq. Date',        visible: true,  category: 'tracking' },
  { key: 'currency',         label: 'Currency',         visible: false, category: 'financial' },
  { key: 'assignedTo',       label: 'Assigned To',      visible: false, category: 'tracking' },
  { key: 'sapSyncTimestamp', label: 'SAP Sync Time',    visible: false, category: 'tracking' },
]
