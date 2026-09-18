"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePublicProducts, usePublicTenant } from "@/lib/hooks";
import { casaLimonCopy } from "@/lib/storefront-copy";
import { formatUsdFromCents } from "@/lib/utils";
import { useTrackPage } from "@/lib/use-track-page";

export default function PlanesPage() {
  const params = useParams<{ slug: string }>();
  const tenant = usePublicTenant(params.slug);
  const products = usePublicProducts(tenant?._id);
  useTrackPage("view_plan", tenant?.slug);

  if (!tenant || products === undefined) return null;

  const plans = products.filter((p) => p.forSubscription);
  const occasion = products.filter((p) => p.forOccasion && !p.forSubscription);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8 md:px-8">
      <div>
        <h1 className="font-[family-name:var(--tenant-font-display)] text-4xl">
          {casaLimonCopy.plansTitle}
        </h1>
        <p className="mt-2 text-[var(--tenant-ink-muted)]">
          {casaLimonCopy.sub}
        </p>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
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
                className="mb-3 h-40 w-full rounded-[var(--cao-radius-md)] object-cover"
              />
            )}
            <p className="text-xs uppercase">{casaLimonCopy.subscription}</p>
            <h2 className="mt-1 text-lg font-medium">{product.name}</h2>
            <p className="text-sm text-[var(--tenant-ink-muted)]">
              {product.description}
            </p>
            <p className="mt-3 font-medium">
              {formatUsdFromCents(product.priceCents)}
            </p>
          </Link>
        ))}
      </section>
      {occasion.length > 0 && (
        <section>
          <h2 className="font-[family-name:var(--tenant-font-display)] text-2xl">
            {casaLimonCopy.occasion}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {occasion.map((product) => (
              <div
                key={product._id}
                className="rounded-[var(--cao-radius-lg)] border border-[var(--tenant-border)] bg-[var(--tenant-color-bg-elevated)] p-4 opacity-90"
              >
                {product.imageUrls[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrls[0]}
                    alt=""
                    className="mb-3 h-32 w-full rounded-[var(--cao-radius-md)] object-cover"
                  />
                )}
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm">{formatUsdFromCents(product.priceCents)}</p>
                <p className="mt-2 text-xs text-[var(--tenant-ink-muted)]">
                  Pedido de un día: escribinos por WhatsApp. Los planes se arman
                  acá.
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
