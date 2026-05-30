import type { ActiveTab } from '../types'
import { useDrafts, useTransfers, useInspections, useSurveys, useDisposals } from '../hooks/useAssets'

interface AssetTabsProps {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
}

const tabs: { value: ActiveTab; label: string }[] = [
  { value: 'all',         label: 'Published Assets' },
  { value: 'drafts',      label: 'Draft Assets' },
  { value: 'transfers',   label: 'Asset Transfers' },
  { value: 'inspections', label: 'Asset Inspections' },
  { value: 'surveys',     label: 'Asset Surveys' },
  { value: 'disposals',   label: 'Asset Disposals' },
]

export function AssetTabs({ activeTab, onTabChange }: AssetTabsProps) {
  const { data: drafts      = [] } = useDrafts()
  const { data: transfers   = [] } = useTransfers()
  const { data: inspections = [] } = useInspections()
  const { data: surveys     = [] } = useSurveys()
  const { data: disposals   = [] } = useDisposals()
  const draftCount       = drafts.length
  const pendingTransfers = transfers.filter(
    (t) => t.status === 'pending-approval' || t.status === 'pending-custodian' || t.status === 'pending-acknowledgment'
  ).length
  const pendingInspections = inspections.filter(
    (i) => i.status === 'pending-review' || i.status === 'in-progress'
  ).length
  const pendingSurveys = surveys.filter(
    (s) => s.status === 'pending-approval' || s.status === 'in-progress' || s.status === 'reconciliation'
  ).length
  const pendingDisposals = disposals.filter(
    (d) => d.status === 'pending-review' || d.status === 'pending-approval' || d.status === 'approved' || d.status === 'in-progress'
  ).length

  return (
    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-4 py-2 rounded-[4px] text-[15px] transition-colors flex items-center gap-2 ${
            activeTab === tab.value
              ? 'bg-brand-navy text-white shadow-sm'
              : 'bg-transparent text-brand-navy'
          }`}
        >
          {tab.label}
          {tab.value === 'inspections' && pendingInspections > 0 && (
            <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-[4px] text-xs ${
              activeTab === 'inspections' ? 'bg-white/20 text-white' : 'bg-purple-500 text-white'
            }`}>
              {pendingInspections}
            </span>
          )}
          {tab.value === 'transfers' && pendingTransfers > 0 && (
            <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-[4px] text-xs ${
              activeTab === 'transfers' ? 'bg-white/20 text-white' : 'bg-amber-500 text-white'
            }`}>
              {pendingTransfers}
            </span>
          )}
          {tab.value === 'surveys' && pendingSurveys > 0 && (
            <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-[4px] text-xs ${
              activeTab === 'surveys' ? 'bg-white/20 text-white' : 'bg-orange-500 text-white'
            }`}>
              {pendingSurveys}
            </span>
          )}
          {tab.value === 'disposals' && pendingDisposals > 0 && (
            <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-[4px] text-xs ${
              activeTab === 'disposals' ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
            }`}>
              {pendingDisposals}
            </span>
          )}
          {tab.value === 'drafts' && draftCount > 0 && (
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-[4px] text-xs ${
                activeTab === 'drafts'
                  ? 'bg-white/20 text-white'
                  : 'bg-brand-navy text-white'
              }`}
            >
              {draftCount}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
