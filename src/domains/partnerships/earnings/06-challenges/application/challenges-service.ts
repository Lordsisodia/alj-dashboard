import { cache } from "react";
import path from "node:path";
import { promises as fs } from "node:fs";
import type { EarningsChallenge } from "@/domains/partnerships/earnings/06-challenges/data/earningsChallenges";
import type { LeaderboardEntry } from "@/domains/partnerships/earnings/04-achievements/data/earningsAchievements";
import { getRequestBaseUrl } from "@/domains/shared/utils/request-base-url";

const CHALLENGES_ENDPOINT = "/data/earnings/challenges.json";
const LEADERBOARD_ENDPOINT = "/data/earnings/leaderboard.json";
const CHALLENGES_DISK_PATH = path.join(process.cwd(), "public", "data", "earnings", "challenges.json");
const LEADERBOARD_DISK_PATH = path.join(process.cwd(), "public", "data", "earnings", "leaderboard.json");
const REVALIDATE_SECONDS = 60 * 60; // 1 hour
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

async function readJsonFromDisk<T>(filePath: string): Promise<T> {
  const file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file) as T;
}

async function fetchJson<T>(endpoint: string, diskFallback: string): Promise<T> {
  if (isBuildPhase) {
    return readJsonFromDisk<T>(diskFallback);
  }

  try {
    const baseUrl = await getRequestBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (response.ok) {
      return (await response.json()) as T;
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Falling back to disk for ${endpoint}`, error);
    }
  }

  return readJsonFromDisk<T>(diskFallback);
}

const loadChallenges = cache(async () => fetchJson<EarningsChallenge[]>(CHALLENGES_ENDPOINT, CHALLENGES_DISK_PATH));
const loadLeaderboard = cache(async () => fetchJson<LeaderboardEntry[]>(LEADERBOARD_ENDPOINT, LEADERBOARD_DISK_PATH));

export async function getEarningsChallenges(): Promise<EarningsChallenge[]> {
  return loadChallenges();
}

export async function getLeaderboardEntries(): Promise<LeaderboardEntry[]> {
  return loadLeaderboard();
}
