import {
  LayoutGrid,
  Folder,
  Package,
  MapPin,
  BarChart3,
  Users,
  FileText,
  Bell,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItemConfig {
  id: string
  label: string
  icon: LucideIcon
  path: string
  end?: boolean
}

export const mainNavItems: NavItemConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
  { id: 'categories', label: 'Categories', icon: Folder, path: '/assets/categories' },
  { id: 'assets', label: 'Asset Management', icon: Package, path: '/assets', end: true },
  { id: 'locations', label: 'Locations', icon: MapPin, path: '/locations' },
  { id: 'reporting', label: 'Reports', icon: BarChart3, path: '/reporting' },
  { id: 'users', label: 'User Management', icon: Users, path: '/users' },
  { id: 'action-log', label: 'Action Log', icon: FileText, path: '/audit' },
]

export const bottomNavItems: NavItemConfig[] = [
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
]
