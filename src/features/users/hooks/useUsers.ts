import { useQuery } from '@tanstack/react-query'
import { getUsers, getUserById } from '../services/usersService'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
}

export function useUserDetail(id: string | null) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
  })
}
