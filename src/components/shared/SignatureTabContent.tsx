import { useState } from 'react'
import { SignatureWorkflow } from './SignatureWorkflow'
import { DigitalSignatureDrawer } from './DigitalSignatureDrawer'
import type { DigitalSignatureData } from './DigitalSignatureDrawer'
import { useSignRecord } from '@/features/assets/hooks/useAssetMutations'
import type { SignRecordType } from '@/features/assets/services/assetsService'
import type { SignatureStep } from '@/types'

interface SignatureTabContentProps {
  recordId:        string
  recordType:      SignRecordType
  signatures:      SignatureStep[]
  currentUserRole: string
}

export function SignatureTabContent({
  recordId,
  recordType,
  signatures,
  currentUserRole,
}: SignatureTabContentProps) {
  const [sigOpen,       setSigOpen]       = useState(false)
  const [pendingStepId, setPendingStepId] = useState<string | null>(null)

  const signMutation = useSignRecord(recordType)

  const pendingStep  = signatures.find((s) => s.id === pendingStepId)

  function handleSign(stepId: string) {
    setPendingStepId(stepId)
    setSigOpen(true)
  }

  function handleConfirm(data: DigitalSignatureData) {
    if (!pendingStep) return
    signMutation.mutate({
      id:            recordId,
      role:          pendingStep.role,
      signatoryName: data.signatoryName,
    })
    setSigOpen(false)
    setPendingStepId(null)
  }

  return (
    <>
      <div className="max-w-xl">
        <SignatureWorkflow
          signatures={signatures}
          onSign={handleSign}
          currentUserRole={currentUserRole}
          isLoading={signMutation.isPending}
        />
      </div>

      <DigitalSignatureDrawer
        open={sigOpen}
        onOpenChange={setSigOpen}
        signatoryName={pendingStep?.signedBy ?? 'Current User'}
        signatoryRole={pendingStep?.role ?? currentUserRole}
        title="Digital Sign-Off"
        description="Review and confirm your digital signature to authorise this step."
        onConfirm={handleConfirm}
      />
    </>
  )
}
