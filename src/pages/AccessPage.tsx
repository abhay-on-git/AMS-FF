import { Navigate } from 'react-router-dom'

export default function AccessPage() {
  return <Navigate to="/users?tab=roles" replace />
}
