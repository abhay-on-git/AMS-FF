import * as React from "react";

import { cn } from "../../lib/cn";

/**
 * Input component using CSS variables from theme
 * WHY: Hardcoded colors prevent consistent theming
 * ENTERPRISE BENEFIT: Theme-aware styling via CSS variables
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "font-['Manrope'] font-medium",
        "placeholder:text-[hsl(var(--muted-foreground))] selection:bg-[hsl(var(--secondary))] selection:text-[hsl(var(--foreground))]",
        "flex h-10 w-full min-w-0 rounded-md ring-1 ring-[hsl(var(--border))] bg-white text-[hsl(var(--foreground))] pl-[18px] pr-10 text-xs",
        "transition-[color,box-shadow] outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-xs file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[hsl(var(--muted))] disabled:text-[hsl(var(--muted-foreground))] disabled:opacity-100",
        "focus-visible:ring-[hsl(var(--ring))] focus-visible:shadow-[0_0_0_4px_hsl(var(--ring)/0.2)]",
        "aria-invalid:ring-[hsl(var(--destructive))] aria-invalid:focus-visible:shadow-[0_0_0_4px_hsl(var(--destructive)/0.2)]",
        className
      )}
      {...props}
    />
  );
}

export { Input };
