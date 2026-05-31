import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface PlaceholderTabProps {
  icon: LucideIcon
  title: string
  description: string
}

export function PlaceholderTab({ icon: Icon, title, description }: PlaceholderTabProps) {
  return (
    <Card>
      <CardContent className="p-16 text-center">
        <Icon className="w-16 h-16 text-muted-foreground mx-auto mb-5 opacity-40" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
