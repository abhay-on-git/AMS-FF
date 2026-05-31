import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { DrawerFormFooter } from '@/components/shared'
import { FormInput, FormSelect } from '@/components/forms'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useCreateRole, useUpdateRole } from '../../hooks/useRoleMutations'
import { createRoleSchema } from '../../schemas/roleSchemas'
import type { CreateRoleFormData } from '../../schemas/roleSchemas'
import type { Role } from '../../types'

const CATEGORY_OPTIONS = [
  { value: 'administrator', label: 'Administrator' },
  { value: 'standard',      label: 'Standard' },
  { value: 'auditor',       label: 'Auditor' },
  { value: 'approver',      label: 'Approver' },
  { value: 'custom',        label: 'Custom' },
]

interface RoleFormDrawerProps {
  open:         boolean
  onOpenChange: (open: boolean) => void
  role?:        Role | null
}

export function RoleFormDrawer({ open, onOpenChange, role }: RoleFormDrawerProps) {
  const isEdit = !!role
  const createMutation = useCreateRole()
  const updateMutation = useUpdateRole()

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<CreateRoleFormData>({
      resolver: zodResolver(createRoleSchema),
    })

  useEffect(() => {
    if (open && role) {
      reset({ name: role.name, description: role.description, category: role.category })
    } else if (open && !role) {
      reset({ name: '', description: '', category: 'custom' })
    }
  }, [open, role, reset])

  const onSubmit = handleSubmit((data) => {
    if (isEdit && role) {
      updateMutation.mutate(
        { id: role.id, data },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      createMutation.mutate(
        {
          name:          data.name,
          description:   data.description ?? '',
          category:      data.category,
          type:          'custom',
          isActive:      true,
          allLocations:  false,
          permissions:   [],
          locationAccess: [],
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
          <SheetTitle className="text-[18px]">{isEdit ? 'Edit Role' : 'New Role'}</SheetTitle>
          <SheetDescription className="text-[13px]">
            {isEdit
              ? 'Update role name, description and category.'
              : 'Create a new custom role. Assign permissions after creation.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            <FormInput
              label="Role Name"
              required
              error={errors.name?.message}
              {...register('name')}
            />
            <FormSelect
              label="Category"
              required
              options={CATEGORY_OPTIONS}
              error={errors.category?.message}
              {...register('category')}
            />
            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium">Description</Label>
              <Textarea
                rows={3}
                placeholder="Describe what this role can do…"
                className="text-[13px] resize-none"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-[12px] text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          <DrawerFormFooter
            onCancel={() => onOpenChange(false)}
            isSubmitting={isPending}
            submitLabel={isEdit ? 'Save Changes' : 'Create Role'}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
