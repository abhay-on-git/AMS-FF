import { Lock, Settings } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AVAILABLE_FIELDS } from '../../constants/reportingData'

interface CustomReportFieldPickerProps {
  selectedFields: string[]
  onChange: (fields: string[]) => void
  isManagerOrAbove: boolean
}

export function CustomReportFieldPicker({
  selectedFields,
  onChange,
  isManagerOrAbove,
}: CustomReportFieldPickerProps) {
  const toggle = (id: string, checked: boolean) => {
    if (checked) onChange([...selectedFields, id])
    else onChange(selectedFields.filter((f) => f !== id))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-muted-foreground" />
            Select Fields to Include
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-9 px-3 text-base"
              onClick={() =>
                onChange(
                  AVAILABLE_FIELDS.filter((f) => !f.sensitive || isManagerOrAbove).map((f) => f.id),
                )
              }
            >
              Select All
            </Button>
            <Button size="sm" variant="ghost" className="h-9 px-3 text-base" onClick={() => onChange(['assetId', 'name'])}>
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {AVAILABLE_FIELDS.map((field) => {
            const disabled = field.sensitive && !isManagerOrAbove
            return (
              <div key={field.id} className="flex items-center gap-2">
                <Checkbox
                  id={field.id}
                  checked={selectedFields.includes(field.id)}
                  disabled={disabled}
                  onCheckedChange={(c) => toggle(field.id, c === true)}
                />
                <Label htmlFor={field.id} className={`cursor-pointer text-base ${disabled ? 'opacity-60' : ''}`}>
                  {field.label}
                  {field.sensitive && <Lock className="ml-1 inline h-3.5 w-3.5 text-muted-foreground" />}
                </Label>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
