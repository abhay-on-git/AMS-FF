import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

interface RoleGuardProps {
  allowedRoles: string[]
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user } = useAppSelector((state) => state.auth)

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
