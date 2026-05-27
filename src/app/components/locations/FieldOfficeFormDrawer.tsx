import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FieldOfficeConfig } from './types';
import { toast } from 'sonner';

interface FieldOfficeFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFieldOffice?: FieldOfficeConfig | null;
  onSave: (fieldOffice: FieldOfficeConfig) => void;
}

// No more predefined templates - simplified approach

export function FieldOfficeFormDrawer({
  open,
  onOpenChange,
  editingFieldOffice,
  onSave,
}: FieldOfficeFormDrawerProps) {
  const isEditMode = !!editingFieldOffice;

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    location: '',
    description: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when drawer opens/closes
  useEffect(() => {
    if (open && editingFieldOffice) {
      setFormData({
        code: editingFieldOffice.code,
        name: editingFieldOffice.name,
        location: editingFieldOffice.location,
        description: '',
        address1: editingFieldOffice.address1 || '',
        address2: editingFieldOffice.address2 || '',
        city: editingFieldOffice.city || '',
        state: editingFieldOffice.state || '',
        zip: editingFieldOffice.zip || '',
      });
    } else if (open && !editingFieldOffice) {
      setFormData({
        code: '',
        name: '',
        location: '',
        description: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
      });
    }
    setErrors({});
  }, [open, editingFieldOffice]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Field office code is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Field office name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.address1.trim()) {
      newErrors.address1 = 'Address Line 1 is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zip.trim()) {
      newErrors.zip = 'Zip / Pin Code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const fieldOfficeId = isEditMode ? editingFieldOffice.id : `fo-${Date.now()}`;

    const newFieldOffice: FieldOfficeConfig = {
      id: fieldOfficeId,
      code: formData.code.toUpperCase(),
      name: formData.name,
      location: formData.location,
      address1: formData.address1,
      address2: formData.address2,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      locationTypes: [],
      rootLocationId: null,
      isActive: true,
    };

    onSave(newFieldOffice);
    toast.success(isEditMode ? 'Field office updated successfully!' : 'Field office created successfully!');
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] flex flex-col h-full p-0">
        <SheetHeader className="pr-8 px-6 pt-6 pb-4 shrink-0">
          <SheetTitle>{isEditMode ? 'Edit Field Office' : 'Create Field Office'}</SheetTitle>
          <SheetDescription className="text-[15px]">
            {isEditMode
              ? `Update field office details and hierarchy configuration`
              : `Create a new field office and define its location hierarchy structure`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-6">
          {/* Info Box */}
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fo-name" className="text-[15px] font-medium">
                Office Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fo-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Godrej Office, Mumbai Office"
                className={`h-[52px] text-[15px] placeholder:text-[14px] ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fo-description" className="text-[15px] font-medium">
                Description <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="fo-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this field office..."
                rows={3}
                className="text-[15px] placeholder:text-[14px]"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <p className="text-[15px] font-medium">Address</p>

            <div className="space-y-2">
              <Label htmlFor="fo-address1" className="text-[15px] font-medium">Address Line 1 <span className="text-red-500">*</span></Label>
              <Input
                id="fo-address1"
                value={formData.address1}
                onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                placeholder="Street address, building number"
                className={`h-[52px] text-[15px] placeholder:text-[14px] ${errors.address1 ? 'border-red-500' : ''}`}
              />
              {errors.address1 && <p className="text-xs text-red-500">{errors.address1}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fo-address2" className="text-[15px] font-medium">
                Address Line 2 <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="fo-address2"
                value={formData.address2}
                onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                placeholder="Suite, floor, unit, etc."
                className="h-[52px] text-[15px] placeholder:text-[14px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fo-city" className="text-[15px] font-medium">City <span className="text-red-500">*</span></Label>
                <Input
                  id="fo-city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  className={`h-[52px] text-[15px] placeholder:text-[14px] ${errors.city ? 'border-red-500' : ''}`}
                />
                {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fo-state" className="text-[15px] font-medium">State <span className="text-red-500">*</span></Label>
                <Input
                  id="fo-state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                  className={`h-[52px] text-[15px] placeholder:text-[14px] ${errors.state ? 'border-red-500' : ''}`}
                />
                {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
              </div>
            </div>

            <div className="space-y-2 w-1/2">
              <Label htmlFor="fo-zip" className="text-[15px] font-medium">Zip / Pin Code <span className="text-red-500">*</span></Label>
              <Input
                id="fo-zip"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                placeholder="Zip or pin code"
                className={`h-[52px] text-[15px] placeholder:text-[14px] ${errors.zip ? 'border-red-500' : ''}`}
              />
              {errors.zip && <p className="text-xs text-red-500">{errors.zip}</p>}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-[4px] border border-green-200 dark:border-green-800 p-4">
            <p className="text-[14px] font-medium text-green-900 dark:text-green-100 mb-2">Next Steps</p>
            <div className="space-y-1 text-[14px] text-green-800 dark:text-green-200">
              <p>After creating the office, you can add locations with any hierarchy you need.</p>
              <p>No predefined structure required — create Building A, Park, Gym, or any location type.</p>
              <p>Locations can be nested freely: Building A → Floor 1 → Room 101, or Godrej → Swimming Pool.</p>
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
              {isEditMode ? 'Save Changes' : 'Create Field Office'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

