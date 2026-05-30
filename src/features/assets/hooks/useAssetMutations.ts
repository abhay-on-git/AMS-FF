import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  EditAssetFormData,
  ChangeStatusFormData,
  ChangeLocationFormData,
  TransferAssetFormData,
  CreateAssetFormData,
  BulkTransferFormData,
  BulkInspectionFormData,
  BulkSurveyFormData,
  BulkDisposalFormData,
  BulkChangeStatusFormData,
} from '../schemas/assetSchemas'

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

export function useBulkTransfer(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BulkTransferFormData & { assetIds: string[] }) => {
      await simulateDelay(1000)
      return data
    },
    onSuccess: (data) => {
      toast.success(`Transfer request submitted for ${data.assetIds.length} asset(s) → ${data.destination}`)
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to submit bulk transfer')
    },
  })
}

export function useBulkInspection(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: BulkInspectionFormData & { assetIds: string[] }) => {
      await simulateDelay(1000)
      return data
    },
    onSuccess: (data) => {
      toast.success(`Inspection scheduled for ${data.assetIds.length} asset(s) on ${data.scheduledDate}`)
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to schedule inspection'),
  })
}

export function useBulkSurvey(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: BulkSurveyFormData & { assetIds: string[] }) => {
      await simulateDelay(1000)
      return data
    },
    onSuccess: (data) => {
      toast.success(`${data.surveyType} survey scheduled for ${data.assetIds.length} asset(s)`)
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to schedule survey'),
  })
}

export function useBulkDisposal(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: BulkDisposalFormData & { assetIds: string[] }) => {
      await simulateDelay(1200)
      return data
    },
    onSuccess: (data) => {
      toast.success(`${data.assetIds.length} asset(s) marked for disposal via ${data.disposalMethod}`)
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to submit disposal request'),
  })
}

export function useBulkChangeStatus(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: BulkChangeStatusFormData & { assetIds: string[] }) => {
      await simulateDelay(1000)
      return data
    },
    onSuccess: (data) => {
      toast.success(`Status updated to "${data.newStatus}" for ${data.assetIds.length} asset(s)`)
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to update status'),
  })
}

export function useCreateAsset(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateAssetFormData) => {
      await simulateDelay(1000)
      return data
    },
    onSuccess: () => {
      toast.success('Asset registered successfully')
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to register asset')
    },
  })
}
