import React from "react";
import CheckIcon from "@mui/icons-material/Check";

interface MuiCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: "small" | "medium";
}

export function MuiCheckbox({
  checked = false,
  indeterminate = false,
  onCheckedChange,
  disabled = false,
  className = "",
  size = "small",
}: MuiCheckboxProps) {
  const dimensions =
    size === "small"
      ? "w-[18px] h-[18px]"
      : "w-[20px] h-[20px]";

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={`
        flex items-center justify-center
        rounded-[5px]
        transition-all duration-200
        disabled:cursor-not-allowed
        disabled:opacity-40
        ${dimensions}
        ${className}
      `}
    >
      {checked || indeterminate ? (
        <div
          className="
            flex items-center justify-center
            w-full h-full
            rounded-[5px]
            bg-[#B8E3E9]
            border border-[#B8E3E9]
          "
        >
          <CheckIcon
            className="
              !w-[14px]
              !h-[14px]
              !text-[#4B556B]
            "
            sx={{
              stroke: "#4B556B",
              strokeWidth: 1,
            }}
          />
        </div>
      ) : (
        <div
          className="
            w-full h-full
            rounded-[5px]
            bg-[#F5F7FA]
            border-2 border-[#D9DEE5]
          "
        />
      )}
    </button>
  );
}
