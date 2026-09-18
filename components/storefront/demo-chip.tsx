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
    <div className="flex items-center justify-between gap-3 px-4 py-2 text-xs text-[var(--tenant-ink-muted)] md:px-8">
      <p>{casaLimonCopy.demoChip}</p>
      <button
        type="button"
        className="shrink-0 rounded-full border border-[var(--tenant-border)] px-2 py-0.5 hover:bg-[var(--tenant-color-bg-elevated)]"
        onClick={dismiss}
      >
        {casaLimonCopy.demoChipDismiss}
      </button>
    </div>
  );
}
