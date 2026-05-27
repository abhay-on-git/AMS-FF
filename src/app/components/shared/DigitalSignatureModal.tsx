import React, { useState, useRef, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  DriveFileRenameOutline as PenIcon,
  Draw as DrawIcon,
  CheckCircle,
  Info as InfoIcon,
  Close as XIcon,
  Person as UserIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';

export interface DigitalSignatureData {
  signatoryName: string;
  role: string;
  timestamp: string;
  method: 'typed' | 'drawn';
  signatureData?: string; // Base64 for drawn signatures
}

interface DigitalSignatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-filled from session */
  signatoryName: string;
  signatoryRole: string;
  /** Title of the modal */
  title?: string;
  /** Description text */
  description?: string;
  /** Callback when signature is confirmed */
  onConfirm: (signatureData: DigitalSignatureData) => void;
}

export function DigitalSignatureModal({
  open,
  onOpenChange,
  signatoryName,
  signatoryRole,
  title = 'Digital Sign-Off',
  description = 'Confirm your signature to authorize this action.',
  onConfirm,
}: DigitalSignatureModalProps) {
  const [signMethod, setSignMethod] = useState<'typed' | 'drawn'>('typed');
  const [typedName, setTypedName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    // Reset form when modal opens
    if (open) {
      setTypedName('');
      setAgreed(false);
      setHasDrawn(false);
      setSignMethod('typed');
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    }
  }, [open]);

  // ── Canvas Drawing ──
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = '#121321';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  };

  const handleConfirm = () => {
    // Validation
    if (signMethod === 'typed' && !typedName.trim()) {
      toast.error('Please type your name to sign');
      return;
    }
    if (signMethod === 'drawn' && !hasDrawn) {
      toast.error('Please draw your signature');
      return;
    }
    if (!agreed) {
      toast.error('You must agree to the legal disclaimer to sign');
      return;
    }

    // Collect signature data
    const signatureData: DigitalSignatureData = {
      signatoryName,
      role: signatoryRole,
      timestamp: new Date().toISOString(),
      method: signMethod,
    };

    if (signMethod === 'drawn' && canvasRef.current) {
      signatureData.signatureData = canvasRef.current.toDataURL('image/png');
    }

    onConfirm(signatureData);
    toast.success('Signature confirmed successfully');
    onOpenChange(false);
  };

  const isValid = () => {
    if (signMethod === 'typed' && !typedName.trim()) return false;
    if (signMethod === 'drawn' && !hasDrawn) return false;
    if (!agreed) return false;
    return true;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full sm:!max-w-2xl flex flex-col overflow-hidden p-0">
        <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <PenIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
            {title}
          </SheetTitle>
          <SheetDescription className="text-[15px]">{description}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pr-8 px-6 py-4 space-y-6">
          {/* Read-only signatory info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Signatory Information</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Full Name</Label>
                <Input value={signatoryName} disabled className="h-[52px] text-[15px] bg-muted/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Role / Designation</Label>
                <Input value={signatoryRole} disabled className="h-[52px] text-[15px] bg-muted/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Date & Time</Label>
                <Input
                  value={new Date().toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  disabled
                  className="h-[52px] text-[15px] bg-muted/50"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Signature method tabs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PenIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">Signature Method</span>
            </div>
            <Tabs value={signMethod} onValueChange={(v) => setSignMethod(v as 'typed' | 'drawn')}>
              <TabsList className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
                <TabsTrigger value="typed" className="px-4 py-2 rounded-[4px] text-sm transition-colors data-[state=active]:bg-[#121321] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-[#121321] border border-transparent data-[state=inactive]:border-[#121321]/20 data-[state=inactive]:[#121321]/5 dark:text-white dark:data-[state=inactive]:border-white/20 gap-2">
                  <PenIcon className="w-4 h-4" />
                  Type Name
                </TabsTrigger>
                <TabsTrigger value="drawn" className="px-4 py-2 rounded-[4px] text-sm transition-colors data-[state=active]:bg-[#121321] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-[#121321] border border-transparent data-[state=inactive]:border-[#121321]/20 data-[state=inactive]:[#121321]/5 dark:text-white dark:data-[state=inactive]:border-white/20 gap-2">
                  <DrawIcon className="w-4 h-4" />
                  Draw Signature
                </TabsTrigger>
              </TabsList>

              <TabsContent value="typed" className="space-y-3 mt-4">
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium" htmlFor="typed-name">Type your full name</Label>
                  <Input
                    id="typed-name"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="Enter your full name..."
                    className="h-[52px] font-serif italic text-lg placeholder:text-[14px]"
                    autoFocus
                  />
                </div>
                {typedName.trim() && (
                  <div className="p-6 border rounded-md bg-muted/30 flex items-center justify-center min-h-[100px]">
                    <p className="font-serif italic text-3xl text-[#121321] dark:text-[#81CCD7]">
                      {typedName}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="drawn" className="space-y-3 mt-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-[15px] font-medium">Draw your signature below</Label>
                    {hasDrawn && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearCanvas}
                        className="h-7 text-xs"
                      >
                        <XIcon className="w-3.5 h-3.5 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={150}
                    className="w-full border rounded-md cursor-crosshair bg-background touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use your mouse or finger to draw your signature
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          {/* Legal disclaimer */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <InfoIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Legal Agreement</span>
            </div>
            <Alert className="bg-muted/30">
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
              <AlertDescription>
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By signing, I confirm the accuracy of this record and acknowledge that this digital signature has the same legal effect as a handwritten signature.
                  </p>
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agree-disclaimer"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-border"
                    />
                    <Label htmlFor="agree-disclaimer" className="text-[14px] cursor-pointer font-normal">
                      I agree to the above statement and wish to sign this document digitally
                    </Label>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <div className="px-6 py-4 border-t shrink-0 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-[15px]">
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid()} className="text-[15px]">
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm & Sign
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
