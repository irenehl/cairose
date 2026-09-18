export function clerkPublishableKey(): string {
  return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
}

export function isClerkConfigured(): boolean {
  const key = clerkPublishableKey();
  return key.startsWith("pk_") && !key.includes("placeholder");
}

export function convexUrl(): string {
  return process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
}

export function isConvexConfigured(): boolean {
  const url = convexUrl();
  return (
    url.startsWith("https://") &&
    !url.includes("placeholder") &&
    (url.includes(".convex.cloud") || url.includes(".convex.site"))
  );
}

export function platformRootDomain(): string {
  return process.env.PLATFORM_ROOT_DOMAIN ?? "cairose.local";
}

/** Panel mutations/queries that require Clerk membership. */
export function isPanelBackendLive(): boolean {
  return isConvexConfigured() && isClerkConfigured();
}
