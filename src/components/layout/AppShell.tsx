import { Suspense } from 'react'
import { Outlet, useNavigation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { RouteLoading } from '@/components/shared/RouteLoading'
import { cn } from '@/lib/cn'
import { useNavigation as useSidebarNavigation } from '@/hooks/useNavigation'

export function AppShell() {
  const { collapsed, mobileOpen, toggleCollapse, openMobile, closeMobile } = useSidebarNavigation()
  const navigation = useNavigation()
  const isNavigating = navigation.state === 'loading'

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
      />

      <div className="flex-1 flex min-w-0 p-[10px_8px_8px_0] bg-sidebar overflow-visible max-h-screen">
        <div className="flex-1 flex flex-col min-w-0 max-h-[98vh] bg-main-bg rounded-[10px] overflow-hidden px-4 shadow-[0px_4px_12px_rgba(10,18,28,0.06),0px_1px_4px_rgba(10,18,28,0.04)]">
          <TopBar onMenuClick={openMobile} />

          <main className="relative flex-1 p-4 min-w-0 overflow-y-auto scrollbar-hide">
            {isNavigating && (
              <div
                className="pointer-events-none absolute inset-0 z-10 bg-main-bg/40"
                aria-hidden
              />
            )}
            <Suspense fallback={<RouteLoading />}>
              <div className={cn(isNavigating && 'opacity-60 transition-opacity duration-150')}>
                <Outlet />
              </div>
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
