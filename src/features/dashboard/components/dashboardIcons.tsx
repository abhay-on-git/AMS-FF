import type { LucideIcon } from 'lucide-react'
import {
  Package,
  CheckCircle,
  ArrowLeftRight,
  ClipboardCheck,
  Trash2,
  ClipboardList,
  Folder,
  MapPin,
  BarChart3,
  Users,
} from 'lucide-react'
import type { KpiIconKey, PendingActionType, QuickLinkIconKey } from '../types'

export const KPI_ICONS: Record<KpiIconKey, LucideIcon> = {
  package:       Package,
  'check-circle': CheckCircle,
  transfer:      ArrowLeftRight,
  inspection:    ClipboardCheck,
}

export const PENDING_ACTION_ICONS: Record<PendingActionType, LucideIcon> = {
  transfer:   ArrowLeftRight,
  inspection: ClipboardCheck,
  disposal:   Trash2,
  survey:     ClipboardList,
}

export const QUICK_LINK_ICONS: Record<QuickLinkIconKey, LucideIcon> = {
  package:    Package,
  folder:     Folder,
  'map-pin':  MapPin,
  'bar-chart': BarChart3,
  users:      Users,
  inspection: ClipboardCheck,
}
