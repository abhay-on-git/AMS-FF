import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  toggleUserStatus,
} from '../services/usersService'
import type { UserData, UserStatus, ResetPasswordData } from '../types'

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<UserData, 'id' | 'createdDate' | 'lastLogin'>) =>
      createUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
    },
    onError: () => toast.error('Failed to create user'),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserData> }) =>
      updateUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully')
    },
    onError: () => toast.error('Failed to update user'),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted')
    },
    onError: () => toast.error('Failed to delete user'),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResetPasswordData }) =>
      resetPassword(id, data),
    onSuccess: () => toast.success('Password reset successfully'),
    onError: () => toast.error('Failed to reset password'),
  })
}

export function useToggleUserStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      toggleUserStatus(id, status),
    onSuccess: (user) => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success(
        `User ${user.status === 'active' ? 'activated' : 'deactivated'}`,
      )
    },
    onError: () => toast.error('Failed to update user status'),
  })
}
