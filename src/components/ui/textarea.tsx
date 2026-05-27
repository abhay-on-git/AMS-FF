import * as React from"react";

import { cn } from"./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn("font-['Manrope'] font-medium text-xs","resize-none placeholder:text-[#676983]","flex field-sizing-content min-h-[72px] w-full rounded-md ring-1 ring-[#DCDDE5] bg-white text-[#121321]","px-[18px] py-3","transition-[color,box-shadow] outline-none","focus-visible:ring-[#B8E3E9] focus-visible:shadow-[0_0_0_4px_#D9F1F4]","aria-invalid:ring-[#FEA3A8] aria-invalid:focus-visible:shadow-[0_0_0_4px_#FFE1E3]","disabled:cursor-not-allowed disabled:bg-[#F7F7F8] disabled:text-[#AFB1C0] disabled:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

