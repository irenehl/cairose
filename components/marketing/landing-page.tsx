import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LandingHeader } from "@/components/marketing/landing-header";
import { StorefrontPreviewFrame } from "@/components/marketing/storefront-preview-frame";
import { CairoseWordmark } from "@/components/marketing/wordmark";
import {
  DEMO_STOREFRONT_HREF,
  SIGN_UP_HREF,
  marketingCopy,
} from "@/lib/marketing-copy";

const FOOTER_LINK_CLASS =
  "text-[var(--cao-color-ink-muted)] hover:text-[var(--cao-color-primary)] motion-safe:transition-colors";

const HOW_HREF = `#${marketingCopy.how.id}`;
const DEMO_HREF = `#${marketingCopy.demo.id}`;

function PrimaryDemoCta({ className }: { className?: string }) {
  return (
    <Button asChild size="lg" className={className}>
      <Link href={DEMO_STOREFRONT_HREF}>{marketingCopy.hero.ctaPrimary}</Link>
    </Button>
  );
}

function GhostCta({
  href,
  children,
  className,
}: {
  href: string;
  children: string;
  className?: string;
}) {
  return (
    <Button asChild variant="outline" size="lg" className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export function LandingPage() {
  const copy = marketingCopy;

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] overflow-hidden"
      >
        <div className="absolute -top-24 right-[-4rem] h-72 w-72 rounded-full bg-[var(--cao-color-lilac)]/45 blur-3xl" />
        <div className="absolute top-36 -left-16 h-56 w-56 rounded-full bg-[var(--cao-color-mint)]/30 blur-3xl" />
        <div className="absolute top-16 right-1/3 h-24 w-24 rounded-full bg-[var(--cao-color-sun)]/40 blur-2xl" />
      </div>

      <LandingHeader />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col">
        <section className="flex flex-col gap-6 px-5 pt-10 pb-16 sm:pt-16">
          <p className="text-sm font-medium tracking-[0.16em] text-[var(--cao-color-ink-muted)] uppercase">
            {copy.hero.eyebrow}
          </p>
          <h1 className="max-w-3xl font-[family-name:var(--cao-font-display)] text-[2.15rem] leading-[1.12] font-extrabold text-balance sm:text-5xl">
            {copy.hero.title}
          </h1>
          <p className="max-w-xl text-base text-[var(--cao-color-ink-muted)] sm:text-lg">
            {copy.hero.subBefore}
            <strong className="font-semibold text-[var(--cao-color-ink)]">
              {copy.hero.subEm}
            </strong>
            {copy.hero.subAfter}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryDemoCta />
            <GhostCta href={HOW_HREF}>{copy.hero.ctaHow}</GhostCta>
          </div>
          <p className="text-sm text-[var(--cao-color-ink-muted)]">
            <Link
              href={DEMO_STOREFRONT_HREF}
              className="underline-offset-4 hover:underline"
            >
              {copy.hero.connect}
            </Link>
          </p>
          <p className="text-sm text-[var(--cao-color-ink-muted)]">
            {copy.hero.micro}
          </p>
        </section>

        <section className="border-t border-[var(--cao-color-border)] px-5 py-14">
          <ul className="grid gap-4 md:grid-cols-3">
            {copy.problem.pains.map((pain) => (
              <li
                key={pain}
                className="rounded-[var(--cao-radius-lg)] border border-[var(--cao-color-border)] bg-[var(--cao-color-bg-elevated)] p-5"
              >
                <p>{pain}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl font-[family-name:var(--cao-font-display)] text-xl font-bold">
            {copy.problem.promise}
          </p>
        </section>

        <section
          id={copy.how.id}
          className="scroll-mt-24 border-t border-[var(--cao-color-border)] px-5 py-14"
        >
          <h2 className="font-[family-name:var(--cao-font-display)] text-3xl font-bold">
            {copy.how.title}
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.how.steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-[var(--cao-radius-lg)] bg-[var(--cao-color-bg-elevated)] p-5 ring-1 ring-[var(--cao-color-border)]"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cao-color-sun)] font-[family-name:var(--cao-font-display)] text-sm font-bold text-[var(--cao-color-ink)]">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-[family-name:var(--cao-font-display)] text-lg font-bold">
                  {step.title}
                </h3>
                <p className="mt-2 text-[var(--cao-color-ink-muted)]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-[var(--cao-color-border)] px-5 py-14">
          <h2 className="font-[family-name:var(--cao-font-display)] text-3xl font-bold">
            {copy.includes.title}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {copy.includes.cards.map((card, index) => {
              const accents = [
                "bg-[var(--cao-color-lilac)]",
                "bg-[var(--cao-color-mint)]",
                "bg-[var(--cao-color-accent)]",
                "bg-[var(--cao-color-sun)]",
              ] as const;
              return (
                <Card key={card.title} className="shadow-none">
                  <span
                    aria-hidden
                    className={`mb-3 block h-2.5 w-2.5 rounded-full ${accents[index]}`}
                  />
                  <h3 className="font-[family-name:var(--cao-font-display)] text-lg font-bold">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[var(--cao-color-ink-muted)]">
                    {card.body}
                  </p>
                </Card>
              );
            })}
          </div>
          <p className="mt-5 text-sm text-[var(--cao-color-ink-muted)]">
            {copy.includes.note}
          </p>
        </section>

        <section
          id={copy.demo.id}
          className="scroll-mt-24 border-t border-[var(--cao-color-border)] px-5 py-14"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-medium tracking-[0.14em] text-[var(--cao-color-ink-muted)] uppercase">
                {copy.demo.kicker}
              </p>
              <p className="mt-3 max-w-lg text-lg text-[var(--cao-color-ink-muted)]">
                {copy.demo.body}
              </p>
              <PrimaryDemoCta className="mt-6" />
            </div>
            <Link
              href={DEMO_STOREFRONT_HREF}
              aria-label={copy.demo.cta}
              className="block"
            >
              <StorefrontPreviewFrame />
            </Link>
          </div>
        </section>

        <section className="border-t border-[var(--cao-color-border)] px-5 py-14">
          <h2 className="font-[family-name:var(--cao-font-display)] text-3xl font-bold">
            {copy.audience.title}
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {copy.audience.items.map((item) => (
              <li
                key={item}
                className="rounded-[var(--cao-radius-lg)] border border-[var(--cao-color-border)] bg-[var(--cao-color-bg-elevated)] p-5"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-[var(--cao-color-border)] px-5 py-14">
          <h2 className="font-[family-name:var(--cao-font-display)] text-3xl font-bold">
            {copy.faq.title}
          </h2>
          <div className="mt-6 divide-y divide-[var(--cao-color-border)] border-y border-[var(--cao-color-border)]">
            {copy.faq.items.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="cursor-pointer list-none font-medium marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-[var(--cao-color-ink-muted)] group-open:hidden">
                      +
                    </span>
                    <span className="hidden text-[var(--cao-color-ink-muted)] group-open:inline">
                      −
                    </span>
                  </span>
                </summary>
                <p className="mt-2 text-[var(--cao-color-ink-muted)]">{item.a}</p>
              </details>
            ))}
            <details className="group py-4">
              <summary className="cursor-pointer list-none font-medium marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {copy.faq.exampleQ}
                  <span className="text-[var(--cao-color-ink-muted)] group-open:hidden">
                    +
                  </span>
                  <span className="hidden text-[var(--cao-color-ink-muted)] group-open:inline">
                    −
                  </span>
                </span>
              </summary>
              <p className="mt-2 text-[var(--cao-color-ink-muted)]">
                {copy.faq.exampleA}
              </p>
              <PrimaryDemoCta className="mt-4" />
            </details>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--cao-color-border)] bg-[var(--cao-color-bg-elevated)]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CairoseWordmark />
            <p className="mt-3 max-w-sm text-sm text-[var(--cao-color-ink-muted)]">
              {copy.footer.claim}
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link href={HOW_HREF} className={FOOTER_LINK_CLASS}>
              {copy.footer.how}
            </Link>
            <Link href={DEMO_HREF} className={FOOTER_LINK_CLASS}>
              {copy.footer.demo}
            </Link>
            <Link href={SIGN_UP_HREF} className={FOOTER_LINK_CLASS}>
              {copy.footer.signup}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
