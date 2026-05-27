import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
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
  Edit as EditIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as AlertCircle,
  Notifications as BellIcon,
  Send as SendIcon,
  Assignment as ClipboardIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { TransferAssetItem } from './transferTypes';
import { getStatusColor } from './types';

export type AssetStatus = 'active' | 'inactive' | 'maintenance' | 'missing' | 'disposed' | 'in-transit';

export interface ChangeStatusFormData {
  targetStatus: AssetStatus;
  reason: string;
  notes: string;
  sendNotifications: boolean;
  effectiveImmediately: boolean;
}

interface ChangeStatusDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: ChangeStatusFormData, selectedAssets: TransferAssetItem[]) => void;
  availableAssets: TransferAssetItem[];
  preSelectedAssetIds?: Set<string>;
}

const statusOptions: { value: AssetStatus; label: string; description: string }[] = [
  { value: 'active', label: 'Active', description: 'Asset is operational and in use' },
  { value: 'inactive', label: 'Inactive', description: 'Asset is not currently in use' },
  { value: 'maintenance', label: 'Maintenance', description: 'Asset is undergoing repair or servicing' },
  { value: 'missing', label: 'Missing', description: 'Asset cannot be located' },
  { value: 'disposed', label: 'Disposed', description: 'Asset has been permanently removed' },
  { value: 'in-transit', label: 'In Transit', description: 'Asset is being moved between locations' },
];

const defaultForm: ChangeStatusFormData = {
  targetStatus: 'active',
  reason: '',
  notes: '',
  sendNotifications: true,
  effectiveImmediately: true,
};

export function ChangeStatusDrawer({
  open,
  onOpenChange,
  onSubmit,
  availableAssets,
  preSelectedAssetIds,
}: ChangeStatusDrawerProps) {
  const [form, setForm] = useState<ChangeStatusFormData>({ ...defaultForm });
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

  const selectedAssets = useMemo(
    () => availableAssets.filter(a => selectedAssetIds.has(a.id)),
    [availableAssets, selectedAssetIds],
  );

  // Group selected assets by their current condition (used as a proxy for status in TransferAssetItem)
  const statusBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    selectedAssets.forEach(a => {
      const s = a.condition || 'unknown';
      map[s] = (map[s] || 0) + 1;
    });
    return map;
  }, [selectedAssets]);

  // Warn about risky transitions
  const hasDisposedTarget = form.targetStatus === 'disposed';
  const hasMissingTarget = form.targetStatus === 'missing';

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.targetStatus) errors.targetStatus = 'Target status is required';
    if (!form.reason.trim()) errors.reason = 'Reason for status change is required';
    if (selectedAssetIds.size === 0) errors.assets = 'Select at least one asset';
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

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-2xl flex flex-col overflow-hidden p-0">
        <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <EditIcon className="w-5 h-5" />
            Bulk Change Status
          </SheetTitle>
          <SheetDescription className="text-[15px]">
            Change the lifecycle status for selected assets. An audit trail entry will be created for each affected asset.
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

          {/* Target Status */}
          <div>
            <Label className="text-[15px] font-medium mb-2 block">New Status <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, targetStatus: opt.value }))}
                  className={`p-3 rounded-[4px] border text-left transition-all ${
                    form.targetStatus === opt.value
                      ? 'border-[#121321] bg-[#121321]/5 dark:border-[#81CCD7] dark:bg-[#81CCD7]/10'
                      : 'border-border[#121321]/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge className={`${getStatusColor(opt.value)} text-[10px] px-1.5 py-0`}>{opt.label}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{opt.description}</p>
                </button>
              ))}
            </div>
            {formErrors.targetStatus && <p className="text-destructive text-xs mt-1">{formErrors.targetStatus}</p>}
          </div>

          {/* Warnings */}
          {hasDisposedTarget && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                Setting status to <strong>Disposed</strong> is irreversible in practice. Disposed assets cannot be transferred, inspected, or surveyed. Consider using the formal Disposal workflow instead for proper audit trail and approval.
              </AlertDescription>
            </Alert>
          )}
          {hasMissingTarget && (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                Marking assets as <strong>Missing</strong> will trigger an investigation workflow. Custodians and supervisors will be notified. Assets locked by active surveys/disposals cannot be marked missing.
              </AlertDescription>
            </Alert>
          )}

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
                    <TableHead>Current Status</TableHead>
                    <TableHead>New Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableAssets.map(asset => {
                    const isSelected = selectedAssetIds.has(asset.id);
                    return (
                      <TableRow
                        key={asset.id}
                        className={`cursor-pointer/50 ${isSelected ? 'bg-muted/30' : ''}`}
                        onClick={() => toggleAssetSelection(asset.id)}
                      >
                        <TableCell>
                          <MuiCheckbox
                            checked={isSelected}
                            onCheckedChange={() => toggleAssetSelection(asset.id)}
                          />
                        </TableCell>
                        <TableCell className="font-['Manrope']">{asset.assetId}</TableCell>
                        <TableCell className="">{asset.name}</TableCell>
                        <TableCell className="">{asset.type}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(asset.condition)} text-xs`}>{asset.condition}</Badge>
                        </TableCell>
                        <TableCell>
                          {isSelected ? (
                            <div className="flex items-center gap-1.5">
                              <ArrowIcon className="w-3.5 h-3.5 text-muted-foreground" />
                              <Badge className={`${getStatusColor(form.targetStatus)} text-xs`}>{form.targetStatus}</Badge>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Status Breakdown */}
          {selectedAssetIds.size > 0 && Object.keys(statusBreakdown).length > 0 && (
            <div className="bg-muted/30 rounded-[4px] border p-3">
              <p className="text-xs text-muted-foreground mb-2">Current Status Breakdown</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-1.5">
                    <Badge className={`${getStatusColor(status)} text-[10px] px-1.5 py-0`}>{status}</Badge>
                    <span className="text-xs text-muted-foreground">{count} asset{count !== 1 ? 's' : ''}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 ml-2 pl-2 border-l">
                  <ArrowIcon className="w-3 h-3 text-muted-foreground" />
                  <Badge className={`${getStatusColor(form.targetStatus)} text-[10px] px-1.5 py-0`}>{form.targetStatus}</Badge>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Reason & Notes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Justification</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Reason for Status Change <span className="text-destructive">*</span></Label>
                <Textarea
                  value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Explain why these assets are being changed to the new status..."
                  rows={3}
                  className={`text-[15px] placeholder:text-[14px] ${formErrors.reason ? 'border-destructive' : ''}`}
                />
                {formErrors.reason && <p className="text-destructive text-xs">{formErrors.reason}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Additional Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any additional context or follow-up actions needed..."
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
                  checked={form.effectiveImmediately}
                  onCheckedChange={v => setForm(f => ({ ...f, effectiveImmediately: v }))}
                />
                <div>
                  <p className="text-[14px]">Apply immediately</p>
                  <p className="text-[13px] text-muted-foreground">Status change takes effect now. Uncheck to queue for supervisor approval.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <MuiCheckbox
                  checked={form.sendNotifications}
                  onCheckedChange={v => setForm(f => ({ ...f, sendNotifications: v }))}
                />
                <div>
                  <p className="text-[14px]">Send notifications</p>
                  <p className="text-[13px] text-muted-foreground">Notify custodians and supervisors of the status change via email</p>
                </div>
              </label>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-[4px] border p-4">
            <p className="text-[14px] text-muted-foreground mb-2 font-medium">Status Change Guidelines</p>
            <div className="space-y-1 text-[14px] text-muted-foreground">
              <p>- Every status change creates an audit trail entry with timestamp and reason</p>
              <p>- Assets locked by active surveys or disposals cannot have their status changed</p>
              <p>- Changing to"Disposed" should use the formal Disposal workflow when possible</p>
              <p>-"Missing" triggers an automatic investigation notification chain</p>
              <p>- Bulk status changes may require supervisor approval for 10+ assets</p>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t bg-background px-6 py-4 flex justify-between items-center shrink-0">
          <p className="text-xs text-muted-foreground">
            {selectedAssetIds.size} asset{selectedAssetIds.size !== 1 ? 's' : ''} will change to <Badge className={`${getStatusColor(form.targetStatus)} text-[10px] px-1.5 py-0 ml-1`}>{form.targetStatus}</Badge>
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)} className="text-[15px]">Cancel</Button>
            <Button onClick={handleSubmit} className="gap-1.5 text-[15px]">
              <SendIcon className="w-4 h-4" />
              Apply Status Change
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

