"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePublicProducts, usePublicTenant } from "@/lib/hooks";
import { casaLimonCopy } from "@/lib/storefront-copy";
import { formatUsdFromCents } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTrackPage } from "@/lib/use-track-page";

export default function StoreHomePage() {
  const params = useParams<{ slug: string }>();
  const tenant = usePublicTenant(params.slug);
  const products = usePublicProducts(tenant?._id);
  useTrackPage("view_home", tenant?.slug);

  if (!tenant || products === undefined) return null;

  const plans = products.filter((p) => p.forSubscription && p.active);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-10 md:px-8">
      <section className="max-w-2xl">
        <p
          className="text-sm tracking-wide uppercase"
          style={{ color: "var(--tenant-accent)" }}
        >
          {casaLimonCopy.eyebrow}
        </p>
        <h1 className="mt-3 font-[family-name:var(--tenant-font-display)] text-4xl leading-tight md:text-5xl">
          {casaLimonCopy.headline}
        </h1>
        <p className="mt-3 text-lg text-[var(--tenant-ink-muted)]">
          {casaLimonCopy.tagline}
        </p>
        <p className="mt-4 max-w-lg text-[var(--tenant-ink-muted)]">
          {casaLimonCopy.sub}
        </p>
        <Button asChild variant="shop" className="mt-6" size="lg">
          <Link href={`/t/${tenant.slug}/planes`}>{casaLimonCopy.cta}</Link>
        </Button>
      </section>
      <section>
        <h2 className="font-[family-name:var(--tenant-font-display)] text-2xl">
          {casaLimonCopy.plansTitle}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {plans.map((product) => (
            <Link
              key={product._id}
              href={`/t/${tenant.slug}/planes/${product._id}`}
              className="rounded-[var(--cao-radius-lg)] border border-[var(--tenant-border)] bg-[var(--tenant-color-bg-elevated)] p-4"
            >
              {product.imageUrls[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrls[0]}
                  alt=""
                  className="mb-3 h-36 w-full rounded-[var(--cao-radius-md)] object-cover"
                />
              )}
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-[var(--tenant-ink-muted)]">
                {formatUsdFromCents(product.priceCents)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
