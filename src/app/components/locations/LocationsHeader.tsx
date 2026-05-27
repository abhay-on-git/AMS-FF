import React from "react";
import { Button } from "../ui/button";
import { LocationViewMode } from "./types";
import {
  Dashboard as OverviewIcon,
  AccountTree as ExplorerIcon,
  Build as BuilderIcon,
  People as AssignmentsIcon,
  Add as Plus,
  FileDownload as Download,
  FileUpload as Upload,
  Business as Building2,
} from "@mui/icons-material";

interface LocationsHeaderProps {
  activeTab: LocationViewMode;
  onTabChange: (tab: LocationViewMode) => void;
  onAddLocation?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onManageFieldOffices?: () => void;
  detailView?: boolean;
}

export function LocationsHeader({
  activeTab,
  onTabChange,
  onAddLocation,
  onImport,
  onExport,
  onManageFieldOffices,
  detailView,
}: LocationsHeaderProps) {
  const tabs: {
    id: LocationViewMode;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <OverviewIcon className="w-4 h-4" />,
    },
    {
      id: "explorer",
      label: "Explorer",
      icon: <ExplorerIcon className="w-4 h-4" />,
    },
    {
      id: "builder",
      label: "Builder",
      icon: <BuilderIcon className="w-4 h-4" />,
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: <AssignmentsIcon className="w-4 h-4" />,
    },
  ];

  // Don't show header in detail view
  if (detailView) {
    return null;
  }

  return null;
}
