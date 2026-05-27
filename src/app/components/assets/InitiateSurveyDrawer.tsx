import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { MuiCheckbox } from '../shared/MuiCheckbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
import {
  ContentPasteSearch as SurveyIcon,
  Person as UserIcon,
  CalendarMonth as CalendarIcon,
  Assignment as ClipboardIcon,
  Notifications as BellIcon,
  Send as SendIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as AlertCircle,
  LocationOn as MapPin,
  Lock as LockIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { SurveyType, getSurveyTypeLabel } from './surveyTypes';
import { TransferAssetItem } from './transferTypes';
import { fieldOffices, custodians } from './transferTypes';

export interface SurveyFormData {
  surveyType: SurveyType;
  title: string;
  description: string;
  scope: string;
  teamLead: string;
  surveyors: string[];
  fieldOffice: string;
  targetLocations: string[];
  plannedStartDate: string;
  plannedEndDate: string;
  workflowType: 'hq' | 'field' | 'local';
  lockAssets: boolean;
  notes: string;
  sendNotifications: boolean;
}

interface InitiateSurveyDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: SurveyFormData, selectedAssets: TransferAssetItem[]) => void;
  availableAssets: TransferAssetItem[];
  preSelectedAssetIds?: Set<string>;
}

const locationOptions = [
  'Office Floor 1', 'Office Floor 2', 'Office A1-01', 'Office A1-02', 'Office A1-03',
  'Server Room B2', 'Warehouse B1', 'Warehouse B2', 'Conference Room 1', 'Main Building',
];

const defaultForm: SurveyFormData = {
  surveyType: 'full-count',
  title: '',
  description: '',
  scope: '',
  teamLead: '',
  surveyors: [],
  fieldOffice: 'Headquarters',
  targetLocations: [],
  plannedStartDate: '',
  plannedEndDate: '',
  workflowType: 'hq',
  lockAssets: false,
  notes: '',
  sendNotifications: true,
};

export function InitiateSurveyDrawer({
  open,
  onOpenChange,
  onSubmit,
  availableAssets,
  preSelectedAssetIds,
}: InitiateSurveyDrawerProps) {
  const [form, setForm] = useState<SurveyFormData>({ ...defaultForm });
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedSurveyorInput, setSelectedSurveyorInput] = useState('');

  useEffect(() => {
    if (open && preSelectedAssetIds && preSelectedAssetIds.size > 0) {
      setSelectedAssetIds(new Set(preSelectedAssetIds));
    }
  }, [open, preSelectedAssetIds]);

  const resetForm = () => {
    setForm({ ...defaultForm });
    setSelectedAssetIds(new Set());
    setFormErrors({});
    setSelectedSurveyorInput('');
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

  const addSurveyor = () => {
    if (selectedSurveyorInput && !form.surveyors.includes(selectedSurveyorInput)) {
      setForm(f => ({ ...f, surveyors: [...f.surveyors, selectedSurveyorInput] }));
      setSelectedSurveyorInput('');
    }
  };

  const removeSurveyor = (name: string) => {
    setForm(f => ({ ...f, surveyors: f.surveyors.filter(s => s !== name) }));
  };

  const toggleLocation = (loc: string) => {
    setForm(f => ({
      ...f,
      targetLocations: f.targetLocations.includes(loc)
        ? f.targetLocations.filter(l => l !== loc)
        : [...f.targetLocations, loc],
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.teamLead) errors.teamLead = 'Team lead is required';
    if (!form.plannedStartDate) errors.plannedStartDate = 'Start date is required';
    if (!form.plannedEndDate) errors.plannedEndDate = 'End date is required';
    if (form.targetLocations.length === 0) errors.targetLocations = 'Select at least one target location';
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
            <SurveyIcon className="w-5 h-5" />
            Initiate Physical Survey
          </SheetTitle>
          <SheetDescription className="text-[15px]">
            Create a new physical verification survey. Assets will be counted and reconciled against system records.
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

          {/* Survey Type */}
          <div>
            <Label className="text-[15px] font-medium mb-2 block">Survey Type <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-3 gap-2">
              {(['full-count', 'sample-based', 'location-based', 'custodian-based', 'high-value'] as SurveyType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, surveyType: type }))}
                  className={`p-3 rounded-[4px] border text-left transition-all ${
                    form.surveyType === type
                      ? 'border-[#121321] bg-[#121321]/5 dark:border-[#81CCD7] dark:bg-[#81CCD7]/10'
                      : 'border-border[#121321]/40'
                  }`}
                >
                  <p className="text-sm font-medium">{getSurveyTypeLabel(type)}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {type === 'full-count' && '100% verification'}
                    {type === 'sample-based' && 'Random sample'}
                    {type === 'location-based' && 'By location'}
                    {type === 'custodian-based' && 'By custodian'}
                    {type === 'high-value' && 'Value threshold'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Title & Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Survey Details</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Title <span className="text-destructive">*</span></Label>
                <Input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g., Annual Full Physical Count - HQ IT Assets"
                  className={`h-[52px] text-[15px] placeholder:text-[14px] ${formErrors.title ? 'border-destructive' : ''}`}
                />
                {formErrors.title && <p className="text-destructive text-xs">{formErrors.title}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the purpose and context of this survey..."
                  rows={2}
                  className="text-[15px] placeholder:text-[14px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Scope</Label>
                <Input
                  value={form.scope}
                  onChange={e => setForm(f => ({ ...f, scope: e.target.value }))}
                  placeholder="e.g., All IT assets at HQ — laptops, desktops, servers"
                  className="h-[52px] text-[15px] placeholder:text-[14px]"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Assignment */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Team Assignment</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Team Lead <span className="text-destructive">*</span></Label>
                <Select value={form.teamLead} onValueChange={v => setForm(f => ({ ...f, teamLead: v }))}>
                  <SelectTrigger className={`h-[52px] text-[15px] ${formErrors.teamLead ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select team lead" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {custodians.map(c => <SelectItem key={c} value={c} className="text-[15px]">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formErrors.teamLead && <p className="text-destructive text-xs">{formErrors.teamLead}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Add Surveyor</Label>
                <div className="flex gap-1.5">
                  <Select value={selectedSurveyorInput} onValueChange={setSelectedSurveyorInput}>
                    <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      {custodians.filter(c => !form.surveyors.includes(c)).map(c => <SelectItem key={c} value={c} className="text-[15px]">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="shrink-0 h-9" onClick={addSurveyor} disabled={!selectedSurveyorInput}>Add</Button>
                </div>
              </div>
              {form.surveyors.length > 0 && (
                <div className="col-span-2">
                  <Label className="text-sm mb-1.5 block">Survey Team ({form.surveyors.length})</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {form.surveyors.map(s => (
                      <span key={s} className="inline-flex items-center gap-1 px-2 py-1 rounded-[4px] bg-muted text-sm">
                        {s}
                        <button type="button" onClick={() => removeSurveyor(s)} className="text-muted-foreground ml-0.5">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Field Office</Label>
                <Select value={form.fieldOffice} onValueChange={v => setForm(f => ({ ...f, fieldOffice: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {fieldOffices.map(o => <SelectItem key={o} value={o} className="text-[15px]">{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Target Locations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Target Locations <span className="text-destructive">*</span></span>
            </div>
            {formErrors.targetLocations && <p className="text-destructive text-xs mb-2">{formErrors.targetLocations}</p>}
            <div className="grid grid-cols-2 gap-2">
              {locationOptions.map(loc => (
                <label key={loc} className="flex items-center gap-2 cursor-pointer p-2 rounded-[4px] border/50 transition-colors">
                  <MuiCheckbox
                    checked={form.targetLocations.includes(loc)}
                    onCheckedChange={() => toggleLocation(loc)}
                  />
                  <span className="text-[14px]">{loc}</span>
                </label>
              ))}
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
                <Label className="text-[15px] font-medium">Planned Start <span className="text-destructive">*</span></Label>
                <Input
                  type="datetime-local"
                  value={form.plannedStartDate}
                  onChange={e => setForm(f => ({ ...f, plannedStartDate: e.target.value }))}
                  className={`h-[52px] text-[15px] ${formErrors.plannedStartDate ? 'border-destructive' : ''}`}
                />
                {formErrors.plannedStartDate && <p className="text-destructive text-xs">{formErrors.plannedStartDate}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Planned End <span className="text-destructive">*</span></Label>
                <Input
                  type="datetime-local"
                  value={form.plannedEndDate}
                  onChange={e => setForm(f => ({ ...f, plannedEndDate: e.target.value }))}
                  className={`h-[52px] text-[15px] ${formErrors.plannedEndDate ? 'border-destructive' : ''}`}
                />
                {formErrors.plannedEndDate && <p className="text-destructive text-xs">{formErrors.plannedEndDate}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Workflow Type</Label>
                <Select value={form.workflowType} onValueChange={v => setForm(f => ({ ...f, workflowType: v as 'hq' | 'field' | 'local' }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="hq" className="text-[15px]">HQ Workflow</SelectItem>
                    <SelectItem value="field" className="text-[15px]">Field Workflow</SelectItem>
                    <SelectItem value="local" className="text-[15px]">Local Workflow</SelectItem>
                  </SelectContent>
                </Select>
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
                    <TableHead>Value</TableHead>
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
                      <TableCell className="font-['Manrope']">${asset.acquisitionValue?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                  placeholder="Any special instructions for the survey team..."
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
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <MuiCheckbox
                  checked={form.lockAssets}
                  onCheckedChange={v => setForm(f => ({ ...f, lockAssets: v }))}
                />
                <div>
                  <p className="text-[14px] flex items-center gap-1.5"><LockIcon className="w-3.5 h-3.5" /> Lock assets during survey</p>
                  <p className="text-[13px] text-muted-foreground">Prevents transfers and disposals of surveyed assets until survey is completed</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <MuiCheckbox
                  checked={form.sendNotifications}
                  onCheckedChange={v => setForm(f => ({ ...f, sendNotifications: v }))}
                />
                <div>
                  <p className="text-[14px]">Send notifications</p>
                  <p className="text-[13px] text-muted-foreground">Notify survey team and approvers via email</p>
                </div>
              </label>
            </div>
          </div>

          {form.lockAssets && (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                Asset locking is enabled. Selected assets will be frozen from transfers and disposals until this survey is completed or cancelled.
              </AlertDescription>
            </Alert>
          )}

          {/* Tips */}
          <div className="bg-muted/50 rounded-[4px] border p-4">
            <p className="text-[14px] text-muted-foreground mb-2 font-medium">Survey Guidelines</p>
            <div className="space-y-1 text-[14px] text-muted-foreground">
              <p>- Full-count surveys require 100% physical verification of all assets in scope</p>
              <p>- Discrepancies (missing, location mismatch, condition change) must be documented</p>
              <p>- Survey reports are auto-generated after reconciliation</p>
              <p>- Locked assets cannot be transferred or disposed until the survey closes</p>
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
              Initiate Survey
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
