"use client";

import Link from "next/link";
import { panel, interpolate } from "@/lib/copy";
import { usePanelProducts, usePanelTenant } from "@/lib/hooks";
import { formatSaasPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PanelHomePage() {
  const tenant = usePanelTenant();
  const products = usePanelProducts(tenant?._id);

  if (tenant === undefined || products === undefined) {
    return <p className="text-[var(--cao-color-ink-muted)]">Cargando…</p>;
  }

  if (tenant === null) {
    return (
      <p className="text-[var(--cao-color-ink-muted)]">
        No hay floristería asociada. Corré el seed de Casa Limón.
      </p>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div>
        <p className="text-sm text-[var(--cao-color-ink-muted)]">
          {tenant.saasStatus} · SaaS {formatSaasPrice(tenant.saasPlanPriceCents)}
        </p>
        <h1 className="mt-2 font-[family-name:var(--cao-font-display)] text-4xl">
          {interpolate(panel["dash.hello"], { name: tenant.name })}
        </h1>
        <p className="mt-2 text-[var(--cao-color-ink-muted)]">
          {panel["dash.subtitle"]}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/panel/catalog">{panel["dash.cta.catalog"]}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/panel/settings">{panel["dash.cta.brand"]}</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href={`/t/${tenant.slug}`}>Ver tienda</Link>
        </Button>
      </div>
      {products.length === 0 ? (
        <Card>
          <p>{panel["dash.empty.catalog"]}</p>
        </Card>
      ) : (
        <p className="text-sm text-[var(--cao-color-ink-muted)]">
          {products.length} productos en catálogo · demo / ejemplo
        </p>
      )}
    </div>
  );
}
