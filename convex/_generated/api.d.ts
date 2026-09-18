/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as deliveries from "../deliveries";
import type * as products from "../products";
import type * as seed from "../seed";
import type * as subscriptions from "../subscriptions";
import type * as tenants from "../tenants";
import type * as users from "../users";
import type * as zones from "../zones";

declare const fullApi: ApiFromModules<{
  deliveries: typeof deliveries;
  products: typeof products;
  seed: typeof seed;
  subscriptions: typeof subscriptions;
  tenants: typeof tenants;
  users: typeof users;
  zones: typeof zones;
}>;

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
