import { ChevronLeft, Edit, KeyRound, Power, Mail, Phone, Building2, Calendar, Clock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserDetail } from '../hooks/useUsers'
import { useToggleUserStatus } from '../hooks/useUserMutations'
import type { UserData } from '../types'

interface UserDetailProps {
  userId:          string
  onBack:          () => void
  onEdit:          (user: UserData) => void
  onResetPassword: (user: UserData) => void
}

const STATUS_COLORS: Record<string, string> = {
  active:   'border-green-500 text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-400',
  inactive: 'border-gray-400  text-gray-600  bg-gray-50  dark:bg-gray-900  dark:text-gray-400',
  locked:   'border-red-400   text-red-600   bg-red-50   dark:bg-red-950   dark:text-red-400',
}

const mockActivityLogs = [
  { id: '1', action: 'Login',          description: 'User logged in successfully',         timestamp: '2024-01-22 09:30', ipAddress: '192.168.1.100' },
  { id: '2', action: 'Asset Transfer', description: 'Created transfer request #TR-001',    timestamp: '2024-01-22 09:45', ipAddress: '192.168.1.100' },
  { id: '3', action: 'Inspection',     description: 'Completed inventory inspection #045', timestamp: '2024-01-21 16:30', ipAddress: '192.168.1.100' },
  { id: '4', action: 'Profile Update', description: 'Updated email address',               timestamp: '2024-01-20 10:15', ipAddress: '192.168.1.100' },
]

export function UserDetail({ userId, onBack, onEdit, onResetPassword }: UserDetailProps) {
  const { data: user, isLoading } = useUserDetail(userId)
  const toggleStatus = useToggleUserStatus()

  if (isLoading || !user) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground text-15">
        {isLoading ? 'Loading…' : 'User not found.'}
      </div>
    )
  }

  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  const profileFields = [
    { label: 'Full Name',       value: user.name },
    { label: 'Email Address',   value: user.email },
    { label: 'Mobile Number',   value: user.countryCode && user.mobile ? `${user.countryCode} ${user.mobile}` : '—' },
    { label: 'Role',            value: user.role },
    { label: 'Field Office',    value: user.fieldOffice },
    { label: 'Account Status',  value: user.status.charAt(0).toUpperCase() + user.status.slice(1) },
    { label: 'Created Date',    value: user.createdDate },
    { label: 'Last Login',      value: user.lastLogin ?? '—' },
  ]

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[14px]">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5">
          <ChevronLeft className="w-4 h-4" />
          <span>Users</span>
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">{user.name}</span>
      </div>

      {/* Profile header card */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-[18px] font-bold text-primary shrink-0">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-[20px] font-semibold font-['Manrope']">{user.name}</h2>
                  <Badge variant="outline" className={`text-[12px] ${STATUS_COLORS[user.status] ?? ''}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-15 text-muted-foreground mt-0.5">{user.email}</p>
                <div className="flex items-center gap-3 mt-1.5 text-13 text-muted-foreground">
                  <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" />{user.role}</span>
                  <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{user.fieldOffice}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="text-15 gap-1.5 h-9"
                onClick={() => onEdit(user)}>
                <Edit className="w-3.5 h-3.5" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="text-15 gap-1.5 h-9"
                onClick={() => onResetPassword(user)}>
                <KeyRound className="w-3.5 h-3.5" /> Reset Password
              </Button>
              <Button variant="outline" size="sm" className="text-15 gap-1.5 h-9"
                onClick={() => toggleStatus.mutate({ id: user.id, status: user.status === 'active' ? 'inactive' : 'active' })}
                disabled={toggleStatus.isPending}>
                <Power className="w-3.5 h-3.5" />
                {user.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile information card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
          <CardTitle className="text-[16px] font-semibold">Profile Information</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(user)}>
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {profileFields.map(({ label, value }) => (
              <div key={label}>
                <p className="text-13 text-muted-foreground mb-0.5">{label}</p>
                <p className="text-15 font-medium font-['Manrope']">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity log card */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-[16px] font-semibold">Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="divide-y">
            {mockActivityLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-15 font-medium font-['Manrope']">{log.action}</p>
                  <p className="text-13 text-muted-foreground mt-0.5">{log.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-13 text-muted-foreground whitespace-nowrap">{log.timestamp}</p>
                  {log.ipAddress && (
                    <p className="text-[12px] text-muted-foreground/60 mt-0.5">{log.ipAddress}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
