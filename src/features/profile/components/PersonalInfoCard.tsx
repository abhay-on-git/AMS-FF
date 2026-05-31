import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, MapPin, Phone, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormInput, FormSelect } from '@/components/forms'
import { updateProfileSchema, type UpdateProfileFormValues } from '../schemas/profileSchemas'
import { FIELD_OFFICE_OPTIONS, PHONE_COUNTRY_OPTIONS } from '../constants/profileConstants'
import { useUpdateProfile } from '../hooks/useProfile'
import type { UserProfile } from '../types'

interface PersonalInfoCardProps {
  profile: UserProfile
  editing: boolean
  onSaved: () => void
  registerSubmit: (fn: () => void) => void
}

const readCls = 'text-[15px] p-2.5 rounded-md bg-muted/50 border'

export function PersonalInfoCard({
  profile,
  editing,
  onSaved,
  registerSubmit,
}: PersonalInfoCardProps) {
  const updateMutation = useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phoneCountryCode: profile.phoneCountryCode,
      phone: profile.phone,
      fieldOffice: profile.fieldOffice,
      department: profile.department,
    },
  })

  const resetForm = useCallback(() => {
    reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phoneCountryCode: profile.phoneCountryCode,
      phone: profile.phone,
      fieldOffice: profile.fieldOffice,
      department: profile.department,
    })
  }, [profile, reset])

  useEffect(() => {
    resetForm()
  }, [resetForm])

  useEffect(() => {
    if (!editing) resetForm()
  }, [editing, resetForm])

  const onSubmit = useCallback(async (data: UpdateProfileFormValues) => {
    await updateMutation.mutateAsync(data)
    onSaved()
  }, [updateMutation, onSaved])

  useEffect(() => {
    registerSubmit(() => handleSubmit(onSubmit)())
  }, [registerSubmit, handleSubmit, onSubmit])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[16px]">
          <User className="w-5 h-5 text-brand-navy dark:text-brand-teal" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {editing ? (
            <>
              <FormInput label="First Name" required error={errors.firstName?.message}
                inputClassName="h-[52px] text-[15px]" {...register('firstName')} />
              <FormInput label="Last Name" required error={errors.lastName?.message}
                inputClassName="h-[52px] text-[15px]" {...register('lastName')} />
              <FormInput label="Email Address" type="email" required error={errors.email?.message}
                inputClassName="h-[52px] text-[15px]" {...register('email')} />
              <div className="sm:col-span-2 flex gap-2">
                <FormSelect label="Country Code" options={PHONE_COUNTRY_OPTIONS}
                  wrapperClassName="w-[140px] shrink-0"
                  error={errors.phoneCountryCode?.message} selectClassName="h-[52px] text-[15px]"
                  {...register('phoneCountryCode')} />
                <FormInput label="Phone Number" type="tel" error={errors.phone?.message}
                  wrapperClassName="flex-1"
                  inputClassName="h-[52px] text-[15px]" {...register('phone')} />
              </div>
              <FormInput label="Department" required error={errors.department?.message}
                inputClassName="h-[52px] text-[15px]" {...register('department')} />
              <FormSelect label="Field Office" options={FIELD_OFFICE_OPTIONS} required
                error={errors.fieldOffice?.message} selectClassName="h-[52px] text-[15px]"
                {...register('fieldOffice')} />
            </>
          ) : (
            <>
              <Field label="First Name" value={profile.firstName} />
              <Field label="Last Name" value={profile.lastName} />
              <Field label="Email Address" value={profile.email} icon={<Mail className="w-3.5 h-3.5" />} />
              <Field label="Phone Number" value={`${profile.phoneCountryCode} ${profile.phone}`} icon={<Phone className="w-3.5 h-3.5" />} />
              <Field label="Department" value={profile.department} />
              <Field label="Field Office" value={profile.fieldOffice} icon={<MapPin className="w-3.5 h-3.5" />} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[15px] font-medium flex items-center gap-1.5">{icon}{label}</p>
      <p className={readCls}>{value}</p>
    </div>
  )
}
