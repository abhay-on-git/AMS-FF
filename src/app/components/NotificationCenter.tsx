// TODO: Delete after LegacyApp decommission
// Replaced by src/features/notifications/
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Notifications as Bell,
  Warning as AlertCircle,
  CheckCircle as CheckCircle2,
  Info,
  Search,
  Close,
  Check,
  Inventory2,
  SwapHoriz,
  AssignmentTurnedIn,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "info" | "warning" | "success";
  title: string;
  description: string;
  source:
    | "System"
    | "Assets"
    | "Transfers"
    | "Inspection"
    | "Inventory";
  timestamp: string;
  isRead: boolean;
}

export default function NotificationCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7days");

  const [notifications, setNotifications] = useState<
    Notification[]
  >([
    {
      id: "1",
      type: "warning",
      title: "Transfer Pending Approval",
      description:
        "Transfer request TR-045 from HQ-F1 to HQ-F2 needs your approval. Contains 12 assets worth $45,000.",
      source: "Transfers",
      timestamp: "2024-01-22 14:30",
      isRead: false,
    },
    {
      id: "2",
      type: "success",
      title: "Inspection Completed",
      description:
        "Inventory inspection INV-089 completed successfully. All 156 assets verified and accounted for.",
      source: "Inspection",
      timestamp: "2024-01-22 14:15",
      isRead: false,
    },
    {
      id: "3",
      type: "info",
      title: "New Assets Registered",
      description:
        '5 new assets added to category "Laptops" — Dell XPS 15 models with RFID tags assigned.',
      source: "Assets",
      timestamp: "2024-01-22 13:00",
      isRead: false,
    },
    {
      id: "4",
      type: "info",
      title: "SAP Sync Completed",
      description:
        "Successfully synced 234 records from SAP ERP. Assets: 156, Locations: 45, Categories: 33.",
      source: "System",
      timestamp: "2024-01-22 12:30",
      isRead: true,
    },
    {
      id: "5",
      type: "warning",
      title: "Asset Location Mismatch",
      description:
        "Asset EPC-001234 (MacBook Pro) found in HQ-F3 but expected in HQ-F1. Please verify the location.",
      source: "Inventory",
      timestamp: "2024-01-22 11:45",
      isRead: true,
    },
    {
      id: "6",
      type: "success",
      title: "Transfer Approved",
      description:
        "Transfer request TR-044 has been approved by the manager. Assets are ready for physical transfer.",
      source: "Transfers",
      timestamp: "2024-01-22 10:20",
      isRead: true,
    },
    {
      id: "7",
      type: "warning",
      title: "Inspection Overdue",
      description:
        "Location HQ-F2 is due for quarterly inspection. Last inspection was 95 days ago.",
      source: "Inspection",
      timestamp: "2024-01-22 09:00",
      isRead: true,
    },
    {
      id: "8",
      type: "info",
      title: "User Role Updated",
      description:
        "User john.doe@company.com role changed from Staff to Manager by admin.",
      source: "System",
      timestamp: "2024-01-21 16:30",
      isRead: true,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return (
          <AlertCircle className="w-6 h-6 text-[#121321] dark:text-white" />
        );
      case "success":
        return (
          <CheckCircle2 className="w-6 h-6 text-[#121321] dark:text-white" />
        );
      case "info":
      default:
        return (
          <Info className="w-6 h-6 text-[#121321] dark:text-white" />
        );
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "Assets":
        return (
          <Inventory2 className="w-4 h-4 text-[#121321] dark:text-white" />
        );
      case "Transfers":
        return (
          <SwapHoriz className="w-4 h-4 text-[#121321] dark:text-white" />
        );
      case "Inspection":
      case "Inventory":
        return (
          <AssignmentTurnedIn className="w-4 h-4 text-[#121321] dark:text-white" />
        );
      case "System":
      default:
        return (
          <SettingsIcon className="w-4 h-4 text-[#121321] dark:text-white" />
        );
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, isRead: true })),
    );
    toast.success("All notifications marked as read");
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    );
    toast.success("Notification marked as read");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setDateRange("7days");
    toast.success("Filters cleared");
  };

  const getFilteredNotifications = () => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        notification.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "unread" && !notification.isRead) ||
        (statusFilter === "read" && notification.isRead);
      const matchesType =
        typeFilter === "all" ||
        notification.source === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(
    (n) => !n.isRead,
  ).length;
  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    typeFilter !== "all";

  return (
    <div className="space-y-6">
      {/* ── Header Action ───────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-base text-muted-foreground">
          You have{" "}
          <span className="font-semibold text-[#121321] dark:text-white">
            {unreadCount} unread
          </span>{" "}
          notification{unreadCount !== 1 ? "s" : ""}
        </p>
        <Button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="text-base h-11 px-5"
        >
          <Check className="w-5 h-5 mr-2" />
          Mark All as Read
        </Button>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-muted-foreground font-medium">
                  Total Notifications
                </p>
                <p className="text-3xl font-bold mt-1">
                  {notifications.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-[#f7f7f8] dark:bg-[#f7f7f8]/10 rounded-xl flex items-center justify-center">
                <Bell className="w-7 h-7 text-[#121321] dark:text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-muted-foreground font-medium">
                  Unread
                </p>
                <p className="text-3xl font-bold mt-1 text-[#121321] dark:text-white">
                  {unreadCount}
                </p>
              </div>
              <div className="w-14 h-14 bg-[#f7f7f8] dark:bg-[#f7f7f8]/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-[#121321] dark:text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-muted-foreground font-medium">
                  Read
                </p>
                <p className="text-3xl font-bold mt-1 text-[#121321] dark:text-white">
                  {notifications.length - unreadCount}
                </p>
              </div>
              <div className="w-14 h-14 bg-[#f7f7f8] dark:bg-[#f7f7f8]/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-[#121321] dark:text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Filters + List ──────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-4">
          {/* Single row: search + all selects + clear */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11 text-base placeholder:text-base"
              />
            </div>

            <Select
              value={dateRange}
              onValueChange={setDateRange}
            >
              <SelectTrigger className="w-44 h-11 text-base pr-2 [&>svg]:right-2">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                <SelectItem
                  value="today"
                  className="text-base py-2.5"
                >
                  Today
                </SelectItem>
                <SelectItem
                  value="7days"
                  className="text-base py-2.5"
                >
                  Last 7 Days
                </SelectItem>
                <SelectItem
                  value="30days"
                  className="text-base py-2.5"
                >
                  Last 30 Days
                </SelectItem>
                <SelectItem
                  value="90days"
                  className="text-base py-2.5"
                >
                  Last 90 Days
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-44 h-11 text-base pr-2 [&>svg]:right-2">
                <SelectValue placeholder="Read Status" />
              </SelectTrigger>
              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                <SelectItem
                  value="all"
                  className="text-base py-2.5"
                >
                  All Notifications
                </SelectItem>
                <SelectItem
                  value="unread"
                  className="text-base py-2.5"
                >
                  Unread Only
                </SelectItem>
                <SelectItem
                  value="read"
                  className="text-base py-2.5"
                >
                  Read Only
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-44 h-11 text-base pr-2 [&>svg]:right-2">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                <SelectItem
                  value="all"
                  className="text-base py-2.5"
                >
                  All Categories
                </SelectItem>
                <SelectItem
                  value="System"
                  className="text-base py-2.5"
                >
                  System
                </SelectItem>
                <SelectItem
                  value="Assets"
                  className="text-base py-2.5"
                >
                  Assets
                </SelectItem>
                <SelectItem
                  value="Transfers"
                  className="text-base py-2.5"
                >
                  Transfers
                </SelectItem>
                <SelectItem
                  value="Inspection"
                  className="text-base py-2.5"
                >
                  Inspection
                </SelectItem>
                <SelectItem
                  value="Inventory"
                  className="text-base py-2.5"
                >
                  Inventory
                </SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="h-11 text-base px-4 shrink-0"
              >
                <Close className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Results count */}
          <p className="text-base text-muted-foreground mb-5">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredNotifications.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {notifications.length}
            </span>{" "}
            notifications
          </p>

          {/* Notification List */}
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative p-5 rounded-xl border transition-all ${
                  !notification.isRead
                    ? "bg-[#f7f7f8]/60 dark:bg-[#f7f7f8]/5 border-l-4 border-l-[#121321] dark:border-l-white border-border"
                    : "bg-white dark:bg-transparent border-border"
                }`}
              >
                <div className="flex gap-4">
                  {/* Type icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#f7f7f8] dark:bg-[#f7f7f8]/10 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h4
                      className={`text-[17px] font-semibold leading-snug mb-1.5 ${
                        !notification.isRead
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {notification.title}
                    </h4>

                    {/* Description */}
                    <p
                      className={`text-[15px] leading-relaxed mb-3 ${
                        !notification.isRead
                          ? "text-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {notification.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
                      
                      <span>·</span>
                      <span>{notification.timestamp}</span>
                    </div>
                  </div>

                  {/* Mark as read action */}
                  {!notification.isRead && (
                    <div className="flex-shrink-0 self-start">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleMarkAsRead(notification.id)
                        }
                        className="h-10 px-4 text-[13px] font-medium gap-1.5"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          Mark Read
                        </span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Bell className="w-16 h-16 mx-auto mb-5 opacity-30" />
              <p className="text-xl font-medium mb-1">
                No notifications found
              </p>
              <p className="text-base">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
