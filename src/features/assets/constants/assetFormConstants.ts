// Lookup data for AssetFormDrawer — field office / location / custodian cascading
// matches original DraftAssets.tsx data exactly

export const FIELD_OFFICES = [
  { code: 'FO-HQ',  name: 'Headquarters' },
  { code: 'FO-ROE', name: 'Regional Office East' },
  { code: 'FO-ROW', name: 'Regional Office West' },
]

export const FIELD_OFFICE_LOCATIONS: Record<string, string[]> = {
  'FO-HQ':  ['Office Floor 1', 'Office A1-01', 'Office A1-02'],
  'FO-ROE': ['Office A1-03', 'Warehouse B1'],
  'FO-ROW': ['Warehouse B2'],
}

export const LOCATION_CUSTODIANS: Record<string, string[]> = {
  'Office Floor 1': ['John Doe', 'Jane Smith', 'Bob Wilson'],
  'Office A1-01':   ['Sarah Chen', 'Michael Tran'],
  'Office A1-02':   ['Emily Nguyen', 'David Park'],
  'Office A1-03':   ['Lisa Wang', 'Ahmed Hassan'],
  'Warehouse B1':   ['Maria Garcia', 'John Doe'],
  'Warehouse B2':   ['Bob Wilson', 'Sarah Chen'],
}

export const ASSET_CONDITIONS   = ['New', 'Like New', 'Good', 'Fair', 'Refurbished']
export const ASSET_TYPES        = ['Equipment', 'Vehicle', 'Furniture', 'IT Hardware', 'Tools', 'Networking', 'Server', 'Printer']
export const ASSET_CURRENCIES   = ['USD', 'EUR', 'GBP', 'KHR', 'VND']
export const ASSET_CLASSIFICATIONS = ['Capital', 'Attractive', 'N/A']

export const REGISTRATION_TIPS = [
  'Asset ID should be unique across the system',
  'EPC code is read from the RFID tag',
  'Barcode is optional but recommended',
  'Select appropriate asset type for categorization',
  'Assets valued ≥ USD 2,000 are classified as Capital Items',
  'Enter procurement details if available for audit compliance',
]
