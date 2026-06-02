import { useState } from 'react'
import { FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { formatDate } from '@/lib/utils/dateFormatter'
import type { DetailNote } from '../../types'
import { getInitials } from '../../utils/reportDetailUtils'

interface DetailNotesCardProps {
  notes: DetailNote[]
}

export function DetailNotesCard({ notes }: DetailNotesCardProps) {
  const [newNote, setNewNote] = useState('')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-5 w-5" />
          Notes
          <Badge variant="outline">{notes.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.map((note, idx) => (
          <div key={idx} className="rounded-lg border p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-navy text-[10px] text-white">
                  {getInitials(note.user)}
                </div>
                <span className="text-sm">{note.user}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatDate(note.date)}</span>
            </div>
            <p className="text-sm text-muted-foreground">{note.note}</p>
          </div>
        ))}
        <div className="border-t pt-2">
          <Textarea
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="mb-2 min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              className="bg-brand-navy text-white hover:bg-brand-navy-mid"
              disabled={!newNote.trim()}
              onClick={() => {
                toast.success('Note added successfully')
                setNewNote('')
              }}
            >
              Add Note
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
