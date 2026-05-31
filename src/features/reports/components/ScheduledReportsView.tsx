import { useState } from 'react'
import { CheckCircle, Clock, Lock, Pause, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { DataTable, type DataTableColumn } from '@/components/shared/DataTable'
import { formatDate } from '@/lib/utils/dateFormatter'
import { PREDEFINED_REPORTS } from '../constants/reportingData'
import { useReportAccess } from '../hooks/useReportAccess'
import { useDeleteSchedule, useToggleSchedule } from '../hooks/useReportsMutations'
import { useScheduledReports } from '../hooks/useReportsQueries'
import type { CreateSchedulePayload, ScheduledReport } from '../types'
import { ReportsBackButton } from './ReportsBackNav'
import { ScheduleFormDrawer } from './ScheduleFormDrawer'

interface ScheduledReportsViewProps {
  onBack: () => void
}

export function ScheduledReportsView({ onBack }: ScheduledReportsViewProps) {
  const { isAdmin } = useReportAccess()
  const { data: schedules = [], isLoading } = useScheduledReports()
  const toggleSchedule = useToggleSchedule()
  const deleteSchedule = useDeleteSchedule()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<ScheduledReport | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const stats = [
    { label: 'Active Schedules', value: schedules.filter((s) => s.enabled).length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { label: 'Paused', value: schedules.filter((s) => !s.enabled).length, icon: Pause, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { label: 'Total Schedules', value: schedules.length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  ]

  const columns: DataTableColumn<ScheduledReport>[] = [
    {
      key: 'enabled',
      header: 'Status',
      render: (row) => (
        <Switch
          checked={row.enabled}
          disabled={!isAdmin}
          onCheckedChange={() => toggleSchedule.mutate({ id: row.id, enabled: !row.enabled })}
        />
      ),
    },
    { key: 'name', header: 'Schedule Name', accessor: (r) => r.name },
    {
      key: 'reportType',
      header: 'Report Type',
      render: (r) => (
        <Badge variant="outline" className="text-sm">
          {PREDEFINED_REPORTS.find((p) => p.id === r.reportType)?.name || r.reportType}
        </Badge>
      ),
    },
    {
      key: 'frequency',
      header: 'Frequency',
      render: (r) => <Badge className="bg-primary/10 text-primary text-sm capitalize">{r.frequency}</Badge>,
    },
    { key: 'format', header: 'Format', render: (r) => <span className="uppercase">{r.format}</span> },
    {
      key: 'recipients',
      header: 'Recipients',
      render: (r) => (
        <div className="flex flex-col gap-1">
          {r.recipients.map((email) => (
            <span key={email} className="text-sm text-muted-foreground">{email}</span>
          ))}
        </div>
      ),
    },
    {
      key: 'nextRun',
      header: 'Next Run',
      render: (r) => (r.enabled ? formatDate(r.nextRun) : '—'),
    },
    {
      key: 'lastRun',
      header: 'Last Run',
      render: (r) => (r.lastRun ? formatDate(r.lastRun) : '—'),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <ReportsBackButton onBack={onBack} />
          <h1 className="text-3xl font-semibold">Scheduled Reports</h1>
          <p className="mt-1.5 text-base text-muted-foreground">Automated recurring reports delivered via email</p>
        </div>
        <div className="flex items-center gap-3">
          {!isAdmin && (
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm text-yellow-600">
              <Lock className="h-4 w-4" />
              Admin access required
            </Badge>
          )}
          <Button disabled={!isAdmin} className="h-11 bg-brand-navy text-base text-white hover:bg-brand-navy-mid" onClick={() => { setEditing(null); setDrawerOpen(true) }}>
            <Plus className="mr-2 h-5 w-5" />
            New Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <div>
                <p className="text-base font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 text-3xl font-semibold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-muted-foreground" />
            All Scheduled Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-md" />
          ) : (
            <DataTable
              columns={columns}
              data={schedules}
              keyExtractor={(r) => r.id}
              paginated={false}
              itemLabel="schedules"
              actionsColumn={(row) => (
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" disabled={!isAdmin} onClick={() => { setEditing(row); setDrawerOpen(true) }}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" disabled={!isAdmin} onClick={() => setDeleteId(row.id)}>
                    Delete
                  </Button>
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>

      <ScheduleFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} schedule={editing} />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Schedule"
        description="Are you sure you want to delete this schedule?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteId) deleteSchedule.mutate(deleteId)
          setDeleteId(null)
        }}
      />
    </div>
  )
}
