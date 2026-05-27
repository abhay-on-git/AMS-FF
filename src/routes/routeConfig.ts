export interface AppRoute {
  key: string;
  path: string;
  page: string;
  protected?: boolean;
}

export const routeConfig: AppRoute[] = [
  { key: 'auth', path: '/auth', page: 'AuthPage' },
  { key: 'dashboard', path: '/dashboard', page: 'DashboardPage', protected: true },
  { key: 'assets', path: '/assets', page: 'AssetsPage', protected: true },
  { key: 'locations', path: '/locations', page: 'LocationsPage', protected: true },
  { key: 'users', path: '/users', page: 'UsersPage', protected: true },
  { key: 'access', path: '/access', page: 'AccessPage', protected: true },
  { key: 'reports', path: '/reporting', page: 'ReportingAnalyticsPage', protected: true },
];
