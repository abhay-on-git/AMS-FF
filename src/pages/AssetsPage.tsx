import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAssets } from '@/features/assets/hooks/useAssets'
import { useAssetFilters } from '@/features/assets/hooks/useAssetFilters'
import { useAssetSelection } from '@/features/assets/hooks/useAssetSelection'
import { AssetTabs } from '@/features/assets/components/AssetTabs'
import { AssetFilters } from '@/features/assets/components/AssetFilters'
import { AdvancedFilters } from '@/features/assets/components/AdvancedFilters'
import { AssetTable } from '@/features/assets/components/AssetTable'
import { BulkActions } from '@/features/assets/components/BulkActions'
import { AssetDetailView } from '@/features/assets/components/detail'
import { AssetFormDrawer, ChangeStatusDrawer, ChangeLocationDrawer, TransferAssetDrawer } from '@/features/assets/components/drawers'
import { defaultAssetColumns } from '@/features/assets/constants/assetColumns'
import type { ActiveTab, AssetColumnConfig, EnhancedAsset, ViewMode } from '@/features/assets/types'

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
  const [assetFormMode, setAssetFormMode] = useState<'add' | 'edit'>('add')
  const [changeStatusOpen, setChangeStatusOpen] = useState(false)
  const [changeLocationOpen, setChangeLocationOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)

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

  const handleBulkAction = (action: string) => {
    toast.info(`${action} ${selection.selectedCount} asset(s)`)
    selection.clearSelection()
  }

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading assets...</div>
  }

  return (
    <>
      {viewMode === 'detail' && selectedAsset ? (
        <AssetDetailView
          asset={selectedAsset}
          onBack={handleBackToList}
          onEdit={handleEdit}
          onChangeStatus={handleChangeStatus}
          onChangeLocation={handleChangeLocation}
          onTransferAsset={handleTransfer}
        />
      ) : (
        <div className="space-y-6 min-w-0">
          <div className="flex items-center justify-between">
            <AssetTabs activeTab={activeTab} onTabChange={setActiveTab} draftCount={0} />
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
                onTransfer={() => handleBulkAction('Transfer')}
                onInspection={() => handleBulkAction('Inspection')}
                onSurvey={() => handleBulkAction('Survey')}
                onDisposal={() => handleBulkAction('Disposal')}
                onChangeStatus={() => handleBulkAction('Change Status')}
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
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Draft Assets — coming soon
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Drawers — always mounted at page level */}
      <AssetFormDrawer
        open={assetFormOpen}
        onOpenChange={setAssetFormOpen}
        mode={assetFormMode}
        asset={selectedAsset}
      />
      <ChangeStatusDrawer open={changeStatusOpen} onOpenChange={setChangeStatusOpen} asset={selectedAsset} />
      <ChangeLocationDrawer open={changeLocationOpen} onOpenChange={setChangeLocationOpen} asset={selectedAsset} />
      <TransferAssetDrawer open={transferOpen} onOpenChange={setTransferOpen} asset={selectedAsset} />
    </>
  )
}
