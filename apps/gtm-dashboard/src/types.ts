export type LeadRole = "prospect" | "dnc" | "counterexample";

export type ActivityNote = {
  at: string;
  note: string;
};

export type Lead = {
  id: string;
  pipeline: "b2b";
  name: string;
  zone: string;
  stage: string;
  channel: string;
  next: string;
  nextDate: string;
  source: string;
  hold: boolean;
  role: LeadRole;
  fit: number | null;
  url: string;
  opener: string;
  value: string;
  close: string;
  statusQuo: string;
  activity: ActivityNote[];
};

export type Competitor = {
  id: string;
  name: string;
  geo: string;
  model: string;
  price: string;
  sub: string;
  note: string;
  url: string;
  country: string;
  gift: string;
  pitch: string;
};

export type Task = {
  id: string;
  title: string;
  owner: string;
  date: string;
  done: boolean;
};

export type Locks = {
  buyer: string;
  takeRate: string;
  coexist: boolean;
  outreachHold: boolean;
  icp: string;
};

export type SeedData = {
  version: string;
  locks: Locks;
  leads: Lead[];
  competitors: Competitor[];
  tasks: Task[];
};

export type PersistedDashData = {
  version: string;
  leads: Lead[];
  tasks: Task[];
};

export type TabId = "b2b" | "icp" | "comp" | "b2c" | "semana" | "links";

export const STORAGE_KEY = "cairose-gtm-crm-dash-v5-data";

export const TAB_LABELS: Record<TabId, string> = {
  b2b: "B2B",
  icp: "ICP/research",
  comp: "Competencia",
  b2c: "B2C",
  semana: "Esta semana",
  links: "Links",
};

export const LEAD_STAGES = ["Lista", "Idea", "Nurture", "No contactar"] as const;
