import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createRole,
  updateRole,
  deleteRole,
  cloneRole,
  updatePermissions,
} from '../services/rolesService'
import type { Role, ModulePermission } from '../types'

export function useCreateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Role, 'id' | 'createdDate' | 'lastModified' | 'userCount'>) =>
      createRole(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role created successfully')
    },
    onError: () => toast.error('Failed to create role'),
  })
}

export function useUpdateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Role> }) =>
      updateRole(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role updated successfully')
    },
    onError: () => toast.error('Failed to update role'),
  })
}

export function useDeleteRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role deleted')
    },
    onError: () => toast.error('Failed to delete role'),
  })
}

export function useCloneRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cloneRole(id),
    onSuccess: (role) => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      toast.success(`Role cloned as "${role.name}"`)
    },
    onError: () => toast.error('Failed to clone role'),
  })
}

export function useUpdatePermissions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: ModulePermission[] }) =>
      updatePermissions(id, permissions),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Permissions saved')
    },
    onError: () => toast.error('Failed to save permissions'),
  })
}
