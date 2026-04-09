/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agentDebugLogs from "../agentDebugLogs.js";
import type * as agentReports from "../agentReports.js";
import type * as agents from "../agents.js";
import type * as analysisPrompts from "../analysisPrompts.js";
import type * as approvals from "../approvals.js";
import type * as backfill from "../backfill.js";
import type * as candidates from "../candidates.js";
import type * as contentGen from "../contentGen.js";
import type * as costs from "../costs.js";
import type * as creatorBriefs from "../creatorBriefs.js";
import type * as featureRequests from "../featureRequests.js";
import type * as insights from "../insights.js";
import type * as insightsSeed from "../insightsSeed.js";
import type * as intelligence from "../intelligence.js";
import type * as issues from "../issues.js";
import type * as mediaUploads from "../mediaUploads.js";
import type * as models from "../models.js";
import type * as routines from "../routines.js";
import type * as scenes from "../scenes.js";
import type * as scraperImport from "../scraperImport.js";
import type * as toolAnalyses from "../toolAnalyses.js";
import type * as trackedAccounts from "../trackedAccounts.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agentDebugLogs: typeof agentDebugLogs;
  agentReports: typeof agentReports;
  agents: typeof agents;
  analysisPrompts: typeof analysisPrompts;
  approvals: typeof approvals;
  backfill: typeof backfill;
  candidates: typeof candidates;
  contentGen: typeof contentGen;
  costs: typeof costs;
  creatorBriefs: typeof creatorBriefs;
  featureRequests: typeof featureRequests;
  insights: typeof insights;
  insightsSeed: typeof insightsSeed;
  intelligence: typeof intelligence;
  issues: typeof issues;
  mediaUploads: typeof mediaUploads;
  models: typeof models;
  routines: typeof routines;
  scenes: typeof scenes;
  scraperImport: typeof scraperImport;
  toolAnalyses: typeof toolAnalyses;
  trackedAccounts: typeof trackedAccounts;
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
