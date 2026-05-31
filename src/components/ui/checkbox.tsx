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
const CHECKED_COLOR = "var(--color-brand-teal-light)";
const CHECKED_ICON_COLOR = "var(--color-brand-teal)";

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
        "focus-visible:ring-2 focus-visible:ring-brand-teal-light/70 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...rest}
    >
      {isIndeterminate ? (
        <span style={{
          display: "inline-flex", width: 18, height: 18,
          borderRadius: 2, background: "color-mix(in srgb, var(--color-brand-teal-light) 60%, transparent)",
          alignItems: "center", justifyContent: "center",
        }}>
          <Remove sx={{ fontSize: 14, color: CHECKED_ICON_COLOR }} />
        </span>
      ) : isChecked ? (
        <span style={{
          display: "inline-flex", width: 18, height: 18,
          borderRadius: 2, background: CHECKED_COLOR,
          alignItems: "center", justifyContent: "center",
        }}>
          <Check sx={{ fontSize: 14, color: CHECKED_ICON_COLOR }} />
        </span>
      ) : (
        <CheckBoxOutlineBlank sx={{ fontSize: 18, display: "block", color: UNCHECKED_COLOR }} />
      )}
    </button>
  );
}

export { Checkbox };
