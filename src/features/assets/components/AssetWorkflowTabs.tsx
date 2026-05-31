import { lazy, Suspense } from 'react'
import {
  useApproveTransfer,
  useAcknowledgeTransfer,
  useStartInspection,
  useCompleteInspection,
  useApproveInspectionReview,
  useStartSurvey,
  useCompleteSurvey,
  useSubmitSurveyForApproval,
  useApproveSurvey,
  useSubmitDisposalForReview,
  useApproveDisposalReview,
  useApproveDisposal,
  useRejectDisposal,
  useExecuteDisposal,
  useCompleteDisposal,
} from '../hooks/useAssetMutations'
import type { ActiveTab } from '../types'
import type { DraftAsset } from '../types/draftTypes'
import type { TransferRequest } from '../types/transferTypes'

const DraftAssetsTab = lazy(() =>
  import('./DraftAssetsTab').then((m) => ({ default: m.DraftAssetsTab })),
)
const TransfersTab = lazy(() =>
  import('./TransfersTab').then((m) => ({ default: m.TransfersTab })),
)
const InspectionsTab = lazy(() =>
  import('./InspectionsTab').then((m) => ({ default: m.InspectionsTab })),
)
const SurveysTab = lazy(() =>
  import('./SurveysTab').then((m) => ({ default: m.SurveysTab })),
)
const DisposalsTab = lazy(() =>
  import('./DisposalsTab').then((m) => ({ default: m.DisposalsTab })),
)

interface AssetWorkflowTabsProps {
  activeTab: ActiveTab
  onRegisterFromDraft: (draft: DraftAsset) => void
  onViewTransfer: (id: string) => void
  onViewInspection: (id: string) => void
  onViewSurvey: (id: string) => void
  onViewDisposal: (id: string) => void
  onInitiateTransfer: () => void
  onScheduleInspection: () => void
  onCreateSurvey: () => void
  onCreateDisposal: () => void
}

export function AssetWorkflowTabs({
  activeTab,
  onRegisterFromDraft,
  onViewTransfer,
  onViewInspection,
  onViewSurvey,
  onViewDisposal,
  onInitiateTransfer,
  onScheduleInspection,
  onCreateSurvey,
  onCreateDisposal,
}: AssetWorkflowTabsProps) {
  const approveTransfer = useApproveTransfer()
  const ackTransfer = useAcknowledgeTransfer()
  const startInspection = useStartInspection()
  const completeInspection = useCompleteInspection()
  const approveReview = useApproveInspectionReview()
  const startSurvey = useStartSurvey()
  const completeSurvey = useCompleteSurvey()
  const submitSurvey = useSubmitSurveyForApproval()
  const approveSurvey = useApproveSurvey()
  const submitDisposalReview = useSubmitDisposalForReview()
  const approveDisposalReview = useApproveDisposalReview()
  const approveDisposal = useApproveDisposal()
  const executeDisposal = useExecuteDisposal()
  const completeDisposal = useCompleteDisposal()

  if (activeTab === 'all') return null

  return (
    <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Loading...</div>}>
      {activeTab === 'drafts' && (
        <DraftAssetsTab onRegister={onRegisterFromDraft} />
      )}

      {activeTab === 'inspections' && (
        <InspectionsTab
          onViewDetail={(ins) => onViewInspection(ins.id)}
          onSchedule={onScheduleInspection}
          onStart={(id) => startInspection.mutate(id)}
          onComplete={(id) => completeInspection.mutate(id)}
          onApproveReview={(id) => approveReview.mutate(id)}
        />
      )}

      {activeTab === 'transfers' && (
        <TransfersTab
          onViewDetail={(t) => onViewTransfer(t.id)}
          onInitiate={onInitiateTransfer}
          onApprove={(id) => approveTransfer.mutate(id)}
          onReject={(t: TransferRequest) => onViewTransfer(t.id)}
          onAcknowledge={(id) => ackTransfer.mutate(id)}
        />
      )}

      {activeTab === 'surveys' && (
        <SurveysTab
          onViewDetail={(s) => onViewSurvey(s.id)}
          onCreateSurvey={onCreateSurvey}
          onStart={(id) => startSurvey.mutate(id)}
          onComplete={(id) => completeSurvey.mutate(id)}
          onSubmit={(id) => submitSurvey.mutate(id)}
          onApprove={(id) => approveSurvey.mutate(id)}
        />
      )}

      {activeTab === 'disposals' && (
        <DisposalsTab
          onViewDetail={(d) => onViewDisposal(d.id)}
          onCreateDisposal={onCreateDisposal}
          onSubmitReview={(id) => submitDisposalReview.mutate(id)}
          onApproveReview={(id) => approveDisposalReview.mutate(id)}
          onApprove={(id) => approveDisposal.mutate(id)}
          onReject={(d) => onViewDisposal(d.id)}
          onExecute={(id) => executeDisposal.mutate(id)}
          onComplete={(id) => completeDisposal.mutate(id)}
        />
      )}
    </Suspense>
  )
}
