import { useState }           from 'react'
import { Badge }              from '@/components/ui/badge'
import { Button }             from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea }           from '@/components/ui/textarea'
import { CheckCircle2, XCircle, FileText, AlertTriangle, Link } from 'lucide-react'
import { DetailPageShell }    from '@/components/shared/DetailPageShell'
import { AuditTabContent }    from '@/components/shared/AuditTabContent'
import { SignatureTabContent } from '@/components/shared/SignatureTabContent'
import { useDisposals }       from '@/features/assets/hooks/useAssets'
import {
  useSubmitDisposalForReview,
  useApproveDisposalReview,
  useApproveDisposal,
  useRejectDisposal,
  useExecuteDisposal,
  useCompleteDisposal,
} from '@/features/assets/hooks/useAssetMutations'
import {
  getDisposalStatusColor,
  getDisposalStatusLabel,
  getDisposalMethodLabel,
  getDisposalMethodColor,
} from '@/features/assets/types/disposalTypes'
import type { DisposalRequest, DisposalSignature } from '@/features/assets/types/disposalTypes'
import type { SignatureStep } from '@/types'

const TABS = [
  { key: 'overview',    label: 'Overview' },
  { key: 'assets',      label: 'Assets' },
  { key: 'financial',   label: 'Financial' },
  { key: 'documents',   label: 'Documents' },
  { key: 'signatures',  label: 'Signatures' },
  { key: 'audit',       label: 'Audit' },
] as const

interface DisposalDetailViewProps {
  id:     string
  onBack: () => void
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function toSignatureSteps(sigs: DisposalSignature[]): SignatureStep[] {
  const LABELS: Record<string, string> = {
    requesting_officer:  'Requesting Officer',
    finance_reviewer:    'Finance Reviewer',
    approving_authority: 'Approving Authority',
    disposal_officer:    'Disposal Officer',
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

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <p className="text-13 text-muted-foreground font-['Manrope']">{label}</p>
      <p className="text-15 font-['Manrope']">{value}</p>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-13 font-semibold uppercase tracking-wide text-muted-foreground mb-3">
      {children}
    </p>
  )
}

function OverviewTab({ d }: { d: DisposalRequest }) {
  return (
    <div className="space-y-4">
      {/* Personnel */}
      <div className="p-4 rounded-[6px] bg-muted/40 border">
        <SectionLabel>Personnel</SectionLabel>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <InfoRow label="Requested By"   value={d.requestedBy} />
          <InfoRow label="Reviewed By"    value={d.reviewedBy} />
          <InfoRow label="Approved By"    value={d.approvedBy} />
          <InfoRow label="Disposal Officer" value={d.disposalOfficer} />
          <InfoRow label="Field Office"   value={d.fieldOffice} />
          <div>
            <p className="text-13 text-muted-foreground font-['Manrope']">Workflow Type</p>
            <Badge className="mt-1 capitalize text-13">{d.workflowType}</Badge>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="p-4 rounded-[6px] bg-muted/40 border">
        <SectionLabel>Schedule</SectionLabel>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <InfoRow label="Requested Date"     value={d.requestedDate} />
          {d.reviewDate    && <InfoRow label="Review Date"        value={d.reviewDate} />}
          {d.approvalDate  && <InfoRow label="Approval Date"      value={d.approvalDate} />}
          <InfoRow label="Target Disposal Date" value={d.targetDisposalDate} />
          {d.actualDisposalDate && (
            <div>
              <p className="text-13 text-muted-foreground font-['Manrope']">Actual Disposal Date</p>
              <p className="text-15 font-['Manrope'] text-green-600 dark:text-green-400">{d.actualDisposalDate}</p>
            </div>
          )}
        </div>
      </div>

      {/* Justification */}
      {d.justification && (
        <div className="p-4 rounded-[6px] bg-muted/40 border">
          <SectionLabel>Justification</SectionLabel>
          <p className="text-15 font-['Manrope'] whitespace-pre-wrap">{d.justification}</p>
        </div>
      )}

      {/* Notes */}
      {d.notes && (
        <div className="p-4 rounded-[6px] bg-muted/40 border">
          <SectionLabel>Notes</SectionLabel>
          <p className="text-15 font-['Manrope'] whitespace-pre-wrap">{d.notes}</p>
        </div>
      )}

      {/* Compliance */}
      <div className="p-4 rounded-[6px] bg-muted/40 border">
        <SectionLabel>Compliance</SectionLabel>
        <div className="space-y-2">
          {[
            { ok: d.environmentalCompliance, label: 'Environmental Compliance' },
            { ok: d.dataWipeCertified,        label: 'Data Wipe Certified' },
            { ok: d.certificateOfDestruction, label: 'Certificate of Destruction' },
          ].map(({ ok, label }) => (
            <div key={label} className="flex items-center gap-2 text-15 font-['Manrope']">
              {ok
                ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                : <XCircle      className="w-4 h-4 text-red-500 shrink-0" />}
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Linked survey */}
      {d.linkedSurveyId && (
        <div className="p-4 rounded-[6px] bg-blue-500/10 border border-blue-500/20 flex items-center gap-2 text-15 font-['Manrope'] text-blue-700 dark:text-blue-300">
          <Link className="w-4 h-4 shrink-0" />
          <span>Linked Survey: <span className="font-semibold">{d.linkedSurveyId}</span></span>
        </div>
      )}

      {/* Asset lock */}
      {d.assetsLocked && (
        <div className="p-4 rounded-[6px] bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-15 font-['Manrope'] text-amber-700 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Assets Locked during disposal process</span>
        </div>
      )}
    </div>
  )
}

function AssetsTab({ d }: { d: DisposalRequest }) {
  const totalAcq = d.assets.reduce((s, a) => s + a.acquisitionValue, 0)
  const totalNBV = d.assets.reduce((s, a) => s + a.currentNBV, 0)
  const totalDis = d.assets.reduce((s, a) => s + a.disposalValue, 0)
  return (
    <div className="p-4 rounded-[6px] bg-muted/40 border overflow-x-auto">
      <table className="w-full text-15 font-['Manrope']">
        <thead>
          <tr className="border-b text-13 text-muted-foreground">
            {['Asset ID','Name','Serial','Location','Condition','Acq. Value','NBV','Disp. Value','Reason'].map(h => (
              <th key={h} className="text-left py-2 pr-4 font-semibold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {d.assets.map(a => (
            <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="py-2 pr-4 whitespace-nowrap">{a.assetId}</td>
              <td className="py-2 pr-4 whitespace-nowrap">{a.name}</td>
              <td className="py-2 pr-4 whitespace-nowrap text-muted-foreground">{a.serialNumber}</td>
              <td className="py-2 pr-4 whitespace-nowrap">{a.currentLocation}</td>
              <td className="py-2 pr-4 whitespace-nowrap">{a.condition}</td>
              <td className="py-2 pr-4 whitespace-nowrap">{fmt(a.acquisitionValue)}</td>
              <td className="py-2 pr-4 whitespace-nowrap">{fmt(a.currentNBV)}</td>
              <td className="py-2 pr-4 whitespace-nowrap">{fmt(a.disposalValue)}</td>
              <td className="py-2 pr-4">{a.reason}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t font-semibold text-15">
            <td colSpan={5} className="py-2 pr-4">Total</td>
            <td className="py-2 pr-4">{fmt(totalAcq)}</td>
            <td className="py-2 pr-4">{fmt(totalNBV)}</td>
            <td className="py-2 pr-4">{fmt(totalDis)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function FinancialTab({ d }: { d: DisposalRequest }) {
  const tiles = [
    { label: 'Total Acquisition Value',    value: d.totalAcquisitionValue, red: false },
    { label: 'Current NBV',                value: d.totalNBV,              red: false },
    { label: 'Expected Disposal Proceeds', value: d.totalDisposalValue,    red: false },
    { label: 'Write-Off Amount',           value: d.writeOffAmount,        red: d.writeOffAmount > 0 },
  ]
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map(t => (
          <div key={t.label} className="p-4 rounded-[6px] bg-muted/40 border">
            <p className="text-13 text-muted-foreground font-['Manrope'] mb-1">{t.label}</p>
            <p className={`text-[22px] font-bold font-['Manrope'] ${t.red ? 'text-red-600 dark:text-red-400' : ''}`}>
              {fmt(t.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-[6px] bg-muted/40 border overflow-x-auto">
        <SectionLabel>Per-Asset Breakdown</SectionLabel>
        <table className="w-full text-15 font-['Manrope']">
          <thead>
            <tr className="border-b text-13 text-muted-foreground">
              {['Asset ID','Name','Acq. Value','NBV','Disp. Value','Write-Off','Method'].map(h => (
                <th key={h} className="text-left py-2 pr-4 font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.assets.map(a => {
              const wo = a.acquisitionValue - a.disposalValue
              return (
                <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="py-2 pr-4 whitespace-nowrap">{a.assetId}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">{a.name}</td>
                  <td className="py-2 pr-4">{fmt(a.acquisitionValue)}</td>
                  <td className="py-2 pr-4">{fmt(a.currentNBV)}</td>
                  <td className="py-2 pr-4">{fmt(a.disposalValue)}</td>
                  <td className={`py-2 pr-4 ${wo > 0 ? 'text-red-600 dark:text-red-400' : ''}`}>{fmt(wo)}</td>
                  <td className="py-2 pr-4">
                    <Badge className={`text-[12px] ${getDisposalMethodColor(d.disposalMethod)}`}>
                      {getDisposalMethodLabel(d.disposalMethod)}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t font-semibold">
              <td colSpan={2} className="py-2 pr-4">Total</td>
              <td className="py-2 pr-4">{fmt(d.totalAcquisitionValue)}</td>
              <td className="py-2 pr-4">{fmt(d.totalNBV)}</td>
              <td className="py-2 pr-4">{fmt(d.totalDisposalValue)}</td>
              <td className={`py-2 pr-4 ${d.writeOffAmount > 0 ? 'text-red-600 dark:text-red-400' : ''}`}>{fmt(d.writeOffAmount)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function DocumentsTab({ d }: { d: DisposalRequest }) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-[6px] bg-muted/40 border">
        <SectionLabel>Attachments</SectionLabel>
        {d.attachments.length === 0
          ? <p className="text-15 text-muted-foreground font-['Manrope']">No attachments uploaded.</p>
          : (
            <ul className="space-y-2">
              {d.attachments.map(file => (
                <li key={file} className="flex items-center justify-between gap-4 text-15 font-['Manrope']">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>{file}</span>
                  </div>
                  <Badge variant="outline" className="text-[12px] cursor-pointer hover:bg-muted">View</Badge>
                </li>
              ))}
            </ul>
          )}
      </div>

      <div className="p-4 rounded-[6px] bg-muted/40 border">
        <SectionLabel>Certificate of Destruction</SectionLabel>
        <div className="flex items-center gap-2 text-15 font-['Manrope'] mb-4">
          {d.certificateOfDestruction
            ? <><CheckCircle2 className="w-4 h-4 text-green-500" /><span>Certificate issued</span></>
            : <><FileText    className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Not yet issued</span></>}
        </div>
        <Button variant="outline" size="sm" className="text-13 gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Generate Disposal Report
        </Button>
      </div>
    </div>
  )
}

export function DisposalDetailView({ id, onBack }: DisposalDetailViewProps) {
  const [tab,          setTab]          = useState('overview')
  const [rejectOpen,   setRejectOpen]   = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const { data: all = [] } = useDisposals()
  const disposal = all.find((d: DisposalRequest) => d.id === id)

  const submitForReview  = useSubmitDisposalForReview()
  const approveReview    = useApproveDisposalReview()
  const approveDisposal  = useApproveDisposal()
  const rejectDisposal   = useRejectDisposal()
  const executeDisposal  = useExecuteDisposal()
  const completeDisposal = useCompleteDisposal()

  if (!disposal) {
    return (
      <div className="py-20 text-center text-muted-foreground text-15 font-['Manrope']">
        Disposal request not found.
      </div>
    )
  }

  const headerActions = (
    <>
      {disposal.status === 'draft' && (
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-13"
          onClick={() => submitForReview.mutate({ id })}>
          Submit for Review
        </Button>
      )}
      {disposal.status === 'pending-review' && (
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-13"
          onClick={() => approveReview.mutate({ id })}>
          Approve Review
        </Button>
      )}
      {disposal.status === 'pending-approval' && (
        <>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-13"
            onClick={() => approveDisposal.mutate({ id })}>
            Approve Disposal
          </Button>
          <Button size="sm" variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 text-13"
            onClick={() => setRejectOpen(true)}>
            Reject
          </Button>
        </>
      )}
      {disposal.status === 'approved' && (
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-13"
          onClick={() => executeDisposal.mutate({ id })}>
          Execute Disposal
        </Button>
      )}
      {disposal.status === 'in-progress' && (
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-13"
          onClick={() => completeDisposal.mutate({ id })}>
          Mark Complete
        </Button>
      )}
    </>
  )

  const badges = (
    <div className="flex items-center gap-2">
      <Badge className={`text-13 ${getDisposalStatusColor(disposal.status)}`}>
        {getDisposalStatusLabel(disposal.status)}
      </Badge>
      <Badge className={`text-13 ${getDisposalMethodColor(disposal.disposalMethod)}`}>
        {getDisposalMethodLabel(disposal.disposalMethod)}
      </Badge>
    </div>
  )

  const tabsWithBadges = TABS.map(t => ({
    ...t,
    badge: t.key === 'assets'     ? disposal.assets.length
         : t.key === 'documents'  ? disposal.attachments.length
         : t.key === 'signatures' ? disposal.signatures.length
         : undefined,
  }))

  return (
    <>
      <DetailPageShell
        breadcrumbLabel="Disposal Requests"
        onBack={onBack}
        recordId={disposal.disposalId}
        title={disposal.title}
        badges={badges}
        headerActions={headerActions}
        tabs={tabsWithBadges}
        activeTab={tab}
        onTabChange={setTab}
      >
        {tab === 'overview'   && <OverviewTab   d={disposal} />}
        {tab === 'assets'     && <AssetsTab     d={disposal} />}
        {tab === 'financial'  && <FinancialTab  d={disposal} />}
        {tab === 'documents'  && <DocumentsTab  d={disposal} />}
        {tab === 'signatures' && (
          <SignatureTabContent
            recordId={id}
            recordType="disposal"
            signatures={toSignatureSteps(disposal.signatures)}
            currentUserRole="requesting_officer"
          />
        )}
        {tab === 'audit' && <AuditTabContent entries={disposal.auditTrail} />}
      </DetailPageShell>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-17 font-['Manrope']">Reject Disposal Request</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-13 text-muted-foreground mb-2 font-['Manrope']">
              Please provide a reason for rejecting this disposal request.
            </p>
            <Textarea
              placeholder="Enter rejection reason…"
              className="text-15 font-['Manrope'] min-h-[100px]"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" className="text-13" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button size="sm"
              className="bg-red-600 hover:bg-red-700 text-white text-13"
              disabled={!rejectReason.trim()}
              onClick={() => {
                rejectDisposal.mutate({ id, reason: rejectReason })
                setRejectOpen(false)
                setRejectReason('')
              }}>
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
