import { lazy, Suspense, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RouteLoading } from '@/components/shared/RouteLoading'
import { useAssets } from '@/features/assets/hooks/useAssets'
import { useAssetFilters } from '@/features/assets/hooks/useAssetFilters'
import { useAssetSelection } from '@/features/assets/hooks/useAssetSelection'
import { AssetTabs } from '@/features/assets/components/AssetTabs'
import { AssetFilters } from '@/features/assets/components/AssetFilters'
import { AdvancedFilters } from '@/features/assets/components/AdvancedFilters'
import { AssetTable } from '@/features/assets/components/AssetTable'
import { BulkActions } from '@/features/assets/components/BulkActions'
import { AssetsPageDrawers } from '@/features/assets/components/AssetsPageDrawers'
import { AssetWorkflowTabs } from '@/features/assets/components/AssetWorkflowTabs'
import { defaultAssetColumns } from '@/features/assets/constants/assetColumns'
import type { ActiveTab, AssetColumnConfig, EnhancedAsset, ViewMode } from '@/features/assets/types'
import type { DraftAsset } from '@/features/assets/types/draftTypes'

const AssetDetailView = lazy(() =>
  import('@/features/assets/components/detail/AssetDetailView').then((m) => ({ default: m.AssetDetailView })),
)
const TransferDetailView = lazy(() =>
  import('@/features/assets/components/detail/TransferDetailView').then((m) => ({ default: m.TransferDetailView })),
)
const InspectionDetailView = lazy(() =>
  import('@/features/assets/components/detail/InspectionDetailView').then((m) => ({ default: m.InspectionDetailView })),
)
const SurveyDetailView = lazy(() =>
  import('@/features/assets/components/detail/SurveyDetailView').then((m) => ({ default: m.SurveyDetailView })),
)
const DisposalDetailView = lazy(() =>
  import('@/features/assets/components/detail/DisposalDetailView').then((m) => ({ default: m.DisposalDetailView })),
)

export default function AssetsPage() {
  const { data: assets = [], isLoading } = useAssets()
  const filters = useAssetFilters(assets)
  const filteredAssetIds = useMemo(
    () => filters.filteredAssets.map((a) => a.id),
    [filters.filteredAssets],
  )
  const selection = useAssetSelection(filteredAssetIds)

  const [activeTab, setActiveTab] = useState<ActiveTab>('all')
  const [columns, setColumns] = useState<AssetColumnConfig[]>(defaultAssetColumns)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedAsset, setSelectedAsset] = useState<EnhancedAsset | null>(null)

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

  const [initiateTransferOpen, setInitiateTransferOpen] = useState(false)
  const [scheduleInspectionOpen, setScheduleInspectionOpen] = useState(false)
  const [createSurveyOpen, setCreateSurveyOpen] = useState(false)
  const [createDisposalOpen, setCreateDisposalOpen] = useState(false)

  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null)
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null)
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null)
  const [selectedDisposalId, setSelectedDisposalId] = useState<string | null>(null)

  const selectedAssetIds = useMemo(
    () => Array.from(selection.selectedIds),
    [selection.selectedIds],
  )

  const anyDrawerOpen =
    assetFormOpen ||
    changeStatusOpen ||
    changeLocationOpen ||
    transferOpen ||
    bulkTransferOpen ||
    bulkInspectionOpen ||
    bulkSurveyOpen ||
    bulkDisposalOpen ||
    bulkChangeStatusOpen ||
    initiateTransferOpen ||
    scheduleInspectionOpen ||
    createSurveyOpen ||
    createDisposalOpen

  const drawerProps = {
    assetFormOpen,
    onAssetFormOpenChange: setAssetFormOpen,
    assetFormMode,
    selectedAsset,
    selectedDraft,
    changeStatusOpen,
    onChangeStatusOpenChange: setChangeStatusOpen,
    changeLocationOpen,
    onChangeLocationOpenChange: setChangeLocationOpen,
    transferOpen,
    onTransferOpenChange: setTransferOpen,
    bulkTransferOpen,
    onBulkTransferOpenChange: setBulkTransferOpen,
    bulkTransferAssetIds: selectedAssetIds,
    onClearSelection: selection.clearSelection,
    bulkInspectionOpen,
    onBulkInspectionOpenChange: setBulkInspectionOpen,
    bulkInspectionAssetIds: selectedAssetIds,
    bulkSurveyOpen,
    onBulkSurveyOpenChange: setBulkSurveyOpen,
    bulkSurveyAssetIds: selectedAssetIds,
    bulkDisposalOpen,
    onBulkDisposalOpenChange: setBulkDisposalOpen,
    bulkDisposalAssetIds: selectedAssetIds,
    bulkChangeStatusOpen,
    onBulkChangeStatusOpenChange: setBulkChangeStatusOpen,
    bulkChangeStatusAssetIds: selectedAssetIds,
    initiateTransferOpen,
    onInitiateTransferOpenChange: setInitiateTransferOpen,
    scheduleInspectionOpen,
    onScheduleInspectionOpenChange: setScheduleInspectionOpen,
    createSurveyOpen,
    onCreateSurveyOpenChange: setCreateSurveyOpen,
    createDisposalOpen,
    onCreateDisposalOpenChange: setCreateDisposalOpen,
  }

  const toggleColumn = (key: string) => {
    setColumns((prev) => prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)))
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

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedAsset(null)
  }

  const handleRegisterFromDraft = (draft: DraftAsset) => {
    setSelectedDraft(draft)
    setAssetFormMode('draft')
    setAssetFormOpen(true)
  }

  if (isLoading) {
    return <RouteLoading />
  }

  if (viewMode === 'detail' && selectedAsset) {
    return (
      <>
        <Suspense fallback={<RouteLoading />}>
          <AssetDetailView
            asset={selectedAsset}
            onBack={handleBackToList}
            onEdit={handleEdit}
            onChangeStatus={() => setChangeStatusOpen(true)}
            onChangeLocation={() => setChangeLocationOpen(true)}
            onTransferAsset={() => setTransferOpen(true)}
          />
        </Suspense>
        {anyDrawerOpen && <AssetsPageDrawers {...drawerProps} />}
      </>
    )
  }

  if (selectedTransferId) {
    return (
      <Suspense fallback={<RouteLoading />}>
        <TransferDetailView
          id={selectedTransferId}
          onBack={() => setSelectedTransferId(null)}
        />
      </Suspense>
    )
  }

  if (selectedInspectionId) {
    return (
      <Suspense fallback={<RouteLoading />}>
        <InspectionDetailView
          id={selectedInspectionId}
          onBack={() => setSelectedInspectionId(null)}
        />
      </Suspense>
    )
  }

  if (selectedSurveyId) {
    return (
      <Suspense fallback={<RouteLoading />}>
        <SurveyDetailView
          id={selectedSurveyId}
          onBack={() => setSelectedSurveyId(null)}
        />
      </Suspense>
    )
  }

  if (selectedDisposalId) {
    return (
      <Suspense fallback={<RouteLoading />}>
        <DisposalDetailView
          id={selectedDisposalId}
          onBack={() => setSelectedDisposalId(null)}
        />
      </Suspense>
    )
  }

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
              onTransfer={() => setBulkTransferOpen(true)}
              onInspection={() => setBulkInspectionOpen(true)}
              onSurvey={() => setBulkSurveyOpen(true)}
              onDisposal={() => setBulkDisposalOpen(true)}
              onChangeStatus={() => setBulkChangeStatusOpen(true)}
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

        <AssetWorkflowTabs
          activeTab={activeTab}
          onRegisterFromDraft={handleRegisterFromDraft}
          onViewTransfer={setSelectedTransferId}
          onViewInspection={setSelectedInspectionId}
          onViewSurvey={setSelectedSurveyId}
          onViewDisposal={setSelectedDisposalId}
          onInitiateTransfer={() => setInitiateTransferOpen(true)}
          onScheduleInspection={() => setScheduleInspectionOpen(true)}
          onCreateSurvey={() => setCreateSurveyOpen(true)}
          onCreateDisposal={() => setCreateDisposalOpen(true)}
        />
      </div>

      {anyDrawerOpen && <AssetsPageDrawers {...drawerProps} />}
    </>
  )
}
