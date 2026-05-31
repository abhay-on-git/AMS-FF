"use client";

import * as React from "react";
import {
  CheckBoxOutlineBlank,
  Check,
  Remove,
} from "@mui/icons-material";
import { cn } from "./utils";

export interface CheckboxProps {
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const UNCHECKED_COLOR = "rgba(0,0,0,0.23)";
const CHECKED_COLOR   = "#b8e3e9";

function Checkbox({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  id,
  className,
  ...rest
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);

  const isControlled   = checked !== undefined;
  const isIndeterminate = checked === "indeterminate";
  const isChecked       = isControlled ? checked === true : internalChecked;

  const handleClick = () => {
    if (disabled) return;
    const next = isIndeterminate ? true : !isChecked;
    if (!isControlled) setInternalChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={isIndeterminate ? "mixed" : isChecked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[4px] outline-none transition-opacity",
        "focus-visible:ring-2 focus-visible:ring-[#b8e3e9]/70 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...rest}
    >
      {isIndeterminate ? (
        /* indeterminate: #b8e3e9 box + dark teal minus icon */
        <span style={{
          display: "inline-flex", width: 18, height: 18,
          borderRadius: 2, background: "rgba(184,227,233,0.6)",
          alignItems: "center", justifyContent: "center",
        }}>
          <Remove sx={{ fontSize: 14, color: "#1a5c68" }} />
        </span>
      ) : isChecked ? (
        /* checked: #b8e3e9 box + dark teal check icon */
        <span style={{
          display: "inline-flex", width: 18, height: 18,
          borderRadius: 2, background: CHECKED_COLOR,
          alignItems: "center", justifyContent: "center",
        }}>
          <Check sx={{ fontSize: 14, color: "#1a5c68" }} />
        </span>
      ) : (
        /* unchecked: MUI outline box */
        <CheckBoxOutlineBlank sx={{ fontSize: 18, display: "block", color: UNCHECKED_COLOR }} />
      )}
    </button>
  );
}

export { Checkbox };
