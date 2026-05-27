import React, { useState, useMemo, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { formatDate } from "../utils/dateFormatter";
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
import { Textarea } from "@/components/ui/textarea";
import { MuiCheckbox } from "./shared/MuiCheckbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableSkeleton } from "./shared/SkeletonLoaders";
import {
  TablePagination,
  paginateData,
} from "./shared/TablePagination";
import {
  Add as Plus,
  Search,
  Edit,
  Download,
  Upload,
  LocationOn as MapPin,
  Lock,
  LockOpen as Unlock,
  ExpandMore as ChevronDown,
  Schedule as Clock,
  Visibility as Eye,
  Save,
  Close as X,
  Delete as Trash2,
  MoreHoriz as MoreHorizontal,
  ShowChart as Activity,
  Router as Radio,
  Warning as AlertCircle,
  FilterList as Filter,
  TrackChanges as TrackIcon,
  SwapHoriz as TransferIcon,
  Assignment as InspectionIcon,
  Info,
  Description as FileText,
  AttachMoney as DollarSign,
  CheckCircle,
} from "@mui/icons-material";
import { toast } from "sonner";
import DraftAssets from "./DraftAssets";
import { DRAFT_COUNT } from "./DraftAssets";

// Enhanced asset components
import {
  EnhancedAsset,
  ColumnConfig,
  AdvancedFilterState,
  defaultAdvancedFilters,
  mockEnhancedAssets,
  getStatusColor,
  getConditionColor,
  calculateAssetAge,
} from "./assets/types";
import { AdvancedFilters } from "./assets/AdvancedFilters";
import { TrackingDrawer } from "./assets/TrackingDrawer";
import { BulkActions } from "./assets/BulkActions";
import { FileUploadDrawer } from "./shared/FileUploadDrawer";
import { DeleteConfirmDialog } from "./shared/DeleteConfirmDialog";
import { ColumnToggle } from "./assets/ColumnToggle";
import { AssetDetailView } from "./assets/AssetDetailView";
import { AssetTransfers } from "./assets/AssetTransfers";
import { AssetInspections } from "./assets/AssetInspections";
import { AssetSurveys } from "./assets/AssetSurveys";
import { AssetDisposals } from "./assets/AssetDisposals";
import { mockDisposals } from "./assets/disposalTypes";
import { mockSurveys } from "./assets/surveyTypes";
import {
  InitiateTransferDrawer,
  TransferFormData,
} from "./assets/InitiateTransferDrawer";
import {
  InitiateInspectionDrawer,
  InspectionFormData,
} from "./assets/InitiateInspectionDrawer";
import {
  InitiateSurveyDrawer,
  SurveyFormData,
} from "./assets/InitiateSurveyDrawer";
import {
  InitiateDisposalDrawer,
  DisposalFormData,
} from "./assets/InitiateDisposalDrawer";
import {
  ChangeStatusDrawer,
  ChangeStatusFormData,
} from "./assets/ChangeStatusDrawer";
import {
  TransferAssetItem,
  eligibleAssets as transferEligibleAssets,
  getTransferTypeLabel,
} from "./assets/transferTypes";

type ViewMode = "list" | "detail";

// Field Office, Location and Custodian Data
const FIELD_OFFICES = [
  { code: "FO-HQ", name: "Headquarters" },
  { code: "FO-ROE", name: "Regional Office East" },
  { code: "FO-ROW", name: "Regional Office West" },
];

// Field Office to Locations mapping
const FIELD_OFFICE_LOCATIONS: Record<string, string[]> = {
  "FO-HQ": ["Office Floor 1", "Office A1-01", "Office A1-02"],
  "FO-ROE": ["Office A1-03", "Warehouse B1"],
  "FO-ROW": ["Warehouse B2"],
};

const LOCATIONS = [
  "Office Floor 1",
  "Office A1-01",
  "Office A1-02",
  "Office A1-03",
  "Warehouse B1",
  "Warehouse B2",
];

const CUSTODIANS = [
  "John Doe",
  "Jane Smith",
  "Bob Wilson",
  "Sarah Chen",
  "Michael Tran",
  "Emily Nguyen",
  "David Park",
  "Lisa Wang",
  "Ahmed Hassan",
  "Maria Garcia",
];

// Location-to-Custodian mapping
const LOCATION_CUSTODIANS: Record<string, string[]> = {
  "Office Floor 1": ["John Doe", "Jane Smith", "Bob Wilson"],
  "Office A1-01": ["Sarah Chen", "Michael Tran"],
  "Office A1-02": ["Emily Nguyen", "David Park"],
  "Office A1-03": ["Lisa Wang", "Ahmed Hassan"],
  "Warehouse B1": ["Maria Garcia", "John Doe"],
  "Warehouse B2": ["Bob Wilson", "Sarah Chen"],
};

const defaultColumns: ColumnConfig[] = [
  {
    key: "assetId",
    label: "Asset ID",
    visible: true,
    category: "default",
  },
  {
    key: "epc",
    label: "EPC",
    visible: true,
    category: "default",
  },
  {
    key: "barcode",
    label: "Barcode",
    visible: true,
    category: "default",
  },
  {
    key: "type",
    label: "Category",
    visible: true,
    category: "default",
  },
  {
    key: "name",
    label: "Name",
    visible: true,
    category: "default",
  },
  {
    key: "location",
    label: "Location",
    visible: true,
    category: "default",
  },
  {
    key: "publishedDate",
    label: "Published Date",
    visible: true,
    category: "default",
  },
  {
    key: "custodian",
    label: "Custodian",
    visible: true,
    category: "default",
  },
  // Tracking columns (hidden by default)
  {
    key: "fieldOffice",
    label: "Field Office",
    visible: false,
    category: "tracking",
  },
  {
    key: "lastStatusChange",
    label: "Last Status Change",
    visible: false,
    category: "tracking",
  },
  {
    key: "lastLocationUpdate",
    label: "Last Location Update",
    visible: false,
    category: "tracking",
  },
  {
    key: "lastCustodianChange",
    label: "Last Custodian Change",
    visible: false,
    category: "tracking",
  },
  {
    key: "condition",
    label: "Condition",
    visible: false,
    category: "tracking",
  },
  // Financial (role-gated, hidden by default)
  {
    key: "nbv",
    label: "NBV",
    visible: false,
    category: "financial",
  },
];

interface AssetsProps {
  initialAssetId?: string;
}

export default function Assets({
  initialAssetId,
}: AssetsProps = {}) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedAsset, setSelectedAsset] =
    useState<EnhancedAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] =
    useState<string>("all");
  const [classificationFilter, setClassificationFilter] =
    useState<string>("all");
  const [assignmentFilter, setAssignmentFilter] =
    useState<string>("all");
  const [conditionFilter, setConditionFilter] =
    useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    | "all"
    | "drafts"
    | "transfers"
    | "inspections"
    | "surveys"
    | "disposals"
  >("all");
  const draftCount = DRAFT_COUNT;
  const [childDetailOpen, setChildDetailOpen] = useState(false);
  const [assetPage, setAssetPage] = useState(0);
  const [assetRowsPerPage, setAssetRowsPerPage] = useState(10);
  const [createDrawerOpen, setCreateDrawerOpen] =
    useState(false);
  const [editingAsset, setEditingAsset] =
    useState<EnhancedAsset | null>(null);
  const [editingDraft, setEditingDraft] = useState<any | null>(
    null,
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] =
    useState(false);
  const [assetToDelete, setAssetToDelete] =
    useState<EnhancedAsset | null>(null);
  const [createForm, setCreateForm] = useState({
    assetId: "",
    epc: "",
    barcode: "",
    type: "",
    name: "",
    description: "",
    fieldOffice: "",
    location: "",
    responsiblePerson: "",
    notes: "",
    serialNumber: "",
    status: "active",
    condition: "good",
    poNumber: "",
    grnNumber: "",
    supplier: "",
    acquisitionDate: "",
    quantity: "1",
    unitPrice: "",
    currency: "USD",
    totalValue: "",
    classificationOverride: "",
  });
  const [createFormErrors, setCreateFormErrors] = useState<
    Record<string, string>
  >({});
  const [
    classificationOverrideActive,
    setClassificationOverrideActive,
  ] = useState(false);
  const [userRole] = useState<"smio" | "admin" | "auditor">(
    "admin",
  );

  // Enhanced state
  const [advancedFilters, setAdvancedFilters] =
    useState<AdvancedFilterState>(defaultAdvancedFilters);
  const [columns, setColumns] =
    useState<ColumnConfig[]>(defaultColumns);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(),
  );
  const [trackingAsset, setTrackingAsset] =
    useState<EnhancedAsset | null>(null);
  const [trackingDrawerOpen, setTrackingDrawerOpen] =
    useState(false);

  // Transfer from bulk actions
  const [bulkTransferDrawerOpen, setBulkTransferDrawerOpen] =
    useState(false);

  // Inspection from bulk actions
  const [
    bulkInspectionDrawerOpen,
    setBulkInspectionDrawerOpen,
  ] = useState(false);

  // Survey from bulk actions
  const [bulkSurveyDrawerOpen, setBulkSurveyDrawerOpen] =
    useState(false);

  // Disposal from bulk actions
  const [bulkDisposalDrawerOpen, setBulkDisposalDrawerOpen] =
    useState(false);

  // Change Status from bulk actions
  const [
    bulkChangeStatusDrawerOpen,
    setBulkChangeStatusDrawerOpen,
  ] = useState(false);

  // Bulk Upload drawer
  const [bulkUploadDrawerOpen, setBulkUploadDrawerOpen] =
    useState(false);

  // ── Row-level quick action drawers ──
  const [actionTargetAsset, setActionTargetAsset] =
    useState<EnhancedAsset | null>(null);
  const [rowChangeLocationOpen, setRowChangeLocationOpen] =
    useState(false);
  const [rowTransferAssetOpen, setRowTransferAssetOpen] =
    useState(false);
  const [rowChangeStatusOpen, setRowChangeStatusOpen] =
    useState(false);
  const [
    rowScheduleInspectionOpen,
    setRowScheduleInspectionOpen,
  ] = useState(false);

  // Row-level form states
  const [rowNewLocation, setRowNewLocation] = useState("");
  const [rowNewFieldOffice, setRowNewFieldOffice] =
    useState("");
  const [
    rowLocationJustification,
    setRowLocationJustification,
  ] = useState("");

  const [rowTransferDestination, setRowTransferDestination] =
    useState("");
  const [rowTransferCustodian, setRowTransferCustodian] =
    useState("");
  const [
    rowTransferJustification,
    setRowTransferJustification,
  ] = useState("");

  const [rowTargetStatus, setRowTargetStatus] = useState("");
  const [rowStatusJustification, setRowStatusJustification] =
    useState("");

  const [rowInspectionType, setRowInspectionType] =
    useState("");
  const [rowInspectionDate, setRowInspectionDate] =
    useState("");
  const [rowInspectionNotes, setRowInspectionNotes] =
    useState("");

  const [assets] = useState<EnhancedAsset[]>(
    mockEnhancedAssets,
  );

  // ── Open asset detail view if initialAssetId is provided ──
  useEffect(() => {
    if (initialAssetId) {
      const asset = assets.find(
        (a) => a.assetId === initialAssetId,
      );
      if (asset) {
        setSelectedAsset(asset);
        setViewMode("detail");
      }
    }
  }, [initialAssetId, assets]);

  // ── Asset lock check — cross-reference with active disposals/surveys ──
  const lockedAssetIds = useMemo(() => {
    const locked = new Set<string>();
    const activeStatuses = [
      "pending-review",
      "pending-approval",
      "approved",
      "in-progress",
    ];
    mockDisposals.forEach((d) => {
      if (d.assetsLocked && activeStatuses.includes(d.status)) {
        d.assets.forEach((a) => locked.add(a.assetId));
      }
    });
    mockSurveys.forEach((s) => {
      if (s.assetsLocked && activeStatuses.includes(s.status)) {
        s.assets.forEach((a) => locked.add(a.assetId));
      }
    });
    return locked;
  }, []);

  const isAssetLocked = (assetId: string) =>
    lockedAssetIds.has(assetId);

  // ── Cross-field search ──
  const filteredAssets = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return assets.filter((asset) => {
      // Cross-field search: Asset ID, EPC, Barcode, Serial, PO, Custodian, Location, Name
      const matchesSearch =
        !q ||
        asset.assetId.toLowerCase().includes(q) ||
        asset.epc.toLowerCase().includes(q) ||
        asset.barcode.toLowerCase().includes(q) ||
        asset.serialNumber.toLowerCase().includes(q) ||
        (asset.poNumber &&
          asset.poNumber.toLowerCase().includes(q)) ||
        asset.responsiblePerson.toLowerCase().includes(q) ||
        asset.location.toLowerCase().includes(q) ||
        asset.name.toLowerCase().includes(q);

      // Basic filters
      const matchesType =
        typeFilter === "all" || asset.type === typeFilter;
      const matchesLocation =
        locationFilter === "all" ||
        asset.location.includes(locationFilter);
      const matchesConditionFilter =
        conditionFilter === "all" ||
        asset.condition === conditionFilter;

      // Advanced filters
      const af = advancedFilters;
      const matchesFieldOffice =
        af.fieldOffice === "all" ||
        asset.fieldOffice === af.fieldOffice;
      const matchesAdvLocation =
        af.location === "all" || asset.location === af.location;
      const matchesCustodian =
        !af.custodian ||
        asset.responsiblePerson
          .toLowerCase()
          .includes(af.custodian.toLowerCase());
      const matchesCategory =
        af.category === "all" || asset.category === af.category;
      const matchesLifecycle =
        af.lifecycleStatus === "all" ||
        asset.status === af.lifecycleStatus;
      const matchesCondition =
        af.condition === "all" ||
        asset.condition === af.condition;
      const matchesPO =
        !af.poNumber ||
        (asset.poNumber &&
          asset.poNumber
            .toLowerCase()
            .includes(af.poNumber.toLowerCase()));
      const matchesGRN =
        !af.grnNumber ||
        (asset.grnNumber &&
          asset.grnNumber
            .toLowerCase()
            .includes(af.grnNumber.toLowerCase()));
      const matchesAcqFrom =
        !af.acquisitionDateFrom ||
        (asset.acquisitionDate &&
          asset.acquisitionDate >= af.acquisitionDateFrom);
      const matchesAcqTo =
        !af.acquisitionDateTo ||
        (asset.acquisitionDate &&
          asset.acquisitionDate <= af.acquisitionDateTo);
      const matchesValueMin =
        !af.valueMin ||
        (asset.acquisitionValue !== undefined &&
          asset.acquisitionValue >= Number(af.valueMin));
      const matchesValueMax =
        !af.valueMax ||
        (asset.acquisitionValue !== undefined &&
          asset.acquisitionValue <= Number(af.valueMax));

      // Classification filter (based on acquisition value)
      const matchesClassification =
        classificationFilter === "all" ||
        (classificationFilter === "Capital" &&
          asset.acquisitionValue !== undefined &&
          asset.acquisitionValue >= 2000) ||
        (classificationFilter === "Attractive" &&
          asset.acquisitionValue !== undefined &&
          asset.acquisitionValue < 2000);

      // Assignment filter (based on custodian presence)
      const matchesAssignment =
        assignmentFilter === "all" ||
        (assignmentFilter === "Assigned" &&
          asset.responsiblePerson &&
          asset.responsiblePerson.trim() !== "") ||
        (assignmentFilter === "Unassigned" &&
          (!asset.responsiblePerson ||
            asset.responsiblePerson.trim() === ""));

      return (
        matchesSearch &&
        matchesType &&
        matchesLocation &&
        matchesConditionFilter &&
        matchesFieldOffice &&
        matchesAdvLocation &&
        matchesCustodian &&
        matchesCategory &&
        matchesLifecycle &&
        matchesCondition &&
        matchesPO &&
        matchesGRN &&
        matchesAcqFrom &&
        matchesAcqTo &&
        matchesValueMin &&
        matchesValueMax &&
        matchesClassification &&
        matchesAssignment
      );
    });
  }, [
    assets,
    searchQuery,
    typeFilter,
    locationFilter,
    advancedFilters,
    classificationFilter,
    assignmentFilter,
    conditionFilter,
  ]);

  const visibleColumns = columns.filter((c) => c.visible);
  const hasActiveFilters =
    searchQuery !== "" ||
    typeFilter !== "all" ||
    locationFilter !== "all" ||
    classificationFilter !== "all" ||
    assignmentFilter !== "all" ||
    conditionFilter !== "all" ||
    Object.entries(advancedFilters).some(
      ([_, v]) => v !== "" && v !== "all",
    );

  // Close any open drawers when switching tabs
  useEffect(() => {
    setCreateDrawerOpen(false);
    setTrackingDrawerOpen(false);
    setBulkTransferDrawerOpen(false);
    setBulkInspectionDrawerOpen(false);
    setBulkSurveyDrawerOpen(false);
    setBulkDisposalDrawerOpen(false);
    setBulkChangeStatusDrawerOpen(false);
  }, [activeTab]);

  // ── Handlers ──
  const handleRowDoubleClick = (asset: EnhancedAsset) => {
    setSelectedAsset(asset);
    setViewMode("detail");
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedAsset(null);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setLocationFilter("all");
    setClassificationFilter("all");
    setAssignmentFilter("all");
    setConditionFilter("all");
    setAdvancedFilters(defaultAdvancedFilters);
    toast.info("All filters cleared");
  };

  const toggleColumn = (key: string) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.key === key ? { ...c, visible: !c.visible } : c,
      ),
    );
  };

  const toggleSelectAll = () => {
    const pageData = paginateData(
      filteredAssets,
      assetPage,
      assetRowsPerPage,
    );
    const allSelected = pageData.every((a) =>
      selectedIds.has(a.id),
    );
    if (allSelected) {
      const newSet = new Set(selectedIds);
      pageData.forEach((a) => newSet.delete(a.id));
      setSelectedIds(newSet);
    } else {
      const newSet = new Set(selectedIds);
      pageData.forEach((a) => newSet.add(a.id));
      setSelectedIds(newSet);
    }
  };

  const toggleSelectRow = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const openTrackingDrawer = (asset: EnhancedAsset) => {
    setTrackingAsset(asset);
    setTrackingDrawerOpen(true);
  };

  // Map selected assets from Published Assets to TransferAssetItem format
  const mapToTransferAssets =
    useMemo((): TransferAssetItem[] => {
      const selected = assets.filter((a) =>
        selectedIds.has(a.id),
      );
      return selected
        .filter(
          (a) =>
            !["disposed", "missing", "maintenance"].includes(
              a.status,
            ),
        )
        .map((a) => ({
          id: a.id,
          assetId: a.assetId,
          name: a.name,
          serialNumber: a.serialNumber,
          type: a.type,
          currentLocation: a.location,
          condition: a.condition,
          acquisitionValue: a.acquisitionValue,
        }));
    }, [assets, selectedIds]);

  const handleBulkTransfer = () => {
    // Check if any ineligible assets are selected
    const selectedAssets = assets.filter((a) =>
      selectedIds.has(a.id),
    );
    const ineligible = selectedAssets.filter((a) =>
      ["disposed", "missing", "maintenance"].includes(a.status),
    );
    if (ineligible.length > 0) {
      toast.warning(
        `${ineligible.length} asset(s) cannot be transferred (disposed/missing/maintenance) and will be excluded`,
      );
    }
    if (mapToTransferAssets.length === 0) {
      toast.error("No eligible assets selected for transfer");
      return;
    }
    setBulkTransferDrawerOpen(true);
  };

  const handleBulkTransferSubmit = (
    formData: TransferFormData,
    selectedAssets: TransferAssetItem[],
  ) => {
    const transferId = `TRF-2026-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`;
    toast.success(
      `Transfer ${transferId} created with ${selectedAssets.length} asset(s) — routed for ${formData.toCustodian}'s signature`,
    );
    setBulkTransferDrawerOpen(false);
    setSelectedIds(new Set());
  };

  // ── Bulk Inspection ──
  const handleBulkInspection = () => {
    if (mapToTransferAssets.length === 0) {
      toast.error("No eligible assets selected for inspection");
      return;
    }
    setBulkInspectionDrawerOpen(true);
  };

  const handleBulkInspectionSubmit = (
    formData: InspectionFormData,
    selectedAssets: TransferAssetItem[],
  ) => {
    const inspectionId = `INS-2026-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`;
    toast.success(
      `Inspection ${inspectionId} assigned to ${formData.inspector} with ${selectedAssets.length} asset(s)`,
    );
    setBulkInspectionDrawerOpen(false);
    setSelectedIds(new Set());
  };

  // ── Bulk Survey ──
  const handleBulkSurvey = () => {
    if (mapToTransferAssets.length === 0) {
      toast.error("No eligible assets selected for survey");
      return;
    }
    setBulkSurveyDrawerOpen(true);
  };

  const handleBulkSurveySubmit = (
    formData: SurveyFormData,
    selectedAssets: TransferAssetItem[],
  ) => {
    const surveyId = `SRV-2026-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`;
    toast.success(
      `Survey ${surveyId} initiated by ${formData.teamLead} with ${selectedAssets.length} asset(s)${formData.lockAssets ? " — assets locked" : ""}`,
    );
    setBulkSurveyDrawerOpen(false);
    setSelectedIds(new Set());
  };

  // ── Bulk Disposal ──
  const handleBulkDisposal = () => {
    const selectedAssets = assets.filter((a) =>
      selectedIds.has(a.id),
    );
    const ineligible = selectedAssets.filter((a) =>
      ["disposed"].includes(a.status),
    );
    if (ineligible.length > 0) {
      toast.warning(
        `${ineligible.length} asset(s) already disposed and will be excluded`,
      );
    }
    const eligible = mapToTransferAssets.filter(
      (a) => a.condition !== "disposed",
    );
    if (eligible.length === 0) {
      toast.error("No eligible assets selected for disposal");
      return;
    }
    setBulkDisposalDrawerOpen(true);
  };

  const handleBulkDisposalSubmit = (
    formData: DisposalFormData,
    selectedAssets: TransferAssetItem[],
  ) => {
    const disposalId = `DSP-2026-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`;
    toast.success(
      `Disposal ${disposalId} (${formData.disposalMethod}) submitted with ${selectedAssets.length} asset(s) — routed for finance review`,
    );
    setBulkDisposalDrawerOpen(false);
    setSelectedIds(new Set());
  };

  // ── Bulk Change Status ──
  const handleBulkChangeStatus = () => {
    if (mapToTransferAssets.length === 0) {
      toast.error(
        "No eligible assets selected for status change",
      );
      return;
    }
    setBulkChangeStatusDrawerOpen(true);
  };

  const handleBulkChangeStatusSubmit = (
    formData: ChangeStatusFormData,
    selectedAssets: TransferAssetItem[],
  ) => {
    toast.success(
      `${selectedAssets.length} asset(s) status changed to"${formData.targetStatus}"${formData.effectiveImmediately ? " — effective immediately" : " — queued for approval"}`,
    );
    setBulkChangeStatusDrawerOpen(false);
    setSelectedIds(new Set());
  };

  const validateCreateForm = () => {
    const errors: Record<string, string> = {};
    if (!createForm.assetId.trim())
      errors.assetId = "Asset ID is required";
    if (!createForm.epc.trim()) errors.epc = "EPC is required";
    if (!createForm.type) errors.type = "Type is required";
    if (!createForm.name.trim())
      errors.name = "Name is required";
    if (!createForm.fieldOffice)
      errors.fieldOffice = "Field Office is required";
    if (!createForm.location)
      errors.location = "Location is required";
    setCreateFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Row-level quick action openers ──
  const openRowChangeLocation = (asset: EnhancedAsset) => {
    setActionTargetAsset(asset);
    setRowNewLocation("");
    setRowNewFieldOffice("");
    setRowLocationJustification("");
    setRowChangeLocationOpen(true);
  };
  const openRowTransferAsset = (asset: EnhancedAsset) => {
    setActionTargetAsset(asset);
    setRowTransferDestination("");
    setRowTransferCustodian("");
    setRowTransferJustification("");
    setRowTransferAssetOpen(true);
  };
  const openRowChangeStatus = (asset: EnhancedAsset) => {
    setActionTargetAsset(asset);
    setRowTargetStatus("");
    setRowStatusJustification("");
    setRowChangeStatusOpen(true);
  };
  const openRowScheduleInspection = (asset: EnhancedAsset) => {
    setActionTargetAsset(asset);
    setRowInspectionType("");
    setRowInspectionDate("");
    setRowInspectionNotes("");
    setRowScheduleInspectionOpen(true);
  };

  // ── Row-level quick action submits ──
  const handleRowChangeLocationSubmit = () => {
    if (!rowNewLocation) {
      toast.error("Please select a new location");
      return;
    }
    if (!rowLocationJustification.trim()) {
      toast.error("Justification is required");
      return;
    }
    toast.success(
      `Location change submitted: ${actionTargetAsset?.assetId} → ${rowNewLocation}`,
    );
    setRowChangeLocationOpen(false);
  };
  const handleRowTransferSubmit = () => {
    if (!rowTransferDestination) {
      toast.error("Please select a destination");
      return;
    }
    if (!rowTransferCustodian) {
      toast.error("Please enter a receiving custodian");
      return;
    }
    if (!rowTransferJustification.trim()) {
      toast.error("Justification is required");
      return;
    }
    toast.success(
      `Transfer request submitted: ${actionTargetAsset?.assetId} → ${rowTransferDestination}`,
    );
    setRowTransferAssetOpen(false);
  };
  const handleRowChangeStatusSubmit = () => {
    if (!rowTargetStatus) {
      toast.error("Please select a target status");
      return;
    }
    if (!rowStatusJustification.trim()) {
      toast.error("Justification is required");
      return;
    }
    toast.success(
      `Status change submitted: ${actionTargetAsset?.assetId} → ${rowTargetStatus}`,
    );
    setRowChangeStatusOpen(false);
  };
  const handleRowScheduleInspectionSubmit = () => {
    if (!rowInspectionType) {
      toast.error("Please select an inspection type");
      return;
    }
    if (!rowInspectionDate) {
      toast.error("Please select a date");
      return;
    }
    toast.success(
      `Inspection scheduled: ${actionTargetAsset?.assetId} — ${rowInspectionType} on ${rowInspectionDate}`,
    );
    setRowScheduleInspectionOpen(false);
  };

  const handleEditAsset = (asset: EnhancedAsset) => {
    setEditingAsset(asset);
    const totalValue = asset.acquisitionValue?.toString() || "";
    const numValue = parseFloat(totalValue);
    const autoClassification =
      totalValue && numValue > 0
        ? numValue >= 2000
          ? "Capital"
          : "Attractive"
        : "";
    setCreateForm({
      assetId: asset.assetId,
      epc: asset.epc || "",
      barcode: asset.barcode || "",
      type: asset.type,
      name: asset.name,
      description: asset.description || "",
      location: asset.location,
      responsiblePerson: asset.responsiblePerson,
      notes: asset.notes || "",
      serialNumber: asset.serialNumber || "",
      status: asset.status || "active",
      condition: asset.condition || "good",
      poNumber: asset.poNumber || "",
      grnNumber: asset.grnNumber || "",
      supplier: "",
      acquisitionDate: asset.acquisitionDate || "",
      quantity: "1",
      unitPrice: totalValue,
      currency: asset.currency || "USD",
      totalValue: totalValue,
      classificationOverride: autoClassification,
    });
    setCreateFormErrors({});
    setCreateDrawerOpen(true);
  };

  const handleCreateSubmit = () => {
    if (!validateCreateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (editingAsset) {
      toast.success(
        `Asset ${editingAsset.assetId} updated successfully!`,
      );
    } else {
      toast.success("Asset created successfully!");
    }
    setCreateDrawerOpen(false);
    setEditingAsset(null);
    setCreateForm({
      assetId: "",
      epc: "",
      barcode: "",
      type: "",
      name: "",
      description: "",
      location: "",
      responsiblePerson: "",
      notes: "",
      serialNumber: "",
      status: "active",
      condition: "good",
      poNumber: "",
      grnNumber: "",
      supplier: "",
      acquisitionDate: "",
      quantity: "1",
      unitPrice: "",
      currency: "USD",
      totalValue: "",
      classificationOverride: "",
    });
    setCreateFormErrors({});
  };

  const handleCreateDrawerClose = (open: boolean) => {
    setCreateDrawerOpen(open);
    if (!open) {
      setCreateFormErrors({});
      setEditingAsset(null);
      setEditingDraft(null);
      // Reset form to defaults
      setCreateForm({
        assetId: "",
        epc: "",
        barcode: "",
        type: "",
        name: "",
        description: "",
        location: "",
        responsiblePerson: "",
        notes: "",
        serialNumber: "",
        status: "active",
        condition: "good",
        poNumber: "",
        grnNumber: "",
        supplier: "",
        acquisitionDate: "",
        quantity: "1",
        unitPrice: "",
        currency: "USD",
        totalValue: "",
        classificationOverride: "",
      });
    }
  };

  // Highlight search match
  const highlight = (text: string) => {
    if (!searchQuery) return text;
    const idx = text
      .toLowerCase()
      .indexOf(searchQuery.toLowerCase());
    if (idx === -1) return text;
    return (
      <span>
        {text.slice(0, idx)}
        <mark className="bg-yellow-200 dark:bg-yellow-800/60 rounded-sm px-0.5">
          {text.slice(idx, idx + searchQuery.length)}
        </mark>
        {text.slice(idx + searchQuery.length)}
      </span>
    );
  };

  // ── Render cell by column key ──
  const renderCell = (asset: EnhancedAsset, key: string) => {
    switch (key) {
      case "assetId":
        return (
          <span className="font-medium flex items-center gap-1.5">
            {highlight(asset.assetId)}
            {(asset.isLocked ||
              isAssetLocked(asset.assetId)) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs text-white">
                      Asset locked —{" "}
                      {asset.lockReason ||
                        "active survey case in progress"}
                    </p>
                    {asset.activeSurveyCaseId && (
                      <p className="text-xs text-white font-['Manrope'] mt-0.5">
                        {asset.activeSurveyCaseId}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </span>
        );
      case "epc":
        return (
          <span className="font-['Manrope'] text-[15px]">
            {highlight(asset.epc)}
          </span>
        );
      case "barcode":
        return (
          <span className="font-['Manrope'] text-[15px]">
            {highlight(asset.barcode)}
          </span>
        );
      case "type":
        return highlight(asset.type);
      case "name":
        return highlight(asset.name);
      case "location":
        return highlight(asset.location);
      case "publishedDate":
        return (
          <span className="text-[15px] whitespace-nowrap">
            {formatDate(asset.publishedDate)}
          </span>
        );
      case "custodian":
        return highlight(asset.responsiblePerson);
      case "fieldOffice":
        return (
          <span className="text-[15px]">
            {asset.fieldOffice}
          </span>
        );
      case "lastStatusChange":
        return (
          <span className="text-[15px] whitespace-nowrap">
            {formatDate(asset.lastStatusChange)}
          </span>
        );
      case "lastLocationUpdate":
        return (
          <span className="text-[15px] whitespace-nowrap">
            {formatDate(asset.lastLocationUpdate)}
          </span>
        );
      case "lastCustodianChange":
        return (
          <span className="text-[15px] whitespace-nowrap">
            {formatDate(asset.lastCustodianChange)}
          </span>
        );
      case "condition":
        return (
          <span className="text-[15px]">{asset.condition}</span>
        );
      case "nbv":
        return asset.nbv !== undefined ? (
          <span className="text-xs font-['Manrope']">
            ${asset.nbv.toLocaleString()}
          </span>
        ) : (
          "—"
        );
      default:
        return "—";
    }
  };

  // ── Detail View ──
  if (viewMode === "detail" && selectedAsset) {
    return (
      <AssetDetailView
        asset={selectedAsset}
        onBack={handleBack}
      />
    );
  }

  const pageData = paginateData(
    filteredAssets,
    assetPage,
    assetRowsPerPage,
  );
  const allPageSelected =
    pageData.length > 0 &&
    pageData.every((a) => selectedIds.has(a.id));
  const queryStartTime = Date.now();

  return (
    <div className="space-y-6 min-w-0">
      {!childDetailOpen && null}

      {/* Tab Switcher */}
      {!childDetailOpen && (
        <div className="flex items-center justify-between text-[15px]">
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-[4px] text-[15px] transition-colors ${
                activeTab === "all"
                  ? "bg-[#121321] text-white shadow-sm"
                  : "bg-transparent text-[#121321] dark:text-white"
              }`}
            >
              Published Assets
            </button>
            <button
              onClick={() => setActiveTab("drafts")}
              className={`px-4 py-2 rounded-[4px] text-[15px] transition-colors flex items-center gap-2 ${
                activeTab === "drafts"
                  ? "bg-[#121321] text-white shadow-sm"
                  : "bg-transparent text-[#121321] "
              }`}
            >
              Draft Assets
              <span
                className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-[4px] text-xs ${
                  activeTab === "drafts"
                    ? "bg-white/20 text-white"
                    : "bg-[#121321] text-white"
                }`}
              >
                {draftCount}
              </span>
            </button>
            {/* <button
            onClick={() => setActiveTab("transfers")}
            className={`px-4 py-2 rounded-[4px] text-[15px] transition-colors ${
              activeTab ==="transfers"
                ?"bg-[#121321] text-white shadow-sm"
                :"bg-transparent text-[#121321] border border-[#121321]/20[#121321]/5 dark:text-white dark:border-white/20"
            }`}
          >
            Asset Transfers
          </button>
          <button
            onClick={() => setActiveTab("inspections")}
            className={`px-4 py-2 rounded-[4px] text-[15px] transition-colors ${
              activeTab ==="inspections"
                ?"bg-[#121321] text-white shadow-sm"
                :"bg-transparent text-[#121321] border border-[#121321]/20[#121321]/5 dark:text-white dark:border-white/20"
            }`}
          >
            Asset Inspections
          </button>
          <button
            onClick={() => setActiveTab("surveys")}
            className={`px-4 py-2 rounded-[4px] text-[15px] transition-colors ${
              activeTab ==="surveys"
                ?"bg-[#121321] text-white shadow-sm"
                :"bg-transparent text-[#121321] border border-[#121321]/20[#121321]/5 dark:text-white dark:border-white/20"
            }`}
          >
            Asset Surveys
          </button>
          <button
            onClick={() => setActiveTab("disposals")}
            className={`px-4 py-2 rounded-[4px] text-[15px] transition-colors ${
              activeTab ==="disposals"
                ?"bg-[#121321] text-white shadow-sm"
                :"bg-transparent text-[#121321] border border-[#121321]/20[#121321]/5 dark:text-white dark:border-white/20"
            }`}
          >
            Asset Disposals
          </button> */}
          </div>
          <div className="flex gap-2">
            {activeTab === "all" && (
              <>
                <Button
                  onClick={() => setCreateDrawerOpen(true)}
                  className="text-[15px]"
                >
                  Register Asset
                </Button>
              </>
            )}
            {activeTab === "drafts" && (
              <>
                <Button
                  variant="outline"
                  className="text-[15px]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setBulkUploadDrawerOpen(true)}
                  className="text-[15px]"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Upload
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === "drafts" ? (
        <DraftAssets
          onEditDraft={(draft) => {
            // Populate the create form with draft data
            setCreateForm({
              assetId: "",
              epc: "",
              barcode: "",
              type: "",
              name: draft.itemDescription || "",
              description: draft.itemDescription || "",
              location: "",
              responsiblePerson: draft.assignedTo || "",
              notes: "",
              serialNumber: "",
              status: "active",
              condition: "good",
              poNumber: draft.poNumber || "",
              grnNumber: draft.grnNumber || "",
              supplier: draft.supplier || "",
              acquisitionDate: draft.acquisitionDate || "",
              quantity: String(draft.quantity || "1"),
              unitPrice: String(draft.unitPrice || ""),
              currency: draft.currency || "USD",
              totalValue: String(draft.totalCost || ""),
              classificationOverride:
                draft.classification || "",
            });
            setEditingAsset(null);
            setEditingDraft(draft); // Mark as draft completion
            setCreateDrawerOpen(true);
          }}
        />
      ) : activeTab === "transfers" ? (
        <AssetTransfers
          onDetailViewChange={setChildDetailOpen}
        />
      ) : activeTab === "inspections" ? (
        <AssetInspections
          onDetailViewChange={setChildDetailOpen}
        />
      ) : activeTab === "surveys" ? (
        <AssetSurveys onDetailViewChange={setChildDetailOpen} />
      ) : activeTab === "disposals" ? (
        <AssetDisposals
          onDetailViewChange={setChildDetailOpen}
        />
      ) : (
        <>
          {/* Advanced Filters */}
          <AdvancedFilters
            filters={advancedFilters}
            onFiltersChange={setAdvancedFilters}
            onClearAll={() => {
              setAdvancedFilters(defaultAdvancedFilters);
              toast.info("Advanced filters cleared");
            }}
          />

          {/* Bulk Actions Bar */}
          <BulkActions
            selectedCount={selectedIds.size}
            onClearSelection={() => setSelectedIds(new Set())}
            onTransfer={handleBulkTransfer}
            onInspection={handleBulkInspection}
            onSurvey={handleBulkSurvey}
            onDisposal={handleBulkDisposal}
            onChangeStatus={handleBulkChangeStatus}
          />

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Asset ID, EPC, Barcode, Serial, PO, Custodian, Location, Name..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setAssetPage(0);
                    }}
                    className="pl-9 text-[15px]"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <Select
                    value={typeFilter}
                    onValueChange={(v) => {
                      setTypeFilter(v);
                      setAssetPage(0);
                    }}
                  >
                    <SelectTrigger className="w-40 text-[15px] pr-2 [&>svg]:right-2">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem
                        value="all"
                        className="text-[15px]"
                      >
                        All Types
                      </SelectItem>
                      <SelectItem
                        value="Laptop"
                        className="text-[15px]"
                      >
                        Laptop
                      </SelectItem>
                      <SelectItem
                        value="Desktop"
                        className="text-[15px]"
                      >
                        Desktop
                      </SelectItem>
                      <SelectItem
                        value="Printer"
                        className="text-[15px]"
                      >
                        Printer
                      </SelectItem>
                      <SelectItem
                        value="Monitor"
                        className="text-[15px]"
                      >
                        Monitor
                      </SelectItem>
                      <SelectItem
                        value="Server"
                        className="text-[15px]"
                      >
                        Server
                      </SelectItem>
                      <SelectItem
                        value="Networking"
                        className="text-[15px]"
                      >
                        Networking
                      </SelectItem>
                      <SelectItem
                        value="Furniture"
                        className="text-[15px]"
                      >
                        Furniture
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={conditionFilter}
                    onValueChange={(v) => {
                      setConditionFilter(v);
                      setAssetPage(0);
                    }}
                  >
                    <SelectTrigger className="w-40 text-[15px] pr-2 [&>svg]:right-2">
                      <SelectValue placeholder="All Conditions" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem
                        value="all"
                        className="text-[15px]"
                      >
                        All Conditions
                      </SelectItem>
                      <SelectItem
                        value="new"
                        className="text-[15px]"
                      >
                        New
                      </SelectItem>
                      <SelectItem
                        value="good"
                        className="text-[15px]"
                      >
                        Good
                      </SelectItem>
                      <SelectItem
                        value="fair"
                        className="text-[15px]"
                      >
                        Fair
                      </SelectItem>
                      <SelectItem
                        value="poor"
                        className="text-[15px]"
                      >
                        Poor
                      </SelectItem>
                      <SelectItem
                        value="damaged"
                        className="text-[15px]"
                      >
                        Damaged
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={locationFilter}
                    onValueChange={(v) => {
                      setLocationFilter(v);
                      setAssetPage(0);
                    }}
                  >
                    <SelectTrigger className="w-40 text-[15px] pr-2 [&>svg]:right-2">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem
                        value="all"
                        className="text-[15px]"
                      >
                        All Locations
                      </SelectItem>
                      <SelectItem
                        value="Office"
                        className="text-[15px]"
                      >
                        Office
                      </SelectItem>
                      <SelectItem
                        value="Server Room"
                        className="text-[15px]"
                      >
                        Server Room
                      </SelectItem>
                      <SelectItem
                        value="Warehouse"
                        className="text-[15px]"
                      >
                        Warehouse
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={classificationFilter}
                    onValueChange={(v) => {
                      setClassificationFilter(v);
                      setAssetPage(0);
                    }}
                  >
                    <SelectTrigger className="w-36 h-10 text-[15px] pr-2 [&>svg]:right-2">
                      <SelectValue placeholder="Classification" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem
                        value="all"
                        className="text-[15px]"
                      >
                        All Classes
                      </SelectItem>
                      <SelectItem
                        value="Capital"
                        className="text-[15px]"
                      >
                        Capital
                      </SelectItem>
                      <SelectItem
                        value="Attractive"
                        className="text-[15px]"
                      >
                        Attractive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <ColumnToggle
                    columns={columns}
                    onToggle={toggleColumn}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast.info(
                            "Downloading assets as Excel...",
                          )
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>{error}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setError(null)}
                    >
                      Dismiss
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <TableSkeleton />
              ) : filteredAssets.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-auto max-h-[calc(100vh-420px)] scrollbar-hide">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {/* Select All checkbox */}
                          {/* <TableHead className="w-10">
                            <div className="flex justify-center items-center">
                              <MuiCheckbox
                                checked={allPageSelected}
                                onCheckedChange={toggleSelectAll}
                              />
                            </div>
                          </TableHead> */}
                          {visibleColumns.map((col) => (
                            <TableHead
                              key={col.key}
                              className="text-[15px]"
                            >
                              {col.label}
                            </TableHead>
                          ))}
                          <TableHead className="w-36 text-[15px]">
                            {t("common.actions")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Filter out locked assets */}
                        {pageData
                          .filter(
                            (asset) =>
                              !asset.isLocked &&
                              !isAssetLocked(asset.assetId),
                          )
                          .map((asset) => (
                            <TableRow
                              key={asset.id}
                              className={`/50 cursor-pointer ${selectedIds.has(asset.id) ? "bg-muted/30" : ""}`}
                              onClick={() =>
                                handleRowDoubleClick(asset)
                              }
                            >
                              {/* <TableCell
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                            >
                              <div className="flex justify-center items-center">
                                <MuiCheckbox
                                  checked={selectedIds.has(
                                    asset.id,
                                  )}
                                  onCheckedChange={() =>
                                    toggleSelectRow(asset.id)
                                  }
                                />
                              </div>
                            </TableCell> */}
                              {visibleColumns.map((col) => (
                                <TableCell
                                  key={col.key}
                                  className="text-foreground text-[15px]"
                                >
                                  {renderCell(asset, col.key)}
                                </TableCell>
                              ))}
                              <TableCell
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                              >
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreHorizontal className="w-4 h-4 rotate-90" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleRowDoubleClick(
                                          asset,
                                        )
                                      }
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        handleEditAsset(asset);
                                      }}
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    {/* <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => openRowChangeLocation(asset)}>
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Change Location
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openRowTransferAsset(asset)}>
                                    <TransferIcon className="w-4 h-4 mr-2" />
                                    Transfer Asset
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openRowChangeStatus(asset)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Change Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openRowScheduleInspection(asset)}>
                                    <InspectionIcon className="w-4 h-4 mr-2" />
                                    Schedule Inspection
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {asset.status ==="active" ? (
                                    <DropdownMenuItem onClick={() => toast.warning("Asset marked as missing")}>
                                      <AlertCircle className="w-4 h-4 mr-2" />
                                      Mark as Missing
                                    </DropdownMenuItem>
                                  ) : asset.status ==="missing" ? (
                                    <DropdownMenuItem onClick={() => toast.success("Asset marked as found")}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Mark as Found
                                    </DropdownMenuItem>
                                  ) : null}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setAssetToDelete(asset);
                                      setDeleteConfirmOpen(true);
                                    }}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Deactivate Asset
                                  </DropdownMenuItem> */}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                  <TablePagination
                    totalItems={filteredAssets.length}
                    page={assetPage}
                    rowsPerPage={assetRowsPerPage}
                    onPageChange={setAssetPage}
                    onRowsPerPageChange={setAssetRowsPerPage}
                    totalUnfilteredItems={assets.length}
                    itemLabel="assets"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 opacity-30 bg-muted rounded-lg flex items-center justify-center">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg mb-2">
                    {hasActiveFilters
                      ? "No results for current filters"
                      : "No assets found"}
                  </h3>
                  <p className="text-[15px] text-muted-foreground mb-4">
                    {hasActiveFilters
                      ? "Try adjusting your search criteria or removing some filters"
                      : "Get started by creating your first asset"}
                  </p>
                  {hasActiveFilters ? (
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                    >
                      <Filter className="w-4 h-4 mr-2" /> Clear
                      All Filters
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCreateDrawerOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {""}
                      {t("assets.createAsset")}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* ── Tracking Drawer ── */}
      <TrackingDrawer
        asset={trackingAsset}
        open={trackingDrawerOpen}
        onClose={() => setTrackingDrawerOpen(false)}
      />

      {/* ── Create Asset Side Drawer ── */}
      <Sheet
        open={createDrawerOpen}
        onOpenChange={handleCreateDrawerClose}
      >
        <SheetContent
          side="right"
          className="!w-full sm:!max-w-xl flex flex-col h-full p-0"
        >
          <SheetHeader className="pr-8 px-6 pt-6 pb-4 shrink-0">
            <SheetTitle className="text-[15px]">
              {editingAsset
                ? "Edit Asset"
                : editingDraft
                  ? "Complete Draft Registration"
                  : "Register New Asset"}
            </SheetTitle>
            <SheetDescription className="text-[14px]">
              {editingAsset
                ? "Update the asset details below. All required fields must be filled."
                : editingDraft
                  ? "Complete the asset registration by filling in the remaining required fields. Draft data has been prefilled."
                  : "Register a new asset in the system. Fill in all required fields to complete registration."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-6">
            {/* ── RFID / Identification ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Radio className="w-4 h-4 text-muted-foreground" />
                <span className="text-[14px] text-muted-foreground">
                  Identification
                </span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">
                      {t("assets.assetId")}
                      {""}
                      <span className="text-destructive">
                        *
                      </span>
                    </Label>
                    <Input
                      value={createForm.assetId}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          assetId: e.target.value,
                        })
                      }
                      placeholder="LAP-001234"
                      className={`h-[52px] text-[15px] placeholder:text-[14px] ${createFormErrors.assetId ? "border-destructive" : ""}`}
                    />
                    {createFormErrors.assetId && (
                      <p className="text-destructive text-xs">
                        {createFormErrors.assetId}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">
                      {t("assets.epc")}
                      {""}
                      <span className="text-destructive">
                        *
                      </span>
                    </Label>
                    <Input
                      value={createForm.epc}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          epc: e.target.value,
                        })
                      }
                      placeholder="E280116060000204..."
                      className={`h-[52px] text-[15px] placeholder:text-[14px] ${createFormErrors.epc ? "border-destructive" : ""}`}
                    />
                    {createFormErrors.epc && (
                      <p className="text-destructive text-xs">
                        {createFormErrors.epc}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">
                      {t("assets.barcode")}
                    </Label>
                    <Input
                      value={createForm.barcode}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          barcode: e.target.value,
                        })
                      }
                      placeholder="123456789012"
                      className="h-[52px] text-[15px] placeholder:text-[14px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">
                      Serial Number
                    </Label>
                    <Input
                      value={createForm.serialNumber || ""}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          serialNumber: e.target.value,
                        })
                      }
                      placeholder="SN123456789"
                      className="h-[52px] text-[15px] placeholder:text-[14px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* ── Asset Details ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Edit className="w-4 h-4 text-muted-foreground" />
                <span className="text-[14px] text-muted-foreground">
                  Asset Details
                </span>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">
                    {t("common.name")}
                    {""}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="Dell Latitude 5520"
                    className={`h-[52px] text-[15px] placeholder:text-[14px] ${createFormErrors.name ? "border-destructive" : ""}`}
                  />
                  {createFormErrors.name && (
                    <p className="text-destructive text-xs">
                      {createFormErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">
                    Description
                  </Label>
                  <Textarea
                    value={createForm.description}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter a detailed description of the asset..."
                    rows={3}
                    className="text-[15px] placeholder:text-[14px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">
                    Category{""}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={createForm.type}
                    onValueChange={(value) =>
                      setCreateForm({
                        ...createForm,
                        type: value,
                      })
                    }
                  >
                    <SelectTrigger
                      className={`h-[52px] text-[15px] pr-2 [&>svg]:right-2 ${createFormErrors.type ? "border-destructive" : ""}`}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem
                        value="Laptop"
                        className="text-[15px]"
                      >
                        Laptop
                      </SelectItem>
                      <SelectItem
                        value="Desktop"
                        className="text-[15px]"
                      >
                        Desktop
                      </SelectItem>
                      <SelectItem
                        value="Printer"
                        className="text-[15px]"
                      >
                        Printer
                      </SelectItem>
                      <SelectItem
                        value="Monitor"
                        className="text-[15px]"
                      >
                        Monitor
                      </SelectItem>
                      <SelectItem
                        value="Server"
                        className="text-[15px]"
                      >
                        Server
                      </SelectItem>
                      <SelectItem
                        value="Networking"
                        className="text-[15px]"
                      >
                        Networking
                      </SelectItem>
                      <SelectItem
                        value="Furniture"
                        className="text-[15px]"
                      >
                        Furniture
                      </SelectItem>
                      <SelectItem
                        value="Other"
                        className="text-[15px]"
                      >
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {createFormErrors.type && (
                    <p className="text-destructive text-xs">
                      {createFormErrors.type}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">
                    Condition
                  </Label>
                  <Select
                    value={createForm.condition || "good"}
                    onValueChange={(value) =>
                      setCreateForm({
                        ...createForm,
                        condition: value,
                      })
                    }
                  >
                    <SelectTrigger className="h-[52px] text-[15px] pr-2 [&>svg]:right-2">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem
                        value="excellent"
                        className="text-[15px]"
                      >
                        Excellent
                      </SelectItem>
                      <SelectItem
                        value="good"
                        className="text-[15px]"
                      >
                        Good
                      </SelectItem>
                      <SelectItem
                        value="fair"
                        className="text-[15px]"
                      >
                        Fair
                      </SelectItem>
                      <SelectItem
                        value="poor"
                        className="text-[15px]"
                      >
                        Poor
                      </SelectItem>
                      <SelectItem
                        value="damaged"
                        className="text-[15px]"
                      >
                        Damaged
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* ── Procurement Details ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-[14px] text-muted-foreground">
                  Procurement Details
                </span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">
                      PO Number
                    </Label>
                    <Input
                      value={createForm.poNumber || ""}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          poNumber: e.target.value,
                        })
                      }
                      placeholder="PO-2024-001234"
                      className="h-[52px] text-[15px] placeholder:text-[14px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">
                      GRN Number
                    </Label>
                    <Input
                      value={createForm.grnNumber || ""}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          grnNumber: e.target.value,
                        })
                      }
                      placeholder="GRN-2024-005678"
                      className="h-[52px] text-[15px] placeholder:text-[14px]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">
                    Supplier Name
                  </Label>
                  <Input
                    value={createForm.supplier || ""}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        supplier: e.target.value,
                      })
                    }
                    placeholder="Dell Technologies Inc."
                    className="h-[52px] text-[15px] placeholder:text-[14px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">
                    Acquisition Date
                  </Label>
                  <Input
                    type="date"
                    value={createForm.acquisitionDate || ""}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        acquisitionDate: e.target.value,
                      })
                    }
                    className="h-[52px] text-[15px]"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* ── Financial Details ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-[14px] text-muted-foreground">
                  Financial Details
                </span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">
                      Quantity
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={createForm.quantity || "1"}
                      onChange={(e) => {
                        const quantity = e.target.value;
                        const totalValue =
                          createForm.unitPrice && quantity
                            ? (
                                parseFloat(
                                  createForm.unitPrice,
                                ) * parseFloat(quantity)
                              ).toFixed(2)
                            : "";
                        const numValue = parseFloat(totalValue);
                        const autoClassification =
                          totalValue && numValue > 0
                            ? numValue >= 2000
                              ? "Capital"
                              : "Attractive"
                            : "";
                        setCreateForm({
                          ...createForm,
                          quantity,
                          totalValue,
                          classificationOverride:
                            autoClassification ||
                            createForm.classificationOverride,
                        });
                      }}
                      placeholder="1"
                      className="h-[52px] text-[15px] placeholder:text-[14px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">
                      Unit Price
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={createForm.unitPrice || ""}
                      onChange={(e) => {
                        const unitPrice = e.target.value;
                        const totalValue =
                          unitPrice && createForm.quantity
                            ? (
                                parseFloat(unitPrice) *
                                parseFloat(createForm.quantity)
                              ).toFixed(2)
                            : "";
                        const numValue = parseFloat(totalValue);
                        const autoClassification =
                          totalValue && numValue > 0
                            ? numValue >= 2000
                              ? "Capital"
                              : "Attractive"
                            : "";
                        setCreateForm({
                          ...createForm,
                          unitPrice,
                          totalValue,
                          classificationOverride:
                            autoClassification ||
                            createForm.classificationOverride,
                        });
                      }}
                      placeholder="1500.00"
                      className="h-[52px] text-[15px] placeholder:text-[14px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[15px] font-medium">
                      Currency
                    </Label>
                    <Select
                      value={createForm.currency || "USD"}
                      onValueChange={(value) =>
                        setCreateForm({
                          ...createForm,
                          currency: value,
                        })
                      }
                    >
                      <SelectTrigger className="h-[52px] text-[15px] pr-2 [&>svg]:right-2">
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                        <SelectItem
                          value="USD"
                          className="text-[15px]"
                        >
                          USD
                        </SelectItem>
                        <SelectItem
                          value="EUR"
                          className="text-[15px]"
                        >
                          EUR
                        </SelectItem>
                        <SelectItem
                          value="GBP"
                          className="text-[15px]"
                        >
                          GBP
                        </SelectItem>
                        <SelectItem
                          value="JPY"
                          className="text-[15px]"
                        >
                          JPY
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">
                    Total Value
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      createForm.totalValue ||
                      (createForm.unitPrice &&
                      createForm.quantity
                        ? (
                            parseFloat(createForm.unitPrice) *
                            parseFloat(createForm.quantity)
                          ).toFixed(2)
                        : "")
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = parseFloat(value);
                      const autoClassification =
                        numValue >= 2000
                          ? "Capital"
                          : "Attractive";
                      setCreateForm({
                        ...createForm,
                        totalValue: value,
                        classificationOverride:
                          value && numValue > 0
                            ? autoClassification
                            : createForm.classificationOverride,
                      });
                    }}
                    placeholder="1500.00"
                    className="h-[52px] text-[15px] placeholder:text-[14px]"
                  />
                </div>

                {/* Classification Field */}
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">
                    Classification
                  </Label>
                  <Select
                    value={createForm.classificationOverride}
                    onValueChange={(v) =>
                      setCreateForm({
                        ...createForm,
                        classificationOverride: v,
                      })
                    }
                  >
                    <SelectTrigger
                      className={`h-[52px] text-[15px] pr-2 [&>svg]:right-2 ${createFormErrors.classificationOverride ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem
                        value="Capital"
                        className="text-[15px]"
                      >
                        Capital
                      </SelectItem>
                      <SelectItem
                        value="Attractive"
                        className="text-[15px]"
                      >
                        Attractive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {createFormErrors.classificationOverride && (
                    <p className="text-xs text-red-500">
                      {createFormErrors.classificationOverride}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* ── Assignment ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-[14px] text-muted-foreground">
                  Assignment
                </span>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">
                    Field Office{""}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={createForm.fieldOffice}
                    onValueChange={(value) =>
                      setCreateForm({
                        ...createForm,
                        fieldOffice: value,
                        location: "",
                        responsiblePerson: "",
                      })
                    }
                  >
                    <SelectTrigger
                      className={`h-[52px] text-[15px] pr-2 [&>svg]:right-2 ${createFormErrors.fieldOffice ? "border-destructive" : ""}`}
                    >
                      <SelectValue placeholder="Select field office" />
                    </SelectTrigger>
                    <SelectContent
                      className="
    z-50
    w-[var(--radix-select-trigger-width)]
    bg-white dark:bg-[#1e2240]
  "
                    >
                      {FIELD_OFFICES.map((fo) => (
                        <SelectItem
                          key={fo.code}
                          value={fo.code}
                          className="text-[15px]"
                        >
                          {fo.code} - {fo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {createFormErrors.fieldOffice && (
                    <p className="text-destructive text-xs">
                      {createFormErrors.fieldOffice}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">
                    {t("common.location")}
                    {""}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={createForm.location}
                    onValueChange={(value) =>
                      setCreateForm({
                        ...createForm,
                        location: value,
                        responsiblePerson: "",
                      })
                    }
                    disabled={!createForm.fieldOffice}
                  >
                    <SelectTrigger
                      className={`h-[52px] text-[15px] pr-2 [&>svg]:right-2 ${createFormErrors.location ? "border-destructive" : ""}`}
                    >
                      <SelectValue
                        placeholder={
                          createForm.fieldOffice
                            ? "Select location"
                            : "Select a field office first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      {createForm.fieldOffice &&
                        FIELD_OFFICE_LOCATIONS[
                          createForm.fieldOffice
                        ]?.map((loc) => (
                          <SelectItem
                            key={loc}
                            value={loc}
                            className="text-[15px]"
                          >
                            {loc}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {createFormErrors.location && (
                    <p className="text-destructive text-xs">
                      {createFormErrors.location}
                    </p>
                  )}
                  {!createForm.fieldOffice && (
                    <p className="text-[14px] text-muted-foreground">
                      Please select a field office to view
                      available locations
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-medium">
                    Custodian
                  </Label>
                  <Select
                    value={createForm.responsiblePerson}
                    onValueChange={(value) =>
                      setCreateForm({
                        ...createForm,
                        responsiblePerson: value,
                      })
                    }
                    disabled={!createForm.location}
                  >
                    <SelectTrigger className="h-[52px] text-[15px] pr-2 [&>svg]:right-2">
                      <SelectValue
                        placeholder={
                          createForm.location
                            ? "Select custodian"
                            : "Select a location first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      {createForm.location &&
                        LOCATION_CUSTODIANS[
                          createForm.location
                        ]?.map((custodian) => (
                          <SelectItem
                            key={custodian}
                            value={custodian}
                            className="text-[15px]"
                          >
                            {custodian}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {!createForm.location && (
                    <p className="text-[14px] text-muted-foreground">
                      Please select a location to view available
                      custodians
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* ── Notes ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-[14px] text-muted-foreground">
                  Additional Notes
                </span>
              </div>
              <Textarea
                value={createForm.notes}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    notes: e.target.value,
                  })
                }
                placeholder="Add any additional notes about this asset..."
                rows={3}
                className="text-[15px] placeholder:text-[14px]"
              />
            </div>

            {/* ── Tips Card ── */}
            <div className="bg-muted/50 rounded-[4px] border p-4 mb-20">
              <p className="text-[14px] text-muted-foreground mb-2 font-medium">
                Registration Tips
              </p>
              <div className="space-y-1 text-[14px] text-muted-foreground">
                <p>
                  - Asset ID should be unique across the system
                </p>
                <p>- EPC code is read from the RFID tag</p>
                <p>- Barcode is optional but recommended</p>
                <p>
                  - Select appropriate asset type for
                  categorization
                </p>
                <p>
                  - Assets valued ≥ USD 2,000 are classified as
                  Capital Items
                </p>
                <p>
                  - Enter procurement details if available for
                  audit compliance
                </p>
              </div>
            </div>
          </div>

          {/* ── Fixed Footer ── */}
          <div className="shrink-0 border-t bg-background p-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleCreateDrawerClose(false)}
              className="text-[15px]"
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast.success("Draft saved successfully");
                handleCreateDrawerClose(false);
              }}
              className="text-[15px]"
            >
              Save Draft
            </Button>
            <Button
              onClick={handleCreateSubmit}
              className="text-[15px]"
            >
              {editingAsset
                ? "Update Asset"
                : editingDraft
                  ? "Complete & Publish"
                  : "Publish"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Bulk Transfer Drawer ── */}
      <InitiateTransferDrawer
        open={bulkTransferDrawerOpen}
        onOpenChange={setBulkTransferDrawerOpen}
        availableAssets={mapToTransferAssets}
        preSelectedAssetIds={selectedIds}
        onSubmit={handleBulkTransferSubmit}
      />

      {/* ── Bulk Inspection Drawer ── */}
      <InitiateInspectionDrawer
        open={bulkInspectionDrawerOpen}
        onOpenChange={setBulkInspectionDrawerOpen}
        availableAssets={mapToTransferAssets}
        preSelectedAssetIds={selectedIds}
        onSubmit={handleBulkInspectionSubmit}
      />

      {/* ── Bulk Survey Drawer ── */}
      <InitiateSurveyDrawer
        open={bulkSurveyDrawerOpen}
        onOpenChange={setBulkSurveyDrawerOpen}
        availableAssets={mapToTransferAssets}
        preSelectedAssetIds={selectedIds}
        onSubmit={handleBulkSurveySubmit}
      />

      {/* ── Bulk Disposal Drawer ── */}
      <InitiateDisposalDrawer
        open={bulkDisposalDrawerOpen}
        onOpenChange={setBulkDisposalDrawerOpen}
        availableAssets={mapToTransferAssets}
        preSelectedAssetIds={selectedIds}
        onSubmit={handleBulkDisposalSubmit}
      />

      {/* ── Bulk Change Status Drawer ── */}
      <ChangeStatusDrawer
        open={bulkChangeStatusDrawerOpen}
        onOpenChange={setBulkChangeStatusDrawerOpen}
        availableAssets={mapToTransferAssets}
        preSelectedAssetIds={selectedIds}
        onSubmit={handleBulkChangeStatusSubmit}
      />

      {/* ── Bulk Upload Drawer ── */}
      <FileUploadDrawer
        open={bulkUploadDrawerOpen}
        onOpenChange={setBulkUploadDrawerOpen}
        title="Bulk Upload Assets"
        description="Upload a CSV or Excel file containing asset data. Download the template first to ensure the correct format."
        acceptedTypes={[
          "text/csv",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ]}
        maxFiles={1}
        maxFileSize={50}
        onUploadComplete={(files) => {
          toast.success(
            `${files[0]?.name} uploaded — ${Math.floor(Math.random() * 50 + 10)} assets queued for validation`,
          );
        }}
      />

      {/* ── Delete Confirm Dialog ── */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Deactivate Asset"
        description={`Are you sure you want to deactivate asset"${assetToDelete?.name || ""}" (${assetToDelete?.assetId || ""})? The asset will be marked as inactive and removed from active inventory.`}
        confirmLabel="Deactivate"
        variant="warning"
        onConfirm={() => {
          toast.success(
            `Asset"${assetToDelete?.name}" has been deactivated`,
          );
          setAssetToDelete(null);
          setDeleteConfirmOpen(false);
        }}
      />

      {/* ── Row-level Change Location Drawer ── */}
      <Sheet
        open={rowChangeLocationOpen}
        onOpenChange={setRowChangeLocationOpen}
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
                  <p className="text-xs text-muted-foreground">
                    Asset
                  </p>
                  <p className="font-['Manrope'] font-medium">
                    {actionTargetAsset?.assetId}
                  </p>
                </div>
                {actionTargetAsset && (
                  <Badge
                    className={getStatusColor(
                      actionTargetAsset.status,
                    )}
                  >
                    {actionTargetAsset.status
                      .charAt(0)
                      .toUpperCase() +
                      actionTargetAsset.status.slice(1)}
                  </Badge>
                )}
              </div>
              <p className="text-[15px]">
                {actionTargetAsset?.name}
              </p>
              <div className="grid grid-cols-2 gap-3 text-[15px]">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Current Location
                  </p>
                  <p className="font-medium">
                    {actionTargetAsset?.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Current Field Office
                  </p>
                  <p className="font-medium">
                    {actionTargetAsset?.fieldOffice}
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
                value={rowNewLocation}
                onValueChange={setRowNewLocation}
              >
                <SelectTrigger className="h-[52px] text-[15px] pr-2 [&>svg]:right-2">
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
                value={rowNewFieldOffice}
                onValueChange={setRowNewFieldOffice}
              >
                <SelectTrigger className="h-[52px] text-[15px] pr-2 [&>svg]:right-2">
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
                value={rowLocationJustification}
                onChange={(e) =>
                  setRowLocationJustification(e.target.value)
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
                onClick={() => setRowChangeLocationOpen(false)}
                className="text-[15px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRowChangeLocationSubmit}
                disabled={
                  !rowNewLocation ||
                  !rowLocationJustification.trim()
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

      {/* ── Row-level Transfer Asset Drawer ── */}
      <Sheet
        open={rowTransferAssetOpen}
        onOpenChange={setRowTransferAssetOpen}
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
                  <p className="text-xs text-muted-foreground">
                    Asset
                  </p>
                  <p className="font-['Manrope'] font-medium">
                    {actionTargetAsset?.assetId}
                  </p>
                </div>
                {actionTargetAsset && (
                  <Badge
                    className={getStatusColor(
                      actionTargetAsset.status,
                    )}
                  >
                    {actionTargetAsset.status
                      .charAt(0)
                      .toUpperCase() +
                      actionTargetAsset.status.slice(1)}
                  </Badge>
                )}
              </div>
              <p className="text-[15px]">
                {actionTargetAsset?.name}
              </p>
              <div className="grid grid-cols-2 gap-3 text-[15px]">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Current Location
                  </p>
                  <p>{actionTargetAsset?.location}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Current Custodian
                  </p>
                  <p>{actionTargetAsset?.responsiblePerson}</p>
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
                value={rowTransferDestination}
                onValueChange={setRowTransferDestination}
              >
                <SelectTrigger className="h-[52px] text-[15px] pr-2 [&>svg]:right-2">
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
                value={rowTransferCustodian}
                onValueChange={setRowTransferCustodian}
              >
                <SelectTrigger className="h-[52px] text-[15px] pr-2 [&>svg]:right-2">
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
                value={rowTransferJustification}
                onChange={(e) =>
                  setRowTransferJustification(e.target.value)
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
                onClick={() => setRowTransferAssetOpen(false)}
                className="text-[15px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRowTransferSubmit}
                disabled={
                  !rowTransferDestination ||
                  !rowTransferCustodian ||
                  !rowTransferJustification.trim()
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

      {/* ── Row-level Change Status Drawer ── */}
      <Sheet
        open={rowChangeStatusOpen}
        onOpenChange={setRowChangeStatusOpen}
      >
        <SheetContent
          side="right"
          className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0"
        >
          <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
            <SheetTitle className="text-[15px] flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Change Asset Status
            </SheetTitle>
            <SheetDescription className="text-[14px]">
              Update the operational status for this asset.
              Changes will be recorded in the audit trail.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="rounded-[4px] border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Asset
                  </p>
                  <p className="font-['Manrope'] font-medium">
                    {actionTargetAsset?.assetId}
                  </p>
                </div>
                {actionTargetAsset && (
                  <Badge
                    className={getStatusColor(
                      actionTargetAsset.status,
                    )}
                  >
                    {actionTargetAsset.status
                      .charAt(0)
                      .toUpperCase() +
                      actionTargetAsset.status.slice(1)}
                  </Badge>
                )}
              </div>
              <p className="text-[15px]">
                {actionTargetAsset?.name}
              </p>
              <div className="grid grid-cols-2 gap-3 text-[15px]">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Type
                  </p>
                  <p>{actionTargetAsset?.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Location
                  </p>
                  <p>{actionTargetAsset?.location}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                New Status{" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Active",
                  "Inactive",
                  "Maintenance",
                  "In Transit",
                  "Missing",
                  "Disposed",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      setRowTargetStatus(s.toLowerCase())
                    }
                    className={`p-3 rounded-[4px] border text-left transition-all ${
                      rowTargetStatus === s.toLowerCase()
                        ? "border-[#121321] bg-[#121321]/5 dark:border-[#81CCD7] dark:bg-[#81CCD7]/10"
                        : "border-border[#121321]/40 dark:[#81CCD7]/40"
                    }`}
                  >
                    <Badge
                      className={`${getStatusColor(s.toLowerCase())} pointer-events-none`}
                    >
                      {s}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Justification{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={rowStatusJustification}
                onChange={(e) =>
                  setRowStatusJustification(e.target.value)
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
          </div>
          <div className="border-t px-6 py-4 shrink-0 bg-background">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setRowChangeStatusOpen(false)}
                className="text-[15px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRowChangeStatusSubmit}
                disabled={
                  !rowTargetStatus ||
                  !rowStatusJustification.trim()
                }
                className="text-[15px]"
              >
                <Edit className="w-4 h-4 mr-2" />
                Submit for Approval
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Row-level Schedule Inspection Drawer ── */}
      <Sheet
        open={rowScheduleInspectionOpen}
        onOpenChange={setRowScheduleInspectionOpen}
      >
        <SheetContent
          side="right"
          className="!w-full sm:!max-w-lg flex flex-col overflow-hidden p-0"
        >
          <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
            <SheetTitle className="text-[15px] flex items-center gap-2">
              <InspectionIcon className="w-5 h-5" />
              Schedule Inspection
            </SheetTitle>
            <SheetDescription className="text-[14px]">
              Schedule a physical verification or condition
              inspection for this asset.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="rounded-[4px] border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Asset
                  </p>
                  <p className="font-['Manrope'] font-medium">
                    {actionTargetAsset?.assetId}
                  </p>
                </div>
                {actionTargetAsset && (
                  <Badge
                    className={getConditionColor(
                      actionTargetAsset.condition,
                    )}
                  >
                    {actionTargetAsset.condition
                      .charAt(0)
                      .toUpperCase() +
                      actionTargetAsset.condition.slice(1)}
                  </Badge>
                )}
              </div>
              <p className="text-[15px]">
                {actionTargetAsset?.name}
              </p>
              <div className="grid grid-cols-2 gap-3 text-[15px]">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Location
                  </p>
                  <p>{actionTargetAsset?.location}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Current Condition
                  </p>
                  <p>{actionTargetAsset?.condition}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Inspection Type{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={rowInspectionType}
                onValueChange={setRowInspectionType}
              >
                <SelectTrigger className="h-[52px] text-[15px] pr-2 [&>svg]:right-2">
                  <SelectValue placeholder="Select inspection type" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="Physical Verification">
                    Physical Verification
                  </SelectItem>
                  <SelectItem value="Condition Assessment">
                    Condition Assessment
                  </SelectItem>
                  <SelectItem value="RFID Tag Verification">
                    RFID Tag Verification
                  </SelectItem>
                  <SelectItem value="Annual Survey">
                    Annual Survey
                  </SelectItem>
                  <SelectItem value="Spot Check">
                    Spot Check
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Scheduled Date{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={rowInspectionDate}
                onChange={(e) =>
                  setRowInspectionDate(e.target.value)
                }
                min={new Date().toISOString().split("T")[0]}
                className="h-[52px] text-[15px] placeholder:text-[14px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[15px] font-medium">
                Notes
              </Label>
              <Textarea
                value={rowInspectionNotes}
                onChange={(e) =>
                  setRowInspectionNotes(e.target.value)
                }
                placeholder="Additional instructions for the inspector (optional)..."
                rows={3}
                className="text-[15px] placeholder:text-[14px]"
              />
            </div>
          </div>
          <div className="border-t px-6 py-4 shrink-0 bg-background">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setRowScheduleInspectionOpen(false)
                }
                className="text-[15px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRowScheduleInspectionSubmit}
                disabled={
                  !rowInspectionType || !rowInspectionDate
                }
                className="text-[15px]"
              >
                <InspectionIcon className="w-4 h-4 mr-2" />
                Schedule Inspection
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
