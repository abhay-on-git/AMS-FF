import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

export function AuthRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
