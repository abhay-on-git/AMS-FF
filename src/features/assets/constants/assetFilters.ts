import type { ActiveTab } from '../types'
import { mockCategories } from '@/features/categories'

export interface FilterOption {
  value: string
  label: string
}

export const categoryOptions: FilterOption[] = [
  { value: 'all', label: 'All Categories' },
  ...mockCategories.map((c) => ({
    label: c.categoryName,
    value: c.id,
  })),
]

export const typeOptions: FilterOption[] = [
  { value: 'all', label: 'All Types' },
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Desktop', label: 'Desktop' },
  { value: 'Printer', label: 'Printer' },
  { value: 'Monitor', label: 'Monitor' },
  { value: 'Server', label: 'Server' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Furniture', label: 'Furniture' },
]

export const conditionOptions: FilterOption[] = [
  { value: 'all', label: 'All Conditions' },
  { value: 'new', label: 'New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
  { value: 'damaged', label: 'Damaged' },
]

export const locationOptions: FilterOption[] = [
  { value: 'all', label: 'All Locations' },
  { value: 'Office', label: 'Office' },
  { value: 'Server Room', label: 'Server Room' },
  { value: 'Warehouse', label: 'Warehouse' },
]

export const classificationOptions: FilterOption[] = [
  { value: 'all', label: 'All Classes' },
  { value: 'Capital', label: 'Capital' },
  { value: 'Attractive', label: 'Attractive' },
]

export interface TabOption {
  value: ActiveTab
  label: string
  showCount?: boolean
}

export const tabOptions: TabOption[] = [
  { value: 'all', label: 'Published Assets' },
  { value: 'drafts', label: 'Draft Assets', showCount: true },
  { value: 'transfers', label: 'Asset Transfers' },
  { value: 'inspections', label: 'Asset Inspections' },
  { value: 'surveys', label: 'Asset Surveys' },
  { value: 'disposals', label: 'Asset Disposals' },
]
