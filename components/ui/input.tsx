import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-[var(--cao-radius-md)] border border-[var(--cao-color-border)] bg-[var(--cao-color-bg-elevated)] px-3 py-2 text-sm text-[var(--cao-color-ink)] outline-none placeholder:text-[var(--cao-color-ink-muted)] focus-visible:ring-2 focus-visible:ring-[var(--cao-color-primary)]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
