import { FileText, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SavedQuery } from '../../types'

interface CustomSavedQueriesPanelProps {
  queries: SavedQuery[]
  onLoad: (query: SavedQuery) => void
  onDelete: (id: string) => void
}

export function CustomSavedQueriesPanel({ queries, onLoad, onDelete }: CustomSavedQueriesPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-muted-foreground" />
          Saved Queries
        </CardTitle>
      </CardHeader>
      <CardContent>
        {queries.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No saved queries yet</p>
        ) : (
          <div className="space-y-3">
            {queries.map((query) => (
              <div key={query.id} className="rounded-lg border p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-start justify-between">
                  <button type="button" className="text-left text-base font-medium hover:text-primary" onClick={() => onLoad(query)}>
                    {query.name}
                  </button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => onDelete(query.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{query.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-sm">{query.filters.length} filters</Badge>
                  {query.groupBy && query.groupBy !== 'none' && (
                    <Badge variant="outline" className="text-sm">Group: {query.groupBy}</Badge>
                  )}
                </div>
                <Button size="sm" variant="outline" className="mt-3 h-9 text-base" onClick={() => onLoad(query)}>
                  Load Query
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
