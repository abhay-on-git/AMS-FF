import { KPI_CARDS } from '../constants'
import { KpiCard } from './KpiCard'
import { AssetTrendChart } from './AssetTrendChart'
import { PendingActionsCard } from './PendingActionsCard'
import { CategoryPieChart } from './CategoryPieChart'
import { AssetHealthCard } from './AssetHealthCard'
import { RecentActivityCard } from './RecentActivityCard'
import { InspectionProgressCard } from './InspectionProgressCard'
import { ComplianceCard } from './ComplianceCard'
import { SystemStatusCard } from './SystemStatusCard'

export function DashboardView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <AssetTrendChart />

      <PendingActionsCard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart />
        <AssetHealthCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard />
        <InspectionProgressCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceCard />
        <SystemStatusCard />
      </div>
    </div>
  )
}
