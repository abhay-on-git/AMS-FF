import { useState }                    from 'react'
import { Badge }                        from '@/components/ui/badge'
import { Button }                       from '@/components/ui/button'
import { Alert, AlertDescription }      from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea }                     from '@/components/ui/textarea'
import { ArrowRight, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { DetailPageShell }              from '@/components/shared/DetailPageShell'
import { AuditTabContent }              from '@/components/shared/AuditTabContent'
import { SignatureTabContent }          from '@/components/shared/SignatureTabContent'
import { useTransfers }                 from '@/features/assets/hooks/useAssets'
import { useApproveTransfer, useRejectTransfer, useAcknowledgeTransfer } from '@/features/assets/hooks/useAssetMutations'
import {
  getTransferStatusColor, getTransferStatusLabel,
  getTransferTypeLabel, getTransferTypeColor,
} from '@/features/assets/types/transferTypes'
import type { TransferRequest, TransferSignature } from '@/features/assets/types/transferTypes'
import type { SignatureStep }           from '@/types'

interface TransferDetailViewProps {
  id:     string
  onBack: () => void
}

const TABS = [
  { key: 'overview',   label: 'Overview'   },
  { key: 'assets',     label: 'Assets'     },
  { key: 'signatures', label: 'Signatures' },
  { key: 'audit',      label: 'Audit'      },
] as const

function toSignatureSteps(sigs: TransferSignature[]): SignatureStep[] {
  const LABELS: Record<string, string> = {
    initiating_officer:  'Initiating Officer',
    receiving_custodian: 'Receiving Custodian',
    approving_officer:   'Approving Officer',
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

const WORKFLOW_STEPS = [
  { key: 'draft',                   label: 'Initiated'   },
  { key: 'pending-approval',        label: 'Approved'    },
  { key: 'in-transit',              label: 'In Transit'  },
  { key: 'pending-acknowledgment',  label: 'Received'    },
  { key: 'completed',               label: 'Completed'   },
]
const STATUS_ORDER: Record<string, number> = {
  draft: 0, 'pending-custodian': 0, 'pending-approval': 1,
  approved: 1, 'in-transit': 2, 'pending-acknowledgment': 3,
  completed: 4, rejected: 4, cancelled: 4,
}

function OverviewTab({ transfer }: { transfer: TransferRequest }) {
  const currentIdx = STATUS_ORDER[transfer.status] ?? 0
  const stepDates = [
    { date: transfer.initiatedDate, user: transfer.initiatedBy },
    { date: transfer.approvedDate,  user: transfer.approvedBy  },
    { date: undefined,              user: undefined            },
    { date: transfer.receivedDate,  user: transfer.receivedBy  },
    { date: transfer.completedDate, user: undefined            },
  ]

  return (
    <div className="space-y-4">
      {/* Transfer Flow */}
      <div className="p-4 rounded-[6px] bg-muted/40 border">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">Transfer Flow</p>
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-0.5">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">From</p>
            <p className="text-[15px] font-bold font-['Manrope']">{transfer.fromFieldOffice}</p>
            <p className="text-[13px] text-muted-foreground font-['Manrope']">{transfer.fromCustodian}</p>
            <p className="text-[13px] text-muted-foreground font-['Manrope']">{transfer.fromBuilding} · {transfer.fromRoom}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
          <div className="flex-1 space-y-0.5">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">To</p>
            <p className="text-[15px] font-bold font-['Manrope']">{transfer.toFieldOffice}</p>
            <p className="text-[13px] text-muted-foreground font-['Manrope']">{transfer.toCustodian}</p>
            <p className="text-[13px] text-muted-foreground font-['Manrope']">{transfer.toBuilding} · {transfer.toRoom}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 rounded-[6px] bg-muted/40 border divide-y">
        <InfoRow label="Reason">{transfer.reason}</InfoRow>
        <InfoRow label="Transfer Type">
          <Badge className={getTransferTypeColor(transfer.transferType)}>{getTransferTypeLabel(transfer.transferType)}</Badge>
        </InfoRow>
        <InfoRow label="Status">
          <Badge className={getTransferStatusColor(transfer.status)}>{getTransferStatusLabel(transfer.status)}</Badge>
        </InfoRow>
      </div>

      {/* Notes */}
      {transfer.notes && (
        <div className="p-3 rounded-[6px] bg-muted/50 border text-[15px] font-['Manrope']">{transfer.notes}</div>
      )}

      {/* Rejection info */}
      {transfer.rejectionReason && (
        <Alert className="border-amber-500/30 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-[13px] space-y-1">
            <p><span className="font-semibold">Rejected by:</span> {transfer.rejectedBy}</p>
            {transfer.rejectedDate && <p><span className="font-semibold">Date:</span> {transfer.rejectedDate}</p>}
            <p><span className="font-semibold">Reason:</span> {transfer.rejectionReason}</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Workflow Timeline */}
      <div className="p-4 rounded-[6px] bg-muted/40 border">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">Workflow Timeline</p>
        <div className="space-y-0">
          {WORKFLOW_STEPS.map((step, i) => {
            const isRejected = transfer.status === 'rejected' && i >= currentIdx
            const done    = i < currentIdx && !isRejected
            const current = i === currentIdx && !isRejected
            const info    = stepDates[i]
            return (
              <div key={step.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-green-500' : current ? 'bg-[#121321]' : 'bg-muted border'}`}>
                    {done
                      ? <CheckCircle2 className="w-4 h-4 text-white" />
                      : current
                        ? <Clock className="w-3.5 h-3.5 text-white" />
                        : <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    }
                  </div>
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <div className={`w-0.5 h-8 ${done ? 'bg-green-400' : 'bg-border'}`} />
                  )}
                </div>
                <div className="pb-2 pt-1">
                  <p className={`text-[14px] font-semibold font-['Manrope'] ${done ? 'text-green-700 dark:text-green-400' : current ? 'text-[#121321] dark:text-white' : 'text-muted-foreground'}`}>{step.label}</p>
                  {info?.date && <p className="text-[12px] text-muted-foreground font-['Manrope']">{info.date}{info.user ? ` · ${info.user}` : ''}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AssetsTab({ transfer }: { transfer: TransferRequest }) {
  const totalValue = transfer.assets.reduce((sum, a) => sum + (a.acquisitionValue ?? 0), 0)
  return (
    <div className="p-4 rounded-[6px] bg-muted/40 border overflow-x-auto">
      <table className="w-full text-[15px]">
        <thead>
          <tr className="border-b">
            {['Asset ID', 'Asset Name', 'Serial Number', 'Type', 'Location', 'Condition', 'Value'].map(h => (
              <th key={h} className="text-left text-[13px] font-semibold text-muted-foreground uppercase tracking-wide pb-2 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {transfer.assets.map(a => (
            <tr key={a.id}>
              <td className="py-2 pr-4 font-['Manrope']">{a.assetId}</td>
              <td className="py-2 pr-4 font-['Manrope']">{a.name}</td>
              <td className="py-2 pr-4 font-['Manrope'] text-muted-foreground">{a.serialNumber}</td>
              <td className="py-2 pr-4 font-['Manrope']">{a.type}</td>
              <td className="py-2 pr-4 font-['Manrope'] text-muted-foreground">{a.currentLocation}</td>
              <td className="py-2 pr-4 font-['Manrope']">{a.condition}</td>
              <td className="py-2 pr-4 font-['Manrope']">
                {a.acquisitionValue != null
                  ? a.acquisitionValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t">
          <tr>
            <td colSpan={6} className="pt-2 text-[13px] text-muted-foreground font-semibold">{transfer.assets.length} asset{transfer.assets.length !== 1 ? 's' : ''}</td>
            <td className="pt-2 font-semibold font-['Manrope']">
              {totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export function TransferDetailView({ id, onBack }: TransferDetailViewProps) {
  const [activeTab,  setActiveTab]  = useState('overview')
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const { data: all = [] }   = useTransfers()
  const transfer             = all.find((t: TransferRequest) => t.id === id)

  const approveTransfer = useApproveTransfer()
  const rejectTransfer  = useRejectTransfer()
  const ackTransfer     = useAcknowledgeTransfer()

  if (!transfer) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground text-[15px] font-['Manrope']">
        Transfer record not found.
      </div>
    )
  }

  const headerActions = (
    <>
      {transfer.status === 'pending-approval' && (
        <>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => approveTransfer.mutate(id)}>
            Approve Transfer
          </Button>
          <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" onClick={() => setRejectOpen(true)}>
            Reject
          </Button>
        </>
      )}
      {transfer.status === 'pending-acknowledgment' && (
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => ackTransfer.mutate(id)}>
          Acknowledge Receipt
        </Button>
      )}
    </>
  )

  const badges = (
    <>
      <Badge className={getTransferStatusColor(transfer.status)}>{getTransferStatusLabel(transfer.status)}</Badge>
      <Badge className={getTransferTypeColor(transfer.transferType)}>{getTransferTypeLabel(transfer.transferType)}</Badge>
    </>
  )

  return (
    <>
      <DetailPageShell
        breadcrumbLabel="Transfers"
        onBack={onBack}
        recordId={transfer.transferId}
        title={`Transfer ${transfer.transferId}`}
        subtitle={`${transfer.fromFieldOffice} → ${transfer.toFieldOffice}`}
        badges={badges}
        headerActions={headerActions}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {activeTab === 'overview'   && <OverviewTab transfer={transfer} />}
        {activeTab === 'assets'     && <AssetsTab transfer={transfer} />}
        {activeTab === 'signatures' && (
          <SignatureTabContent
            recordId={id}
            recordType="transfer"
            signatures={toSignatureSteps(transfer.signatures)}
            currentUserRole="initiating_officer"
          />
        )}
        {activeTab === 'audit' && <AuditTabContent entries={transfer.auditTrail} />}
      </DetailPageShell>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Transfer</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason…"
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            className="min-h-[100px] text-[15px] font-['Manrope']"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={!rejectReason.trim()}
              onClick={() => {
                rejectTransfer.mutate({ id, reason: rejectReason })
                setRejectOpen(false)
                setRejectReason('')
              }}
            >
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
