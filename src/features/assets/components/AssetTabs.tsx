import { SubNavTabs } from '@/components/shared'
import type { SubNavTab } from '@/components/shared'
import type { ActiveTab } from '../types'
import { useDrafts, useTransfers, useInspections, useSurveys, useDisposals } from '../hooks/useAssets'

interface AssetTabsProps {
  activeTab:   ActiveTab
  onTabChange: (tab: ActiveTab) => void
}

export function AssetTabs({ activeTab, onTabChange }: AssetTabsProps) {
  const { data: drafts      = [] } = useDrafts()
  const { data: transfers   = [] } = useTransfers()
  const { data: inspections = [] } = useInspections()
  const { data: surveys     = [] } = useSurveys()
  const { data: disposals   = [] } = useDisposals()

  const tabs: SubNavTab[] = [
    { id: 'all',         label: 'Published Assets' },
    { id: 'drafts',      label: 'Draft Assets',      badge: drafts.length,                                                                                                                         badgeColor: 'bg-brand-navy text-white' },
    { id: 'transfers',   label: 'Asset Transfers',   badge: transfers.filter((t)   => ['pending-approval','pending-custodian','pending-acknowledgment'].includes(t.status)).length,                badgeColor: 'bg-amber-500 text-white'  },
    { id: 'inspections', label: 'Asset Inspections', badge: inspections.filter((i) => ['pending-review','in-progress'].includes(i.status)).length,                                                  badgeColor: 'bg-purple-500 text-white' },
    { id: 'surveys',     label: 'Asset Surveys',     badge: surveys.filter((s)     => ['pending-approval','in-progress','reconciliation'].includes(s.status)).length,                              badgeColor: 'bg-orange-500 text-white' },
    { id: 'disposals',   label: 'Asset Disposals',   badge: disposals.filter((d)   => ['pending-review','pending-approval','approved','in-progress'].includes(d.status)).length,                  badgeColor: 'bg-red-500 text-white'    },
  ]

  return (
    <SubNavTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(id) => onTabChange(id as ActiveTab)}
    />
  )
}
