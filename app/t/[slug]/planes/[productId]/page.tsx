"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { interpolate } from "@/lib/copy";
import {
  useCadences,
  useCreateSubscription,
  usePublicAddOns,
  usePublicProducts,
  usePublicTenant,
  usePublicZones,
} from "@/lib/hooks";
import { casaLimonCopy } from "@/lib/storefront-copy";
import { formatUsdFromCents } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SubscribePage() {
  const params = useParams<{ slug: string; productId: string }>();
  const router = useRouter();
  const tenant = usePublicTenant(params.slug);
  const products = usePublicProducts(tenant?._id);
  const addOns = usePublicAddOns(tenant?._id);
  const zones = usePublicZones(tenant?._id);
  const cadences = useCadences();
  const create = useCreateSubscription();

  const product = useMemo(
    () => products?.find((p) => p._id === params.productId),
    [products, params.productId],
  );

  const [isGift, setIsGift] = useState(true);
  const [cadence, setCadence] = useState<"weekly" | "biweekly" | "monthly">(
    "biweekly",
  );
  const [payerName, setPayerName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [colonia, setColonia] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!tenant || products === undefined) return null;
  if (!product) {
    return (
      <div className="px-6 py-16">
        {interpolate(casaLimonCopy.error, { shopName: tenant.name })}
      </div>
    );
  }

  const selectedZone = zones?.find((z) => z._id === zoneId);
  const addOnTotal = (addOns ?? [])
    .filter((a) => selectedAddOns.includes(a._id))
    .reduce((sum, a) => sum + a.priceCents, 0);
  const surcharge = selectedZone && !selectedZone.included ? selectedZone.surchargeCents : 0;
  const total = product.priceCents + addOnTotal + surcharge;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!tenant || !product) return;
    setBusy(true);
    setError(null);
    try {
      const id = await create({
        tenantSlug: tenant.slug,
        productId: product._id,
        cadence,
        isGift,
        payerName,
        payerEmail: payerEmail || undefined,
        payerPhone: payerPhone || undefined,
        recipientName: isGift ? recipientName : payerName,
        recipientPhone: isGift ? recipientPhone || undefined : payerPhone || undefined,
        addressLine1,
        colonia: colonia || undefined,
        deliveryNotes: deliveryNotes || undefined,
        zoneId: zoneId || undefined,
        cardMessage: cardMessage || undefined,
        addOnIds: selectedAddOns,
      });
      router.push(`/t/${tenant.slug}/s/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : casaLimonCopy.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 md:grid-cols-2 md:px-8">
      <div>
        {product.imageUrls[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrls[0]}
            alt=""
            className="mb-4 h-56 w-full rounded-[var(--cao-radius-lg)] object-cover"
          />
        )}
        <h1 className="font-[family-name:var(--tenant-font-display)] text-3xl">
          {product.name}
        </h1>
        <p className="mt-2 text-[var(--tenant-ink-muted)]">
          {product.description}
        </p>
        <p className="mt-4 text-xl font-medium">
          {formatUsdFromCents(product.priceCents)}
        </p>
        <p className="mt-4 text-sm">
          {interpolate(casaLimonCopy.planBody, {
            cadence: cadences.find((c) => c.code === cadence)?.labelEs ?? "",
          })}
        </p>
        <p className="mt-2 text-sm text-[var(--tenant-ink-muted)]">
          {casaLimonCopy.diaspora}
        </p>
      </div>
      <form onSubmit={(e) => void submit(e)} className="grid gap-4">
        <div className="grid gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={isGift ? "shop" : "outline"}
              onClick={() => setIsGift(true)}
            >
              {casaLimonCopy.gift}
            </Button>
            <Button
              type="button"
              variant={!isGift ? "shop" : "outline"}
              onClick={() => setIsGift(false)}
            >
              {casaLimonCopy.self}
            </Button>
          </div>
          {isGift && (
            <p className="text-sm text-[var(--tenant-ink-muted)]">
              {casaLimonCopy.giftBody}
            </p>
          )}
        </div>
        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium">Cada cuánto</legend>
          {cadences.map((c) => (
            <label key={c.code} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="cadence"
                checked={cadence === c.code}
                onChange={() => setCadence(c.code)}
              />
              {interpolate(casaLimonCopy.cadence, { cadence: c.labelEs })}
            </label>
          ))}
        </fieldset>
        <Field label="Tu nombre (quien paga)">
          <Input value={payerName} onChange={(e) => setPayerName(e.target.value)} required />
        </Field>
        <Field label="Tu email">
          <Input type="email" value={payerEmail} onChange={(e) => setPayerEmail(e.target.value)} />
        </Field>
        <Field label="Tu teléfono">
          <Input value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} />
        </Field>
        {isGift && (
          <>
            <Field label={casaLimonCopy.recipient}>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
              />
            </Field>
            <Field label="Teléfono de quien recibe">
              <Input
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
              />
            </Field>
          </>
        )}
        <Field label={casaLimonCopy.address}>
          <Input
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            required
          />
        </Field>
        <Field label="Colonia">
          <Input value={colonia} onChange={(e) => setColonia(e.target.value)} />
        </Field>
        <Field label="Zona">
          <select
            className="h-10 w-full rounded-[var(--cao-radius-md)] border border-[var(--tenant-border)] bg-[var(--tenant-color-bg-elevated)] px-3"
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
          >
            <option value="">Elegí zona</option>
            {(zones ?? []).map((zone) => (
              <option key={zone._id} value={zone._id}>
                {zone.name}
                {zone.included ? " (incluida)" : ` (+$${zone.surchargeCents / 100})`}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-[var(--tenant-ink-muted)]">
            {casaLimonCopy.zoneHelp}
          </p>
        </Field>
        <Field label={casaLimonCopy.note}>
          <Textarea
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
          />
        </Field>
        <Field label="Mensaje en la tarjeta (máx. 200)">
          <Textarea
            maxLength={200}
            value={cardMessage}
            onChange={(e) => setCardMessage(e.target.value)}
          />
        </Field>
        {(addOns ?? []).length > 0 && (
          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium">Extras</legend>
            {addOns?.map((addOn) => (
              <label key={addOn._id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedAddOns.includes(addOn._id)}
                  onChange={(e) => {
                    setSelectedAddOns((current) =>
                      e.target.checked
                        ? [...current, addOn._id]
                        : current.filter((id) => id !== addOn._id),
                    );
                  }}
                />
                {addOn.name} · {formatUsdFromCents(addOn.priceCents)}
              </label>
            ))}
          </fieldset>
        )}
        <div className="rounded-[var(--cao-radius-md)] border border-dashed border-[var(--tenant-border)] p-3 text-sm">
          <p className="font-medium">{casaLimonCopy.paySoon}</p>
          <p className="mt-1 text-[var(--tenant-ink-muted)]">
            {casaLimonCopy.payOutside}
          </p>
          <p className="mt-3 text-xs uppercase tracking-wide">Próximamente</p>
          <button
            type="button"
            disabled
            className="mt-2 h-10 w-full rounded-[var(--cao-radius-md)] bg-black/10 text-sm opacity-60"
          >
            Pagar en la app — próximamente
          </button>
        </div>
        <p className="text-lg font-medium">Total estimado: {formatUsdFromCents(total)}</p>
        {error && <p className="text-sm text-[var(--cao-color-error)]">{error}</p>}
        <Button type="submit" variant="shop" size="lg" disabled={busy}>
          {busy ? "Guardando…" : casaLimonCopy.choose}
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
