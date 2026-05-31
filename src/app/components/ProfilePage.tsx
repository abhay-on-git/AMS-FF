// TODO: Delete after LegacyApp decommission
// Replaced by src/features/profile/
import React, { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BuildingIcon,
  LocationOn as MapPinIcon,
  VpnKey as KeyIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as XIcon,
  CheckCircle as CheckCircleIcon,
  Security as ShieldIcon,
  Notifications as BellIcon,
  Language as GlobeIcon,
  Schedule as ClockIcon,
  Inventory2 as PackageIcon,
  Description as FileTextIcon,
  FactCheck as InspectionIcon,
  Badge as BadgeIcon,
  AdminPanelSettings as AdminIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { toast } from "sonner";

// Mock user data
const mockUser = {
  name: "Admin User",
  firstName: "Admin",
  lastName: "User",
  email: "admin@chorus-ams.com",
  phone: "+1 (555) 123-4567",
  role: "System Administrator",
  department: "IT & Asset Management",
  office: "Amman Headquarters",
  employeeId: "EMP-001",
  joinDate: "2023-06-15",
  lastLogin: "2026-03-02 09:34 AM",
  timezone: "Asia/Amman (GMT+3)",
  language: "en",
  twoFactorEnabled: true,
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: false,
};

const activityStats = [
  {
    label: "Assets Managed",
    value: "2,847",
    icon: PackageIcon,
  },
  {
    label: "Reports Generated",
    value: "142",
    icon: FileTextIcon,
  },
  {
    label: "Inspections Completed",
    value: "38",
    icon: InspectionIcon,
  },
];

const permissions = [
  "Full system access",
  "User management",
  "Asset CRUD operations",
  "Report generation & export",
  "SAP integration management",
  "Role & permission configuration",
  "System configuration",
  "Audit trail access",
];

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
    phone: mockUser.phone,
    department: mockUser.department,
    office: mockUser.office,
  });
  const [formErrors, setFormErrors] = useState<
    Record<string, string>
  >({});
  const [changePasswordOpen, setChangePasswordOpen] =
    useState(false);
  const [phoneCountryCode, setPhoneCountryCode] =
    useState("+1");

  // Notification prefs
  const [emailNotif, setEmailNotif] = useState(
    mockUser.emailNotifications,
  );
  const [pushNotif, setPushNotif] = useState(
    mockUser.pushNotifications,
  );
  const [weeklyDigest, setWeeklyDigest] = useState(
    mockUser.weeklyDigest,
  );
  const [twoFactor, setTwoFactor] = useState(
    mockUser.twoFactorEnabled,
  );

  const handleSave = () => {
    const errors: Record<string, string> = {};
    if (!form.firstName.trim())
      errors.firstName = "First name is required";
    if (!form.lastName.trim())
      errors.lastName = "Last name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Enter a valid email address";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      phone: mockUser.phone,
      department: mockUser.department,
      office: mockUser.office,
    });
    setFormErrors({});
  };

  return (
    <div className="space-y-6">
      {/* ═══ Profile Header Card ═══ */}
      <Card className="overflow-hidden">
        <CardContent className="relative px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-lg">
                <AvatarFallback className="text-3xl bg-[#121321] text-white">
                  AU
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-2 sm:pt-0 sm:pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-2xl truncate">
                  {mockUser.name}
                </h1>
                <Badge className="bg-[#EF652B]/10 text-[#EF652B] border-[#EF652B]/20 w-fit shrink-0">
                  <AdminIcon className="w-3 h-3 mr-1" />
                  {mockUser.role}
                </Badge>
              </div>
              <p className="text-[15px] text-muted-foreground mt-0.5">
                {mockUser.department} &middot; {mockUser.office}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 sm:pb-1 shrink-0">
              {!editing ? (
                <Button
                  variant="outline"
                  className="h-10 px-5 text-[15px] gap-2"
                  onClick={() => setEditing(true)}
                >
                  <EditIcon className="w-4 h-4" /> Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="h-10 px-5 text-[15px] gap-2"
                    onClick={handleCancel}
                  >
                    <XIcon className="w-4 h-4" /> Cancel
                  </Button>
                  <Button
                    className="h-10 px-5 text-[15px] gap-2 bg-[#121321] text-white"
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
              <Button
                variant="outline"
                className="h-10 px-5 text-[15px] gap-2"
                onClick={() => setChangePasswordOpen(true)}
              >
                <KeyIcon className="w-4 h-4" /> Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ═══ Main Content Grid ═══ */}
      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <PersonIcon className="w-5 h-5 text-[#121321] dark:text-[#81CCD7]" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* First Name */}
                <div className="space-y-2">
                  <Label className="text-[15px] font-medium">
                    First Name{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  {editing ? (
                    <>
                      <Input
                        value={form.firstName}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            firstName: e.target.value,
                          });
                          setFormErrors((p) => ({
                            ...p,
                            firstName: "",
                          }));
                        }}
                        className={`h-[52px] text-[15px] placeholder:text-[14px] ${formErrors.firstName ? "border-red-500" : ""}`}
                      />
                      {formErrors.firstName && (
                        <p className="text-sm text-red-500">
                          {formErrors.firstName}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[15px] p-2.5 rounded-md bg-muted/50 border">
                      {form.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label className="text-[15px] font-medium">
                    Last Name{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  {editing ? (
                    <>
                      <Input
                        value={form.lastName}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            lastName: e.target.value,
                          });
                          setFormErrors((p) => ({
                            ...p,
                            lastName: "",
                          }));
                        }}
                        className={`h-[52px] text-[15px] placeholder:text-[14px] ${formErrors.lastName ? "border-red-500" : ""}`}
                      />
                      {formErrors.lastName && (
                        <p className="text-sm text-red-500">
                          {formErrors.lastName}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[15px] p-2.5 rounded-md bg-muted/50 border">
                      {form.lastName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-[15px] font-medium flex items-center gap-1.5">
                    <EmailIcon className="w-3.5 h-3.5" /> Email
                    Address{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  {editing ? (
                    <>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            email: e.target.value,
                          });
                          setFormErrors((p) => ({
                            ...p,
                            email: "",
                          }));
                        }}
                        className={`h-[52px] text-[15px] placeholder:text-[14px] ${formErrors.email ? "border-red-500" : ""}`}
                      />
                      {formErrors.email && (
                        <p className="text-sm text-red-500">
                          {formErrors.email}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[15px] p-2.5 rounded-md bg-muted/50 border">
                      {form.email}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label className="text-[15px] font-medium flex items-center gap-1.5">
                    <PhoneIcon className="w-3.5 h-3.5" /> Phone
                    Number
                  </Label>
                  {editing ? (
                    <div className="flex gap-2">
                      <Select
                        value={phoneCountryCode}
                        onValueChange={setPhoneCountryCode}
                      >
                        <SelectTrigger className="w-[120px] h-[52px] text-[15px] shrink-0 pr-2 [&>svg]:right-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                          <SelectItem
                            className="text-[15px]"
                            value="+1"
                          >
                            🇺🇸 +1
                          </SelectItem>
                          <SelectItem
                            className="text-[15px]"
                            value="+44"
                          >
                            🇬🇧 +44
                          </SelectItem>
                          <SelectItem
                            className="text-[15px]"
                            value="+962"
                          >
                            🇯🇴 +962
                          </SelectItem>
                          <SelectItem
                            className="text-[15px]"
                            value="+66"
                          >
                            🇹🇭 +66
                          </SelectItem>
                          <SelectItem
                            className="text-[15px]"
                            value="+61"
                          >
                            🇦🇺 +61
                          </SelectItem>
                          <SelectItem
                            className="text-[15px]"
                            value="+855"
                          >
                            🇰🇭 +855
                          </SelectItem>
                          <SelectItem
                            className="text-[15px]"
                            value="+93"
                          >
                            🇦🇫 +93
                          </SelectItem>
                          <SelectItem
                            className="text-[15px]"
                            value="+91"
                          >
                            🇮🇳 +91
                          </SelectItem>
                          <SelectItem
                            className="text-[15px]"
                            value="+49"
                          >
                            🇩🇪 +49
                          </SelectItem>
                          <SelectItem
                            className="text-[15px]"
                            value="+33"
                          >
                            🇫🇷 +33
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Enter phone number"
                        className="h-[52px] text-[15px] placeholder:text-[14px] flex-1"
                      />
                    </div>
                  ) : (
                    <p className="text-[15px] p-2.5 rounded-md bg-muted/50 border">
                      {form.phone}
                    </p>
                  )}
                </div>

                {/* Field Office */}
                <div className="space-y-2">
                  <Label className="text-[15px] font-medium flex items-center gap-1.5">
                    <MapPinIcon className="w-3.5 h-3.5" /> Field
                    Office
                  </Label>
                  {editing ? (
                    <Select
                      value={form.office}
                      onValueChange={(v) =>
                        setForm({ ...form, office: v })
                      }
                    >
                      <SelectTrigger className="h-[52px] text-[15px] pr-2 [&>svg]:right-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                        <SelectItem
                          className="text-[15px]"
                          value="Amman Headquarters"
                        >
                          Amman Headquarters
                        </SelectItem>
                        <SelectItem
                          className="text-[15px]"
                          value="Bangkok Office"
                        >
                          Bangkok Office
                        </SelectItem>
                        <SelectItem
                          className="text-[15px]"
                          value="Melbourne Office"
                        >
                          Melbourne Office
                        </SelectItem>
                        <SelectItem
                          className="text-[15px]"
                          value="Phnom Penh Office"
                        >
                          Phnom Penh Office
                        </SelectItem>
                        <SelectItem
                          className="text-[15px]"
                          value="Afghanistan Office"
                        >
                          Afghanistan Office
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-[15px] p-2.5 rounded-md bg-muted/50 border">
                      {form.office}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </div>
  );
}
