import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { DrawerFormFooter } from '@/components/shared'
import { FormInput, FormSelect, FormTextarea } from '@/components/forms'
import { categorySchema } from '../../schemas/categorySchemas'
import { useCreateCategory, useUpdateCategory } from '../../hooks/useCategoryMutations'
import type { Category, CategoryDrawerMode } from '../../types'
import type { CategoryFormData } from '../../schemas/categorySchemas'

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

interface CategoryFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: CategoryDrawerMode
  category?: Category | null
}

export function CategoryFormDrawer({ open, onOpenChange, mode, category }: CategoryFormDrawerProps) {
  const isEdit = mode === 'edit'
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { status: 'active', description: '' },
  })

  useEffect(() => {
    if (open && category && isEdit) {
      reset({
        categoryName: category.categoryName,
        description: category.description ?? '',
        status: category.status,
      })
    } else if (open && !isEdit) {
      reset({ categoryName: '', description: '', status: 'active' })
    }
  }, [open, category, isEdit, reset])

  const onSubmit = handleSubmit((data) => {
    if (isEdit && category) {
      updateMutation.mutate(
        {
          id: category.id,
          data: {
            categoryName: data.categoryName,
            description: data.description,
            status: data.status,
          },
        },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      createMutation.mutate(data, { onSuccess: () => onOpenChange(false) })
    }
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-xl flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="text-[18px]">{isEdit ? 'Edit Category' : 'Add Category'}</SheetTitle>
          <SheetDescription className="text-[13px]">
            {isEdit ? 'Update asset category details.' : 'Add a new asset category.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            <FormInput
              label="Category Name"
              required
              placeholder="e.g., Laptop"
              error={errors.categoryName?.message}
              {...register('categoryName')}
            />
            <FormTextarea
              label="Description"
              placeholder="Enter category description"
              rows={3}
              error={errors.description?.message}
              {...register('description')}
            />
            <FormSelect
              label="Status"
              required
              options={STATUS_OPTIONS}
              error={errors.status?.message}
              {...register('status')}
            />
          </div>

          <DrawerFormFooter
            onCancel={() => onOpenChange(false)}
            loading={isPending}
            submitLabel={isEdit ? 'Update Category' : 'Add Category'}
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
