"use client";

import { useCallback, useSyncExternalStore } from "react";
import { casaLimonCopy } from "@/lib/storefront-copy";

const STORAGE_KEY = "cairose-demo-chip-dismissed";
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot() {
  return sessionStorage.getItem(STORAGE_KEY) !== "1";
}

function getServerSnapshot() {
  return false;
}

export function DemoChip() {
  const visible = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const dismiss = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    listeners.forEach((listener) => listener());
  }, []);

  if (!visible) return null;

  return (
    <div className="px-4 pb-1 md:px-8">
      <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--tenant-border)] bg-[var(--tenant-color-bg-elevated)] px-3 py-1 text-xs text-[var(--tenant-ink-muted)]">
        <p className="min-w-0 truncate">{casaLimonCopy.demoChip}</p>
        <button
          type="button"
          className="shrink-0 rounded-full px-1.5 py-0.5 hover:bg-[var(--tenant-secondary)]"
          onClick={dismiss}
        >
          {casaLimonCopy.demoChipDismiss}
        </button>
      </div>
    </div>
  );
}
