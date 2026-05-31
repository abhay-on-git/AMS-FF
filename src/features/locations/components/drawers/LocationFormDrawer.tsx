import { useState, useEffect } from 'react'
import { Building2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSaveLocation } from '../../hooks/useLocationMutations'
import type { FieldOfficeConfig, LocationNode } from '../../types'

interface LocationFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fieldOffices: FieldOfficeConfig[]
  editingLocation?: LocationNode | null
  parentLocation?: LocationNode | null
}

export function LocationFormDrawer({
  open,
  onOpenChange,
  fieldOffices,
  editingLocation,
  parentLocation,
}: LocationFormDrawerProps) {
  const isEditMode = !!editingLocation
  const saveMutation = useSaveLocation()
  const [localFieldOfficeId, setLocalFieldOfficeId] = useState(
    editingLocation?.fieldOfficeId || parentLocation?.fieldOfficeId || fieldOffices[0]?.id || '',
  )
  const fieldOffice = fieldOffices.find((fo) => fo.id === localFieldOfficeId)
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open && editingLocation) {
      setLocalFieldOfficeId(editingLocation.fieldOfficeId)
      setName(editingLocation.name)
    } else if (open && !editingLocation) {
      setLocalFieldOfficeId(parentLocation?.fieldOfficeId || fieldOffices[0]?.id || '')
      setName('')
    }
    setErrors({})
  }, [open, editingLocation, fieldOffices, parentLocation])

  const handleSave = () => {
    if (!name.trim()) {
      setErrors({ name: 'Location name is required' })
      return
    }

    const parentId = parentLocation?.id || null
    const level = parentLocation ? parentLocation.level + 1 : 0
    const path = parentLocation ? [...parentLocation.path, parentLocation.id] : []
    const autoCode = name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const location: LocationNode = {
      id: isEditMode ? editingLocation!.id : `loc-${Date.now()}`,
      code: autoCode,
      name: name.trim(),
      fieldOfficeId: localFieldOfficeId,
      parentId,
      locationTypeId: '',
      level,
      path,
      description: '',
      metadata: {},
      tags: [],
      status: 'active',
      childCount: 0,
      assetCount: isEditMode ? editingLocation!.assetCount : 0,
      assignedUserCount: isEditMode ? editingLocation!.assignedUserCount : 0,
      createdDate: isEditMode ? editingLocation!.createdDate : new Date().toISOString().split('T')[0],
      createdBy: 'admin',
      lastUpdated: new Date().toISOString().split('T')[0],
      lastUpdatedBy: 'admin',
    }

    saveMutation.mutate(location, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] flex flex-col h-full p-0">
        <SheetHeader className="pr-8 px-6 pt-6 pb-4 shrink-0">
          <SheetTitle>
            {isEditMode ? 'Edit Location' : parentLocation ? `Add Location under ${parentLocation.name}` : 'Add Location'}
          </SheetTitle>
          <SheetDescription className="text-15">
            {isEditMode
              ? `Update details for ${editingLocation?.name}`
              : parentLocation
                ? `Create a new location nested under "${parentLocation.name}"`
                : `Add a new location to ${fieldOffice?.name || 'your field office'}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-6">
          {!isEditMode && !parentLocation && (
            <div className="space-y-2">
              <Label htmlFor="field-office-select" className="text-15 font-medium">
                Field Office <span className="text-red-500">*</span>
              </Label>
              <Select value={localFieldOfficeId} onValueChange={setLocalFieldOfficeId}>
                <SelectTrigger id="field-office-select" className="h-[52px] text-15">
                  <SelectValue placeholder="Select field office" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)]">
                  {fieldOffices.map((office) => (
                    <SelectItem key={office.id} value={office.id} className="text-15">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{office.name}</p>
                          <p className="text-13 text-muted-foreground">{office.location} • {office.code}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-15 font-medium">
              Location Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Building A, Floor 1, Gym, Parking Lot"
              className={`h-[52px] text-15 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
        </div>

        <div className="shrink-0 border-t bg-background p-4">
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-15">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending} className="text-15">
              {isEditMode ? 'Save Changes' : 'Create Location'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
