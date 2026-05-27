import React, { useState, useMemo } from "react";
import { formatDate } from "../utils/dateFormatter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
// Tabs removed — using custom tab buttons matching Assets module pattern
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox as MuiCheckbox } from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { DeleteConfirmDialog } from "./shared/DeleteConfirmDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart as BarChart3,
  Description as FileText,
  Download,
  FilterList as Filter,
  Event as Calendar,
  TrendingUp,
  Inventory2 as Package,
  LocationOn as MapPin,
  People as Users,
  Warning as AlertCircle,
  GridOn as FileSpreadsheet,
  FileDownload as FileDown,
  Search,
  Add as Plus,
  Save,
  PlayArrow as Play,
  Close as X,
  ChevronRight,
  ChevronLeft,
  Settings,
  Lock,
  Schedule as Clock,
  Share,
  ContentCopy,
  Email,
  SortByAlpha,
  ViewColumn,
  Delete as DeleteIcon,
  Edit,
  Pause,
  CheckCircle,
  ArrowUpward,
  ArrowDownward,
  Visibility,
  VisibilityOff,
  Assignment,
  Gavel,
  Business,
} from "@mui/icons-material";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PredefinedReport {
  id: string;
  name: string;
  description: string;
  category:
    | "Asset Register"
    | "Lifecycle"
    | "Disposal"
    | "Transfer";
  icon: React.ReactNode;
  accessLevel: "all" | "manager" | "admin";
}

interface CustomFilter {
  field: string;
  operator: string;
  value: string;
}

interface SavedQuery {
  id: string;
  name: string;
  description: string;
  filters: CustomFilter[];
  selectedFields: string[];
  groupBy?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  createdBy: string;
  createdAt: string;
}

interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  recipients: string[];
  format: "excel" | "pdf" | "csv";
  nextRun: string;
  lastRun?: string;
  enabled: boolean;
  createdBy: string;
}

interface PendingAction {
  id: string;
  type:
    | "inspection"
    | "disposal"
    | "transfer"
    | "tagging"
    | "verification";
  description: string;
  assetCount: number;
  dueDate: string;
  assignedTo: string;
  fieldOffice: string;
}

type ViewMode =
  | "dashboard"
  | "predefined"
  | "custom"
  | "scheduled";

const CURRENT_USER_ROLE = "admin";
const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

const FIELD_OFFICES = [
  "All Offices",
  "Las Vegas",
  "Boulder",
  "Mountain View",
  "Austin",
  "Philadelphia",
];

const OFFICE_DATA: Record<
  string,
  {
    totalAssets: number;
    totalValue: string;
    pendingCount: number;
    assetValueByLocation: {
      name: string;
      value: number;
      count: number;
    }[];
    lifecycleBreakdown: {
      name: string;
      value: number;
      percentage: number;
    }[];
    monthlyTrends: {
      month: string;
      acquisitions: number;
      disposals: number;
      transfers: number;
    }[];
    surveyCaseVolume: {
      month: string;
      opened: number;
      completed: number;
      inProgress: number;
    }[];
    disposalTrends: {
      month: string;
      auction: number;
      donation: number;
      recycling: number;
      writeOff: number;
    }[];
    complianceGaps: { type: string; count: number }[];
  }
> = {
  "All Offices": {
    totalAssets: 1006,
    totalValue: "$1.95M",
    pendingCount: 45,
    assetValueByLocation: [
      { name: "HQ Floor 1", value: 450000, count: 234 },
      { name: "HQ Floor 2", value: 380000, count: 198 },
      { name: "HQ Floor 3", value: 520000, count: 267 },
      { name: "Branch Office A", value: 290000, count: 145 },
      { name: "Branch Office B", value: 310000, count: 162 },
    ],
    lifecycleBreakdown: [
      { name: "Registered", value: 45, percentage: 4.5 },
      { name: "In Use", value: 756, percentage: 75.6 },
      { name: "Available", value: 52, percentage: 5.2 },
      {
        name: "Under Verification",
        value: 28,
        percentage: 2.8,
      },
      { name: "Transferred", value: 34, percentage: 3.4 },
      { name: "Damaged", value: 15, percentage: 1.5 },
      { name: "Retired", value: 50, percentage: 5.0 },
      { name: "Disposed", value: 20, percentage: 2.0 },
    ],
    monthlyTrends: [
      {
        month: "Jan",
        acquisitions: 45,
        disposals: 12,
        transfers: 34,
      },
      {
        month: "Feb",
        acquisitions: 52,
        disposals: 8,
        transfers: 41,
      },
      {
        month: "Mar",
        acquisitions: 38,
        disposals: 15,
        transfers: 38,
      },
      {
        month: "Apr",
        acquisitions: 61,
        disposals: 10,
        transfers: 52,
      },
      {
        month: "May",
        acquisitions: 55,
        disposals: 18,
        transfers: 45,
      },
      {
        month: "Jun",
        acquisitions: 48,
        disposals: 14,
        transfers: 39,
      },
    ],
    surveyCaseVolume: [
      { month: "Jan", opened: 8, completed: 6, inProgress: 2 },
      {
        month: "Feb",
        opened: 12,
        completed: 10,
        inProgress: 4,
      },
      { month: "Mar", opened: 6, completed: 8, inProgress: 2 },
      {
        month: "Apr",
        opened: 15,
        completed: 11,
        inProgress: 6,
      },
      { month: "May", opened: 9, completed: 12, inProgress: 3 },
      { month: "Jun", opened: 11, completed: 7, inProgress: 7 },
    ],
    disposalTrends: [
      {
        month: "Jan",
        auction: 3,
        donation: 2,
        recycling: 4,
        writeOff: 3,
      },
      {
        month: "Feb",
        auction: 1,
        donation: 1,
        recycling: 3,
        writeOff: 3,
      },
      {
        month: "Mar",
        auction: 4,
        donation: 3,
        recycling: 5,
        writeOff: 3,
      },
      {
        month: "Apr",
        auction: 2,
        donation: 1,
        recycling: 2,
        writeOff: 5,
      },
      {
        month: "May",
        auction: 5,
        donation: 4,
        recycling: 3,
        writeOff: 6,
      },
      {
        month: "Jun",
        auction: 3,
        donation: 2,
        recycling: 4,
        writeOff: 5,
      },
    ],
    complianceGaps: [
      { type: "Missing Serial Numbers", count: 23 },
      { type: "Untagged Assets", count: 12 },
      { type: "Overdue Inspection", count: 45 },
      { type: "Missing Custodian", count: 8 },
      { type: "Incomplete Documentation", count: 34 },
    ],
  },
  "Las Vegas": {
    totalAssets: 218,
    totalValue: "$420K",
    pendingCount: 9,
    assetValueByLocation: [
      { name: "LV Floor 1", value: 180000, count: 95 },
      { name: "LV Floor 2", value: 140000, count: 78 },
      { name: "LV Warehouse", value: 100000, count: 45 },
    ],
    lifecycleBreakdown: [
      { name: "Registered", value: 10, percentage: 4.6 },
      { name: "In Use", value: 162, percentage: 74.3 },
      { name: "Available", value: 14, percentage: 6.4 },
      { name: "Under Verification", value: 6, percentage: 2.8 },
      { name: "Transferred", value: 8, percentage: 3.7 },
      { name: "Damaged", value: 4, percentage: 1.8 },
      { name: "Retired", value: 10, percentage: 4.6 },
      { name: "Disposed", value: 4, percentage: 1.8 },
    ],
    monthlyTrends: [
      {
        month: "Jan",
        acquisitions: 10,
        disposals: 2,
        transfers: 7,
      },
      {
        month: "Feb",
        acquisitions: 12,
        disposals: 1,
        transfers: 9,
      },
      {
        month: "Mar",
        acquisitions: 8,
        disposals: 3,
        transfers: 8,
      },
      {
        month: "Apr",
        acquisitions: 14,
        disposals: 2,
        transfers: 11,
      },
      {
        month: "May",
        acquisitions: 11,
        disposals: 4,
        transfers: 9,
      },
      {
        month: "Jun",
        acquisitions: 9,
        disposals: 3,
        transfers: 7,
      },
    ],
    surveyCaseVolume: [
      { month: "Jan", opened: 2, completed: 1, inProgress: 1 },
      { month: "Feb", opened: 3, completed: 2, inProgress: 1 },
      { month: "Mar", opened: 1, completed: 2, inProgress: 0 },
      { month: "Apr", opened: 4, completed: 3, inProgress: 1 },
      { month: "May", opened: 2, completed: 3, inProgress: 1 },
      { month: "Jun", opened: 3, completed: 1, inProgress: 2 },
    ],
    disposalTrends: [
      {
        month: "Jan",
        auction: 1,
        donation: 0,
        recycling: 1,
        writeOff: 0,
      },
      {
        month: "Feb",
        auction: 0,
        donation: 0,
        recycling: 1,
        writeOff: 0,
      },
      {
        month: "Mar",
        auction: 1,
        donation: 1,
        recycling: 1,
        writeOff: 0,
      },
      {
        month: "Apr",
        auction: 0,
        donation: 0,
        recycling: 1,
        writeOff: 1,
      },
      {
        month: "May",
        auction: 1,
        donation: 1,
        recycling: 1,
        writeOff: 1,
      },
      {
        month: "Jun",
        auction: 1,
        donation: 0,
        recycling: 1,
        writeOff: 1,
      },
    ],
    complianceGaps: [
      { type: "Missing Serial Numbers", count: 5 },
      { type: "Untagged Assets", count: 3 },
      { type: "Overdue Inspection", count: 9 },
      { type: "Missing Custodian", count: 2 },
      { type: "Incomplete Documentation", count: 7 },
    ],
  },
  Boulder: {
    totalAssets: 187,
    totalValue: "$360K",
    pendingCount: 7,
    assetValueByLocation: [
      { name: "Boulder Main", value: 210000, count: 110 },
      { name: "Boulder Annex", value: 150000, count: 77 },
    ],
    lifecycleBreakdown: [
      { name: "Registered", value: 8, percentage: 4.3 },
      { name: "In Use", value: 143, percentage: 76.5 },
      { name: "Available", value: 10, percentage: 5.3 },
      { name: "Under Verification", value: 5, percentage: 2.7 },
      { name: "Transferred", value: 7, percentage: 3.7 },
      { name: "Damaged", value: 3, percentage: 1.6 },
      { name: "Retired", value: 9, percentage: 4.8 },
      { name: "Disposed", value: 2, percentage: 1.1 },
    ],
    monthlyTrends: [
      {
        month: "Jan",
        acquisitions: 8,
        disposals: 2,
        transfers: 6,
      },
      {
        month: "Feb",
        acquisitions: 10,
        disposals: 1,
        transfers: 8,
      },
      {
        month: "Mar",
        acquisitions: 7,
        disposals: 3,
        transfers: 7,
      },
      {
        month: "Apr",
        acquisitions: 12,
        disposals: 2,
        transfers: 10,
      },
      {
        month: "May",
        acquisitions: 9,
        disposals: 4,
        transfers: 8,
      },
      {
        month: "Jun",
        acquisitions: 8,
        disposals: 2,
        transfers: 6,
      },
    ],
    surveyCaseVolume: [
      { month: "Jan", opened: 1, completed: 1, inProgress: 0 },
      { month: "Feb", opened: 2, completed: 2, inProgress: 1 },
      { month: "Mar", opened: 1, completed: 1, inProgress: 0 },
      { month: "Apr", opened: 3, completed: 2, inProgress: 1 },
      { month: "May", opened: 2, completed: 2, inProgress: 1 },
      { month: "Jun", opened: 2, completed: 1, inProgress: 2 },
    ],
    disposalTrends: [
      {
        month: "Jan",
        auction: 0,
        donation: 1,
        recycling: 1,
        writeOff: 0,
      },
      {
        month: "Feb",
        auction: 0,
        donation: 0,
        recycling: 1,
        writeOff: 0,
      },
      {
        month: "Mar",
        auction: 1,
        donation: 1,
        recycling: 1,
        writeOff: 1,
      },
      {
        month: "Apr",
        auction: 0,
        donation: 0,
        recycling: 0,
        writeOff: 1,
      },
      {
        month: "May",
        auction: 1,
        donation: 1,
        recycling: 1,
        writeOff: 1,
      },
      {
        month: "Jun",
        auction: 0,
        donation: 1,
        recycling: 1,
        writeOff: 0,
      },
    ],
    complianceGaps: [
      { type: "Missing Serial Numbers", count: 4 },
      { type: "Untagged Assets", count: 2 },
      { type: "Overdue Inspection", count: 8 },
      { type: "Missing Custodian", count: 1 },
      { type: "Incomplete Documentation", count: 6 },
    ],
  },
  "Mountain View": {
    totalAssets: 245,
    totalValue: "$510K",
    pendingCount: 12,
    assetValueByLocation: [
      { name: "MV Campus A", value: 260000, count: 130 },
      { name: "MV Campus B", value: 180000, count: 90 },
      { name: "MV Lab", value: 70000, count: 25 },
    ],
    lifecycleBreakdown: [
      { name: "Registered", value: 12, percentage: 4.9 },
      { name: "In Use", value: 185, percentage: 75.5 },
      { name: "Available", value: 14, percentage: 5.7 },
      { name: "Under Verification", value: 7, percentage: 2.9 },
      { name: "Transferred", value: 9, percentage: 3.7 },
      { name: "Damaged", value: 4, percentage: 1.6 },
      { name: "Retired", value: 11, percentage: 4.5 },
      { name: "Disposed", value: 3, percentage: 1.2 },
    ],
    monthlyTrends: [
      {
        month: "Jan",
        acquisitions: 12,
        disposals: 3,
        transfers: 9,
      },
      {
        month: "Feb",
        acquisitions: 14,
        disposals: 2,
        transfers: 11,
      },
      {
        month: "Mar",
        acquisitions: 10,
        disposals: 4,
        transfers: 10,
      },
      {
        month: "Apr",
        acquisitions: 16,
        disposals: 3,
        transfers: 14,
      },
      {
        month: "May",
        acquisitions: 14,
        disposals: 5,
        transfers: 12,
      },
      {
        month: "Jun",
        acquisitions: 12,
        disposals: 4,
        transfers: 10,
      },
    ],
    surveyCaseVolume: [
      { month: "Jan", opened: 2, completed: 2, inProgress: 0 },
      { month: "Feb", opened: 3, completed: 3, inProgress: 1 },
      { month: "Mar", opened: 2, completed: 2, inProgress: 1 },
      { month: "Apr", opened: 4, completed: 3, inProgress: 2 },
      { month: "May", opened: 2, completed: 3, inProgress: 1 },
      { month: "Jun", opened: 3, completed: 2, inProgress: 2 },
    ],
    disposalTrends: [
      {
        month: "Jan",
        auction: 1,
        donation: 1,
        recycling: 1,
        writeOff: 0,
      },
      {
        month: "Feb",
        auction: 0,
        donation: 0,
        recycling: 1,
        writeOff: 1,
      },
      {
        month: "Mar",
        auction: 1,
        donation: 1,
        recycling: 2,
        writeOff: 0,
      },
      {
        month: "Apr",
        auction: 1,
        donation: 0,
        recycling: 1,
        writeOff: 1,
      },
      {
        month: "May",
        auction: 2,
        donation: 1,
        recycling: 1,
        writeOff: 1,
      },
      {
        month: "Jun",
        auction: 1,
        donation: 1,
        recycling: 1,
        writeOff: 1,
      },
    ],
    complianceGaps: [
      { type: "Missing Serial Numbers", count: 6 },
      { type: "Untagged Assets", count: 3 },
      { type: "Overdue Inspection", count: 12 },
      { type: "Missing Custodian", count: 2 },
      { type: "Incomplete Documentation", count: 9 },
    ],
  },
  Austin: {
    totalAssets: 196,
    totalValue: "$375K",
    pendingCount: 8,
    assetValueByLocation: [
      { name: "Austin HQ", value: 220000, count: 115 },
      { name: "Austin South", value: 155000, count: 81 },
    ],
    lifecycleBreakdown: [
      { name: "Registered", value: 9, percentage: 4.6 },
      { name: "In Use", value: 149, percentage: 76.0 },
      { name: "Available", value: 11, percentage: 5.6 },
      { name: "Under Verification", value: 5, percentage: 2.6 },
      { name: "Transferred", value: 7, percentage: 3.6 },
      { name: "Damaged", value: 3, percentage: 1.5 },
      { name: "Retired", value: 9, percentage: 4.6 },
      { name: "Disposed", value: 3, percentage: 1.5 },
    ],
    monthlyTrends: [
      {
        month: "Jan",
        acquisitions: 9,
        disposals: 2,
        transfers: 7,
      },
      {
        month: "Feb",
        acquisitions: 11,
        disposals: 2,
        transfers: 8,
      },
      {
        month: "Mar",
        acquisitions: 8,
        disposals: 3,
        transfers: 7,
      },
      {
        month: "Apr",
        acquisitions: 13,
        disposals: 2,
        transfers: 11,
      },
      {
        month: "May",
        acquisitions: 11,
        disposals: 3,
        transfers: 9,
      },
      {
        month: "Jun",
        acquisitions: 10,
        disposals: 3,
        transfers: 8,
      },
    ],
    surveyCaseVolume: [
      { month: "Jan", opened: 2, completed: 1, inProgress: 1 },
      { month: "Feb", opened: 2, completed: 2, inProgress: 1 },
      { month: "Mar", opened: 1, completed: 2, inProgress: 0 },
      { month: "Apr", opened: 3, completed: 2, inProgress: 1 },
      { month: "May", opened: 2, completed: 2, inProgress: 1 },
      { month: "Jun", opened: 2, completed: 2, inProgress: 1 },
    ],
    disposalTrends: [
      {
        month: "Jan",
        auction: 0,
        donation: 1,
        recycling: 1,
        writeOff: 0,
      },
      {
        month: "Feb",
        auction: 1,
        donation: 0,
        recycling: 1,
        writeOff: 0,
      },
      {
        month: "Mar",
        auction: 1,
        donation: 0,
        recycling: 1,
        writeOff: 1,
      },
      {
        month: "Apr",
        auction: 0,
        donation: 1,
        recycling: 0,
        writeOff: 1,
      },
      {
        month: "May",
        auction: 1,
        donation: 1,
        recycling: 1,
        writeOff: 0,
      },
      {
        month: "Jun",
        auction: 0,
        donation: 0,
        recycling: 1,
        writeOff: 1,
      },
    ],
    complianceGaps: [
      { type: "Missing Serial Numbers", count: 4 },
      { type: "Untagged Assets", count: 2 },
      { type: "Overdue Inspection", count: 7 },
      { type: "Missing Custodian", count: 1 },
      { type: "Incomplete Documentation", count: 6 },
    ],
  },
  Philadelphia: {
    totalAssets: 160,
    totalValue: "$285K",
    pendingCount: 9,
    assetValueByLocation: [
      { name: "Philly Downtown", value: 165000, count: 88 },
      { name: "Philly North", value: 120000, count: 72 },
    ],
    lifecycleBreakdown: [
      { name: "Registered", value: 6, percentage: 3.8 },
      { name: "In Use", value: 117, percentage: 73.1 },
      { name: "Available", value: 9, percentage: 5.6 },
      { name: "Under Verification", value: 5, percentage: 3.1 },
      { name: "Transferred", value: 5, percentage: 3.1 },
      { name: "Damaged", value: 4, percentage: 2.5 },
      { name: "Retired", value: 11, percentage: 6.9 },
      { name: "Disposed", value: 3, percentage: 1.9 },
    ],
    monthlyTrends: [
      {
        month: "Jan",
        acquisitions: 7,
        disposals: 2,
        transfers: 5,
      },
      {
        month: "Feb",
        acquisitions: 8,
        disposals: 2,
        transfers: 6,
      },
      {
        month: "Mar",
        acquisitions: 6,
        disposals: 3,
        transfers: 5,
      },
      {
        month: "Apr",
        acquisitions: 10,
        disposals: 1,
        transfers: 8,
      },
      {
        month: "May",
        acquisitions: 9,
        disposals: 3,
        transfers: 7,
      },
      {
        month: "Jun",
        acquisitions: 7,
        disposals: 2,
        transfers: 6,
      },
    ],
    surveyCaseVolume: [
      { month: "Jan", opened: 1, completed: 1, inProgress: 0 },
      { month: "Feb", opened: 2, completed: 1, inProgress: 1 },
      { month: "Mar", opened: 1, completed: 1, inProgress: 1 },
      { month: "Apr", opened: 2, completed: 1, inProgress: 2 },
      { month: "May", opened: 1, completed: 2, inProgress: 0 },
      { month: "Jun", opened: 2, completed: 1, inProgress: 1 },
    ],
    disposalTrends: [
      {
        month: "Jan",
        auction: 1,
        donation: 0,
        recycling: 0,
        writeOff: 1,
      },
      {
        month: "Feb",
        auction: 0,
        donation: 1,
        recycling: 0,
        writeOff: 1,
      },
      {
        month: "Mar",
        auction: 1,
        donation: 0,
        recycling: 1,
        writeOff: 1,
      },
      {
        month: "Apr",
        auction: 1,
        donation: 0,
        recycling: 1,
        writeOff: 1,
      },
      {
        month: "May",
        auction: 0,
        donation: 1,
        recycling: 1,
        writeOff: 2,
      },
      {
        month: "Jun",
        auction: 1,
        donation: 0,
        recycling: 1,
        writeOff: 1,
      },
    ],
    complianceGaps: [
      { type: "Missing Serial Numbers", count: 4 },
      { type: "Untagged Assets", count: 2 },
      { type: "Overdue Inspection", count: 9 },
      { type: "Missing Custodian", count: 2 },
      { type: "Incomplete Documentation", count: 6 },
    ],
  },
};

const ALL_PENDING_ACTIONS: PendingAction[] = [
  {
    id: "PA-001",
    type: "inspection",
    description: "Quarterly inspection overdue for IT assets",
    assetCount: 18,
    dueDate: "2026-02-15",
    assignedTo: "John Smith",
    fieldOffice: "Las Vegas",
  },
  {
    id: "PA-002",
    type: "disposal",
    description:
      "Pending disposal approval for retired equipment",
    assetCount: 7,
    dueDate: "2026-03-01",
    assignedTo: "Sarah Johnson",
    fieldOffice: "Boulder",
  },
  {
    id: "PA-003",
    type: "tagging",
    description:
      "RFID tags not assigned to newly registered assets",
    assetCount: 12,
    dueDate: "2026-03-05",
    assignedTo: "Mike Chen",
    fieldOffice: "Mountain View",
  },
  {
    id: "PA-004",
    type: "transfer",
    description:
      "Pending transfer acknowledgments from Branch B",
    assetCount: 5,
    dueDate: "2026-03-10",
    assignedTo: "Lisa Wong",
    fieldOffice: "Austin",
  },
  {
    id: "PA-005",
    type: "verification",
    description: "Post-transfer verification incomplete",
    assetCount: 3,
    dueDate: "2026-03-15",
    assignedTo: "David Park",
    fieldOffice: "Philadelphia",
  },
];

// ─── Shared typography / spacing tokens for 40+ accessibility ───
// Base font sizes bumped: labels 15px → 16px, table cells 15px → 16px,
// body text 14px → 15px, headings scale accordingly.
// Touch targets: all interactive elements ≥ 44px tall.
// Contrast: muted text darkened, borders strengthened.

export default function ReportingAnalytics({
  onNavigateToPendingAction,
  onNavigateToComplianceGap,
}: {
  onNavigateToPendingAction?: (actionId: string) => void;
  onNavigateToComplianceGap?: (gapType: string) => void;
}) {
  const [viewMode, setViewMode] =
    useState<ViewMode>("dashboard");
  const [selectedFieldOffice, setSelectedFieldOffice] =
    useState<string>("All Offices");
  const [selectedReport, setSelectedReport] = useState<
    string | null
  >(null);
  const [customFilters, setCustomFilters] = useState<
    CustomFilter[]
  >([]);
  const [selectedFields, setSelectedFields] = useState<
    string[]
  >(["assetId", "name", "category", "location", "status"]);
  const [groupBy, setGroupBy] = useState<string>("none");
  const [sortBy, setSortBy] = useState<string>("assetId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    "asc",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [reportTab, setReportTab] = useState("all");
  const [showReportPreview, setShowReportPreview] =
    useState(false);
  const [reportResults, setReportResults] = useState<any[]>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [showScheduleDrawer, setShowScheduleDrawer] =
    useState(false);
  const [editingSchedule, setEditingSchedule] =
    useState<ScheduledReport | null>(null);
  const [saveQueryName, setSaveQueryName] = useState("");
  const [showSaveQueryDialog, setShowSaveQueryDialog] =
    useState(false);

  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    reportType: "asset-register-location",
    frequency: "monthly" as ScheduledReport["frequency"],
    recipients: "",
    format: "excel" as ScheduledReport["format"],
  });

  const isAdmin = CURRENT_USER_ROLE === "admin";
  const isManagerOrAbove =
    CURRENT_USER_ROLE === "admin" ||
    CURRENT_USER_ROLE === "manager";

  // ── Derived data from selected office ─────────────────────
  const officeData =
    OFFICE_DATA[selectedFieldOffice] ??
    OFFICE_DATA["All Offices"];

  const pendingActions = useMemo(
    () =>
      selectedFieldOffice === "All Offices"
        ? ALL_PENDING_ACTIONS
        : ALL_PENDING_ACTIONS.filter(
            (a) => a.fieldOffice === selectedFieldOffice,
          ),
    [selectedFieldOffice],
  );

  const [deleteConfirmOpen, setDeleteConfirmOpen] =
    useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "query" | "schedule";
    id: string;
    name: string;
  } | null>(null);
  const [showExportDialog, setShowExportDialog] =
    useState(false);
  const [exportReportId, setExportReportId] = useState<
    string | null
  >(null);
  const [showOfficeSelectDialog, setShowOfficeSelectDialog] =
    useState(false);
  const [pendingReportId, setPendingReportId] = useState<
    string | null
  >(null);
  const [reportOfficeSelection, setReportOfficeSelection] =
    useState<string>("All Offices");

  // ── Dashboard data now driven by officeData (selectedFieldOffice) ──

  const predefinedReports: PredefinedReport[] = [
    {
      id: "asset-register-location",
      name: "Asset Register by Location",
      description:
        "Complete asset inventory grouped by physical location",
      category: "Asset Register",
      icon: <MapPin className="w-6 h-6" />,
      accessLevel: "all",
    },
    {
      id: "asset-register-field-office",
      name: "Asset Register by Field Office",
      description: "Asset inventory organized per field office",
      category: "Asset Register",
      icon: <Package className="w-6 h-6" />,
      accessLevel: "all",
    },
    {
      id: "asset-register-custodian",
      name: "Asset Register by Custodian",
      description: "Asset assignments per employee/department",
      category: "Asset Register",
      icon: <Users className="w-6 h-6" />,
      accessLevel: "manager",
    },
    {
      id: "lifecycle-summary",
      name: "Lifecycle Status Summary",
      description:
        "Asset distribution across lifecycle stages (registered, in-use, retired, damaged, disposed)",
      category: "Lifecycle",
      icon: <TrendingUp className="w-6 h-6" />,
      accessLevel: "all",
    },
    {
      id: "disposal-summary",
      name: "Disposal Summary Report",
      description:
        "Disposal history by method, value, and time period",
      category: "Disposal",
      icon: <Gavel className="w-6 h-6" />,
      accessLevel: "manager",
    },
    {
      id: "transfer-history",
      name: "Transfer History Report",
      description:
        "Asset movement tracking per asset or department",
      category: "Transfer",
      icon: <Package className="w-6 h-6" />,
      accessLevel: "all",
    },
  ];

  const [savedQueries, setSavedQueries] = useState<
    SavedQuery[]
  >([
    {
      id: "SQ-001",
      name: "High-Value IT Assets",
      description: "IT equipment valued over $1000",
      filters: [
        {
          field: "category",
          operator: "equals",
          value: "IT Equipment",
        },
        {
          field: "value",
          operator: "greater_than",
          value: "1000",
        },
      ],
      selectedFields: [
        "assetId",
        "name",
        "serialNumber",
        "value",
        "location",
      ],
      groupBy: "location",
      sortBy: "value",
      sortOrder: "desc",
      createdBy: "admin@company.com",
      createdAt: "2024-01-15",
    },
    {
      id: "SQ-002",
      name: "Retired Assets - Q1 2024",
      description: "All assets retired in Q1",
      filters: [
        {
          field: "status",
          operator: "equals",
          value: "Retired",
        },
        {
          field: "retirementDate",
          operator: "between",
          value: "2024-01-01,2024-03-31",
        },
      ],
      selectedFields: [
        "assetId",
        "name",
        "retirementDate",
        "retirementReason",
        "value",
      ],
      groupBy: "none",
      sortBy: "retirementDate",
      sortOrder: "desc",
      createdBy: "manager@company.com",
      createdAt: "2024-01-20",
    },
  ]);

  const [scheduledReports, setScheduledReports] = useState<
    ScheduledReport[]
  >([
    {
      id: "SR-001",
      name: "Monthly Asset Register Report",
      reportType: "asset-register-location",
      frequency: "monthly",
      recipients: [
        "operations@company.com",
        "admin@company.com",
      ],
      format: "pdf",
      nextRun: "2026-03-01",
      lastRun: "2026-02-01",
      enabled: true,
      createdBy: "admin@company.com",
    },
    {
      id: "SR-002",
      name: "Weekly Asset Movement Summary",
      reportType: "transfer-history",
      frequency: "weekly",
      recipients: ["operations@company.com"],
      format: "excel",
      nextRun: "2026-03-03",
      lastRun: "2026-02-24",
      enabled: true,
      createdBy: "admin@company.com",
    },
    {
      id: "SR-003",
      name: "Quarterly Disposal Review",
      reportType: "disposal-summary",
      frequency: "quarterly",
      recipients: ["finance@company.com", "admin@company.com"],
      format: "excel",
      nextRun: "2026-04-01",
      lastRun: "2026-01-01",
      enabled: false,
      createdBy: "admin@company.com",
    },
  ]);

  const availableFields = [
    { id: "assetId", label: "Asset ID", sensitive: false },
    { id: "name", label: "Asset Name", sensitive: false },
    { id: "category", label: "Category", sensitive: false },
    {
      id: "serialNumber",
      label: "Serial Number",
      sensitive: false,
    },
    { id: "epc", label: "EPC/RFID Tag", sensitive: false },
    { id: "location", label: "Location", sensitive: false },
    {
      id: "fieldOffice",
      label: "Field Office",
      sensitive: false,
    },
    { id: "custodian", label: "Custodian", sensitive: false },
    { id: "status", label: "Status", sensitive: false },
    { id: "condition", label: "Condition", sensitive: false },
    { id: "value", label: "Value", sensitive: true },
    { id: "nbv", label: "Net Book Value", sensitive: true },
    {
      id: "purchaseDate",
      label: "Purchase Date",
      sensitive: false,
    },
    { id: "poNumber", label: "PO Number", sensitive: true },
    { id: "supplier", label: "Supplier", sensitive: false },
    {
      id: "lastInspection",
      label: "Last Inspection",
      sensitive: false,
    },
  ];

  const mockReportData = [
    {
      assetId: "A-001",
      name: "Dell Laptop XPS 15",
      category: "IT Equipment",
      serialNumber: "DL-2024-001",
      location: "HQ Floor 1",
      fieldOffice: "Headquarters",
      custodian: "John Smith",
      status: "In Use",
      condition: "Good",
      value: "$1,200",
      nbv: "$800",
      purchaseDate: "2024-01-10",
      poNumber: "PO-2024-001",
      supplier: "Dell Inc.",
      lastInspection: "2026-01-15",
    },
    {
      assetId: "A-002",
      name: "HP LaserJet Printer",
      category: "Office Equipment",
      serialNumber: "HP-2023-045",
      location: "HQ Floor 2",
      fieldOffice: "Headquarters",
      custodian: "Sarah Johnson",
      status: "In Use",
      condition: "Good",
      value: "$450",
      nbv: "$200",
      purchaseDate: "2023-06-20",
      poNumber: "PO-2023-012",
      supplier: "HP Inc.",
      lastInspection: "2026-01-20",
    },
    {
      assetId: "A-003",
      name: "Cisco Switch 48-Port",
      category: "IT Equipment",
      serialNumber: "CS-2023-112",
      location: "HQ Floor 3",
      fieldOffice: "Headquarters",
      custodian: "Mike Chen",
      status: "Under Verification",
      condition: "Fair",
      value: "$3,800",
      nbv: "$2,100",
      purchaseDate: "2023-03-15",
      poNumber: "PO-2023-005",
      supplier: "Cisco Systems",
      lastInspection: "2025-12-10",
    },
    {
      assetId: "A-004",
      name: "Standing Desk",
      category: "Furniture",
      serialNumber: "SD-2024-023",
      location: "Branch Office A",
      fieldOffice: "Branch A",
      custodian: "Lisa Wong",
      status: "In Use",
      condition: "Good",
      value: "$650",
      nbv: "$500",
      purchaseDate: "2024-02-01",
      poNumber: "PO-2024-003",
      supplier: "ErgoDesk",
      lastInspection: "2026-02-01",
    },
    {
      assetId: "A-005",
      name: "Projector Epson",
      category: "Office Equipment",
      serialNumber: "EP-2022-078",
      location: "Branch Office B",
      fieldOffice: "Branch B",
      custodian: "David Park",
      status: "Damaged",
      condition: "Poor",
      value: "$800",
      nbv: "$150",
      purchaseDate: "2022-09-10",
      poNumber: "PO-2022-018",
      supplier: "Epson",
      lastInspection: "2025-11-05",
    },
    {
      assetId: "A-006",
      name: 'MacBook Pro 14"',
      category: "IT Equipment",
      serialNumber: "AP-2024-089",
      location: "HQ Floor 1",
      fieldOffice: "Headquarters",
      custodian: "Anna Lee",
      status: "In Use",
      condition: "Excellent",
      value: "$2,400",
      nbv: "$2,000",
      purchaseDate: "2024-05-01",
      poNumber: "PO-2024-010",
      supplier: "Apple Inc.",
      lastInspection: "2026-02-10",
    },
    {
      assetId: "A-007",
      name: "Office Chair Herman Miller",
      category: "Furniture",
      serialNumber: "HM-2023-034",
      location: "HQ Floor 2",
      fieldOffice: "Headquarters",
      custodian: "Tom Wilson",
      status: "Retired",
      condition: "Poor",
      value: "$950",
      nbv: "$0",
      purchaseDate: "2020-04-15",
      poNumber: "PO-2020-007",
      supplier: "Herman Miller",
      lastInspection: "2025-10-20",
    },
    {
      assetId: "A-008",
      name: "UPS Battery Backup",
      category: "IT Equipment",
      serialNumber: "UPS-2024-011",
      location: "Branch Office A",
      fieldOffice: "Branch A",
      custodian: "Mike Chen",
      status: "Available",
      condition: "Good",
      value: "$350",
      nbv: "$280",
      purchaseDate: "2024-01-20",
      poNumber: "PO-2024-002",
      supplier: "APC",
      lastInspection: "2026-01-25",
    },
  ];

  // ── Handlers ────────────────────────────────────────────────────

  const handleGenerateReport = (reportId: string) => {
    const report = predefinedReports.find(
      (r) => r.id === reportId,
    );
    if (!report) return;
    if (report.accessLevel === "admin" && !isAdmin) {
      toast.error(
        "Admin access required to generate this report",
      );
      return;
    }
    if (report.accessLevel === "manager" && !isManagerOrAbove) {
      toast.error(
        "Manager access required to generate this report",
      );
      return;
    }

    // Show office selection dialog
    setPendingReportId(reportId);
    setReportOfficeSelection("All Offices");
    setShowOfficeSelectDialog(true);
  };

  const handleConfirmGenerateReport = () => {
    if (!pendingReportId) return;
    const report = predefinedReports.find(
      (r) => r.id === pendingReportId,
    );
    if (!report) return;

    toast.success(
      `Generating ${report.name} for ${reportOfficeSelection}...`,
    );
    setSelectedReport(pendingReportId);
    setShowReportPreview(true);
    setReportResults(getSortedResults(mockReportData));
    setShowOfficeSelectDialog(false);
    setPendingReportId(null);
  };

  const handleExport = (format: "excel" | "pdf" | "csv") => {
    toast.success(
      `Exporting report as ${format.toUpperCase()}... Download will begin shortly.`,
    );
  };

  const handleShareReport = () => {
    if (!shareEmail.trim()) {
      toast.error("Please enter at least one email address");
      return;
    }
    toast.success(`Report shared with ${shareEmail}`);
    setShareEmail("");
    setShowShareDialog(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(
      `https://ams.chorus.com/reports/shared/${selectedReport || "custom"}`,
    );
    toast.success("Report link copied to clipboard");
  };

  const handleAddFilter = () => {
    setCustomFilters([
      ...customFilters,
      { field: "category", operator: "equals", value: "" },
    ]);
  };

  const handleUpdateFilter = (
    index: number,
    update: Partial<CustomFilter>,
  ) => {
    const updated = [...customFilters];
    updated[index] = { ...updated[index], ...update };
    setCustomFilters(updated);
  };

  const handleRemoveFilter = (index: number) => {
    setCustomFilters(
      customFilters.filter((_, i) => i !== index),
    );
  };

  const getSortedResults = (data: any[]) => {
    let results = [...data];
    if (sortBy && sortBy !== "none") {
      results.sort((a, b) => {
        const aVal = (a[sortBy] || "").toString().toLowerCase();
        const bVal = (b[sortBy] || "").toString().toLowerCase();
        if (sortOrder === "asc")
          return aVal.localeCompare(bVal);
        return bVal.localeCompare(aVal);
      });
    }
    return results;
  };

  const getGroupedResults = (data: any[]) => {
    if (groupBy === "none" || !groupBy) return null;
    const groups: Record<string, any[]> = {};
    data.forEach((item) => {
      const key = item[groupBy] || "Ungrouped";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  };

  const handleRunCustomReport = () => {
    if (customFilters.length === 0) {
      toast.error("Please add at least one filter");
      return;
    }
    toast.success("Running custom report...");
    setShowReportPreview(true);
    setReportResults(getSortedResults(mockReportData));
  };

  const handleSaveQuery = () => {
    if (!saveQueryName.trim()) {
      toast.error("Please enter a name for this query");
      return;
    }
    const newQuery: SavedQuery = {
      id: `SQ-${String(savedQueries.length + 1).padStart(3, "0")}`,
      name: saveQueryName,
      description: `Custom query with ${customFilters.length} filter(s)`,
      filters: customFilters,
      selectedFields,
      groupBy,
      sortBy,
      sortOrder,
      createdBy: "admin@company.com",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setSavedQueries([newQuery, ...savedQueries]);
    setSaveQueryName("");
    setShowSaveQueryDialog(false);
    toast.success(
      `Query "${saveQueryName}" saved successfully`,
    );
  };

  const handleLoadQuery = (query: SavedQuery) => {
    setCustomFilters(query.filters);
    setSelectedFields(query.selectedFields);
    if (query.groupBy) setGroupBy(query.groupBy);
    if (query.sortBy) setSortBy(query.sortBy);
    if (query.sortOrder) setSortOrder(query.sortOrder);
    toast.success(`Loaded query: ${query.name}`);
  };

  const handleDeleteQuery = (id: string) => {
    const query = savedQueries.find((q) => q.id === id);
    setDeleteTarget({
      type: "query",
      id,
      name: query?.name || "",
    });
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteQuery = (id: string) => {
    setSavedQueries(savedQueries.filter((q) => q.id !== id));
    toast.success("Query deleted");
  };

  const handleCreateSchedule = () => {
    if (!scheduleForm.name.trim()) {
      toast.error("Please enter a schedule name");
      return;
    }
    if (!scheduleForm.recipients.trim()) {
      toast.error("Please enter at least one recipient email");
      return;
    }
    const newSchedule: ScheduledReport = {
      id: `SR-${String(scheduledReports.length + 1).padStart(3, "0")}`,
      name: scheduleForm.name,
      reportType: scheduleForm.reportType,
      frequency: scheduleForm.frequency,
      recipients: scheduleForm.recipients
        .split(",")
        .map((e) => e.trim()),
      format: scheduleForm.format,
      nextRun: getNextRunDate(scheduleForm.frequency),
      enabled: true,
      createdBy: "admin@company.com",
    };
    if (editingSchedule) {
      setScheduledReports(
        scheduledReports.map((s) =>
          s.id === editingSchedule.id
            ? { ...newSchedule, id: editingSchedule.id }
            : s,
        ),
      );
      toast.success(`Schedule "${scheduleForm.name}" updated`);
    } else {
      setScheduledReports([newSchedule, ...scheduledReports]);
      toast.success(`Schedule "${scheduleForm.name}" created`);
    }
    setShowScheduleDrawer(false);
    setEditingSchedule(null);
    setScheduleForm({
      name: "",
      reportType: "asset-register-location",
      frequency: "monthly",
      recipients: "",
      format: "excel",
    });
  };

  const handleToggleSchedule = (id: string) => {
    setScheduledReports(
      scheduledReports.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s,
      ),
    );
    const schedule = scheduledReports.find((s) => s.id === id);
    toast.success(
      `Schedule "${schedule?.name}" ${schedule?.enabled ? "paused" : "enabled"}`,
    );
  };

  const handleDeleteSchedule = (id: string) => {
    const schedule = scheduledReports.find((s) => s.id === id);
    setDeleteTarget({
      type: "schedule",
      id,
      name: schedule?.name || "",
    });
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteSchedule = (id: string) => {
    const schedule = scheduledReports.find((s) => s.id === id);
    setScheduledReports(
      scheduledReports.filter((s) => s.id !== id),
    );
    toast.success(`Schedule "${schedule?.name}" deleted`);
  };

  const handleEditSchedule = (schedule: ScheduledReport) => {
    setEditingSchedule(schedule);
    setScheduleForm({
      name: schedule.name,
      reportType: schedule.reportType,
      frequency: schedule.frequency,
      recipients: schedule.recipients.join(", "),
      format: schedule.format,
    });
    setShowScheduleDrawer(true);
  };

  const getNextRunDate = (frequency: string) => {
    const now = new Date();
    switch (frequency) {
      case "daily":
        now.setDate(now.getDate() + 1);
        break;
      case "weekly":
        now.setDate(now.getDate() + 7);
        break;
      case "monthly":
        now.setMonth(now.getMonth() + 1);
        break;
      case "quarterly":
        now.setMonth(now.getMonth() + 3);
        break;
    }
    return now.toISOString().split("T")[0];
  };

  const getPendingActionIcon = (
    type: PendingAction["type"],
  ) => {
    switch (type) {
      case "inspection":
        return <Search className="w-5 h-5" />;
      case "disposal":
        return <Gavel className="w-5 h-5" />;
      case "transfer":
        return <Package className="w-5 h-5" />;
      case "tagging":
        return <Assignment className="w-5 h-5" />;
      case "verification":
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "quarterly":
        return "Quarterly";
      default:
        return freq;
    }
  };

  // ── Field Office Filter (rendered in all views) ───────────

  const renderFieldOfficeFilter = () => (
    <div className="flex items-center gap-2 min-w-[220px]">
      <Select
        value={selectedFieldOffice}
        onValueChange={setSelectedFieldOffice}
      >
        <SelectTrigger className="h-11 text-base border-[#121321]/30 dark:border-white/30 font-medium pr-2 [&>svg]:right-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
          {FIELD_OFFICES.map((fo) => (
            <SelectItem
              key={fo}
              value={fo}
              className="text-base py-2.5"
            >
              {fo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // ══════════════════════════════════════════════════════════════
  const CustomTooltipStyle = {
    backgroundColor: "var(--background)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    fontSize: "14px",
    padding: "10px 14px",
  };

  // ── Report Results Table ──────────────────────────────────────

  const renderResultsTable = () => {
    const grouped = getGroupedResults(reportResults);

    if (grouped) {
      return (
        <div className="space-y-6">
          {Object.entries(grouped).map(([groupKey, items]) => (
            <div key={groupKey}>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-[#121321] text-white dark:bg-[#81CCD7] dark:text-[#121321] text-sm px-3 py-1">
                  {availableFields.find((f) => f.id === groupBy)
                    ?.label || groupBy}
                  : {groupKey}
                </Badge>
                <span className="text-sm text-muted-foreground font-medium">
                  ({items.length} assets)
                </span>
              </div>
              <div className="rounded-md border overflow-x-auto mb-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      {selectedFields.map((fieldId) => {
                        const field = availableFields.find(
                          (f) => f.id === fieldId,
                        );
                        return (
                          <TableHead
                            key={fieldId}
                            className="whitespace-nowrap text-base font-semibold py-3"
                          >
                            {field?.label || fieldId}
                            {field?.sensitive && (
                              <Lock className="w-3.5 h-3.5 inline ml-1 text-muted-foreground" />
                            )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((row: any, idx: number) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-muted/30"
                      >
                        {selectedFields.map((fieldId) => (
                          <TableCell
                            key={fieldId}
                            className="whitespace-nowrap text-base py-3"
                          >
                            {row[fieldId] || "—"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              {selectedFields.map((fieldId) => {
                const field = availableFields.find(
                  (f) => f.id === fieldId,
                );
                const isSortField = sortBy === fieldId;
                return (
                  <TableHead
                    key={fieldId}
                    className="whitespace-nowrap cursor-pointer text-base font-semibold py-3 select-none"
                    onClick={() => {
                      if (isSortField)
                        setSortOrder(
                          sortOrder === "asc" ? "desc" : "asc",
                        );
                      else {
                        setSortBy(fieldId);
                        setSortOrder("asc");
                      }
                      setReportResults(
                        getSortedResults(reportResults),
                      );
                    }}
                  >
                    <span className="flex items-center gap-1">
                      {field?.label || fieldId}
                      {field?.sensitive && (
                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                      {isSortField &&
                        (sortOrder === "asc" ? (
                          <ArrowUpward className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownward className="w-3.5 h-3.5" />
                        ))}
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportResults.length > 0 ? (
              reportResults.map((row, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-muted/30"
                >
                  {selectedFields.map((fieldId) => (
                    <TableCell
                      key={fieldId}
                      className="whitespace-nowrap text-base py-3"
                    >
                      {row[fieldId] || "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={selectedFields.length}
                  className="text-center py-16 text-muted-foreground text-base"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  // ── Share Dialog ────────────────────────────────────────────────

  const renderShareDialog = () => (
    <Dialog
      open={showShareDialog}
      onOpenChange={setShowShareDialog}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Share className="w-5 h-5" />
            Share Report
          </DialogTitle>
          <DialogDescription className="text-base mt-1">
            Share this report with team members via email or
            link
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 mt-4">
          <div>
            <Label className="text-base font-medium">
              Email Addresses
            </Label>
            <Input
              placeholder="colleague@company.com, manager@company.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="mt-2 h-12 text-base"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Separate multiple emails with commas
            </p>
          </div>
          <Separator />
          <div className="flex gap-3">
            <Button
              onClick={handleShareReport}
              className="flex-1 h-11 text-base"
            >
              <Email className="w-4 h-4 mr-2" />
              Send via Email
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="h-11 text-base"
            >
              <ContentCopy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // ── Export Format Dialog ────────────────────────────────────────

  const renderExportDialog = () => (
    <Dialog
      open={showExportDialog}
      onOpenChange={setShowExportDialog}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Export Report
          </DialogTitle>
          <DialogDescription className="text-base mt-1">
            Choose the format for your report export
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {[
            {
              format: "excel" as const,
              label: "Excel (.xlsx)",
              sub: "Best for data analysis and editing",
              icon: (
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
              ),
              bg: "bg-green-100 dark:bg-green-900/20",
            },
            {
              format: "csv" as const,
              label: "CSV (.csv)",
              sub: "Universal format for data import",
              icon: (
                <FileText className="w-6 h-6 text-blue-600" />
              ),
              bg: "bg-blue-100 dark:bg-blue-900/20",
            },
            {
              format: "pdf" as const,
              label: "PDF (.pdf)",
              sub: "Best for sharing and printing",
              icon: (
                <FileDown className="w-6 h-6 text-red-600" />
              ),
              bg: "bg-red-100 dark:bg-red-900/20",
            },
          ].map(({ format, label, sub, icon, bg }) => (
            <Button
              key={format}
              variant="outline"
              className="w-full justify-start h-auto py-4 px-4"
              onClick={() => {
                handleExport(format);
                setShowExportDialog(false);
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center shrink-0`}
                >
                  {icon}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-base">
                    {label}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {sub}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderOfficeSelectDialog = () => (
    <Dialog
      open={showOfficeSelectDialog}
      onOpenChange={setShowOfficeSelectDialog}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Select Office
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="office-select"
              className="text-base"
            >
              Office
            </Label>
            <Select
              value={reportOfficeSelection}
              onValueChange={setReportOfficeSelection}
            >
              <SelectTrigger
                id="office-select"
                className="h-11 text-base pr-2 [&>svg]:right-2"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[9999] w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                {FIELD_OFFICES.map((fo) => (
                  <SelectItem
                    key={fo}
                    value={fo}
                    className="text-base py-2.5"
                  >
                    {fo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-11 text-base"
              onClick={() => setShowOfficeSelectDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-11 text-base"
              onClick={handleConfirmGenerateReport}
            >
              Generate Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // ══════════════════════════════════════════════════════════════
  //  DASHBOARD VIEW
  // ══════════════════════════════════════════════════════════════

  if (viewMode === "dashboard") {
    return (
      <div className="space-y-7">
        {/* Top action bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* LEFT: Field Office filter */}
          {renderFieldOfficeFilter()}
          {/* RIGHT: Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setViewMode("predefined")}
              className="h-11 text-base px-5"
            >
              <FileText className="w-5 h-5 mr-2" />
              Predefined Reports
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewMode("scheduled")}
              className="h-11 text-base px-5"
            >
              <Clock className="w-5 h-5 mr-2" />
              Scheduled Reports
            </Button>
            <Button
              onClick={() => setViewMode("custom")}
              className="h-11 text-base px-5"
            >
              Custom Report
            </Button>
          </div>
        </div>

        {/* Office context pill */}
        {selectedFieldOffice !== "All Offices" && (
          <div className="flex items-center gap-2">
            <Badge className="bg-[#121321] text-white dark:bg-[#81CCD7] dark:text-[#121321] text-sm px-3 py-1.5 gap-1.5">
              <Business className="w-3.5 h-3.5" />
              Showing data for: {selectedFieldOffice}
            </Badge>
            <button
              className="text-sm text-muted-foreground underline underline-offset-2"
              onClick={() =>
                setSelectedFieldOffice("All Offices")
              }
            >
              Clear filter
            </button>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              label: "Total Assets",
              value: officeData.totalAssets.toLocaleString(),
              icon: (
                <Package className="w-7 h-7 text-[#121321] dark:text-white" />
              ),
              iconBg: "bg-[#121321]/10 dark:bg-white/10",
            },
            {
              label: "Total Value",
              value: officeData.totalValue,
              icon: (
                <TrendingUp className="w-7 h-7 text-[#121321] dark:text-white" />
              ),
              iconBg: "bg-[#121321]/10 dark:bg-white/10",
            },
            {
              label: "Pending Actions",
              value: String(officeData.pendingCount),
              icon: (
                <AlertCircle className="w-7 h-7 text-[#121321] dark:text-white" />
              ),
              iconBg: "bg-[#121321]/10 dark:bg-white/10",
            },
          ].map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base text-muted-foreground font-medium">
                      {kpi.label}
                    </p>
                    <p className="text-4xl font-semibold mt-2">
                      {kpi.value}
                    </p>
                  </div>
                  <div
                    className={`w-14 h-14 ${kpi.iconBg} rounded-xl flex items-center justify-center`}
                  >
                    {kpi.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                Asset Value &amp; Count by Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart
                  data={officeData.assetValueByLocation}
                >
                  <CartesianGrid
                    key="grid"
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis
                    key="xaxis"
                    dataKey="name"
                    angle={-15}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 13 }}
                  />
                  <YAxis
                    key="yaxis-left"
                    yAxisId="left"
                    tick={{ fontSize: 13 }}
                  />
                  <YAxis
                    key="yaxis-right"
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 13 }}
                  />
                  <RechartsTooltip
                    key="tooltip"
                    contentStyle={CustomTooltipStyle}
                    formatter={(value: any, name: string) =>
                      name === "Value ($)"
                        ? `$${value.toLocaleString()}`
                        : value
                    }
                  />
                  <Legend
                    key="legend"
                    wrapperStyle={{
                      fontSize: "14px",
                      paddingTop: "12px",
                    }}
                  />
                  <Bar
                    key="value"
                    yAxisId="left"
                    dataKey="value"
                    fill="#3b82f6"
                    name="Value ($)"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    key="count"
                    yAxisId="right"
                    dataKey="count"
                    fill="#10b981"
                    name="Count"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                Lifecycle Stage Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    key="pie"
                    data={officeData.lifecycleBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) =>
                      `${name}: ${percentage}%`
                    }
                    outerRadius={110}
                    dataKey="value"
                  >
                    {officeData.lifecycleBreakdown.map(
                      (_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ),
                    )}
                  </Pie>
                  <RechartsTooltip
                    key="tooltip"
                    contentStyle={CustomTooltipStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                Monthly Activity Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={officeData.monthlyTrends}>
                  <CartesianGrid
                    key="grid"
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis
                    key="xaxis"
                    dataKey="month"
                    tick={{ fontSize: 13 }}
                  />
                  <YAxis key="yaxis" tick={{ fontSize: 13 }} />
                  <RechartsTooltip
                    key="tooltip"
                    contentStyle={CustomTooltipStyle}
                  />
                  <Legend
                    key="legend"
                    wrapperStyle={{
                      fontSize: "14px",
                      paddingTop: "12px",
                    }}
                  />
                  <Line
                    key="acquisitions"
                    type="monotone"
                    dataKey="acquisitions"
                    stroke="#3b82f6"
                    name="Acquisitions"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    key="disposals"
                    type="monotone"
                    dataKey="disposals"
                    stroke="#ef4444"
                    name="Disposals"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    key="transfers"
                    type="monotone"
                    dataKey="transfers"
                    stroke="#10b981"
                    name="Transfers"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gavel className="w-5 h-5 text-muted-foreground" />
                Disposal Trends by Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={officeData.disposalTrends}>
                  <CartesianGrid
                    key="grid"
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis
                    key="xaxis"
                    dataKey="month"
                    tick={{ fontSize: 13 }}
                  />
                  <YAxis key="yaxis" tick={{ fontSize: 13 }} />
                  <RechartsTooltip
                    key="tooltip"
                    contentStyle={CustomTooltipStyle}
                  />
                  <Legend
                    key="legend"
                    wrapperStyle={{
                      fontSize: "14px",
                      paddingTop: "12px",
                    }}
                  />
                  <Area
                    key="auction"
                    type="monotone"
                    dataKey="auction"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.55}
                    name="Auction"
                  />
                  <Area
                    key="donation"
                    type="monotone"
                    dataKey="donation"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.55}
                    name="Donation"
                  />
                  <Area
                    key="recycling"
                    type="monotone"
                    dataKey="recycling"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.55}
                    name="Recycling"
                  />
                  <Area
                    key="writeOff"
                    type="monotone"
                    dataKey="writeOff"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.55}
                    name="Write-Off"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Survey Case Volume */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Assignment className="w-5 h-5 text-muted-foreground" />
              Survey Case Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={officeData.surveyCaseVolume}>
                <CartesianGrid
                  key="grid"
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis
                  key="xaxis"
                  dataKey="month"
                  tick={{ fontSize: 13 }}
                />
                <YAxis key="yaxis" tick={{ fontSize: 13 }} />
                <RechartsTooltip
                  key="tooltip"
                  contentStyle={CustomTooltipStyle}
                />
                <Legend
                  key="legend"
                  wrapperStyle={{
                    fontSize: "14px",
                    paddingTop: "12px",
                  }}
                />
                <Bar
                  key="opened"
                  dataKey="opened"
                  fill="#3b82f6"
                  name="Opened"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  key="completed"
                  dataKey="completed"
                  fill="#10b981"
                  name="Completed"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  key="inProgress"
                  dataKey="inProgress"
                  fill="#f59e0b"
                  name="In Progress"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pending Actions Detail Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Pending Actions Breakdown
              </CardTitle>
              <Badge
                variant="outline"
                className="text-sm px-3 py-1"
              >
                {pendingActions.length} actions pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-base font-semibold py-3.5">
                      Type
                    </TableHead>
                    <TableHead className="text-base font-semibold py-3.5">
                      Description
                    </TableHead>
                    <TableHead className="text-base font-semibold py-3.5">
                      Assets
                    </TableHead>
                    <TableHead className="text-base font-semibold py-3.5">
                      Due Date
                    </TableHead>
                    <TableHead className="text-base font-semibold py-3.5">
                      Assigned To
                    </TableHead>
                    <TableHead className="w-28 text-base font-semibold py-3.5">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingActions.map((action) => {
                    const isOverdue =
                      new Date(action.dueDate) < new Date();
                    return (
                      <TableRow
                        key={action.id}
                        className="hover:bg-muted/30 cursor-pointer"
                        onClick={() => {
                          window.location.hash =
                            "pending-action-detail";
                          onNavigateToPendingAction?.(
                            action.id,
                          );
                        }}
                      >
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-2 text-base">
                            {getPendingActionIcon(action.type)}
                            <span className="capitalize font-medium">
                              {action.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs text-base py-3.5">
                          {action.description}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <Badge
                            variant="outline"
                            className="text-sm px-2.5 py-0.5"
                          >
                            {action.assetCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span
                            className={`text-base font-medium ${isOverdue ? "text-red-600" : ""}`}
                          >
                            {formatDate(action.dueDate)}
                            {isOverdue && (
                              <span className="text-sm ml-1">
                                (overdue)
                              </span>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-base py-3.5">
                          {action.assignedTo}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.hash =
                                "pending-action-detail";
                              onNavigateToPendingAction?.(
                                action.id,
                              );
                            }}
                          >
                            <Visibility className="w-5 h-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Gaps Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Compliance Gaps Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-base font-semibold py-3.5">
                      Gap Type
                    </TableHead>
                    <TableHead className="text-base font-semibold py-3.5">
                      Count
                    </TableHead>
                    <TableHead className="w-24 text-base font-semibold py-3.5">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {officeData.complianceGaps.map(
                    (gap, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-muted/30 cursor-pointer"
                        onClick={() => {
                          window.location.hash =
                            "compliance-gap-detail";
                          onNavigateToComplianceGap?.(gap.type);
                        }}
                      >
                        <TableCell className="text-base py-3.5 font-medium">
                          {gap.type}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <Badge
                            variant="outline"
                            className="text-sm px-2.5 py-0.5"
                          >
                            {gap.count} assets
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.hash =
                                "compliance-gap-detail";
                              onNavigateToComplianceGap?.(
                                gap.type,
                              );
                            }}
                          >
                            <Visibility className="w-5 h-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  //  PREDEFINED REPORTS VIEW
  // ══════════════════════════════════════════════════════════════

  if (viewMode === "predefined") {
    const filteredReports = predefinedReports.filter(
      (report) =>
        report.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        report.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );

    return (
      <TooltipProvider>
        <div className="space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setViewMode("dashboard")}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Reporting & Analytics
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">
              Predefined Reports
            </span>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 bg-muted/50 p-1.5 rounded-[6px] w-fit flex-wrap">
            {[
              { key: "all", label: "All Reports" },
              {
                key: "Asset Register",
                label: "Asset Register",
              },
              { key: "Lifecycle", label: "Lifecycle" },
              { key: "Disposal", label: "Disposal" },
              { key: "Transfer", label: "Transfer" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setReportTab(tab.key)}
                className={`px-5 py-2.5 rounded-[4px] text-base font-medium transition-colors ${
                  reportTab === tab.key
                    ? "bg-[#121321] text-white shadow-sm"
                    : "bg-transparent text-[#121321] dark:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredReports
              .filter(
                (r) =>
                  reportTab === "all" ||
                  r.category === reportTab,
              )
              .map((report) => {
                const canAccess =
                  report.accessLevel === "all" ||
                  (report.accessLevel === "manager" &&
                    isManagerOrAbove) ||
                  (report.accessLevel === "admin" && isAdmin);
                return (
                  <Card
                    key={report.id}
                    className={`transition-colors ${canAccess ? "" : "opacity-60"}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          {report.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {report.name}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="mt-1.5 text-sm"
                          >
                            {report.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base text-muted-foreground mb-5">
                        {report.description}
                      </p>
                      <div className="flex gap-3">
                        <Button
                          size="default"
                          onClick={() =>
                            handleGenerateReport(report.id)
                          }
                          className="flex-1 h-11 text-base"
                          disabled={!canAccess}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Generate Report
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="default"
                              variant="outline"
                              className="h-11 px-4"
                              onClick={() => {
                                setExportReportId(report.id);
                                setShowExportDialog(true);
                              }}
                              disabled={!canAccess}
                            >
                              <Download className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download Report</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {/* Report Preview Dialog — full screen */}
          <Dialog
            open={showReportPreview}
            onOpenChange={setShowReportPreview}
          >
            <DialogContent className="!inset-0 !translate-x-0 !translate-y-0 !max-w-none !w-full !h-full !rounded-none overflow-hidden !p-0 !m-0 !gap-0 flex flex-col !border-0">
              <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">
                <div>
                  <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                    <FileText className="w-6 h-6" />
                    Report Preview
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-base">
                    {reportResults.length} records found —
                    Review, export, or share your report
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={() => handleExport("excel")}
                    size="default"
                    className="h-10 text-base"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport("pdf")}
                    size="default"
                    className="h-10 text-base"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport("csv")}
                    size="default"
                    className="h-10 text-base"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowShareDialog(true)}
                    size="default"
                    className="h-10 text-base"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {renderResultsTable()}
              </div>
              <div className="flex items-center justify-between border-t px-6 py-3.5 shrink-0">
                <p className="text-base text-muted-foreground">
                  Showing {reportResults.length} of{" "}
                  {reportResults.length} results
                </p>
                <div className="flex gap-3">
                  <Button
                    size="default"
                    variant="outline"
                    className="h-10 text-base"
                    disabled
                  >
                    Previous
                  </Button>
                  <Button
                    size="default"
                    variant="outline"
                    className="h-10 text-base"
                    disabled
                  >
                    Next
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {renderShareDialog()}
          {renderExportDialog()}
          {renderOfficeSelectDialog()}
        </div>
      </TooltipProvider>
    );
  }

  // ══════════════════════════════════════════════════════════════
  //  CUSTOM REPORT BUILDER VIEW
  // ══════════════════════════════════════════════════════════════

  if (viewMode === "custom") {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("dashboard")}
              className="mb-2 -ml-2 gap-1 text-base h-10"
            >
              ← Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {renderFieldOfficeFilter()}
            <Button
              variant="outline"
              onClick={() => setShowSaveQueryDialog(true)}
              className="h-11 text-base px-5"
            >
              Save Query
            </Button>
            <Button
              onClick={handleRunCustomReport}
              className="h-11 text-base px-5"
            >
              Run Report
            </Button>
          </div>
        </div>

        {selectedFieldOffice !== "All Offices" && (
          <Badge className="bg-[#121321] text-white dark:bg-[#81CCD7] dark:text-[#121321] text-sm px-3 py-1.5 gap-1.5 w-fit">
            <Business className="w-3.5 h-3.5" />
            Filtering data for: {selectedFieldOffice}
          </Badge>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Query Builder — left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    Filter Criteria
                  </CardTitle>
                  <Button
                    size="default"
                    onClick={handleAddFilter}
                    className="h-10 text-base"
                  >
                    Add Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {customFilters.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Filter className="w-14 h-14 mx-auto mb-3 opacity-40" />
                    <p className="text-base font-medium">
                      No filters added yet
                    </p>
                    <p className="text-sm mt-1">
                      Click "Add Filter" to start building your
                      query
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customFilters.map((filter, index) => (
                      <div
                        key={index}
                        className="flex gap-3 items-end"
                      >
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          {[
                            {
                              label: "Field",
                              content: (
                                <Select
                                  value={filter.field}
                                  onValueChange={(val) =>
                                    handleUpdateFilter(index, {
                                      field: val,
                                    })
                                  }
                                >
                                  <SelectTrigger className="h-11 text-base pr-2 [&>svg]:right-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                                    {[
                                      "category",
                                      "status",
                                      "location",
                                      "fieldOffice",
                                      "custodian",
                                      "value",
                                      "poNumber",
                                      "condition",
                                      "supplier",
                                    ].map((f) => (
                                      <SelectItem
                                        key={f}
                                        value={f}
                                        className="text-base py-2.5 capitalize"
                                      >
                                        {f.replace(
                                          /([A-Z])/g,
                                          " $1",
                                        )}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ),
                            },
                            {
                              label: "Operator",
                              content: (
                                <Select
                                  value={filter.operator}
                                  onValueChange={(val) =>
                                    handleUpdateFilter(index, {
                                      operator: val,
                                    })
                                  }
                                >
                                  <SelectTrigger className="h-11 text-base pr-2 [&>svg]:right-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                                    {[
                                      {
                                        v: "equals",
                                        l: "Equals",
                                      },
                                      {
                                        v: "not_equals",
                                        l: "Not Equals",
                                      },
                                      {
                                        v: "contains",
                                        l: "Contains",
                                      },
                                      {
                                        v: "greater_than",
                                        l: "Greater Than",
                                      },
                                      {
                                        v: "less_than",
                                        l: "Less Than",
                                      },
                                      {
                                        v: "between",
                                        l: "Between",
                                      },
                                    ].map((op) => (
                                      <SelectItem
                                        key={op.v}
                                        value={op.v}
                                        className="text-base py-2.5"
                                      >
                                        {op.l}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ),
                            },
                            {
                              label: "Value",
                              content: (
                                <Input
                                  placeholder="Enter value"
                                  value={filter.value}
                                  onChange={(e) =>
                                    handleUpdateFilter(index, {
                                      value: e.target.value,
                                    })
                                  }
                                  className="h-11 text-base"
                                />
                              ),
                            },
                          ].map(({ label, content }) => (
                            <div key={label}>
                              <Label className="text-base font-medium mb-1.5 block">
                                {label}
                              </Label>
                              {content}
                            </div>
                          ))}
                        </div>
                        <Button
                          size="default"
                          variant="ghost"
                          onClick={() =>
                            handleRemoveFilter(index)
                          }
                          className="h-11 w-11 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Remove filter"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Group By + Sort By */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ViewColumn className="w-5 h-5 text-muted-foreground" />
                    Group By
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={groupBy}
                    onValueChange={setGroupBy}
                  >
                    <SelectTrigger className="h-12 text-base pr-2 [&>svg]:right-2">
                      <SelectValue placeholder="No grouping" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      {[
                        { v: "none", l: "No Grouping" },
                        { v: "category", l: "Category" },
                        { v: "location", l: "Location" },
                        { v: "fieldOffice", l: "Field Office" },
                        { v: "custodian", l: "Custodian" },
                        { v: "status", l: "Status" },
                        { v: "condition", l: "Condition" },
                        { v: "supplier", l: "Supplier" },
                      ].map((opt) => (
                        <SelectItem
                          key={opt.v}
                          value={opt.v}
                          className="text-base py-2.5"
                        >
                          {opt.l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2.5">
                    Results will be organized into sections by
                    the selected field
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <SortByAlpha className="w-5 h-5 text-muted-foreground" />
                    Sort By
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Select
                      value={sortBy}
                      onValueChange={setSortBy}
                    >
                      <SelectTrigger className="flex-1 h-12 text-base pr-2 [&>svg]:right-2">
                        <SelectValue placeholder="Sort field" />
                      </SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                        {availableFields.map((f) => (
                          <SelectItem
                            key={f.id}
                            value={f.id}
                            className="text-base py-2.5"
                          >
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 shrink-0"
                      onClick={() =>
                        setSortOrder(
                          sortOrder === "asc" ? "desc" : "asc",
                        )
                      }
                      title={
                        sortOrder === "asc"
                          ? "Ascending"
                          : "Descending"
                      }
                    >
                      {sortOrder === "asc" ? (
                        <ArrowUpward className="w-5 h-5" />
                      ) : (
                        <ArrowDownward className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2.5">
                    {sortOrder === "asc"
                      ? "Ascending (A → Z, 0 → 9)"
                      : "Descending (Z → A, 9 → 0)"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Field Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    Select Fields to Include
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-base h-9 px-3"
                      onClick={() =>
                        setSelectedFields(
                          availableFields
                            .filter(
                              (f) =>
                                !f.sensitive ||
                                isManagerOrAbove,
                            )
                            .map((f) => f.id),
                        )
                      }
                    >
                      Select All
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-base h-9 px-3"
                      onClick={() =>
                        setSelectedFields(["assetId", "name"])
                      }
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableFields.map((field) => {
                    const isDisabled =
                      field.sensitive && !isManagerOrAbove;
                    return (
                      <div
                        key={field.id}
                        className="flex items-center gap-1 -ml-1"
                      >
                        <MuiCheckbox
                          id={field.id}
                          checked={selectedFields.includes(
                            field.id,
                          )}
                          disabled={isDisabled}
                          size="medium"
                          onChange={(e) => {
                            if (e.target.checked)
                              setSelectedFields([
                                ...selectedFields,
                                field.id,
                              ]);
                            else
                              setSelectedFields(
                                selectedFields.filter(
                                  (f) => f !== field.id,
                                ),
                              );
                          }}
                          sx={{
                            color: "var(--muted-foreground)",
                            "&.Mui-checked": {
                              color: "#b8e3e9",
                            },
                            "&.Mui-disabled": {
                              color: "var(--muted-foreground)",
                              opacity: 0.5,
                            },
                            padding: "6px",
                          }}
                        />
                        <label
                          htmlFor={field.id}
                          className={`text-base cursor-pointer select-none leading-tight ${isDisabled ? "text-muted-foreground cursor-not-allowed opacity-60" : ""}`}
                        >
                          {field.label}
                          {field.sensitive && (
                            <Lock className="w-3.5 h-3.5 inline ml-1 text-muted-foreground" />
                          )}
                        </label>
                      </div>
                    );
                  })}
                </div>
                {!isManagerOrAbove && (
                  <p className="text-sm text-muted-foreground mt-4">
                    * Fields marked with a lock require Manager
                    or Admin access
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Saved Queries Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  Saved Queries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedQueries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Save className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-base">
                      No saved queries yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedQueries.map((query) => (
                      <div
                        key={query.id}
                        className="p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <h4
                            className="text-base font-medium cursor-pointer hover:text-primary"
                            onClick={() =>
                              handleLoadQuery(query)
                            }
                          >
                            {query.name}
                          </h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                            onClick={() =>
                              handleDeleteQuery(query.id)
                            }
                            title="Delete query"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {query.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-sm"
                          >
                            {query.filters.length} filters
                          </Badge>
                          {query.groupBy &&
                            query.groupBy !== "none" && (
                              <Badge
                                variant="outline"
                                className="text-sm"
                              >
                                Group: {query.groupBy}
                              </Badge>
                            )}
                          {query.sortBy && (
                            <Badge
                              variant="outline"
                              className="text-sm"
                            >
                              Sort: {query.sortBy}{" "}
                              {query.sortOrder}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-base h-9 px-3"
                            onClick={() =>
                              handleLoadQuery(query)
                            }
                          >
                            Load Query
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {query.createdAt}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Query Sheet */}
        <Sheet
          open={showSaveQueryDialog}
          onOpenChange={setShowSaveQueryDialog}
        >
          <SheetContent
            side="right"
            className="!w-full sm:!max-w-xl flex flex-col overflow-hidden"
          >
            <SheetHeader className="pr-8">
              <SheetTitle className="text-xl">
                Save Query Template
              </SheetTitle>
              <SheetDescription className="text-base mt-1">
                Save the current filter, grouping, and sort
                configuration for reuse.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-6 mt-4">
              <div>
                <Label
                  htmlFor="queryName"
                  className="text-base font-medium"
                >
                  Query Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="queryName"
                  placeholder="e.g. High-Value IT Assets by Location"
                  value={saveQueryName}
                  onChange={(e) =>
                    setSaveQueryName(e.target.value)
                  }
                  className="mt-2 h-12 text-base"
                />
              </div>
              <div className="bg-muted/50 rounded-[4px] border p-5">
                <p className="text-base text-muted-foreground font-medium mb-3">
                  Current Query Configuration
                </p>
                <div className="space-y-2.5 text-base">
                  {[
                    {
                      label: "Filters",
                      value: `${customFilters.length} applied`,
                    },
                    {
                      label: "Fields",
                      value: `${selectedFields.length} selected`,
                    },
                    {
                      label: "Group By",
                      value:
                        groupBy === "none" ? "None" : groupBy,
                    },
                    {
                      label: "Sort",
                      value: `${availableFields.find((f) => f.id === sortBy)?.label || sortBy} (${sortOrder})`,
                    },
                  ].map((item, i, arr) => (
                    <React.Fragment key={item.label}>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {item.label}
                        </span>
                        <span className="font-medium">
                          {item.value}
                        </span>
                      </div>
                      {i < arr.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-[4px] border border-blue-200 dark:border-blue-800 p-4">
                <p className="text-base font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Tips
                </p>
                <ul className="space-y-1.5 text-base text-blue-700 dark:text-blue-400">
                  <li>
                    • Use a descriptive name to easily identify
                    the query later
                  </li>
                  <li>
                    • Saved queries store filters, fields,
                    grouping, and sort order
                  </li>
                  <li>
                    • Load a saved query anytime from the Saved
                    Queries panel
                  </li>
                </ul>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSaveQueryDialog(false)}
                  className="h-11 text-base"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveQuery}
                  className="h-11 text-base px-6"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Query
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Report Preview Dialog */}
        <Dialog
          open={showReportPreview}
          onOpenChange={setShowReportPreview}
        >
          <DialogContent className="w-[95vw] max-w-[1800px] h-[95vh] max-h-[95vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                <FileText className="w-6 h-6" />
                Custom Report Results
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                {reportResults.length} records found
                {groupBy !== "none" &&
                  ` — Grouped by ${availableFields.find((f) => f.id === groupBy)?.label || groupBy}`}
                {` — Sorted by ${availableFields.find((f) => f.id === sortBy)?.label || sortBy} (${sortOrder})`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-5">
              <div className="bg-muted/50 p-5 rounded-lg border">
                <p className="text-base font-medium mb-4">
                  Export or Share:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      format: "excel" as const,
                      label: "Export Excel",
                      icon: (
                        <FileSpreadsheet className="w-5 h-5" />
                      ),
                      variant: "default" as const,
                    },
                    {
                      format: "pdf" as const,
                      label: "Export PDF",
                      icon: <FileDown className="w-5 h-5" />,
                      variant: "outline" as const,
                    },
                    {
                      format: "csv" as const,
                      label: "Export CSV",
                      icon: <FileText className="w-5 h-5" />,
                      variant: "outline" as const,
                    },
                  ].map(({ format, label, icon, variant }) => (
                    <Button
                      key={format}
                      variant={variant}
                      onClick={() => handleExport(format)}
                      className="h-12 text-base gap-2"
                      size="lg"
                    >
                      {icon}
                      {label}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setShowShareDialog(true)}
                    className="h-12 text-base gap-2"
                    size="lg"
                  >
                    <Share className="w-5 h-5" />
                    Share
                  </Button>
                </div>
              </div>
              {renderResultsTable()}
              <div className="flex items-center justify-between pt-2">
                <p className="text-base text-muted-foreground">
                  Showing {reportResults.length} of{" "}
                  {reportResults.length} results
                </p>
                <div className="flex gap-3">
                  <Button
                    size="default"
                    variant="outline"
                    className="h-10 text-base"
                    disabled
                  >
                    Previous
                  </Button>
                  <Button
                    size="default"
                    variant="outline"
                    className="h-10 text-base"
                    disabled
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {renderShareDialog()}
        {renderExportDialog()}

        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title={
            deleteTarget?.type === "query"
              ? "Delete Saved Query"
              : "Delete Schedule"
          }
          description={`Are you sure you want to delete "${deleteTarget?.name || ""}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => {
            if (deleteTarget?.type === "query")
              confirmDeleteQuery(deleteTarget.id);
            else if (deleteTarget?.type === "schedule")
              confirmDeleteSchedule(deleteTarget.id);
            setDeleteTarget(null);
            setDeleteConfirmOpen(false);
          }}
        />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  //  SCHEDULED REPORTING VIEW
  // ══════════════════════════════════════════════════════════════

  if (viewMode === "scheduled") {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("dashboard")}
              className="mb-2 -ml-2 gap-1 text-base h-10"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-semibold">
              Scheduled Reports
            </h1>
            <p className="text-muted-foreground text-base mt-1.5">
              Automated recurring reports delivered via email
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {renderFieldOfficeFilter()}
            {!isAdmin && (
              <Badge
                variant="outline"
                className="text-sm text-yellow-600 px-3 py-1.5 gap-1.5"
              >
                <Lock className="w-4 h-4" />
                Admin access required to manage schedules
              </Badge>
            )}
            <Button
              disabled={!isAdmin}
              onClick={() => {
                setEditingSchedule(null);
                setScheduleForm({
                  name: "",
                  reportType: "asset-register-location",
                  frequency: "monthly",
                  recipients: "",
                  format: "excel",
                });
                setShowScheduleDrawer(true);
              }}
              className="h-11 text-base px-5"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Schedule
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              label: "Active Schedules",
              value: scheduledReports.filter((s) => s.enabled)
                .length,
              icon: (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ),
              bg: "bg-green-100 dark:bg-green-900/20",
            },
            {
              label: "Paused",
              value: scheduledReports.filter((s) => !s.enabled)
                .length,
              icon: (
                <Pause className="w-6 h-6 text-yellow-600" />
              ),
              bg: "bg-yellow-100 dark:bg-yellow-900/20",
            },
            {
              label: "Total Schedules",
              value: scheduledReports.length,
              icon: <Clock className="w-6 h-6 text-blue-600" />,
              bg: "bg-blue-100 dark:bg-blue-900/20",
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-base text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-semibold mt-1">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Schedules Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-muted-foreground" />
              All Scheduled Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scheduledReports.length === 0 ? (
              <div className="text-center py-14 text-muted-foreground">
                <Clock className="w-14 h-14 mx-auto mb-3 opacity-40" />
                <p className="text-base font-medium">
                  No scheduled reports yet
                </p>
                <p className="text-base mt-1">
                  Create a new schedule to automate report
                  delivery
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      {[
                        "Status",
                        "Schedule Name",
                        "Report Type",
                        "Frequency",
                        "Format",
                        "Recipients",
                        "Next Run",
                        "Last Run",
                        "Actions",
                      ].map((h) => (
                        <TableHead
                          key={h}
                          className="text-base font-semibold py-3.5"
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledReports.map((schedule) => (
                      <TableRow
                        key={schedule.id}
                        className="hover:bg-muted/30"
                      >
                        <TableCell className="py-4">
                          <Switch
                            checked={schedule.enabled}
                            onCheckedChange={() =>
                              handleToggleSchedule(schedule.id)
                            }
                            disabled={!isAdmin}
                          />
                        </TableCell>
                        <TableCell className="py-4">
                          <span
                            className={`text-base font-medium ${schedule.enabled ? "" : "text-muted-foreground"}`}
                          >
                            {schedule.name}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className="text-sm"
                          >
                            {predefinedReports.find(
                              (r) =>
                                r.id === schedule.reportType,
                            )?.name || schedule.reportType}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm">
                            {getFrequencyLabel(
                              schedule.frequency,
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-base font-medium uppercase">
                            {schedule.format}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1">
                            {schedule.recipients.map(
                              (email, i) => (
                                <span
                                  key={i}
                                  className="text-sm text-muted-foreground"
                                >
                                  {email}
                                </span>
                              ),
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-base">
                          {schedule.enabled
                            ? formatDate(schedule.nextRun)
                            : "—"}
                        </TableCell>
                        <TableCell className="py-4 text-base">
                          {schedule.lastRun
                            ? formatDate(schedule.lastRun)
                            : "—"}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9"
                              onClick={() =>
                                handleEditSchedule(schedule)
                              }
                              disabled={!isAdmin}
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() =>
                                handleDeleteSchedule(
                                  schedule.id,
                                )
                              }
                              disabled={!isAdmin}
                              title="Delete"
                            >
                              <DeleteIcon className="w-5 h-5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Schedule Sheet */}
        <Sheet
          open={showScheduleDrawer}
          onOpenChange={setShowScheduleDrawer}
        >
          <SheetContent
            side="right"
            className="!w-full sm:!max-w-xl flex flex-col overflow-hidden"
          >
            <SheetHeader className="pr-8">
              <SheetTitle className="text-xl">
                {editingSchedule
                  ? "Edit Schedule"
                  : "Create New Schedule"}
              </SheetTitle>
              <SheetDescription className="text-base mt-1">
                {editingSchedule
                  ? "Update the schedule configuration."
                  : "Set up automated report delivery via email. Fill in all required fields."}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-5 mt-4">
              {[
                {
                  id: "scheduleName",
                  label: "Schedule Name",
                  required: true,
                  content: (
                    <Input
                      id="scheduleName"
                      placeholder="e.g. Monthly Compliance Report"
                      value={scheduleForm.name}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          name: e.target.value,
                        })
                      }
                      className="h-12 text-base"
                    />
                  ),
                },
              ].map(({ id, label, required, content }) => (
                <div key={id}>
                  <Label
                    htmlFor={id}
                    className="text-base font-medium"
                  >
                    {label}{" "}
                    {required && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  <div className="mt-2">{content}</div>
                </div>
              ))}

              <div>
                <Label className="text-base font-medium">
                  Report Type{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={scheduleForm.reportType}
                  onValueChange={(val) =>
                    setScheduleForm({
                      ...scheduleForm,
                      reportType: val,
                    })
                  }
                >
                  <SelectTrigger className="mt-2 h-12 text-base pr-2 [&>svg]:right-2 pr-2 [&>svg]:right-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {predefinedReports.map((r) => (
                      <SelectItem
                        key={r.id}
                        value={r.id}
                        className="text-base py-2.5"
                      >
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Frequency{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={scheduleForm.frequency}
                  onValueChange={(val) =>
                    setScheduleForm({
                      ...scheduleForm,
                      frequency:
                        val as ScheduledReport["frequency"],
                    })
                  }
                >
                  <SelectTrigger className="mt-2 h-12 text-base pr-2 [&>svg]:right-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {[
                      { v: "daily", l: "Daily" },
                      { v: "weekly", l: "Weekly" },
                      { v: "monthly", l: "Monthly" },
                      { v: "quarterly", l: "Quarterly" },
                    ].map((opt) => (
                      <SelectItem
                        key={opt.v}
                        value={opt.v}
                        className="text-base py-2.5"
                      >
                        {opt.l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Export Format{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={scheduleForm.format}
                  onValueChange={(val) =>
                    setScheduleForm({
                      ...scheduleForm,
                      format: val as ScheduledReport["format"],
                    })
                  }
                >
                  <SelectTrigger className="mt-2 h-12 text-base pr-2 [&>svg]:right-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    {[
                      { v: "excel", l: "Excel (.xlsx)" },
                      { v: "pdf", l: "PDF" },
                      { v: "csv", l: "CSV" },
                    ].map((opt) => (
                      <SelectItem
                        key={opt.v}
                        value={opt.v}
                        className="text-base py-2.5"
                      >
                        {opt.l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Recipient Emails{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="email1@company.com, email2@company.com"
                  value={scheduleForm.recipients}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      recipients: e.target.value,
                    })
                  }
                  className="mt-2 h-12 text-base"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Separate multiple emails with commas
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-[4px] border border-blue-200 dark:border-blue-800 p-4">
                <p className="text-base font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Schedule Tips
                </p>
                <ul className="space-y-1.5 text-base text-blue-700 dark:text-blue-400">
                  <li>
                    • Reports are generated at midnight UTC on
                    the scheduled date
                  </li>
                  {scheduleForm.frequency && (
                    <li>
                      • Next delivery:{" "}
                      <strong>
                        {getNextRunDate(scheduleForm.frequency)}
                      </strong>
                    </li>
                  )}
                  <li>
                    • Disabled schedules can be re-enabled at
                    any time
                  </li>
                </ul>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowScheduleDrawer(false);
                    setEditingSchedule(null);
                  }}
                  className="h-11 text-base"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSchedule}
                  className="h-11 text-base px-6"
                >
                  {editingSchedule
                    ? "Update Schedule"
                    : "Create Schedule"}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {renderExportDialog()}

        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title={
            deleteTarget?.type === "query"
              ? "Delete Saved Query"
              : "Delete Schedule"
          }
          description={`Are you sure you want to delete "${deleteTarget?.name || ""}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => {
            if (deleteTarget?.type === "query")
              confirmDeleteQuery(deleteTarget.id);
            else if (deleteTarget?.type === "schedule")
              confirmDeleteSchedule(deleteTarget.id);
            setDeleteTarget(null);
            setDeleteConfirmOpen(false);
          }}
        />
      </div>
    );
  }

  return null;
}
