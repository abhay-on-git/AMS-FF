import React, { useState, useEffect, useMemo } from 'react';
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
  Delete as DisposalIcon,
  Person as UserIcon,
  Assignment as ClipboardIcon,
  Notifications as BellIcon,
  Send as SendIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as AlertCircle,
  AttachMoney as MoneyIcon,
  Security as ComplianceIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { DisposalMethod, getDisposalMethodLabel } from './disposalTypes';
import { TransferAssetItem } from './transferTypes';
import { fieldOffices, custodians } from './transferTypes';

export interface DisposalFormData {
  disposalMethod: DisposalMethod;
  title: string;
  justification: string;
  notes: string;
  requestedBy: string;
  reviewer: string;
  approver: string;
  disposalOfficer: string;
  fieldOffice: string;
  targetDisposalDate: string;
  recipientOrganization: string;
  auctionReferenceNumber: string;
  environmentalCompliance: boolean;
  dataWipeCertified: boolean;
  certificateOfDestruction: boolean;
  workflowType: 'hq' | 'field' | 'local';
  sendNotifications: boolean;
  // Per-asset disposal values
  assetDisposalValues: Record<string, { disposalValue: number; reason: string }>;
}

interface InitiateDisposalDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: DisposalFormData, selectedAssets: TransferAssetItem[]) => void;
  availableAssets: TransferAssetItem[];
  preSelectedAssetIds?: Set<string>;
}

const defaultForm: DisposalFormData = {
  disposalMethod: 'write-off',
  title: '',
  justification: '',
  notes: '',
  requestedBy: 'John Doe',
  reviewer: '',
  approver: '',
  disposalOfficer: '',
  fieldOffice: 'Headquarters',
  targetDisposalDate: '',
  recipientOrganization: '',
  auctionReferenceNumber: '',
  environmentalCompliance: false,
  dataWipeCertified: false,
  certificateOfDestruction: false,
  workflowType: 'hq',
  sendNotifications: true,
  assetDisposalValues: {},
};

export function InitiateDisposalDrawer({
  open,
  onOpenChange,
  onSubmit,
  availableAssets,
  preSelectedAssetIds,
}: InitiateDisposalDrawerProps) {
  const [form, setForm] = useState<DisposalFormData>({ ...defaultForm });
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && preSelectedAssetIds && preSelectedAssetIds.size > 0) {
      setSelectedAssetIds(new Set(preSelectedAssetIds));
    }
  }, [open, preSelectedAssetIds]);

  const resetForm = () => {
    setForm({ ...defaultForm });
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

  const selectedAssets = useMemo(() =>
    availableAssets.filter(a => selectedAssetIds.has(a.id)),
    [availableAssets, selectedAssetIds]
  );

  const totalAcquisitionValue = selectedAssets.reduce((sum, a) => sum + (a.acquisitionValue || 0), 0);
  const totalDisposalValue = selectedAssets.reduce((sum, a) => {
    const dv = form.assetDisposalValues[a.id];
    return sum + (dv?.disposalValue || 0);
  }, 0);

  const updateAssetDisposalValue = (assetId: string, field: 'disposalValue' | 'reason', value: number | string) => {
    setForm(f => ({
      ...f,
      assetDisposalValues: {
        ...f.assetDisposalValues,
        [assetId]: {
          ...(f.assetDisposalValues[assetId] || { disposalValue: 0, reason: '' }),
          [field]: value,
        },
      },
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.justification.trim()) errors.justification = 'Justification is required';
    if (!form.reviewer) errors.reviewer = 'Finance reviewer is required';
    if (!form.approver) errors.approver = 'Approving authority is required';
    if (!form.targetDisposalDate) errors.targetDisposalDate = 'Target disposal date is required';
    if (selectedAssetIds.size === 0) errors.assets = 'Select at least one asset';
    if ((form.disposalMethod === 'donation' || form.disposalMethod === 'recycling') && !form.recipientOrganization.trim()) {
      errors.recipientOrganization = 'Recipient organization is required for this method';
    }
    if (form.disposalMethod === 'auction' && !form.auctionReferenceNumber.trim()) {
      errors.auctionReferenceNumber = 'Auction reference number is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    const assets = availableAssets.filter(a => selectedAssetIds.has(a.id));
    onSubmit(form, assets);
    resetForm();
  };

  const showRecipient = ['donation', 'recycling', 'trade-in'].includes(form.disposalMethod);
  const showAuction = form.disposalMethod === 'auction';

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-2xl flex flex-col overflow-hidden p-0">
        <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <DisposalIcon className="w-5 h-5" />
            Initiate Asset Disposal
          </SheetTitle>
          <SheetDescription className="text-[15px]">
            Create a new disposal request. The system will route for finance review and management approval before processing.
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

          {/* Disposal Method */}
          <div>
            <Label className="text-[15px] font-medium mb-2 block">Disposal Method <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-3 gap-2">
              {(['write-off', 'donation', 'auction', 'scrap', 'trade-in', 'recycling'] as DisposalMethod[]).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, disposalMethod: method }))}
                  className={`p-3 rounded-[4px] border text-left transition-all ${
                    form.disposalMethod === method
                      ? 'border-[#121321] bg-[#121321]/5 dark:border-[#81CCD7] dark:bg-[#81CCD7]/10'
                      : 'border-border[#121321]/40'
                  }`}
                >
                  <p className="text-sm font-medium">{getDisposalMethodLabel(method)}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {method === 'write-off' && 'Total loss / damage'}
                    {method === 'donation' && 'Donate to org'}
                    {method === 'auction' && 'Sell via auction'}
                    {method === 'scrap' && 'Scrap / destroy'}
                    {method === 'trade-in' && 'Vendor trade-in'}
                    {method === 'recycling' && 'E-waste recycling'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Title & Justification */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Disposal Details</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Title <span className="text-destructive">*</span></Label>
                <Input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g., Write-Off: Water-Damaged Desktop"
                  className={`h-[52px] text-[15px] placeholder:text-[14px] ${formErrors.title ? 'border-destructive' : ''}`}
                />
                {formErrors.title && <p className="text-destructive text-xs">{formErrors.title}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Justification <span className="text-destructive">*</span></Label>
                <Textarea
                  value={form.justification}
                  onChange={e => setForm(f => ({ ...f, justification: e.target.value }))}
                  placeholder="Provide detailed justification for disposal..."
                  rows={3}
                  className={`text-[15px] placeholder:text-[14px] ${formErrors.justification ? 'border-destructive' : ''}`}
                />
                {formErrors.justification && <p className="text-destructive text-xs">{formErrors.justification}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Additional Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any additional notes or context..."
                  rows={2}
                  className="text-[15px] placeholder:text-[14px]"
                />
              </div>
              {showRecipient && (
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Recipient Organization {['donation', 'recycling'].includes(form.disposalMethod) && <span className="text-destructive">*</span>}</Label>
                  <Input
                    value={form.recipientOrganization}
                    onChange={e => setForm(f => ({ ...f, recipientOrganization: e.target.value }))}
                    placeholder="e.g., Springfield Elementary School"
                    className={`h-[52px] text-[15px] placeholder:text-[14px] ${formErrors.recipientOrganization ? 'border-destructive' : ''}`}
                  />
                  {formErrors.recipientOrganization && <p className="text-destructive text-xs">{formErrors.recipientOrganization}</p>}
                </div>
              )}
              {showAuction && (
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">Auction Reference Number <span className="text-destructive">*</span></Label>
                  <Input
                    value={form.auctionReferenceNumber}
                    onChange={e => setForm(f => ({ ...f, auctionReferenceNumber: e.target.value }))}
                    placeholder="e.g., AUC-2026-0044"
                    className={`h-[52px] text-[15px] placeholder:text-[14px] ${formErrors.auctionReferenceNumber ? 'border-destructive' : ''}`}
                  />
                  {formErrors.auctionReferenceNumber && <p className="text-destructive text-xs">{formErrors.auctionReferenceNumber}</p>}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Assignment */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Approval Chain</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Requesting Officer</Label>
                <Input value={form.requestedBy} disabled className="h-[52px] text-[15px] bg-muted/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Finance Reviewer <span className="text-destructive">*</span></Label>
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
                <Label className="text-[15px] font-medium">Approving Authority <span className="text-destructive">*</span></Label>
                <Select value={form.approver} onValueChange={v => setForm(f => ({ ...f, approver: v }))}>
                  <SelectTrigger className={`h-[52px] text-[15px] ${formErrors.approver ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select approver" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {custodians.map(c => <SelectItem key={c} value={c} className="text-[15px]">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formErrors.approver && <p className="text-destructive text-xs">{formErrors.approver}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Disposal Officer</Label>
                <Select value={form.disposalOfficer} onValueChange={v => setForm(f => ({ ...f, disposalOfficer: v }))}>
                  <SelectTrigger className="h-[52px] text-[15px]"><SelectValue placeholder="Select officer" /></SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {custodians.map(c => <SelectItem key={c} value={c} className="text-[15px]">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
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
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Target Disposal Date <span className="text-destructive">*</span></Label>
                <Input
                  type="date"
                  value={form.targetDisposalDate}
                  onChange={e => setForm(f => ({ ...f, targetDisposalDate: e.target.value }))}
                  className={`h-[52px] text-[15px] ${formErrors.targetDisposalDate ? 'border-destructive' : ''}`}
                />
                {formErrors.targetDisposalDate && <p className="text-destructive text-xs">{formErrors.targetDisposalDate}</p>}
              </div>
            </div>
          </div>

          <Separator />

          {/* Asset Selection with Disposal Values */}
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
                    <TableHead>Acq. Value</TableHead>
                    <TableHead>Disposal Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableAssets.map(asset => (
                    <TableRow
                      key={asset.id}
                      className={`cursor-pointer/50 ${selectedAssetIds.has(asset.id) ? 'bg-muted/30' : ''}`}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).tagName === 'INPUT') return;
                        toggleAssetSelection(asset.id);
                      }}
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
                      <TableCell className="font-['Manrope']">${asset.acquisitionValue?.toLocaleString()}</TableCell>
                      <TableCell>
                        {selectedAssetIds.has(asset.id) && (
                          <Input
                            type="number"
                            min={0}
                            className="h-7 w-24 text-sm"
                            placeholder="$0"
                            value={form.assetDisposalValues[asset.id]?.disposalValue || ''}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateAssetDisposalValue(asset.id, 'disposalValue', Number(e.target.value))}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Financial Summary */}
          {selectedAssetIds.size > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MoneyIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-[14px] text-muted-foreground">Financial Summary</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-[4px] border bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">Total Acquisition Value</p>
                  <p className="text-sm font-['Manrope'] font-medium">${totalAcquisitionValue.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-[4px] border bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">Total Disposal Value</p>
                  <p className="text-sm font-['Manrope'] font-medium">${totalDisposalValue.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-[4px] border bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">Write-Off Amount</p>
                  <p className="text-sm font-['Manrope'] font-medium text-destructive">${(totalAcquisitionValue - totalDisposalValue).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Compliance */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ComplianceIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Compliance & Certification</span>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <MuiCheckbox
                  checked={form.environmentalCompliance}
                  onCheckedChange={v => setForm(f => ({ ...f, environmentalCompliance: v }))}
                />
                <div>
                  <p className="text-[14px]">Environmental compliance confirmed</p>
                  <p className="text-[13px] text-muted-foreground">Disposal method meets environmental regulations</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <MuiCheckbox
                  checked={form.dataWipeCertified}
                  onCheckedChange={v => setForm(f => ({ ...f, dataWipeCertified: v }))}
                />
                <div>
                  <p className="text-[14px]">Data wipe certified</p>
                  <p className="text-[13px] text-muted-foreground">All data has been securely erased per policy (DoD 5220.22-M or equivalent)</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <MuiCheckbox
                  checked={form.certificateOfDestruction}
                  onCheckedChange={v => setForm(f => ({ ...f, certificateOfDestruction: v }))}
                />
                <div>
                  <p className="text-[14px]">Certificate of destruction required</p>
                  <p className="text-[13px] text-muted-foreground">Request formal certificate from disposal vendor</p>
                </div>
              </label>
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
                  checked={form.sendNotifications}
                  onCheckedChange={v => setForm(f => ({ ...f, sendNotifications: v }))}
                />
                <div>
                  <p className="text-[14px]">Send notifications</p>
                  <p className="text-[13px] text-muted-foreground">Notify finance reviewer and approving authority via email</p>
                </div>
              </label>
            </div>
          </div>

          {/* High value warning */}
          {totalAcquisitionValue > 5000 && (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                High-value disposal (${totalAcquisitionValue.toLocaleString()}) — this will require additional management approval and may trigger an audit review.
              </AlertDescription>
            </Alert>
          )}

          {/* Tips */}
          <div className="bg-muted/50 rounded-[4px] border p-4">
            <p className="text-[14px] text-muted-foreground mb-2 font-medium">Disposal Guidelines</p>
            <div className="space-y-1 text-[14px] text-muted-foreground">
              <p>- All disposals require finance review and management approval</p>
              <p>- IT assets must have certified data wipe before disposal</p>
              <p>- Donations require a donation letter and recipient acknowledgment</p>
              <p>- Environmental compliance must be confirmed for scrap and recycling</p>
              <p>- High-value disposals (&gt;$5,000) may trigger audit procedures</p>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t bg-background px-6 py-4 flex justify-between items-center shrink-0">
          <p className="text-xs text-muted-foreground">
            {selectedAssetIds.size} asset{selectedAssetIds.size !== 1 ? 's' : ''} · ${totalAcquisitionValue.toLocaleString()} total value
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)} className="text-[15px]">Cancel</Button>
            <Button onClick={handleSubmit} className="gap-1.5 text-[15px]">
              <SendIcon className="w-4 h-4" />
              Submit Disposal Request
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
