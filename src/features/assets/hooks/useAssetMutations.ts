import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { EditAssetFormData, ChangeStatusFormData, ChangeLocationFormData, TransferAssetFormData } from '../schemas/assetSchemas'

function simulateDelay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useEditAsset(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: EditAssetFormData & { assetId: string }) => {
      await simulateDelay()
      return data
    },
    onSuccess: (data) => {
      toast.success(`Asset ${data.assetId} updated successfully`)
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to update asset')
    },
  })
}

export function useChangeStatus(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ChangeStatusFormData & { assetId: string }) => {
      await simulateDelay()
      return data
    },
    onSuccess: (data) => {
      toast.success(`Status transition request submitted: ${data.assetId} → ${data.targetStage.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`)
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to submit status change')
    },
  })
}

export function useChangeLocation(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ChangeLocationFormData & { assetId: string }) => {
      await simulateDelay()
      return data
    },
    onSuccess: (data) => {
      toast.success(`Location change submitted: ${data.assetId} → ${data.newLocation}`)
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to update location')
    },
  })
}

export function useTransferAsset(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TransferAssetFormData & { assetId: string }) => {
      await simulateDelay()
      return data
    },
    onSuccess: (data) => {
      toast.success(`Transfer request submitted: ${data.assetId} → ${data.destination}`)
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to submit transfer')
    },
  })
}
