import { apiClient } from '@/services/apiClient'
import { IS_MOCK } from '@/services/mockMode'
import {
  mockFieldOffices,
  mockLocationNodes,
} from '../constants/locationsData'
import { getMaxHierarchyDepth } from '../lib/hierarchyUtils'
import type { FieldOfficeConfig, FieldOfficeSummary, LocationNode } from '../types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

let _fieldOffices: FieldOfficeConfig[] = [...mockFieldOffices]
let _locations: LocationNode[] = [...mockLocationNodes]

export interface LocationFilters {
  fieldOfficeId?: string
  search?: string
}

function computeSummaries(
  offices: FieldOfficeConfig[],
  locations: LocationNode[],
): FieldOfficeSummary[] {
  return offices.map((fo) => {
    const officeLocs = locations.filter((l) => l.fieldOfficeId === fo.id)
    const lastUpdated = officeLocs.reduce(
      (latest, l) => (l.lastUpdated > latest ? l.lastUpdated : latest),
      '',
    )
    return {
      fieldOfficeId: fo.id,
      fieldOfficeName: fo.name,
      locationCount: officeLocs.length,
      activeLocationCount: officeLocs.filter((l) => l.status === 'active').length,
      assetCount: officeLocs.reduce((sum, l) => sum + l.assetCount, 0),
      userCount: officeLocs.reduce((sum, l) => sum + l.assignedUserCount, 0),
      hierarchyDepth: getMaxHierarchyDepth(fo.id, locations),
      lastUpdated: lastUpdated || new Date().toISOString().split('T')[0],
    }
  })
}

export async function getFieldOffices(): Promise<FieldOfficeConfig[]> {
  if (IS_MOCK) {
    await delay(500)
    return [..._fieldOffices]
  }
  const { data } = await apiClient.get<FieldOfficeConfig[]>('/field-offices')
  return data
}

export async function getLocations(filters?: LocationFilters): Promise<LocationNode[]> {
  if (IS_MOCK) {
    await delay(500)
    let result = [..._locations]
    if (filters?.fieldOfficeId) {
      result = result.filter((l) => l.fieldOfficeId === filters.fieldOfficeId)
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (l) => l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q),
      )
    }
    return result
  }
  const { data } = await apiClient.get<LocationNode[]>('/locations', { params: filters })
  return data
}

export async function getFieldOfficeSummaries(): Promise<FieldOfficeSummary[]> {
  if (IS_MOCK) {
    await delay(400)
    return computeSummaries(_fieldOffices, _locations)
  }
  const { data } = await apiClient.get<FieldOfficeSummary[]>('/field-offices/summaries')
  return data
}

export async function createLocation(location: LocationNode): Promise<LocationNode> {
  if (IS_MOCK) {
    await delay(600)
    _locations = [..._locations, location]
    return location
  }
  const { data } = await apiClient.post<LocationNode>('/locations', location)
  return data
}

export async function updateLocation(
  id: string,
  data: Partial<LocationNode>,
): Promise<LocationNode> {
  if (IS_MOCK) {
    await delay(600)
    _locations = _locations.map((l) => (l.id === id ? { ...l, ...data } : l))
    return { ..._locations.find((l) => l.id === id)! }
  }
  const { data: updated } = await apiClient.patch<LocationNode>(`/locations/${id}`, data)
  return updated
}

export async function saveLocation(location: LocationNode): Promise<LocationNode> {
  const existing = _locations.find((l) => l.id === location.id)
  if (existing) return updateLocation(location.id, location)
  return createLocation(location)
}

export async function deleteLocation(id: string): Promise<void> {
  if (IS_MOCK) {
    await delay(500)
    _locations = _locations.filter((l) => l.id !== id)
    return
  }
  await apiClient.delete(`/locations/${id}`)
}

export async function createFieldOffice(office: FieldOfficeConfig): Promise<FieldOfficeConfig> {
  if (IS_MOCK) {
    await delay(700)
    _fieldOffices = [..._fieldOffices, office]
    return office
  }
  const { data } = await apiClient.post<FieldOfficeConfig>('/field-offices', office)
  return data
}

export async function updateFieldOffice(
  id: string,
  data: Partial<FieldOfficeConfig>,
): Promise<FieldOfficeConfig> {
  if (IS_MOCK) {
    await delay(700)
    _fieldOffices = _fieldOffices.map((fo) => (fo.id === id ? { ...fo, ...data } : fo))
    return { ..._fieldOffices.find((fo) => fo.id === id)! }
  }
  const { data: updated } = await apiClient.patch<FieldOfficeConfig>(`/field-offices/${id}`, data)
  return updated
}

export async function saveFieldOffice(office: FieldOfficeConfig): Promise<FieldOfficeConfig> {
  const existing = _fieldOffices.find((fo) => fo.id === office.id)
  if (existing) return updateFieldOffice(office.id, office)
  return createFieldOffice(office)
}
