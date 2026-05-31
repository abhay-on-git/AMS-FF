import { useState }          from 'react'
import { Badge }             from '@/components/ui/badge'
import { Button }            from '@/components/ui/button'
import { CheckSquare, Square, Camera } from 'lucide-react'
import { DetailPageShell }   from '@/components/shared/DetailPageShell'
import { AuditTabContent }   from '@/components/shared/AuditTabContent'
import { SignatureTabContent } from '@/components/shared/SignatureTabContent'
import { useInspections }    from '@/features/assets/hooks/useAssets'
import { useStartInspection, useCompleteInspection, useApproveInspectionReview } from '@/features/assets/hooks/useAssetMutations'
import {
  getInspectionStatusColor, getInspectionStatusLabel,
  getInspectionTypeLabel,   getInspectionTypeColor,
  getResultColor,           getResultLabel,
} from '@/features/assets/types/inspectionTypes'
import type { InspectionRequest, InspectionSignature } from '@/features/assets/types/inspectionTypes'
import type { SignatureStep } from '@/types'

interface InspectionDetailViewProps {
  id:     string
  onBack: () => void
}

function toSignatureSteps(sigs: InspectionSignature[]): SignatureStep[] {
  const LABELS: Record<string, string> = {
    inspector: 'Inspector',
    reviewer:  'Reviewer',
    custodian: 'Custodian',
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

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-[6px] bg-muted/40 border flex flex-col gap-1">
      <span className="text-13 text-muted-foreground">{label}</span>
      <div className="text-15 font-['Manrope'] font-medium">{children}</div>
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

function OverviewTab({ inspection }: { inspection: InspectionRequest }) {
  const checked = inspection.checklist.filter(c => c.checked).length
  const total   = inspection.checklist.length

  return (
    <div className="space-y-4">
      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3">
        <InfoCard label="Inspector">{inspection.inspector}</InfoCard>
        <InfoCard label="Reviewer">{inspection.reviewer}</InfoCard>
        <InfoCard label="Field Office">{inspection.fieldOffice}</InfoCard>
        <InfoCard label="Location">{inspection.location}</InfoCard>
        <InfoCard label="Scheduled Date">{inspection.scheduledDate}</InfoCard>
        <InfoCard label="Due Date">{inspection.dueDate}</InfoCard>
        {inspection.startedDate && (
          <InfoCard label="Started">{inspection.startedDate}</InfoCard>
        )}
        {inspection.completedDate && (
          <InfoCard label="Completed">{inspection.completedDate}</InfoCard>
        )}
        <InfoCard label="Type">
          <Badge className={getInspectionTypeColor(inspection.inspectionType)}>
            {getInspectionTypeLabel(inspection.inspectionType)}
          </Badge>
        </InfoCard>
        <InfoCard label="Status">
          <Badge className={getInspectionStatusColor(inspection.status)}>
            {getInspectionStatusLabel(inspection.status)}
          </Badge>
        </InfoCard>
        {inspection.result !== 'pending' && (
          <InfoCard label="Result">
            <Badge className={getResultColor(inspection.result)}>
              {getResultLabel(inspection.result)}
            </Badge>
          </InfoCard>
        )}
        {inspection.photosAttached > 0 && (
          <InfoCard label="Photos">
            <span className="flex items-center gap-1.5">
              <Camera className="w-4 h-4" />
              {inspection.photosAttached}
            </span>
          </InfoCard>
        )}
      </div>

      {/* Description */}
      {inspection.description && (
        <div className="p-4 rounded-[6px] bg-muted/40 border">
          <SectionLabel>Description</SectionLabel>
          <p className="text-15 font-['Manrope']">{inspection.description}</p>
        </div>
      )}

      {/* Overall Findings */}
      {inspection.overallFindings && (
        <div className="p-4 rounded-[6px] bg-muted/40 border border-l-4 border-amber-400 pl-4">
          <SectionLabel>Overall Findings</SectionLabel>
          <p className="text-15 font-['Manrope']">{inspection.overallFindings}</p>
        </div>
      )}

      {/* Recommendations */}
      {inspection.recommendations && (
        <div className="p-4 rounded-[6px] bg-muted/40 border border-l-4 border-blue-400 pl-4">
          <SectionLabel>Recommendations</SectionLabel>
          <p className="text-15 font-['Manrope']">{inspection.recommendations}</p>
        </div>
      )}
    </div>
  )
}

function ChecklistTab({ inspection }: { inspection: InspectionRequest }) {
  const total   = inspection.checklist.length
  const checked = inspection.checklist.filter(c => c.checked).length
  const pct     = total > 0 ? Math.round((checked / total) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="p-4 rounded-[6px] bg-muted/40 border space-y-2">
        <div className="flex items-center justify-between text-13 text-muted-foreground">
          <span>{checked} of {total} items completed</span>
          <span>{pct}%</span>
        </div>
        <div className="bg-muted rounded-full h-2">
          <div
            className="bg-brand-teal rounded-full h-2 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {inspection.checklist.map(item => (
          <div key={item.id} className="p-4 rounded-[6px] bg-muted/40 border flex gap-3">
            <div className="mt-0.5 shrink-0">
              {item.checked
                ? <CheckSquare className="w-4 h-4 text-green-600" />
                : <Square className="w-4 h-4 text-muted-foreground" />}
            </div>
            <div>
              <p className="text-15 font-['Manrope']">{item.label}</p>
              {item.notes && (
                <p className="text-13 text-muted-foreground font-['Manrope'] mt-0.5">{item.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AssetsTab({ inspection }: { inspection: InspectionRequest }) {
  return (
    <div className="p-4 rounded-[6px] bg-muted/40 border overflow-x-auto">
      <table className="w-full text-15 font-['Manrope']">
        <thead>
          <tr className="border-b">
            {['Asset ID', 'Name', 'Serial', 'Type', 'Location', 'Condition', 'Result', 'Findings'].map(h => (
              <th key={h} className="text-left text-13 font-semibold uppercase tracking-wide text-muted-foreground pb-2 pr-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {inspection.assets.map(asset => (
            <tr key={asset.id}>
              <td className="py-2 pr-4 text-muted-foreground">{asset.assetId}</td>
              <td className="py-2 pr-4 font-medium">{asset.name}</td>
              <td className="py-2 pr-4 text-muted-foreground">{asset.serialNumber}</td>
              <td className="py-2 pr-4">{asset.type}</td>
              <td className="py-2 pr-4">{asset.currentLocation}</td>
              <td className="py-2 pr-4">{asset.condition}</td>
              <td className="py-2 pr-4">
                <Badge className={getResultColor(asset.result)}>
                  {getResultLabel(asset.result)}
                </Badge>
              </td>
              <td className="py-2 pr-4 max-w-[180px]">
                <span className="block truncate text-muted-foreground">{asset.findings ?? '—'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const TABS = (unchecked: number) => [
  { key: 'overview',   label: 'Overview' },
  { key: 'checklist',  label: 'Checklist', badge: unchecked },
  { key: 'assets',     label: 'Assets' },
  { key: 'signatures', label: 'Signatures' },
  { key: 'audit',      label: 'Audit' },
] as const

export function InspectionDetailView({ id, onBack }: InspectionDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const { data: all = [] }        = useInspections()
  const inspection                = all.find(i => i.id === id) as InspectionRequest | undefined

  const startInspection   = useStartInspection()
  const completeInspection = useCompleteInspection()
  const approveReview     = useApproveInspectionReview()

  if (!inspection) {
    return (
      <div className="p-8 text-center text-muted-foreground text-15">
        Inspection record not found.
      </div>
    )
  }

  const unchecked = inspection.checklist.filter(c => !c.checked).length

  const headerActions = (
    <>
      {inspection.status === 'scheduled' && (
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => startInspection.mutate(id)}>
          Start Inspection
        </Button>
      )}
      {inspection.status === 'in-progress' && (
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => completeInspection.mutate(id)}>
          Complete & Submit
        </Button>
      )}
      {inspection.status === 'pending-review' && (
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => approveReview.mutate(id)}>
          Approve Review
        </Button>
      )}
    </>
  )

  const badges = (
    <>
      <Badge className={getInspectionStatusColor(inspection.status)}>
        {getInspectionStatusLabel(inspection.status)}
      </Badge>
      <Badge className={getInspectionTypeColor(inspection.inspectionType)}>
        {getInspectionTypeLabel(inspection.inspectionType)}
      </Badge>
      {inspection.result !== 'pending' && (
        <Badge className={getResultColor(inspection.result)}>
          {getResultLabel(inspection.result)}
        </Badge>
      )}
    </>
  )

  return (
    <DetailPageShell
      breadcrumbLabel="Inspections"
      onBack={onBack}
      recordId={inspection.inspectionId}
      title={inspection.title}
      badges={badges}
      headerActions={headerActions}
      tabs={TABS(unchecked)}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview'   && <OverviewTab   inspection={inspection} />}
      {activeTab === 'checklist'  && <ChecklistTab  inspection={inspection} />}
      {activeTab === 'assets'     && <AssetsTab     inspection={inspection} />}
      {activeTab === 'signatures' && (
        <SignatureTabContent
          recordId={id}
          recordType="inspection"
          signatures={toSignatureSteps(inspection.signatures)}
          currentUserRole="inspector"
        />
      )}
      {activeTab === 'audit' && (
        <AuditTabContent entries={inspection.auditTrail} />
      )}
    </DetailPageShell>
  )
}
