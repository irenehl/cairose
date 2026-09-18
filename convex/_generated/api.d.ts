/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as deliveries from "../deliveries.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_seedPack from "../lib/seedPack.js";
import type * as lib_validators from "../lib/validators.js";
import type * as products from "../products.js";
import type * as seed from "../seed.js";
import type * as subscriptions from "../subscriptions.js";
import type * as tenants from "../tenants.js";
import type * as users from "../users.js";
import type * as zones from "../zones.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  deliveries: typeof deliveries;
  "lib/auth": typeof lib_auth;
  "lib/seedPack": typeof lib_seedPack;
  "lib/validators": typeof lib_validators;
  products: typeof products;
  seed: typeof seed;
  subscriptions: typeof subscriptions;
  tenants: typeof tenants;
  users: typeof users;
  zones: typeof zones;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
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

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
