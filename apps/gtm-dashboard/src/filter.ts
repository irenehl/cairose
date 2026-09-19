import type { Competitor, Lead } from "./types";

export function filterLeads(
  leads: Lead[],
  query: string,
  stage: string,
  role: string,
): Lead[] {
  const q = query.trim().toLowerCase();
  return leads.filter((lead) => {
    if (stage && lead.stage !== stage) {
      return false;
    }
    if (role && lead.role !== role) {
      return false;
    }
    if (!q) {
      return true;
    }
    const haystack = [
      lead.name,
      lead.zone,
      lead.stage,
      lead.channel,
      lead.next,
      lead.opener,
      lead.statusQuo,
      lead.role,
      lead.source,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function filterCompetitors(rows: Competitor[], query: string): Competitor[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return rows;
  }
  return rows.filter((row) =>
    [row.name, row.geo, row.model, row.price, row.sub, row.note, row.pitch, row.gift, row.country]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export function sortByResearchFit(leads: Lead[]): Lead[] {
  return [...leads].sort((a, b) => {
    if (a.fit === null && b.fit === null) {
      return a.name.localeCompare(b.name);
    }
    if (a.fit === null) {
      return 1;
    }
    if (b.fit === null) {
      return -1;
    }
    return b.fit - a.fit;
  });
}
