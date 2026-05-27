import React from "react";
import { Button } from "../ui/button";
import { MuiCheckbox } from "../shared/MuiCheckbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ViewColumn as ColumnsIcon } from "@mui/icons-material";
import { ColumnConfig } from "./types";

interface ColumnToggleProps {
  columns: ColumnConfig[];
  onToggle: (key: string) => void;
}

export function ColumnToggle({
  columns,
  onToggle,
}: ColumnToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-[2.6rem] text-[15px]"
        >
          <ColumnsIcon className="w-4 h-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        {columns
          .filter(
            (col) =>
              col.key !== "category" &&
              col.key !== "parentCategory",
          )
          .map((col) => (
            <label
              key={col.key}
              className="flex items-center gap-2 px-2 py-1.5 rounded-[4px] cursor-pointer text-[15px]"
            >
              <MuiCheckbox
                checked={col.visible}
                onCheckedChange={() => onToggle(col.key)}
              />
              {col.label}
            </label>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
