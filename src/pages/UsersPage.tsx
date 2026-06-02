import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { UserPlus, ShieldPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubNavTabs } from '@/components/shared'
import { UserTable }           from '@/features/users/components/UserTable'
import { UserDetail }          from '@/features/users/components/UserDetail'
import { UserFormDrawer }      from '@/features/users/components/drawers/UserFormDrawer'
import { ResetPasswordDrawer } from '@/features/users/components/drawers/ResetPasswordDrawer'
import { RoleTable }           from '@/features/access/components/RoleTable'
import { RoleDetail }          from '@/features/access/components/RoleDetail'
import { RoleFormDrawer }      from '@/features/access/components/drawers/RoleFormDrawer'
import { useUsers }            from '@/features/users/hooks/useUsers'
import { useRoles }            from '@/features/access/hooks/useRoles'
import type { UserData }       from '@/features/users/types'
import type { Role }           from '@/features/access/types'

type SubTab = 'users' | 'roles'

export default function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab    = (searchParams.get('tab') as SubTab) ?? 'users'
  const setTab = (t: SubTab) => setSearchParams({ tab: t }, { replace: true })

  const { data: users = [], isLoading: usersLoading } = useUsers()
  const { data: roles = [], isLoading: rolesLoading } = useRoles()

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [userDrawerOpen, setUserDrawerOpen] = useState(false)
  const [userDrawerMode, setUserDrawerMode] = useState<'create' | 'edit'>('create')
  const [editUser,       setEditUser]       = useState<UserData | null>(null)
  const [resetUser,      setResetUser]      = useState<UserData | null>(null)
  const [roleDrawerOpen, setRoleDrawerOpen] = useState(false)
  const [editRole,       setEditRole]       = useState<Role | null>(null)

  if (selectedUserId) {
    return (
      <UserDetail
        userId={selectedUserId}
        onBack={() => setSelectedUserId(null)}
        onEdit={(u) => { setEditUser(u); setUserDrawerMode('edit'); setUserDrawerOpen(true) }}
        onResetPassword={(u) => setResetUser(u)}
      />
    )
  }

  if (selectedRoleId) {
    return (
      <RoleDetail
        roleId={selectedRoleId}
        onBack={() => setSelectedRoleId(null)}
        onEdit={(id) => {
          const role = roles.find((r) => r.id === id) ?? null
          setEditRole(role)
          setRoleDrawerOpen(true)
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Tab bar + action button */}
      <div className="flex items-center justify-between">
        <SubNavTabs
          tabs={[
            { id: 'users', label: 'Users' },
            { id: 'roles', label: 'Roles & Permissions' },
          ]}
          activeTab={tab}
          onTabChange={(id) => setTab(id as SubTab)}
        />
        {tab === 'users' ? (
          <Button
            className="gap-1.5 bg-brand-navy hover:bg-brand-navy-mid text-white text-15"
            onClick={() => { setEditUser(null); setUserDrawerMode('create'); setUserDrawerOpen(true) }}
          >
            <UserPlus className="w-4 h-4" /> Add User
          </Button>
        ) : (
          <Button
            className="gap-1.5 bg-brand-navy hover:bg-brand-navy-mid text-white text-15"
            onClick={() => { setEditRole(null); setRoleDrawerOpen(true) }}
          >
            <ShieldPlus className="w-4 h-4" /> Add Role
          </Button>
        )}
      </div>

      {tab === 'users' && (
        <UserTable
          data={users}
          isLoading={usersLoading}
          onViewDetail={(u) => setSelectedUserId(u.id)}
          onEdit={(u) => { setEditUser(u); setUserDrawerMode('edit'); setUserDrawerOpen(true) }}
          onResetPassword={(u) => setResetUser(u)}
        />
      )}

      {tab === 'roles' && (
        <RoleTable
          data={roles}
          isLoading={rolesLoading}
          onViewDetail={(r) => setSelectedRoleId(r.id)}
          onEdit={(r) => { setEditRole(r); setRoleDrawerOpen(true) }}
        />
      )}

      <UserFormDrawer
        open={userDrawerOpen}
        onOpenChange={setUserDrawerOpen}
        mode={userDrawerMode}
        user={editUser}
      />
      <ResetPasswordDrawer
        open={!!resetUser}
        onOpenChange={(o) => !o && setResetUser(null)}
        user={resetUser}
      />
      <RoleFormDrawer
        open={roleDrawerOpen}
        onOpenChange={setRoleDrawerOpen}
        role={editRole}
      />
    </div>
  )
}
