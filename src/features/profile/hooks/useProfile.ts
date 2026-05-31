import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCredentials } from '@/store/authSlice'
import { getProfile, updateProfile } from '../services/profileService'
import type { UpdateProfileFormData } from '../types'

export function useProfile() {
  const authUser = useAppSelector((s) => s.auth.user)

  return useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(authUser!),
    enabled: !!authUser,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const authUser = useAppSelector((s) => s.auth.user)
  const token = useAppSelector((s) => s.auth.token)

  return useMutation({
    mutationFn: (data: UpdateProfileFormData) => updateProfile(authUser!, data),
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      if (authUser && token) {
        dispatch(setCredentials({
          user: {
            ...authUser,
            name: `${profile.firstName} ${profile.lastName}`,
            email: profile.email,
          },
          token,
        }))
      }
      toast.success('Profile updated successfully')
    },
  })
}
