import { useState } from 'react'
import { ActionLogDetail } from './ActionLogDetail'
import { ActionLogTable } from './ActionLogTable'
import { useAuditLogs } from '../hooks/useAuditLogs'
import type { AuditLog } from '../types'

export function ActionLogView() {
  const { data: logs = [], isLoading } = useAuditLogs()
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  if (selectedLog) {
    return (
      <ActionLogDetail
        log={selectedLog}
        onBack={() => setSelectedLog(null)}
      />
    )
  }

  return (
    <ActionLogTable
      logs={logs}
      isLoading={isLoading}
      onViewDetail={setSelectedLog}
    />
  )
}
