import { useQuery } from '@tanstack/react-query'
import { getAssets, getDrafts, getTransfers, getInspections, getSurveys, getDisposals } from '../services/assetsService'
import type { EnhancedAsset } from '../types'
import type { DraftAsset } from '../types/draftTypes'
import type { TransferRequest } from '../types/transferTypes'
import type { InspectionRequest } from '../types/inspectionTypes'
import type { SurveyRequest } from '../types/surveyTypes'
import type { DisposalRequest } from '../types/disposalTypes'

export function useAssets() {
  return useQuery<EnhancedAsset[]>({
    queryKey: ['assets'],
    queryFn: getAssets,
    staleTime: 5 * 60 * 1000,
  })
}

export function useDrafts() {
  return useQuery<DraftAsset[]>({
    queryKey: ['assets', 'drafts'],
    queryFn: getDrafts,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTransfers() {
  return useQuery<TransferRequest[]>({
    queryKey: ['assets', 'transfers'],
    queryFn: getTransfers,
    staleTime: 5 * 60 * 1000,
  })
}

export function useInspections() {
  return useQuery<InspectionRequest[]>({
    queryKey: ['assets', 'inspections'],
    queryFn: getInspections,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSurveys() {
  return useQuery<SurveyRequest[]>({
    queryKey: ['assets', 'surveys'],
    queryFn: getSurveys,
    staleTime: 5 * 60 * 1000,
  })
}

export function useDisposals() {
  return useQuery<DisposalRequest[]>({
    queryKey: ['assets', 'disposals'],
    queryFn: getDisposals,
    staleTime: 5 * 60 * 1000,
  })
}
