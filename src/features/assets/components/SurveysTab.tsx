import { useState, useMemo } from 'react'
import {
  Plus, MoreHorizontal, Search, Columns3, Download,
  ClipboardList, Clock, CheckCheck, Play, AlertCircle,
  FileText, TrendingUp, XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { useSurveys } from '../hooks/useAssets'
import { TablePagination } from '@/components/shared'
import { useTablePagination } from '@/hooks/useTablePagination'
import { useAppSelector } from '@/store/hooks'
import { defaultSurveyColumns } from '../constants/surveyColumns'
import {
  getSurveyStatusColor, getSurveyStatusLabel,
  getSurveyTypeColor, getSurveyTypeLabel,
} from '../types/surveyTypes'
import type { AssetColumnConfig } from '../types'
import type { SurveyRequest, SurveyStatus } from '../types/surveyTypes'

type SubView = 'all' | 'mine' | 'pending-approval' | 'in-progress'

const STAT_CARDS = [
  { key: 'total',           label: 'Total Surveys',     color: 'bg-slate-500/10 text-slate-600',   Icon: ClipboardList  },
  { key: 'in-progress',     label: 'In Progress',       color: 'bg-amber-500/10 text-amber-600',   Icon: Play           },
  { key: 'reconciliation',  label: 'Reconciliation',    color: 'bg-purple-500/10 text-purple-600', Icon: TrendingUp     },
  { key: 'pending-approval',label: 'Pending Approval',  color: 'bg-orange-500/10 text-orange-600', Icon: Clock          },
  { key: 'completed',       label: 'Completed',         color: 'bg-green-500/10 text-green-600',   Icon: CheckCheck     },
  { key: 'planned',         label: 'Planned',           color: 'bg-blue-500/10 text-blue-600',     Icon: FileText       },
  { key: 'cancelled',       label: 'Cancelled',         color: 'bg-gray-500/10 text-gray-600',     Icon: XCircle        },
]

interface SurveysTabProps {
  onViewDetail: (survey: SurveyRequest) => void
  onCreateSurvey: () => void
  onStart:        (id: string) => void
  onComplete:     (id: string) => void
  onSubmit:       (id: string) => void
  onApprove:      (id: string) => void
}

export function SurveysTab({
  onViewDetail, onCreateSurvey, onStart, onComplete, onSubmit, onApprove,
}: SurveysTabProps) {
  const currentUser = useAppSelector((state) => state.auth.user?.name ?? '')
  const { data: surveys = [], isLoading } = useSurveys()

  const [subView,    setSubView]    = useState<SubView>('all')
  const [search,     setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [columns, setColumns] = useState<AssetColumnConfig<SurveyRequest>[]>(defaultSurveyColumns)

  const counts = useMemo(() => ({
    total:            surveys.length,
    'in-progress':    surveys.filter((s) => s.status === 'in-progress').length,
    reconciliation:   surveys.filter((s) => s.status === 'reconciliation').length,
    'pending-approval': surveys.filter((s) => s.status === 'pending-approval').length,
    completed:        surveys.filter((s) => s.status === 'completed').length,
    planned:          surveys.filter((s) => s.status === 'planned').length,
    cancelled:        surveys.filter((s) => s.status === 'cancelled').length,
  }), [surveys])

  const filtered = useMemo(() => {
    let list = surveys
    if (subView === 'mine')            list = list.filter((s) => s.surveyTeamLead === currentUser)
    if (subView === 'pending-approval') list = list.filter((s) => s.status === 'pending-approval')
    if (subView === 'in-progress')     list = list.filter((s) => s.status === 'in-progress' || s.status === 'reconciliation')
    if (statusFilter !== 'all')        list = list.filter((s) => s.status === statusFilter)
    if (typeFilter !== 'all')          list = list.filter((s) => s.surveyType === typeFilter)
    if (search.trim())                 list = list.filter((s) =>
      s.surveyId.toLowerCase().includes(search.toLowerCase()) ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.surveyTeamLead.toLowerCase().includes(search.toLowerCase()) ||
      s.fieldOffice.toLowerCase().includes(search.toLowerCase())
    )
    return list
  }, [surveys, subView, statusFilter, typeFilter, search, currentUser])

  const { page, rowsPerPage, setPage, setRowsPerPage, pageData } = useTablePagination(
    filtered,
    [search, statusFilter, typeFilter, subView],
  )

  const visibleCols = columns.filter((c) => c.visible)

  const subTabs: { key: SubView; label: string; badge?: number }[] = [
    { key: 'all',             label: 'All Surveys' },
    { key: 'mine',            label: 'My Surveys' },
    { key: 'pending-approval', label: 'Pending Approval', badge: counts['pending-approval'] },
    { key: 'in-progress',     label: 'Active',            badge: counts['in-progress'] + counts.reconciliation },
  ]

  return (
    <div className="space-y-4">
      {/* Stats strip */}
      <div className="grid grid-cols-4 lg:grid-cols-7 gap-3">
        {STAT_CARDS.map(({ key, label, color, Icon }) => (
          <Card key={key} className="shadow-none border">
            <CardContent className="p-3 flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[22px] font-bold leading-none">{key === 'total' ? counts.total : counts[key as keyof typeof counts] ?? 0}</p>
                <p className="text-[12px] text-muted-foreground truncate">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sub-view tabs */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit flex-wrap">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSubView(tab.key)}
            className={`px-3 py-1.5 rounded-[4px] text-15 transition-colors flex items-center gap-1.5 ${
              subView === tab.key ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-[4px] text-[12px] bg-orange-500 text-white">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, title, team lead, office…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-15"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          disabled={subView === 'pending-approval' || subView === 'in-progress'}
        >
          <SelectTrigger className="h-10 w-44 text-15"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-15">All Status</SelectItem>
            <SelectItem value="draft" className="text-15">Draft</SelectItem>
            <SelectItem value="planned" className="text-15">Planned</SelectItem>
            <SelectItem value="in-progress" className="text-15">In Progress</SelectItem>
            <SelectItem value="reconciliation" className="text-15">Reconciliation</SelectItem>
            <SelectItem value="pending-approval" className="text-15">Pending Approval</SelectItem>
            <SelectItem value="completed" className="text-15">Completed</SelectItem>
            <SelectItem value="cancelled" className="text-15">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-10 w-44 text-15"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-15">All Types</SelectItem>
            <SelectItem value="full-count" className="text-15">Full Count</SelectItem>
            <SelectItem value="sample-based" className="text-15">Sample-Based</SelectItem>
            <SelectItem value="location-based" className="text-15">Location-Based</SelectItem>
            <SelectItem value="custodian-based" className="text-15">Custodian-Based</SelectItem>
            <SelectItem value="high-value" className="text-15">High-Value</SelectItem>
          </SelectContent>
        </Select>

        {/* Column toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 text-15 gap-1.5">
              <Columns3 className="w-4 h-4" />Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {columns.map((col) => (
              <DropdownMenuCheckboxItem
                key={String(col.key)}
                checked={col.visible}
                onCheckedChange={(checked) =>
                  setColumns((prev) => prev.map((c) => c.key === col.key ? { ...c, visible: checked } : c))
                }
                className="text-15"
              >
                {col.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" className="h-10 text-15 gap-1.5">
          <Download className="w-4 h-4" />Export
        </Button>

        <Button
          size="sm"
          className="h-10 bg-brand-navy hover:bg-brand-navy-mid text-white text-15 gap-1.5 ml-auto"
          onClick={onCreateSurvey}
        >
          <Plus className="w-4 h-4" />Create Survey
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-15">Loading surveys…</div>
      ) : filtered.length > 0 ? (
        <div className="rounded-[6px] border overflow-hidden">
          <div className="overflow-auto max-h-[calc(100vh-500px)] scrollbar-hide font-['Manrope']">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  {visibleCols.map((col) => (
                    <TableHead key={String(col.key)} className="text-15 font-semibold whitespace-nowrap px-4 py-3">
                      {col.label}
                    </TableHead>
                  ))}
                  <TableHead className="w-12 text-15 font-semibold px-4 py-3" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.map((survey) => (
                  <TableRow
                    key={survey.id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => onViewDetail(survey)}
                  >
                    {visibleCols.map((col) => (
                      <TableCell key={String(col.key)} className="px-4 py-3 text-15">
                        {renderCell(survey, col.key as keyof SurveyRequest)}
                      </TableCell>
                    ))}
                    <TableCell className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem onClick={() => onViewDetail(survey)} className="text-15">
                            View Detail
                          </DropdownMenuItem>
                          {survey.status === 'planned' && (
                            <DropdownMenuItem onClick={() => onStart(survey.id)} className="text-15">
                              <Play className="w-4 h-4 mr-2" />Start Survey
                            </DropdownMenuItem>
                          )}
                          {survey.status === 'in-progress' && (
                            <DropdownMenuItem onClick={() => onComplete(survey.id)} className="text-15">
                              <CheckCheck className="w-4 h-4 mr-2" />Complete Survey
                            </DropdownMenuItem>
                          )}
                          {survey.status === 'reconciliation' && (
                            <DropdownMenuItem onClick={() => onSubmit(survey.id)} className="text-15">
                              <FileText className="w-4 h-4 mr-2" />Submit for Approval
                            </DropdownMenuItem>
                          )}
                          {survey.status === 'pending-approval' && (
                            <DropdownMenuItem onClick={() => onApprove(survey.id)} className="text-15">
                              <CheckCheck className="w-4 h-4 mr-2" />Approve Survey
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            totalItems={filtered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            totalUnfilteredItems={surveys.length}
            itemLabel="surveys"
          />
        </div>
      ) : (
        <div className="text-center py-12 px-6">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <h3 className="text-15 font-medium mb-1">No surveys found</h3>
          <p className="text-15 text-muted-foreground mb-4">
            {search || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'Create a survey to begin physical asset verification.'}
          </p>
          {!search && statusFilter === 'all' && typeFilter === 'all' && (
            <Button size="sm" className="bg-brand-navy text-white text-15" onClick={onCreateSurvey}>
              <Plus className="w-4 h-4 mr-1.5" />Create Survey
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function renderCell(survey: SurveyRequest, key: keyof SurveyRequest): React.ReactNode {
  switch (key) {
    case 'surveyId':
      return <span className="font-medium">{survey.surveyId}</span>
    case 'surveyType':
      return (
        <Badge variant="outline" className={`text-[12px] ${getSurveyTypeColor(survey.surveyType)}`}>
          {getSurveyTypeLabel(survey.surveyType)}
        </Badge>
      )
    case 'title':
      return (
        <div>
          <p className="font-medium max-w-[240px] truncate">{survey.title}</p>
          <p className="text-13 text-muted-foreground truncate max-w-[240px]">{survey.scope}</p>
        </div>
      )
    case 'status':
      return (
        <Badge variant="outline" className={`text-[12px] ${getSurveyStatusColor(survey.status as SurveyStatus)}`}>
          {getSurveyStatusLabel(survey.status as SurveyStatus)}
        </Badge>
      )
    case 'fieldOffice':
      return (
        <div>
          <p>{survey.fieldOffice}</p>
          <p className="text-13 text-muted-foreground">{survey.targetLocations.slice(0, 2).join(', ')}{survey.targetLocations.length > 2 ? ` +${survey.targetLocations.length - 2}` : ''}</p>
        </div>
      )
    case 'surveyTeamLead':
      return (
        <div>
          <p>{survey.surveyTeamLead}</p>
          <p className="text-13 text-muted-foreground">{survey.surveyors.length} surveyor{survey.surveyors.length !== 1 ? 's' : ''}</p>
        </div>
      )
    case 'accuracyRate':
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full ${survey.accuracyRate >= 95 ? 'bg-green-500' : survey.accuracyRate >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${survey.accuracyRate}%` }}
            />
          </div>
          <span>{survey.accuracyRate > 0 ? `${survey.accuracyRate.toFixed(1)}%` : '—'}</span>
        </div>
      )
    case 'plannedStartDate':
      return (
        <div>
          <p>{new Date(survey.plannedStartDate).toLocaleDateString()}</p>
          {survey.actualStartDate && (
            <p className="text-13 text-muted-foreground">Started {new Date(survey.actualStartDate).toLocaleDateString()}</p>
          )}
        </div>
      )
    case 'plannedEndDate':
      return new Date(survey.plannedEndDate).toLocaleDateString()
    case 'totalExpected':
      return survey.totalExpected
    case 'totalVerified':
      return `${survey.totalVerified} / ${survey.totalExpected}`
    case 'totalDiscrepancies':
      return survey.totalDiscrepancies > 0
        ? <span className="text-red-600 font-medium">{survey.totalDiscrepancies}</span>
        : <span className="text-green-600">0</span>
    case 'createdBy':
      return survey.createdBy
    default:
      return null
  }
}
