export const pageLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  categories: 'Categories',
  assets: 'All Assets',
  locations: 'Locations',
  reporting: 'Reporting & Analytics',
  users: 'User Management',
  'action-log': 'Action Log',
  roles: 'Role Management',
  profile: 'Profile',
  notifications: 'Notifications',
}

export const searchModules = [
  { id: 'all', label: 'All Modules' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'categories', label: 'Categories' },
  { id: 'assets', label: 'Assets' },
  { id: 'locations', label: 'Locations' },
  { id: 'reporting', label: 'Reporting' },
  { id: 'users', label: 'Users' },
  { id: 'action-log', label: 'Action Log' },
] as const

export const entityOptions = [
  'Assets',
  'Categories',
  'Users',
  'Locations',
  'Reports',
] as const
