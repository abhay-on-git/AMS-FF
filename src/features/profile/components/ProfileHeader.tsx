import { Edit, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import type { UserProfile } from '../types'

interface ProfileHeaderProps {
  profile: UserProfile
  role: string
  editing: boolean
  saving?: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
}

export function ProfileHeader({
  profile,
  role,
  editing,
  saving,
  onEdit,
  onCancel,
  onSave,
}: ProfileHeaderProps) {
  const displayName = `${profile.firstName} ${profile.lastName}`
  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()

  return (
    <Card className="overflow-hidden">
      <CardContent className="relative px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-lg shrink-0">
            <AvatarFallback className="text-3xl bg-brand-navy text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 pt-2 sm:pt-0 sm:pb-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl truncate">{displayName}</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 w-fit shrink-0">
                {role}
              </Badge>
            </div>
            <p className="text-15 text-muted-foreground mt-0.5">
              {profile.department} · {profile.fieldOffice}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:pb-1 shrink-0">
            {!editing ? (
              <Button variant="outline" className="h-10 px-5 text-15 gap-2" onClick={onEdit}>
                <Edit className="w-4 h-4" /> Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" className="h-10 px-5 text-15 gap-2" onClick={onCancel}>
                  <X className="w-4 h-4" /> Cancel
                </Button>
                <Button
                  className="h-10 px-5 text-15 gap-2 bg-brand-navy text-white hover:bg-brand-navy/90"
                  onClick={onSave}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
