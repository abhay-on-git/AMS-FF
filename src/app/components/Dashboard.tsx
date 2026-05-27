import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { formatDate } from "../utils/dateFormatter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Inventory2 as PackageIcon,
  ReportProblem as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ClockIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapHoriz as TransferIcon,
  FactCheck as InspectionIcon,
  LocationOn as MapPinIcon,
  People as UsersIcon,
  Folder as FolderIcon,
  BarChart as BarChartIcon,
  ArrowForward as ArrowRightIcon,
  Add as PlusIcon,
  CloudDone as CloudIcon,
  Security as ShieldIcon,
  Delete as DisposalIcon,
  Assignment as SurveyIcon,
  Speed as SpeedIcon,
  HourglassEmpty as HourglassIcon,
  Refresh as RefreshIcon,
  OpenInNew as OpenInNewIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ══════════════════════════════════════════════════════════════════
// ── Static Data
// ══════════════════════════════════════════════════════════════════

const assetTrendData = [
  { month: "Sep", total: 2210, acquired: 85, disposed: 18 },
  { month: "Oct", total: 2340, acquired: 152, disposed: 22 },
  { month: "Nov", total: 2455, acquired: 138, disposed: 23 },
  { month: "Dec", total: 2520, acquired: 92, disposed: 27 },
  { month: "Jan", total: 2680, acquired: 187, disposed: 29 },
  { month: "Feb", total: 2847, acquired: 198, disposed: 31 },
];

type TrendPeriod =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly";

const trendDataSets: Record<
  TrendPeriod,
  {
    label: string;
    data: {
      month: string;
      total: number;
      acquired: number;
      disposed: number;
    }[][];
  }
> = {
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
      assetTrendData,
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

const getTrendPeriodLabel = (
  period: TrendPeriod,
  offset: number,
): string => {
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
  return labels[period][offset] || labels[period][0];
};

const categoryDistribution = [
  { name: "IT Equipment", value: 892, color: "#4F83E3" },
  { name: "Furniture", value: 634, color: "#81CCD7" },
  { name: "Vehicles", value: 187, color: "#EF652B" },
  { name: "Networking", value: 412, color: "#A78BFA" },
  { name: "Office Equip.", value: 356, color: "#34D399" },
  { name: "Other", value: 366, color: "#94A3B8" },
];

const statusBreakdown = [
  { status: "Active", count: 2654, color: "#22C55E" },
  { status: "In Transit", count: 47, color: "#A78BFA" },
  { status: "Maintenance", count: 68, color: "#F59E0B" },
  { status: "Missing", count: 12, color: "#EF4444" },
  { status: "Disposed", count: 31, color: "#94A3B8" },
  { status: "Inactive", count: 35, color: "#CBD5E1" },
];

const locationData = [
  { name: "Amman Office", assets: 842, pct: 30 },
  { name: "Bangkok Office", assets: 625, pct: 22 },
  { name: "Melbourne Office", assets: 518, pct: 18 },
  { name: "Phnom Penh Office", assets: 412, pct: 14 },
  { name: "Afghanistan Office", assets: 284, pct: 10 },
  { name: "Other Locations", assets: 166, pct: 6 },
];

const conditionData = [
  { condition: "New", count: 487 },
  { condition: "Good", count: 1534 },
  { condition: "Fair", count: 612 },
  { condition: "Poor", count: 148 },
  { condition: "Damaged", count: 66 },
];

const pendingActions = [
  {
    id: "1",
    type: "transfer",
    title: "Transfer TR-2026-045",
    desc: "12 IT assets -> Bangkok Office",
    assignee: "Admin Manager",
    urgency: "high",
    due: "2026-03-03",
    icon: TransferIcon,
  },
  {
    id: "2",
    type: "inspection",
    title: "Inspection INSP-2026-001",
    desc: "Q1 Server Room - 6 assets remaining",
    assignee: "John Doe",
    urgency: "high",
    due: "2026-03-05",
    icon: InspectionIcon,
  },
  {
    id: "3",
    type: "disposal",
    title: "Disposal DIS-2026-008",
    desc: "3 damaged desktops pending write-off",
    assignee: "Finance Officer",
    urgency: "medium",
    due: "2026-03-07",
    icon: DisposalIcon,
  },
  {
    id: "4",
    type: "survey",
    title: "Survey SVY-2026-003",
    desc: "Annual vehicle fleet survey",
    assignee: "Fleet Manager",
    urgency: "medium",
    due: "2026-03-10",
    icon: SurveyIcon,
  },
  {
    id: "5",
    type: "transfer",
    title: "Transfer TR-2026-048",
    desc: "5 monitors -> Melbourne Office",
    assignee: "Regional Lead",
    urgency: "low",
    due: "2026-03-12",
    icon: TransferIcon,
  },
];

const recentActivity = [
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

const inspectionProgress = [
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

const complianceMetrics = [
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

const systemStatuses = [
  { label: "RFID Gateway", status: "Online" },
  { label: "SAP Integration", status: "Connected" },
  { label: "PDA Sync Service", status: "Online" },
  { label: "Backup Service", status: "Scheduled" },
];

const quickLinks = [
  { label: "Assets", icon: PackageIcon, href: "#assets" },
  {
    label: "Categories",
    icon: FolderIcon,
    href: "#categories",
  },
  { label: "Locations", icon: MapPinIcon, href: "#locations" },
  { label: "Reports", icon: BarChartIcon, href: "#reporting" },
  { label: "User Management", icon: UsersIcon, href: "#users" },
  {
    label: "Inspections",
    icon: InspectionIcon,
    href: "#rfid-settings",
  },
];

// ── Custom Pie Chart Label ────────────────────────────────────────
const renderCustomPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius =
    innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ══════════════════════════════════════════════════════════════════
// ── Component
// ══════════════════════════════════════════════════════════════════

export default function Dashboard() {
  const { t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const [trendPeriod, setTrendPeriod] =
    useState<TrendPeriod>("monthly");
  const [trendOffset, setTrendOffset] = useState(0);
  const [activePieIndex, setActivePieIndex] = useState<
    number | null
  >(null);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const getUrgencyColor = (u: string) => {
    switch (u) {
      case "high":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      case "medium":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "low":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300";
    }
  };

  const getActivityColor = (s: string) => {
    switch (s) {
      case "success":
        return "bg-green-500";
      case "pending":
        return "bg-amber-500";
      case "warning":
        return "bg-red-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const getComplianceColor = (s: "good" | "warning") =>
    s === "good"
      ? "text-green-700 dark:text-green-400"
      : "text-amber-700 dark:text-amber-400";

  const totalAssets = 2847;
  const totalCategoryAssets = categoryDistribution.reduce(
    (sum, c) => sum + c.value,
    0,
  );
  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="space-y-6">
      {/* ═══════════════════════ Primary KPIs ═══════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Assets",
            value: "2,847",
            change: "+12%",
            up: true,
            icon: PackageIcon,
            href: "#assets",
          },
          {
            label: "Active Assets",
            value: "2,654",
            change: "+5.2%",
            up: true,
            icon: CheckCircleIcon,
            href: "#assets",
          },
          {
            label: "Pending Transfers",
            value: "14",
            change: "+3",
            up: true,
            icon: TransferIcon,
            href: "#assets",
          },
          {
            label: "Active Inspections",
            value: "3",
            change: "2 in progress",
            up: false,
            icon: InspectionIcon,
            href: "#rfid-settings",
          },
        ].map((kpi) => (
          <Card
            key={kpi.label}
            className="transition-shadow cursor-pointer group"
            onClick={() =>
              (window.location.hash = kpi.href.substring(1))
            }
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F7F7F8]">
                  <kpi.icon className="w-5 h-5 text-[#121321]" />
                </div>
                <ArrowRightIcon className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-md text-muted-foreground mt-0.5">
                {kpi.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ═══════════════════════ Pending Approvals & Actions ═══════════════════════ */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <HourglassIcon className="w-5 h-5 text-[#EF652B]" />
              Pending Approvals & Actions
            </CardTitle>
            <Badge className="bg-[#EF652B]/10 text-[#EF652B] border-[#EF652B]/20 text-md">
              {pendingActions.length} pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingActions.map((action) => (
              <div
                key={action.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer group"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    action.type === "transfer"
                      ? "bg-purple-100 dark:bg-purple-900/30"
                      : action.type === "inspection"
                        ? "bg-amber-100 dark:bg-amber-900/30"
                        : action.type === "disposal"
                          ? "bg-red-100 dark:bg-red-900/30"
                          : "bg-blue-100 dark:bg-blue-900/30"
                  }`}
                >
                  <action.icon
                    className={`w-4.5 h-4.5 ${
                      action.type === "transfer"
                        ? "text-purple-600"
                        : action.type === "inspection"
                          ? "text-amber-600"
                          : action.type === "disposal"
                            ? "text-red-600"
                            : "text-blue-600"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-medium truncate">
                      {action.title}
                    </p>
                  </div>
                  <p className="text-md text-muted-foreground truncate">
                    {action.desc}
                  </p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-md text-muted-foreground">
                    {action.assignee}
                  </p>
                  <p className="text-md text-muted-foreground">
                    Due Date :{" "}
                    {new Date(action.due).toLocaleDateString(
                      "en-US",
                      {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════ Asset Health + Category ═══════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Assets By Category (LEFT) ─────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[15px]">
              <FolderIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
              Assets By Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Pie */}
              <div className="w-full sm:w-[200px] shrink-0 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={88}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomPieLabel}
                      onMouseEnter={(_, index) =>
                        setActivePieIndex(index)
                      }
                      onMouseLeave={() =>
                        setActivePieIndex(null)
                      }
                    >
                      {categoryDistribution.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-cat-${index}`}
                            fill={entry.color}
                            opacity={
                              activePieIndex === null ||
                              activePieIndex === index
                                ? 1
                                : 0.4
                            }
                            stroke="transparent"
                          />
                        ),
                      )}
                    </Pie>
                    <RechartsTooltip
                      formatter={(
                        value: number,
                        name: string,
                      ) => [`${value} assets`, name]}
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex-1 w-full space-y-1.5">
                {categoryDistribution.map((cat, index) => (
                  <div
                    key={cat.name}
                    className={`flex items-center gap-2.5 rounded-md px-2 py-1 transition-colors cursor-default ${
                      activePieIndex === index
                        ? "bg-muted/60"
                        : "hover:bg-muted/30"
                    }`}
                    onMouseEnter={() =>
                      setActivePieIndex(index)
                    }
                    onMouseLeave={() => setActivePieIndex(null)}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-[13px] flex-1 truncate">
                      {cat.name}
                    </span>
                    <span className="text-[13px] font-medium tabular-nums">
                      {cat.value.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-muted-foreground w-10 text-right tabular-nums">
                      {(
                        (cat.value / totalCategoryAssets) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Asset Health Overview (RIGHT) ─────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[15px]">
              <SpeedIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
              Asset Health Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* ── By Status ────────────────────────────────────────── */}
            <div>
              <p className="text-md text-muted-foreground mb-2.5">
                By Status
              </p>
              <div className="space-y-2">
                {statusBreakdown.map((s) => (
                  <div
                    key={s.status}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-[15px] flex-1">
                      {s.status}
                    </span>
                    <span className="text-[15px] font-medium w-12 text-right">
                      {s.count}
                    </span>
                    <div className="w-20">
                      <Progress
                        value={(s.count / totalAssets) * 100}
                        className="h-1.5"
                      />
                    </div>
                    <span className="text-md text-muted-foreground w-10 text-right">
                      {((s.count / totalAssets) * 100).toFixed(
                        1,
                      )}
                      %
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
