import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { DrawerFormFooter } from '@/components/shared'
import { FormInput, FormSelect } from '@/components/forms'
import { useCreateUser, useUpdateUser } from '../../hooks/useUserMutations'
import { createUserSchema, editUserSchema } from '../../schemas/userSchemas'
import { roleOptions, statusOptions, fieldOfficeOptions, countryCodeOptions } from '../../constants/userOptions'
import type { UserData, DrawerMode } from '../../types'
import type { CreateUserFormData, EditUserFormData } from '../../schemas/userSchemas'

const LOCATIONS = ['HQ Storage', 'Field Office A', 'Field Office B', 'Warehouse 1', 'Warehouse 2']

interface UserFormDrawerProps {
  open:         boolean
  onOpenChange: (open: boolean) => void
  mode:         DrawerMode
  user?:        UserData | null
}

export function UserFormDrawer({ open, onOpenChange, mode, user }: UserFormDrawerProps) {
  const isEdit = mode === 'edit'
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()

  const { register, handleSubmit, control, reset, watch, formState: { errors } } =
    useForm<CreateUserFormData | EditUserFormData>({
      resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
      defaultValues: { countryCode: '+1', assignedLocations: [] },
    })

  useEffect(() => {
    if (open && user && isEdit) {
      const [firstName = '', ...rest] = user.name.split(' ')
      reset({
        firstName,
        lastName:          rest.join(' '),
        email:             user.email,
        countryCode:       user.countryCode ?? '+1',
        mobile:            user.mobile ?? '',
        role:              user.role,
        fieldOffice:       user.fieldOffice,
        assignedLocations: [],
        ...(isEdit && { status: user.status }),
      })
    } else if (open && !isEdit) {
      reset({ countryCode: '+1', assignedLocations: [] })
    }
  }, [open, user, isEdit, reset])

  const selectedLocations = (watch('assignedLocations') ?? []) as string[]

  const onSubmit = handleSubmit((data) => {
    const name = `${data.firstName} ${data.lastName}`.trim()
    if (isEdit && user) {
      updateMutation.mutate(
        { id: user.id, data: { ...data, name } },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      createMutation.mutate(
        {
          name,
          email:       data.email,
          countryCode: data.countryCode,
          mobile:      data.mobile,
          role:        data.role,
          fieldOffice: data.fieldOffice,
          status:      'active',
        },
        { onSuccess: () => onOpenChange(false) },
      )
    }
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="text-[18px]">{isEdit ? 'Edit User' : 'New User'}</SheetTitle>
          <SheetDescription className="text-[13px]">
            {isEdit
              ? 'Update user profile and access settings.'
              : 'Fill in details to create a new user account.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="First Name" required error={errors.firstName?.message} {...register('firstName')} />
              <FormInput label="Last Name"  required error={errors.lastName?.message}  {...register('lastName')} />
            </div>
            <FormInput label="Email" type="email" required error={errors.email?.message} {...register('email')} />
            <div className="grid grid-cols-3 gap-3">
              <FormSelect
                label="Code"
                required
                options={countryCodeOptions}
                error={errors.countryCode?.message}
                {...register('countryCode')}
              />
              <div className="col-span-2">
                <FormInput label="Mobile" required error={errors.mobile?.message} {...register('mobile')} />
              </div>
            </div>
            <FormSelect
              label="Role"
              required
              options={roleOptions}
              error={errors.role?.message}
              {...register('role')}
            />
            <FormSelect
              label="Field Office"
              required
              options={fieldOfficeOptions}
              error={errors.fieldOffice?.message}
              {...register('fieldOffice')}
            />
            {isEdit && (
              <FormSelect
                label="Status"
                required
                options={statusOptions}
                error={(errors as { status?: { message?: string } }).status?.message}
                {...register('status')}
              />
            )}

            <div className="flex flex-col gap-2">
              <Label className="text-[13px] font-medium">Assigned Locations</Label>
              <div className="rounded-md border p-3 flex flex-col gap-2">
                <Controller
                  name="assignedLocations"
                  control={control}
                  render={({ field }) => (
                    <>
                      {LOCATIONS.map((loc) => (
                        <div key={loc} className="flex items-center gap-2">
                          <Checkbox
                            id={loc}
                            checked={selectedLocations.includes(loc)}
                            onCheckedChange={(checked) => {
                              const next = checked
                                ? [...selectedLocations, loc]
                                : selectedLocations.filter((l) => l !== loc)
                              field.onChange(next)
                            }}
                          />
                          <Label htmlFor={loc} className="text-[13px] font-normal cursor-pointer">
                            {loc}
                          </Label>
                        </div>
                      ))}
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          <DrawerFormFooter
            onCancel={() => onOpenChange(false)}
            isSubmitting={isPending}
            submitLabel={isEdit ? 'Save Changes' : 'Create User'}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
