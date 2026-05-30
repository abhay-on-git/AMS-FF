import type { LifecycleStageType } from '../types'

export const lifecycleSteps: LifecycleStageType[] = [
  'registered',
  'active',
  'maintenance',
  'survey',
  'pending-disposal',
  'disposed',
]

export const lifecycleValidTransitions: Record<LifecycleStageType, LifecycleStageType[]> = {
  registered: ['active'],
  active: ['maintenance', 'survey', 'pending-disposal'],
  maintenance: ['active', 'survey', 'pending-disposal'],
  survey: ['active', 'maintenance', 'pending-disposal'],
  'pending-disposal': ['disposed'],
  disposed: [],
}
