import type { Lead } from "../types";

type LeadListProps = {
  leads: Lead[];
  mode: "pipeline" | "research";
  onSelect: (id: string) => void;
};

function badges(lead: Lead) {
  const items: { label: string; className: string }[] = [];
  if (lead.hold || lead.role === "dnc") {
    items.push({ label: "HOLD/DNC", className: "bg-red-100 text-red-800" });
  }
  if (lead.role === "counterexample") {
    items.push({ label: "CONTRASTE", className: "bg-violet-100 text-violet-800" });
  }
  if (lead.role === "prospect") {
    items.push({ label: "prospect", className: "bg-stone-100 text-stone-700" });
  }
  return items;
}

export function LeadList({ leads, mode, onSelect }: LeadListProps) {
  if (leads.length === 0) {
    return <p className="p-4 text-sm text-stone-500">sin dato</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead className="bg-stone-100 text-xs tracking-wide text-stone-500 uppercase">
          <tr>
            <th className="px-3 py-2 font-medium">Lead</th>
            <th className="px-3 py-2 font-medium">Zona</th>
            {mode === "pipeline" ? (
              <>
                <th className="px-3 py-2 font-medium">Stage</th>
                <th className="px-3 py-2 font-medium">Canal</th>
                <th className="px-3 py-2 font-medium">Next</th>
              </>
            ) : (
              <>
                <th className="px-3 py-2 font-medium">Fit (research)</th>
                <th className="px-3 py-2 font-medium">Rol</th>
                <th className="px-3 py-2 font-medium">Status quo</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const rowTone =
              lead.role === "dnc" || lead.hold
                ? "bg-red-50/70"
                : lead.role === "counterexample"
                  ? "bg-violet-50/70"
                  : "bg-white";
            return (
              <tr
                key={lead.id}
                className={`cursor-pointer border-t border-stone-200 ${rowTone} hover:bg-stone-50`}
                onClick={() => onSelect(lead.id)}
              >
                <td className="px-3 py-2 align-top">
                  <div className="font-medium text-stone-900">{lead.name}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {badges(lead).map((badge) => (
                      <span
                        key={badge.label}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                  {lead.role === "counterexample" ? (
                    <p className="mt-1 text-xs text-violet-800">No es pitch de venta.</p>
                  ) : null}
                  {lead.role === "dnc" ? (
                    <p className="mt-1 text-xs text-red-800">No contactar.</p>
                  ) : null}
                </td>
                <td className="px-3 py-2 align-top text-stone-700">{lead.zone}</td>
                {mode === "pipeline" ? (
                  <>
                    <td className="px-3 py-2 align-top">{lead.stage}</td>
                    <td className="px-3 py-2 align-top">{lead.channel}</td>
                    <td className="px-3 py-2 align-top text-stone-700">{lead.next || "—"}</td>
                  </>
                ) : (
                  <>
                    <td className="px-3 py-2 align-top font-medium">
                      {lead.fit === null ? "n/a (contraste)" : lead.fit}
                    </td>
                    <td className="px-3 py-2 align-top">{lead.role}</td>
                    <td className="px-3 py-2 align-top text-stone-700">{lead.statusQuo}</td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
