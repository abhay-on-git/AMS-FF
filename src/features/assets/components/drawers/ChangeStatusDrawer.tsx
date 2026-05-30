import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ArrowRightLeft, Lock, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/cn'
import { DrawerFormFooter } from '@/components/shared'
import { changeStatusSchema, type ChangeStatusFormData } from '../../schemas/assetSchemas'
import { useChangeStatus } from '../../hooks/useAssetMutations'
import { lifecycleValidTransitions } from '../../constants/lifecycleConstants'
import { getLifecycleStageColor, formatLifecycleStage, daysSince } from '../../utils'
import { formatDate } from '@/app/utils/dateFormatter'
import type { EnhancedAsset, LifecycleStageType } from '../../types'

interface ChangeStatusDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: EnhancedAsset | null
}

export function ChangeStatusDrawer({ open, onOpenChange, asset }: ChangeStatusDrawerProps) {
  const mutation = useChangeStatus(() => onOpenChange(false))

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ChangeStatusFormData>({
    resolver: zodResolver(changeStatusSchema),
    defaultValues: { targetStage: '', justification: '' },
  })

  const targetStage = watch('targetStage')

  const onSubmit = (data: ChangeStatusFormData) => {
    if (!asset) return
    mutation.mutate({ ...data, assetId: asset.assetId })
  }

  if (!asset) return null

  const currentStage = (asset.lifecycleStage || 'active') as LifecycleStageType
  const statusDaysInStage = daysSince(asset.lastStatusChange)
  const validTransitions = lifecycleValidTransitions[currentStage] || []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-[15px] flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Change Asset Status
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Submit a status transition request. Changes will be routed for approval based on your role.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="rounded-[4px] border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Asset</p>
                  <p className="font-['Manrope'] font-medium">{asset.assetId}</p>
                </div>
                {currentStage === 'disposed' && (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </Badge>
                )}
              </div>
              <p className="text-[15px]">{asset.name}</p>
              <div className="grid grid-cols-2 gap-3 text-[15px]">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p>{asset.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{asset.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Custodian</p>
                  <p>{asset.responsiblePerson}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days in Status</p>
                  <p className={statusDaysInStage > 30 ? 'text-yellow-600 font-medium' : ''}>
                    {statusDaysInStage} days
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-[15px] font-medium mb-2 block">Current Stage</Label>
              <div className="flex items-center gap-3 p-3 rounded-[4px] border bg-muted/20">
                <Badge className={getLifecycleStageColor(currentStage)}>
                  {formatLifecycleStage(currentStage)}
                </Badge>
                <span className="text-sm text-muted-foreground ml-auto">
                  Since {formatDate(asset.lastStatusChange)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                New Stage <span className="text-destructive">*</span>
              </Label>
              {validTransitions.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {validTransitions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setValue('targetStage', s)}
                      className={cn(
                        'p-3 rounded-[4px] border text-left transition-all',
                        targetStage === s
                          ? 'border-brand-navy bg-brand-navy/5'
                          : 'border-border hover:border-brand-navy/40'
                      )}
                    >
                      <Badge className={`${getLifecycleStageColor(s)} pointer-events-none`}>
                        {formatLifecycleStage(s)}
                      </Badge>
                    </button>
                  ))}
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No valid transitions from this stage. Admin override required.
                  </AlertDescription>
                </Alert>
              )}
              {errors.targetStage && <p className="text-sm text-destructive">{errors.targetStage.message}</p>}
            </div>

            {targetStage && (
              <div className="flex items-center justify-center gap-3 py-2">
                <Badge className={getLifecycleStageColor(currentStage)}>
                  {formatLifecycleStage(currentStage)}
                </Badge>
                <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                <Badge className={getLifecycleStageColor(targetStage)}>
                  {formatLifecycleStage(targetStage)}
                </Badge>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Justification <span className="text-destructive">*</span>
              </Label>
              <Textarea
                {...register('justification')}
                placeholder="Provide reason for status change..."
                rows={4}
                className="text-[15px] placeholder:text-[14px]"
              />
              {errors.justification && <p className="text-sm text-destructive">{errors.justification.message}</p>}
              <p className="text-[14px] text-muted-foreground">
                This will be recorded in the audit trail and visible to approvers.
              </p>
            </div>

            {targetStage === 'disposed' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-medium">Terminal State:</span> The asset will be permanently locked after disposal. This action cannot be reversed without an admin override.
                </AlertDescription>
              </Alert>
            )}
            {targetStage === 'pending-disposal' && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This asset will be flagged for disposal processing. A disposal request should be created after approval.
                </AlertDescription>
              </Alert>
            )}
            {targetStage === 'maintenance' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Assets under maintenance are restricted from transfers and assignments until status is resolved.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DrawerFormFooter
            onCancel={() => onOpenChange(false)}
            submitLabel="Submit for Approval"
            loading={mutation.isPending}
            disabled={mutation.isPending || !targetStage}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
