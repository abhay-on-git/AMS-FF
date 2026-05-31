import {
  ChevronLeft,
  Download,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatChangeValue, formatLogTimestamp } from '../lib/formatUtils'
import type { AuditLog } from '../types'

const FIELD_TEXT = 'text-[15px]'
const LABEL_CLS = 'text-[14px] text-muted-foreground'

interface ActionLogDetailProps {
  log: AuditLog
  onBack: () => void
}

export function ActionLogDetail({ log, onBack }: ActionLogDetailProps) {
  const { date, time } = formatLogTimestamp(log.timestamp)
  const changeKeys = log.changes ? Object.keys(log.changes) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[14px]">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Action Log
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">Log Entry</span>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className={FIELD_TEXT}>Log Entry Details</CardTitle>
              <Button
                variant="outline"
                className={`${FIELD_TEXT} h-10 px-4`}
                onClick={() => toast.info('Exporting log entry…')}
              >
                <Download className="w-4 h-4 mr-2" /> Export Entry
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-md border">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`font-semibold ${FIELD_TEXT}`}>{log.actor_name}</p>
                <p className="text-[14px] text-muted-foreground">{log.actor_role_at_time}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className={`${FIELD_TEXT} font-medium tabular-nums`}>{date}</p>
                <p className="text-[14px] text-muted-foreground tabular-nums">{time}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <p className={LABEL_CLS}>Entity Type</p>
                <Badge variant="outline" className="mt-1.5 text-[14px] px-2.5 py-1">
                  {log.entity_type}
                </Badge>
              </div>
              <div>
                <p className={LABEL_CLS}>Action Performed</p>
                <Badge variant="outline" className="mt-1.5 text-[14px] px-2.5 py-1">
                  {log.event_type}
                </Badge>
              </div>
              <div>
                <p className={LABEL_CLS}>IP Address</p>
                <p className={`mt-1.5 ${FIELD_TEXT} font-medium font-mono`}>
                  {log.metadata.ip_address ?? '—'}
                </p>
              </div>
              <div>
                <p className={LABEL_CLS}>Session</p>
                <p className={`mt-1.5 ${FIELD_TEXT} font-medium font-mono`}>
                  {log.metadata.session_id ?? '—'}
                </p>
              </div>
              {log.justification?.reason && (
                <div className="sm:col-span-2">
                  <p className={LABEL_CLS}>Reason</p>
                  <p className={`mt-1.5 ${FIELD_TEXT} font-medium`}>
                    {log.justification.reason}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {changeKeys.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className={FIELD_TEXT}>What Changed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {changeKeys.map((key) => {
                  const { from, to } = log.changes![key]
                  const fromVal = formatChangeValue(from)
                  const toVal = formatChangeValue(to)
                  const isNew = fromVal === null
                  const isRemoved = toVal === null

                  return (
                    <div key={key} className="rounded-md border overflow-hidden">
                      <div className="bg-muted/50 px-4 py-2 border-b">
                        <p className={`${FIELD_TEXT} font-semibold capitalize`}>
                          {key.replace(/_/g, ' ')}
                        </p>
                      </div>

                      {isNew ? (
                        <div className="px-4 py-3">
                          <p className="text-[13px] text-muted-foreground mb-1">Set to</p>
                          <p className={`${FIELD_TEXT} font-medium`}>{toVal ?? '—'}</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 divide-x">
                          <div className="px-4 py-3">
                            <p className="text-[13px] text-muted-foreground mb-1.5">Before</p>
                            <p
                              className={`${FIELD_TEXT} font-medium ${isRemoved ? '' : 'text-muted-foreground'}`}
                            >
                              {fromVal ?? (
                                <span className="italic text-[13px]">Not set</span>
                              )}
                            </p>
                          </div>
                          <div className="px-4 py-3 bg-muted/20">
                            <p className="text-[13px] text-muted-foreground mb-1.5">After</p>
                            <p className={`${FIELD_TEXT} font-semibold`}>
                              {toVal ?? (
                                <span className="italic font-normal text-[13px]">Cleared</span>
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {log.justification?.context && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className={FIELD_TEXT}>Additional Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 border rounded-md px-4 py-3">
                <p className={`${FIELD_TEXT} leading-relaxed`}>{log.justification.context}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
