import { useGtmStore } from "../store";

export function Sidebar() {
  const { data, resetToSeed } = useGtmStore();
  const floristLeads = data.leads.filter((lead) => lead.role !== "counterexample");
  const holdCount = data.leads.filter((lead) => lead.hold || lead.role === "dnc").length;
  const openTasks = data.tasks.filter((task) => !task.done).length;

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-5 border-r border-stone-300 bg-stone-50 p-4">
      <div>
        <p className="text-[11px] font-semibold tracking-wide text-stone-500 uppercase">Cairose GTM</p>
        <h1 className="mt-1 text-lg font-semibold text-stone-900">CRM-lite v5</h1>
        <p className="mt-1 text-xs text-stone-600">Operativo. Sin polish. Landings STOP.</p>
      </div>

      <dl className="space-y-1 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-stone-500">Leads B2B</dt>
          <dd className="font-medium">{data.leads.length}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-stone-500">Prospects</dt>
          <dd className="font-medium">{floristLeads.length}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-stone-500">HOLD/DNC</dt>
          <dd className="font-medium">{holdCount}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-stone-500">Competencia</dt>
          <dd className="font-medium">{data.competitors.length}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-stone-500">Tasks abiertas</dt>
          <dd className="font-medium">{openTasks}</dd>
        </div>
      </dl>

      <div className="rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-950">
        Outreach HOLD hasta OK Daniela. Memories = DNC. Amelia Casa Floral = contraste, no pitch.
      </div>

      <button
        type="button"
        onClick={resetToSeed}
        className="mt-auto text-left text-xs text-stone-500 underline"
      >
        Reset a seed-v5 (borra localStorage)
      </button>
    </aside>
  );
}
