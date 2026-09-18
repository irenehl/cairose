"use client";

import { useState, type ReactNode } from "react";
import { panel } from "@/lib/copy";
import {
  usePanelActions,
  usePanelProducts,
  usePanelTenant,
} from "@/lib/hooks";
import { analyticsContext, track } from "@/lib/analytics";
import type { Product, TierCode } from "@/lib/types";
import { formatUsdFromCents } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Draft = {
  sku: string;
  name: string;
  description: string;
  priceUsd: string;
  imageUrls: string;
  active: boolean;
  type: "" | "bouquet" | "box";
  tier: "" | TierCode;
  forSubscription: boolean;
  forOccasion: boolean;
};

const emptyDraft = (): Draft => ({
  sku: "",
  name: "",
  description: "",
  priceUsd: "",
  imageUrls: "",
  active: true,
  type: "",
  tier: "",
  forSubscription: true,
  forOccasion: true,
});

function fromProduct(product: Product): Draft {
  return {
    sku: product.sku,
    name: product.name,
    description: product.description,
    priceUsd: String(product.priceCents / 100),
    imageUrls: product.imageUrls.join(", "),
    active: product.active,
    type: product.type ?? "",
    tier: product.tier ?? "",
    forSubscription: product.forSubscription,
    forOccasion: product.forOccasion,
  };
}

export default function CatalogPage() {
  const tenant = usePanelTenant();
  const products = usePanelProducts(tenant?._id);
  const actions = usePanelActions();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [error, setError] = useState<string | null>(null);

  if (tenant === undefined || products === undefined) {
    return <p>Cargando…</p>;
  }
  if (!tenant) return <p>Sin floristería.</p>;

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft());
    setError(null);
    setOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setDraft(fromProduct(product));
    setError(null);
    setOpen(true);
  }

  async function save() {
    if (!tenant) return;
    setError(null);
    const priceCents = Math.round(Number(draft.priceUsd) * 100);
    if (!draft.name.trim() || Number.isNaN(priceCents)) {
      setError("Nombre y precio son obligatorios.");
      return;
    }
    const imageUrls = draft.imageUrls
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      if (editing) {
        await actions.updateProduct(editing._id, {
          name: draft.name,
          description: draft.description,
          priceCents,
          imageUrls,
          active: draft.active,
          type: draft.type || undefined,
          tier: draft.tier || undefined,
          forSubscription: draft.forSubscription,
          forOccasion: draft.forOccasion,
        });
      } else {
        await actions.createProduct({
          tenantId: tenant._id,
          sku: draft.sku || draft.name.toLowerCase().replace(/\s+/g, "-"),
          name: draft.name,
          description: draft.description,
          priceCents,
          imageUrls,
          active: draft.active,
          type: draft.type || undefined,
          tier: draft.tier || undefined,
          forSubscription: draft.forSubscription,
          forOccasion: draft.forOccasion,
        });
      }
      const sku =
        editing?.sku ??
        (draft.sku || draft.name.toLowerCase().replace(/\s+/g, "-"));
      track("panel_edit_price", {
        ...analyticsContext(tenant.slug),
        sku,
        tier: draft.tier || undefined,
      });
      if (draft.forSubscription) {
        track("panel_edit_cadence", {
          ...analyticsContext(tenant.slug),
          cadence: "weekly",
        });
      }
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--cao-font-display)] text-3xl">
            {panel["catalog.title"]}
          </h1>
          <p className="text-sm text-[var(--cao-color-ink-muted)]">
            Precios en USD. Demo / ejemplo.
          </p>
        </div>
        <Button onClick={openCreate}>{panel["catalog.add"]}</Button>
      </div>
      {products.length === 0 ? (
        <Card>{panel["catalog.empty"]}</Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <Card key={product._id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs tracking-wide text-[var(--cao-color-ink-muted)] uppercase">
                    {product.sku} · {product.active ? "activo" : "oculto"}
                  </p>
                  <h2 className="text-lg font-medium">{product.name}</h2>
                </div>
                <p className="font-medium">
                  {formatUsdFromCents(product.priceCents)}
                </p>
              </div>
              <p className="text-sm text-[var(--cao-color-ink-muted)]">
                {product.description}
              </p>
              <p className="text-xs text-[var(--cao-color-ink-muted)]">
                {product.forSubscription ? "Plan" : ""}{" "}
                {product.forOccasion ? "Ocasión" : ""}{" "}
                {product.tier ? `· ${product.tier}` : ""}
              </p>
              <Button variant="outline" size="sm" onClick={() => openEdit(product)}>
                Editar
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>
            {editing ? "Editar producto" : panel["catalog.add"]}
          </DialogTitle>
          <div className="mt-4 grid gap-3">
            {!editing && (
              <Field label="SKU">
                <Input
                  value={draft.sku}
                  onChange={(e) => setDraft({ ...draft, sku: e.target.value })}
                />
              </Field>
            )}
            <Field label="Nombre">
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>
            <Field label="Descripción">
              <Textarea
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
            </Field>
            <Field label={panel["catalog.price"] + " (USD)"}>
              <Input
                type="number"
                min="0"
                step="1"
                value={draft.priceUsd}
                onChange={(e) =>
                  setDraft({ ...draft, priceUsd: e.target.value })
                }
              />
            </Field>
            <Field label="Imágenes (URLs, separadas por coma)">
              <Input
                value={draft.imageUrls}
                onChange={(e) =>
                  setDraft({ ...draft, imageUrls: e.target.value })
                }
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) =>
                  setDraft({ ...draft, active: e.target.checked })
                }
              />
              Activo
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.forSubscription}
                onChange={(e) =>
                  setDraft({ ...draft, forSubscription: e.target.checked })
                }
              />
              Para plan
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.forOccasion}
                onChange={(e) =>
                  setDraft({ ...draft, forOccasion: e.target.checked })
                }
              />
              Para ocasión
            </label>
            {error && <p className="text-sm text-[var(--cao-color-error)]">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                {panel["common.cancel"]}
              </Button>
              <Button onClick={() => void save()}>{panel["common.save"]}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
