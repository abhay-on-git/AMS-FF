import type { Category } from '../types'

export const mockCategories: Category[] = [
  {
    id: '1',
    categoryCode: 'LAP',
    categoryName: 'Laptop',
    status: 'active',
    description: 'Portable computers',
    createdDate: '2024-01-15',
  },
  {
    id: '2',
    categoryCode: 'DES',
    categoryName: 'Desktop',
    status: 'active',
    description: 'Desktop computers',
    createdDate: '2024-01-15',
  },
  {
    id: '3',
    categoryCode: 'PRN',
    categoryName: 'Printer',
    status: 'active',
    description: 'Printing devices',
    createdDate: '2024-01-15',
  },
  {
    id: '4',
    categoryCode: 'MON',
    categoryName: 'Monitor',
    status: 'active',
    description: 'Display screens',
    createdDate: '2024-01-16',
  },
  {
    id: '5',
    categoryCode: 'SRV',
    categoryName: 'Server',
    status: 'active',
    description: 'Server equipment',
    createdDate: '2024-01-16',
  },
  {
    id: '6',
    categoryCode: 'NET',
    categoryName: 'Network Equipment',
    status: 'active',
    description: 'Routers, switches, etc.',
    createdDate: '2024-01-20',
  },
]
