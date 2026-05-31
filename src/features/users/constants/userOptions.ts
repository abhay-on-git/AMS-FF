import { mockFieldOffices } from '@/features/locations'

export const roleOptions = [
  { value: 'Admin',                label: 'Admin' },
  { value: 'Manager',              label: 'Manager' },
  { value: 'Inventory Staff',      label: 'Inventory Staff' },
  { value: 'Auditor',              label: 'Auditor' },
  { value: 'Approver / Reviewer',  label: 'Approver / Reviewer' },
  { value: 'Disposal Focal Point', label: 'Disposal Focal Point' },
  { value: 'PDA User',             label: 'PDA User' },
  { value: 'Custom Role A',        label: 'Custom Role A' },
  { value: 'Custom Role B',        label: 'Custom Role B' },
]

export const statusOptions = [
  { value: 'active',   label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'locked',   label: 'Locked' },
]

export const fieldOfficeOptions = mockFieldOffices.map((fo) => ({
  value: fo.code,
  label: fo.name,
}))

export const countryCodeOptions = [
  { value: '+1',   label: '+1 (US/CA)' },
  { value: '+44',  label: '+44 (UK)' },
  { value: '+49',  label: '+49 (DE)' },
  { value: '+33',  label: '+33 (FR)' },
  { value: '+61',  label: '+61 (AU)' },
  { value: '+81',  label: '+81 (JP)' },
  { value: '+91',  label: '+91 (IN)' },
  { value: '+962', label: '+962 (JO)' },
  { value: '+855', label: '+855 (KH)' },
  { value: '+93',  label: '+93 (AF)' },
]
