import { cn } from '@/lib/cn'
import type { LifecycleStageType } from '../../types'
import { lifecycleSteps } from '../../constants/lifecycleConstants'
import { formatLifecycleStage } from '../../utils'

interface LifecycleStepperProps {
  currentStage: LifecycleStageType
  visitedStages: Set<string>
}

export function LifecycleStepper({ currentStage, visitedStages }: LifecycleStepperProps) {
  const currentStepIdx = lifecycleSteps.indexOf(currentStage)

  return (
    <div className="flex items-start justify-between w-full">
      {lifecycleSteps.map((step, idx) => {
        const isCurrent = currentStage === step

        return (
          <div key={step} className="flex-1 flex flex-col items-center relative">
            {idx > 0 && (
              <div
                className={cn(
                  'absolute top-3.5 right-1/2 w-full h-0.5 -translate-y-1/2',
                  idx <= currentStepIdx ? 'bg-brand-teal' : 'bg-muted'
                )}
              />
            )}

            <div
              className={cn(
                'relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium',
                isCurrent
                  ? 'bg-green-500 text-white'
                  : 'bg-brand-teal text-white'
              )}
            >
              {idx + 1}
            </div>

            <span
              className={cn(
                'mt-1.5 text-[13px] text-center leading-tight',
                isCurrent ? 'font-bold text-foreground' : 'text-muted-foreground'
              )}
            >
              {formatLifecycleStage(step)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
