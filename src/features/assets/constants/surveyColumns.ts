import type { AssetColumnConfig } from '../types'
import type { SurveyRequest } from '../types/surveyTypes'

export const defaultSurveyColumns: AssetColumnConfig<SurveyRequest>[] = [
  { key: 'surveyId',       label: 'Survey ID',     visible: true,  sortable: true  },
  { key: 'surveyType',     label: 'Type',          visible: true,  sortable: true  },
  { key: 'title',          label: 'Title',         visible: true,  sortable: true  },
  { key: 'status',         label: 'Status',        visible: true,  sortable: true  },
  { key: 'fieldOffice',    label: 'Field Office',  visible: true,  sortable: true  },
  { key: 'surveyTeamLead', label: 'Team Lead',     visible: true,  sortable: true  },
  { key: 'accuracyRate',   label: 'Accuracy',      visible: true,  sortable: true  },
  { key: 'plannedStartDate', label: 'Start Date',  visible: true,  sortable: true  },
  { key: 'plannedEndDate',   label: 'End Date',    visible: false, sortable: true  },
  { key: 'totalExpected',  label: 'Expected',      visible: false, sortable: true  },
  { key: 'totalVerified',  label: 'Verified',      visible: false, sortable: true  },
  { key: 'totalDiscrepancies', label: 'Discrepancies', visible: false, sortable: true },
  { key: 'createdBy',      label: 'Created By',    visible: false, sortable: true  },
]
