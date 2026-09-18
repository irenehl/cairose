"use client";

import { panel } from "@/lib/copy";
import {
  usePanelActions,
  usePanelDeliveries,
  usePanelTenant,
} from "@/lib/hooks";
import type { DeliveryStatus } from "@/lib/types";
import { formatDateEs } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const STATUSES: { value: DeliveryStatus; label: string }[] = [
  { value: "scheduled", label: "Programada" },
  { value: "out_for_delivery", label: "En camino" },
  { value: "delivered", label: "Entregada" },
  { value: "failed_nobody_home", label: "Falló: nadie en casa" },
  { value: "failed_other", label: "Falló: otro" },
];

export default function OrdersPage() {
  const tenant = usePanelTenant();
  const deliveries = usePanelDeliveries(tenant?._id);
  const actions = usePanelActions();

  if (tenant === undefined || deliveries === undefined) return <p>Cargando…</p>;
  if (!tenant) return <p>Sin floristería.</p>;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <h1 className="font-[family-name:var(--cao-font-display)] text-3xl">
        {panel["orders.title"]}
      </h1>
      {deliveries.length === 0 ? (
        <Card>{panel["orders.empty"]}</Card>
      ) : (
        <div className="grid gap-3">
          {deliveries.map((delivery) => (
            <Card key={delivery._id} className="grid gap-2">
              <div className="flex flex-wrap justify-between gap-2">
                <h2 className="font-medium">{delivery.productName}</h2>
                <span className="text-sm">{formatDateEs(delivery.scheduledFor)}</span>
              </div>
              <p className="text-sm">
                Para {delivery.recipientName} · paga {delivery.payerName}
              </p>
              <p className="text-sm text-[var(--cao-color-ink-muted)]">
                {delivery.addressLine1}
              </p>
              {delivery.notes && (
                <p className="text-sm">Nota: {delivery.notes}</p>
              )}
              <label className="grid max-w-sm gap-1 text-sm">
                Estado
                <select
                  className="h-10 rounded-[var(--cao-radius-md)] border border-[var(--cao-color-border)] bg-[var(--cao-color-bg-elevated)] px-3"
                  value={delivery.status}
                  onChange={(e) => {
                    void actions.updateDelivery(
                      delivery._id,
                      e.target.value as DeliveryStatus,
                      delivery.floristNotes,
                    );
                  }}
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm">
                Notas de la floristería
                <textarea
                  className="min-h-16 rounded-[var(--cao-radius-md)] border border-[var(--cao-color-border)] bg-[var(--cao-color-bg-elevated)] px-3 py-2"
                  defaultValue={delivery.floristNotes ?? ""}
                  onBlur={(e) => {
                    void actions.updateDelivery(
                      delivery._id,
                      delivery.status,
                      e.target.value,
                    );
                  }}
                />
              </label>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
