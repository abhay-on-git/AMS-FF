import type { CreateAssetFormData } from '../schemas/assetSchemas'
import type { EnhancedAsset } from '../types'
import type { DraftAsset } from '../types/draftTypes'

export const emptyFormValues: CreateAssetFormData = {
  assetId: '', epc: '', type: '', name: '', fieldOffice: '', location: '',
  barcode: '', description: '', responsiblePerson: '', serialNumber: '',
  condition: 'Good', status: 'active', poNumber: '', grnNumber: '',
  supplier: '', acquisitionDate: '', quantity: '1', unitPrice: '',
  currency: 'USD', totalValue: '', classification: '', custodian: '', notes: '',
}

/** Pre-fills form from a SAP draft — user must still supply Asset ID, EPC, type. */
export function fromDraftValues(draft: DraftAsset): CreateAssetFormData {
  return {
    assetId: '', epc: '', barcode: '', serialNumber: '', type: '',
    name:            draft.itemDescription,
    description:     draft.itemDescription,
    fieldOffice: '', location: '', responsiblePerson: '',
    condition:       'Good',
    status:          'active',
    poNumber:        draft.poNumber,
    grnNumber:       draft.grnNumber,
    supplier:        draft.supplier,
    acquisitionDate: draft.acquisitionDate,
    quantity:        String(draft.quantity),
    unitPrice:       String(draft.unitPrice),
    currency:        draft.currency,
    totalValue:      String(draft.totalCost),
    classification:  draft.classification,
    custodian: '', notes: '',
  }
}

/** Maps an existing EnhancedAsset back into form values for editing. */
export function toFormValues(asset: EnhancedAsset): CreateAssetFormData {
  return {
    assetId:           asset.assetId,
    epc:               asset.epc,
    type:              asset.type,
    name:              asset.name,
    fieldOffice:       asset.fieldOffice,
    location:          asset.location,
    barcode:           asset.barcode           ?? '',
    description:       asset.description       ?? '',
    responsiblePerson: asset.responsiblePerson ?? '',
    serialNumber:      asset.serialNumber      ?? '',
    condition:         asset.condition,
    status:            asset.status,
    poNumber:          asset.poNumber          ?? '',
    grnNumber:         asset.grnNumber         ?? '',
    supplier:          '',
    acquisitionDate:   asset.acquisitionDate   ?? '',
    quantity:          '1',
    unitPrice:         '',
    currency:          asset.currency          ?? 'USD',
    totalValue:        '',
    classification:    '',
    custodian:         '',
    notes:             asset.notes             ?? '',
  }
}
