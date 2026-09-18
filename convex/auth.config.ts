/**
 * Clerk JWT provider for Convex.
 * Set CLERK_JWT_ISSUER_DOMAIN in the Convex dashboard (e.g. https://verb-noun-00.clerk.accounts.dev).
 */
const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
