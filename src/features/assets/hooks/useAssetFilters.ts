import { useMemo, useState } from 'react'
import { useDebounce } from '@/hooks'
import type { EnhancedAsset, AdvancedFilterState } from '../types'
import { defaultAdvancedFilters } from '../types'

interface UseAssetFiltersReturn {
  search: string
  setSearch: (value: string) => void
  typeFilter: string
  setTypeFilter: (value: string) => void
  conditionFilter: string
  setConditionFilter: (value: string) => void
  locationFilter: string
  setLocationFilter: (value: string) => void
  classificationFilter: string
  setClassificationFilter: (value: string) => void
  advancedFilters: AdvancedFilterState
  setAdvancedFilters: (filters: AdvancedFilterState) => void
  filteredAssets: EnhancedAsset[]
  clearAllFilters: () => void
  activeFilterCount: number
}

export function useAssetFilters(assets: EnhancedAsset[]): UseAssetFiltersReturn {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [conditionFilter, setConditionFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [classificationFilter, setClassificationFilter] = useState('all')
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>(defaultAdvancedFilters)

  const debouncedSearch = useDebounce(search, 300)

  const filteredAssets = useMemo(() => {
    const q = debouncedSearch.toLowerCase()

    return assets.filter((asset) => {
      const matchesSearch =
        !q ||
        asset.assetId.toLowerCase().includes(q) ||
        asset.epc.toLowerCase().includes(q) ||
        asset.barcode.toLowerCase().includes(q) ||
        asset.serialNumber.toLowerCase().includes(q) ||
        (asset.poNumber && asset.poNumber.toLowerCase().includes(q)) ||
        asset.responsiblePerson.toLowerCase().includes(q) ||
        asset.location.toLowerCase().includes(q) ||
        asset.name.toLowerCase().includes(q)

      const matchesType = typeFilter === 'all' || asset.type === typeFilter
      const matchesLocation = locationFilter === 'all' || asset.location.includes(locationFilter)
      const matchesCondition = conditionFilter === 'all' || asset.condition === conditionFilter

      const matchesClassification =
        classificationFilter === 'all' ||
        (classificationFilter === 'Capital' && asset.acquisitionValue !== undefined && asset.acquisitionValue >= 2000) ||
        (classificationFilter === 'Attractive' && asset.acquisitionValue !== undefined && asset.acquisitionValue < 2000)

      const af = advancedFilters
      const matchesFieldOffice = af.fieldOffice === 'all' || asset.fieldOffice === af.fieldOffice
      const matchesAdvLocation = af.location === 'all' || asset.location === af.location
      const matchesCustodian = !af.custodian || asset.responsiblePerson.toLowerCase().includes(af.custodian.toLowerCase())
      const matchesCategory = af.category === 'all' || asset.category === af.category
      const matchesLifecycle = af.lifecycleStatus === 'all' || asset.status === af.lifecycleStatus
      const matchesAdvCondition = af.condition === 'all' || asset.condition === af.condition
      const matchesPO = !af.poNumber || (asset.poNumber && asset.poNumber.toLowerCase().includes(af.poNumber.toLowerCase()))
      const matchesGRN = !af.grnNumber || (asset.grnNumber && asset.grnNumber.toLowerCase().includes(af.grnNumber.toLowerCase()))
      const matchesAcqFrom = !af.acquisitionDateFrom || (asset.acquisitionDate && asset.acquisitionDate >= af.acquisitionDateFrom)
      const matchesAcqTo = !af.acquisitionDateTo || (asset.acquisitionDate && asset.acquisitionDate <= af.acquisitionDateTo)
      const matchesValueMin = !af.valueMin || (asset.acquisitionValue !== undefined && asset.acquisitionValue >= Number(af.valueMin))
      const matchesValueMax = !af.valueMax || (asset.acquisitionValue !== undefined && asset.acquisitionValue <= Number(af.valueMax))

      return (
        matchesSearch &&
        matchesType &&
        matchesLocation &&
        matchesCondition &&
        matchesClassification &&
        matchesFieldOffice &&
        matchesAdvLocation &&
        matchesCustodian &&
        matchesCategory &&
        matchesLifecycle &&
        matchesAdvCondition &&
        matchesPO &&
        matchesGRN &&
        matchesAcqFrom &&
        matchesAcqTo &&
        matchesValueMin &&
        matchesValueMax
      )
    })
  }, [assets, debouncedSearch, typeFilter, conditionFilter, locationFilter, classificationFilter, advancedFilters])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (search) count++
    if (typeFilter !== 'all') count++
    if (conditionFilter !== 'all') count++
    if (locationFilter !== 'all') count++
    if (classificationFilter !== 'all') count++
    Object.values(advancedFilters).forEach((v) => {
      if (v !== '' && v !== 'all') count++
    })
    return count
  }, [search, typeFilter, conditionFilter, locationFilter, classificationFilter, advancedFilters])

  const clearAllFilters = () => {
    setSearch('')
    setTypeFilter('all')
    setConditionFilter('all')
    setLocationFilter('all')
    setClassificationFilter('all')
    setAdvancedFilters(defaultAdvancedFilters)
  }

  return {
    search, setSearch,
    typeFilter, setTypeFilter,
    conditionFilter, setConditionFilter,
    locationFilter, setLocationFilter,
    classificationFilter, setClassificationFilter,
    advancedFilters, setAdvancedFilters,
    filteredAssets,
    clearAllFilters,
    activeFilterCount,
  }
}
