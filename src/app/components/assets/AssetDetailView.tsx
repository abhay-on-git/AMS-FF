import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { formatDate } from "../../utils/dateFormatter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Edit,
  Save,
  Close as X,
  ArrowBack,
  ChevronLeft,
  LocationOn as MapPin,
  Lock,
  LockOpen as Unlock,
  Router as Radio,
  ShowChart as Activity,
  Download as DownloadIcon,
  Person as PersonIcon,
  Business as OfficeIcon,
  Warning as AlertIcon,
  History as HistoryIcon,
  AttachMoney as MoneyIcon,
  Assignment as InspectionIcon,
  SwapHoriz as TransferIcon,
  Category as CategoryIcon,
  QrCode as BarcodeIcon,
  Build as BuildIcon,
  TrendingDown as TrendingDownIcon,
  AccessTime as TimerIcon,
  Verified as VerifiedIcon,
  Inventory as InventoryIcon,
  Timeline as TimelineIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  Info,
  ArrowForward,
  FiberManualRecord as DotIcon,
} from "@mui/icons-material";
import { Stepper, Step, StepLabel } from "@mui/material";
import { toast } from "sonner";
import {
  EnhancedAsset,
  AuditEvent,
  LifecycleEvent,
  UserRole,
  getStatusColor,
  getEventTypeColor,
  getConditionColor,
  daysSince,
  calculateAssetAge,
  mockAuditEvents,
  mockLifecycleEvents,
} from "./types";

interface AssetDetailViewProps {
  asset: EnhancedAsset;
  onBack: () => void;
  userRole?: UserRole;
}

type DetailTab = "overview" | "lifecycle" | "history";

export function AssetDetailView({
  asset,
  onBack,
  userRole = "admin",
}: AssetDetailViewProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] =
    useState<DetailTab>("overview");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(asset.notes || "");
  const [tempNotes, setTempNotes] = useState(asset.notes || "");
  const [historyFilter, setHistoryFilter] =
    useState<string>("all");

  // Quick Action sheet states
  const [showChangeStatus, setShowChangeStatus] =
    useState(false);
  const [targetStage, setTargetStage] = useState("");
  const [statusJustification, setStatusJustification] =
    useState("");

  const [showChangeLocation, setShowChangeLocation] =
    useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [newFieldOffice, setNewFieldOffice] = useState("");
  const [locationJustification, setLocationJustification] =
    useState("");

  const [showTransferAsset, setShowTransferAsset] =
    useState(false);
  const [transferDestination, setTransferDestination] =
    useState("");
  const [transferCustodian, setTransferCustodian] =
    useState("");
  const [transferJustification, setTransferJustification] =
    useState("");

  const [showEditAsset, setShowEditAsset] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: asset.name,
    type: asset.type,
    category: asset.category,
    serialNumber: asset.serialNumber,
    condition: asset.condition,
  });

  const currentStageTyped = (asset.lifecycleStage ||
    "active") as LifecycleStageType;
  const statusDaysInStage = daysSince(asset.lastStatusChange);

  const handleInitiateChangeStatus = () => {
    if (currentStageTyped === "disposed") {
      toast.error(
        "Disposed assets cannot be transitioned. Admin override required.",
      );
      return;
    }
    setTargetStage("");
    setStatusJustification("");
    setShowChangeStatus(true);
  };

  const handleSubmitChangeStatus = () => {
    if (!targetStage) {
      toast.error("Please select a target stage");
      return;
    }
    if (!statusJustification.trim()) {
      toast.error(
        "Justification is required for all status changes",
      );
      return;
    }
    toast.success(
      `Status transition request submitted: ${asset.assetId} → ${targetStage.replace("-", " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}`,
    );
    setShowChangeStatus(false);
  };

  const handleSubmitChangeLocation = () => {
    if (!newLocation.trim()) {
      toast.error("Please enter a new location");
      return;
    }
    if (!locationJustification.trim()) {
      toast.error("Justification is required");
      return;
    }
    toast.success(
      `Location change submitted: ${asset.assetId} → ${newLocation}`,
    );
    setShowChangeLocation(false);
    setNewLocation("");
    setNewFieldOffice("");
    setLocationJustification("");
  };

  const handleSubmitTransfer = () => {
    if (!transferDestination.trim()) {
      toast.error("Please select a destination");
      return;
    }
    if (!transferCustodian.trim()) {
      toast.error("Please enter a receiving custodian");
      return;
    }
    if (!transferJustification.trim()) {
      toast.error("Justification is required");
      return;
    }
    toast.success(
      `Transfer request submitted: ${asset.assetId} → ${transferDestination}`,
    );
    setShowTransferAsset(false);
    setTransferDestination("");
    setTransferCustodian("");
    setTransferJustification("");
  };

  const handleLockAsset = () => {
    toast.success(
      `Asset ${asset.assetId} has been locked. No modifications allowed until unlocked.`,
    );
  };

  const handleUnlockAsset = () => {
    toast.success(`Asset ${asset.assetId} has been unlocked.`);
  };

  const handleOpenEditAsset = () => {
    setEditFormData({
      name: asset.name,
      type: asset.type,
      category: asset.category,
      serialNumber: asset.serialNumber,
      condition: asset.condition,
    });
    setShowEditAsset(true);
  };

  const handleSubmitEditAsset = () => {
    if (!editFormData.name.trim()) {
      toast.error("Asset name is required");
      return;
    }
    if (!editFormData.type.trim()) {
      toast.error("Asset type is required");
      return;
    }
    toast.success(
      `Asset ${asset.assetId} updated successfully`,
    );
    setShowEditAsset(false);
  };

  const quickActionHandlers = {
    onChangeLocation: () => {
      setNewLocation("");
      setNewFieldOffice("");
      setLocationJustification("");
      setShowChangeLocation(true);
    },
    onUpdateStatus: handleInitiateChangeStatus,
    onTransferAsset: () => {
      setTransferDestination("");
      setTransferCustodian("");
      setTransferJustification("");
      setShowTransferAsset(true);
    },
    onLock: handleLockAsset,
    onUnlock: handleUnlockAsset,
  };

  const statusDays = daysSince(asset.lastStatusChange);
  const totalEvents = mockAuditEvents.length;

  const handleSaveNotes = () => {
    setNotes(tempNotes);
    setIsEditingNotes(false);
    toast.success("Notes updated successfully");
  };

  const handleCancelNotes = () => {
    setTempNotes(notes);
    setIsEditingNotes(false);
  };

  const filteredHistory =
    historyFilter === "all"
      ? mockAuditEvents
      : mockAuditEvents.filter(
          (e) => e.eventType === historyFilter,
        );

  const tabs: { key: DetailTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "lifecycle", label: "Lifecycle" },
    { key: "history", label: "History & Audit" },
  ];

  return (
    <div className="space-y-5 min-w-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[15px] mb-2">
            <button
              onClick={onBack}
              className="text-muted-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onBack}
              className="text-muted-foreground transition-colors"
            >
              Assets
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">
              {asset.assetId}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{asset.name}</h2>

            {asset.isLocked && (
              <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700 text-md">
                <Lock className="w-3 h-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {userRole !== "auditor" &&
            userRole !== "senior_management" && (
              <Button
                variant="outline"
                className="gap-1.5 text-[15px]"
                onClick={handleOpenEditAsset}
              >
                <Edit className="w-4 h-4" /> Edit
              </Button>
            )}
        </div>
      </div>

      {/* ── Lock Banner ── */}
      {asset.isLocked && asset.activeSurveyCaseId && (
        <Alert className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-900/10">
          <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="flex items-center justify-between text-amber-900 dark:text-amber-100">
            <div>
              <p className="font-medium">
                Asset Locked —{" "}
                {asset.lockReason ||
                  "Active survey case in progress"}
              </p>
              <p className="text-md text-amber-700 dark:text-amber-300 mt-1">
                Survey Case:{" "}
                <span className="font-['Manrope']">
                  {asset.activeSurveyCaseId}
                </span>{" "}
                · No modifications permitted until the case is
                resolved.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-amber-700800 dark:text-amber-300"
              onClick={() => {
                window.location.hash = "assets";
                setTimeout(() => {
                  const surveysTab = document.querySelector(
                    '[data-tab="surveys"]',
                  );
                  if (surveysTab)
                    (surveysTab as HTMLElement).click();
                }, 100);
              }}
            >
              View Survey Case
              <ArrowForward className="w-3.5 h-3.5" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-[4px] text-[15px] transition-colors ${
              activeTab === tab.key
                ? "bg-[#121321] text-white shadow-sm"
                : "text-[#121321][#121321]/5 dark:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab
          asset={asset}
          notes={notes}
          tempNotes={tempNotes}
          setTempNotes={setTempNotes}
          isEditingNotes={isEditingNotes}
          setIsEditingNotes={setIsEditingNotes}
          handleSaveNotes={handleSaveNotes}
          handleCancelNotes={handleCancelNotes}
          statusDays={statusDays}
          onBack={onBack}
          userRole={userRole}
          quickActions={quickActionHandlers}
        />
      )}
      {activeTab === "lifecycle" && (
        <LifecycleTab
          asset={asset}
          events={mockLifecycleEvents}
          userRole={userRole}
          onChangeStatus={handleInitiateChangeStatus}
        />
      )}
      {activeTab === "history" && (
        <HistoryTab
          events={filteredHistory}
          filter={historyFilter}
          onFilterChange={setHistoryFilter}
        />
      )}

      {/* ═══════ SHARED SHEET DRAWERS ═══════ */}

      {/* Change Status Sheet */}
      <Sheet
        open={showChangeStatus}
        onOpenChange={setShowChangeStatus}
      >
        <SheetContent
          side="right"
          className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0"
        >
          <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
            <SheetTitle className="text-[15px] flex items-center gap-2">
              <TransferIcon className="w-5 h-5" />
              Change Asset Status
            </SheetTitle>
            <SheetDescription className="text-[14px]">
              Submit a status transition request. Changes will
              be routed for approval based on your role.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="rounded-[4px] border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-md text-muted-foreground">
                    Asset
                  </p>
                  <p className="font-['Manrope'] font-medium">
                    {asset.assetId}
                  </p>
                </div>
                {currentStageTyped === "disposed" && (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </Badge>
                )}
              </div>
              <p className="text-[15px]">{asset.name}</p>
              <div className="grid grid-cols-2 gap-3 text-[15px]">
                <div>
                  <p className="text-md text-muted-foreground">
                    Type
                  </p>
                  <p>{asset.type}</p>
                </div>
                <div>
                  <p className="text-md text-muted-foreground">
                    Location
                  </p>
                  <p>{asset.location}</p>
                </div>
                <div>
                  <p className="text-md text-muted-foreground">
                    Custodian
                  </p>
                  <p>{asset.responsiblePerson}</p>
                </div>
                <div>
                  <p className="text-md text-muted-foreground">
                    Days in Status
                  </p>
                  <p
                    className={
                      statusDaysInStage > 30
                        ? "text-yellow-600 font-medium"
                        : ""
                    }
                  >
                    {statusDaysInStage} days
                  </p>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-[15px] font-medium mb-2 block">
                Current Stage
              </Label>
              <div className="flex items-center gap-3 p-3 rounded-[4px] border bg-muted/20">
                <DotIcon
                  className={`w-3 h-3 ${
                    currentStageTyped === "active"
                      ? "text-green-500"
                      : currentStageTyped === "disposed"
                        ? "text-red-500"
                        : currentStageTyped === "maintenance"
                          ? "text-orange-500"
                          : currentStageTyped ===
                              "pending-disposal"
                            ? "text-amber-500"
                            : currentStageTyped === "survey"
                              ? "text-purple-500"
                              : "text-blue-500"
                  }`}
                />
                <Badge
                  className={getLifecycleStageColor(
                    currentStageTyped,
                  )}
                >
                  {formatLifecycleStage(currentStageTyped)}
                </Badge>
                <span className="text-md text-muted-foreground ml-auto">
                  Since {formatDate(asset.lastStatusChange)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                New Stage{" "}
                <span className="text-destructive">*</span>
              </Label>
              {lifecycleValidTransitions[currentStageTyped] &&
              lifecycleValidTransitions[currentStageTyped]
                .length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {lifecycleValidTransitions[
                    currentStageTyped
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTargetStage(s)}
                      className={`p-3 rounded-[4px] border text-left transition-all ${
                        targetStage === s
                          ? "border-[#121321] bg-[#121321]/5 dark:border-[#81CCD7] dark:bg-[#81CCD7]/10"
                          : "border-border[#121321]/40 dark:[#81CCD7]/40"
                      }`}
                    >
                      <Badge
                        className={`${getLifecycleStageColor(s)} pointer-events-none`}
                      >
                        {formatLifecycleStage(s)}
                      </Badge>
                    </button>
                  ))}
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertIcon className="h-4 w-4" />
                  <AlertDescription>
                    No valid transitions from this stage. Admin
                    override required.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            {targetStage && (
              <div className="flex items-center justify-center gap-3 py-2">
                <Badge
                  className={getLifecycleStageColor(
                    currentStageTyped,
                  )}
                >
                  {formatLifecycleStage(currentStageTyped)}
                </Badge>
                <ArrowForward className="w-4 h-4 text-muted-foreground" />
                <Badge
                  className={getLifecycleStageColor(
                    targetStage,
                  )}
                >
                  {formatLifecycleStage(targetStage)}
                </Badge>
              </div>
            )}
            <Separator />
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Justification{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={statusJustification}
                onChange={(e) =>
                  setStatusJustification(e.target.value)
                }
                placeholder="Provide reason for status change..."
                rows={4}
                className="text-[15px] placeholder:text-[14px]"
              />
              <p className="text-[14px] text-muted-foreground">
                This will be recorded in the audit trail and
                visible to approvers.
              </p>
            </div>
            {targetStage === "disposed" && (
              <Alert variant="destructive">
                <AlertIcon className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-medium">
                    Terminal State:
                  </span>{" "}
                  The asset will be permanently locked after
                  disposal. This action cannot be reversed
                  without an admin override.
                </AlertDescription>
              </Alert>
            )}
            {targetStage === "pending-disposal" && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This asset will be flagged for disposal
                  processing. A disposal request should be
                  created after approval.
                </AlertDescription>
              </Alert>
            )}
            {targetStage === "maintenance" && (
              <Alert>
                <AlertIcon className="h-4 w-4" />
                <AlertDescription>
                  Assets under maintenance are restricted from
                  transfers and assignments until status is
                  resolved.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="border-t px-6 py-4 shrink-0 bg-background">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowChangeStatus(false)}
                className="text-[15px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitChangeStatus}
                disabled={
                  !targetStage || !statusJustification.trim()
                }
                className="text-[15px]"
              >
                <TransferIcon className="w-4 h-4 mr-2" />
                Submit for Approval
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Change Location Sheet */}
      <Sheet
        open={showChangeLocation}
        onOpenChange={setShowChangeLocation}
      >
        <SheetContent
          side="right"
          className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0"
        >
          <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
            <SheetTitle className="text-[15px] flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Change Location
            </SheetTitle>
            <SheetDescription className="text-[14px]">
              Update the physical location and field office
              assignment for this asset.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="rounded-[4px] border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-md text-muted-foreground">
                    Asset
                  </p>
                  <p className="font-['Manrope'] font-medium">
                    {asset.assetId}
                  </p>
                </div>
              </div>
              <p className="text-[15px]">{asset.name}</p>
              <div className="grid grid-cols-2 gap-3 text-[15px]">
                <div>
                  <p className="text-md text-muted-foreground">
                    Current Location
                  </p>
                  <p className="font-medium">
                    {asset.location}
                  </p>
                </div>
                <div>
                  <p className="text-md text-muted-foreground">
                    Current Field Office
                  </p>
                  <p className="font-medium">
                    {asset.fieldOffice}
                  </p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                New Location{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={newLocation}
                onValueChange={setNewLocation}
              >
                <SelectTrigger className="h-[52px] text-[15px]">
                  <SelectValue placeholder="Select new location" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="Warehouse A — Building 1">
                    Warehouse A — Building 1
                  </SelectItem>
                  <SelectItem value="Warehouse B — Building 2">
                    Warehouse B — Building 2
                  </SelectItem>
                  <SelectItem value="Server Room — Floor 3">
                    Server Room — Floor 3
                  </SelectItem>
                  <SelectItem value="Main Office — Floor 1">
                    Main Office — Floor 1
                  </SelectItem>
                  <SelectItem value="Field Station — Remote">
                    Field Station — Remote
                  </SelectItem>
                  <SelectItem value="Storage Unit — Offsite">
                    Storage Unit — Offsite
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Field Office
              </Label>
              <Select
                value={newFieldOffice}
                onValueChange={setNewFieldOffice}
              >
                <SelectTrigger className="h-[52px] text-[15px]">
                  <SelectValue placeholder="Select field office (optional)" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="Phnom Penh HQ">
                    Phnom Penh HQ
                  </SelectItem>
                  <SelectItem value="Siem Reap">
                    Siem Reap
                  </SelectItem>
                  <SelectItem value="Battambang">
                    Battambang
                  </SelectItem>
                  <SelectItem value="Kampong Cham">
                    Kampong Cham
                  </SelectItem>
                  <SelectItem value="Sihanoukville">
                    Sihanoukville
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Justification{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={locationJustification}
                onChange={(e) =>
                  setLocationJustification(e.target.value)
                }
                placeholder="Provide reason for location change..."
                rows={3}
                className="text-[15px] placeholder:text-[14px]"
              />
            </div>
          </div>
          <div className="border-t px-6 py-4 shrink-0 bg-background">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowChangeLocation(false)}
                className="text-[15px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitChangeLocation}
                disabled={
                  !newLocation || !locationJustification.trim()
                }
                className="text-[15px]"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Update Location
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Transfer Asset Sheet */}
      <Sheet
        open={showTransferAsset}
        onOpenChange={setShowTransferAsset}
      >
        <SheetContent
          side="right"
          className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0"
        >
          <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
            <SheetTitle className="text-[15px] flex items-center gap-2">
              <TransferIcon className="w-5 h-5" />
              Transfer Asset
            </SheetTitle>
            <SheetDescription className="text-[14px]">
              Initiate an asset transfer to a different office,
              location, or custodian.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="rounded-[4px] border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-md text-muted-foreground">
                    Asset
                  </p>
                  <p className="font-['Manrope'] font-medium">
                    {asset.assetId}
                  </p>
                </div>
                <Badge className={getStatusColor(asset.status)}>
                  {asset.status.charAt(0).toUpperCase() +
                    asset.status.slice(1)}
                </Badge>
              </div>
              <p className="text-[15px]">{asset.name}</p>
              <div className="grid grid-cols-2 gap-3 text-[15px]">
                <div>
                  <p className="text-md text-muted-foreground">
                    Current Location
                  </p>
                  <p>{asset.location}</p>
                </div>
                <div>
                  <p className="text-md text-muted-foreground">
                    Current Custodian
                  </p>
                  <p>{asset.responsiblePerson}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Destination Office{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={transferDestination}
                onValueChange={setTransferDestination}
              >
                <SelectTrigger className="h-[52px] text-[15px]">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="Phnom Penh HQ">
                    Phnom Penh HQ
                  </SelectItem>
                  <SelectItem value="Siem Reap Office">
                    Siem Reap Office
                  </SelectItem>
                  <SelectItem value="Battambang Office">
                    Battambang Office
                  </SelectItem>
                  <SelectItem value="Kampong Cham Office">
                    Kampong Cham Office
                  </SelectItem>
                  <SelectItem value="Sihanoukville Office">
                    Sihanoukville Office
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Receiving Custodian{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={transferCustodian}
                onValueChange={setTransferCustodian}
              >
                <SelectTrigger className="h-[52px] text-[15px]">
                  <SelectValue placeholder="Select custodian" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="Nguyen Van A">
                    Nguyen Van A
                  </SelectItem>
                  <SelectItem value="Tran Thi B">
                    Tran Thi B
                  </SelectItem>
                  <SelectItem value="Le Van C">
                    Le Van C
                  </SelectItem>
                  <SelectItem value="Pham Thi D">
                    Pham Thi D
                  </SelectItem>
                  <SelectItem value="Hoang Van E">
                    Hoang Van E
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Transfer Justification{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={transferJustification}
                onChange={(e) =>
                  setTransferJustification(e.target.value)
                }
                placeholder="Reason for transfer (e.g., operational reallocation, project reassignment)..."
                rows={4}
                className="text-[15px] placeholder:text-[14px]"
              />
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The asset status will change to{" "}
                <span className="font-medium">In Transit</span>{" "}
                until the receiving office confirms receipt.
              </AlertDescription>
            </Alert>
          </div>
          <div className="border-t px-6 py-4 shrink-0 bg-background">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowTransferAsset(false)}
                className="text-[15px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitTransfer}
                disabled={
                  !transferDestination ||
                  !transferCustodian ||
                  !transferJustification.trim()
                }
                className="text-[15px]"
              >
                <TransferIcon className="w-4 h-4 mr-2" />
                Submit Transfer
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Asset Sheet */}
      <Sheet
        open={showEditAsset}
        onOpenChange={setShowEditAsset}
      >
        <SheetContent
          side="right"
          className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0"
        >
          <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
            <SheetTitle className="text-[15px] flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Asset
            </SheetTitle>
            <SheetDescription className="text-[14px]">
              Update asset information and details.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="rounded-[4px] border bg-muted/30 p-4 space-y-2">
              <div>
                <p className="text-md text-muted-foreground">
                  Asset ID
                </p>
                <p className="font-['Manrope'] font-medium">
                  {asset.assetId}
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Asset Name{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    name: e.target.value,
                  })
                }
                placeholder="Enter asset name"
                className="h-[52px] text-[15px] placeholder:text-[14px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={editFormData.type}
                onValueChange={(value) =>
                  setEditFormData({
                    ...editFormData,
                    type: value,
                  })
                }
              >
                <SelectTrigger className="h-[52px] text-[15px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="Equipment">
                    Equipment
                  </SelectItem>
                  <SelectItem value="Vehicle">
                    Vehicle
                  </SelectItem>
                  <SelectItem value="Furniture">
                    Furniture
                  </SelectItem>
                  <SelectItem value="IT Hardware">
                    IT Hardware
                  </SelectItem>
                  <SelectItem value="Tools">Tools</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Category
              </Label>
              <Input
                value={editFormData.category}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    category: e.target.value,
                  })
                }
                placeholder="Enter category"
                className="h-[52px] text-[15px] placeholder:text-[14px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Serial Number
              </Label>
              <Input
                value={editFormData.serialNumber}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    serialNumber: e.target.value,
                  })
                }
                placeholder="Enter serial number"
                className="font-['Manrope'] h-[52px] text-[15px] placeholder:text-[14px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Condition
              </Label>
              <Select
                value={editFormData.condition}
                onValueChange={(value) =>
                  setEditFormData({
                    ...editFormData,
                    condition: value,
                  })
                }
              >
                <SelectTrigger className="h-[52px] text-[15px]">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="excellent">
                    Excellent
                  </SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="damaged">
                    Damaged
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Changes will be recorded in the audit trail for
                compliance tracking.
              </AlertDescription>
            </Alert>
          </div>
          <div className="border-t px-6 py-4 shrink-0 bg-background">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowEditAsset(false)}
                className="text-[15px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitEditAsset}
                className="text-[15px]"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ══════════════════════════════════════════
// HELPER: Detail Row
// ══════════════════════════════════════════
function DetailRow({
  label,
  value,
  mono,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      {icon && (
        <div className="mt-0.5 text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <Label className="text-muted-foreground text-md">
          {label}
        </Label>
        <p
          className={`mt-0.5 ${mono ? "font-['Manrope'] text-[15px]" : ""}`}
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// TAB 1 – Overview (Reorganized)
// ══════════════════════════════════════════
function OverviewTab({
  asset,
  notes,
  tempNotes,
  setTempNotes,
  isEditingNotes,
  setIsEditingNotes,
  handleSaveNotes,
  handleCancelNotes,
  statusDays,
  onBack,
  userRole,
  quickActions,
}: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        {/* ── Identification & Classification ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Identification & Classification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="space-y-1 pb-4 md:pb-0 md:pr-8">
                <DetailRow
                  label="Asset ID"
                  value={asset.assetId}
                  mono
                />
                <DetailRow
                  label="Serial Number"
                  value={asset.serialNumber}
                  mono
                />
                <DetailRow
                  label="EPC (Electronic Product Code)"
                  value={
                    <span className="font-['Manrope'] text-md break-all">
                      {asset.epc}
                    </span>
                  }
                />
                <DetailRow
                  label="Barcode"
                  value={asset.barcode}
                  mono
                />
              </div>
              <div className="space-y-1 pt-4 md:pt-0 md:pl-8">
                <DetailRow label="Type" value={asset.type} />
                <DetailRow
                  label="Category"
                  value={asset.category}
                />
                <DetailRow label="Owner" value={asset.owner} />
                <DetailRow
                  label="Registration Date"
                  value={formatDate(asset.createdDate)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Assignment & Location ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Assignment & Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PersonIcon className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-muted-foreground text-md">
                    Custodian
                  </Label>
                </div>
                <p className="font-medium">
                  {asset.responsiblePerson}
                </p>
                <p className="text-md text-muted-foreground mt-1">
                  Since {formatDate(asset.lastCustodianChange)}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-muted-foreground text-md">
                    Location
                  </Label>
                </div>
                <p className="font-medium">{asset.location}</p>
                <p className="text-md text-muted-foreground mt-1">
                  Updated {formatDate(asset.lastLocationUpdate)}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <OfficeIcon className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-muted-foreground text-md">
                    Field Office
                  </Label>
                </div>
                <p className="font-medium">
                  {asset.fieldOffice}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── RFID Tag Information ── */}
        {asset.rfidHealth !== undefined && null}

        {/* ── Notes ── */}
        <Card className="h-[278px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notes</CardTitle>
              {!isEditingNotes && userRole !== "auditor" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingNotes(true)}
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingNotes ? (
              <div className="space-y-3">
                <Textarea
                  value={tempNotes}
                  onChange={(e: any) =>
                    setTempNotes(e.target.value)
                  }
                  placeholder="Add notes about this asset..."
                  rows={4}
                  className="min-h-[160px] max-h-[300px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveNotes}>
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelNotes}
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="min-h-[3rem] flex items-center">
                {notes ? (
                  <p className="text-[15px] leading-relaxed">
                    {notes}
                  </p>
                ) : (
                  <p className="text-[15px] text-muted-foreground italic">
                    No notes available.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Right Sidebar ── */}
      <div className="space-y-5">
        {/* Status Monitor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Status Monitor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-muted-foreground">
                Current Status
              </span>
              <Badge className={getStatusColor(asset.status)}>
                {asset.status.charAt(0).toUpperCase() +
                  asset.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-muted-foreground">
                Condition
              </span>
              <Badge
                className={getConditionColor(asset.condition)}
              >
                {asset.condition.charAt(0).toUpperCase() +
                  asset.condition.slice(1)}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-2 text-[15px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Last Status Change
                </span>
                <span>
                  {formatDate(asset.lastStatusChange)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lifecycle Summary (compact) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Lifecycle Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-[15px]">
              {asset.maintenanceCount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Maintenance Cycles
                  </span>
                  <span className="font-medium">
                    {asset.maintenanceCount}
                  </span>
                </div>
              )}
              {asset.transferCount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Transfers
                  </span>
                  <span className="font-medium">
                    {asset.transferCount}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {userRole !== "auditor" &&
          userRole !== "senior_management" && (
            <Card className="hidden">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  size="sm"
                  onClick={quickActions?.onChangeLocation}
                >
                  <MapPin className="w-4 h-4 mr-2" /> Change
                  Location
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  size="sm"
                  onClick={quickActions?.onUpdateStatus}
                >
                  <Edit className="w-4 h-4 mr-2" /> Update
                  Status
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  size="sm"
                  onClick={quickActions?.onTransferAsset}
                >
                  <TransferIcon className="w-4 h-4 mr-2" />{" "}
                  Transfer Asset
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="justify-start"
                    variant="outline"
                    size="sm"
                    onClick={quickActions?.onLock}
                  >
                    <Lock className="w-4 h-4 mr-2" /> Lock
                  </Button>
                  <Button
                    className="justify-start"
                    variant="outline"
                    size="sm"
                    onClick={quickActions?.onUnlock}
                  >
                    <Unlock className="w-4 h-4 mr-2" /> Unlock
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Financial Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Financial Reference
            </CardTitle>
            <p className="text-md text-muted-foreground">
              Read-only financial data from procurement records
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-md">
                    PO Number
                  </Label>
                  <p className="font-['Manrope'] font-medium text-md">
                    {asset.poNumber || "—"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-md">
                    GRN Number
                  </Label>
                  <p className="font-['Manrope'] font-medium">
                    {asset.grnNumber || "—"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-md">
                    Acquisition Date
                  </Label>
                  <p>
                    {asset.acquisitionDate
                      ? formatDate(asset.acquisitionDate)
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-md">
                    Acquisition Value
                  </Label>
                  <p className="font-medium text-lg">
                    {asset.acquisitionValue !== undefined
                      ? `${asset.currency || "USD"} ${asset.acquisitionValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : "—"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-md">
                    Currency
                  </Label>
                  <p>{asset.currency || "—"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-md">
                    Net Book Value (NBV)
                  </Label>
                  <p className="font-medium text-lg">
                    {asset.nbv !== undefined
                      ? `${asset.currency || "USD"} ${asset.nbv.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// TAB 2 – Lifecycle
// ══════════════════════════════════════════

type LifecycleStageType =
  | "registered"
  | "active"
  | "maintenance"
  | "survey"
  | "pending-disposal"
  | "disposed";

// Canonical lifecycle path for the MUI Stepper
const lifecycleSteps: LifecycleStageType[] = [
  "registered",
  "active",
  "maintenance",
  "survey",
  "pending-disposal",
  "disposed",
];

// Valid lifecycle stage transitions
const lifecycleValidTransitions: Record<
  LifecycleStageType,
  LifecycleStageType[]
> = {
  registered: ["active"],
  active: ["maintenance", "survey", "pending-disposal"],
  maintenance: ["active", "survey", "pending-disposal"],
  survey: ["active", "maintenance", "pending-disposal"],
  "pending-disposal": ["disposed"],
  disposed: [],
};

function getLifecycleStepperHex(
  stage: LifecycleStageType,
): string {
  const hexColors: Record<LifecycleStageType, string> = {
    registered: "#3b82f6",
    active: "#22c55e",
    maintenance: "#f97316",
    survey: "#a855f7",
    "pending-disposal": "#f59e0b",
    disposed: "#ef4444",
  };
  return hexColors[stage];
}

// Mock lifecycle stage history per asset
function getLifecycleStageHistory(
  asset: EnhancedAsset,
): { stage: LifecycleStageType; date: string }[] {
  const currentStage = (asset.lifecycleStage ||
    "active") as LifecycleStageType;
  const currentIdx = lifecycleSteps.indexOf(currentStage);
  return lifecycleSteps
    .slice(0, currentIdx + 1)
    .map((stage, idx) => {
      const baseDate = new Date(asset.createdDate);
      baseDate.setDate(baseDate.getDate() + idx * 45);
      return {
        stage,
        date: baseDate.toISOString().split("T")[0],
      };
    });
}

function getLifecycleStageColor(stage: string) {
  switch (stage) {
    case "registered":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700";
    case "active":
      return "bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700";
    case "maintenance":
      return "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700";
    case "survey":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700";
    case "pending-disposal":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700";
    case "disposed":
      return "bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  }
}

function getLifecycleStageDotColor(stage: string) {
  switch (stage) {
    case "registered":
      return "bg-blue-500";
    case "active":
      return "bg-green-500";
    case "maintenance":
      return "bg-orange-500";
    case "survey":
      return "bg-purple-500";
    case "pending-disposal":
      return "bg-amber-500";
    case "disposed":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
}

function formatLifecycleStage(stage: string) {
  return stage
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function LifecycleTab({
  asset,
  events,
  userRole,
  onChangeStatus,
}: {
  asset: EnhancedAsset;
  events: LifecycleEvent[];
  userRole: UserRole;
  onChangeStatus: () => void;
}) {
  const currentStage = asset.lifecycleStage || "active";

  const currentStageTyped = currentStage as LifecycleStageType;
  const statusDaysInStage = daysSince(asset.lastStatusChange);

  // Calculate lifecycle progress
  const assetAgeDays = daysSince(asset.createdDate);
  const usefulLifeDays = (asset.expectedUsefulLife || 36) * 30;
  const lifecycleProgress = Math.min(
    Math.round((assetAgeDays / usefulLifeDays) * 100),
    100,
  );

  // Depreciation calculations
  const acquisitionValue = asset.acquisitionValue || 0;
  const residualValue = asset.residualValue || 0;
  const nbv = asset.nbv || 0;
  const depreciationPercent =
    acquisitionValue > 0
      ? Math.round(
          ((acquisitionValue - nbv) / acquisitionValue) * 100,
        )
      : 0;

  // Warranty status
  const warrantyExpiryDate = asset.warrantyExpiry
    ? new Date(asset.warrantyExpiry)
    : null;
  const currentDate = new Date();
  const warrantyExpired = warrantyExpiryDate
    ? warrantyExpiryDate < currentDate
    : true;
  const warrantyDaysRemaining = warrantyExpiryDate
    ? Math.max(
        0,
        Math.floor(
          (warrantyExpiryDate.getTime() -
            currentDate.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  return (
    <div className="space-y-5">
      {/* ── Lifecycle Progress (MUI Stepper) ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <TimelineIcon className="w-5 h-5" />
              Lifecycle
            </CardTitle>
            {/* {userRole !== 'auditor' && userRole !== 'senior_management' && (
              <Button onClick={onChangeStatus} size="sm">
                <TransferIcon className="w-4 h-4 mr-2" />
                Change Status
              </Button>
            )} */}
          </div>
        </CardHeader>
        <CardContent>
          {(() => {
            const history = getLifecycleStageHistory(asset);
            const visitedStages = new Set(
              history.map((h) => h.stage),
            );

            // Determine active step index for MUI Stepper
            const currentStepIdx = lifecycleSteps.indexOf(
              currentStageTyped,
            );
            const activeStep =
              currentStepIdx >= 0
                ? currentStepIdx
                : lifecycleSteps.reduce(
                    (last, step, idx) =>
                      visitedStages.has(step) ? idx : last,
                    0,
                  );

            return (
              <div className="space-y-4">
                <Stepper
                  activeStep={activeStep}
                  alternativeLabel
                  sx={{
                    "& .MuiStepConnector-line": {
                      borderColor: "hsl(var(--muted))",
                    },
                    "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line":
                      {
                        borderColor: "hsl(var(--muted))",
                      },
                    "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line":
                      {
                        borderColor: "#81CCD7",
                      },
                  }}
                >
                  {lifecycleSteps.map((step) => {
                    const isVisited = visitedStages.has(step);
                    const isCurrent =
                      currentStageTyped === step;
                    const isPastStep = isVisited && !isCurrent;

                    return (
                      <Step key={step} completed={isPastStep}>
                        <StepLabel
                          StepIconProps={{
                            sx: {
                              ...(isCurrent && {
                                color: "#22c55e !important",
                                "& .MuiStepIcon-text": {
                                  fill: "#fff !important",
                                  display: "block !important",
                                },
                              }),
                              ...(!isCurrent && {
                                color: "#81CCD7 !important",
                                "& .MuiStepIcon-text": {
                                  fill: "#fff !important",
                                  display: "block !important",
                                },
                              }),
                              "& svg": {
                                "& circle": {
                                  display: "block !important",
                                },
                                "& text": {
                                  display: "block !important",
                                },
                                "& path": {
                                  display: "none !important",
                                },
                              },
                            },
                          }}
                          sx={{
                            "& .MuiStepLabel-label": {
                              fontSize: "15px !important",
                              marginTop: "6px !important",
                              color: isCurrent
                                ? "var(--foreground) !important"
                                : "var(--muted-foreground) !important",
                              fontWeight: isCurrent
                                ? "700 !important"
                                : "400 !important",
                            },
                            "& .MuiStepLabel-label.Mui-active":
                              {
                                color:
                                  "var(--foreground) !important",
                                fontWeight: "700 !important",
                              },
                          }}
                        >
                          {step
                            .replace("-", " ")
                            .replace(/\b\w/g, (c) =>
                              c.toUpperCase(),
                            )}
                          {isCurrent && null}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                {/* In-transit badge (off canonical path) */}
                {asset.status === "in-transit" && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-purple-500/5 border border-purple-500/20">
                    <TransferIcon className="w-4 h-4 text-purple-500" />
                    <p className="text-md">
                      <span className="font-medium text-purple-700 dark:text-purple-300">
                        Currently in transit
                      </span>{" "}
                      — this is a temporary operational state
                      outside the canonical lifecycle path.
                    </p>
                  </div>
                )}
                {/* Valid next transitions */}
                {lifecycleValidTransitions[currentStageTyped] &&
                  lifecycleValidTransitions[currentStageTyped]
                    .length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-md text-muted-foreground">
                          Valid next:
                        </span>
                        {lifecycleValidTransitions[
                          currentStageTyped
                        ].map((ns) => (
                          <Badge
                            key={ns}
                            variant="outline"
                            className="text-md px-2.5 py-1"
                          >
                            {ns
                              .replace("-", " ")
                              .replace(/\b\w/g, (c) =>
                                c.toUpperCase(),
                              )}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-md text-muted-foreground/70 flex items-center gap-1">
                        <Info className="w-3 h-3 shrink-0" />
                        Determined by the transition rule matrix
                        — each stage defines its allowed target
                        stages. Only permitted transitions are
                        shown.
                      </p>
                    </div>
                  )}
                {currentStageTyped === "disposed" && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-red-500/5 border border-red-500/20">
                    <Lock className="w-4 h-4 text-red-500" />
                    <p className="text-md">
                      <span className="font-medium text-red-700 dark:text-red-300">
                        Terminal state
                      </span>{" "}
                      — no further transitions are allowed.
                      Admin override is required for any
                      changes.
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* ── Asset Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DescriptionIcon className="w-4 h-4" />
              <span className="text-md uppercase tracking-wide">
                Asset Details
              </span>
            </div>
            <div className="space-y-2 text-[15px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Asset ID
                </span>
                <span className="font-['Manrope'] font-medium">
                  {asset.assetId}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Name
                </span>
                <span>{asset.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Type
                </span>
                <span>{asset.type}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <PersonIcon className="w-4 h-4" />
              <span className="text-md uppercase tracking-wide">
                Assignment
              </span>
            </div>
            <div className="space-y-2 text-[15px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Custodian
                </span>
                <span>{asset.responsiblePerson}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Field Office
                </span>
                <span>{asset.fieldOffice}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Location
                </span>
                <span>{asset.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-md uppercase tracking-wide">
                Status Info
              </span>
            </div>
            <div className="space-y-2 text-[15px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Current Status
                </span>
                <Badge className={getStatusColor(asset.status)}>
                  {asset.status
                    .replace("-", " ")
                    .replace(/\b\w/g, (c: string) =>
                      c.toUpperCase(),
                    )}
                </Badge>
              </div>

              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Last Changed
                </span>
                <span>
                  {formatDate(asset.lastStatusChange)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Lifecycle Metrics Grid ── */}

      {/* ── Depreciation Schedule & Survey Status ── */}

      {/* ── Lifecycle Event Timeline ── */}
    </div>
  );
}

function getSurveyStatusColor(status: string) {
  switch (status) {
    case "not-surveyed":
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600";
    case "survey-pending":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700";
    case "surveyed":
      return "bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700";
    case "recommended-disposal":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
}

function formatSurveyStatus(status: string) {
  switch (status) {
    case "not-surveyed":
      return "Not Surveyed";
    case "survey-pending":
      return "Survey Pending";
    case "surveyed":
      return "Surveyed";
    case "recommended-disposal":
      return "Disposal Recommended";
    default:
      return status;
  }
}

// ══════════════════════════════════════════
// TAB 3 – History & Audit Trail
// ══════════════════════════════════════════
function HistoryTab({
  events,
  filter,
  onFilterChange,
}: {
  events: AuditEvent[];
  filter: string;
  onFilterChange: (f: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-[15px] h-8"
            onClick={() =>
              toast.success("History exported as PDF")
            }
          >
            <DownloadIcon className="w-3.5 h-3.5 mr-1" /> PDF
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-0">
            {events.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#121321] ring-2 ring-background" />
                  {index < events.length - 1 && (
                    <div className="w-0.5 flex-1 bg-[#121321]" />
                  )}
                </div>
                <div className="flex-1 pb-6 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-[15px] ">
                          {event.action}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-md py-1"
                        >
                          {event.eventType.replace("_", " ")}
                        </Badge>
                      </div>
                      {event.oldValue && event.newValue && (
                        <p className="text-md text-muted-foreground mt-1">
                          <span className="line-through">
                            {event.oldValue}
                          </span>{" "}
                          →{" "}
                          <span className="font-medium text-foreground">
                            {event.newValue}
                          </span>
                        </p>
                      )}
                      {!event.oldValue && event.newValue && (
                        <p className="text-md text-muted-foreground mt-1">
                          <span className="font-medium text-foreground">
                            {event.newValue}
                          </span>
                        </p>
                      )}
                      {event.comment && (
                        <p className="text-md text-muted-foreground mt-1 italic">
                          "{event.comment}"
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-md text-muted-foreground">
                        <span>by {event.user}</span>
                        <span>·</span>
                        <span>{event.fieldOffice}</span>
                      </div>
                    </div>
                    <div className="text-right text-[15px] text-muted-foreground whitespace-nowrap">
                      <p>{formatDate(event.timestamp)}</p>
                      <p>
                        {new Date(
                          event.timestamp,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {events.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-[15px]">
              No events match the selected filter.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
