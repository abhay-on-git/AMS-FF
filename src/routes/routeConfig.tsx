import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AuthRoute } from './AuthRoute'

const AuthPage = lazy(() => import('@/pages/AuthPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const AssetsPage = lazy(() => import('@/pages/AssetsPage'))
const LocationsPage = lazy(() => import('@/pages/LocationsPage'))
const UsersPage = lazy(() => import('@/pages/UsersPage'))
const AccessPage = lazy(() => import('@/pages/AccessPage'))
const ReportingAnalyticsPage = lazy(() => import('@/pages/ReportingAnalyticsPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AuthRoute />,
    children: [
      { path: '/auth', element: <AuthPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/assets', element: <AssetsPage /> },
      { path: '/locations', element: <LocationsPage /> },
      { path: '/users', element: <UsersPage /> },
      { path: '/access', element: <AccessPage /> },
      { path: '/reporting', element: <ReportingAnalyticsPage /> },
    ],
  },
])
