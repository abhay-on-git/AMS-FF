import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
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
  SwapHoriz as TransferIcon,
  Person as UserIcon,
  LocationOn as MapPin,
  Warning as AlertCircle,
  Assignment as ClipboardIcon,
  Notifications as BellIcon,
  Send as SendIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import {
  TransferType,
  TransferAssetItem,
  getTransferTypeLabel,
  ineligibleAssetIds,
  fieldOffices,
  buildings,
  rooms,
  custodians,
} from './transferTypes';

const CURRENT_USER = 'John Doe';

export interface TransferFormData {
  transferType: TransferType;
  fromCustodian: string;
  fromFieldOffice: string;
  fromBuilding: string;
  fromRoom: string;
  toCustodian: string;
  toFieldOffice: string;
  toBuilding: string;
  toRoom: string;
  reason: string;
  notes: string;
  acknowledgmentRequired: boolean;
}

interface InitiateTransferDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: TransferFormData, selectedAssets: TransferAssetItem[]) => void;
  availableAssets: TransferAssetItem[];
  preSelectedAssetIds?: Set<string>;
}

const defaultForm: TransferFormData = {
  transferType: 'intra-field',
  fromCustodian: CURRENT_USER,
  fromFieldOffice: 'Headquarters',
  fromBuilding: 'Main Building',
  fromRoom: '',
  toCustodian: '',
  toFieldOffice: 'Headquarters',
  toBuilding: '',
  toRoom: '',
  reason: '',
  notes: '',
  acknowledgmentRequired: true,
};

export function InitiateTransferDrawer({
  open,
  onOpenChange,
  onSubmit,
  availableAssets,
  preSelectedAssetIds,
}: InitiateTransferDrawerProps) {
  const [createForm, setCreateForm] = useState<TransferFormData>({ ...defaultForm });
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // When drawer opens with pre-selected assets, set them
  useEffect(() => {
    if (open && preSelectedAssetIds && preSelectedAssetIds.size > 0) {
      setSelectedAssetIds(new Set(preSelectedAssetIds));
    }
  }, [open, preSelectedAssetIds]);

  const resetForm = () => {
    setCreateForm({ ...defaultForm });
    setSelectedAssetIds(new Set());
    setFormErrors({});
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const toggleAssetSelection = (id: string) => {
    if (ineligibleAssetIds.includes(id)) {
      toast.error('This asset cannot be transferred (disposed, missing, or under survey)');
      return;
    }
    const newSet = new Set(selectedAssetIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedAssetIds(newSet);
  };

  const totalSelectedValue = availableAssets
    .filter(a => selectedAssetIds.has(a.id))
    .reduce((sum, a) => sum + (a.acquisitionValue || 0), 0);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!createForm.toCustodian) errors.toCustodian = 'Receiving custodian is required';
    if (!createForm.toRoom) errors.toRoom = 'Destination room is required';
    if (!createForm.reason.trim()) errors.reason = 'Transfer reason is required';
    if (selectedAssetIds.size === 0) errors.assets = 'Select at least one asset';
    if (createForm.transferType === 'inter-field' && createForm.toFieldOffice === createForm.fromFieldOffice) {
      errors.toFieldOffice = 'Inter-field transfer must target a different field office';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    const selectedAssets = availableAssets.filter(a => selectedAssetIds.has(a.id));
    onSubmit(createForm, selectedAssets);
    resetForm();
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-2xl flex flex-col overflow-hidden p-0">
        <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-[15px] flex items-center gap-2">
            <TransferIcon className="w-5 h-5" />
            Initiate Asset Transfer
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Create a new transfer request. The system will generate a unique transfer ID and route for approval.
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

          {/* Transfer Type */}
          <div>
            <Label className="text-[15px] font-medium mb-2 block">Transfer Type <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-2 gap-2">
              {(['intra-field', 'inter-field'] as TransferType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCreateForm(f => ({ ...f, transferType: type }))}
                  className={`p-3 rounded-[4px] border text-left transition-all ${
                    createForm.transferType === type
                      ? 'border-[#121321] bg-[#121321]/5 dark:border-[#81CCD7] dark:bg-[#81CCD7]/10'
                      : 'border-border[#121321]/40'
                  }`}
                >
                  <p className="text-sm font-medium">{getTransferTypeLabel(type)}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {type === 'intra-field' && 'Within same office'}
                    {type === 'inter-field' && 'Between offices'}
                  </p>
                </button>
              ))}
            </div>
            {createForm.transferType === 'inter-field' && (
              <Alert className="mt-2">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  Inter-field and high-value transfers require management approval before processing.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* From Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Source (From)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Initiating Custodian</Label>
                <Input value={createForm.fromCustodian} disabled className="h-[52px] text-[15px] bg-muted/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Field Office</Label>
                <Select value={createForm.fromFieldOffice} onValueChange={v => setCreateForm(f => ({ ...f, fromFieldOffice: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {fieldOffices.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Building</Label>
                <Select value={createForm.fromBuilding} onValueChange={v => setCreateForm(f => ({ ...f, fromBuilding: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {buildings.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[15px] font-medium">Room / Location</Label>
                <Select value={createForm.fromRoom} onValueChange={v => setCreateForm(f => ({ ...f, fromRoom: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select room" /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {rooms.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* To Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Destination (To)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Receiving Custodian <span className="text-destructive">*</span></Label>
                <Select value={createForm.toCustodian} onValueChange={v => setCreateForm(f => ({ ...f, toCustodian: v }))}>
                  <SelectTrigger className={`h-[52px] text-[15px] ${formErrors.toCustodian ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select custodian" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {custodians.filter(c => c !== CURRENT_USER).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formErrors.toCustodian && <p className="text-destructive text-xs">{formErrors.toCustodian}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Field Office {createForm.transferType === 'inter-field' && <span className="text-destructive">*</span>}</Label>
                <Select value={createForm.toFieldOffice} onValueChange={v => setCreateForm(f => ({ ...f, toFieldOffice: v }))}>
                  <SelectTrigger className={`h-[52px] text-[15px] ${formErrors.toFieldOffice ? 'border-destructive' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {fieldOffices.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formErrors.toFieldOffice && <p className="text-destructive text-xs">{formErrors.toFieldOffice}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Building</Label>
                <Select value={createForm.toBuilding} onValueChange={v => setCreateForm(f => ({ ...f, toBuilding: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select building" /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {buildings.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[15px] font-medium">Room / Location <span className="text-destructive">*</span></Label>
                <Select value={createForm.toRoom} onValueChange={v => setCreateForm(f => ({ ...f, toRoom: v }))}>
                  <SelectTrigger className={`h-[52px] text-[15px] ${formErrors.toRoom ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select destination room" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {rooms.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formErrors.toRoom && <p className="text-destructive text-xs">{formErrors.toRoom}</p>}
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
                  {selectedAssetIds.size} selected · ${totalSelectedValue.toLocaleString()}
                </span>
              )}
            </div>
            {formErrors.assets && <p className="text-destructive text-xs mb-2">{formErrors.assets}</p>}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead className="text-[15px]">Asset ID</TableHead>
                    <TableHead className="text-[15px]">Name</TableHead>
                    <TableHead className="text-[15px]">Type</TableHead>
                    <TableHead className="text-[15px]">Location</TableHead>
                    <TableHead className="text-[15px]">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableAssets.map(asset => {
                    const isIneligible = ineligibleAssetIds.includes(asset.id);
                    return (
                      <TableRow
                        key={asset.id}
                        className={`${isIneligible ? 'opacity-40' : 'cursor-pointer/50'} ${selectedAssetIds.has(asset.id) ? 'bg-muted/30' : ''}`}
                        onClick={() => !isIneligible && toggleAssetSelection(asset.id)}
                      >
                        <TableCell className="text-[15px]">
                          <MuiCheckbox
                            checked={selectedAssetIds.has(asset.id)}
                            disabled={isIneligible}
                            onCheckedChange={() => toggleAssetSelection(asset.id)}
                          />
                        </TableCell>
                        <TableCell className="font-['Manrope'] text-[15px]">{asset.assetId}</TableCell>
                        <TableCell className="text-[15px]">{asset.name}</TableCell>
                        <TableCell className="text-[15px]">{asset.type}</TableCell>
                        <TableCell className="text-muted-foreground text-[15px]">{asset.currentLocation}</TableCell>
                        <TableCell className="font-['Manrope'] text-[15px]">${asset.acquisitionValue?.toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          <Separator />

          {/* Reason & Notes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Transfer Details</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Reason for Transfer <span className="text-destructive">*</span></Label>
                <Textarea
                  value={createForm.reason}
                  onChange={e => setCreateForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Describe the reason for this transfer..."
                  rows={3}
                  className={`text-[15px] placeholder:text-[14px] ${formErrors.reason ? 'border-destructive' : ''}`}
                />
                {formErrors.reason && <p className="text-destructive text-xs">{formErrors.reason}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Additional Notes</Label>
                <Textarea
                  value={createForm.notes}
                  onChange={e => setCreateForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any special handling instructions or notes..."
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
                  checked={createForm.acknowledgmentRequired}
                  onCheckedChange={v => setCreateForm(f => ({ ...f, acknowledgmentRequired: v }))}
                />
                <div>
                  <p className="text-[14px]">Require digital acknowledgment</p>
                  <p className="text-[13px] text-muted-foreground">Receiving custodian must confirm asset receipt in the system</p>
                </div>
              </label>
            </div>
          </div>

          {/* Validation summary */}
          {totalSelectedValue > 5000 && (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                High-value transfer (${totalSelectedValue.toLocaleString()}) — this will require additional management approval.
              </AlertDescription>
            </Alert>
          )}

          {/* Tips */}
          <div className="bg-muted/50 rounded-[4px] border p-4">
            <p className="text-[14px] text-muted-foreground mb-2 font-medium">Transfer Guidelines</p>
            <div className="space-y-1 text-[14px] text-muted-foreground">
              <p>- Assets marked as disposed, missing, or under survey cannot be transferred</p>
              <p>- Inter-field transfers always require management approval</p>
              <p>- A transfer form PDF will be auto-generated upon submission</p>
              <p>- Signed forms must be uploaded back into the system</p>
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
            <Button
              variant="outline"
              onClick={() => {
                toast.success('Transfer draft saved successfully');
                handleOpenChange(false);
              }}
              className="text-[15px]"
            >
              Save Draft
            </Button>
            <Button onClick={handleSubmit} className="gap-1.5 text-[15px]">
              <AddIcon className="w-4 h-4" />
              Submit Transfer
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
