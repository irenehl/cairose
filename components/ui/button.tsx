import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--cao-radius-md)] text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--cao-color-primary)] text-[var(--cao-color-on-primary)] hover:bg-[var(--cao-color-primary-hover)]",
        accent:
          "bg-[var(--cao-color-accent)] text-[var(--cao-color-on-accent)] hover:bg-[var(--cao-color-accent-hover)]",
        outline:
          "border border-[var(--cao-color-border)] bg-transparent text-[var(--cao-color-ink)] hover:bg-[var(--cao-color-bg-elevated)]",
        ghost: "hover:bg-black/5",
        shop:
          "bg-[var(--tenant-primary,#3A5F3A)] text-[var(--tenant-on-primary,#FFF8E7)] hover:bg-[var(--tenant-primary-hover,#2F4E2F)]",
        shopAccent:
          "bg-[var(--tenant-accent,#E8B84A)] text-[var(--tenant-ink,#2C2416)] hover:bg-[var(--tenant-accent-hover,#D4A63A)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
