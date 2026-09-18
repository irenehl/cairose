"use client";

import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/env";
import { panel } from "@/lib/copy";
import Link from "next/link";

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-4 px-6 py-16">
        <h1 className="font-[family-name:var(--cao-font-display)] text-3xl">
          {panel["auth.login.title"]}
        </h1>
        <p className="text-[var(--cao-color-ink-muted)]">
          Clerk no está configurado. El panel demo abre sin login. Para Google y
          OTP, poné claves reales en <code>.env.local</code>.
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <span className="rounded-[var(--cao-radius-md)] border border-[var(--cao-color-border)] px-4 py-3 opacity-60">
            {panel["auth.login.google"]}
          </span>
          <span className="rounded-[var(--cao-radius-md)] border border-[var(--cao-color-border)] px-4 py-3 opacity-60">
            {panel["auth.login.otp"]}
          </span>
        </div>
        <Link
          href="/panel"
          className="inline-flex h-11 items-center justify-center rounded-[var(--cao-radius-md)] bg-[var(--cao-color-primary)] text-[var(--cao-color-on-primary)]"
        >
          Abrir panel demo
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-16">
      <SignIn />
    </div>
  );
}
