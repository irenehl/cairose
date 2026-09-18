"use client";

import Link from "next/link";
import { panel } from "@/lib/copy";
import {
  usePanelSubscriptions,
  usePanelTenant,
} from "@/lib/hooks";
import { formatDateEs } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const CADENCE_LABEL: Record<string, string> = {
  weekly: panel["plans.cadence.1w"],
  biweekly: panel["plans.cadence.2w"],
  monthly: panel["plans.cadence.4w"],
};

export default function PlansPage() {
  const tenant = usePanelTenant();
  const rows = usePanelSubscriptions(tenant?._id);

  if (tenant === undefined || rows === undefined) return <p>Cargando…</p>;
  if (!tenant) return <p>Sin floristería.</p>;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="font-[family-name:var(--cao-font-display)] text-3xl">
          {panel["plans.title"]}
        </h1>
        <p className="text-sm text-[var(--cao-color-ink-muted)]">
          {panel["plans.gift"]} · {panel["plans.skip"]} · {panel["plans.pause"]}
        </p>
      </div>
      {rows.length === 0 ? (
        <Card>{panel["plans.empty"]}</Card>
      ) : (
        <div className="grid gap-3">
          {rows.map((row) => (
            <Card key={row.subscription._id} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-medium">{row.productName}</h2>
                <span className="text-sm text-[var(--cao-color-ink-muted)]">
                  {row.subscription.status} · {row.subscription.paymentStatus}
                </span>
              </div>
              <p className="text-sm">
                Paga: {row.payerName}
                {row.subscription.isGift ? ` → llega a ${row.recipientName}` : ""}
              </p>
              <p className="text-sm text-[var(--cao-color-ink-muted)]">
                {CADENCE_LABEL[row.subscription.cadence] ?? row.subscription.cadence} ·
                próxima {formatDateEs(row.subscription.nextDeliveryAt)}
              </p>
              <Link
                href={`/t/${tenant.slug}/s/${row.subscription._id}`}
                className="text-sm underline"
              >
                Ver / gestionar
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
