"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { CairoseWordmark } from "@/components/marketing/wordmark";
import {
  DEMO_STOREFRONT_HREF,
  SIGN_UP_HREF,
  marketingCopy,
} from "@/lib/marketing-copy";
import { cn } from "@/lib/utils";

const HOW_HREF = `#${marketingCopy.how.id}`;
const DEMO_HREF = `#${marketingCopy.demo.id}`;
const SHRINK_AFTER_PX = 56;

function subscribeScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

function getScrollSnapshot() {
  return window.scrollY > SHRINK_AFTER_PX;
}

function getServerSnapshot() {
  return false;
}

export function LandingHeader() {
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    getScrollSnapshot,
    getServerSnapshot,
  );

  return (
    <header
      className={cn(
        "landing-header sticky top-0 z-20 border-b",
        scrolled
          ? "landing-header--scrolled border-[var(--cao-color-border)] bg-[color-mix(in_srgb,var(--cao-color-bg)_88%,transparent)] shadow-[0_1px_0_rgb(30_26_34/0.06),0_8px_20px_rgb(30_26_34/0.05)] backdrop-blur-[10px]"
          : "border-transparent bg-[var(--cao-color-bg)]",
      )}
    >
      <div
        className={cn(
          "landing-header-inner mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5",
          scrolled ? "py-2.5" : "py-4",
        )}
      >
        <CairoseWordmark
          className={cn(
            "landing-header-wordmark origin-left",
            scrolled && "scale-[0.92]",
          )}
        />
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href={HOW_HREF}
            className="hidden text-sm text-[var(--cao-color-ink-muted)] hover:text-[var(--cao-color-ink)] sm:inline"
          >
            {marketingCopy.nav.how}
          </Link>
          <Link
            href={DEMO_HREF}
            className="hidden text-sm text-[var(--cao-color-ink-muted)] hover:text-[var(--cao-color-ink)] sm:inline"
          >
            {marketingCopy.nav.demo}
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href={SIGN_UP_HREF}>{marketingCopy.nav.signup}</Link>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href={DEMO_STOREFRONT_HREF}>{marketingCopy.nav.cta}</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
