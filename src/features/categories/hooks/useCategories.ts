import { useQuery } from '@tanstack/react-query'
import { getCategories, type CategoryFilters } from '../services/categoriesService'

export function useCategories(filters?: CategoryFilters) {
  return useQuery({
    queryKey: ['categories', filters],
    queryFn: () => getCategories(filters),
  })
}
