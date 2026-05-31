import { useMemo, useState } from 'react'
import { Download, Play } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/cn'
import { PREDEFINED_REPORTS } from '../constants/reportingData'
import { PREDEFINED_REPORT_ICONS } from '../constants/predefinedReportIcons'
import { useReportAccess } from '../hooks/useReportAccess'
import { runReport } from '../services/reportingService'
import type { PredefinedReport, ReportRow } from '../types'
import { getSortedResults } from '../utils/reportResults'
import {
  ReportExportDialog,
  ReportOfficeSelectDialog,
  ReportPreviewDialog,
  ReportShareDialog,
} from './ReportDialogs'
import { ReportsBackNav } from './ReportsBackNav'

const CATEGORY_TABS = [
  { key: 'all', label: 'All Reports' },
  { key: 'Asset Register', label: 'Asset Register' },
  { key: 'Lifecycle', label: 'Lifecycle' },
  { key: 'Disposal', label: 'Disposal' },
  { key: 'Transfer', label: 'Transfer' },
] as const

const DEFAULT_FIELDS = ['assetId', 'name', 'category', 'location', 'status']

interface PredefinedReportsViewProps {
  onBack: () => void
}

export function PredefinedReportsView({ onBack }: PredefinedReportsViewProps) {
  const { isAdmin, isManagerOrAbove } = useReportAccess()
  const [reportTab, setReportTab] = useState('all')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [officeOpen, setOfficeOpen] = useState(false)
  const [pendingReportId, setPendingReportId] = useState<string | null>(null)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [office, setOffice] = useState('All Offices')
  const [rows, setRows] = useState<ReportRow[]>([])
  const [sortBy, setSortBy] = useState('assetId')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const reports = useMemo(() => PREDEFINED_REPORTS as PredefinedReport[], [])

  const filtered = reports.filter(
    (r) => reportTab === 'all' || r.category === reportTab,
  )

  const canAccess = (report: (typeof PREDEFINED_REPORTS)[number]) =>
    report.accessLevel === 'all' ||
    (report.accessLevel === 'manager' && isManagerOrAbove) ||
    (report.accessLevel === 'admin' && isAdmin)

  const handleGenerate = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId)
    if (!report || !canAccess(report)) {
      toast.error('You do not have access to this report')
      return
    }
    setPendingReportId(reportId)
    setOffice('All Offices')
    setOfficeOpen(true)
  }

  const confirmGenerate = async () => {
    if (!pendingReportId) return
    const report = reports.find((r) => r.id === pendingReportId)
    if (!report) return
    toast.success(`Generating ${report.name} for ${office}...`)
    const data = await runReport(pendingReportId, office, DEFAULT_FIELDS)
    setSelectedReportId(pendingReportId)
    setRows(getSortedResults(data, sortBy, sortOrder))
    setPreviewOpen(true)
    setOfficeOpen(false)
    setPendingReportId(null)
  }

  const handleSort = (field: string) => {
    const nextOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortBy(field)
    setSortOrder(nextOrder)
    setRows(getSortedResults(rows, field, nextOrder))
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <ReportsBackNav label="Predefined Reports" onBack={onBack} />

        <div className="flex w-fit flex-wrap items-center gap-1.5 rounded-[6px] bg-muted/50 p-1.5">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setReportTab(tab.key)}
              className={cn(
                'rounded-[4px] px-5 py-2.5 text-base font-medium transition-colors',
                reportTab === tab.key
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'bg-transparent text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filtered.map((report) => {
            const allowed = canAccess(report)
            const Icon = PREDEFINED_REPORT_ICONS[report.id]
            return (
              <Card key={report.id} className={cn(!allowed && 'opacity-60')}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {Icon && <Icon className="h-6 w-6" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      <Badge variant="outline" className="mt-1.5 text-sm">{report.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-5 text-base text-muted-foreground">{report.description}</p>
                  <div className="flex gap-3">
                    <Button
                      className="h-11 flex-1 text-base"
                      disabled={!allowed}
                      onClick={() => handleGenerate(report.id)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-11 px-4"
                          disabled={!allowed}
                          onClick={() => setExportOpen(true)}
                        >
                          <Download className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Download Report</p></TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <ReportPreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          title="Report Preview"
          description={`${rows.length} records found — Review, export, or share your report`}
          rowCount={rows.length}
          selectedFields={DEFAULT_FIELDS}
          groupBy="none"
          sortBy={sortBy}
          sortOrder={sortOrder}
          rows={rows}
          onSort={handleSort}
          onShare={() => setShareOpen(true)}
          reportId={selectedReportId}
        />
        <ReportShareDialog open={shareOpen} onOpenChange={setShareOpen} reportId={selectedReportId} />
        <ReportExportDialog open={exportOpen} onOpenChange={setExportOpen} />
        <ReportOfficeSelectDialog
          open={officeOpen}
          onOpenChange={setOfficeOpen}
          office={office}
          onOfficeChange={setOffice}
          onConfirm={confirmGenerate}
        />
      </div>
    </TooltipProvider>
  )
}
