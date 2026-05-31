import { useState } from 'react'
import { ChevronLeft, Edit, Copy, Trash2, MapPin, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog, SubNavTabs } from '@/components/shared'
import { PermissionGrid } from './PermissionGrid'
import { useRoleDetail } from '../hooks/useRoles'
import { useDeleteRole, useCloneRole, useUpdatePermissions } from '../hooks/useRoleMutations'
import type { DetailTab, ModulePermission } from '../types'

interface RoleDetailProps {
  roleId: string
  onBack: () => void
  onEdit: (roleId: string) => void
}

const TABS = [
  { id: 'permissions',  label: 'Permissions' },
  { id: 'field-access', label: 'Field Access' },
  { id: 'locations',    label: 'Locations'   },
] as const

export function RoleDetail({ roleId, onBack, onEdit }: RoleDetailProps) {
  const { data: role, isLoading } = useRoleDetail(roleId)
  const [activeTab,   setActiveTab]   = useState<DetailTab>('permissions')
  const [deleteOpen,  setDeleteOpen]  = useState(false)
  const [permissions, setPermissions] = useState<ModulePermission[] | null>(null)

  const deleteMutation = useDeleteRole()
  const cloneMutation  = useCloneRole()
  const permMutation   = useUpdatePermissions()

  if (isLoading || !role) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground text-[15px]">
        {isLoading ? 'Loading…' : 'Role not found.'}
      </div>
    )
  }

  const isReadOnly     = role.type === 'system'
  const livePermissions = permissions ?? role.permissions

  return (
    <div className="space-y-5">
      {/* Breadcrumb — matches UserDetail style */}
      <div className="flex items-center gap-1.5 text-[14px]">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5">
          <ChevronLeft className="w-4 h-4" />
          <span>Role and Permission</span>
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">{role.name}</span>
      </div>

      {/* Title row — h1 + action buttons */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{role.name}</h1>
          <p className="text-[15px] text-muted-foreground mt-1">{role.description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {!isReadOnly && (
            <Button variant="outline" size="sm" className="text-[15px] gap-1.5 h-9" onClick={() => onEdit(role.id)}>
              <Edit className="w-3.5 h-3.5" /> Edit
            </Button>
          )}
          <Button
            variant="outline" size="sm" className="text-[15px] gap-1.5 h-9"
            onClick={() => cloneMutation.mutate(role.id, { onSuccess: onBack })}
            disabled={cloneMutation.isPending}
          >
            <Copy className="w-3.5 h-3.5" /> Clone
          </Button>
          {!isReadOnly && (
            <Button
              variant="outline" size="sm"
              className="text-[15px] gap-1.5 h-9 text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </Button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <SubNavTabs
        tabs={TABS.map((t) => ({ id: t.id, label: t.label }))}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as DetailTab)}
      />

      {/* ── Permissions tab ───────────────────────────────────────────────── */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <PermissionGrid
            permissions={livePermissions}
            onChange={setPermissions}
            readOnly={isReadOnly}
          />
          {permissions && !isReadOnly && (
            <div className="flex justify-end">
              <Button
                className="text-[15px]"
                onClick={() => permMutation.mutate({ id: role.id, permissions }, { onSuccess: () => setPermissions(null) })}
                disabled={permMutation.isPending}
              >
                {permMutation.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Field Access tab ──────────────────────────────────────────────── */}
      {activeTab === 'field-access' && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
            <EyeOff className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-[15px] font-medium text-amber-800 dark:text-amber-200">Field-Level Restrictions</p>
              <p className="text-[15px] text-amber-700 dark:text-amber-300 mt-1">
                Restrict specific data fields from being visible to users with this role.
              </p>
            </div>
          </div>
          {role.permissions
            .filter((m) => m.fieldRestrictions.length > 0)
            .map((m) => (
              <Card key={m.module}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-[15px]">{m.module}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {m.fieldRestrictions.map((fr) => (
                    <div
                      key={fr.field}
                      className={`flex items-center justify-between rounded-md border px-4 py-3 ${
                        fr.restricted
                          ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                          : 'border-border/40 bg-background'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-[15px] font-medium font-['Manrope']">{fr.label}</p>
                        <p className="text-[13px] text-muted-foreground mt-0.5">{fr.description}</p>
                      </div>
                      <Badge
                        variant={fr.restricted ? 'destructive' : 'outline'}
                        className="text-[12px] ml-4 shrink-0"
                      >
                        {fr.restricted ? 'Restricted' : 'Visible'}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          {role.permissions.every((m) => m.fieldRestrictions.length === 0) && (
            <p className="py-8 text-center text-[15px] text-muted-foreground">
              No field restrictions configured for this role.
            </p>
          )}
        </div>
      )}

      {/* ── Locations tab ─────────────────────────────────────────────────── */}
      {activeTab === 'locations' && (
        <div className="space-y-2">
          {role.locationAccess.length === 0 ? (
            <p className="py-8 text-center text-[15px] text-muted-foreground">No location access configured.</p>
          ) : (
            role.locationAccess.map((loc) => (
              <div key={loc.officeId} className="flex items-center gap-3 rounded-md border px-4 py-3">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-medium font-['Manrope']">{loc.officeName}</p>
                  <p className="text-[13px] text-muted-foreground">{loc.location} · {loc.code}</p>
                </div>
                <Badge variant={loc.granted ? 'default' : 'outline'} className="text-[12px] shrink-0">
                  {loc.granted ? 'Granted' : 'No Access'}
                </Badge>
              </div>
            ))
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Role"
        description={`Permanently delete "${role.name}"? Users assigned this role will lose access.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(role.id, { onSuccess: onBack })}
      />
    </div>
  )
}
