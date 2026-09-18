"use client";

import { useEffect, useRef } from "react";
import {
  analyticsContext,
  track,
  type AnalyticsEvent,
  type AnalyticsProps,
} from "./analytics";

/** Fire a page-level event once the tenant slug is known. */
export function useTrackPage(
  event: AnalyticsEvent,
  slug: string | undefined,
  extra?: Omit<AnalyticsProps, "tenant_id" | "is_demo">,
): void {
  const key = `${event}:${slug ?? ""}:${extra?.plan_code ?? ""}:${extra?.step ?? ""}`;
  const last = useRef<string>("");
  useEffect(() => {
    if (!slug) return;
    if (last.current === key) return;
    last.current = key;
    track(event, { ...analyticsContext(slug), ...extra });
  }, [event, extra, key, slug]);
}
