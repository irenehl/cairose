"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { isClerkConfigured, isConvexConfigured } from "@/lib/env";
import { panel } from "@/lib/copy";
import { usePanelActions } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/panel", label: panel["nav.dashboard"] },
  { href: "/panel/catalog", label: panel["nav.catalog"] },
  { href: "/panel/subscriptions", label: panel["nav.subscriptions"] },
  { href: "/panel/orders", label: panel["nav.orders"] },
  { href: "/panel/settings", label: panel["nav.settings"] },
];

export default function PanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const actions = usePanelActions();

  useEffect(() => {
    if (isClerkConfigured() && isConvexConfigured()) {
      void actions.ensureMe();
    }
    // ensureMe is stable enough for a one-shot sync after sign-in
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <aside className="flex flex-col gap-8 bg-[var(--cao-color-primary)] px-5 py-6 text-[var(--cao-color-on-primary)] md:w-60">
        <Link href="/panel" className="flex items-center gap-3">
          <Image src="/cairose-mark.svg" alt="" width={36} height={36} />
          <span className="font-[family-name:var(--cao-font-display)] text-xl tracking-tight">
            {panel["app.name"]}
          </span>
        </Link>
        <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col">
          {NAV.map((item) => {
            const active =
              item.href === "/panel"
                ? pathname === "/panel"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-[var(--cao-radius-sm)] px-3 py-2 text-sm whitespace-nowrap",
                  active ? "bg-white/15" : "hover:bg-white/10",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="mt-auto hidden text-xs text-[var(--cao-color-on-primary)]/70 md:block">
          Cairose no vende flores. Vos cobrás a tu clienta.
        </p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-[var(--cao-color-border)] bg-[var(--cao-color-bg-elevated)] px-4 py-3 text-sm text-[var(--cao-color-ink-muted)] md:px-8">
          {panel["payments.banner"]}
        </div>
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
