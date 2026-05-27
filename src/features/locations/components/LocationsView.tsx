// ── Enterprise Locations Module - Main Container ──

import React, { useState } from "react";
import { LocationsHeader } from "./locations/LocationsHeader";
import { LocationFormDrawer } from "./locations/LocationFormDrawer";
import { LocationHierarchyManager } from "./locations/LocationHierarchyManager";
import { FieldOfficeFormDrawer } from "./locations/FieldOfficeFormDrawer";
import {
  LocationViewMode,
  LocationNode,
  FieldOfficeConfig,
} from "./locations/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  mockFieldOffices,
  mockLocationNodes,
  mockFieldOfficeSummaries,
} from "./locations/mockData";
import { getLocationStatistics } from "./locations/hierarchyUtils";
import {
  LocationOn as MapPin,
  Business as Building,
  Inventory2 as Package,
  People as Users,
  CheckCircle,
  Construction,
  Timeline,
  Edit,
  Delete as Trash2,
  MoreVert as MoreVertical,
  ChevronLeft,
} from "@mui/icons-material";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export default function Locations() {
  const [activeTab, setActiveTab] =
    useState<LocationViewMode>("overview");
  const [locations, setLocations] = useState<LocationNode[]>(
    mockLocationNodes,
  );
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [editingLocation, setEditingLocation] =
    useState<LocationNode | null>(null);
  const [hierarchyManagerOpen, setHierarchyManagerOpen] =
    useState(false);
  const [hierarchyReadOnly, setHierarchyReadOnly] =
    useState(false);
  const [
    selectedOfficeForHierarchy,
    setSelectedOfficeForHierarchy,
  ] = useState<FieldOfficeConfig | null>(null);
  const [fieldOfficeDrawerOpen, setFieldOfficeDrawerOpen] =
    useState(false);
  const [editingFieldOffice, setEditingFieldOffice] =
    useState<FieldOfficeConfig | null>(null);
  const [fieldOffices, setFieldOffices] =
    useState(mockFieldOffices);
  const [detailView, setDetailView] = useState(false);
  const [viewingFieldOfficeId, setViewingFieldOfficeId] =
    useState<string | null>(null);

  const handleAddLocation = () => {
    if (viewingFieldOfficeId && detailView) {
      const office = fieldOffices.find(
        (fo) => fo.id === viewingFieldOfficeId,
      );
      if (office) {
        setSelectedOfficeForHierarchy(office);
        setHierarchyManagerOpen(true);
        return;
      }
    }
    setEditingLocation(null);
    setFormDrawerOpen(true);
  };

  const handleEditLocation = (location: LocationNode) => {
    setEditingLocation(location);
    setFormDrawerOpen(true);
  };

  const handleDeleteLocation = (location: LocationNode) => {
    setLocations(locations.filter((l) => l.id !== location.id));
    toast.success(
      `Location "${location.name}" deleted successfully!`,
    );
  };

  const handleSaveLocation = (location: LocationNode) => {
    const existingIndex = locations.findIndex(
      (l) => l.id === location.id,
    );
    if (existingIndex >= 0) {
      const updated = [...locations];
      updated[existingIndex] = location;
      setLocations(updated);
      toast.success(
        `Location "${location.name}" updated successfully!`,
      );
    } else {
      setLocations([...locations, location]);
      toast.success(
        `Location "${location.name}" created successfully!`,
      );
    }
  };

  const handleImport = () =>
    toast.info("Import feature coming soon!");
  const handleExport = () =>
    toast.info("Export feature coming soon!");

  const handleManageFieldOffices = () => {
    setEditingFieldOffice(null);
    setFieldOfficeDrawerOpen(true);
  };

  const handleSaveFieldOffice = (
    fieldOffice: FieldOfficeConfig,
  ) => {
    const existingIndex = fieldOffices.findIndex(
      (fo) => fo.id === fieldOffice.id,
    );
    if (existingIndex >= 0) {
      const updated = [...fieldOffices];
      updated[existingIndex] = fieldOffice;
      setFieldOffices(updated);
    } else {
      setFieldOffices([...fieldOffices, fieldOffice]);
    }
  };

  return (
    <div className="space-y-6">
      <LocationsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddLocation={handleAddLocation}
        onImport={handleImport}
        onExport={handleExport}
        onManageFieldOffices={handleManageFieldOffices}
        detailView={detailView}
      />

      {activeTab === "overview" && (
        <OverviewView
          viewingFieldOfficeId={viewingFieldOfficeId}
          locations={locations}
          fieldOffices={fieldOffices}
          onEditLocation={handleEditLocation}
          onDeleteLocation={handleDeleteLocation}
          onFieldOfficeClick={(id) => {
            setViewingFieldOfficeId(id);
            setDetailView(true);
          }}
          onManageHierarchy={(office) => {
            setSelectedOfficeForHierarchy(office);
            setHierarchyReadOnly(false);
            setHierarchyManagerOpen(true);
          }}
          onViewDetails={(office) => {
            setSelectedOfficeForHierarchy(office);
            setHierarchyReadOnly(true);
            setHierarchyManagerOpen(true);
          }}
          detailView={detailView}
          onBackToOverview={() => {
            setDetailView(false);
            setViewingFieldOfficeId(null);
          }}
        />
      )}
      {activeTab === "explorer" && (
        <ExplorerView locations={locations} />
      )}
      {activeTab === "builder" && (
        <BuilderView locations={locations} />
      )}
      {activeTab === "assignments" && (
        <AssignmentsView locations={locations} />
      )}

      <LocationFormDrawer
        open={formDrawerOpen}
        onOpenChange={setFormDrawerOpen}
        fieldOffices={fieldOffices}
        editingLocation={editingLocation}
        onSave={handleSaveLocation}
      />

      {selectedOfficeForHierarchy && (
        <LocationHierarchyManager
          open={hierarchyManagerOpen}
          onOpenChange={setHierarchyManagerOpen}
          selectedOffice={selectedOfficeForHierarchy}
          fieldOffices={fieldOffices}
          locations={locations}
          onSaveLocation={handleSaveLocation}
          onDeleteLocation={handleDeleteLocation}
          readOnly={hierarchyReadOnly}
        />
      )}

      <FieldOfficeFormDrawer
        open={fieldOfficeDrawerOpen}
        onOpenChange={setFieldOfficeDrawerOpen}
        editingFieldOffice={editingFieldOffice}
        onSave={handleSaveFieldOffice}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OVERVIEW VIEW
// ═══════════════════════════════════════════════════════════════════════════

function OverviewView({
  viewingFieldOfficeId,
  locations,
  fieldOffices,
  onEditLocation,
  onDeleteLocation,
  onFieldOfficeClick,
  onManageHierarchy,
  onViewDetails,
  detailView,
  onBackToOverview,
}: {
  viewingFieldOfficeId: string | null;
  locations: LocationNode[];
  fieldOffices: FieldOfficeConfig[];
  onEditLocation: (location: LocationNode) => void;
  onDeleteLocation: (location: LocationNode) => void;
  onFieldOfficeClick: (fieldOfficeId: string) => void;
  onManageHierarchy: (office: FieldOfficeConfig) => void;
  onViewDetails: (office: FieldOfficeConfig) => void;
  detailView: boolean;
  onBackToOverview: () => void;
}) {
  const stats = viewingFieldOfficeId
    ? getLocationStatistics(viewingFieldOfficeId, locations)
    : getLocationStatistics("all", locations);
  const fieldOffice = viewingFieldOfficeId
    ? fieldOffices.find((fo) => fo.id === viewingFieldOfficeId)
    : null;
  const [deleteDialogOpen, setDeleteDialogOpen] =
    React.useState(false);
  const [locationToDelete, setLocationToDelete] =
    React.useState<LocationNode | null>(null);

  const filteredLocations = viewingFieldOfficeId
    ? locations.filter(
        (loc) => loc.fieldOfficeId === viewingFieldOfficeId,
      )
    : locations;

  const handleDeleteClick = (location: LocationNode) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (locationToDelete) {
      onDeleteLocation(locationToDelete);
      setDeleteDialogOpen(false);
      setLocationToDelete(null);
    }
  };

  const getLocationTypeName = (locationTypeId: string) => {
    const type = fieldOffice?.locationTypes.find(
      (t) => t.id === locationTypeId,
    );
    return type?.name || "Unknown";
  };

  // ── Detail View ──────────────────────────────────────────────────────────
  if (detailView) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-base">
          <button
            onClick={onBackToOverview}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onBackToOverview}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Locations
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-semibold">
            {fieldOffice?.name}
          </span>
        </div>

        {/* Field Office Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#f7f7f8] dark:bg-[#f7f7f8]/10 flex items-center justify-center shrink-0">
                <Building className="w-7 h-7 text-[#121321] dark:text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {fieldOffice?.name}
                </h2>
                <p className="text-base text-muted-foreground mt-0.5">
                  {fieldOffice?.location} &bull;{" "}
                  {fieldOffice?.code}
                </p>
              </div>
              <Button
                size="lg"
                onClick={() =>
                  fieldOffice && onManageHierarchy(fieldOffice)
                }
                className="gap-2 h-11 px-6 text-base"
              >
                <Building className="w-5 h-5" />
                Manage Hierarchy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Total Locations",
              value: stats.total,
              sub: `Across ${stats.maxDepth + 1} hierarchy levels`,
              icon: MapPin,
            },
            {
              label: "Assets Mapped",
              value: stats.totalAssets.toLocaleString(),
              sub: "Across all locations",
              icon: Package,
            },
            {
              label: "Assigned Users",
              value: stats.totalUsers,
              sub: "Location assignments",
              icon: Users,
            },
          ].map(({ label, value, sub, icon: Icon }) => (
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
                    <p className="text-lg text-muted-foreground mt-1">
                      {sub}
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

        {/* Locations Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-base font-semibold py-4">
                      Name
                    </TableHead>
                    <TableHead className="text-base font-semibold py-4">
                      Code
                    </TableHead>
                    <TableHead className="text-base font-semibold py-4">
                      Type
                    </TableHead>
                    <TableHead className="text-base font-semibold py-4">
                      Level
                    </TableHead>
                    <TableHead className="text-base font-semibold py-4">
                      Assets
                    </TableHead>
                    <TableHead className="text-base font-semibold py-4">
                      Users
                    </TableHead>
                    <TableHead className="w-[70px] py-4" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                      <TableRow
                        key={location.id}
                        className="hover:bg-muted/30"
                      >
                        <TableCell className="text-base font-medium py-4">
                          {location.name}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className="text-lg px-2.5 py-0.5"
                          >
                            {location.code}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-base py-4">
                          {getLocationTypeName(
                            location.locationTypeId,
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className="text-lg px-2.5 py-0.5"
                          >
                            Level {location.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-base py-4">
                          {location.assetCount}
                        </TableCell>
                        <TableCell className="text-base py-4">
                          {location.assignedUserCount}
                        </TableCell>
                        <TableCell className="py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-base py-2.5 gap-2"
                                onClick={() =>
                                  onEditLocation(location)
                                }
                              >
                                <Edit className="w-4 h-4" />{" "}
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-base py-2.5 gap-2 text-red-600 dark:text-red-400"
                                onClick={() =>
                                  handleDeleteClick(location)
                                }
                              >
                                <Trash2 className="w-4 h-4" />{" "}
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-16 text-muted-foreground"
                      >
                        <MapPin className="w-14 h-14 mx-auto mb-3 opacity-30" />
                        <p className="text-base font-medium">
                          No locations found for this field
                          office
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                Delete Location
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base mt-2">
                Are you sure you want to delete &ldquo;
                {locationToDelete?.name}&rdquo;? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel className="text-base h-11 px-5">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="text-base h-11 px-5 bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ── Overview — All Field Offices ─────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Locations",
            value: stats.total,
            sub: `Across ${stats.maxDepth + 1} hierarchy levels`,
            icon: MapPin,
          },
          {
            label: "Assets Mapped",
            value: stats.totalAssets.toLocaleString(),
            sub: "Across all locations",
            icon: Package,
          },
          {
            label: "Assigned Users",
            value: stats.totalUsers,
            sub: "Location assignments",
            icon: Users,
          },
        ].map(({ label, value, sub, icon: Icon }) => (
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
                  <p className="text-lg text-muted-foreground mt-1">
                    {sub}
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

      {/* All Field Offices */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            All Field Offices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFieldOfficeSummaries.map((summary) => {
              const office = fieldOffices.find(
                (fo) => fo.id === summary.fieldOfficeId,
              );
              return (
                <Card
                  key={summary.fieldOfficeId}
                  className="border-2 transition-all hover:shadow-md"
                >
                  <CardContent className="p-5">
                    {/* Office header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-11 h-11 rounded-lg bg-[#f7f7f8] dark:bg-[#f7f7f8]/10 flex items-center justify-center shrink-0">
                        <Building className="w-5 h-5 text-[#121321] dark:text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl font-semibold leading-snug truncate">
                          {summary.fieldOfficeName}
                        </p>
                        <p className="text-lg text-muted-foreground mt-0.5 truncate">
                          {office?.location}
                        </p>
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="rounded-lg bg-muted/40 p-3 text-center">
                        <p className="text-md text-muted-foreground font-medium uppercase tracking-wide mb-1">
                          Locations
                        </p>
                        <p className="text-xl font-bold">
                          {summary.locationCount}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3 text-center">
                        <p className="text-md text-muted-foreground font-medium uppercase tracking-wide mb-1">
                          Assets
                        </p>
                        <p className="text-xl font-bold">
                          {summary.assetCount}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3 text-center">
                        <p className="text-md text-muted-foreground font-medium uppercase tracking-wide mb-1">
                          Users
                        </p>
                        <p className="text-xl font-bold">
                          {summary.userCount}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 h-10 text-base"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (office) onViewDetails(office);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        className="flex-1 h-10 text-base bg-[#121321] text-white hover:bg-[#121321]/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (office) onManageHierarchy(office);
                        }}
                      >
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPLORER VIEW (Placeholder)
// ═══════════════════════════════════════════════════════════════════════════

function ExplorerView({
  locations,
}: {
  locations: LocationNode[];
}) {
  return (
    <Card>
      <CardContent className="p-16 text-center">
        <Timeline className="w-16 h-16 text-muted-foreground mx-auto mb-5 opacity-40" />
        <h3 className="text-xl font-semibold mb-2">
          Hierarchy Explorer
        </h3>
        <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          Advanced tree navigation with search, expand/collapse,
          and location details will be available here.
        </p>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILDER VIEW (Placeholder)
// ═══════════════════════════════════════════════════════════════════════════

function BuilderView({
  locations,
}: {
  locations: LocationNode[];
}) {
  return (
    <Card>
      <CardContent className="p-16 text-center">
        <Construction className="w-16 h-16 text-muted-foreground mx-auto mb-5 opacity-40" />
        <h3 className="text-xl font-semibold mb-2">
          Visual Hierarchy Builder
        </h3>
        <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          Drag-and-drop hierarchy builder with visual
          connections and relationship mapping coming soon.
        </p>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ASSIGNMENTS VIEW (Placeholder)
// ═══════════════════════════════════════════════════════════════════════════

function AssignmentsView({
  locations,
}: {
  locations: LocationNode[];
}) {
  return (
    <Card>
      <CardContent className="p-16 text-center">
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-5 opacity-40" />
        <h3 className="text-xl font-semibold mb-2">
          User Assignments
        </h3>
        <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          Multi-select location assignment with hierarchical
          inheritance and scope indicators coming soon.
        </p>
      </CardContent>
    </Card>
  );
}
