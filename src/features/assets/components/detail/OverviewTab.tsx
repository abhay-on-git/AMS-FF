import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Pencil, Save, X, MapPin, User, Building2 } from 'lucide-react'
import type { EnhancedAsset, UserRole } from '../../types'
import { getStatusColor, getConditionColor, daysSince } from '../../utils'
import { formatDate } from '@/lib/utils/dateFormatter'

interface OverviewTabProps {
  asset: EnhancedAsset
  userRole: UserRole
  onChangeLocation: () => void
  onUpdateStatus: () => void
  onTransferAsset: () => void
}

function DetailRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="flex-1 min-w-0">
        <Label className="text-muted-foreground text-sm">{label}</Label>
        <p className={`mt-0.5 ${mono ? "font-['Manrope'] text-[15px]" : ''}`}>
          {value || '—'}
        </p>
      </div>
    </div>
  )
}

export function OverviewTab({ asset, userRole }: OverviewTabProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState(asset.notes || '')
  const [tempNotes, setTempNotes] = useState(asset.notes || '')

  const handleSaveNotes = () => {
    setNotes(tempNotes)
    setIsEditingNotes(false)
  }

  const handleCancelNotes = () => {
    setTempNotes(notes)
    setIsEditingNotes(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        {/* Identification & Classification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Identification & Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="space-y-1 pb-4 md:pb-0 md:pr-8">
                <DetailRow label="Asset ID" value={asset.assetId} mono />
                <DetailRow label="Serial Number" value={asset.serialNumber} mono />
                <DetailRow
                  label="EPC (Electronic Product Code)"
                  value={<span className="font-['Manrope'] text-sm break-all">{asset.epc}</span>}
                />
                <DetailRow label="Barcode" value={asset.barcode} mono />
              </div>
              <div className="space-y-1 pt-4 md:pt-0 md:pl-8">
                <DetailRow label="Type" value={asset.type} />
                <DetailRow label="Category" value={asset.category} />
                <DetailRow label="Owner" value={asset.owner} />
                <DetailRow label="Registration Date" value={formatDate(asset.createdDate)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assignment & Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-muted-foreground text-sm">Custodian</Label>
                </div>
                <p className="font-medium">{asset.responsiblePerson}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Since {formatDate(asset.lastCustodianChange)}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-muted-foreground text-sm">Location</Label>
                </div>
                <p className="font-medium">{asset.location}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Updated {formatDate(asset.lastLocationUpdate)}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-muted-foreground text-sm">Field Office</Label>
                </div>
                <p className="font-medium">{asset.fieldOffice}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="h-[278px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notes</CardTitle>
              {!isEditingNotes && userRole !== 'auditor' && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(true)}>
                  <Pencil className="w-4 h-4 mr-2" /> Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingNotes ? (
              <div className="space-y-3">
                <Textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Add notes about this asset..."
                  rows={4}
                  className="min-h-[160px] max-h-[300px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveNotes}>
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelNotes}>
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="min-h-[3rem] flex items-center">
                {notes ? (
                  <p className="text-[15px] leading-relaxed">{notes}</p>
                ) : (
                  <p className="text-[15px] text-muted-foreground italic">No notes available.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-5">
        {/* Status Monitor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Monitor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-muted-foreground">Current Status</span>
              <Badge className={getStatusColor(asset.status)}>
                {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-muted-foreground">Condition</span>
              <Badge className={getConditionColor(asset.condition)}>
                {asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1)}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-2 text-[15px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Status Change</span>
                <span>{formatDate(asset.lastStatusChange)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lifecycle Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lifecycle Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-[15px]">
              {asset.maintenanceCount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Maintenance Cycles</span>
                  <span className="font-medium">{asset.maintenanceCount}</span>
                </div>
              )}
              {asset.transferCount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transfers</span>
                  <span className="font-medium">{asset.transferCount}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Financial Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financial Reference</CardTitle>
            <p className="text-sm text-muted-foreground">Read-only financial data from procurement records</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm">PO Number</Label>
                  <p className="font-['Manrope'] font-medium text-sm">{asset.poNumber || '—'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">GRN Number</Label>
                  <p className="font-['Manrope'] font-medium">{asset.grnNumber || '—'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Acquisition Date</Label>
                  <p>{asset.acquisitionDate ? formatDate(asset.acquisitionDate) : '—'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Acquisition Value</Label>
                  <p className="font-medium text-lg">
                    {asset.acquisitionValue !== undefined
                      ? `${asset.currency || 'USD'} ${asset.acquisitionValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : '—'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Currency</Label>
                  <p>{asset.currency || '—'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Net Book Value (NBV)</Label>
                  <p className="font-medium text-lg">
                    {asset.nbv !== undefined
                      ? `${asset.currency || 'USD'} ${asset.nbv.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : '—'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
