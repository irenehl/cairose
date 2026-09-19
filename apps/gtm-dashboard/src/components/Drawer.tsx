import { useEffect, useState, type ReactNode } from "react";
import { useGtmStore } from "../store";
import { LEAD_STAGES, type Lead } from "../types";

export function Drawer() {
  const { drawer, selectedLead, selectedCompetitor, closeDrawer, updateLead, addLeadNote } =
    useGtmStore();
  const drawerKey = drawer ? `${drawer.kind}:${drawer.id}` : "";
  const [note, setNote] = useState("");
  const [noteFor, setNoteFor] = useState(drawerKey);
  if (noteFor !== drawerKey) {
    setNoteFor(drawerKey);
    setNote("");
  }

  useEffect(() => {
    if (!drawer) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDrawer, drawer]);

  if (!drawer) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar drawer"
        className="h-full flex-1 bg-stone-900/30"
        onClick={closeDrawer}
      />
      <aside className="flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-stone-300 bg-white p-4 pb-16 shadow-xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-stone-900">
            {selectedLead?.name ?? selectedCompetitor?.name ?? "Detalle"}
          </h2>
          <button type="button" className="text-sm text-stone-500 underline" onClick={closeDrawer}>
            Cerrar
          </button>
        </div>

        {selectedLead ? (
          <LeadDetail
            lead={selectedLead}
            note={note}
            setNote={setNote}
            onPatch={(patch) => updateLead(selectedLead.id, patch)}
            onAddNote={() => {
              addLeadNote(selectedLead.id, note);
              setNote("");
            }}
          />
        ) : null}

        {selectedCompetitor ? (
          <dl className="space-y-2 text-sm">
            <Row label="Geo" value={selectedCompetitor.geo} />
            <Row label="Country" value={selectedCompetitor.country} />
            <Row label="Modelo" value={selectedCompetitor.model} />
            <Row label="Precio" value={selectedCompetitor.price} />
            <Row label="Sub" value={selectedCompetitor.sub} />
            <Row label="Gift" value={selectedCompetitor.gift} />
            <Row label="Pitch" value={selectedCompetitor.pitch} />
            <Row label="Nota" value={selectedCompetitor.note} />
            <Row
              label="URL"
              value={
                selectedCompetitor.url ? (
                  <a
                    className="text-blue-700 underline"
                    href={selectedCompetitor.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {selectedCompetitor.url}
                  </a>
                ) : (
                  "—"
                )
              }
            />
            <p className="pt-2 text-xs text-stone-500">
              Competencia (watch). No es lead CRM. Re-sync desde seed en cada load.
            </p>
          </dl>
        ) : null}
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-stone-500">{label}</dt>
      <dd className="text-stone-800">{value}</dd>
    </div>
  );
}

function LeadDetail({
  lead,
  note,
  setNote,
  onPatch,
  onAddNote,
}: {
  lead: Lead;
  note: string;
  setNote: (value: string) => void;
  onPatch: (patch: Partial<Pick<Lead, "stage" | "channel" | "next" | "nextDate" | "opener">>) => void;
  onAddNote: () => void;
}) {
  return (
    <div className="space-y-3 text-sm">
      {lead.role === "dnc" || lead.hold ? (
        <p className="rounded border border-red-300 bg-red-50 px-2 py-1 text-red-800">
          Memories / DNC: no contactar.
        </p>
      ) : null}
      {lead.role === "counterexample" ? (
        <p className="rounded border border-violet-300 bg-violet-50 px-2 py-1 text-violet-900">
          Amelia Casa Floral = contraejemplo. Aprendizaje de mercado — no pitch de venta.
        </p>
      ) : null}

      <Row label="Zona" value={lead.zone} />
      <Row label="Rol" value={lead.role} />
      <Row label="Source" value={lead.source} />
      <Row label="Fit (research, no purchase intent)" value={lead.fit === null ? "n/a" : String(lead.fit)} />
      <Row label="Status quo" value={lead.statusQuo} />
      <Row label="Value / close" value={`${lead.value || "TBD"} · ${lead.close || "—"}`} />
      <Row
        label="URL"
        value={
          lead.url ? (
            <a className="text-blue-700 underline" href={lead.url} target="_blank" rel="noreferrer">
              {lead.url}
            </a>
          ) : (
            "—"
          )
        }
      />

      <label className="block">
        <span className="text-xs text-stone-500">Stage</span>
        <select
          className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
          value={lead.stage}
          onChange={(event) => onPatch({ stage: event.target.value })}
        >
          {LEAD_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
          {LEAD_STAGES.includes(lead.stage as (typeof LEAD_STAGES)[number]) ? null : (
            <option value={lead.stage}>{lead.stage}</option>
          )}
        </select>
      </label>

      <label className="block">
        <span className="text-xs text-stone-500">Canal</span>
        <input
          className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
          value={lead.channel}
          onChange={(event) => onPatch({ channel: event.target.value })}
        />
      </label>

      <label className="block">
        <span className="text-xs text-stone-500">Next</span>
        <textarea
          className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
          rows={2}
          value={lead.next}
          onChange={(event) => onPatch({ next: event.target.value })}
        />
      </label>

      <label className="block">
        <span className="text-xs text-stone-500">Next date</span>
        <input
          type="date"
          className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
          value={lead.nextDate}
          onChange={(event) => onPatch({ nextDate: event.target.value })}
        />
      </label>

      <label className="block">
        <span className="text-xs text-stone-500">Opener</span>
        <textarea
          className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
          rows={4}
          value={lead.opener}
          onChange={(event) => onPatch({ opener: event.target.value })}
        />
      </label>

      <div>
        <p className="text-xs text-stone-500">Notas / activity</p>
        <ul className="mt-1 space-y-1">
          {lead.activity.length === 0 ? <li className="text-stone-400">sin notas</li> : null}
          {lead.activity.map((item, index) => (
            <li key={`${item.at}-${index}`} className="rounded bg-stone-50 px-2 py-1">
              <span className="text-xs text-stone-500">{item.at}</span>
              <div>{item.note}</div>
            </li>
          ))}
        </ul>
        <textarea
          className="mt-2 w-full rounded border border-stone-300 px-2 py-1"
          rows={2}
          placeholder="Agregar nota…"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <button
          type="button"
          className="mt-1 rounded bg-stone-900 px-3 py-1 text-xs text-white"
          onClick={onAddNote}
        >
          Guardar nota
        </button>
      </div>
    </div>
  );
}
