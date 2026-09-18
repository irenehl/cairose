"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useEffect, useState, type ReactNode } from "react";
import {
  clerkPublishableKey,
  convexUrl,
  isClerkConfigured,
  isConvexConfigured,
} from "@/lib/env";

const convexClient = isConvexConfigured()
  ? new ConvexReactClient(convexUrl())
  : null;

function ClerkConvexTree({ children }: { children: ReactNode }) {
  if (!convexClient) return children;
  return (
    <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  const clerkOn = isClerkConfigured();
  const convexOn = isConvexConfigured();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const inner =
    convexOn && convexClient ? (
      clerkOn ? (
        <ClerkConvexTree>{children}</ClerkConvexTree>
      ) : (
        <ConvexProvider client={convexClient}>{children}</ConvexProvider>
      )
    ) : (
      children
    );

  if (!clerkOn) return inner;

  // Avoid rendering Clerk until the client is mounted so placeholder keys
  // don't break the first server pass.
  if (!mounted) return inner;

  return (
    <ClerkProvider publishableKey={clerkPublishableKey()}>{inner}</ClerkProvider>
  );
}
