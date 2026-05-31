import { useQuery } from '@tanstack/react-query'
import { getRoles, getRoleById } from '../services/rolesService'

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  })
}

export function useRoleDetail(id: string | null) {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => getRoleById(id!),
    enabled: !!id,
  })
}
