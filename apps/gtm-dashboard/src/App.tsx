import { useEffect, useMemo, useState } from "react";
import { CompetitorTable } from "./components/CompetitorTable";
import { Drawer } from "./components/Drawer";
import { LeadList } from "./components/LeadList";
import { Sidebar } from "./components/Sidebar";
import { TabNav } from "./components/TabNav";
import { TaskList } from "./components/TaskList";
import { filterCompetitors, filterLeads, sortByResearchFit } from "./filter";
import { GtmProvider, useGtmStore } from "./store";
import { LEAD_STAGES, type TabId } from "./types";

function parseTab(raw: string | null): TabId {
  if (raw === "leads" || raw === "b2b") {
    return "b2b";
  }
  if (raw === "icp" || raw === "comp" || raw === "b2c" || raw === "semana" || raw === "links") {
    return raw;
  }
  return "b2b";
}

function Dashboard() {
  const { data, openLead, openCompetitor, toggleTask } = useGtmStore();
  const [tab, setTab] = useState<TabId>(() =>
    parseTab(new URLSearchParams(window.location.search).get("tab")),
  );
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url);
  }, [tab]);

  const filteredLeads = useMemo(
    () => filterLeads(data.leads, query, stage, role),
    [data.leads, query, role, stage],
  );
  const researchLeads = useMemo(() => sortByResearchFit(filteredLeads), [filteredLeads]);
  const filteredCompetitors = useMemo(
    () => filterCompetitors(data.competitors, query),
    [data.competitors, query],
  );

  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TabNav tab={tab} onChange={setTab} />
          <div className="flex-1 overflow-auto p-4">
            {tab === "b2b" || tab === "icp" || tab === "comp" ? (
              <div className="mb-3 flex flex-wrap items-end gap-2">
                <label className="block text-xs text-stone-500">
                  Search
                  <input
                    className="mt-1 block w-64 rounded border border-stone-300 bg-white px-2 py-1 text-sm"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={tab === "comp" ? "nombre, geo, modelo…" : "nombre, zona, opener…"}
                  />
                </label>
                {tab !== "comp" ? (
                  <>
                    <label className="block text-xs text-stone-500">
                      Stage
                      <select
                        className="mt-1 block rounded border border-stone-300 bg-white px-2 py-1 text-sm"
                        value={stage}
                        onChange={(event) => setStage(event.target.value)}
                      >
                        <option value="">Todas</option>
                        {LEAD_STAGES.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs text-stone-500">
                      Rol
                      <select
                        className="mt-1 block rounded border border-stone-300 bg-white px-2 py-1 text-sm"
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                      >
                        <option value="">Todos</option>
                        <option value="prospect">prospect</option>
                        <option value="dnc">dnc</option>
                        <option value="counterexample">counterexample</option>
                      </select>
                    </label>
                  </>
                ) : null}
                <p className="text-xs text-stone-500">
                  {tab === "comp"
                    ? `${filteredCompetitors.length} / ${data.competitors.length} competitors`
                    : `${filteredLeads.length} / ${data.leads.length} leads`}
                </p>
              </div>
            ) : null}

            {tab === "b2b" ? (
              <section>
                <p className="mb-2 text-sm text-stone-600">
                  Florist leads. Memories = HOLD/DNC. Amelia Casa Floral = contraejemplo, no pitch
                  normal.
                </p>
                <LeadList leads={filteredLeads} mode="pipeline" onSelect={openLead} />
              </section>
            ) : null}

            {tab === "icp" ? (
              <section>
                <p className="mb-2 rounded border border-sky-200 bg-sky-50 px-2 py-1 text-sm text-sky-950">
                  ICP / research: prioridad y fit — <strong>no</strong> es intención de compra.
                </p>
                <LeadList leads={researchLeads} mode="research" onSelect={openLead} />
              </section>
            ) : null}

            {tab === "comp" ? (
              <section>
                <p className="mb-2 text-sm text-stone-600">
                  Watch list desde <code>competitors[]</code>. No mezclar con leads CRM.
                </p>
                <CompetitorTable competitors={filteredCompetitors} onSelect={openCompetitor} />
              </section>
            ) : null}

            {tab === "b2c" ? (
              <section className="rounded border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-600">
                <h2 className="mb-1 text-base font-semibold text-stone-900">B2C</h2>
                <p>sin dato — no hay pipeline consumer en seed-v5.</p>
              </section>
            ) : null}

            {tab === "semana" ? (
              <section>
                <p className="mb-2 text-sm text-stone-600">Tasks de la semana. Check persiste en localStorage.</p>
                <TaskList tasks={data.tasks} onToggle={toggleTask} />
              </section>
            ) : null}

            {tab === "links" ? <LinksPanel /> : null}
          </div>
        </div>
      </div>
      <footer className="flex flex-wrap gap-x-4 gap-y-1 border-t border-stone-300 bg-stone-900 px-4 py-2 text-xs text-stone-100">
        <span>Buyer: florist SaaS</span>
        <span>Take: 0% v1</span>
        <span>Coexist: site / WhatsApp</span>
        <span>Outreach: HOLD</span>
        <span>ICP: {data.locks.icp}</span>
      </footer>
      <Drawer />
    </div>
  );
}

function LinksPanel() {
  const { data } = useGtmStore();
  const leadLinks = data.leads.filter((lead) => lead.url);
  const competitorLinks = data.competitors.filter((row) => row.url);

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div>
        <h2 className="mb-2 text-sm font-semibold">Leads con URL</h2>
        <ul className="space-y-1 text-sm">
          {leadLinks.map((lead) => (
            <li key={lead.id}>
              <a className="text-blue-700 underline" href={lead.url} target="_blank" rel="noreferrer">
                {lead.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="mb-2 text-sm font-semibold">Competencia</h2>
        <ul className="space-y-1 text-sm">
          {competitorLinks.map((row) => (
            <li key={row.id}>
              <a className="text-blue-700 underline" href={row.url} target="_blank" rel="noreferrer">
                {row.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <GtmProvider>
      <Dashboard />
    </GtmProvider>
  );
}
