import type {
  TrendPeriod,
  TrendDataSets,
  CategoryDistributionItem,
  StatusBreakdownItem,
  LocationDistributionItem,
  ConditionBreakdownItem,
  PendingAction,
  RecentActivityItem,
  InspectionProgressItem,
  ComplianceMetric,
  SystemStatusItem,
  QuickLink,
  KpiCardItem,
} from '../types'

/** Chart/series colors — CSS var tokens from globals.css @theme */
export const CHART_COLORS = {
  blue: 'var(--color-chart-blue)',
  green: 'var(--color-chart-green)',
  yellow: 'var(--color-chart-yellow)',
  red: 'var(--color-chart-red)',
  purple: 'var(--color-chart-purple)',
  orange: 'var(--color-chart-orange)',
  teal: 'var(--color-chart-teal)',
  pink: 'var(--color-chart-pink)',
  brandTeal: 'var(--color-brand-teal)',
  brandPrimary: 'var(--color-chart-3)',
  statusActive: 'var(--color-status-active)',
  statusPending: 'var(--color-status-pending)',
  statusDisposed: 'var(--color-status-disposed)',
  statusInactive: 'var(--color-status-inactive)',
  statusDraft: 'var(--color-status-draft)',
} as const

export const TOTAL_ASSETS = 2847

export const KPI_CARDS: KpiCardItem[] = [
  {
    label: 'Total Assets',
    value: '2,847',
    change: '+12%',
    up: true,
    iconKey: 'package',
    href: '/assets',
  },
  {
    label: 'Active Assets',
    value: '2,654',
    change: '+5.2%',
    up: true,
    iconKey: 'check-circle',
    href: '/assets',
  },
  {
    label: 'Pending Transfers',
    value: '14',
    change: '+3',
    up: true,
    iconKey: 'transfer',
    href: '/assets',
  },
  {
    label: 'Active Inspections',
    value: '3',
    change: '2 in progress',
    up: false,
    iconKey: 'inspection',
    href: '/assets',
  },
]
export const ASSET_TREND_DATA = [
  { month: "Sep", total: 2210, acquired: 85, disposed: 18 },
  { month: "Oct", total: 2340, acquired: 152, disposed: 22 },
  { month: "Nov", total: 2455, acquired: 138, disposed: 23 },
  { month: "Dec", total: 2520, acquired: 92, disposed: 27 },
  { month: "Jan", total: 2680, acquired: 187, disposed: 29 },
  { month: "Feb", total: 2847, acquired: 198, disposed: 31 },
];



export const TREND_DATA_SETS: TrendDataSets = {
  weekly: {
    label: "Weekly",
    data: [
      [
        { month: "W5", total: 2610, acquired: 28, disposed: 5 },
        { month: "W6", total: 2638, acquired: 35, disposed: 7 },
        { month: "W7", total: 2672, acquired: 42, disposed: 8 },
        { month: "W8", total: 2720, acquired: 56, disposed: 8 },
        { month: "W9", total: 2776, acquired: 38, disposed: 4 },
        {
          month: "W10",
          total: 2847,
          acquired: 47,
          disposed: 6,
        },
      ],
      [
        {
          month: "W48",
          total: 2420,
          acquired: 22,
          disposed: 4,
        },
        {
          month: "W49",
          total: 2445,
          acquired: 30,
          disposed: 5,
        },
        {
          month: "W50",
          total: 2478,
          acquired: 38,
          disposed: 5,
        },
        {
          month: "W51",
          total: 2500,
          acquired: 27,
          disposed: 5,
        },
        {
          month: "W52",
          total: 2525,
          acquired: 32,
          disposed: 7,
        },
        { month: "W1", total: 2560, acquired: 41, disposed: 6 },
      ],
      [
        {
          month: "W42",
          total: 2280,
          acquired: 18,
          disposed: 3,
        },
        {
          month: "W43",
          total: 2305,
          acquired: 30,
          disposed: 5,
        },
        {
          month: "W44",
          total: 2338,
          acquired: 38,
          disposed: 5,
        },
        {
          month: "W45",
          total: 2365,
          acquired: 32,
          disposed: 5,
        },
        {
          month: "W46",
          total: 2390,
          acquired: 28,
          disposed: 3,
        },
        {
          month: "W47",
          total: 2415,
          acquired: 27,
          disposed: 2,
        },
      ],
    ],
  },
  monthly: {
    label: "Monthly",
    data: [
      ASSET_TREND_DATA,
      [
        {
          month: "Mar",
          total: 1850,
          acquired: 65,
          disposed: 12,
        },
        {
          month: "Apr",
          total: 1920,
          acquired: 82,
          disposed: 12,
        },
        {
          month: "May",
          total: 2000,
          acquired: 95,
          disposed: 15,
        },
        {
          month: "Jun",
          total: 2065,
          acquired: 78,
          disposed: 13,
        },
        {
          month: "Jul",
          total: 2130,
          acquired: 82,
          disposed: 17,
        },
        {
          month: "Aug",
          total: 2210,
          acquired: 98,
          disposed: 18,
        },
      ],
      [
        {
          month: "Sep",
          total: 1520,
          acquired: 45,
          disposed: 8,
        },
        {
          month: "Oct",
          total: 1580,
          acquired: 72,
          disposed: 12,
        },
        {
          month: "Nov",
          total: 1645,
          acquired: 78,
          disposed: 13,
        },
        {
          month: "Dec",
          total: 1710,
          acquired: 76,
          disposed: 11,
        },
        {
          month: "Jan",
          total: 1775,
          acquired: 74,
          disposed: 9,
        },
        {
          month: "Feb",
          total: 1850,
          acquired: 85,
          disposed: 10,
        },
      ],
    ],
  },
  quarterly: {
    label: "Quarterly",
    data: [
      [
        {
          month: "Q1 2025",
          total: 1850,
          acquired: 210,
          disposed: 35,
        },
        {
          month: "Q2 2025",
          total: 2065,
          acquired: 255,
          disposed: 40,
        },
        {
          month: "Q3 2025",
          total: 2340,
          acquired: 320,
          disposed: 45,
        },
        {
          month: "Q4 2025",
          total: 2520,
          acquired: 228,
          disposed: 48,
        },
      ],
      [
        {
          month: "Q1 2024",
          total: 1320,
          acquired: 145,
          disposed: 22,
        },
        {
          month: "Q2 2024",
          total: 1480,
          acquired: 185,
          disposed: 25,
        },
        {
          month: "Q3 2024",
          total: 1640,
          acquired: 192,
          disposed: 32,
        },
        {
          month: "Q4 2024",
          total: 1780,
          acquired: 175,
          disposed: 35,
        },
      ],
      [
        {
          month: "Q1 2023",
          total: 920,
          acquired: 95,
          disposed: 12,
        },
        {
          month: "Q2 2023",
          total: 1020,
          acquired: 115,
          disposed: 15,
        },
        {
          month: "Q3 2023",
          total: 1130,
          acquired: 128,
          disposed: 18,
        },
        {
          month: "Q4 2023",
          total: 1240,
          acquired: 130,
          disposed: 20,
        },
      ],
    ],
  },
  yearly: {
    label: "Yearly",
    data: [
      [
        {
          month: "2021",
          total: 680,
          acquired: 320,
          disposed: 45,
        },
        {
          month: "2022",
          total: 920,
          acquired: 310,
          disposed: 70,
        },
        {
          month: "2023",
          total: 1240,
          acquired: 420,
          disposed: 100,
        },
        {
          month: "2024",
          total: 1780,
          acquired: 660,
          disposed: 120,
        },
        {
          month: "2025",
          total: 2520,
          acquired: 890,
          disposed: 150,
        },
        {
          month: "2026*",
          total: 2847,
          acquired: 398,
          disposed: 71,
        },
      ],
      [
        {
          month: "2015",
          total: 120,
          acquired: 120,
          disposed: 0,
        },
        {
          month: "2016",
          total: 210,
          acquired: 100,
          disposed: 10,
        },
        {
          month: "2017",
          total: 310,
          acquired: 115,
          disposed: 15,
        },
        {
          month: "2018",
          total: 420,
          acquired: 130,
          disposed: 20,
        },
        {
          month: "2019",
          total: 520,
          acquired: 125,
          disposed: 25,
        },
        {
          month: "2020",
          total: 630,
          acquired: 140,
          disposed: 30,
        },
      ],
    ],
  },
};

export function getTrendPeriodLabel(
  period: TrendPeriod,
  offset: number,
): string {
  const labels: Record<TrendPeriod, string[]> = {
    weekly: [
      "Feb 24 - Mar 5, 2026",
      "Dec 1 - Jan 5, 2026",
      "Oct 13 - Nov 17, 2025",
    ],
    monthly: [
      "Last 6 Months",
      "Mar - Aug 2025",
      "Sep 2024 - Feb 2025",
    ],
    quarterly: [
      "Q1 2025 - Q4 2025",
      "Q1 2024 - Q4 2024",
      "Q1 2023 - Q4 2023",
    ],
    yearly: ["2021 - 2026", "2015 - 2020"],
  };
  return labels[period][offset] || labels[period][0]
}

export const CATEGORY_DISTRIBUTION: CategoryDistributionItem[] = [
  { name: "IT Equipment", value: 892, color: CHART_COLORS.blue },
  { name: "Furniture", value: 634, color: CHART_COLORS.brandTeal },
  { name: "Vehicles", value: 187, color: CHART_COLORS.brandPrimary },
  { name: "Networking", value: 412, color: CHART_COLORS.purple },
  { name: "Office Equip.", value: 356, color: CHART_COLORS.green },
  { name: "Other", value: 366, color: CHART_COLORS.statusInactive },
];

export const STATUS_BREAKDOWN: StatusBreakdownItem[] = [
  { status: "Active", count: 2654, color: CHART_COLORS.statusActive },
  { status: "In Transit", count: 47, color: CHART_COLORS.purple },
  { status: "Maintenance", count: 68, color: CHART_COLORS.statusPending },
  { status: "Missing", count: 12, color: CHART_COLORS.statusDisposed },
  { status: "Disposed", count: 31, color: CHART_COLORS.statusInactive },
  { status: "Inactive", count: 35, color: CHART_COLORS.statusDraft },
];

export const LOCATION_DATA: LocationDistributionItem[] = [
  { name: "Amman Office", assets: 842, pct: 30 },
  { name: "Bangkok Office", assets: 625, pct: 22 },
  { name: "Melbourne Office", assets: 518, pct: 18 },
  { name: "Phnom Penh Office", assets: 412, pct: 14 },
  { name: "Afghanistan Office", assets: 284, pct: 10 },
  { name: "Other Locations", assets: 166, pct: 6 },
];

export const CONDITION_DATA: ConditionBreakdownItem[] = [
  { condition: "New", count: 487 },
  { condition: "Good", count: 1534 },
  { condition: "Fair", count: 612 },
  { condition: "Poor", count: 148 },
  { condition: "Damaged", count: 66 },
];

export const PENDING_ACTIONS: PendingAction[] = [
  {
    id: "1",
    type: "transfer",
    title: "Transfer TR-2026-045",
    desc: "12 IT assets -> Bangkok Office",
    assignee: "Admin Manager",
    urgency: "high",
    due: "2026-03-03"
  },
  {
    id: "2",
    type: "inspection",
    title: "Inspection INSP-2026-001",
    desc: "Q1 Server Room - 6 assets remaining",
    assignee: "John Doe",
    urgency: "high",
    due: "2026-03-05"
  },
  {
    id: "3",
    type: "disposal",
    title: "Disposal DIS-2026-008",
    desc: "3 damaged desktops pending write-off",
    assignee: "Finance Officer",
    urgency: "medium",
    due: "2026-03-07"
  },
  {
    id: "4",
    type: "survey",
    title: "Survey SVY-2026-003",
    desc: "Annual vehicle fleet survey",
    assignee: "Fleet Manager",
    urgency: "medium",
    due: "2026-03-10"
  },
  {
    id: "5",
    type: "transfer",
    title: "Transfer TR-2026-048",
    desc: "5 monitors -> Melbourne Office",
    assignee: "Regional Lead",
    urgency: "low",
    due: "2026-03-12"
  },
];

export const RECENT_ACTIVITY: RecentActivityItem[] = [
  {
    id: "1",
    action: "Asset SRV-001238 marked as Verified",
    user: "John Doe",
    module: "Inspections",
    time: "12 min ago",
    status: "success",
    avatar: "JD",
  },
  {
    id: "2",
    action: "Transfer TR-2026-045 submitted for approval",
    user: "Jane Smith",
    module: "Transfers",
    time: "34 min ago",
    status: "pending",
    avatar: "JS",
  },
  {
    id: "3",
    action: 'New category "Medical Equipment" created',
    user: "Admin User",
    module: "Categories",
    time: "1 hr ago",
    status: "info",
    avatar: "AU",
  },
  {
    id: "4",
    action: "SAP sync completed - 234 records updated",
    user: "System",
    module: "Integrations",
    time: "2 hrs ago",
    status: "success",
    avatar: "SY",
  },
  {
    id: "5",
    action: 'Role "Regional Auditor" permissions updated',
    user: "Admin User",
    module: "Users & Roles",
    time: "3 hrs ago",
    status: "info",
    avatar: "AU",
  },
  {
    id: "6",
    action: "Disposal DIS-2026-007 approved and completed",
    user: "Finance Officer",
    module: "Disposals",
    time: "4 hrs ago",
    status: "success",
    avatar: "FO",
  },
  {
    id: "7",
    action: "Asset NET-001243 marked as Missing",
    user: "John Doe",
    module: "Inspections",
    time: "5 hrs ago",
    status: "warning",
    avatar: "JD",
  },
  {
    id: "8",
    action: "Offline inspection data synced from PDA-RF88-007",
    user: "Emily Davis",
    module: "PDA",
    time: "6 hrs ago",
    status: "info",
    avatar: "ED",
  },
];

export const INSPECTION_PROGRESS: InspectionProgressItem[] = [
  {
    id: "1",
    title: "Q1 Server Room Full Inspection",
    inspector: "John Doe",
    office: "Amman",
    progress: 75,
    total: 24,
    verified: 14,
    issues: 4,
    status: "in-progress" as const,
  },
  {
    id: "2",
    title: "Regional Equipment Verification",
    inspector: "Mike Torres",
    office: "Melbourne",
    progress: 0,
    total: 36,
    verified: 0,
    issues: 0,
    status: "assigned" as const,
  },
  {
    id: "3",
    title: "Post-Flood Damage Assessment",
    inspector: "Emily Davis",
    office: "Afghanistan",
    progress: 100,
    total: 18,
    verified: 8,
    issues: 10,
    status: "completed" as const,
  },
];

export const COMPLIANCE_METRICS: ComplianceMetric[] = [
  {
    label: "Assets with Valid Tags",
    value: 97.2,
    target: 99,
    status: "warning" as const,
  },
  {
    label: "Inventory Match Rate",
    value: 98.5,
    target: 98,
    status: "good" as const,
  },
  {
    label: "Inspections On Schedule",
    value: 83,
    target: 90,
    status: "warning" as const,
  },
  {
    label: "Lifecycle Records Complete",
    value: 94.1,
    target: 95,
    status: "warning" as const,
  },
];

export const SYSTEM_STATUSES: SystemStatusItem[] = [
  { label: "RFID Gateway", status: "Online" },
  { label: "SAP Integration", status: "Connected" },
  { label: "PDA Sync Service", status: "Online" },
  { label: "Backup Service", status: "Scheduled" },
];

export const QUICK_LINKS: QuickLink[] = [
  { label: 'Assets', iconKey: 'package', href: '/assets' },
  { label: 'Categories', iconKey: 'folder', href: '/assets/categories' },
  { label: 'Locations', iconKey: 'map-pin', href: '/locations' },
  { label: 'Reports', iconKey: 'bar-chart', href: '/reporting' },
  { label: 'User Management', iconKey: 'users', href: '/users' },
  { label: 'Inspections', iconKey: 'inspection', href: '/assets' },
]
