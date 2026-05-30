import { useQuery } from '@tanstack/react-query'
import { getAssets } from '../services/assetsService'
import type { EnhancedAsset } from '../types'

export function useAssets() {
  return useQuery<EnhancedAsset[]>({
    queryKey: ['assets'],
    queryFn: getAssets,
    staleTime: 5 * 60 * 1000,
  })
}
