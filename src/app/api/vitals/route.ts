import { NextResponse } from "next/server";

// Stub web vitals endpoint to avoid 500s during local dev.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    console.debug("[api/vitals] received", body);
  } catch (err) {
    console.error("[api/vitals] error", err);
  }
  return NextResponse.json({ ok: true });
}
