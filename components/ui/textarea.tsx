import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-[var(--cao-radius-md)] border border-[var(--cao-color-border)] bg-[var(--cao-color-bg-elevated)] px-3 py-2 text-sm outline-none placeholder:text-[var(--cao-color-ink-muted)] focus-visible:ring-2 focus-visible:ring-[var(--cao-color-primary)]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
