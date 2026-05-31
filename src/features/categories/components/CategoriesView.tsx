import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryTable } from './CategoryTable'
import { CategoryFormDrawer } from './drawers/CategoryFormDrawer'
import { useCategories } from '../hooks/useCategories'
import type { Category, CategoryDrawerMode } from '../types'

export function CategoriesView() {
  const { data: categories = [], isLoading } = useCategories()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<CategoryDrawerMode>('create')
  const [editCategory, setEditCategory] = useState<Category | null>(null)

  const openCreate = () => {
    setEditCategory(null)
    setDrawerMode('create')
    setDrawerOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditCategory(category)
    setDrawerMode('edit')
    setDrawerOpen(true)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-end">
        <Button
          className="gap-1.5 bg-[#121321] hover:bg-[#1e2035] text-white text-[15px]"
          onClick={openCreate}
        >
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <CategoryTable data={categories} isLoading={isLoading} onEdit={openEdit} />

      <CategoryFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
        category={editCategory}
      />
    </div>
  )
}
