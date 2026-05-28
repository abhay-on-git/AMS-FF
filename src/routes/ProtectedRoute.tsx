import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { AppShell } from '@/components/layout'

export function ProtectedRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <AppShell />
}
