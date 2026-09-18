"use client";

import { useEffect, useRef } from "react";
import { DEMO_SLUG } from "./storefront-copy";

/**
 * Tracking plan v0. Named events fire only when NEXT_PUBLIC_CLARITY_ID is set
 * and the Clarity script has loaded. Otherwise this helper no-ops.
 * No PII (no email / phone / address). tenant_id is the tenant slug.
 */
export type SubscribeStep = "plan" | "gift" | "address" | "checkout";
export type WaReason = "skip" | "pause" | "checkout" | "support";

export type AnalyticsProps = {
  tenant_id: string;
  is_demo: boolean;
  plan_code?: string;
  cadence?: string;
  tier?: string;
  is_gift?: boolean;
  step?: SubscribeStep;
  surface?: string;
  reason?: WaReason;
  sku?: string;
};

export type StorefrontEvent =
  | "view_home"
  | "view_plan"
  | "subscribe_start"
  | "start_gift"
  | "subscribe_step"
  | "checkout_coming_soon"
  | "skip_intent"
  | "pause_intent"
  | "wa_handoff";

export type PanelEvent =
  | "panel_view_plans"
  | "panel_edit_price"
  | "panel_edit_cadence"
  | "panel_view_subscribers"
  | "panel_view_orders";

export type AnalyticsEvent = StorefrontEvent | PanelEvent;

declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

const PII_KEYS = new Set([
  "email",
  "phone",
  "address",
  "addressLine1",
  "payerName",
  "recipientName",
]);

export function isClarityConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLARITY_ID?.trim());
}

export function analyticsContext(slug: string | undefined): {
  tenant_id: string;
  is_demo: boolean;
} {
  const tenant_id = slug ?? "unknown";
  return {
    tenant_id,
    is_demo: tenant_id === DEMO_SLUG,
  };
}

export function track(event: AnalyticsEvent, props: AnalyticsProps): void {
  if (!isClarityConfigured()) return;
  if (typeof window === "undefined") return;
  const clarity = window.clarity;
  if (typeof clarity !== "function") return;

  const safe: Record<string, string> = {};
  for (const [key, value] of Object.entries({
    ...props,
    tenant_id: props.tenant_id,
    is_demo: props.is_demo,
    ts: Date.now(),
  })) {
    if (value === undefined || PII_KEYS.has(key)) continue;
    safe[key] = String(value);
  }

  clarity("event", event);
  clarity("set", "tenant_id", safe.tenant_id);
  clarity("set", "is_demo", safe.is_demo);
}

export function useTrackOnce(
  event: AnalyticsEvent,
  ready: boolean,
  props: AnalyticsProps | null,
  extraKey = "",
): void {
  const sent = useRef(false);
  useEffect(() => {
    if (!ready || !props || sent.current) return;
    sent.current = true;
    track(event, props);
  }, [ready, event, props, extraKey]);
}

export function whatsappHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "https://wa.me/";
}
