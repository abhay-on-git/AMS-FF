import { useState }            from 'react'
import { Badge }               from '@/components/ui/badge'
import { Button }              from '@/components/ui/button'
import { CheckCircle2, Clock, FileText, MapPin, AlertTriangle } from 'lucide-react'
import { DetailPageShell }     from '@/components/shared/DetailPageShell'
import { AuditTabContent }     from '@/components/shared/AuditTabContent'
import { SignatureTabContent } from '@/components/shared/SignatureTabContent'
import { useSurveys }          from '@/features/assets/hooks/useAssets'
import { useStartSurvey, useCompleteSurvey, useSubmitSurveyForApproval, useApproveSurvey } from '@/features/assets/hooks/useAssetMutations'
import {
  getSurveyStatusColor, getSurveyStatusLabel,
  getSurveyTypeLabel, getSurveyTypeColor,
  getDiscrepancyColor, getDiscrepancyLabel,
} from '@/features/assets/types/surveyTypes'
import type { SurveyRequest, SurveySignature } from '@/features/assets/types/surveyTypes'
import type { SignatureStep } from '@/types'

interface SurveyDetailViewProps {
  id:     string
  onBack: () => void
}

function toSignatureSteps(sigs: SurveySignature[]): SignatureStep[] {
  const LABELS: Record<string, string> = {
    surveyor:  'Surveyor',
    team_lead: 'Team Lead',
    approver:  'Approver',
  }
  return sigs.map((s, i) => ({
    id:       String(i),
    role:     s.role,
    label:    LABELS[s.role] ?? s.role,
    signedBy: s.name,
    signedAt: s.signedDate,
    status:   s.status === 'declined' ? 'rejected' : s.status,
  }))
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-[13px] text-muted-foreground shrink-0">{label}</span>
      <span className="text-[15px] font-['Manrope'] text-right">{children}</span>
    </div>
  )
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">{children}</p>
}

function OverviewTab({ survey }: { survey: SurveyRequest }) {
  const rate = survey.accuracyRate
  const barColor = rate >= 90 ? 'bg-green-500' : rate >= 70 ? 'bg-amber-500' : 'bg-red-500'
  const stats = [
    { label: 'Expected Assets', value: survey.totalExpected,      sfx: '',  red: false },
    { label: 'Verified',        value: survey.totalVerified,      sfx: '',  red: false },
    { label: 'Discrepancies',   value: survey.totalDiscrepancies, sfx: '',  red: survey.totalDiscrepancies > 0 },
    { label: 'Accuracy Rate',   value: survey.accuracyRate,       sfx: '%', red: false },
  ]
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(t => (
          <div key={t.label} className="p-4 rounded-[6px] bg-muted/40 border">
            <p className="text-[13px] text-muted-foreground">{t.label}</p>
            <p className={`text-[22px] font-bold font-['Manrope'] ${t.red ? 'text-red-600 dark:text-red-400' : ''}`}>{t.value}{t.sfx}</p>
          </div>
        ))}
      </div>
      <div className="p-4 rounded-[6px] bg-muted/40 border space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted-foreground">Accuracy Rate</span>
          <span className="text-[13px] font-semibold font-['Manrope']">{rate}%</span>
        </div>
        <div className="bg-muted rounded-full h-3">
          <div className={`rounded-full h-3 transition-all ${barColor}`} style={{ width: `${Math.min(rate, 100)}%` }} />
        </div>
      </div>

      <div className="p-4 rounded-[6px] bg-muted/40 border divide-y">
        <SectionHead>Team &amp; Locations</SectionHead>
        <InfoRow label="Team Lead"><span className="font-bold">{survey.surveyTeamLead}</span></InfoRow>
        <InfoRow label="Surveyors">{survey.surveyors.join(', ')}</InfoRow>
        <InfoRow label="Field Office">{survey.fieldOffice}</InfoRow>
        <InfoRow label="Target Locations">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            {survey.targetLocations.join(', ')}
          </span>
        </InfoRow>
      </div>

      <div className="p-4 rounded-[6px] bg-muted/40 border divide-y">
        <SectionHead>Schedule</SectionHead>
        <InfoRow label="Planned Start">{survey.plannedStartDate}</InfoRow>
        <InfoRow label="Planned End">{survey.plannedEndDate}</InfoRow>
        {survey.actualStartDate && <InfoRow label="Actual Start">{survey.actualStartDate}</InfoRow>}
        {survey.actualEndDate   && <InfoRow label="Actual End">{survey.actualEndDate}</InfoRow>}
        <InfoRow label="Workflow Type">
          <Badge className="bg-slate-500/10 text-slate-700 dark:text-slate-300 capitalize">{survey.workflowType}</Badge>
        </InfoRow>
      </div>

      {(survey.scope || survey.description) && (
        <div className="p-4 rounded-[6px] bg-muted/40 border space-y-1">
          <SectionHead>Scope &amp; Description</SectionHead>
          {survey.scope       && <p className="text-[15px] font-['Manrope']">{survey.scope}</p>}
          {survey.description && <p className="text-[13px] text-muted-foreground font-['Manrope']">{survey.description}</p>}
        </div>
      )}

      {survey.linkedDisposalId && (
        <div className="p-3 rounded-[6px] bg-blue-500/10 border border-blue-500/20 flex items-center gap-2 text-[13px] text-blue-700 dark:text-blue-300 font-['Manrope']">
          <FileText className="w-4 h-4 shrink-0" />
          Linked Disposal: <span className="font-semibold underline cursor-pointer">{survey.linkedDisposalId}</span>
        </div>
      )}

      {survey.assetsLocked && (
        <div className="p-3 rounded-[6px] bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-[13px] text-amber-700 dark:text-amber-300 font-['Manrope']">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300">Assets Locked</Badge>
          Assets in this survey are currently locked for editing.
        </div>
      )}
    </div>
  )
}

function AssetsTab({ survey }: { survey: SurveyRequest }) {
  return (
    <div className="p-4 rounded-[6px] bg-muted/40 border overflow-x-auto">
      <table className="w-full text-[15px]">
        <thead>
          <tr className="border-b">
            {['Asset ID', 'Name', 'Serial', 'Expected Location', 'Actual Location', 'Condition', 'NBV', 'Status'].map(h => (
              <th key={h} className="text-left text-[13px] font-semibold text-muted-foreground uppercase tracking-wide pb-2 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {survey.assets.map(a => {
            const locationMismatch = a.actualLocation !== a.expectedLocation
            return (
              <tr key={a.id}>
                <td className="py-2 pr-4 font-['Manrope']">{a.assetId}</td>
                <td className="py-2 pr-4 font-['Manrope']">{a.name}</td>
                <td className="py-2 pr-4 font-['Manrope'] text-muted-foreground">{a.serialNumber}</td>
                <td className="py-2 pr-4 font-['Manrope'] text-muted-foreground">{a.expectedLocation}</td>
                <td className={`py-2 pr-4 font-['Manrope'] ${locationMismatch ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-muted-foreground'}`}>
                  {a.actualLocation}
                </td>
                <td className="py-2 pr-4 font-['Manrope']">{a.actualCondition}</td>
                <td className="py-2 pr-4 font-['Manrope']">
                  {a.nbv != null ? a.nbv.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '—'}
                </td>
                <td className="py-2 pr-4">
                  {a.discrepancy
                    ? <Badge className={getDiscrepancyColor(a.discrepancy)}>{getDiscrepancyLabel(a.discrepancy)}</Badge>
                    : <Badge className="bg-green-500/10 text-green-700 dark:text-green-300">Verified</Badge>}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot className="border-t">
          <tr>
            <td colSpan={8} className="pt-2 text-[13px] text-muted-foreground font-semibold">
              {survey.assets.length} asset{survey.assets.length !== 1 ? 's' : ''}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function DiscrepanciesTab({ survey }: { survey: SurveyRequest }) {
  const discrepancyAssets = survey.assets.filter(a => a.discrepancy)

  if (!discrepancyAssets.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
        <CheckCircle2 className="w-8 h-8 opacity-40 text-green-500" />
        <p className="text-[15px]">No discrepancies found</p>
      </div>
    )
  }

  return (
    <div>
      {discrepancyAssets.map(a => (
        <div key={a.id} className="p-4 rounded-[6px] border mb-3">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="text-[15px] font-bold font-['Manrope']">{a.name}</p>
              <p className="text-[13px] text-muted-foreground font-['Manrope']">{a.assetId}</p>
            </div>
            {a.discrepancy && (
              <Badge className={getDiscrepancyColor(a.discrepancy)}>{getDiscrepancyLabel(a.discrepancy)}</Badge>
            )}
          </div>
          <div className="divide-y">
            <InfoRow label="Expected Location">{a.expectedLocation}</InfoRow>
            <InfoRow label="Actual Location">
              <span className="text-amber-600 dark:text-amber-400">{a.actualLocation}</span>
            </InfoRow>
            <InfoRow label="Expected Condition">{a.expectedCondition}</InfoRow>
            <InfoRow label="Actual Condition">{a.actualCondition}</InfoRow>
            {a.notes && <InfoRow label="Notes">{a.notes}</InfoRow>}
          </div>
        </div>
      ))}
    </div>
  )
}

function DocumentsTab({ survey }: { survey: SurveyRequest }) {
  return (
    <div className="space-y-4">
      {/* Report status */}
      <div className="p-4 rounded-[6px] bg-muted/40 border flex items-center gap-3">
        {survey.reportGenerated ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <Clock className="w-5 h-5 text-muted-foreground shrink-0" />}
        <span className="text-[15px] font-['Manrope']">{survey.reportGenerated ? 'Survey Report Generated' : 'Report Pending'}</span>
        <Button size="sm" variant="outline" className="ml-auto gap-1.5" onClick={() => {}}>
          <FileText className="w-4 h-4" />Generate Report
        </Button>
      </div>

      {/* Attachments */}
      <div className="p-4 rounded-[6px] bg-muted/40 border">
        <SectionHead>Attachments</SectionHead>
        {survey.attachments.length === 0
          ? <p className="text-[13px] text-muted-foreground font-['Manrope']">No attachments uploaded.</p>
          : (
            <div className="space-y-2">
              {survey.attachments.map((file, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 border-b last:border-0">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-[15px] font-['Manrope'] flex-1">{file}</span>
                  <Badge className="bg-muted text-muted-foreground cursor-pointer hover:bg-muted/80 text-[12px]">View</Badge>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

export function SurveyDetailView({ id, onBack }: SurveyDetailViewProps) {
  const [tab, setTab] = useState('overview')

  const { data: all = [] } = useSurveys()
  const survey = all.find((s: SurveyRequest) => s.id === id)

  const startSurvey   = useStartSurvey()
  const completeSurvey = useCompleteSurvey()
  const submitForApproval = useSubmitSurveyForApproval()
  const approveSurvey = useApproveSurvey()

  if (!survey) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground text-[15px] font-['Manrope']">
        Survey record not found.
      </div>
    )
  }

  const TABS = [
    { key: 'overview',       label: 'Overview'       },
    { key: 'assets',         label: 'Assets'         },
    { key: 'discrepancies',  label: 'Discrepancies', badge: survey.totalDiscrepancies },
    { key: 'documents',      label: 'Documents'      },
    { key: 'signatures',     label: 'Signatures'     },
    { key: 'audit',          label: 'Audit'          },
  ] as const

  const headerActions = (
    <>
      {survey.status === 'planned' && (
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => startSurvey.mutate(id)}>
          Start Survey
        </Button>
      )}
      {survey.status === 'in-progress' && (
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => completeSurvey.mutate(id)}>
          Complete Survey
        </Button>
      )}
      {survey.status === 'reconciliation' && (
        <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => submitForApproval.mutate(id)}>
          Submit for Approval
        </Button>
      )}
      {survey.status === 'pending-approval' && (
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => approveSurvey.mutate(id)}>
          Approve Survey
        </Button>
      )}
    </>
  )

  const badges = (
    <>
      <Badge className={getSurveyStatusColor(survey.status)}>{getSurveyStatusLabel(survey.status)}</Badge>
      <Badge className={getSurveyTypeColor(survey.surveyType)}>{getSurveyTypeLabel(survey.surveyType)}</Badge>
    </>
  )

  return (
    <DetailPageShell
      breadcrumbLabel="Surveys"
      onBack={onBack}
      recordId={survey.surveyId}
      title={survey.title}
      subtitle={survey.fieldOffice}
      badges={badges}
      headerActions={headerActions}
      tabs={TABS}
      activeTab={tab}
      onTabChange={setTab}
    >
      {tab === 'overview'      && <OverviewTab survey={survey} />}
      {tab === 'assets'        && <AssetsTab survey={survey} />}
      {tab === 'discrepancies' && <DiscrepanciesTab survey={survey} />}
      {tab === 'documents'     && <DocumentsTab survey={survey} />}
      {tab === 'signatures'    && (
        <SignatureTabContent
          recordId={id}
          recordType="survey"
          signatures={toSignatureSteps(survey.signatures)}
          currentUserRole="surveyor"
        />
      )}
      {tab === 'audit' && <AuditTabContent entries={survey.auditTrail} />}
    </DetailPageShell>
  )
}
