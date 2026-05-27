import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Download,
  Person as User,
  Description as FileText,
  Warning as AlertCircle,
  Close as X,
  Visibility as Eye,
  Security as Shield,
  ChevronLeft,
} from "@mui/icons-material";
import { toast } from "sonner";
import {
  TablePagination,
  paginateData,
} from "./shared/TablePagination";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const FIELD_TEXT = "text-[15px]";
const LABEL_CLS = "text-[14px] text-muted-foreground";
const ICON_CLS = "w-7 h-7 text-[#121321] dark:text-white";
const CARD_ICON =
  "w-14 h-14 rounded-xl bg-[#f7f7f8] dark:bg-[#f7f7f8]/10 flex items-center justify-center shrink-0";

// ─── Enums derived from DB schema ──────────────────────────────────────────────
const ENTITY_TYPES = [
  "Assets",
  "Users",
  "Categories",
  "Locations",
  "Reports",
] as const;
// event_type in DB; we surface CRUD labels to the user
const EVENT_TYPES = [
  "Create",
  "Update",
  "Delete",
] as const;

// ─── Interface mirrors audit_logs table ───────────────────────────────────────
interface AuditLog {
  id: string; // UUID
  entity_type: string; // VARCHAR(100)
  entity_id: string; // UUID
  event_type: string; // VARCHAR(120)  — CRUD action
  actor_id: string; // UUID
  actor_name: string; // VARCHAR(255)
  actor_role_at_time: string; // VARCHAR(100)
  timestamp: string; // TIMESTAMPTZ
  changes: Record<
    string,
    { from: unknown; to: unknown }
  > | null; // JSONB
  justification: { reason: string; context?: string } | null; // JSONB
  metadata: {
    // JSONB — session, ip, etc.
    ip_address?: string;
    session_id?: string;
    user_agent?: string;
  };
}

export default function ActionLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] =
    useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedLog, setSelectedLog] =
    useState<AuditLog | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data shaped exactly like rows from audit_logs
  const [logs] = useState<AuditLog[]>([
    {
      id: "a1b2c3d4-0002-0000-0000-000000000002",
      entity_type: "Assets",
      entity_id: "e1000002-0000-0000-0000-000000000002",
      event_type: "Create",
      actor_id: "ac000002-0000-0000-0000-000000000002",
      actor_name: "john.doe@chorus.com",
      actor_role_at_time: "SMIO",
      timestamp: "2026-02-26T14:28:15Z",
      changes: {
        asset_tag: { from: null, to: "LAP-001250" },
        model: { from: null, to: "Dell Latitude 5540" },
        sap_id: { from: null, to: "4000012345" },
      },
      justification: {
        reason: "New asset procurement",
        context: "Q1 2026 hardware refresh batch",
      },
      metadata: {
        ip_address: "192.168.1.105",
        session_id: "SES-4518",
      },
    },
    {
      id: "a1b2c3d4-0003-0000-0000-000000000003",
      entity_type: "Assets",
      entity_id: "e1000003-0000-0000-0000-000000000003",
      event_type: "Update",
      actor_id: "ac000003-0000-0000-0000-000000000003",
      actor_name: "jane.smith@chorus.com",
      actor_role_at_time: "Standard User",
      timestamp: "2026-02-26T14:25:00Z",
      changes: {
        location: { from: "HQ Floor 1", to: "Field Office B" },
        transfer_ref: { from: null, to: "TRF-2026-045" },
      },
      justification: {
        reason: "Inter-office asset transfer",
        context: "Field Office B expansion project",
      },
      metadata: {
        ip_address: "192.168.1.112",
        session_id: "SES-4515",
      },
    },
    {
      id: "a1b2c3d4-0004-0000-0000-000000000004",
      entity_type: "Users",
      entity_id: "e1000004-0000-0000-0000-000000000004",
      event_type: "Update",
      actor_id: "ac000001-0000-0000-0000-000000000001",
      actor_name: "admin@chorus.com",
      actor_role_at_time: "Administrator",
      timestamp: "2026-02-26T14:20:10Z",
      changes: {
        permissions: {
          from: ["inspection.view"],
          to: ["inspection.view", "inspection.approve"],
        },
      },
      justification: {
        reason: "Role permission update",
        context:
          "PDA Inspector role expanded per change request CR-2026-014",
      },
      metadata: {
        ip_address: "192.168.1.100",
        session_id: "SES-4521",
      },
    },
    {
      id: "a1b2c3d4-0005-0000-0000-000000000005",
      entity_type: "Assets",
      entity_id: "e1000005-0000-0000-0000-000000000005",
      event_type: "Delete",
      actor_id: "ac000005-0000-0000-0000-000000000005",
      actor_name: "bob.wilson@chorus.com",
      actor_role_at_time: "Approver",
      timestamp: "2026-02-26T14:15:33Z",
      changes: {
        status: { from: "Active", to: "Disposed" },
        disposal_ref: { from: null, to: "DSP-2026-012" },
      },
      justification: {
        reason: "Approved disposal — end of useful life",
        context:
          "8 assets, method: destruction, total value $12,450. Approved under policy POL-DSP-003",
      },
      metadata: {
        ip_address: "192.168.1.108",
        session_id: "SES-4510",
      },
    },
    {
      id: "a1b2c3d4-0006-0000-0000-000000000006",
      entity_type: "Assets",
      entity_id: "e1000006-0000-0000-0000-000000000006",
      event_type: "Update",
      actor_id: "ac000006-0000-0000-0000-000000000006",
      actor_name: "system",
      actor_role_at_time: "System",
      timestamp: "2026-02-26T14:10:05Z",
      changes: {
        synced_records: { from: 0, to: 156 },
        last_sync: {
          from: "2026-02-25T14:10:00Z",
          to: "2026-02-26T14:10:05Z",
        },
      },
      justification: {
        reason: "Scheduled SAP sync",
        context:
          "Automated nightly sync job SYNC-2026-089: 42 created, 114 updated, 0 failed",
      },
      metadata: { ip_address: "N/A", session_id: "N/A" },
    },
    {
      id: "a1b2c3d4-0008-0000-0000-000000000008",
      entity_type: "Users",
      entity_id: "e1000008-0000-0000-0000-000000000008",
      event_type: "Update",
      actor_id: "ac000001-0000-0000-0000-000000000001",
      actor_name: "admin@chorus.com",
      actor_role_at_time: "Administrator",
      timestamp: "2026-02-26T13:45:20Z",
      changes: {
        account_status: { from: "Active", to: "Locked" },
      },
      justification: {
        reason: "Security lockout",
        context:
          "Account david.lee@chorus.com locked after 5 consecutive failed login attempts",
      },
      metadata: {
        ip_address: "192.168.1.100",
        session_id: "SES-4521",
      },
    },
    {
      id: "a1b2c3d4-0009-0000-0000-000000000009",
      entity_type: "Assets",
      entity_id: "e1000009-0000-0000-0000-000000000009",
      event_type: "Update",
      actor_id: "ac000002-0000-0000-0000-000000000002",
      actor_name: "john.doe@chorus.com",
      actor_role_at_time: "SMIO",
      timestamp: "2026-02-26T13:30:00Z",
      changes: {
        lifecycle_status: {
          from: "In Use",
          to: "Under Verification",
        },
      },
      justification: {
        reason: "Annual audit",
        context:
          "Asset LAP-001234 pulled for physical verification per annual audit schedule AUD-2026-Q1",
      },
      metadata: {
        ip_address: "192.168.1.105",
        session_id: "SES-4518",
      },
    },
    {
      id: "a1b2c3d4-0011-0000-0000-000000000011",
      entity_type: "Assets",
      entity_id: "e1000011-0000-0000-0000-000000000011",
      event_type: "Update",
      actor_id: "ac000001-0000-0000-0000-000000000001",
      actor_name: "admin@chorus.com",
      actor_role_at_time: "Administrator",
      timestamp: "2026-02-26T12:55:00Z",
      changes: {
        lifecycle_status: { from: "Disposed", to: "Available" },
      },
      justification: {
        reason: "Admin override — data correction",
        context:
          "PRN-001236: Disposal recorded in error. Reverting to Available per helpdesk ticket HLP-2026-0892",
      },
      metadata: {
        ip_address: "192.168.1.100",
        session_id: "SES-4521",
      },
    },
    {
      id: "a1b2c3d4-0012-0000-0000-000000000012",
      entity_type: "Categories",
      entity_id: "e1000012-0000-0000-0000-000000000012",
      event_type: "Create",
      actor_id: "ac000001-0000-0000-0000-000000000001",
      actor_name: "admin@chorus.com",
      actor_role_at_time: "Administrator",
      timestamp: "2026-02-26T12:10:00Z",
      changes: {
        name: { from: null, to: "IT Hardware" },
        sub_categories: { from: null, to: 3 },
      },
      justification: {
        reason: "New asset category setup",
        context:
          "CAT-IT-HARDWARE created as part of asset taxonomy restructure project",
      },
      metadata: {
        ip_address: "192.168.1.100",
        session_id: "SES-4521",
      },
    },
    {
      id: "a1b2c3d4-0013-0000-0000-000000000013",
      entity_type: "Locations",
      entity_id: "e1000013-0000-0000-0000-000000000013",
      event_type: "Update",
      actor_id: "ac000003-0000-0000-0000-000000000003",
      actor_name: "jane.smith@chorus.com",
      actor_role_at_time: "Standard User",
      timestamp: "2026-02-26T11:50:00Z",
      changes: { capacity: { from: 80, to: 95 } },
      justification: {
        reason: "Capacity update after renovation",
        context:
          "LOC-HQ-FL2: HQ Floor 2 expanded following Q4 2025 refurbishment",
      },
      metadata: {
        ip_address: "192.168.1.112",
        session_id: "SES-4515",
      },
    },
  ]);

  // ── Filtering ─────────────────────────────────────────────────────────────────
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.event_type
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      log.actor_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      log.entity_type
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      log.entity_id
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (log.justification?.reason ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesEntity =
      entityFilter === "all" ||
      log.entity_type === entityFilter;
    const matchesEvent =
      eventFilter === "all" || log.event_type === eventFilter;
    const logDate = log.timestamp.slice(0, 10);
    const matchesFrom = !dateFrom || logDate >= dateFrom;
    const matchesTo = !dateTo || logDate <= dateTo;
    return (
      matchesSearch &&
      matchesEntity &&
      matchesEvent &&
      matchesFrom &&
      matchesTo
    );
  });

  const paginatedLogs = paginateData(
    filteredLogs,
    currentPage,
    rowsPerPage,
  );

  const hasActiveFilters =
    !!searchQuery ||
    entityFilter !== "all" ||
    eventFilter !== "all" ||
    !!dateFrom ||
    !!dateTo;

  const clearFilters = () => {
    setSearchQuery("");
    setEntityFilter("all");
    setEventFilter("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(0);
    toast.info("All filters cleared");
  };

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return {
      date: d.toISOString().slice(0, 10),
      time: d.toISOString().slice(11, 19), // no UTC suffix
    };
  };

  // ── Detail view ───────────────────────────────────────────────────────────────
  if (selectedLog) {
    const { date, time } = formatTimestamp(
      selectedLog.timestamp,
    );
    const changeKeys = selectedLog.changes
      ? Object.keys(selectedLog.changes)
      : [];

    const fmt = (v: unknown) => {
      if (v === null || v === undefined) return null;
      if (Array.isArray(v)) return v.join(", ");
      return String(v);
    };

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[14px]">
          <button
            onClick={() => setSelectedLog(null)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedLog(null)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Action Log
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium">
            Log Entry
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Main column ───────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-5">
            {/* ── Card 1: Who did what, when ─────────────────────────── */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={FIELD_TEXT}>
                    Log Entry Details
                  </CardTitle>
                  <Button
                    variant="outline"
                    className={`${FIELD_TEXT} h-10 px-4`}
                    onClick={() =>
                      toast.info("Exporting log entry…")
                    }
                  >
                    <Download className="w-4 h-4 mr-2" /> Export
                    Entry
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Actor identity row */}
                <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-md border">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-semibold ${FIELD_TEXT}`}
                    >
                      {selectedLog.actor_name}
                    </p>
                    <p className="text-[14px] text-muted-foreground">
                      {selectedLog.actor_role_at_time}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={`${FIELD_TEXT} font-medium tabular-nums`}
                    >
                      {date}
                    </p>
                    <p className="text-[14px] text-muted-foreground tabular-nums">
                      {time}
                    </p>
                  </div>
                </div>

                {/* Core event fields — mirrors table columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  <div>
                    <p className={LABEL_CLS}>Entity Type</p>
                    <Badge
                      variant="outline"
                      className="mt-1.5 text-[14px] px-2.5 py-1"
                    >
                      {selectedLog.entity_type}
                    </Badge>
                  </div>
                  <div>
                    <p className={LABEL_CLS}>
                      Action Performed
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-1.5 text-[14px] px-2.5 py-1"
                    >
                      {selectedLog.event_type}
                    </Badge>
                  </div>
                  <div>
                    <p className={LABEL_CLS}>IP Address</p>
                    <p
                      className={`mt-1.5 ${FIELD_TEXT} font-medium font-mono`}
                    >
                      192.168.1.100
                    </p>
                  </div>
                  <div>
                    <p className={LABEL_CLS}>Session</p>
                    <p
                      className={`mt-1.5 ${FIELD_TEXT} font-medium font-mono`}
                    >
                      SES-4521
                    </p>
                  </div>
                  {selectedLog.justification?.reason && (
                    <div className="sm:col-span-2">
                      <p className={LABEL_CLS}>Reason</p>
                      <p
                        className={`mt-1.5 ${FIELD_TEXT} font-medium`}
                      >
                        {selectedLog.justification.reason}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ── Card 2: What changed — rich before → after diff ────── */}
            {changeKeys.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className={FIELD_TEXT}>
                    What Changed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {changeKeys.map((key) => {
                      const { from, to } =
                        selectedLog.changes![key];
                      const fromVal = fmt(from);
                      const toVal = fmt(to);
                      const isNew = fromVal === null; // created — no previous value
                      const isRemoved = toVal === null; // cleared field

                      return (
                        <div
                          key={key}
                          className="rounded-md border overflow-hidden"
                        >
                          {/* Field name header */}
                          <div className="bg-muted/50 px-4 py-2 border-b">
                            <p
                              className={`${FIELD_TEXT} font-semibold capitalize`}
                            >
                              {key.replace(/_/g, " ")}
                            </p>
                          </div>

                          {isNew ? (
                            /* Create action — only show the new value */
                            <div className="px-4 py-3">
                              <p className="text-[13px] text-muted-foreground mb-1">
                                Set to
                              </p>
                              <p
                                className={`${FIELD_TEXT} font-medium`}
                              >
                                {toVal ?? "—"}
                              </p>
                            </div>
                          ) : (
                            /* Update / delete — show before → after side by side */
                            <div className="grid grid-cols-2 divide-x">
                              <div className="px-4 py-3">
                                <p className="text-[13px] text-muted-foreground mb-1.5">
                                  Before
                                </p>
                                <p
                                  className={`${FIELD_TEXT} font-medium ${isRemoved ? "" : "text-muted-foreground"}`}
                                >
                                  {fromVal ?? (
                                    <span className="italic text-[13px]">
                                      Not set
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className="px-4 py-3 bg-muted/20">
                                <p className="text-[13px] text-muted-foreground mb-1.5">
                                  After
                                </p>
                                <p
                                  className={`${FIELD_TEXT} font-semibold`}
                                >
                                  {toVal ?? (
                                    <span className="italic font-normal text-[13px]">
                                      Cleared
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── Card 3: Justification / context ────────────────────── */}
            {selectedLog.justification?.context && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className={FIELD_TEXT}>
                    Additional Context
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 border rounded-md px-4 py-3">
                    <p
                      className={`${FIELD_TEXT} leading-relaxed`}
                    >
                      {selectedLog.justification.context}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────────
  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Filters + Table card */}
        <Card>
          <CardHeader>
            {/* ── Single filter row ── */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search actor, entity, reason…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(0);
                  }}
                  className={`pl-9 ${FIELD_TEXT}`}
                />
              </div>

              {/* Entity Type */}
              <Select
                value={entityFilter}
                onValueChange={(v) => {
                  setEntityFilter(v);
                  setCurrentPage(0);
                }}
              >
                <SelectTrigger
                  className={`w-44 ${FIELD_TEXT} pr-2 [&>svg]:right-2`}
                >
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent className={FIELD_TEXT}>
                  <SelectItem
                    value="all"
                    className={FIELD_TEXT}
                  >
                    All Entity Types
                  </SelectItem>
                  {ENTITY_TYPES.map((e) => (
                    <SelectItem
                      key={e}
                      value={e}
                      className={FIELD_TEXT}
                    >
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Event / Action Type */}
              <Select
                value={eventFilter}
                onValueChange={(v) => {
                  setEventFilter(v);
                  setCurrentPage(0);
                }}
              >
                <SelectTrigger
                  className={`w-40 ${FIELD_TEXT} pr-2 [&>svg]:right-2`}
                >
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent className={FIELD_TEXT}>
                  <SelectItem
                    value="all"
                    className={FIELD_TEXT}
                  >
                    All Actions
                  </SelectItem>
                  {EVENT_TYPES.map((a) => (
                    <SelectItem
                      key={a}
                      value={a}
                      className={FIELD_TEXT}
                    >
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date From */}
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="date-from"
                  className="text-[14px] text-muted-foreground whitespace-nowrap"
                >
                  From
                </Label>
                <input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setCurrentPage(0);
                  }}
                  className={`h-10 rounded-md border border-input bg-background px-3 ${FIELD_TEXT} text-foreground focus:outline-none focus:ring-2 focus:ring-ring`}
                />
              </div>

              {/* Date To */}
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="date-to"
                  className="text-[14px] text-muted-foreground whitespace-nowrap"
                >
                  To
                </Label>
                <input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setCurrentPage(0);
                  }}
                  className={`h-10 rounded-md border border-input bg-background px-3 ${FIELD_TEXT} text-foreground focus:outline-none focus:ring-2 focus:ring-ring`}
                />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.info("Downloading logs in Excel…")
                    }
                    className="h-10 w-10"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download as Excel</p>
                </TooltipContent>
              </Tooltip>

              {/* Clear */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className={FIELD_TEXT}
                >
                  <X className="w-4 h-4 mr-1.5" /> Clear
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-[14px] text-muted-foreground mb-3">
              Showing {paginatedLogs.length} of{" "}
              {filteredLogs.length} entries
            </p>

            <div className="rounded-md border overflow-hidden">
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={FIELD_TEXT}>
                        Date & Time
                      </TableHead>
                      <TableHead className={FIELD_TEXT}>
                        Actor
                      </TableHead>
                      <TableHead className={FIELD_TEXT}>
                        Entity Type
                      </TableHead>
                      <TableHead className={FIELD_TEXT}>
                        Action
                      </TableHead>
                      <TableHead className={FIELD_TEXT}>
                        Reason
                      </TableHead>
                      <TableHead
                        className={`w-16 ${FIELD_TEXT}`}
                      >
                        View
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLogs.map((log) => {
                      const { date, time } = formatTimestamp(
                        log.timestamp,
                      );
                      return (
                        <TableRow
                          key={log.id}
                          className="cursor-pointer hover:bg-muted/40 transition-colors"
                          onClick={() => setSelectedLog(log)}
                        >
                          {/* Date & Time — no UTC suffix */}
                          <TableCell className="whitespace-nowrap">
                            <p
                              className={`${FIELD_TEXT} font-medium tabular-nums`}
                            >
                              {date}
                            </p>
                            <p className="text-[13px] text-muted-foreground tabular-nums">
                              {time}
                            </p>
                          </TableCell>

                          {/* Actor */}
                          <TableCell>
                            <p
                              className={`${FIELD_TEXT} font-medium`}
                            >
                              {log.actor_name}
                            </p>
                            <p className="text-[13px] text-muted-foreground">
                              {log.actor_role_at_time}
                            </p>
                          </TableCell>

                          {/* Entity Type */}
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-[13px] px-2.5 py-1"
                            >
                              {log.entity_type}
                            </Badge>
                          </TableCell>

                          {/* Action — plain badge, no icon */}
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-[13px] px-2.5 py-1"
                            >
                              {log.event_type}
                            </Badge>
                          </TableCell>

                          {/* Reason from justification */}
                          <TableCell className="max-w-[200px]">
                            <p
                              className={`${FIELD_TEXT} truncate text-muted-foreground`}
                            >
                              {log.justification?.reason ?? "—"}
                            </p>
                          </TableCell>

                          {/* View */}
                          <TableCell
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9 p-0"
                              onClick={() =>
                                setSelectedLog(log)
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {filteredLogs.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className={FIELD_TEXT}>
                    No log entries found
                  </p>
                </div>
              )}
            </div>

            <TablePagination
              totalItems={filteredLogs.length}
              page={currentPage}
              rowsPerPage={rowsPerPage}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={setRowsPerPage}
              totalUnfilteredItems={logs.length}
              itemLabel="entries"
            />
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
