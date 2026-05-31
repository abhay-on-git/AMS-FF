import { useCallback, useRef, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { ProfileHeader } from './ProfileHeader'
import { PersonalInfoCard } from './PersonalInfoCard'
import { ROLE_LABELS } from '../constants/profileConstants'
import { useProfile, useUpdateProfile } from '../hooks/useProfile'

export function ProfileView() {
  const authUser = useAppSelector((s) => s.auth.user)
  const { data: profile, isLoading } = useProfile()
  const updateMutation = useUpdateProfile()
  const [editing, setEditing] = useState(false)
  const submitRef = useRef<() => void>(() => {})

  const registerSubmit = useCallback((fn: () => void) => {
    submitRef.current = fn
  }, [])

  if (!authUser) {
    return <div className="p-6 text-muted-foreground text-15">Please sign in to view your profile.</div>
  }

  if (isLoading || !profile) {
    return <div className="p-6 text-muted-foreground text-15">Loading profile…</div>
  }

  const roleLabel = ROLE_LABELS[authUser.role] ?? authUser.role

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        role={roleLabel}
        editing={editing}
        saving={updateMutation.isPending}
        onEdit={() => setEditing(true)}
        onCancel={() => setEditing(false)}
        onSave={() => submitRef.current()}
      />
      <PersonalInfoCard
        profile={profile}
        editing={editing}
        onSaved={() => setEditing(false)}
        registerSubmit={registerSubmit}
      />
    </div>
  )
}
