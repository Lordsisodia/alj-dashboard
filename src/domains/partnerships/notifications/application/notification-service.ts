import { NotificationsPayloadSchema, type NotificationItem } from "./schema";
import { mockNotifications } from "../ui/fixtures/notification-fixtures";

export type NotificationResult =
  | { items: NotificationItem[]; error: null }
  | { items: NotificationItem[]; error: string };

/**
 * Lightweight fetcher with schema validation and graceful fallback.
 * Currently uses local fixtures; later can swap to API without touching UI.
 */
export async function getNotifications(): Promise<NotificationResult> {
  const payload = mockNotifications as unknown;
  const parsed = NotificationsPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Notifications payload failed validation; falling back to raw data", parsed.error);
    }
    return { items: [], error: "Could not load notifications. Please try again." };
  }
  return { items: parsed.data, error: null };
}
