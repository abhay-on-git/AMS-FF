import type { AssetColumnConfig } from '../types'

export const defaultAssetColumns: AssetColumnConfig[] = [
  { key: 'assetId', label: 'Asset ID', visible: true, category: 'default' },
  { key: 'epc', label: 'EPC', visible: true, category: 'default' },
  { key: 'barcode', label: 'Barcode', visible: true, category: 'default' },
  { key: 'type', label: 'Category', visible: true, category: 'default' },
  { key: 'name', label: 'Name', visible: true, category: 'default' },
  { key: 'location', label: 'Location', visible: true, category: 'default' },
  { key: 'publishedDate', label: 'Published Date', visible: true, category: 'default' },
  { key: 'custodian', label: 'Custodian', visible: true, category: 'default' },
  { key: 'fieldOffice', label: 'Field Office', visible: false, category: 'tracking' },
  { key: 'lastStatusChange', label: 'Last Status Change', visible: false, category: 'tracking' },
  { key: 'lastLocationUpdate', label: 'Last Location Update', visible: false, category: 'tracking' },
  { key: 'lastCustodianChange', label: 'Last Custodian Change', visible: false, category: 'tracking' },
  { key: 'condition', label: 'Condition', visible: false, category: 'tracking' },
  { key: 'nbv', label: 'NBV', visible: false, category: 'financial' },
]
