import { marketingCopy } from "@/lib/marketing-copy";

/**
 * Abstract tenant storefront mock for the B2B landing.
 * Not a flower shop, not Casa Limón chrome — only “así se vería tu marca”.
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
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-7 w-7 rounded-[var(--cao-radius-sm)] bg-[var(--cao-color-lilac)]"
            />
            <span className="font-[family-name:var(--cao-font-display)] text-sm font-bold text-[var(--cao-color-ink)]">
              {copy.frameBrand}
            </span>
          </div>
          <span
            aria-hidden
            className="h-6 w-14 rounded-full bg-[var(--cao-color-border)]"
          />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {["a", "b", "c"].map((key) => (
            <div
              key={key}
              className="rounded-[var(--cao-radius-md)] border border-[var(--cao-color-border)] bg-[var(--cao-color-bg)] p-2"
            >
              <div
                aria-hidden
                className="h-9 rounded bg-[var(--cao-color-lilac)]/30"
              />
              <div
                aria-hidden
                className="mt-2 h-2 w-4/5 rounded bg-[var(--cao-color-ink)]/12"
              />
              <div
                aria-hidden
                className="mt-1.5 h-2 w-1/2 rounded bg-[var(--cao-color-ink)]/10"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
