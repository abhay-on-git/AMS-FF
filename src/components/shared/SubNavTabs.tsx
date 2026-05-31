import { cn } from '@/lib/cn'

export interface SubNavTab {
  /** Unique identifier — passed back to onTabChange */
  id: string
  /** Display label */
  label: string
  /**
   * Optional count badge.
   * Badge is only rendered when the value is a positive number.
   */
  badge?: number
  /**
   * Tailwind classes for the badge background + text when the tab is inactive.
   * Defaults to `bg-destructive/10 text-destructive`.
   * When the tab is active the badge is always `bg-white/20 text-white`.
   */
  badgeColor?: string
}

interface SubNavTabsProps {
  tabs:        SubNavTab[]
  activeTab:   string
  onTabChange: (id: string) => void
  /** Extra classes applied to the outer wrapper (e.g. to remove `w-fit` or add margin) */
  className?:  string
}

/**
 * Universal pill-style sub-navigation bar used across the entire app.
 *
 * Features:
 *  - Dynamic tab count  — pass any number of `SubNavTab` items
 *  - Optional badge per tab (count indicator with per-tab colour)
 *  - Fully accessible (button role, keyboard navigable)
 *  - Consistent brand styling: dark pill on active, transparent on inactive
 */
export function SubNavTabs({ tabs, activeTab, onTabChange, className }: SubNavTabsProps) {
  return (
    <div className={cn('flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit flex-wrap', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const showBadge = tab.badge !== undefined && tab.badge > 0

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-4 py-2 rounded-[4px] text-15 transition-colors flex items-center gap-1.5 whitespace-nowrap',
              isActive
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-transparent text-brand-navy hover:bg-black/5',
            )}
          >
            {tab.label}
            {showBadge && (
              <span
                className={cn(
                  'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold leading-none',
                  isActive
                    ? 'bg-white/20 text-white'
                    : (tab.badgeColor ?? 'bg-destructive/10 text-destructive'),
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
