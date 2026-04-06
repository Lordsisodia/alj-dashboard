/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agentReports from "../agentReports.js";
import type * as agents from "../agents.js";
import type * as contentGen from "../contentGen.js";
import type * as featureRequests from "../featureRequests.js";
import type * as insights from "../insights.js";
import type * as insightsSeed from "../insightsSeed.js";
import type * as intelligence from "../intelligence.js";
import type * as models from "../models.js";
import type * as scraperImport from "../scraperImport.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agentReports: typeof agentReports;
  agents: typeof agents;
  contentGen: typeof contentGen;
  featureRequests: typeof featureRequests;
  insights: typeof insights;
  insightsSeed: typeof insightsSeed;
  intelligence: typeof intelligence;
  models: typeof models;
  scraperImport: typeof scraperImport;
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
