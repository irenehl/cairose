import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--cao-radius-lg)] border border-[var(--cao-color-border)] bg-[var(--cao-color-bg-elevated)] p-5 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
