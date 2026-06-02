import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createLocation,
  updateLocation,
  deleteLocation,
  saveLocation,
  saveFieldOffice,
} from '../services/locationsService'
import type { FieldOfficeConfig, LocationNode } from '../types'

export function useSaveLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (location: LocationNode) => saveLocation(location),
    onSuccess: (location) => {
      qc.invalidateQueries({ queryKey: ['locations'] })
      qc.invalidateQueries({ queryKey: ['field-offices', 'summaries'] })
      toast.success(`Location "${location.name}" saved successfully`)
    },
    onError: () => toast.error('Failed to save location'),
  })
}

export function useCreateLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (location: LocationNode) => createLocation(location),
    onSuccess: (location) => {
      qc.invalidateQueries({ queryKey: ['locations'] })
      qc.invalidateQueries({ queryKey: ['field-offices', 'summaries'] })
      toast.success(`Location "${location.name}" created successfully`)
    },
    onError: () => toast.error('Failed to create location'),
  })
}

export function useUpdateLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LocationNode> }) =>
      updateLocation(id, data),
    onSuccess: (location) => {
      qc.invalidateQueries({ queryKey: ['locations'] })
      qc.invalidateQueries({ queryKey: ['field-offices', 'summaries'] })
      toast.success(`Location "${location.name}" updated successfully`)
    },
    onError: () => toast.error('Failed to update location'),
  })
}

export function useDeleteLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteLocation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['locations'] })
      qc.invalidateQueries({ queryKey: ['field-offices', 'summaries'] })
      toast.success('Location deleted')
    },
    onError: () => toast.error('Failed to delete location'),
  })
}

export function useSaveFieldOffice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (office: FieldOfficeConfig) => saveFieldOffice(office),
    onSuccess: (office) => {
      qc.invalidateQueries({ queryKey: ['field-offices'] })
      qc.invalidateQueries({ queryKey: ['field-offices', 'summaries'] })
      toast.success(`Field office "${office.name}" saved successfully`)
    },
    onError: () => toast.error('Failed to save field office'),
  })
}
