import { marketingCopy } from "@/lib/marketing-copy";

/**
 * Tenant plan teaser for the B2B landing — B2C beats the florist should see.
 * Not a flower grid and not Cairose chrome selling bouquets.
 */
export function StorefrontPreviewFrame() {
  const copy = marketingCopy.demo;

  return (
    <div className="overflow-hidden rounded-[var(--cao-radius-lg)] border border-[var(--cao-color-border)] bg-[var(--cao-color-bg-elevated)] shadow-sm">
      <div className="flex items-center gap-3 border-b border-[var(--cao-color-border)] bg-[var(--cao-color-bg)] px-3 py-2">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--cao-color-accent)]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--cao-color-sun)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--cao-color-mint)]" />
        </div>
        <p className="min-w-0 flex-1 truncate rounded-full bg-white px-3 py-1 text-center text-xs text-[var(--cao-color-ink-muted)]">
          {copy.frameAddress}
        </p>
      </div>
      <div className="p-5">
        <p className="font-[family-name:var(--cao-font-display)] text-sm font-bold text-[var(--cao-color-ink)]">
          {copy.frameBrand}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--cao-color-primary)] px-3 py-1 text-sm text-[var(--cao-color-on-primary)]">
            {copy.beatSelf}
          </span>
          <span className="rounded-full border border-[var(--cao-color-border)] px-3 py-1 text-sm text-[var(--cao-color-ink)]">
            {copy.beatGift}
          </span>
        </div>
        <p className="mt-4 text-sm font-medium text-[var(--cao-color-ink)]">
          {copy.beatCadence}
        </p>
        <p className="mt-2 text-sm text-[var(--cao-color-ink-muted)]">
          {copy.beatPay}
        </p>
      </div>
    </div>
  );
}
