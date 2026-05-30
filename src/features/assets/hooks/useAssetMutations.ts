import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { approveTransfer, rejectTransfer, acknowledgeTransfer, initiateTransfer, createInspection, startInspection, completeInspection, approveInspectionReview, createSurvey, startSurvey, completeSurvey, submitSurveyForApproval, approveSurvey, createDisposal, submitDisposalForReview, approveDisposalReview, approveDisposal, rejectDisposal, executeDisposal, completeDisposal, signRecord } from '../services/assetsService'
import type { SignRecordType } from '../services/assetsService'
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
import { registerAssetFromDraft } from '../services/assetsService'

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

export function useRegisterFromDraft(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateAssetFormData & { draftId: string }) => {
      await registerAssetFromDraft(data.draftId, data)
      return data
    },
    onSuccess: (data) => {
      toast.success(`Asset registered from draft ${data.draftId}`)
      queryClient.invalidateQueries({ queryKey: ['assets', 'drafts'] })
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to register asset from draft')
    },
  })
}

export function useDeleteDraft(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (draftId: string) => {
      await simulateDelay(600)
      return draftId
    },
    onSuccess: () => {
      toast.success('Draft deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['assets', 'drafts'] })
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to delete draft')
    },
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

// ── Transfer mutations ────────────────────────────────────────────────────────

export function useInitiateTransfer(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => initiateTransfer(data),
    onSuccess: () => {
      toast.success('Transfer request initiated successfully')
      queryClient.invalidateQueries({ queryKey: ['assets', 'transfers'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to initiate transfer'),
  })
}

export function useApproveTransfer(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveTransfer(id),
    onSuccess: () => {
      toast.success('Transfer approved successfully')
      queryClient.invalidateQueries({ queryKey: ['assets', 'transfers'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to approve transfer'),
  })
}

export function useRejectTransfer(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectTransfer(id, reason),
    onSuccess: () => {
      toast.success('Transfer rejected')
      queryClient.invalidateQueries({ queryKey: ['assets', 'transfers'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to reject transfer'),
  })
}

export function useAcknowledgeTransfer(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => acknowledgeTransfer(id),
    onSuccess: () => {
      toast.success('Transfer acknowledged')
      queryClient.invalidateQueries({ queryKey: ['assets', 'transfers'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to acknowledge transfer'),
  })
}

// ── Inspection mutations ──────────────────────────────────────────────────────

export function useCreateInspection(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createInspection(data),
    onSuccess: () => {
      toast.success('Inspection scheduled successfully')
      queryClient.invalidateQueries({ queryKey: ['assets', 'inspections'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to schedule inspection'),
  })
}

export function useStartInspection(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => startInspection(id),
    onSuccess: () => {
      toast.success('Inspection started')
      queryClient.invalidateQueries({ queryKey: ['assets', 'inspections'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to start inspection'),
  })
}

export function useCompleteInspection(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => completeInspection(id),
    onSuccess: () => {
      toast.success('Inspection completed and submitted for review')
      queryClient.invalidateQueries({ queryKey: ['assets', 'inspections'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to complete inspection'),
  })
}

export function useApproveInspectionReview(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveInspectionReview(id),
    onSuccess: () => {
      toast.success('Inspection review approved')
      queryClient.invalidateQueries({ queryKey: ['assets', 'inspections'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to approve review'),
  })
}

// ── Survey mutations ──────────────────────────────────────────────────────────

export function useCreateSurvey(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createSurvey(data),
    onSuccess: () => {
      toast.success('Survey scheduled successfully')
      queryClient.invalidateQueries({ queryKey: ['assets', 'surveys'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to create survey'),
  })
}

export function useStartSurvey(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => startSurvey(id),
    onSuccess: () => {
      toast.success('Survey started')
      queryClient.invalidateQueries({ queryKey: ['assets', 'surveys'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to start survey'),
  })
}

export function useCompleteSurvey(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => completeSurvey(id),
    onSuccess: () => {
      toast.success('Survey completed — reconciliation stage')
      queryClient.invalidateQueries({ queryKey: ['assets', 'surveys'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to complete survey'),
  })
}

export function useSubmitSurveyForApproval(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => submitSurveyForApproval(id),
    onSuccess: () => {
      toast.success('Survey submitted for approval')
      queryClient.invalidateQueries({ queryKey: ['assets', 'surveys'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to submit survey'),
  })
}

export function useApproveSurvey(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveSurvey(id),
    onSuccess: () => {
      toast.success('Survey approved')
      queryClient.invalidateQueries({ queryKey: ['assets', 'surveys'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to approve survey'),
  })
}

// ── Disposal mutations ────────────────────────────────────────────────────────

function disposalMutation(fn: (id: string) => Promise<void>, successMsg: string, errorMsg: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      toast.success(successMsg)
      queryClient.invalidateQueries({ queryKey: ['assets', 'disposals'] })
      onSuccess?.()
    },
    onError: () => toast.error(errorMsg),
  })
}

export function useCreateDisposal(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createDisposal(data),
    onSuccess: () => {
      toast.success('Disposal request created')
      queryClient.invalidateQueries({ queryKey: ['assets', 'disposals'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to create disposal request'),
  })
}

export function useSubmitDisposalForReview(onSuccess?: () => void) {
  return disposalMutation(submitDisposalForReview, 'Submitted for finance review', 'Failed to submit', onSuccess)
}

export function useApproveDisposalReview(onSuccess?: () => void) {
  return disposalMutation(approveDisposalReview, 'Finance review completed', 'Failed to complete review', onSuccess)
}

export function useApproveDisposal(onSuccess?: () => void) {
  return disposalMutation(approveDisposal, 'Disposal approved', 'Failed to approve disposal', onSuccess)
}

export function useRejectDisposal(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectDisposal(id, reason),
    onSuccess: () => {
      toast.success('Disposal rejected')
      queryClient.invalidateQueries({ queryKey: ['assets', 'disposals'] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to reject disposal'),
  })
}

export function useExecuteDisposal(onSuccess?: () => void) {
  return disposalMutation(executeDisposal, 'Disposal execution started', 'Failed to execute disposal', onSuccess)
}

export function useCompleteDisposal(onSuccess?: () => void) {
  return disposalMutation(completeDisposal, 'Disposal completed — assets locked', 'Failed to complete disposal', onSuccess)
}

// ── Digital signature mutation ────────────────────────────────────────────────

export function useSignRecord(type: SignRecordType, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role, signatoryName }: { id: string; role: string; signatoryName: string }) =>
      signRecord(type, id, role, signatoryName),
    onSuccess: () => {
      toast.success('Signature applied successfully')
      queryClient.invalidateQueries({ queryKey: ['assets', `${type}s`] })
      onSuccess?.()
    },
    onError: () => toast.error('Failed to apply signature'),
  })
}
