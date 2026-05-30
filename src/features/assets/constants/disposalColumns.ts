import type { AssetColumnConfig } from '../types'
import type { DisposalRequest } from '../types/disposalTypes'

export const defaultDisposalColumns: AssetColumnConfig<DisposalRequest>[] = [
  { key: 'disposalId',     label: 'Disposal ID',   visible: true,  sortable: true },
  { key: 'disposalMethod', label: 'Method',        visible: true,  sortable: true },
  { key: 'title',          label: 'Title',         visible: true,  sortable: true },
  { key: 'status',         label: 'Status',        visible: true,  sortable: true },
  { key: 'fieldOffice',    label: 'Field Office',  visible: true,  sortable: true },
  { key: 'requestedBy',    label: 'Requested By',  visible: true,  sortable: true },
  { key: 'totalNBV',       label: 'Total NBV',     visible: true,  sortable: true },
  { key: 'targetDisposalDate', label: 'Target Date', visible: true, sortable: true },
  { key: 'linkedSurveyId', label: 'Linked Survey', visible: false, sortable: false },
  { key: 'totalAcquisitionValue', label: 'Acq. Value', visible: false, sortable: true },
  { key: 'totalDisposalValue',    label: 'Disposal Value', visible: false, sortable: true },
  { key: 'writeOffAmount', label: 'Write-Off',     visible: false, sortable: true },
]
