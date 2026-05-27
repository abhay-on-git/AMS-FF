import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  FilterList as FilterIcon,
  ExpandMore as ChevronDown,
  Close as XIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { toast } from "sonner";
import {
  AdvancedFilterState,
  defaultAdvancedFilters,
} from "./types";

interface AdvancedFiltersProps {
  filters: AdvancedFilterState;
  onFiltersChange: (filters: AdvancedFilterState) => void;
  onClearAll: () => void;
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onClearAll,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = Object.entries(filters).filter(
    ([_, v]) => v !== "" && v !== "all",
  ).length;

  const updateFilter = (
    key: keyof AdvancedFilterState,
    value: string,
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeChips = Object.entries(filters)
    .filter(([_, v]) => v !== "" && v !== "all")
    .map(([key, value]) => ({
      key: key as keyof AdvancedFilterState,
      label: formatFilterLabel(key),
      value,
    }));

  const removeChip = (key: keyof AdvancedFilterState) => {
    const isSelectFilter = [
      "fieldOffice",
      "location",
      "assetType",
      "category",
      "lifecycleStatus",
      "condition",
      "supplier",
      "warrantyStatus",
      "rfidTagStatus",
      "inspectionStatus",
      "usageStatus",
    ].includes(key);
    updateFilter(key, isSelectFilter ? "all" : "");
  };

  return (
    <div className="space-y-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-[15px]"
            >
              <FilterIcon className="w-4 h-4" />
              Advanced Filters
              {activeFilterCount > 0 && (
                <Badge className="bg-[#121321] text-white ml-1 px-1.5 py-0 text-[15px]">
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <div className="flex gap-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-[15px] gap-1"
              >
                <ClearIcon className="w-3.5 h-3.5" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        <CollapsibleContent>
          <div className="border rounded-[4px] p-4 mt-2 bg-muted/30 space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-[15px] text-muted-foreground">
                  Field Office
                </Label>
                <Select
                  value={filters.fieldOffice}
                  onValueChange={(v) =>
                    updateFilter("fieldOffice", v)
                  }
                >
                  <SelectTrigger className="h-8 text-[15px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem className="text-md" value="all">
                      All Offices
                    </SelectItem>
                    <SelectItem className="text-md" value="Headquarters">
                      Headquarters
                    </SelectItem>
                    <SelectItem className="text-md" value="Regional Office East">
                      Regional Office East
                    </SelectItem>
                    <SelectItem className="text-md" value="Regional Office West">
                      Regional Office West
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[15px] text-muted-foreground">
                  Location
                </Label>
                <Select
                  value={filters.location}
                  onValueChange={(v) =>
                    updateFilter("location", v)
                  }
                >
                  <SelectTrigger className="h-8 text-[15px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem className="text-md" value="all">
                      All Locations
                    </SelectItem>
                    <SelectItem className="text-md" value="Office Floor 1">
                      Office Floor 1
                    </SelectItem>
                    <SelectItem className="text-md" value="Office Floor 2">
                      Office Floor 2
                    </SelectItem>
                    <SelectItem className="text-md" value="Office A1-02">
                      Office A1-02
                    </SelectItem>
                    <SelectItem className="text-md" value="Office A1-03">
                      Office A1-03
                    </SelectItem>
                    <SelectItem className="text-md" value="Office A1-05">
                      Office A1-05
                    </SelectItem>
                    <SelectItem className="text-md" value="Server Room B2">
                      Server Room B2
                    </SelectItem>
                    <SelectItem className="text-md" value="Warehouse B1">
                      Warehouse B1
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-[15px] text-muted-foreground">
                  Category
                </Label>
                <Select
                  value={filters.category}
                  onValueChange={(v) =>
                    updateFilter("category", v)
                  }
                >
                  <SelectTrigger className="h-8 text-[15px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem className="text-md" value="all">
                      All Categories
                    </SelectItem>
                    <SelectItem className="text-md" value="IT Equipment">
                      IT Equipment
                    </SelectItem>
                    <SelectItem className="text-md" value="Office Equipment">
                      Office Equipment
                    </SelectItem>
                    <SelectItem className="text-md" value="Office Furniture">
                      Office Furniture
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[15px] text-muted-foreground">
                  Lifecycle Status
                </Label>
                <Select
                  value={filters.lifecycleStatus}
                  onValueChange={(v) =>
                    updateFilter("lifecycleStatus", v)
                  }
                >
                  <SelectTrigger className="h-8 text-[15px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem className="text-md" value="all">
                      All Status
                    </SelectItem>
                    <SelectItem className="text-md" value="active">
                      Active
                    </SelectItem>
                    <SelectItem className="text-md" value="inactive">
                      Inactive
                    </SelectItem>
                    <SelectItem className="text-md" value="maintenance">
                      Maintenance
                    </SelectItem>
                    <SelectItem className="text-md" value="missing">
                      Missing
                    </SelectItem>
                    <SelectItem className="text-md" value="disposed">
                      Disposed
                    </SelectItem>
                    <SelectItem className="text-md" value="in-transit">
                      In Transit
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[15px] text-muted-foreground">
                  Condition
                </Label>
                <Select
                  value={filters.condition}
                  onValueChange={(v) =>
                    updateFilter("condition", v)
                  }
                >
                  <SelectTrigger className="h-8 text-[15px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem className="text-md" value="all">
                      All Conditions
                    </SelectItem>
                    <SelectItem className="text-md" value="new">New</SelectItem>
                    <SelectItem className="text-md" value="good">Good</SelectItem>
                    <SelectItem className="text-md" value="fair">Fair</SelectItem>
                    <SelectItem className="text-md" value="poor">Poor</SelectItem>
                    <SelectItem className="text-md" value="damaged">
                      Damaged
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Row 3 - Additional Filters */}

            {/* Row 4 - Date ranges and value */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-[15px] text-muted-foreground">
                  Acquisition Date
                </Label>
                <Input
                  type="date"
                  value={filters.acquisitionDateFrom}
                  onChange={(e) =>
                    updateFilter(
                      "acquisitionDateFrom",
                      e.target.value,
                    )
                  }
                  className="h-8 text-[15px]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[15px] text-muted-foreground">
                  Value Min ($)
                </Label>
                <Input
                  type="number"
                  value={filters.valueMin}
                  onChange={(e) =>
                    updateFilter("valueMin", e.target.value)
                  }
                  placeholder="0"
                  className="h-8 text-[15px]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[15px] text-muted-foreground">
                  Value Max ($)
                </Label>
                <Input
                  type="number"
                  value={filters.valueMax}
                  onChange={(e) =>
                    updateFilter("valueMax", e.target.value)
                  }
                  placeholder="999999"
                  className="h-8 text-[15px]"
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Active filter chips */}
      {activeChips.length > 0 && !isOpen && (
        <div className="flex flex-wrap gap-1.5">
          {activeChips.map((chip) => (
            <Badge
              key={chip.key}
              variant="secondary"
              className="gap-1 pl-2 pr-1 py-0.5 text-[15px]"
            >
              <span className="text-muted-foreground">
                {chip.label}:
              </span>{" "}
              {chip.value}
              <button
                onClick={() => removeChip(chip.key)}
                className="ml-0.5 rounded-full p-0.5"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function formatFilterLabel(key: string): string {
  const labels: Record<string, string> = {
    fieldOffice: "Office",
    location: "Location",
    custodian: "Custodian",
    assetType: "Type",
    category: "Category",
    lifecycleStatus: "Status",
    poNumber: "PO",
    grnNumber: "GRN",
    acquisitionDateFrom: "Acq. From",
    acquisitionDateTo: "Acq. To",
    lastUpdatedFrom: "Updated From",
    lastUpdatedTo: "Updated To",
    valueMin: "Min Value",
    valueMax: "Max Value",
    condition: "Condition",
    supplier: "Supplier",
    warrantyStatus: "Warranty",
    rfidTagStatus: "RFID Tag",
    inspectionStatus: "Inspection",
    usageStatus: "Usage",
  };
  return labels[key] || key;
}
