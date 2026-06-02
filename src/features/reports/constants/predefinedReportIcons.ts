import { Gavel, MapPin, Package, TrendingUp, Users, type LucideIcon } from 'lucide-react'

export const PREDEFINED_REPORT_ICONS: Record<string, LucideIcon> = {
  'asset-register-location': MapPin,
  'asset-register-field-office': Package,
  'asset-register-custodian': Users,
  'lifecycle-summary': TrendingUp,
  'disposal-summary': Gavel,
  'transfer-history': Package,
}
