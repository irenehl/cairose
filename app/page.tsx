import Image from "next/image";
import Link from "next/link";
import { panel } from "@/lib/copy";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col px-6 py-10">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Image
          src="/cairose-wordmark.svg"
          alt="cairose"
          width={160}
          height={32}
          priority
        />
        <Link
          href="/panel"
          className="rounded-[var(--cao-radius-md)] bg-[var(--cao-color-primary)] px-4 py-2 text-sm text-[var(--cao-color-on-primary)]"
        >
          {panel["auth.login.title"]}
        </Link>
      </header>
      <main className="mx-auto mt-20 flex w-full max-w-3xl flex-col gap-8">
        <p className="text-sm tracking-wide text-[var(--cao-color-ink-muted)] uppercase">
          Para floristerías
        </p>
        <h1 className="font-[family-name:var(--cao-font-display)] text-4xl leading-tight font-semibold md:text-5xl">
          {panel["dash.subtitle"]}
        </h1>
        <p className="max-w-xl text-[var(--cao-color-ink-muted)]">
          Cairose no vende flores. La floristería es dueña del catálogo, el
          precio, la entrega y el cobro. Esta es la plataforma; la tienda es de
          ellas.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/panel"
            className="inline-flex h-12 items-center justify-center rounded-[var(--cao-radius-md)] bg-[var(--cao-color-primary)] px-5 text-[var(--cao-color-on-primary)]"
          >
            {panel["auth.login.title"]}
          </Link>
          <Link
            href="/t/casa-limon"
            className="inline-flex h-12 items-center justify-center rounded-[var(--cao-radius-md)] border border-[var(--cao-color-border)] px-5"
          >
            Ver vitrina Casa Limón
          </Link>
        </div>
        <p className="text-sm text-[var(--cao-color-ink-muted)]">
          Showcase ficticio — así se vería tu marca. No es Memories ni ninguna
          floristería real. Ruta:{" "}
          <code className="font-mono text-xs">/t/casa-limon</code> o{" "}
          <code className="font-mono text-xs">casa-limon.cairose.local</code>.
        </p>
      </main>
    </div>
  );
}
