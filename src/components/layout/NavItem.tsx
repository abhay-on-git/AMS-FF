import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import type { LucideIcon } from 'lucide-react'

interface NavItemProps {
  to: string
  icon: LucideIcon
  label: string
  collapsed: boolean
  end?: boolean
}

export function NavItem({ to, icon: Icon, label, collapsed, end }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 h-12 rounded-md text-[16px] font-medium font-[Manrope] transition-all whitespace-nowrap overflow-hidden',
          collapsed ? 'justify-center px-0' : 'px-3',
          isActive
            ? 'bg-sidebar-item-active text-sidebar-text-active'
            : 'text-sidebar-text-inactive hover:bg-sidebar-item-hover hover:text-sidebar-text-active',
        )
      }
    >
      <Icon className="h-6 w-6 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  )
}
