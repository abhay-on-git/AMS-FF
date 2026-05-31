import { useState, useCallback, type ReactNode } from 'react'
import {
  ChevronDown, ChevronRight,
  CheckCircle, Eye, MinusCircle,
  BarChart2, Package, FolderOpen, MapPin,
  ArrowLeftRight, Search, Users, Database,
  Bell, FileText, Settings2, HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getPermissionValue } from '../types'
import type { ModulePermission, PermissionAction } from '../types'

// ── Figma columns: no "approve" displayed (kept in type for data integrity)
const DISPLAY_ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete', 'export']
const ACTION_LABELS: Record<string, string> = {
  view: 'VIEW', create: 'CREATE', edit: 'EDIT', delete: 'DELETE', export: 'EXPORT',
}

const ICON_CLS = 'w-4 h-4 shrink-0 text-brand-navy dark:text-brand-teal'
const MODULE_ICONS: Record<string, ReactNode> = {
  'Dashboard':             <BarChart2     className={ICON_CLS} />,
  'Assets':                <Package       className={ICON_CLS} />,
  'Categories':            <FolderOpen    className={ICON_CLS} />,
  'Locations':             <MapPin        className={ICON_CLS} />,
  'Asset Lifecycle':       <ArrowLeftRight className={ICON_CLS} />,
  'Find Extra':            <Search        className={ICON_CLS} />,
  'Reporting & Analytics': <BarChart2     className={ICON_CLS} />,
  'Users & Roles':         <Users         className={ICON_CLS} />,
  'Integrations':          <Database      className={ICON_CLS} />,
  'Notifications':         <Bell          className={ICON_CLS} />,
  'Action Log':            <FileText      className={ICON_CLS} />,
  'System Config':         <Settings2     className={ICON_CLS} />,
  'Help':                  <HelpCircle    className={ICON_CLS} />,
}

function applyPreset(mod: ModulePermission, preset: 'full' | 'readonly' | 'none'): ModulePermission {
  const full = preset === 'full'
  const view = preset !== 'none'
  const val  = (a: PermissionAction) => a === 'view' ? view : full
  const patch = {
    view: val('view'), create: val('create'), edit: val('edit'),
    approve: val('approve'), delete: val('delete'), export: val('export'),
  }
  return { ...mod, ...patch, subModules: mod.subModules.map((s) => ({ ...s, ...patch })) }
}

function getModuleState(mod: ModulePermission, action: PermissionAction): boolean | 'indeterminate' {
  if (mod.subModules.length === 0) return getPermissionValue(mod, action)
  const subs  = mod.subModules.map((s) => getPermissionValue(s, action))
  if (subs.every(Boolean)) return true
  if (subs.some(Boolean))  return 'indeterminate'
  return false
}

interface PermissionGridProps {
  permissions: ModulePermission[]
  onChange:    (updated: ModulePermission[]) => void
  readOnly?:   boolean
}

export function PermissionGrid({ permissions, onChange, readOnly = false }: PermissionGridProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const expandAll  = () => setExpanded(new Set(permissions.filter((p) => p.subModules.length > 0).map((p) => p.module)))
  const collapseAll = () => setExpanded(new Set())

  const toggleExpand = (name: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })

  const toggleModule = useCallback(
    (mi: number, action: PermissionAction) => {
      if (readOnly) return
      const mod    = permissions[mi]
      const cur    = getModuleState(mod, action)
      const newVal = cur !== true
      onChange(
        permissions.map((m, i) =>
          i !== mi ? m : { ...m, [action]: newVal, subModules: m.subModules.map((s) => ({ ...s, [action]: newVal })) },
        ),
      )
    },
    [permissions, onChange, readOnly],
  )

  const toggleSub = useCallback(
    (mi: number, si: number, action: PermissionAction) => {
      if (readOnly) return
      const newVal = !getPermissionValue(permissions[mi].subModules[si], action)
      onChange(
        permissions.map((m, i) => {
          if (i !== mi) return m
          const subs   = m.subModules.map((s, j) => j === si ? { ...s, [action]: newVal } : s)
          const allOn  = subs.every((s) => getPermissionValue(s, action))
          return { ...m, [action]: allOn, subModules: subs }
        }),
      )
    },
    [permissions, onChange, readOnly],
  )

  const setPreset = useCallback(
    (mi: number, preset: 'full' | 'readonly' | 'none') => {
      if (readOnly) return
      onChange(permissions.map((m, i) => i !== mi ? m : applyPreset(m, preset)))
    },
    [permissions, onChange, readOnly],
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Expand / Collapse toolbar */}
      <div className="flex gap-2">
        <Button variant="outline" className="text-15 h-9" onClick={expandAll}>Expand All</Button>
        <Button variant="outline" className="text-15 h-9" onClick={collapseAll}>Collapse All</Button>
      </div>

      {/* Permission table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-64 text-15 font-semibold uppercase tracking-wide">
                Module / Sub-Module
              </TableHead>
              {DISPLAY_ACTIONS.map((a) => (
                <TableHead key={a} className="text-center w-20 text-15 font-semibold uppercase tracking-wide">
                  {ACTION_LABELS[a]}
                </TableHead>
              ))}
              <TableHead className="text-center w-36 text-15 font-semibold uppercase tracking-wide">
                Quick Set
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.flatMap((mod, mi) => {
              const isOpen     = expanded.has(mod.module)
              const hasChildren = mod.subModules.length > 0

              const moduleRow = (
                <TableRow key={mod.module} className="bg-muted/10 hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => hasChildren && toggleExpand(mod.module)}
                        className="p-0.5 rounded shrink-0"
                        tabIndex={hasChildren ? 0 : -1}
                      >
                        {hasChildren
                          ? isOpen
                            ? <ChevronDown  className="w-4 h-4 text-muted-foreground" />
                            : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          : <span className="w-4 inline-block" />
                        }
                      </button>
                      {MODULE_ICONS[mod.module] ?? <Package className={ICON_CLS} />}
                      <span className="font-medium text-15 font-['Manrope']">{mod.module}</span>
                    </div>
                  </TableCell>
                  {DISPLAY_ACTIONS.map((action) => {
                    const state = getModuleState(mod, action)
                    return (
                      <TableCell key={action} className="text-center">
                        <Checkbox
                          className="mx-auto"
                          checked={state === true ? true : state === 'indeterminate' ? 'indeterminate' : false}
                          onCheckedChange={() => toggleModule(mi, action)}
                          disabled={readOnly}
                          aria-label={`Toggle ${action} for ${mod.module}`}
                        />
                      </TableCell>
                    )
                  })}
                  <TableCell>
                    <div className="flex justify-center gap-1.5">
                      <button
                        onClick={() => setPreset(mi, 'full')}
                        disabled={readOnly}
                        title="Full Access"
                        className="p-1 rounded hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <CheckCircle  className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => setPreset(mi, 'readonly')}
                        disabled={readOnly}
                        title="View Only"
                        className="p-1 rounded hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Eye          className="w-5 h-5 text-amber-500" />
                      </button>
                      <button
                        onClick={() => setPreset(mi, 'none')}
                        disabled={readOnly}
                        title="No Access"
                        className="p-1 rounded hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <MinusCircle  className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )

              const subRows = isOpen
                ? mod.subModules.map((sub, si) => (
                    <TableRow key={`${mod.module}-${sub.name}`} className="hover:bg-muted/10">
                      <TableCell>
                        <div className="flex items-center gap-1 pl-12">
                          <span className="text-muted-foreground text-15 mr-1">└</span>
                          <span className="text-15 font-['Manrope']">{sub.name}</span>
                        </div>
                      </TableCell>
                      {DISPLAY_ACTIONS.map((action) => (
                        <TableCell key={action} className="text-center">
                          <Checkbox
                            className="mx-auto"
                            checked={getPermissionValue(sub, action)}
                            onCheckedChange={() => toggleSub(mi, si, action)}
                            disabled={readOnly}
                            aria-label={`Toggle ${action} for ${sub.name}`}
                          />
                        </TableCell>
                      ))}
                      <TableCell />
                    </TableRow>
                  ))
                : []

              return [moduleRow, ...subRows]
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
