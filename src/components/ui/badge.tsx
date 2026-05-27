import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";

/**
 * Badge variants using theme-aware colors
 * WHY: Hardcoded colors prevent theme consistency
 * ENTERPRISE BENEFIT: Centralized badge color tokens
 */
const badgeVariants = cva(
  "font-['Manrope'] inline-flex items-center justify-center border px-3 py-1 text-[15px] font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1.5 [&>svg]:pointer-events-none transition-colors overflow-hidden rounded-[20px]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]",
        green: "border-transparent bg-green-500/10 text-green-700 dark:text-green-300 [a&]:bg-green-500/20",
        yellow: "border-transparent bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 [a&]:bg-yellow-500/20",
        red: "border-transparent bg-red-500/10 text-red-700 dark:text-red-300 [a&]:bg-red-500/20",
        gray: "border-transparent bg-gray-500/10 text-gray-700 dark:text-gray-300 [a&]:bg-gray-500/20",
        teal: "border-transparent bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))] [a&]:bg-[hsl(var(--secondary))]/20",
        orange: "border-transparent bg-orange-500/10 text-orange-700 dark:text-orange-300 [a&]:bg-orange-500/20",
        outline: "bg-white text-[hsl(var(--foreground))] border-[hsl(var(--border))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot :"span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
