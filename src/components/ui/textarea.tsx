import * as React from"react";

import { cn } from"./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn("font-['Manrope'] font-medium text-xs","resize-none placeholder:text-input-placeholder","flex field-sizing-content min-h-[72px] w-full rounded-md ring-1 ring-input-border bg-white text-brand-navy","px-[18px] py-3","transition-[color,box-shadow] outline-none","focus-visible:ring-brand-teal-light focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-brand-teal-light)_40%,transparent)]","aria-invalid:ring-destructive aria-invalid:focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-destructive)_20%,transparent)]","disabled:cursor-not-allowed disabled:bg-main-bg disabled:text-search-placeholder disabled:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

