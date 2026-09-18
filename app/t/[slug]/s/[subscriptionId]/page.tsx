"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { interpolate } from "@/lib/copy";
import {
  useCadences,
  usePublicSubscription,
  useRecordEvent,
} from "@/lib/hooks";
import { analyticsContext, track, whatsappHref } from "@/lib/analytics";
import { casaLimonCopy } from "@/lib/storefront-copy";
import type { CadenceCode, SubscriptionEventType } from "@/lib/types";
import { formatDateEs } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EVENT_LABEL: Record<SubscriptionEventType, string> = {
  skip_next: "Saltar próxima",
  pause: "Pausar",
  resume: "Reanudar",
  cancel: "Cancelar",
  change_address: "Cambiar dirección",
  change_cadence: "Cambiar cadencia",
};

export default function ManageSubscriptionPage() {
  const params = useParams<{ slug: string; subscriptionId: string }>();
  const detail = usePublicSubscription(params.subscriptionId);
  const record = useRecordEvent();
  const cadences = useCadences();
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [cadence, setCadence] = useState<CadenceCode>("biweekly");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (detail === undefined) return <p className="px-6 py-16">Cargando…</p>;
  if (detail === null) {
    return <p className="px-6 py-16">No encontramos este plan.</p>;
  }

  const { subscription, shopName, whatsappOps, shopSlug } = detail;
  const ctx = analyticsContext(shopSlug);

  async function act(
    type: SubscriptionEventType,
    extra?: { cadence?: CadenceCode; addressLine1?: string },
  ) {
    setError(null);
    try {
      if (type === "skip_next") {
        track("skip_intent", { ...ctx, surface: "storefront" });
        track("wa_handoff", { ...ctx, reason: "skip" });
      }
      if (type === "pause") {
        track("pause_intent", { ...ctx, surface: "storefront" });
        track("wa_handoff", { ...ctx, reason: "pause" });
      }
      await record({
        subscriptionId: subscription._id,
        type,
        note: note || undefined,
        ...extra,
      });
      setMessage(
        "Listo, lo anotamos. Si hace falta, lo terminamos por WhatsApp.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar");
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-10 md:px-8">
      <div>
        <p className="text-sm uppercase tracking-wide">{shopName}</p>
        <h1 className="mt-2 font-[family-name:var(--tenant-font-display)] text-3xl">
          {detail.productName}
        </h1>
        <p className="mt-2 text-[var(--tenant-color-ink-muted)]">
          {subscription.isGift
            ? `${detail.payerName} envía a ${detail.recipientName}`
            : `Para ${detail.recipientName}`}
        </p>
      </div>
      <div className="rounded-[var(--cao-radius-lg)] border border-[var(--tenant-color-border)] bg-[var(--tenant-color-bg-elevated)] p-4 text-sm">
        <p>Estado: {subscription.status}</p>
        <p>Pago: esperando cobro de la floristería (fuera de la app)</p>
        <p>Próxima entrega: {formatDateEs(subscription.nextDeliveryAt)}</p>
        <p>
          Dirección: {detail.addressLine1}
          {detail.colonia ? `, ${detail.colonia}` : ""}
        </p>
      </div>
      <p className="text-sm text-[var(--tenant-color-ink-muted)]">
        {casaLimonCopy.opsWhatsapp}{" "}
        {whatsappOps ? (
          <a
            href={whatsappHref(whatsappOps)}
            target="_blank"
            rel="noreferrer"
            className="underline"
            onClick={() =>
              track("wa_handoff", { ...ctx, reason: "support" })
            }
          >
            {whatsappOps}
          </a>
        ) : null}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="shop"
          disabled={subscription.status !== "active"}
          onClick={() => void act("skip_next")}
        >
          {EVENT_LABEL.skip_next}
        </Button>
        <Button
          variant="outline"
          disabled={subscription.status !== "active"}
          onClick={() => void act("pause")}
        >
          {EVENT_LABEL.pause}
        </Button>
        <Button
          variant="outline"
          disabled={subscription.status !== "paused"}
          onClick={() => void act("resume")}
        >
          {EVENT_LABEL.resume}
        </Button>
        <Button
          variant="outline"
          disabled={subscription.status === "canceled"}
          onClick={() => void act("cancel")}
        >
          {EVENT_LABEL.cancel}
        </Button>
      </div>
      <div className="grid gap-2">
        <Input
          placeholder="Nueva dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={() => void act("change_address", { addressLine1: address })}
        >
          {EVENT_LABEL.change_address}
        </Button>
      </div>
      <div className="grid gap-2">
        <select
          className="h-10 rounded-[var(--cao-radius-md)] border border-[var(--tenant-color-border)] bg-[var(--tenant-color-bg-elevated)] px-3"
          value={cadence}
          onChange={(e) => setCadence(e.target.value as CadenceCode)}
        >
          {cadences.map((c) => (
            <option key={c.code} value={c.code}>
              {c.labelEs}
            </option>
          ))}
        </select>
        <Button
          variant="outline"
          onClick={() => void act("change_cadence", { cadence })}
        >
          {EVENT_LABEL.change_cadence}
        </Button>
      </div>
      <Input
        placeholder="Nota para la floristería"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {message && <p className="text-sm text-[var(--cao-color-success)]">{message}</p>}
      {error && <p className="text-sm text-[var(--cao-color-error)]">{error}</p>}
      <p className="text-xs text-[var(--tenant-color-ink-muted)]">
        {interpolate(casaLimonCopy.payOutside, { shopName })}
      </p>
    </div>
  );
}
