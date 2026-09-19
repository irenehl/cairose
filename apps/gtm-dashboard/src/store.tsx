import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import seedJson from "./data/seed-v5.json";
import {
  STORAGE_KEY,
  type Competitor,
  type Lead,
  type PersistedDashData,
  type SeedData,
  type Task,
} from "./types";

const seed = seedJson as SeedData;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function readPersisted(): PersistedDashData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    const record = parsed as Partial<PersistedDashData>;
    if (!Array.isArray(record.leads) || !Array.isArray(record.tasks)) {
      return null;
    }
    return {
      version: typeof record.version === "string" ? record.version : seed.version,
      leads: record.leads,
      tasks: record.tasks,
    };
  } catch {
    return null;
  }
}

function persist(leads: Lead[], tasks: Task[]): void {
  const payload: PersistedDashData = {
    version: seed.version,
    leads,
    tasks,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function hydrate(): SeedData {
  const persisted = readPersisted();
  if (!persisted) {
    return structuredClone(seed);
  }

  const persistedLeads = new Map(persisted.leads.map((lead) => [lead.id, lead]));
  const leads = seed.leads.map((seedLead) => persistedLeads.get(seedLead.id) ?? seedLead);

  const persistedTasks = new Map(persisted.tasks.map((task) => [task.id, task]));
  const tasks = seed.tasks.map((seedTask) => {
    const overlay = persistedTasks.get(seedTask.id);
    if (!overlay) {
      return seedTask;
    }
    return {
      ...seedTask,
      done: overlay.done,
      date: overlay.date || seedTask.date,
    };
  });

  return {
    ...seed,
    leads,
    tasks,
    competitors: seed.competitors,
  };
}

export type DrawerTarget =
  | { kind: "lead"; id: string }
  | { kind: "competitor"; id: string }
  | null;

type GtmStoreValue = {
  data: SeedData;
  drawer: DrawerTarget;
  selectedLead: Lead | null;
  selectedCompetitor: Competitor | null;
  openLead: (id: string) => void;
  openCompetitor: (id: string) => void;
  closeDrawer: () => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  addLeadNote: (id: string, note: string) => void;
  toggleTask: (id: string) => void;
  resetToSeed: () => void;
};

const GtmStoreContext = createContext<GtmStoreValue | null>(null);

export function GtmProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SeedData>(() => hydrate());
  const [drawer, setDrawer] = useState<DrawerTarget>(null);

  const commit = useCallback((next: SeedData) => {
    setData(next);
    persist(next.leads, next.tasks);
  }, []);

  const openLead = useCallback((id: string) => {
    setDrawer({ kind: "lead", id });
  }, []);

  const openCompetitor = useCallback((id: string) => {
    setDrawer({ kind: "competitor", id });
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawer(null);
  }, []);

  const updateLead = useCallback(
    (id: string, patch: Partial<Lead>) => {
      commit({
        ...data,
        leads: data.leads.map((lead) => (lead.id === id ? { ...lead, ...patch, id: lead.id } : lead)),
      });
    },
    [commit, data],
  );

  const addLeadNote = useCallback(
    (id: string, note: string) => {
      const trimmed = note.trim();
      if (!trimmed) {
        return;
      }
      commit({
        ...data,
        leads: data.leads.map((lead) =>
          lead.id === id
            ? {
                ...lead,
                activity: [...lead.activity, { at: todayIso(), note: trimmed }],
              }
            : lead,
        ),
      });
    },
    [commit, data],
  );

  const toggleTask = useCallback(
    (id: string) => {
      commit({
        ...data,
        tasks: data.tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
      });
    },
    [commit, data],
  );

  const resetToSeed = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(structuredClone(seed));
    setDrawer(null);
  }, []);

  const selectedLead = useMemo(() => {
    if (drawer?.kind !== "lead") {
      return null;
    }
    return data.leads.find((lead) => lead.id === drawer.id) ?? null;
  }, [data.leads, drawer]);

  const selectedCompetitor = useMemo(() => {
    if (drawer?.kind !== "competitor") {
      return null;
    }
    return data.competitors.find((row) => row.id === drawer.id) ?? null;
  }, [data.competitors, drawer]);

  const value = useMemo<GtmStoreValue>(
    () => ({
      data,
      drawer,
      selectedLead,
      selectedCompetitor,
      openLead,
      openCompetitor,
      closeDrawer,
      updateLead,
      addLeadNote,
      toggleTask,
      resetToSeed,
    }),
    [
      addLeadNote,
      closeDrawer,
      data,
      drawer,
      openCompetitor,
      openLead,
      resetToSeed,
      selectedCompetitor,
      selectedLead,
      toggleTask,
      updateLead,
    ],
  );

  return <GtmStoreContext.Provider value={value}>{children}</GtmStoreContext.Provider>;
}

export function useGtmStore(): GtmStoreValue {
  const ctx = useContext(GtmStoreContext);
  if (!ctx) {
    throw new Error("useGtmStore must be used inside GtmProvider");
  }
  return ctx;
}
