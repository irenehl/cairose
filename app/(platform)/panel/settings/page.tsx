"use client";

import { useEffect, useState } from "react";
import { interpolate, panel } from "@/lib/copy";
import {
  usePanelActions,
  usePanelTenant,
  usePublicZones,
} from "@/lib/hooks";
import { formatSaasPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const tenant = usePanelTenant();
  const zones = usePublicZones(tenant?._id);
  const actions = usePanelActions();
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3A5F3A");
  const [accentColor, setAccentColor] = useState("#E8B84A");
  const [whatsappOps, setWhatsappOps] = useState("");
  const [slug, setSlug] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenant) return;
    setName(tenant.name);
    setLogoUrl(tenant.logoUrl ?? "");
    setPrimaryColor(tenant.primaryColor ?? "#3A5F3A");
    setAccentColor(tenant.accentColor ?? "#E8B84A");
    setWhatsappOps(tenant.whatsappOps ?? "");
    setSlug(tenant.slug);
  }, [tenant]);

  if (tenant === undefined) return <p>Cargando…</p>;
  if (!tenant) return <p>Sin floristería.</p>;

  async function save() {
    if (!tenant) return;
    setError(null);
    try {
      await actions.updateBranding({
        tenantId: tenant._id,
        name,
        logoUrl,
        primaryColor,
        accentColor,
        whatsappOps,
      });
      if (slug !== tenant.slug) {
        await actions.updateSlug(tenant._id, slug);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="font-[family-name:var(--cao-font-display)] text-3xl">
        {panel["brand.title"]}
      </h1>
      <Card className="grid gap-4">
        <p className="text-sm text-[var(--cao-color-ink-muted)]">
          SaaS: {tenant.saasStatus} · precio {formatSaasPrice(tenant.saasPlanPriceCents)}
        </p>
        <div className="grid gap-1">
          <Label>Nombre</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label>{panel["brand.logo"]}</Label>
          <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label>{panel["brand.colors"]} primario</Label>
            <Input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label>Acento</Label>
            <Input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-1">
          <Label>{panel["brand.slug"]}</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          <p className="text-xs text-[var(--cao-color-ink-muted)]">
            {interpolate(panel["brand.slug.help"], { slug })}
          </p>
        </div>
        <div className="grid gap-1">
          <Label>WhatsApp ops</Label>
          <Input
            value={whatsappOps}
            onChange={(e) => setWhatsappOps(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-[var(--cao-color-error)]">{error}</p>}
        <Button onClick={() => void save()}>
          {saved ? "Guardado" : panel["brand.save"]}
        </Button>
      </Card>
      <Card>
        <h2 className="mb-3 font-medium">Zonas (AMSS primero)</h2>
        <ul className="grid gap-2 text-sm">
          {(zones ?? []).map((zone) => (
            <li key={zone._id}>
              <strong>{zone.name}</strong>{" "}
              {zone.included
                ? "incluida"
                : `recargo $${(zone.surchargeCents / 100).toFixed(0)}`}
              {zone.exampleCities.length > 0
                ? ` · ${zone.exampleCities.join(", ")}`
                : ""}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
