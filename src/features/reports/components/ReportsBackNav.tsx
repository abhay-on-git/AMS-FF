import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReportsBackNavProps {
  label: string
  onBack: () => void
}

export function ReportsBackNav({ label, onBack }: ReportsBackNavProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Reporting &amp; Analytics
      </button>
      <span className="text-muted-foreground">/</span>
      <span className="font-medium text-foreground">{label}</span>
    </div>
  )
}

export function ReportsBackButton({ onBack }: { onBack: () => void }) {
  return (
    <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 mb-2 h-10 gap-1 text-base">
      ← Back to Dashboard
    </Button>
  )
}
