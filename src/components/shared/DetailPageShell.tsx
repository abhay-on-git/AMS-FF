import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/cn'

interface TabDef {
  key:    string
  label:  string
  badge?: number
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
          <div className="flex items-center gap-2 text-[15px] mb-2">
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
              <span className="text-[15px] text-muted-foreground">{subtitle}</span>
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
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'px-4 py-1.5 rounded-[4px] text-[15px] transition-colors flex items-center gap-1.5',
              activeTab === tab.key
                ? 'bg-[#121321] text-white shadow-sm'
                : 'text-foreground hover:bg-muted',
            )}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={cn(
                'text-[11px] font-semibold rounded-full px-1.5 py-0.5 min-w-[18px] text-center',
                activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-destructive/10 text-destructive',
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {children}
    </div>
  )
}
