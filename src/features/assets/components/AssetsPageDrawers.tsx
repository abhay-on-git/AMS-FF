import { lazy, Suspense } from 'react'
import type { EnhancedAsset } from '../types'
import type { DraftAsset } from '../types/draftTypes'

const AssetFormDrawer = lazy(() =>
  import('./drawers/AssetFormDrawer').then((m) => ({ default: m.AssetFormDrawer })),
)
const ChangeStatusDrawer = lazy(() =>
  import('./drawers/ChangeStatusDrawer').then((m) => ({ default: m.ChangeStatusDrawer })),
)
const ChangeLocationDrawer = lazy(() =>
  import('./drawers/ChangeLocationDrawer').then((m) => ({ default: m.ChangeLocationDrawer })),
)
const TransferAssetDrawer = lazy(() =>
  import('./drawers/TransferAssetDrawer').then((m) => ({ default: m.TransferAssetDrawer })),
)
const BulkTransferDrawer = lazy(() =>
  import('./drawers/BulkTransferDrawer').then((m) => ({ default: m.BulkTransferDrawer })),
)
const BulkInspectionDrawer = lazy(() =>
  import('./drawers/BulkInspectionDrawer').then((m) => ({ default: m.BulkInspectionDrawer })),
)
const BulkSurveyDrawer = lazy(() =>
  import('./drawers/BulkSurveyDrawer').then((m) => ({ default: m.BulkSurveyDrawer })),
)
const BulkDisposalDrawer = lazy(() =>
  import('./drawers/BulkDisposalDrawer').then((m) => ({ default: m.BulkDisposalDrawer })),
)
const BulkChangeStatusDrawer = lazy(() =>
  import('./drawers/BulkChangeStatusDrawer').then((m) => ({ default: m.BulkChangeStatusDrawer })),
)
const InitiateTransferDrawer = lazy(() =>
  import('./drawers/InitiateTransferDrawer').then((m) => ({ default: m.InitiateTransferDrawer })),
)
const CreateInspectionDrawer = lazy(() =>
  import('./drawers/CreateInspectionDrawer').then((m) => ({ default: m.CreateInspectionDrawer })),
)
const CreateSurveyDrawer = lazy(() =>
  import('./drawers/CreateSurveyDrawer').then((m) => ({ default: m.CreateSurveyDrawer })),
)
const CreateDisposalDrawer = lazy(() =>
  import('./drawers/CreateDisposalDrawer').then((m) => ({ default: m.CreateDisposalDrawer })),
)

export interface AssetsPageDrawersProps {
  assetFormOpen: boolean
  onAssetFormOpenChange: (open: boolean) => void
  assetFormMode: 'add' | 'edit' | 'draft'
  selectedAsset: EnhancedAsset | null
  selectedDraft: DraftAsset | null

  changeStatusOpen: boolean
  onChangeStatusOpenChange: (open: boolean) => void

  changeLocationOpen: boolean
  onChangeLocationOpenChange: (open: boolean) => void

  transferOpen: boolean
  onTransferOpenChange: (open: boolean) => void

  bulkTransferOpen: boolean
  onBulkTransferOpenChange: (open: boolean) => void
  bulkTransferAssetIds: string[]
  onClearSelection: () => void

  bulkInspectionOpen: boolean
  onBulkInspectionOpenChange: (open: boolean) => void
  bulkInspectionAssetIds: string[]

  bulkSurveyOpen: boolean
  onBulkSurveyOpenChange: (open: boolean) => void
  bulkSurveyAssetIds: string[]

  bulkDisposalOpen: boolean
  onBulkDisposalOpenChange: (open: boolean) => void
  bulkDisposalAssetIds: string[]

  bulkChangeStatusOpen: boolean
  onBulkChangeStatusOpenChange: (open: boolean) => void
  bulkChangeStatusAssetIds: string[]

  initiateTransferOpen: boolean
  onInitiateTransferOpenChange: (open: boolean) => void

  scheduleInspectionOpen: boolean
  onScheduleInspectionOpenChange: (open: boolean) => void

  createSurveyOpen: boolean
  onCreateSurveyOpenChange: (open: boolean) => void

  createDisposalOpen: boolean
  onCreateDisposalOpenChange: (open: boolean) => void
}

export function AssetsPageDrawers(props: AssetsPageDrawersProps) {
  const {
    assetFormOpen,
    onAssetFormOpenChange,
    assetFormMode,
    selectedAsset,
    selectedDraft,
    changeStatusOpen,
    onChangeStatusOpenChange,
    changeLocationOpen,
    onChangeLocationOpenChange,
    transferOpen,
    onTransferOpenChange,
    bulkTransferOpen,
    onBulkTransferOpenChange,
    bulkTransferAssetIds,
    onClearSelection,
    bulkInspectionOpen,
    onBulkInspectionOpenChange,
    bulkInspectionAssetIds,
    bulkSurveyOpen,
    onBulkSurveyOpenChange,
    bulkSurveyAssetIds,
    bulkDisposalOpen,
    onBulkDisposalOpenChange,
    bulkDisposalAssetIds,
    bulkChangeStatusOpen,
    onBulkChangeStatusOpenChange,
    bulkChangeStatusAssetIds,
    initiateTransferOpen,
    onInitiateTransferOpenChange,
    scheduleInspectionOpen,
    onScheduleInspectionOpenChange,
    createSurveyOpen,
    onCreateSurveyOpenChange,
    createDisposalOpen,
    onCreateDisposalOpenChange,
  } = props

  return (
    <Suspense fallback={null}>
      {assetFormOpen && (
        <AssetFormDrawer
          open={assetFormOpen}
          onOpenChange={onAssetFormOpenChange}
          mode={assetFormMode}
          asset={selectedAsset}
          draft={selectedDraft}
        />
      )}
      {changeStatusOpen && (
        <ChangeStatusDrawer
          open={changeStatusOpen}
          onOpenChange={onChangeStatusOpenChange}
          asset={selectedAsset}
        />
      )}
      {changeLocationOpen && (
        <ChangeLocationDrawer
          open={changeLocationOpen}
          onOpenChange={onChangeLocationOpenChange}
          asset={selectedAsset}
        />
      )}
      {transferOpen && (
        <TransferAssetDrawer
          open={transferOpen}
          onOpenChange={onTransferOpenChange}
          asset={selectedAsset}
        />
      )}
      {bulkTransferOpen && (
        <BulkTransferDrawer
          open={bulkTransferOpen}
          onOpenChange={onBulkTransferOpenChange}
          assetIds={bulkTransferAssetIds}
          onClearSelection={onClearSelection}
        />
      )}
      {bulkInspectionOpen && (
        <BulkInspectionDrawer
          open={bulkInspectionOpen}
          onOpenChange={onBulkInspectionOpenChange}
          assetIds={bulkInspectionAssetIds}
          onClearSelection={onClearSelection}
        />
      )}
      {bulkSurveyOpen && (
        <BulkSurveyDrawer
          open={bulkSurveyOpen}
          onOpenChange={onBulkSurveyOpenChange}
          assetIds={bulkSurveyAssetIds}
          onClearSelection={onClearSelection}
        />
      )}
      {bulkDisposalOpen && (
        <BulkDisposalDrawer
          open={bulkDisposalOpen}
          onOpenChange={onBulkDisposalOpenChange}
          assetIds={bulkDisposalAssetIds}
          onClearSelection={onClearSelection}
        />
      )}
      {bulkChangeStatusOpen && (
        <BulkChangeStatusDrawer
          open={bulkChangeStatusOpen}
          onOpenChange={onBulkChangeStatusOpenChange}
          assetIds={bulkChangeStatusAssetIds}
          onClearSelection={onClearSelection}
        />
      )}
      {initiateTransferOpen && (
        <InitiateTransferDrawer
          open={initiateTransferOpen}
          onOpenChange={onInitiateTransferOpenChange}
        />
      )}
      {scheduleInspectionOpen && (
        <CreateInspectionDrawer
          open={scheduleInspectionOpen}
          onOpenChange={onScheduleInspectionOpenChange}
        />
      )}
      {createSurveyOpen && (
        <CreateSurveyDrawer
          open={createSurveyOpen}
          onOpenChange={onCreateSurveyOpenChange}
        />
      )}
      {createDisposalOpen && (
        <CreateDisposalDrawer
          open={createDisposalOpen}
          onOpenChange={onCreateDisposalOpenChange}
        />
      )}
    </Suspense>
  )
}
