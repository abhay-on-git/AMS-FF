import { useState } from 'react'
import { ChevronLeft, ChevronRight, KeyRound, LogOut, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/authSlice'
import { ChangePasswordDialog } from '@/components/shared/ChangePasswordDialog'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { NavItem } from './NavItem'
import { mainNavItems, bottomNavItems } from './navItems'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import chorusLogo from '@/assets/c41ddd9636ba0cf84d17b65494aee06fd1254e8a.png'
import chorusIcon from '@/assets/Chorus_Orange_Icon.png'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar overflow-visible">
      {/* Logo */}
      <div className={cn('flex items-center shrink-0 h-16 relative overflow-visible', collapsed ? 'justify-center pt-14 pb-8' : 'justify-between pt-14 pb-8 px-[18px]')}>
        {collapsed ? (
          <img src={chorusIcon} alt="Chorus" className="h-12 w-auto" />
        ) : (
          <img src={chorusLogo} alt="Chorus" className="h-12 w-auto" />
        )}

        {!collapsed && (
          <button onClick={onToggleCollapse} className="w-8 h-8 rounded-xl flex items-center justify-center text-sidebar-text-inactive hover:text-sidebar-text-active transition-colors mt-4">
            <ChevronLeft className="h-[18px] w-[18px]" />
          </button>
        )}

        {collapsed && (
          <button
            onClick={onToggleCollapse}
            className="absolute right-0 top-[70%] -translate-y-1/2 translate-x-1/2 z-[10000] w-8 h-8 rounded-lg bg-sidebar flex items-center justify-center text-sidebar-text-inactive hover:bg-sidebar-item-hover hover:text-sidebar-text-active transition-colors"
          >
            <ChevronRight className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>

      {/* Main nav */}
      <nav className={cn('flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden', collapsed ? 'px-2 py-[18px]' : 'px-5 py-[18px]')}>
        {mainNavItems.map((item) => (
          <NavItem key={item.id} to={item.path} icon={item.icon} label={item.label} collapsed={collapsed} end={item.end} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className={cn('flex flex-col gap-1', collapsed ? 'px-1.5 pb-1.5' : 'px-5 pb-5')}>
        {bottomNavItems.map((item) => (
          <NavItem key={item.id} to={item.path} icon={item.icon} label={item.label} collapsed={collapsed} />
        ))}
      </div>

      {/* User footer */}
      <div className={cn('border-t border-sidebar-border shrink-0', collapsed ? 'p-2.5' : 'px-[18px] py-2.5')}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn('flex items-center gap-2 w-full rounded-md p-3.5 transition-colors hover:bg-sidebar-item-hover', collapsed ? 'justify-center' : 'justify-start')}>
              <div className="w-10 h-10 rounded-full bg-sidebar-avatar-bg flex items-center justify-center text-[15px] font-semibold text-sidebar-text-active shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[12px] text-sidebar-text-inactive leading-snug font-light">Organization</p>
                    <p className="text-[14px] text-sidebar-text-active leading-tight">{user?.name || 'User'}</p>
                  </div>
                  <MoreHorizontal className="h-5 w-5 text-sidebar-text-inactive shrink-0 rotate-90" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="top"
            sideOffset={8}
            className="w-72 p-0 bg-sidebar border-sidebar-border"
            style={{ zIndex: 99999 }}
          >
            <div className="px-5 py-5 border-b border-sidebar-border">
              <p className="font-[Manrope] text-[13px] font-semibold text-sidebar-text-inactive uppercase tracking-wider">
                ACCOUNT
              </p>
              <p className="font-[Manrope] text-base text-sidebar-foreground">{user?.email || ''}</p>
            </div>

            <div className="px-5 py-4 border-b border-sidebar-border">
              <div className="flex items-center justify-between gap-2">
                <span className="font-[Manrope] text-sm font-semibold text-sidebar-text-inactive uppercase tracking-wide">
                  Language
                </span>
                <LanguageSwitcher variant="sidebar" />
              </div>
            </div>

            <div className="p-3 space-y-1">
              <DropdownMenuItem
                className="flex items-center gap-2 px-4 py-2.5 text-sidebar-foreground font-[Manrope] text-[14px] cursor-pointer focus:bg-sidebar-item-hover focus:text-sidebar-foreground"
                onClick={() => setChangePasswordOpen(true)}
              >
                <KeyRound className="w-4 h-4" />
                Change password
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 px-4 py-2.5 text-sidebar-foreground font-[Manrope] text-[14px] cursor-pointer focus:bg-sidebar-item-hover focus:text-sidebar-foreground"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Log out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn('hidden md:flex flex-col sticky top-0 h-screen overflow-visible z-[9999] bg-sidebar transition-[width] duration-200 ease-in-out', collapsed ? 'w-[110px]' : 'w-[280px]')}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onCloseMobile} />
      )}

      {/* Mobile drawer */}
      <aside className={cn('fixed top-0 h-screen w-[280px] z-50 flex flex-col md:hidden bg-sidebar transition-[left] duration-200 ease-in-out', mobileOpen ? 'left-0' : '-left-[280px]')}>
        <SidebarContent />
      </aside>
    </>
  )
}
