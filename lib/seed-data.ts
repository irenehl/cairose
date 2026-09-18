/**
 * Re-exports the Convex seed pack so the local demo store stays in lockstep.
 */
import { CADENCES } from "../convex/lib/seedPack";

export {
  CADENCES,
  DEMO_ADDONS,
  DEMO_PRODUCTS,
  DEMO_TENANT,
  DEMO_ZONES,
  usdToCents,
} from "../convex/lib/seedPack";

export type CadenceCode = "weekly" | "biweekly" | "monthly";
export type TierCode = "lite" | "classic" | "luxe";

export const TIERS = [
  { code: "lite" as const, labelEs: "Esencial", priceUsd: 28 },
  { code: "classic" as const, labelEs: "Clásico", priceUsd: 48 },
  { code: "luxe" as const, labelEs: "Especial", priceUsd: 72 },
];

export function cadenceByCode(code: CadenceCode) {
  const found = CADENCES.find((c) => c.code === code);
  if (!found) {
    throw new Error(`Unknown cadence: ${code}`);
  }
  return found;
}
