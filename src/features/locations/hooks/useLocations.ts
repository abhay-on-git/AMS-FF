import { useQuery } from '@tanstack/react-query'
import {
  getFieldOffices,
  getFieldOfficeSummaries,
  getLocations,
  type LocationFilters,
} from '../services/locationsService'

export function useFieldOffices() {
  return useQuery({
    queryKey: ['field-offices'],
    queryFn: getFieldOffices,
  })
}

export function useFieldOfficeSummaries() {
  return useQuery({
    queryKey: ['field-offices', 'summaries'],
    queryFn: getFieldOfficeSummaries,
  })
}

export function useLocations(filters?: LocationFilters) {
  return useQuery({
    queryKey: ['locations', filters],
    queryFn: () => getLocations(filters),
  })
}
