import { apiClient } from '@/services/apiClient'
import { IS_MOCK } from '@/services/mockMode'
import { mockCategories } from '../constants/categoriesData'
import type { Category } from '../types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

let _categories: Category[] = [...mockCategories]

export interface CategoryFilters {
  search?: string
  status?: string
}

function toCategoryCode(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    return words
      .slice(0, 3)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
  }
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '')
    .slice(0, 3)
    .padEnd(3, 'X')
}

export async function getCategories(filters?: CategoryFilters): Promise<Category[]> {
  if (IS_MOCK) {
    await delay(500)
    let result = [..._categories]
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.categoryName.toLowerCase().includes(q) ||
          c.categoryCode.toLowerCase().includes(q) ||
          (c.description?.toLowerCase().includes(q) ?? false),
      )
    }
    if (filters?.status && filters.status !== 'all') {
      result = result.filter((c) => c.status === filters.status)
    }
    return result
  }
  const { data } = await apiClient.get<Category[]>('/categories', { params: filters })
  return data
}

export async function getCategoryById(id: string): Promise<Category> {
  if (IS_MOCK) {
    await delay(300)
    const category = _categories.find((c) => c.id === id)
    if (!category) throw new Error(`Category ${id} not found`)
    return { ...category }
  }
  const { data } = await apiClient.get<Category>(`/categories/${id}`)
  return data
}

export async function createCategory(
  data: Omit<Category, 'id' | 'categoryCode' | 'createdDate'> & { categoryCode?: string },
): Promise<Category> {
  if (IS_MOCK) {
    await delay(600)
    const category: Category = {
      id: `cat-${Date.now()}`,
      categoryCode: data.categoryCode ?? toCategoryCode(data.categoryName),
      categoryName: data.categoryName,
      parentCategory: data.parentCategory,
      status: data.status,
      description: data.description,
      createdDate: new Date().toISOString().split('T')[0],
    }
    _categories = [..._categories, category]
    return category
  }
  const { data: created } = await apiClient.post<Category>('/categories', data)
  return created
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  if (IS_MOCK) {
    await delay(600)
    _categories = _categories.map((c) => (c.id === id ? { ...c, ...data } : c))
    return { ..._categories.find((c) => c.id === id)! }
  }
  const { data: updated } = await apiClient.patch<Category>(`/categories/${id}`, data)
  return updated
}

export async function deleteCategory(id: string): Promise<void> {
  if (IS_MOCK) {
    await delay(500)
    _categories = _categories.filter((c) => c.id !== id)
    return
  }
  await apiClient.delete(`/categories/${id}`)
}
