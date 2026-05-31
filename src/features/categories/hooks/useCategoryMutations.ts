import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCategory, updateCategory, deleteCategory } from '../services/categoriesService'
import type { Category } from '../types'
import type { CategoryFormData } from '../schemas/categorySchemas'

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CategoryFormData) => createCategory(data),
    onSuccess: (category) => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success(`Category "${category.categoryName}" created`)
    },
    onError: () => toast.error('Failed to create category'),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => updateCategory(id, data),
    onSuccess: (category) => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success(`Category "${category.categoryName}" updated`)
    },
    onError: () => toast.error('Failed to update category'),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category deleted')
    },
    onError: () => toast.error('Failed to delete category'),
  })
}
