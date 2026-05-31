import { ChevronLeft } from 'lucide-react'
import { SubNavTabs } from './SubNavTabs'
import type { SubNavTab } from './SubNavTabs'

interface TabDef {
  key:         string
  label:       string
  badge?:      number
  badgeColor?: string
}

interface DetailPageShellProps {
  breadcrumbLabel: string
  onBack:          () => void
  recordId:        string
  title:           string
  subtitle?:       string
  badges?:         React.ReactNode
  headerActions?:  React.ReactNode
  alert?:          React.ReactNode
  tabs:            readonly TabDef[]
  activeTab:       string
  onTabChange:     (tab: string) => void
  children:        React.ReactNode
}

export function DetailPageShell({
  breadcrumbLabel,
  onBack,
  recordId,
  title,
  subtitle,
  badges,
  headerActions,
  alert,
  tabs,
  activeTab,
  onTabChange,
  children,
}: DetailPageShellProps) {
  return (
    <div className="space-y-5 min-w-0">
      {/* Breadcrumb + Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-15 mb-2">
            <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
              {breadcrumbLabel}
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium font-['Manrope']">{recordId}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold">{title}</h2>
            {subtitle && (
              <span className="text-15 text-muted-foreground">{subtitle}</span>
            )}
            {badges}
          </div>
        </div>
        {headerActions && (
          <div className="flex gap-2 shrink-0 flex-wrap justify-end">
            {headerActions}
          </div>
        )}
      </div>

      {/* Optional alert banner */}
      {alert}

      {/* Tab bar */}
      <SubNavTabs
        tabs={tabs.map((t): SubNavTab => ({
          id:         t.key,
          label:      t.label,
          badge:      t.badge,
          badgeColor: t.badgeColor,
        }))}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {/* Tab content */}
      {children}
    </div>
  )
}
