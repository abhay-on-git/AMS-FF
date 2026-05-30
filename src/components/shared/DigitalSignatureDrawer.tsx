import { useState, useRef, useEffect } from 'react'
import { PenLine, Pen, CheckCircle2, Info, X, User } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export interface DigitalSignatureData {
  signatoryName: string
  role:          string
  timestamp:     string
  method:        'typed' | 'drawn'
  signatureData?: string // base64 for drawn
}

interface DigitalSignatureDrawerProps {
  open:           boolean
  onOpenChange:   (open: boolean) => void
  signatoryName:  string
  signatoryRole:  string
  title?:         string
  description?:   string
  onConfirm:      (data: DigitalSignatureData) => void
  isLoading?:     boolean
}

export function DigitalSignatureDrawer({
  open, onOpenChange,
  signatoryName, signatoryRole,
  title = 'Digital Sign-Off',
  description = 'Confirm your digital signature to authorise this action.',
  onConfirm,
  isLoading = false,
}: DigitalSignatureDrawerProps) {
  const [method,    setMethod]    = useState<'typed' | 'drawn'>('typed')
  const [typedName, setTypedName] = useState('')
  const [agreed,    setAgreed]    = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn,  setHasDrawn]  = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (open) {
      setMethod('typed')
      setTypedName('')
      setAgreed(false)
      setHasDrawn(false)
      setIsDrawing(false)
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }, [open])

  // ── Canvas helpers ──────────────────────────────────────────────────────────
  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, rect: DOMRect) => {
    if ('touches' in e) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { x, y } = getPos(e, canvas.getBoundingClientRect())
    ctx.beginPath(); ctx.moveTo(x, y)
    setIsDrawing(true); setHasDrawn(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { x, y } = getPos(e, canvas.getBoundingClientRect())
    ctx.strokeStyle = '#121321'; ctx.lineWidth = 2
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.lineTo(x, y); ctx.stroke()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  // ── Validation & submit ──────────────────────────────────────────────────────
  const isValid = method === 'typed' ? typedName.trim().length > 0 && agreed
                                     : hasDrawn && agreed

  const handleConfirm = () => {
    if (!isValid) {
      if (method === 'typed' && !typedName.trim()) { toast.error('Please type your name to sign'); return }
      if (method === 'drawn' && !hasDrawn)          { toast.error('Please draw your signature');   return }
      toast.error('You must agree to the legal disclaimer'); return
    }
    const data: DigitalSignatureData = {
      signatoryName, role: signatoryRole,
      timestamp: new Date().toISOString(),
      method,
    }
    if (method === 'drawn' && canvasRef.current)
      data.signatureData = canvasRef.current.toDataURL('image/png')
    onConfirm(data)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0" onPointerDownOutside={(e) => e.preventDefault()}>
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <PenLine className="w-4 h-4 text-brand-navy dark:text-brand-teal shrink-0" />
            <SheetTitle className="text-[18px]">{title}</SheetTitle>
          </div>
          <SheetDescription className="text-[15px]">{description}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 font-['Manrope']">

          {/* Signatory info — read-only */}
          <section>
            <div className="flex items-center gap-1.5 mb-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-[13px] text-muted-foreground font-semibold uppercase tracking-wide">Signatory Information</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Full Name</Label>
                <Input value={signatoryName} disabled className="h-10 text-[15px] bg-muted/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium">Role</Label>
                <Input value={signatoryRole} disabled className="h-10 text-[15px] bg-muted/50" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[15px] font-medium">Date &amp; Time</Label>
                <Input
                  value={new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  disabled className="h-10 text-[15px] bg-muted/50"
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Signature method selector */}
          <section>
            <div className="flex items-center gap-1.5 mb-3">
              <PenLine className="w-4 h-4 text-muted-foreground" />
              <span className="text-[13px] text-muted-foreground font-semibold uppercase tracking-wide">Signature Method</span>
            </div>

            {/* Method tabs */}
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] mb-4 w-fit">
              {(['typed', 'drawn'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-4 py-2 rounded-[4px] text-[15px] flex items-center gap-1.5 transition-colors ${
                    method === m ? 'bg-[#121321] text-white shadow-sm' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {m === 'typed' ? <PenLine className="w-4 h-4" /> : <Pen className="w-4 h-4" />}
                  {m === 'typed' ? 'Type Name' : 'Draw Signature'}
                </button>
              ))}
            </div>

            {method === 'typed' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="typed-sig" className="text-[15px] font-medium">Type your full name</Label>
                  <Input
                    id="typed-sig"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="Enter your full name…"
                    className="h-10 text-[15px]"
                    autoFocus
                  />
                </div>
                {typedName.trim() && (
                  <div className="p-6 border rounded-[6px] bg-muted/30 flex items-center justify-center min-h-[80px]">
                    <p className="font-serif italic text-[28px] text-brand-navy dark:text-brand-teal">
                      {typedName}
                    </p>
                  </div>
                )}
              </div>
            )}

            {method === 'drawn' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[15px] font-medium">Draw your signature</Label>
                  {hasDrawn && (
                    <Button variant="ghost" size="sm" onClick={clearCanvas} className="h-7 text-[13px] gap-1">
                      <X className="w-3.5 h-3.5" />Clear
                    </Button>
                  )}
                </div>
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={140}
                  className="w-full border rounded-[6px] cursor-crosshair bg-background touch-none"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={() => setIsDrawing(false)}
                  onMouseLeave={() => setIsDrawing(false)}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={() => setIsDrawing(false)}
                />
                <p className="text-[13px] text-muted-foreground">Use your mouse or touchscreen to sign</p>
              </div>
            )}
          </section>

          <Separator />

          {/* Legal disclaimer */}
          <section>
            <div className="flex items-center gap-1.5 mb-3">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-[13px] text-muted-foreground font-semibold uppercase tracking-wide">Legal Agreement</span>
            </div>
            <Alert className="bg-muted/30">
              <AlertDescription>
                <div className="space-y-3">
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    By signing, I confirm the accuracy of this record and acknowledge that this digital signature has the same legal effect as a handwritten signature under applicable electronic signature laws.
                  </p>
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="sig-agree"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-border cursor-pointer"
                    />
                    <Label htmlFor="sig-agree" className="text-[15px] cursor-pointer font-normal leading-snug">
                      I agree to the above statement and wish to sign this document digitally.
                    </Label>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </section>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t shrink-0 flex justify-end gap-2 font-['Manrope']">
          <Button variant="outline" className="text-[15px]" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-brand-navy hover:bg-brand-navy-mid text-white text-[15px] gap-1.5"
            disabled={!isValid || isLoading}
            onClick={handleConfirm}
          >
            <CheckCircle2 className="w-4 h-4" />Confirm &amp; Sign
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
