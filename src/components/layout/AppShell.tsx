import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useNavigation } from '@/hooks/useNavigation'

export function AppShell() {
  const { collapsed, mobileOpen, toggleCollapse, openMobile, closeMobile } = useNavigation()

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

          <main className="flex-1 p-4 min-w-0 overflow-y-auto scrollbar-hide">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
