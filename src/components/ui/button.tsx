import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";

/**
 * Button variants using centralized theme tokens
 * WHY: Hardcoded color values scattered across components make:
 *   - Theme changes difficult
 *   - Inconsistent styling
 *   - Hard to maintain design system
 *
 * ENTERPRISE BENEFIT: Single source of truth for all button styling
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-['Sora'] font-normal transition-all disabled:pointer-events-none disabled:opacity-100 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 aria-invalid:ring-4",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border border-[hsl(var(--primary))] shadow-xs rounded-lg",
        destructive:
          "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] border border-[hsl(var(--destructive))] focus-visible:ring-[hsl(var(--destructive)/0.3)] shadow-xs rounded-lg",
        outline:
          "border border-[hsl(var(--border))] bg-white text-[hsl(var(--foreground))] disabled:text-[hsl(var(--muted-foreground))] rounded-md",
        secondary:
          "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] border border-[hsl(var(--secondary))] disabled:text-[hsl(var(--muted-foreground))] shadow-xs rounded-lg",
        tertiary:
          "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--muted))] disabled:text-[hsl(var(--muted-foreground))] shadow-xs rounded-lg",
        ghost: "hover:bg-[hsl(var(--accent))] dark:hover:bg-[hsl(var(--accent))]",
        link: "text-[hsl(var(--secondary))] underline-offset-4 disabled:text-[hsl(var(--muted-foreground))]",
      },
      size: {
        default: "h-10 px-[18px] text-sm rounded-lg",
        xs: "h-8 px-[14px] text-xs rounded-md",
        sm: "h-9 px-4 text-xs rounded-md",
        lg: "h-11 px-[22px] text-sm rounded-lg",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot :"button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName ="Button";

export { Button, buttonVariants };
