export type CategoryStatus = 'active' | 'inactive'

export interface Category {
  id: string
  categoryCode: string
  categoryName: string
  parentCategory?: string
  status: CategoryStatus
  description?: string
  createdDate: string
}

export type CategoryDrawerMode = 'create' | 'edit'
