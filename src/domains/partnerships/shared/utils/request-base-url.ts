import { headers } from "next/headers";

let cachedBaseUrl: string | null = null;
let cachedPromise: Promise<string> | null = null;

export async function getRequestBaseUrl(): Promise<string> {
  // Client: trust current location
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (cachedBaseUrl) return cachedBaseUrl;
  if (cachedPromise) return cachedPromise;

  cachedPromise = (async () => {
    try {
      const h = await headers();
      const proto = h.get("x-forwarded-proto") ?? "http";
      const host = h.get("x-forwarded-host") ?? h.get("host");
      if (host) {
        cachedBaseUrl = `${proto}://${host}`;
        return cachedBaseUrl;
      }
    } catch {
      // headers() throws when called outside a request context (e.g., during static builds)
    }
    cachedBaseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
    return cachedBaseUrl;
  })();

  return cachedPromise;
}
