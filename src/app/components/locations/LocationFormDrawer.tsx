import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LocationNode, FieldOfficeConfig } from './types';
import { Business as Building2 } from '@mui/icons-material';
import { toast } from 'sonner';

interface LocationFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldOffices: FieldOfficeConfig[];
  editingLocation?: LocationNode | null;
  onSave: (location: LocationNode) => void;
  parentLocation?: LocationNode | null; // Optional: if provided, create child under this location
}

export function LocationFormDrawer({
  open,
  onOpenChange,
  fieldOffices,
  editingLocation,
  onSave,
  parentLocation,
}: LocationFormDrawerProps) {
  const isEditMode = !!editingLocation;
  const [localFieldOfficeId, setLocalFieldOfficeId] = useState(
    editingLocation?.fieldOfficeId || parentLocation?.fieldOfficeId || fieldOffices[0]?.id || ''
  );
  const fieldOffice = fieldOffices.find((fo) => fo.id === localFieldOfficeId);

  const [formData, setFormData] = useState({
    name: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when drawer opens/closes or editing location changes
  useEffect(() => {
    if (open && editingLocation) {
      setLocalFieldOfficeId(editingLocation.fieldOfficeId);
      setFormData({
        name: editingLocation.name,
      });
    } else if (open && !editingLocation) {
      setLocalFieldOfficeId(parentLocation?.fieldOfficeId || fieldOffices[0]?.id || '');
      setFormData({
        name: '',
      });
    }
    setErrors({});
  }, [open, editingLocation, fieldOffices, parentLocation]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Location name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const parentId = parentLocation?.id || null;
    const level = parentLocation ? parentLocation.level + 1 : 0;
    const path = parentLocation ? [...parentLocation.path, parentLocation.id] : [];

    // Auto-generate code from name
    const autoCode = formData.name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newLocation: LocationNode = {
      id: isEditMode ? editingLocation.id : `loc-${Date.now()}`,
      code: autoCode,
      name: formData.name,
      fieldOfficeId: localFieldOfficeId,
      parentId,
      locationTypeId: '', // No longer used
      level,
      path,
      description: '',
      metadata: {},
      tags: [],
      status: 'active',
      childCount: 0,
      assetCount: 0,
      assignedUserCount: 0,
      createdDate: isEditMode ? editingLocation.createdDate : new Date().toISOString().split('T')[0],
      createdBy: 'admin',
      lastUpdated: new Date().toISOString().split('T')[0],
      lastUpdatedBy: 'admin',
    };

    onSave(newLocation);
    toast.success(isEditMode ? 'Location updated successfully!' : 'Location created successfully!');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] flex flex-col h-full p-0">
        <SheetHeader className="pr-8 px-6 pt-6 pb-4 shrink-0">
          <SheetTitle>
            {isEditMode ? 'Edit Location' : parentLocation ? `Add Location under ${parentLocation.name}` : 'Add Location'}
          </SheetTitle>
          <SheetDescription className="text-[15px]">
            {isEditMode
              ? `Update details for ${editingLocation?.name}`
              : parentLocation
              ? `Create a new location nested under"${parentLocation.name}"`
              : `Add a new location to ${fieldOffice?.name || 'your field office'}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-6">
          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-[4px] border border-blue-200 dark:border-blue-800">
            <div className="flex gap-2 text-xs">
              <div className="flex-1">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  {parentLocation ? 'Adding Child Location' : 'Simple & Flexible'}
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  {parentLocation
                    ? `This location will be nested under"${parentLocation.name}". Just enter a name!`
                    : 'Just enter a location name. Build unlimited nesting levels using"Add Child" buttons.'}
                </p>
              </div>
            </div>
          </div>

          {/* Field Office Selection (only when creating new top-level location) */}
          {!isEditMode && !parentLocation && (
            <div className="space-y-2">
              <Label htmlFor="field-office-select" className="text-[15px] font-medium">
                Field Office <span className="text-red-500">*</span>
              </Label>
              <Select value={localFieldOfficeId} onValueChange={setLocalFieldOfficeId}>
                <SelectTrigger id="field-office-select" className="h-[52px] text-[15px]">
                  <SelectValue placeholder="Select field office" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  {fieldOffices.map((office) => (
                    <SelectItem key={office.id} value={office.id} className="text-[15px]">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{office.name}</p>
                          <p className="text-[13px] text-muted-foreground">{office.location} • {office.code}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Field Office Context Banner (for edit mode or when parent is provided) */}
          {(isEditMode || parentLocation) && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F7F7F8] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {parentLocation ? 'Parent Location' : 'Field Office'}
                  </p>
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                    {parentLocation ? parentLocation.name : fieldOffice?.name}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {parentLocation
                      ? `${fieldOffice?.name} • Level ${parentLocation.level}`
                      : `${fieldOffice?.location} • ${fieldOffice?.code}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[15px] font-medium">
                Location Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Building A, Floor 1, Gym, Parking Lot, Swimming Pool"
                className={`h-[52px] text-[15px] placeholder:text-[14px] ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-[4px] border border-green-200 dark:border-green-800 p-4">
            <p className="text-[14px] font-medium text-green-900 dark:text-green-100 mb-2">💡 How It Works</p>
            <div className="space-y-1 text-[14px] text-green-800 dark:text-green-200">
              {parentLocation ? (
                <>
                  <p>• This location will be nested under"{parentLocation.name}"</p>
                  <p>• Add more nested locations anytime using"Add Child"</p>
                </>
              ) : (
                <>
                  <p>• Just enter a location name - that's it!</p>
                  <p>• Build any hierarchy: Building → Floor → Room, or Office → Gym</p>
                  <p>• Nest locations freely using"Add Child" buttons</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 border-t bg-background p-4">
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} className="text-[15px]">
              Cancel
            </Button>
            <Button onClick={handleSave} className="text-[15px]">
              {isEditMode ? 'Save Changes' : 'Create Location'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

