import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createSchedule,
  deleteSchedule,
  deleteSavedQuery,
  saveSavedQuery,
  updateSchedule,
} from '../services/reportingService'
import type { CreateSchedulePayload, SavedQuery, UpdateSchedulePayload } from '../types'

export function useSaveQuery(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveSavedQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'saved-queries'] })
      toast.success('Query saved successfully')
      onSuccess?.()
    },
  })
}

export function useDeleteSavedQuery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSavedQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'saved-queries'] })
      toast.success('Query deleted')
    },
  })
}

export function useCreateSchedule(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'scheduled'] })
      toast.success('Schedule created')
      onSuccess?.()
    },
  })
}

export function useUpdateSchedule(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSchedulePayload }) =>
      updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'scheduled'] })
      toast.success('Schedule updated')
      onSuccess?.()
    },
  })
}

export function useToggleSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      updateSchedule(id, { enabled }),
    onSuccess: (_data, { enabled }) => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'scheduled'] })
      toast.success(enabled ? 'Schedule enabled' : 'Schedule paused')
    },
  })
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'scheduled'] })
      toast.success('Schedule deleted')
    },
  })
}

export type { SavedQuery }
