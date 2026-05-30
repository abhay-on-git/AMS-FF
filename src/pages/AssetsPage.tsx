import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAssets } from '@/features/assets/hooks/useAssets'
import { DraftAssetsTab } from '@/features/assets/components/DraftAssetsTab'
import { TransfersTab } from '@/features/assets/components/TransfersTab'
import { InspectionsTab } from '@/features/assets/components/InspectionsTab'
import { SurveysTab } from '@/features/assets/components/SurveysTab'
import { DisposalsTab } from '@/features/assets/components/DisposalsTab'
import { useAssetFilters } from '@/features/assets/hooks/useAssetFilters'
import { useAssetSelection } from '@/features/assets/hooks/useAssetSelection'
import { AssetTabs } from '@/features/assets/components/AssetTabs'
import { AssetFilters } from '@/features/assets/components/AssetFilters'
import { AdvancedFilters } from '@/features/assets/components/AdvancedFilters'
import { AssetTable } from '@/features/assets/components/AssetTable'
import { BulkActions } from '@/features/assets/components/BulkActions'
import { AssetDetailView } from '@/features/assets/components/detail'
import { TransferDetailView } from '@/features/assets/components/detail/TransferDetailView'
import { InspectionDetailView } from '@/features/assets/components/detail/InspectionDetailView'
import { SurveyDetailView } from '@/features/assets/components/detail/SurveyDetailView'
import { DisposalDetailView } from '@/features/assets/components/detail/DisposalDetailView'
import {
  AssetFormDrawer,
  ChangeStatusDrawer,
  ChangeLocationDrawer,
  TransferAssetDrawer,
  BulkTransferDrawer,
  BulkInspectionDrawer,
  BulkSurveyDrawer,
  BulkDisposalDrawer,
  BulkChangeStatusDrawer,
  InitiateTransferDrawer,
  CreateInspectionDrawer,
  CreateSurveyDrawer,
  CreateDisposalDrawer,
} from '@/features/assets/components/drawers'
import {
  useApproveTransfer,
  useRejectTransfer,
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
} from '@/features/assets/hooks/useAssetMutations'
import { defaultAssetColumns } from '@/features/assets/constants/assetColumns'
import type { ActiveTab, AssetColumnConfig, EnhancedAsset, ViewMode } from '@/features/assets/types'
import type { DraftAsset } from '@/features/assets/types/draftTypes'
import type { TransferRequest } from '@/features/assets/types/transferTypes'

export default function AssetsPage() {
  const { data: assets = [], isLoading } = useAssets()
  const filters = useAssetFilters(assets)
  const selection = useAssetSelection(filters.filteredAssets.map((a) => a.id))

  const [activeTab, setActiveTab] = useState<ActiveTab>('all')
  const [columns, setColumns] = useState<AssetColumnConfig[]>(defaultAssetColumns)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedAsset, setSelectedAsset] = useState<EnhancedAsset | null>(null)

  // Drawer states
  const [assetFormOpen, setAssetFormOpen] = useState(false)
  const [assetFormMode, setAssetFormMode] = useState<'add' | 'edit' | 'draft'>('add')
  const [changeStatusOpen, setChangeStatusOpen] = useState(false)
  const [changeLocationOpen, setChangeLocationOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [bulkTransferOpen, setBulkTransferOpen] = useState(false)
  const [bulkInspectionOpen, setBulkInspectionOpen] = useState(false)
  const [bulkSurveyOpen, setBulkSurveyOpen] = useState(false)
  const [bulkDisposalOpen, setBulkDisposalOpen] = useState(false)
  const [bulkChangeStatusOpen, setBulkChangeStatusOpen] = useState(false)
  const [selectedDraft, setSelectedDraft] = useState<DraftAsset | null>(null)

  // Workflow creation drawers
  const [initiateTransferOpen, setInitiateTransferOpen] = useState(false)
  const [scheduleInspectionOpen, setScheduleInspectionOpen] = useState(false)
  const [createSurveyOpen, setCreateSurveyOpen] = useState(false)
  const [createDisposalOpen, setCreateDisposalOpen] = useState(false)

  // Full-page workflow detail view IDs (null = list mode)
  const [selectedTransferId,   setSelectedTransferId]   = useState<string | null>(null)
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null)
  const [selectedSurveyId,     setSelectedSurveyId]     = useState<string | null>(null)
  const [selectedDisposalId,   setSelectedDisposalId]   = useState<string | null>(null)

  // Quick-action mutations (used by row actions in tab list views)
  const approveTransfer       = useApproveTransfer()
  const rejectTransfer        = useRejectTransfer()
  const ackTransfer           = useAcknowledgeTransfer()
  const startInspection       = useStartInspection()
  const completeInspection    = useCompleteInspection()
  const approveReview         = useApproveInspectionReview()
  const startSurvey           = useStartSurvey()
  const completeSurvey        = useCompleteSurvey()
  const submitSurvey          = useSubmitSurveyForApproval()
  const approveSurvey         = useApproveSurvey()
  const submitDisposalReview  = useSubmitDisposalForReview()
  const approveDisposalReview = useApproveDisposalReview()
  const approveDisposal       = useApproveDisposal()
  const rejectDisposal        = useRejectDisposal()
  const executeDisposal       = useExecuteDisposal()
  const completeDisposal      = useCompleteDisposal()

  const toggleColumn = (key: string) => {
    setColumns((prev) => prev.map((c) => c.key === key ? { ...c, visible: !c.visible } : c))
  }

  const handleViewDetail = (asset: EnhancedAsset) => {
    setSelectedAsset(asset)
    setViewMode('detail')
  }

  const handleEdit = (asset: EnhancedAsset) => {
    setSelectedAsset(asset)
    setAssetFormMode('edit')
    setAssetFormOpen(true)
  }

  const handleRegister = () => {
    setSelectedAsset(null)
    setAssetFormMode('add')
    setAssetFormOpen(true)
  }

  const handleChangeStatus = () => setChangeStatusOpen(true)
  const handleChangeLocation = () => setChangeLocationOpen(true)
  const handleTransfer = () => setTransferOpen(true)

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedAsset(null)
  }

  const handleBulkTransfer = () => setBulkTransferOpen(true)
  const handleBulkInspection = () => setBulkInspectionOpen(true)
  const handleBulkSurvey = () => setBulkSurveyOpen(true)
  const handleBulkDisposal = () => setBulkDisposalOpen(true)
  const handleBulkChangeStatus = () => setBulkChangeStatusOpen(true)

  const handleRegisterFromDraft = (draft: DraftAsset) => {
    setSelectedDraft(draft)
    setAssetFormMode('draft')
    setAssetFormOpen(true)
  }

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading assets...</div>
  }

  // ── Full-page detail views (replace entire page content) ──────────────────
  if (viewMode === 'detail' && selectedAsset) {
    return (
      <>
        <AssetDetailView
          asset={selectedAsset}
          onBack={handleBackToList}
          onEdit={handleEdit}
          onChangeStatus={handleChangeStatus}
          onChangeLocation={handleChangeLocation}
          onTransferAsset={handleTransfer}
        />
        <ChangeStatusDrawer open={changeStatusOpen} onOpenChange={setChangeStatusOpen} asset={selectedAsset} />
        <ChangeLocationDrawer open={changeLocationOpen} onOpenChange={setChangeLocationOpen} asset={selectedAsset} />
        <TransferAssetDrawer open={transferOpen} onOpenChange={setTransferOpen} asset={selectedAsset} />
        <AssetFormDrawer
          open={assetFormOpen}
          onOpenChange={setAssetFormOpen}
          mode={assetFormMode}
          asset={selectedAsset}
          draft={selectedDraft}
        />
      </>
    )
  }

  if (selectedTransferId) {
    return (
      <TransferDetailView
        id={selectedTransferId}
        onBack={() => setSelectedTransferId(null)}
      />
    )
  }

  if (selectedInspectionId) {
    return (
      <InspectionDetailView
        id={selectedInspectionId}
        onBack={() => setSelectedInspectionId(null)}
      />
    )
  }

  if (selectedSurveyId) {
    return (
      <SurveyDetailView
        id={selectedSurveyId}
        onBack={() => setSelectedSurveyId(null)}
      />
    )
  }

  if (selectedDisposalId) {
    return (
      <DisposalDetailView
        id={selectedDisposalId}
        onBack={() => setSelectedDisposalId(null)}
      />
    )
  }

  // ── List view ─────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-6 min-w-0">
        <div className="flex items-center justify-between">
          <AssetTabs activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === 'all' && (
            <Button onClick={handleRegister} className="text-[15px] bg-brand-navy hover:bg-brand-navy-mid text-white">
              Register Asset
            </Button>
          )}
        </div>

        {activeTab === 'all' && (
          <>
            <AdvancedFilters
              filters={filters.advancedFilters}
              onFiltersChange={filters.setAdvancedFilters}
              onClearAll={filters.clearAllFilters}
            />
            <BulkActions
              selectedCount={selection.selectedCount}
              onClearSelection={selection.clearSelection}
              onTransfer={handleBulkTransfer}
              onInspection={handleBulkInspection}
              onSurvey={handleBulkSurvey}
              onDisposal={handleBulkDisposal}
              onChangeStatus={handleBulkChangeStatus}
            />
            <Card>
              <CardHeader>
                <AssetFilters
                  search={filters.search}
                  onSearchChange={filters.setSearch}
                  typeFilter={filters.typeFilter}
                  onTypeChange={filters.setTypeFilter}
                  conditionFilter={filters.conditionFilter}
                  onConditionChange={filters.setConditionFilter}
                  locationFilter={filters.locationFilter}
                  onLocationChange={filters.setLocationFilter}
                  classificationFilter={filters.classificationFilter}
                  onClassificationChange={filters.setClassificationFilter}
                  columns={columns}
                  onToggleColumn={toggleColumn}
                />
              </CardHeader>
              <CardContent>
                <AssetTable
                  assets={filters.filteredAssets}
                  columns={columns}
                  onViewDetail={handleViewDetail}
                  onEdit={handleEdit}
                />
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'drafts' && (
          <DraftAssetsTab onRegister={handleRegisterFromDraft} />
        )}

        {activeTab === 'inspections' && (
          <InspectionsTab
            onViewDetail={(ins) => setSelectedInspectionId(ins.id)}
            onSchedule={() => setScheduleInspectionOpen(true)}
            onStart={(id) => startInspection.mutate(id)}
            onComplete={(id) => completeInspection.mutate(id)}
            onApproveReview={(id) => approveReview.mutate(id)}
          />
        )}

        {activeTab === 'transfers' && (
          <TransfersTab
            onViewDetail={(t) => setSelectedTransferId(t.id)}
            onInitiate={() => setInitiateTransferOpen(true)}
            onApprove={(id) => approveTransfer.mutate(id)}
            onReject={(t: TransferRequest) => setSelectedTransferId(t.id)}
            onAcknowledge={(id) => ackTransfer.mutate(id)}
          />
        )}

        {activeTab === 'surveys' && (
          <SurveysTab
            onViewDetail={(s) => setSelectedSurveyId(s.id)}
            onCreateSurvey={() => setCreateSurveyOpen(true)}
            onStart={(id) => startSurvey.mutate(id)}
            onComplete={(id) => completeSurvey.mutate(id)}
            onSubmit={(id) => submitSurvey.mutate(id)}
            onApprove={(id) => approveSurvey.mutate(id)}
          />
        )}

        {activeTab === 'disposals' && (
          <DisposalsTab
            onViewDetail={(d) => setSelectedDisposalId(d.id)}
            onCreateDisposal={() => setCreateDisposalOpen(true)}
            onSubmitReview={(id) => submitDisposalReview.mutate(id)}
            onApproveReview={(id) => approveDisposalReview.mutate(id)}
            onApprove={(id) => approveDisposal.mutate(id)}
            onReject={(d) => setSelectedDisposalId(d.id)}
            onExecute={(id) => executeDisposal.mutate(id)}
            onComplete={(id) => completeDisposal.mutate(id)}
          />
        )}
      </div>

      {/* Page-level drawers */}
      <AssetFormDrawer
        open={assetFormOpen}
        onOpenChange={setAssetFormOpen}
        mode={assetFormMode}
        asset={selectedAsset}
        draft={selectedDraft}
      />
      <ChangeStatusDrawer open={changeStatusOpen} onOpenChange={setChangeStatusOpen} asset={selectedAsset} />
      <ChangeLocationDrawer open={changeLocationOpen} onOpenChange={setChangeLocationOpen} asset={selectedAsset} />
      <TransferAssetDrawer open={transferOpen} onOpenChange={setTransferOpen} asset={selectedAsset} />
      <BulkTransferDrawer
        open={bulkTransferOpen}
        onOpenChange={setBulkTransferOpen}
        assetIds={Array.from(selection.selectedIds)}
        onClearSelection={selection.clearSelection}
      />
      <BulkInspectionDrawer
        open={bulkInspectionOpen}
        onOpenChange={setBulkInspectionOpen}
        assetIds={Array.from(selection.selectedIds)}
        onClearSelection={selection.clearSelection}
      />
      <BulkSurveyDrawer
        open={bulkSurveyOpen}
        onOpenChange={setBulkSurveyOpen}
        assetIds={Array.from(selection.selectedIds)}
        onClearSelection={selection.clearSelection}
      />
      <BulkDisposalDrawer
        open={bulkDisposalOpen}
        onOpenChange={setBulkDisposalOpen}
        assetIds={Array.from(selection.selectedIds)}
        onClearSelection={selection.clearSelection}
      />
      <BulkChangeStatusDrawer
        open={bulkChangeStatusOpen}
        onOpenChange={setBulkChangeStatusOpen}
        assetIds={Array.from(selection.selectedIds)}
        onClearSelection={selection.clearSelection}
      />
      <InitiateTransferDrawer
        open={initiateTransferOpen}
        onOpenChange={setInitiateTransferOpen}
      />
      <CreateInspectionDrawer
        open={scheduleInspectionOpen}
        onOpenChange={setScheduleInspectionOpen}
      />
      <CreateSurveyDrawer
        open={createSurveyOpen}
        onOpenChange={setCreateSurveyOpen}
      />
      <CreateDisposalDrawer
        open={createDisposalOpen}
        onOpenChange={setCreateDisposalOpen}
      />
    </>
  )
}
