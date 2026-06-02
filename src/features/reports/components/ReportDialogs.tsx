import { useState } from 'react'
import { Copy, FileDown, FileSpreadsheet, FileText, Mail, Share } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FIELD_OFFICES } from '../constants/reportingData'
import type { ReportRow, ReportSortOrder } from '../types'
import { ReportResultsTable } from './ReportResultsTable'

export function handleReportExport(format: 'excel' | 'pdf' | 'csv') {
  toast.success(`Exporting report as ${format.toUpperCase()}... Download will begin shortly.`)
}

interface ReportExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportExportDialog({ open, onOpenChange }: ReportExportDialogProps) {
  const formats = [
    { format: 'excel' as const, label: 'Excel (.xlsx)', sub: 'Best for data analysis', icon: FileSpreadsheet, bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { format: 'csv' as const, label: 'CSV (.csv)', sub: 'Universal import format', icon: FileText, bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { format: 'pdf' as const, label: 'PDF (.pdf)', sub: 'Best for sharing', icon: FileDown, bg: 'bg-red-100 dark:bg-red-900/20' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Export Report</DialogTitle>
          <DialogDescription className="mt-1 text-base">Choose the format for your report export</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {formats.map(({ format, label, sub, icon: Icon, bg }) => (
            <Button
              key={format}
              variant="outline"
              className="h-auto w-full justify-start px-4 py-4"
              onClick={() => {
                handleReportExport(format)
                onOpenChange(false)
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold">{label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ReportShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportId?: string | null
}

export function ReportShareDialog({ open, onOpenChange, reportId }: ReportShareDialogProps) {
  const [email, setEmail] = useState('')

  const handleShare = () => {
    if (!email.trim()) {
      toast.error('Please enter at least one email address')
      return
    }
    toast.success(`Report shared with ${email}`)
    setEmail('')
    onOpenChange(false)
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://ams.chorus.com/reports/shared/${reportId || 'custom'}`)
    toast.success('Report link copied to clipboard')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Share className="h-5 w-5" />
            Share Report
          </DialogTitle>
          <DialogDescription className="mt-1 text-base">
            Share this report with team members via email or link
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-5">
          <div>
            <Label className="text-base font-medium">Email Addresses</Label>
            <Input
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-12 text-base"
            />
          </div>
          <Separator />
          <div className="flex gap-3">
            <Button onClick={handleShare} className="h-11 flex-1 text-base">
              <Mail className="mr-2 h-4 w-4" />
              Send via Email
            </Button>
            <Button variant="outline" onClick={handleCopy} className="h-11 text-base">
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ReportOfficeSelectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  office: string
  onOfficeChange: (office: string) => void
  onConfirm: () => void
}

export function ReportOfficeSelectDialog({
  open,
  onOpenChange,
  office,
  onOfficeChange,
  onConfirm,
}: ReportOfficeSelectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Select Office</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="office-select" className="text-base">Office</Label>
            <Select value={office} onValueChange={onOfficeChange}>
              <SelectTrigger id="office-select" className="h-11 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_OFFICES.map((fo) => (
                  <SelectItem key={fo} value={fo} className="text-base">
                    {fo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="h-11 flex-1 text-base" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="h-11 flex-1 text-base" onClick={onConfirm}>
              Generate Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ReportPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  rowCount: number
  selectedFields: string[]
  groupBy: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  rows: ReportRow[]
  onSort: (field: string) => void
  onShare: () => void
  reportId?: string | null
}

export function ReportPreviewDialog({
  open,
  onOpenChange,
  title,
  description,
  rowCount,
  selectedFields,
  groupBy,
  sortBy,
  sortOrder,
  rows,
  onSort,
  onShare,
}: ReportPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[95vh] max-h-[95vh] w-[95vw] max-w-[1800px] flex-col overflow-hidden p-0">
        <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
          <div>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <FileText className="h-6 w-6" />
              {title}
            </DialogTitle>
            <DialogDescription className="mt-1 text-base">{description}</DialogDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="default" className="h-10 text-base" onClick={() => handleReportExport('excel')}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" size="default" className="h-10 text-base" onClick={() => handleReportExport('pdf')}>
              <FileDown className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="default" className="h-10 text-base" onClick={() => handleReportExport('csv')}>
              <FileText className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" size="default" className="h-10 text-base" onClick={onShare}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <ReportResultsTable
            rows={rows}
            selectedFields={selectedFields}
            groupBy={groupBy}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={onSort}
          />
        </div>
        <div className="flex shrink-0 items-center justify-between border-t px-6 py-3.5">
          <p className="text-base text-muted-foreground">
            Showing {rowCount} of {rowCount} results
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
