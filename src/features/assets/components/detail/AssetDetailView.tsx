import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ChevronLeft, Pencil, Lock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { EnhancedAsset, DetailTab, UserRole } from '../../types'
import { mockAuditEvents, mockLifecycleEvents } from '../../services/mockDetailData'
import { OverviewTab } from './OverviewTab'
import { LifecycleTab } from './LifecycleTab'
import { HistoryTab } from './HistoryTab'

interface AssetDetailViewProps {
  asset: EnhancedAsset
  onBack: () => void
  userRole?: UserRole
  onEdit: (asset: EnhancedAsset) => void
  onChangeStatus: () => void
  onChangeLocation: () => void
  onTransferAsset: () => void
}

const tabs: { key: DetailTab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'lifecycle', label: 'Lifecycle' },
  { key: 'history', label: 'History & Audit' },
]

export function AssetDetailView({
  asset,
  onBack,
  userRole = 'admin',
  onEdit,
  onChangeStatus,
  onChangeLocation,
  onTransferAsset,
}: AssetDetailViewProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')

  return (
    <div className="space-y-5 min-w-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[15px] mb-2">
            <button onClick={onBack} className="text-muted-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={onBack} className="text-muted-foreground transition-colors">
              Assets
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{asset.assetId}</span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{asset.name}</h2>
            {asset.isLocked && (
              <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700 text-sm">
                <Lock className="w-3 h-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {userRole !== 'auditor' && userRole !== 'senior_management' && (
            <Button variant="outline" className="gap-1.5 text-[15px]" onClick={() => onEdit(asset)}>
              <Pencil className="w-4 h-4" /> Edit
            </Button>
          )}
        </div>
      </div>

      {/* Lock Banner */}
      {asset.isLocked && asset.activeSurveyCaseId && (
        <Alert className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-900/10">
          <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="flex items-center justify-between text-amber-900 dark:text-amber-100">
            <div>
              <p className="font-medium">
                Asset Locked — {asset.lockReason || 'Active survey case in progress'}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Survey Case: <span className="font-['Manrope']">{asset.activeSurveyCaseId}</span>
                {' '}· No modifications permitted until the case is resolved.
              </p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1.5 text-amber-700 dark:text-amber-300">
              View Survey Case
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-1.5 rounded-[4px] text-[15px] transition-colors',
              activeTab === tab.key
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-foreground hover:bg-muted'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab
          asset={asset}
          userRole={userRole}
          onChangeLocation={onChangeLocation}
          onUpdateStatus={onChangeStatus}
          onTransferAsset={onTransferAsset}
        />
      )}
      {activeTab === 'lifecycle' && (
        <LifecycleTab
          asset={asset}
          events={mockLifecycleEvents}
          userRole={userRole}
          onChangeStatus={onChangeStatus}
        />
      )}
      {activeTab === 'history' && (
        <HistoryTab events={mockAuditEvents} />
      )}
    </div>
  )
}
