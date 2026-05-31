import { useAppSelector } from '@/store/hooks'

export function useReportAccess() {
  const role = useAppSelector((state) => state.auth.user?.role ?? 'user')
  const isAdmin = role === 'admin'
  const isManagerOrAbove = isAdmin || role === 'manager'

  return { role, isAdmin, isManagerOrAbove }
}
