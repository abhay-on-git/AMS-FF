// ── Asset color helpers ───────────────────────────────────────────────────────

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':      return 'bg-green-500/10 text-green-700 dark:text-green-300'
    case 'inactive':    return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
    case 'maintenance': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300'
    case 'disposed':    return 'bg-red-500/10 text-red-700 dark:text-red-300'
    case 'missing':     return 'bg-red-500/10 text-red-700 dark:text-red-300'
    case 'in-transit':  return 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
    default:            return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
  }
}

export function getConditionColor(condition: string): string {
  switch (condition) {
    case 'new':     return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
    case 'good':    return 'bg-green-500/10 text-green-700 dark:text-green-300'
    case 'fair':    return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300'
    case 'poor':    return 'bg-orange-500/10 text-orange-700 dark:text-orange-300'
    case 'damaged': return 'bg-red-500/10 text-red-700 dark:text-red-300'
    default:        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
  }
}

export function getLifecycleStageColor(stage: string): string {
  switch (stage) {
    case 'registered':       return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
    case 'active':           return 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
    case 'maintenance':      return 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700'
    case 'survey':           return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700'
    case 'pending-disposal': return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700'
    case 'disposed':         return 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700'
    default:                 return 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
  }
}

export function getLifecycleStageDotColor(stage: string): string {
  switch (stage) {
    case 'registered':       return 'bg-blue-500'
    case 'active':           return 'bg-green-500'
    case 'maintenance':      return 'bg-orange-500'
    case 'survey':           return 'bg-purple-500'
    case 'pending-disposal': return 'bg-amber-500'
    case 'disposed':         return 'bg-red-500'
    default:                 return 'bg-gray-400'
  }
}

export function formatLifecycleStage(stage: string): string {
  return stage
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function daysSince(dateStr: string): number {
  return Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
}

export function calculateAssetAge(createdDate: string): string {
  const created = new Date(createdDate)
  const now = new Date()
  const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
  if (days < 30)  return `${days}d`
  if (days < 365) return `${Math.floor(days / 30)}mo`
  const years           = Math.floor(days / 365)
  const remainingMonths = Math.floor((days % 365) / 30)
  return remainingMonths > 0 ? `${years}y ${remainingMonths}mo` : `${years}y`
}

// ── Form mappers ──────────────────────────────────────────────────────────────
export * from './assetFormMappers'
