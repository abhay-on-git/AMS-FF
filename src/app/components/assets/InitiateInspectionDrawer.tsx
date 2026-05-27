import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MuiCheckbox } from '../shared/MuiCheckbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  FactCheck as InspectionIcon,
  Person as UserIcon,
  CalendarMonth as CalendarIcon,
  Assignment as ClipboardIcon,
  Notifications as BellIcon,
  Send as SendIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as AlertCircle,
  Checklist as ChecklistIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { InspectionType, getInspectionTypeLabel } from './inspectionTypes';
import { TransferAssetItem } from './transferTypes';
import { fieldOffices, custodians } from './transferTypes';

export interface InspectionFormData {
  inspectionType: InspectionType;
  title: string;
  description: string;
  inspector: string;
  reviewer: string;
  fieldOffice: string;
  location: string;
  scheduledDate: string;
  dueDate: string;
  checklist: { label: string; checked: boolean }[];
  notes: string;
  sendNotifications: boolean;
}

interface InitiateInspectionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: InspectionFormData, selectedAssets: TransferAssetItem[]) => void;
  availableAssets: TransferAssetItem[];
  preSelectedAssetIds?: Set<string>;
}

const defaultChecklist = [
  { label: 'Physical condition verified', checked: false },
  { label: 'Serial numbers confirmed', checked: false },
  { label: 'RFID tags scanned', checked: false },
  { label: 'Location accuracy verified', checked: false },
  { label: 'Operating status checked', checked: false },
  { label: 'Safety compliance verified', checked: false },
];

const defaultForm: InspectionFormData = {
  inspectionType: 'scheduled',
  title: '',
  description: '',
  inspector: '',
  reviewer: '',
  fieldOffice: 'Headquarters',
  location: '',
  scheduledDate: '',
  dueDate: '',
  checklist: defaultChecklist.map(c => ({ ...c })),
  notes: '',
  sendNotifications: true,
};

const locations = [
  'Office Floor 1', 'Office Floor 2', 'Office A1-01', 'Office A1-02', 'Office A1-03',
  'Server Room B2', 'Warehouse B1', 'Warehouse B2', 'Conference Room 1', 'Main Building',
];

export function InitiateInspectionDrawer({
  open,
  onOpenChange,
  onSubmit,
  availableAssets,
  preSelectedAssetIds,
}: InitiateInspectionDrawerProps) {
  const [form, setForm] = useState<InspectionFormData>({ ...defaultForm, checklist: defaultChecklist.map(c => ({ ...c })) });
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && preSelectedAssetIds && preSelectedAssetIds.size > 0) {
      setSelectedAssetIds(new Set(preSelectedAssetIds));
    }
  }, [open, preSelectedAssetIds]);

  const resetForm = () => {
    setForm({ ...defaultForm, checklist: defaultChecklist.map(c => ({ ...c })) });
    setSelectedAssetIds(new Set());
    setFormErrors({});
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) resetForm();
  };

  const toggleAssetSelection = (id: string) => {
    const newSet = new Set(selectedAssetIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedAssetIds(newSet);
  };

  const toggleChecklistItem = (index: number) => {
    setForm(f => {
      const newChecklist = [...f.checklist];
      newChecklist[index] = { ...newChecklist[index], checked: !newChecklist[index].checked };
      return { ...f, checklist: newChecklist };
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.inspector) errors.inspector = 'Inspector is required';
    if (!form.reviewer) errors.reviewer = 'Reviewer is required';
    if (!form.scheduledDate) errors.scheduledDate = 'Scheduled date is required';
    if (!form.dueDate) errors.dueDate = 'Due date is required';
    if (selectedAssetIds.size === 0) errors.assets = 'Select at least one asset';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    const selectedAssets = availableAssets.filter(a => selectedAssetIds.has(a.id));
    onSubmit(form, selectedAssets);
    resetForm();
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-2xl flex flex-col overflow-hidden p-0">
        <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <InspectionIcon className="w-5 h-5" />
            Assign Inspection
          </SheetTitle>
          <SheetDescription className="text-[15px]">
            Create a new inspection request. The system will generate a unique inspection ID and schedule the assignment.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Pre-selected indicator */}
          {preSelectedAssetIds && preSelectedAssetIds.size > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-[#121321]/5 dark:bg-[#81CCD7]/10 border border-[#121321]/20 dark:border-[#81CCD7]/30">
              <CheckCircleIcon className="w-4 h-4 text-[#121321] dark:text-[#81CCD7]" />
              <p className="text-sm">
                <span className="font-medium">{selectedAssetIds.size} asset{selectedAssetIds.size !== 1 ? 's' : ''}</span>
                {' '}pre-selected from Published Assets table
              </p>
            </div>
          )}

          {/* Inspection Type */}
          <div>
            <Label className="text-[15px] font-medium mb-2 block">Inspection Type <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-3 gap-2">
              {(['scheduled', 'spot-check', 'pre-transfer', 'post-incident', 'regulatory'] as InspectionType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, inspectionType: type }))}
                  className={`p-3 rounded-[4px] border text-left transition-all ${
                    form.inspectionType === type
                      ? 'border-[#121321] bg-[#121321]/5 dark:border-[#81CCD7] dark:bg-[#81CCD7]/10'
                      : 'border-border[#121321]/40'
                  }`}
                >
                  <p className="text-sm font-medium">{getInspectionTypeLabel(type)}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {type === 'scheduled' && 'Routine check'}
                    {type === 'spot-check' && 'Unannounced'}
                    {type === 'pre-transfer' && 'Before transfer'}
                    {type === 'post-incident' && 'After incident'}
                    {type === 'regulatory' && 'Compliance audit'}
                  </p>
                </button>
              ))}
            </div>
            {form.inspectionType === 'regulatory' && (
              <Alert className="mt-2">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  Regulatory inspections must be reviewed by a Compliance Officer and follow audit-ready documentation procedures.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Title & Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Inspection Details</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Title <span className="text-destructive">*</span></Label>
                <Input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g., Q1 Server Room Equipment Inspection"
                  className={`h-[52px] text-[15px] placeholder:text-[14px] ${formErrors.title ? 'border-destructive' : ''}`}
                />
                {formErrors.title && <p className="text-destructive text-xs">{formErrors.title}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the scope and purpose of this inspection..."
                  rows={2}
                  className="text-[15px] placeholder:text-[14px]"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Assignment */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Assignment</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Inspector <span className="text-destructive">*</span></Label>
                <Select value={form.inspector} onValueChange={v => setForm(f => ({ ...f, inspector: v }))}>
                  <SelectTrigger className={`h-[52px] text-[15px] ${formErrors.inspector ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select inspector" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {custodians.map(c => <SelectItem key={c} value={c} className="text-[15px]">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formErrors.inspector && <p className="text-destructive text-xs">{formErrors.inspector}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Reviewer <span className="text-destructive">*</span></Label>
                <Select value={form.reviewer} onValueChange={v => setForm(f => ({ ...f, reviewer: v }))}>
                  <SelectTrigger className={`h-[52px] text-[15px] ${formErrors.reviewer ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select reviewer" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {custodians.map(c => <SelectItem key={c} value={c} className="text-[15px]">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formErrors.reviewer && <p className="text-destructive text-xs">{formErrors.reviewer}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Field Office</Label>
                <Select value={form.fieldOffice} onValueChange={v => setForm(f => ({ ...f, fieldOffice: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {fieldOffices.map(o => <SelectItem key={o} value={o} className="text-[15px]">{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[15px] font-medium">Location</Label>
                <Select value={form.location} onValueChange={v => setForm(f => ({ ...f, location: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select inspection location" /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {locations.map(l => <SelectItem key={l} value={l} className="text-[15px]">{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Schedule */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Schedule</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Scheduled Date <span className="text-destructive">*</span></Label>
                <Input
                  type="datetime-local"
                  value={form.scheduledDate}
                  onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))}
                  className={`h-[52px] text-[15px] ${formErrors.scheduledDate ? 'border-destructive' : ''}`}
                />
                {formErrors.scheduledDate && <p className="text-destructive text-xs">{formErrors.scheduledDate}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Due Date <span className="text-destructive">*</span></Label>
                <Input
                  type="datetime-local"
                  value={form.dueDate}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                  className={`h-[52px] text-[15px] ${formErrors.dueDate ? 'border-destructive' : ''}`}
                />
                {formErrors.dueDate && <p className="text-destructive text-xs">{formErrors.dueDate}</p>}
              </div>
            </div>
          </div>

          <Separator />

          {/* Asset Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <InventoryIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-[14px] text-muted-foreground">Select Assets <span className="text-destructive">*</span></span>
              </div>
              {selectedAssetIds.size > 0 && (
                <span className="text-xs text-muted-foreground">
                  {selectedAssetIds.size} selected
                </span>
              )}
            </div>
            {formErrors.assets && <p className="text-destructive text-xs mb-2">{formErrors.assets}</p>}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Condition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableAssets.map(asset => (
                    <TableRow
                      key={asset.id}
                      className={`cursor-pointer/50 ${selectedAssetIds.has(asset.id) ? 'bg-muted/30' : ''}`}
                      onClick={() => toggleAssetSelection(asset.id)}
                    >
                      <TableCell>
                        <MuiCheckbox
                          checked={selectedAssetIds.has(asset.id)}
                          onCheckedChange={() => toggleAssetSelection(asset.id)}
                        />
                      </TableCell>
                      <TableCell className="font-['Manrope']">{asset.assetId}</TableCell>
                      <TableCell className="">{asset.name}</TableCell>
                      <TableCell className="">{asset.type}</TableCell>
                      <TableCell className="text-muted-foreground">{asset.currentLocation}</TableCell>
                      <TableCell className="">{asset.condition}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <Separator />

          {/* Checklist Template */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ChecklistIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Inspection Checklist Template</span>
            </div>
            <div className="space-y-2 rounded-md border p-3">
              {form.checklist.map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer">
                  <MuiCheckbox
                    checked={item.checked}
                    onCheckedChange={() => toggleChecklistItem(idx)}
                  />
                  <span className="text-[14px]">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notes & Options */}
          <div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Additional Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any special instructions for the inspector..."
                  rows={2}
                  className="text-[15px] placeholder:text-[14px]"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Options */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BellIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Options</span>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <MuiCheckbox
                checked={form.sendNotifications}
                onCheckedChange={v => setForm(f => ({ ...f, sendNotifications: v }))}
              />
              <div>
                <p className="text-[14px]">Send notifications</p>
                <p className="text-[13px] text-muted-foreground">Notify inspector and reviewer via email when inspection is assigned</p>
              </div>
            </label>
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-[4px] border p-4">
            <p className="text-[14px] text-muted-foreground mb-2 font-medium">Inspection Guidelines</p>
            <div className="space-y-1 text-[14px] text-muted-foreground">
              <p>- Each asset will be individually assessed and marked Pass / Fail / Conditional</p>
              <p>- The inspector must complete the checklist and attach photo evidence</p>
              <p>- Findings are reviewed before the inspection is finalized</p>
              <p>- Pre-transfer inspections are required before inter-field transfers</p>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t bg-background px-6 py-4 flex justify-between items-center shrink-0">
          <p className="text-xs text-muted-foreground">
            {selectedAssetIds.size} asset{selectedAssetIds.size !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)} className="text-[15px]">Cancel</Button>
            <Button onClick={handleSubmit} className="gap-1.5 text-[15px]">
              <SendIcon className="w-4 h-4" />
              Assign Inspection
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
