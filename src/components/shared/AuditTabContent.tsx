import { Clock } from 'lucide-react'

export interface AuditEntry {
  id:        string
  action:    string
  user:      string
  timestamp: string
  details?:  string
  oldValue?: string
  newValue?: string
}

interface AuditTabContentProps {
  entries: AuditEntry[]
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function AuditTabContent({ entries }: AuditTabContentProps) {
  if (!entries.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
        <Clock className="w-8 h-8 opacity-40" />
        <p className="text-15">No audit events recorded yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {entries.map((entry, idx) => {
        const isLast = idx === entries.length - 1
        return (
          <div key={entry.id} className="flex gap-3">
            {/* Connector */}
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-brand-teal mt-1.5 shrink-0" />
              {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
            </div>

            {/* Content */}
            <div className="pb-5 flex-1">
              <p className="text-15 font-medium font-['Manrope']">{entry.action}</p>
              <p className="text-13 text-muted-foreground font-['Manrope']">
                {entry.user}
                <span className="mx-1">·</span>
                {formatDate(entry.timestamp)}
              </p>
              {entry.details && (
                <p className="text-13 text-muted-foreground mt-0.5">{entry.details}</p>
              )}
              {(entry.oldValue || entry.newValue) && (
                <div className="mt-1 flex items-center gap-2 text-[12px]">
                  {entry.oldValue && (
                    <span className="bg-red-500/10 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded font-['Manrope']">
                      {entry.oldValue}
                    </span>
                  )}
                  {entry.oldValue && entry.newValue && (
                    <span className="text-muted-foreground">→</span>
                  )}
                  {entry.newValue && (
                    <span className="bg-green-500/10 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded font-['Manrope']">
                      {entry.newValue}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
