import { CheckCircle2, XCircle, Clock, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { SignatureStep } from '@/types'

interface SignatureWorkflowProps {
  signatures:      SignatureStep[]
  onSign:          (stepId: string) => void
  currentUserRole: string
  isLoading?:      boolean
}

function StepIcon({ status }: { status: SignatureStep['status'] }) {
  if (status === 'signed')   return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
  if (status === 'rejected') return <XCircle      className="w-5 h-5 text-destructive shrink-0" />
  return <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
}

function stepBadge(status: SignatureStep['status']) {
  if (status === 'signed')   return <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 text-[11px]">Signed</Badge>
  if (status === 'rejected') return <Badge className="bg-red-500/10 text-destructive border-red-200 text-[11px]">Rejected</Badge>
  return <Badge variant="outline" className="text-[11px] text-muted-foreground">Pending</Badge>
}

export function SignatureWorkflow({
  signatures,
  onSign,
  currentUserRole,
  isLoading = false,
}: SignatureWorkflowProps) {
  return (
    <div className="space-y-0">
      {signatures.map((step, idx) => {
        const isLast       = idx === signatures.length - 1
        const canSign      = step.status === 'pending' && step.role === currentUserRole
        const isPending    = step.status === 'pending'

        return (
          <div key={step.id} className="flex gap-3">
            {/* Vertical connector */}
            <div className="flex flex-col items-center">
              <StepIcon status={step.status} />
              {!isLast && (
                <div className={`w-px flex-1 mt-1 mb-1 min-h-[24px] ${isPending ? 'bg-border' : 'bg-green-300 dark:bg-green-700'}`} />
              )}
            </div>

            {/* Step content */}
            <div className={`pb-4 flex-1 ${isLast ? '' : ''}`}>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-[14px] font-medium">{step.label}</p>
                  {step.signedBy && (
                    <p className="text-[12px] text-muted-foreground">{step.signedBy}</p>
                  )}
                  {step.signedAt && (
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(step.signedAt).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  )}
                  {step.comment && (
                    <p className="text-[12px] text-muted-foreground italic mt-0.5">"{step.comment}"</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {stepBadge(step.status)}
                  {canSign && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[12px] gap-1.5"
                      disabled={isLoading}
                      onClick={() => onSign(step.id)}
                    >
                      <PenLine className="w-3 h-3" />
                      Sign
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
