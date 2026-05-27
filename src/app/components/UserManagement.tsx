import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { formatDate } from "../utils/dateFormatter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import QuickActions from "./shared/QuickActions";
import {
  TablePagination,
  paginateData,
} from "./shared/TablePagination";
import {
  Add as Plus,
  Search,
  Security as Shield,
  People as Users,
  Person as User,
  Refresh as RotateCcw,
  Visibility as Eye,
  Edit,
  Lock,
  LockOpen as Unlock,
  VpnKey as Key,
  History,
  ChevronLeft,
  Close as X,
  Business as Building2,
  Email as Mail,
  Event as Calendar,
  MoreHoriz,
  Delete as Trash2,
  Phone,
  Save,
  Download,
  CheckCircle,
  Block,
} from "@mui/icons-material";
import { toast } from "sonner";
import { mockFieldOffices } from "./locations/mockData";
import { mockLocationNodes } from "./locations/mockData";
import { Checkbox } from "./ui/checkbox";
import { ColumnToggle } from "./assets/ColumnToggle";
import type { ColumnConfig } from "./assets/types";

interface UserData {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  countryCode?: string;
  role: string;
  fieldOffice: string;
  status: "active" | "inactive" | "locked";
  lastLogin?: string;
  createdDate: string;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
}

type ViewMode = "list" | "detail" | "create" | "edit";

interface UserManagementProps {
  hideListHeader?: boolean;
  createTrigger?: number;
  onDetailViewChange?: (
    isDetail: boolean,
    userName?: string,
  ) => void;
}

const defaultColumns: ColumnConfig[] = [
  {
    key: "user",
    label: "User",
    visible: true,
    category: "default",
  },
  {
    key: "email",
    label: "Email",
    visible: true,
    category: "default",
  },
  {
    key: "role",
    label: "Role",
    visible: true,
    category: "default",
  },
  {
    key: "fieldOffice",
    label: "Field Office",
    visible: true,
    category: "default",
  },
  {
    key: "status",
    label: "Status",
    visible: true,
    category: "default",
  },
  {
    key: "created",
    label: "Created",
    visible: true,
    category: "default",
  },
];

// ─── Shared drawer field constants ───────────────────────────────────────────
// Single source of truth so every input, select, and label is identical.
const FIELD_H = "h-[52px]"; // uniform height for all inputs & selects
const FIELD_TEXT = "text-[15px]"; // body / field text
const LABEL_CLS = "text-[15px] font-medium leading-none";
const SECTION_HDR =
  "text-[13px] font-semibold uppercase tracking-wider text-muted-foreground pt-1";
const COUNTRY_W = "w-[120px]"; // country-code select width
const PH_TEXT =
  "placeholder:text-[14px] placeholder:text-muted-foreground/60";
const SELECT_CONTENT_CLS =
  "z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]";

export default function UserManagement({
  hideListHeader,
  createTrigger,
  onDetailViewChange,
}: UserManagementProps) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedUser, setSelectedUser] =
    useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [officeFilter, setOfficeFilter] =
    useState<string>("all");
  const [statusFilter, setStatusFilter] =
    useState<string>("all");
  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(10);
  const [columns, setColumns] =
    useState<ColumnConfig[]>(defaultColumns);

  useEffect(() => {
    if (createTrigger && createTrigger > 0) {
      handleCreateUser();
    }
  }, [createTrigger]);

  const [users] = useState<UserData[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@company.com",
      mobile: "1234567890",
      countryCode: "+1",
      role: "Admin",
      fieldOffice: "FO-AMM",
      status: "active",
      lastLogin: "2024-01-22 09:30:00",
      createdDate: "2024-01-01",
    },
    {
      id: "2",
      name: "John Doe",
      email: "john.doe@company.com",
      mobile: "9876543210",
      countryCode: "+66",
      role: "Manager",
      fieldOffice: "FO-BKK",
      status: "active",
      lastLogin: "2024-01-22 08:45:00",
      createdDate: "2024-01-10",
    },
    {
      id: "3",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      mobile: "5551234567",
      countryCode: "+855",
      role: "Inventory Staff",
      fieldOffice: "FO-PNH",
      status: "active",
      lastLogin: "2024-01-21 16:20:00",
      createdDate: "2024-01-15",
    },
    {
      id: "4",
      name: "Bob Wilson",
      email: "bob.wilson@company.com",
      mobile: "412345678",
      countryCode: "+61",
      role: "Inventory Staff",
      fieldOffice: "FO-MEL",
      status: "locked",
      lastLogin: "2024-01-18 14:10:00",
      createdDate: "2024-01-20",
    },
    {
      id: "5",
      name: "Alice Brown",
      email: "alice@company.com",
      mobile: "701234567",
      countryCode: "+93",
      role: "Manager",
      fieldOffice: "FO-AFA",
      status: "active",
      lastLogin: "2024-01-22 07:15:00",
      createdDate: "2024-01-12",
    },
  ]);

  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: "1",
      action: "Login",
      description: "User logged in successfully",
      timestamp: "2024-01-22 09:30:00",
      ipAddress: "192.168.1.100",
    },
    {
      id: "2",
      action: "Asset Transfer",
      description: "Created transfer request #TR-001",
      timestamp: "2024-01-22 09:45:00",
      ipAddress: "192.168.1.100",
    },
    {
      id: "3",
      action: "Inspection",
      description: "Completed inventory inspection #INV-045",
      timestamp: "2024-01-21 16:30:00",
      ipAddress: "192.168.1.100",
    },
    {
      id: "4",
      action: "Profile Update",
      description: "Updated email address",
      timestamp: "2024-01-20 10:15:00",
      ipAddress: "192.168.1.100",
    },
  ]);

  const fieldOffices = [
    { code: "FO-AMM", name: "Amman Office" },
    { code: "FO-AFA", name: "Afghanistan Office" },
    { code: "FO-BKK", name: "Bangkok Office" },
    { code: "FO-MEL", name: "Melbourne Office" },
    { code: "FO-PNH", name: "Phnom Penh Office" },
  ];

  const roles = [
    "Admin",
    "Manager",
    "Inventory Staff",
    "Custom Role A",
    "Custom Role B",
  ];

  const getFilteredUsers = () => {
    return users.filter((user) => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;
      const matchesOffice =
        officeFilter === "all" ||
        user.fieldOffice === officeFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      return (
        matchesSearch &&
        matchesRole &&
        matchesOffice &&
        matchesStatus
      );
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-300";
      case "inactive":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300";
      case "locked":
        return "bg-red-500/10 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
      case "Manager":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
      case "Inventory Staff":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-300";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300";
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleColumn = (key: string) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.key === key ? { ...c, visible: !c.visible } : c,
      ),
    );
  };

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    setViewMode("detail");
    setIsEditingProfile(false);
    if (onDetailViewChange) {
      onDetailViewChange(true, user.name);
    }
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setDrawerMode("edit");
    const fieldOfficeId =
      mockFieldOffices.find(
        (fo) => fo.code === user.fieldOffice,
      )?.id || "";
    setSelectedFieldOfficeInDrawer(fieldOfficeId);
    setSelectedLocations([]);
    const [firstName, ...rest] = user.name.split(" ");
    setDrawerForm({
      firstName: firstName || "",
      lastName: rest.join(" "),
      email: user.email,
      countryCode: user.countryCode || "+1",
      mobile: user.mobile || "",
      role: user.role,
    });
    setDrawerErrors({});
    setDrawerOpen(true);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<
    "create" | "edit"
  >("create");
  const [
    selectedFieldOfficeInDrawer,
    setSelectedFieldOfficeInDrawer,
  ] = useState<string>("");
  const [selectedLocations, setSelectedLocations] = useState<
    string[]
  >([]);
  const [drawerForm, setDrawerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+1",
    mobile: "",
    role: "",
  });
  const [drawerErrors, setDrawerErrors] = useState<
    Record<string, string>
  >({});

  const handleCreateUser = () => {
    setSelectedUser(null);
    setDrawerMode("create");
    setSelectedFieldOfficeInDrawer("");
    setSelectedLocations([]);
    setDrawerForm({
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+1",
      mobile: "",
      role: "",
    });
    setDrawerErrors({});
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedFieldOfficeInDrawer("");
    setSelectedLocations([]);
    setDrawerErrors({});
  };

  const [resetPasswordOpen, setResetPasswordOpen] =
    useState(false);
  const [isEditingProfile, setIsEditingProfile] =
    useState(false);
  const [profileEditForm, setProfileEditForm] = useState({
    name: "",
    email: "",
    mobile: "",
    countryCode: "",
    role: "",
    fieldOffice: "",
    status: "",
  });

  const handleDrawerSave = () => {
    const errors: Record<string, string> = {};
    if (!drawerForm.firstName.trim())
      errors.firstName = "First name is required";
    if (!drawerForm.lastName.trim())
      errors.lastName = "Last name is required";
    if (!drawerForm.email.trim())
      errors.email = "Email address is required";
    else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(drawerForm.email)
    )
      errors.email = "Enter a valid email address";
    if (!drawerForm.mobile.trim())
      errors.mobile = "Mobile number is required";
    if (!drawerForm.role) errors.role = "Role is required";
    if (!selectedFieldOfficeInDrawer)
      errors.fieldOffice = "Field office is required";

    if (Object.keys(errors).length > 0) {
      setDrawerErrors(errors);
      return;
    }
    setDrawerErrors({});

    const locationMessage =
      selectedLocations.length > 0
        ? ` with ${selectedLocations.length} location${selectedLocations.length > 1 ? "s" : ""} assigned`
        : "";

    toast.success(
      drawerMode === "create"
        ? `User created successfully${locationMessage}`
        : `User updated successfully${locationMessage}`,
    );
    setDrawerOpen(false);
  };

  const handleStartEditProfile = () => {
    if (selectedUser) {
      setProfileEditForm({
        name: selectedUser.name,
        email: selectedUser.email,
        mobile: selectedUser.mobile || "",
        countryCode: selectedUser.countryCode || "",
        role: selectedUser.role,
        fieldOffice: selectedUser.fieldOffice,
        status: selectedUser.status,
      });
      setIsEditingProfile(true);
    }
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
    setProfileEditForm({
      name: "",
      email: "",
      mobile: "",
      countryCode: "",
      role: "",
      fieldOffice: "",
      status: "",
    });
  };

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
    setIsEditingProfile(false);
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, ...profileEditForm });
    }
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedUser(null);
    setIsEditingProfile(false);
    if (onDetailViewChange) {
      onDetailViewChange(false, undefined);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setOfficeFilter("all");
    setStatusFilter("all");
    toast.success("Filters cleared");
  };

  // ─── Shared drawer body (reused in both list-view and detail-view) ──────────
  const DrawerBody = () => (
    <div className="flex-1 overflow-y-auto px-6 space-y-7 pb-6">
      {/* ── Section: Basic Information ───────────────────────────────── */}
      <div className="space-y-5">
        <p className={SECTION_HDR}>Basic Information</p>

        {/* First Name + Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="drawer-first-name"
              className={LABEL_CLS}
            >
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="drawer-first-name"
              placeholder="First name"
              value={drawerForm.firstName}
              onChange={(e) => {
                setDrawerForm((f) => ({
                  ...f,
                  firstName: e.target.value,
                }));
                setDrawerErrors((p) => ({
                  ...p,
                  firstName: "",
                }));
              }}
              className={`${FIELD_H} ${FIELD_TEXT} ${PH_TEXT} ${drawerErrors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {drawerErrors.firstName && (
              <p className="text-[13px] text-red-500">
                {drawerErrors.firstName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="drawer-last-name"
              className={LABEL_CLS}
            >
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="drawer-last-name"
              placeholder="Last name"
              value={drawerForm.lastName}
              onChange={(e) => {
                setDrawerForm((f) => ({
                  ...f,
                  lastName: e.target.value,
                }));
                setDrawerErrors((p) => ({
                  ...p,
                  lastName: "",
                }));
              }}
              className={`${FIELD_H} ${FIELD_TEXT} ${PH_TEXT} ${drawerErrors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {drawerErrors.lastName && (
              <p className="text-[13px] text-red-500">
                {drawerErrors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="drawer-email" className={LABEL_CLS}>
            Email Address{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="drawer-email"
            type="email"
            placeholder="user@company.com"
            value={drawerForm.email}
            onChange={(e) => {
              setDrawerForm((f) => ({
                ...f,
                email: e.target.value,
              }));
              setDrawerErrors((p) => ({ ...p, email: "" }));
            }}
            className={`${FIELD_H} ${FIELD_TEXT} ${PH_TEXT} ${drawerErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {drawerErrors.email && (
            <p className="text-[13px] text-red-500">
              {drawerErrors.email}
            </p>
          )}
        </div>

        {/* Mobile */}
        <div className="space-y-2">
          <Label htmlFor="drawer-mobile" className={LABEL_CLS}>
            Phone Number
          </Label>
          <div className="flex gap-2 h-[52px]">
            <Select
              value={drawerForm.countryCode}
              onValueChange={(v) =>
                setDrawerForm((f) => ({ ...f, countryCode: v }))
              }
            >
              <SelectTrigger
                className="
    w-[120px]
    h-[52px]
    min-h-[52px]
    px-3
    text-[15px]
    leading-none
    flex
    items-center
    shrink-0
    pr-8
    [&>span]:flex
    [&>span]:items-center
    [&>span]:leading-none
    [&>svg]:right-3
                pr-2 [&>svg]:right-2
  "
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={SELECT_CONTENT_CLS}>
                <SelectItem className="text-[15px]" value="+1">
                  🇺🇸 +1
                </SelectItem>
                <SelectItem className="text-[15px]" value="+44">
                  🇬🇧 +44
                </SelectItem>
                <SelectItem
                  className="text-[15px]"
                  value="+962"
                >
                  🇯🇴 +962
                </SelectItem>
                <SelectItem className="text-[15px]" value="+66">
                  🇹🇭 +66
                </SelectItem>
                <SelectItem className="text-[15px]" value="+61">
                  🇦🇺 +61
                </SelectItem>
                <SelectItem
                  className="text-[15px]"
                  value="+855"
                >
                  🇰🇭 +855
                </SelectItem>
                <SelectItem className="text-[15px]" value="+93">
                  🇦🇫 +93
                </SelectItem>
                <SelectItem className="text-[15px]" value="+91">
                  🇮🇳 +91
                </SelectItem>
                <SelectItem className="text-[15px]" value="+49">
                  🇩🇪 +49
                </SelectItem>
                <SelectItem className="text-[15px]" value="+33">
                  🇫🇷 +33
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="tel"
              value={drawerForm.mobile}
              onChange={(e) => {
                setDrawerForm((f) => ({
                  ...f,
                  mobile: e.target.value,
                }));
                setDrawerErrors((p) => ({ ...p, mobile: "" }));
              }}
              placeholder="Enter phone number"
              className={`h-[52px] text-[15px] placeholder:text-[14px] flex-1 ${drawerErrors.mobile ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
          </div>
          {drawerErrors.mobile && (
            <p className="text-[13px] text-red-500">
              {drawerErrors.mobile}
            </p>
          )}
        </div>
      </div>

      {/* ── Section: Access Control ──────────────────────────────────── */}
      <div className="space-y-5">
        <p className={SECTION_HDR}>Access Control</p>

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="drawer-role" className={LABEL_CLS}>
            Role <span className="text-red-500">*</span>
          </Label>
          <Select
            value={drawerForm.role}
            onValueChange={(v) => {
              setDrawerForm((f) => ({ ...f, role: v }));
              setDrawerErrors((p) => ({ ...p, role: "" }));
            }}
          >
            <SelectTrigger
              id="drawer-role"
              className={`${FIELD_H} ${FIELD_TEXT} pr-2 [&>svg]:right-2 [&>svg]:w-4 [&>svg]:h-4 ${drawerErrors.role ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent className={SELECT_CONTENT_CLS}>
              {roles.map((role) => (
                <SelectItem
                  key={role}
                  value={role}
                  className={FIELD_TEXT}
                >
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {drawerErrors.role && (
            <p className="text-[13px] text-red-500">
              {drawerErrors.role}
            </p>
          )}
        </div>

        {/* Field Office */}
        <div className="space-y-2">
          <Label htmlFor="drawer-office" className={LABEL_CLS}>
            Field Office <span className="text-red-500">*</span>
          </Label>
          <Select
            value={
              selectedFieldOfficeInDrawer
                ? mockFieldOffices.find(
                    (fo) =>
                      fo.id === selectedFieldOfficeInDrawer,
                  )?.code || ""
                : ""
            }
            onValueChange={(value) => {
              setSelectedFieldOfficeInDrawer(
                mockFieldOffices.find((fo) => fo.code === value)
                  ?.id || "",
              );
              setSelectedLocations([]);
              setDrawerErrors((p) => ({
                ...p,
                fieldOffice: "",
              }));
            }}
          >
            <SelectTrigger
              id="drawer-office"
              className={`${FIELD_H} ${FIELD_TEXT} pr-2 [&>svg]:right-2 [&>svg]:w-4 [&>svg]:h-4 ${drawerErrors.fieldOffice ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select field office" />
            </SelectTrigger>
            <SelectContent
              className={`${FIELD_TEXT}
  z-50
  w-[var(--radix-select-trigger-width)]
  bg-white dark:bg-[#1e2240]
`}
            >
              {mockFieldOffices.map((office) => (
                <SelectItem
                  key={office.code}
                  value={office.code}
                  className={FIELD_TEXT}
                >
                  {office.code} — {office.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {drawerErrors.fieldOffice ? (
            <p className="text-[13px] text-red-500">
              {drawerErrors.fieldOffice}
            </p>
          ) : (
            <p className="text-[13px] text-muted-foreground">
              User will only have access to data from this field
              office
            </p>
          )}
        </div>

        {/* Assigned Locations */}
        <div className="space-y-2">
          <Label className={LABEL_CLS}>
            Assigned Locations{" "}
            <span className="font-normal text-muted-foreground">
              (Optional)
            </span>
          </Label>

          {!selectedFieldOfficeInDrawer ? (
            <div className="rounded-md border bg-muted/40 px-4 py-3 text-[14px] text-muted-foreground">
              Select a field office above to assign locations
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden max-h-[220px] overflow-y-auto divide-y">
              {mockLocationNodes
                .filter(
                  (loc) =>
                    loc.fieldOfficeId ===
                    selectedFieldOfficeInDrawer,
                )
                .map((location) => {
                  const locationType = mockFieldOffices
                    .find(
                      (fo) =>
                        fo.id === selectedFieldOfficeInDrawer,
                    )
                    ?.locationTypes.find(
                      (t) => t.id === location.locationTypeId,
                    );

                  return (
                    <label
                      key={location.id}
                      htmlFor={`location-${location.id}`}
                      className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
                    >
                      <Checkbox
                        id={`location-${location.id}`}
                        checked={selectedLocations.includes(
                          location.id,
                        )}
                        onCheckedChange={(checked) => {
                          setSelectedLocations((prev) =>
                            checked
                              ? [...prev, location.id]
                              : prev.filter(
                                  (id) => id !== location.id,
                                ),
                          );
                        }}
                        className="shrink-0"
                      />
                      <div className="flex items-center gap-2 min-w-0">
                        {locationType && (
                          <span
                            className="w-2.5 h-2.5 rounded-sm shrink-0"
                            style={{
                              backgroundColor:
                                locationType.color,
                            }}
                          />
                        )}
                        <span
                          className={`font-medium ${FIELD_TEXT} truncate`}
                        >
                          {location.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[12px] shrink-0"
                        >
                          {location.code}
                        </Badge>
                        <span className="text-[13px] text-muted-foreground shrink-0">
                          {locationType?.name}
                        </span>
                      </div>
                    </label>
                  );
                })}
              {mockLocationNodes.filter(
                (loc) =>
                  loc.fieldOfficeId ===
                  selectedFieldOfficeInDrawer,
              ).length === 0 && (
                <div className="px-4 py-6 text-center text-[14px] text-muted-foreground">
                  No locations available for this field office
                </div>
              )}
            </div>
          )}

          {selectedLocations.length > 0 && (
            <p className="text-[13px] text-muted-foreground">
              ✓ {selectedLocations.length} location
              {selectedLocations.length > 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {/* Account Status — only shown in edit mode */}
        {selectedUser && (
          <div className="space-y-2">
            <Label
              htmlFor="drawer-status"
              className={LABEL_CLS}
            >
              Account Status
            </Label>
            <Select
              defaultValue={selectedUser.status || "active"}
            >
              <SelectTrigger
                id="drawer-status"
                className={`${FIELD_H} ${FIELD_TEXT} pr-2 [&>svg]:right-2 [&>svg]:w-4 [&>svg]:h-4`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={SELECT_CONTENT_CLS}>
                <SelectItem
                  value="active"
                  className={FIELD_TEXT}
                >
                  Active
                </SelectItem>
                <SelectItem
                  value="inactive"
                  className={FIELD_TEXT}
                >
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* ── Tips ─────────────────────────────────────────────────────── */}
      <div className="rounded-md border bg-muted/40 px-4 py-4 space-y-1.5">
        <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">
          Tips
        </p>
        <ul className="space-y-1 text-[14px] text-muted-foreground list-none">
          <li>
            • Field Office assignment determines data access
            scope
          </li>
          <li>
            • Assign locations to restrict access within the
            office
          </li>
          <li>
            • Users can only view assets from their assigned
            locations
          </li>
          <li>
            • Role determines what actions the user can perform
          </li>
        </ul>
      </div>
    </div>
  );

  // ─── Shared drawer footer ────────────────────────────────────────────────────
  const DrawerFooter = ({
    onClose,
  }: {
    onClose: () => void;
  }) => (
    <div className="shrink-0 border-t bg-background px-6 py-4">
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className={`${FIELD_TEXT} px-5`}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDrawerSave}
          className={`${FIELD_TEXT} px-5`}
        >
          {drawerMode === "edit" ? "Save Changes" : "Add User"}
        </Button>
      </div>
    </div>
  );

  // ─── User Detail View ────────────────────────────────────────────────────────
  if (viewMode === "detail" && selectedUser) {
    return (
      <div className="space-y-6">
        {/* Create/Edit User Drawer (accessible from detail view) */}
        <Sheet
          open={drawerOpen}
          onOpenChange={(open) => {
            if (!open) handleDrawerClose();
          }}
        >
          <SheetContent
            side="right"
            className="!w-full sm:!max-w-xl flex flex-col h-full p-0"
          >
            <SheetHeader className="pr-8 px-6 pt-6 pb-4 shrink-0 border-b">
              <SheetTitle className={FIELD_TEXT}>
                {drawerMode === "edit"
                  ? "Edit User"
                  : "Add User"}
              </SheetTitle>
              <SheetDescription className="text-[14px]">
                {drawerMode === "edit"
                  ? `Editing details for ${selectedUser?.name}`
                  : "Fill in all required fields to complete registration."}
              </SheetDescription>
            </SheetHeader>
            <DrawerBody />
            <DrawerFooter onClose={handleDrawerClose} />
          </SheetContent>
        </Sheet>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[14px]">
          <button
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Users
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium">
            {selectedUser?.name}
          </span>
        </div>

        {/* Reset Password Drawer */}
        <Sheet
          open={resetPasswordOpen}
          onOpenChange={(open) => {
            if (!open) setResetPasswordOpen(false);
          }}
        >
          <SheetContent
            side="right"
            className="!w-full sm:!max-w-xl flex flex-col h-full p-0"
          >
            <SheetHeader className="pr-8 px-6 pt-6 pb-4 shrink-0 border-b">
              <SheetTitle className={FIELD_TEXT}>
                Reset Password
              </SheetTitle>
              <SheetDescription className="text-[14px]">
                Reset the password for {selectedUser.name}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 space-y-7 pb-6">
              {/* User summary */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md border mt-6">
                <Avatar>
                  <AvatarFallback>
                    {getUserInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className={`font-medium ${FIELD_TEXT}`}>
                    {selectedUser.name}
                  </p>
                  <p className="text-[14px] text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              {/* Reset Method */}
              <div className="space-y-5">
                <p className={SECTION_HDR}>Reset Method</p>
                <div className="space-y-2">
                  <Label
                    htmlFor="reset-method"
                    className={LABEL_CLS}
                  >
                    Method{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select defaultValue="manual">
                    <SelectTrigger
                      id="reset-method"
                      className={`${FIELD_H} ${FIELD_TEXT} pr-2 [&>svg]:right-2 [&>svg]:w-4 [&>svg]:h-4`}
                    >
                      <SelectValue placeholder="Select reset method" />
                    </SelectTrigger>
                    <SelectContent className={SELECT_CONTENT_CLS}>
                      <SelectItem
                        value="manual"
                        className={FIELD_TEXT}
                      >
                        Set password manually
                      </SelectItem>
                      <SelectItem
                        value="email"
                        className={FIELD_TEXT}
                      >
                        Send reset link via email
                      </SelectItem>
                      <SelectItem
                        value="temporary"
                        className={FIELD_TEXT}
                      >
                        Generate temporary password
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-5">
                <p className={SECTION_HDR}>New Password</p>
                <div className="space-y-2">
                  <Label
                    htmlFor="new-password"
                    className={LABEL_CLS}
                  >
                    New Password{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    className={`${FIELD_H} ${FIELD_TEXT} ${PH_TEXT}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirm-password"
                    className={LABEL_CLS}
                  >
                    Confirm Password{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    className={`${FIELD_H} ${FIELD_TEXT} ${PH_TEXT}`}
                  />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-5">
                <p className={SECTION_HDR}>Options</p>
                <div className="space-y-3">
                  {[
                    {
                      id: "force-change",
                      label:
                        "Require password change on next login",
                      defaultChecked: true,
                    },
                    {
                      id: "notify-user",
                      label: "Notify user via email",
                      defaultChecked: true,
                    },
                    {
                      id: "revoke-sessions",
                      label: "Revoke all active sessions",
                      defaultChecked: false,
                    },
                  ].map(({ id, label, defaultChecked }) => (
                    <div
                      key={id}
                      className="flex items-center gap-3"
                    >
                      <Checkbox
                        id={id}
                        defaultChecked={defaultChecked}
                      />
                      <Label
                        htmlFor={id}
                        className={`${FIELD_TEXT} font-medium cursor-pointer`}
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="rounded-md border bg-muted/40 px-4 py-4 space-y-1.5">
                <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Password Requirements
                </p>
                <ul className="space-y-1 text-[14px] text-muted-foreground">
                  {[
                    "Minimum 8 characters",
                    "At least one uppercase letter",
                    "At least one lowercase letter",
                    "At least one number",
                    "At least one special character (!@#$%^&*)",
                  ].map((req) => (
                    <li key={req}>• {req}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="shrink-0 border-t bg-background px-6 py-4">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setResetPasswordOpen(false)}
                  className={`${FIELD_TEXT} px-5`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast.success(
                      `Password reset successfully for ${selectedUser.name}`,
                    );
                    setResetPasswordOpen(false);
                  }}
                  className={`${FIELD_TEXT} px-5`}
                >
                  Reset Password
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Profile Information Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Profile Information</CardTitle>
            {!isEditingProfile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartEditProfile}
                className="h-8 w-8 p-0"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <Label className="text-[14px] text-muted-foreground">
                  Full Name
                </Label>
                {isEditingProfile ? (
                  <Input
                    value={profileEditForm.name}
                    onChange={(e) =>
                      setProfileEditForm({
                        ...profileEditForm,
                        name: e.target.value,
                      })
                    }
                    className={`mt-1.5 ${FIELD_H} ${FIELD_TEXT}`}
                  />
                ) : (
                  <p
                    className={`font-medium mt-1.5 ${FIELD_TEXT}`}
                  >
                    {selectedUser.name}
                  </p>
                )}
              </div>
              {/* Email */}
              <div>
                <Label className="text-[14px] text-muted-foreground">
                  Email Address
                </Label>
                {isEditingProfile ? (
                  <Input
                    type="email"
                    value={profileEditForm.email}
                    onChange={(e) =>
                      setProfileEditForm({
                        ...profileEditForm,
                        email: e.target.value,
                      })
                    }
                    className={`mt-1.5 ${FIELD_H} ${FIELD_TEXT}`}
                  />
                ) : (
                  <p
                    className={`font-medium mt-1.5 ${FIELD_TEXT}`}
                  >
                    {selectedUser.email}
                  </p>
                )}
              </div>
              {/* Mobile */}
              <div>
                <Label className="text-[14px] text-muted-foreground">
                  Mobile Number
                </Label>
                {isEditingProfile ? (
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      value={profileEditForm.countryCode}
                      onChange={(e) =>
                        setProfileEditForm({
                          ...profileEditForm,
                          countryCode: e.target.value,
                        })
                      }
                      className={`w-24 ${FIELD_H} ${FIELD_TEXT}`}
                      placeholder="+1"
                    />
                    <Input
                      value={profileEditForm.mobile}
                      onChange={(e) =>
                        setProfileEditForm({
                          ...profileEditForm,
                          mobile: e.target.value,
                        })
                      }
                      className={`flex-1 ${FIELD_H} ${FIELD_TEXT}`}
                    />
                  </div>
                ) : (
                  <p
                    className={`font-medium mt-1.5 ${FIELD_TEXT}`}
                  >
                    {selectedUser.countryCode}{" "}
                    {selectedUser.mobile}
                  </p>
                )}
              </div>
              {/* Role */}
              <div>
                <Label className="text-[14px] text-muted-foreground">
                  Role
                </Label>
                {isEditingProfile ? (
                  <Select
                    value={profileEditForm.role}
                    onValueChange={(value) =>
                      setProfileEditForm({
                        ...profileEditForm,
                        role: value,
                      })
                    }
                  >
                    <SelectTrigger
                      className={`mt-1.5 ${FIELD_H} ${FIELD_TEXT} pr-2 [&>svg]:right-2`}
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className={SELECT_CONTENT_CLS}>
                      {[
                        "Admin",
                        "Manager",
                        "Inventory Staff",
                        "Auditor",
                      ].map((r) => (
                        <SelectItem
                          key={r}
                          value={r}
                          className={FIELD_TEXT}
                        >
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p
                    className={`font-medium mt-1.5 ${FIELD_TEXT}`}
                  >
                    {selectedUser.role}
                  </p>
                )}
              </div>
              {/* Field Office */}
              <div>
                <Label className="text-[14px] text-muted-foreground">
                  Field Office
                </Label>
                {isEditingProfile ? (
                  <Select
                    value={profileEditForm.fieldOffice}
                    onValueChange={(value) =>
                      setProfileEditForm({
                        ...profileEditForm,
                        fieldOffice: value,
                      })
                    }
                  >
                    <SelectTrigger
                      className={`mt-1.5 ${FIELD_H} ${FIELD_TEXT} pr-2 [&>svg]:right-2`}
                    >
                      <SelectValue placeholder="Select office" />
                    </SelectTrigger>
                    <SelectContent className={SELECT_CONTENT_CLS}>
                      {mockFieldOffices.map((office) => (
                        <SelectItem
                          key={office.id}
                          value={office.code}
                          className={FIELD_TEXT}
                        >
                          {office.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p
                    className={`font-medium mt-1.5 ${FIELD_TEXT}`}
                  >
                    {selectedUser.fieldOffice}
                  </p>
                )}
              </div>
              {/* Status */}
              <div>
                <Label className="text-[14px] text-muted-foreground">
                  Account Status
                </Label>
                {isEditingProfile ? (
                  <Select
                    value={profileEditForm.status}
                    onValueChange={(value) =>
                      setProfileEditForm({
                        ...profileEditForm,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger
                      className={`mt-1.5 ${FIELD_H} ${FIELD_TEXT} pr-2 [&>svg]:right-2`}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className={SELECT_CONTENT_CLS}>
                      <SelectItem
                        value="active"
                        className={FIELD_TEXT}
                      >
                        Active
                      </SelectItem>
                      <SelectItem
                        value="inactive"
                        className={FIELD_TEXT}
                      >
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p
                    className={`font-medium mt-1.5 ${FIELD_TEXT}`}
                  >
                    {selectedUser.status
                      .charAt(0)
                      .toUpperCase() +
                      selectedUser.status.slice(1)}
                  </p>
                )}
              </div>
              {/* Created Date */}
              <div>
                <Label className="text-[14px] text-muted-foreground">
                  Created Date
                </Label>
                <p
                  className={`font-medium mt-1.5 ${FIELD_TEXT}`}
                >
                  {formatDate(selectedUser.createdDate)}
                </p>
              </div>
            </div>
            {isEditingProfile && (
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleCancelEditProfile}
                  className={FIELD_TEXT}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  className={FIELD_TEXT}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── User List View ──────────────────────────────────────────────────────────
  const filteredUsers = getFilteredUsers();

  return (
    <div className="space-y-6">
      {!hideListHeader && (
        <div className="flex items-center justify-end">
          <Button
            onClick={handleCreateUser}
            className={FIELD_TEXT}
          >
            Add User
          </Button>
        </div>
      )}

      {/* Create/Edit User Drawer */}
      <Sheet
        open={drawerOpen}
        onOpenChange={(open) => {
          if (!open) handleDrawerClose();
        }}
      >
        <SheetContent
          side="right"
          className="!w-full sm:!max-w-xl flex flex-col h-full p-0"
        >
          <SheetHeader className="pr-8 px-6 pt-6 pb-4 shrink-0 border-b">
            <SheetTitle className={FIELD_TEXT}>
              {drawerMode === "edit" ? "Edit User" : "Add User"}
            </SheetTitle>
            <SheetDescription className="text-[14px]">
              {drawerMode === "edit"
                ? `Editing details for ${selectedUser?.name}`
                : "Fill in all required fields to complete registration."}
            </SheetDescription>
          </SheetHeader>
          <DrawerBody />
          <DrawerFooter onClose={handleDrawerClose} />
        </SheetContent>
      </Sheet>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: users.length,
            Icon: Users,
          },
          {
            label: "Active Users",
            value: users.filter((u) => u.status === "active")
              .length,
            Icon: CheckCircle,
          },
          {
            label: "Inactive Users",
            value: users.filter((u) => u.status === "inactive")
              .length,
            Icon: Block,
          },
          {
            label: "Locked Accounts",
            value: users.filter((u) => u.status === "locked")
              .length,
            Icon: Lock,
          },
        ].map(({ label, value, Icon }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-muted-foreground font-medium">
                    {label}
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {value}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-[#f7f7f8] dark:bg-[#f7f7f8]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-7 h-7 text-[#121321] dark:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters + Table */}
      <Card>
        <CardHeader>
          <div className="flex gap-3 items-center flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 ${FIELD_TEXT}`}
              />
            </div>
            {[
              {
                value: roleFilter,
                onChange: setRoleFilter,
                placeholder: "All Roles",
                options: roles.map((r) => ({
                  value: r,
                  label: r,
                })),
              },
              {
                value: officeFilter,
                onChange: setOfficeFilter,
                placeholder: "All Field Offices",
                options: fieldOffices.map((o) => ({
                  value: o.code,
                  label: o.code,
                })),
              },
              {
                value: statusFilter,
                onChange: setStatusFilter,
                placeholder: "All Status",
                options: [
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "locked", label: "Locked" },
                ],
              },
            ].map(
              ({ value, onChange, placeholder, options }) => (
                <Select
                  key={placeholder}
                  value={value}
                  onValueChange={onChange}
                >
                  <SelectTrigger
                    className={`w-44 h-10 ${FIELD_TEXT} pr-2 [&>svg]:right-2`}
                  >
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent className={SELECT_CONTENT_CLS}>
                    <SelectItem
                      value="all"
                      className={FIELD_TEXT}
                    >
                      {placeholder}
                    </SelectItem>
                    {options.map((o) => (
                      <SelectItem
                        key={o.value}
                        value={o.value}
                        className={FIELD_TEXT}
                      >
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ),
            )}
            {(searchQuery ||
              roleFilter !== "all" ||
              officeFilter !== "all" ||
              statusFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className={FIELD_TEXT}
              >
                <X className="w-4 h-4 mr-1.5" /> Clear
              </Button>
            )}
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
                    toast.info("Downloading users as Excel…")
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
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-auto max-h-[calc(100vh-420px)] scrollbar-hide">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns
                      .filter((col) => col.visible)
                      .map((col) => (
                        <TableHead
                          key={col.key}
                          className={FIELD_TEXT}
                        >
                          {col.label}
                        </TableHead>
                      ))}
                    <TableHead className={`w-24 ${FIELD_TEXT}`}>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginateData(
                    filteredUsers,
                    userPage,
                    userRowsPerPage,
                  ).map((user) => (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer"
                      onClick={() => handleViewUser(user)}
                    >
                      {columns
                        .filter((col) => col.visible)
                        .map((col) => {
                          if (col.key === "user")
                            return (
                              <TableCell
                                key={col.key}
                                className={FIELD_TEXT}
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback>
                                      {getUserInitials(
                                        user.name,
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">
                                    {user.name}
                                  </span>
                                </div>
                              </TableCell>
                            );
                          if (col.key === "email")
                            return (
                              <TableCell
                                key={col.key}
                                className={FIELD_TEXT}
                              >
                                {user.email}
                              </TableCell>
                            );
                          if (col.key === "role")
                            return (
                              <TableCell
                                key={col.key}
                                className={FIELD_TEXT}
                              >
                                {user.role}
                              </TableCell>
                            );
                          if (col.key === "fieldOffice")
                            return (
                              <TableCell
                                key={col.key}
                                className={FIELD_TEXT}
                              >
                                {user.fieldOffice}
                              </TableCell>
                            );
                          if (col.key === "status")
                            return (
                              <TableCell
                                key={col.key}
                                className={FIELD_TEXT}
                              >
                                {user.status
                                  .charAt(0)
                                  .toUpperCase() +
                                  user.status.slice(1)}
                              </TableCell>
                            );
                          if (col.key === "created")
                            return (
                              <TableCell
                                key={col.key}
                                className={FIELD_TEXT}
                              >
                                {formatDate(user.createdDate)}
                              </TableCell>
                            );
                          if (col.key === "mobile")
                            return (
                              <TableCell
                                key={col.key}
                                className={FIELD_TEXT}
                              >
                                {user.mobile
                                  ? `${user.countryCode} ${user.mobile}`
                                  : "—"}
                              </TableCell>
                            );
                          if (col.key === "lastLogin")
                            return (
                              <TableCell
                                key={col.key}
                                className={`${FIELD_TEXT} text-muted-foreground`}
                              >
                                {user.lastLogin
                                  ? formatDate(user.lastLogin)
                                  : "—"}
                              </TableCell>
                            );
                          return (
                            <TableCell key={col.key}>
                              —
                            </TableCell>
                          );
                        })}
                      <TableCell
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHoriz className="w-4 h-4 rotate-90" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleEditUser(user)
                              }
                            >
                              <Edit className="w-4 h-4 mr-2" />{" "}
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toast.info(
                                  `${user.status === "active" ? "Deactivate" : "Activate"} user: ${user.name}`,
                                )
                              }
                            >
                              {user.status === "active" ? (
                                <>
                                  <Lock className="w-4 h-4 mr-2" />{" "}
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-4 h-4 mr-2" />{" "}
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toast.info(
                                  `Delete user: ${user.name}`,
                                )
                              }
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />{" "}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              totalItems={filteredUsers.length}
              page={userPage}
              rowsPerPage={userRowsPerPage}
              onPageChange={setUserPage}
              onRowsPerPageChange={setUserRowsPerPage}
              totalUnfilteredItems={users.length}
              itemLabel="users"
            />
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className={FIELD_TEXT}>
                No users found matching your criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
