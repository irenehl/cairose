"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePublicTenant } from "@/lib/hooks";
import { analyticsContext, track, whatsappHref } from "@/lib/analytics";
import { DEMO_BRAND_KEY, DEMO_SLUG, casaLimonCopy } from "@/lib/storefront-copy";

export default function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams<{ slug: string }>();
  const tenant = usePublicTenant(params.slug);

  if (tenant === undefined) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center">
        Cargando…
      </div>
    );
  }

  if (tenant === null) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20">
        <h1 className="font-[family-name:var(--cao-font-display)] text-3xl">
          No encontramos esta tienda
        </h1>
        <p className="mt-3 text-[var(--cao-color-ink-muted)]">
          Revisá el enlace o pedile a tu floristería la dirección correcta.
        </p>
      </div>
    );
  }

  const brandKey =
    tenant.slug === DEMO_SLUG || tenant.name === "Casa Limón"
      ? DEMO_BRAND_KEY
      : tenant.slug;

  return (
    <div data-tenant={brandKey} className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link href={`/t/${tenant.slug}`} className="flex items-center gap-3">
          <Image
            src={tenant.logoUrl ?? "/tenants/casa-limon/mark.svg"}
            alt={tenant.name}
            width={40}
            height={40}
          />
          <Image
            src="/tenants/casa-limon/wordmark.svg"
            alt={tenant.name}
            width={168}
            height={32}
            className="hidden h-8 w-auto sm:block"
          />
          <span className="font-[family-name:var(--tenant-font-display)] text-xl sm:hidden">
            {tenant.name}
          </span>
        </Link>
        <Link href={`/t/${tenant.slug}/planes`} className="text-sm">
          {casaLimonCopy.cta}
        </Link>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="mt-16 px-4 py-8 text-sm text-[var(--tenant-ink-muted)] md:px-8">
        <p>{casaLimonCopy.footer}</p>
        {tenant.whatsappOps && (
          <p>
            WhatsApp{" "}
            <a
              href={whatsappHref(tenant.whatsappOps)}
              target="_blank"
              rel="noreferrer"
              className="underline"
              onClick={() =>
                track("wa_handoff", {
                  ...analyticsContext(tenant.slug),
                  reason: "support",
                })
              }
            >
              {tenant.whatsappOps}
            </a>
          </p>
        )}
        <p className="mt-2 text-xs">{casaLimonCopy.payOutside}</p>
        <p className="mt-3 text-xs text-[var(--tenant-ink-muted)]">
          {casaLimonCopy.showcaseNote}
        </p>
      </footer>
    </div>
  );
}
