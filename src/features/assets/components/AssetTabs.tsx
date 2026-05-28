import type { ActiveTab } from '../types'

interface AssetTabsProps {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
  draftCount?: number
}

const tabs: { value: ActiveTab; label: string }[] = [
  { value: 'all', label: 'Published Assets' },
  { value: 'drafts', label: 'Draft Assets' },
]

export function AssetTabs({ activeTab, onTabChange, draftCount }: AssetTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
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
          {tab.value === 'drafts' && draftCount !== undefined && draftCount > 0 && (
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
