import { Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export interface DetailMetaRow {
  label: string
  value: string
  highlight?: boolean
  badge?: boolean
}

interface DetailMetaCardProps {
  rows: DetailMetaRow[]
}

export function DetailMetaCard({ rows }: DetailMetaCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Pencil className="h-5 w-5" />
          Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row, idx) => (
          <div key={row.label}>
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs text-muted-foreground">{row.label}</span>
              {row.badge ? (
                <Badge variant="outline" className={row.highlight ? 'border-destructive text-destructive' : undefined}>
                  {row.value}
                </Badge>
              ) : (
                <span className={`text-right text-sm ${row.highlight ? 'text-destructive' : ''}`}>{row.value}</span>
              )}
            </div>
            {idx < rows.length - 1 && <Separator className="mt-3" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
