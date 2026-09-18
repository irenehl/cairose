"use client";

import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/env";
import Link from "next/link";

export default function SignUpPage() {
  if (!isClerkConfigured()) {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-4 px-6 py-16">
        <h1 className="font-[family-name:var(--cao-font-display)] text-3xl">
          Crear cuenta
        </h1>
        <p className="text-[var(--cao-color-ink-muted)]">
          Configurá Clerk para registro con Google o código por SMS / email.
        </p>
        <Link href="/panel" className="underline">
          Ir al panel demo
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-16">
      <SignUp />
    </div>
  );
}
