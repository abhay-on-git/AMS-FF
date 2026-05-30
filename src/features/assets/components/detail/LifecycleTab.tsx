import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Lock, ArrowRightLeft, Info, GitBranch, FileText, User, Calendar } from 'lucide-react'
import type { EnhancedAsset, LifecycleStageType, LifecycleEvent, UserRole } from '../../types'
import { lifecycleSteps, lifecycleValidTransitions } from '../../constants/lifecycleConstants'
import { getStatusColor, formatLifecycleStage } from '../../utils'
import { formatDate } from '@/lib/utils/dateFormatter'
import { LifecycleStepper } from './LifecycleStepper'

interface LifecycleTabProps {
  asset: EnhancedAsset
  events: LifecycleEvent[]
  userRole: UserRole
  onChangeStatus: () => void
}

function getLifecycleStageHistory(asset: EnhancedAsset): { stage: LifecycleStageType; date: string }[] {
  const currentStage = (asset.lifecycleStage || 'active') as LifecycleStageType
  const currentIdx = lifecycleSteps.indexOf(currentStage)
  return lifecycleSteps.slice(0, currentIdx + 1).map((stage, idx) => {
    const baseDate = new Date(asset.createdDate)
    baseDate.setDate(baseDate.getDate() + idx * 45)
    return { stage, date: baseDate.toISOString().split('T')[0] }
  })
}

export function LifecycleTab({ asset, events, userRole, onChangeStatus }: LifecycleTabProps) {
  const currentStage = (asset.lifecycleStage || 'active') as LifecycleStageType
  const history = getLifecycleStageHistory(asset)
  const visitedStages = new Set(history.map((h) => h.stage))

  return (
    <div className="space-y-5">
      {/* Lifecycle Stepper */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="w-5 h-5" />
              Lifecycle
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <LifecycleStepper currentStage={currentStage} visitedStages={visitedStages} />

            {asset.status === 'in-transit' && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-purple-500/5 border border-purple-500/20">
                <ArrowRightLeft className="w-4 h-4 text-purple-500" />
                <p className="text-sm">
                  <span className="font-medium text-purple-700 dark:text-purple-300">Currently in transit</span>
                  {' '}— this is a temporary operational state outside the canonical lifecycle path.
                </p>
              </div>
            )}

            {lifecycleValidTransitions[currentStage]?.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Valid next:</span>
                  {lifecycleValidTransitions[currentStage].map((ns) => (
                    <Badge key={ns} variant="outline" className="text-sm px-2.5 py-1">
                      {formatLifecycleStage(ns)}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground/70 flex items-center gap-1">
                  <Info className="w-3 h-3 shrink-0" />
                  Determined by the transition rule matrix — each stage defines its allowed target stages.
                </p>
              </div>
            )}

            {currentStage === 'disposed' && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-red-500/5 border border-red-500/20">
                <Lock className="w-4 h-4 text-red-500" />
                <p className="text-sm">
                  <span className="font-medium text-red-700 dark:text-red-300">Terminal state</span>
                  {' '}— no further transitions are allowed. Admin override is required for any changes.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Asset Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wide">Asset Details</span>
            </div>
            <div className="space-y-2 text-[15px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Asset ID</span>
                <span className="font-['Manrope'] font-medium">{asset.assetId}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span>{asset.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span>{asset.type}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <User className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wide">Assignment</span>
            </div>
            <div className="space-y-2 text-[15px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Custodian</span>
                <span>{asset.responsiblePerson}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Field Office</span>
                <span>{asset.fieldOffice}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span>{asset.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wide">Status Info</span>
            </div>
            <div className="space-y-2 text-[15px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Status</span>
                <Badge className={getStatusColor(asset.status)}>
                  {asset.status.replace('-', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Changed</span>
                <span>{formatDate(asset.lastStatusChange)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
