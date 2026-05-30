import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, X, ChevronDown, Menu, Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { entityOptions } from './constants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState('Assets')
  const [entityDropdownOpen, setEntityDropdownOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          document.getElementById('global-search')?.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const getPageInfo = () => {
    const path = location.pathname
    if (path.startsWith('/dashboard')) return { title: 'Dashboard', description: 'Overview of your asset management system' }
    if (path.startsWith('/assets/categories')) return { title: 'Categories', description: 'Manage asset categories and classifications' }
    if (path.startsWith('/assets')) return { title: 'All Assets', description: 'Track and manage all registered assets' }
    if (path.startsWith('/locations')) return { title: 'Locations', description: 'Manage sites, buildings, and floors' }
    if (path.startsWith('/reporting')) return { title: 'Reporting & Analytics', description: 'Generate reports and view analytics' }
    if (path.startsWith('/users')) return { title: 'User Management', description: 'Manage users, roles, and permissions' }
    if (path.startsWith('/audit')) return { title: 'Action Log', description: 'View system activity and audit trail' }
    if (path.startsWith('/notifications')) return { title: 'Notifications', description: 'View your notifications and alerts' }
    if (path.startsWith('/profile')) return { title: 'Profile', description: 'Manage your account settings' }
    return { title: 'Asset Management App', description: '' }
  }

  const { title: pageTitle, description: pageDescription } = getPageInfo()

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-main-bg/60 rounded-t-[10px]">
      <div className="flex items-center justify-between px-6 py-8 bg-main-bg">
        <button className="md:hidden p-1 rounded" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <h1 className="text-[30px]">{pageTitle}</h1>
          {pageDescription && (
            <p className="text-[16px] text-muted-foreground mt-1">{pageDescription}</p>
          )}
        </div>

        <div className="hidden md:flex relative">
          <div className="relative flex items-center w-[444px] h-14 rounded-full border border-muted bg-white shadow-[0_12px_20px_-2px_rgba(32,34,57,0.04),0_6px_8px_-4px_rgba(32,34,57,0.02)] overflow-visible">
            <div className="relative h-14 flex items-center flex-1 min-w-[203px] rounded-l-full overflow-hidden">
              <Search
                className={cn('absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 transition-colors', isSearchFocused ? 'text-sidebar-text-inactive' : 'text-search-placeholder')}
              />
              <input
                id="global-search"
                type="text"
                placeholder={`Search ${selectedEntity.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (e.target.value.length > 0) {
                    setIsSearchLoading(true)
                    setTimeout(() => setIsSearchLoading(false), 500)
                  }
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full h-14 pl-[46px] pr-9 font-[Sora] text-base text-foreground placeholder:text-search-placeholder bg-transparent border-none outline-none font-light"
              />

              {searchQuery && !isSearchLoading && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-accent transition-colors"
                >
                  <X className="h-[15px] w-[15px] text-foreground" />
                </button>
              )}

              {isSearchLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-[14px] w-[14px] text-sidebar-primary animate-spin" />
                </div>
              )}

              {!searchQuery && (
                <div className="absolute right-[14px] top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded bg-muted font-[Sora] text-base text-search-hint">
                  /
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-muted shrink-0" />

            <DropdownMenu onOpenChange={setEntityDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button className={cn('flex items-center gap-1 px-4 h-14 w-[110px] font-[Sora] text-base font-medium text-foreground rounded-r-full border border-muted cursor-pointer outline-none transition-colors', entityDropdownOpen ? 'bg-muted' : 'bg-white')}>
                  <span className="flex-1 text-left truncate">{selectedEntity}</span>
                  <ChevronDown className={cn('w-5 h-5 shrink-0 transition-transform', entityDropdownOpen && 'rotate-180')} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[136px] rounded-lg border border-muted bg-white p-1.5 shadow-[0_12px_20px_-2px_rgba(32,34,57,0.04),0_6px_8px_-4px_rgba(32,34,57,0.02)]">
                {entityOptions.map((entity) => (
                  <DropdownMenuItem
                    key={entity}
                    onClick={() => setSelectedEntity(entity)}
                    className="flex items-center justify-between rounded-md cursor-pointer font-[Manrope] text-base font-medium text-foreground px-2.5 py-2"
                  >
                    <span>{entity}</span>
                    {selectedEntity === entity && (
                      <span className="text-sidebar-primary">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
