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
import type * as http from "../http.js";
import type * as mutations_users from "../mutations/users.js";
import type * as mutations_workspaces from "../mutations/workspaces.js";
import type * as queries_notifications from "../queries/notifications.js";
import type * as queries_users from "../queries/users.js";
import type * as queries_workspaces from "../queries/workspaces.js";
import type * as util from "../util.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  http: typeof http;
  "mutations/users": typeof mutations_users;
  "mutations/workspaces": typeof mutations_workspaces;
  "queries/notifications": typeof queries_notifications;
  "queries/users": typeof queries_users;
  "queries/workspaces": typeof queries_workspaces;
  util: typeof util;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
