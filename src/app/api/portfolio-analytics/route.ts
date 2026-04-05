import { NextResponse } from "next/server";

type PortfolioEvent = {
  name?: string;
  payload?: Record<string, unknown>;
  ts?: number;
};

export async function POST(request: Request) {
  try {
    const event = (await request.json()) as PortfolioEvent;
    console.info("[portfolio-analytics]", event.name ?? "unknown", event.payload ?? {});
  } catch (error) {
    console.warn("[portfolio-analytics] failed to parse payload", error);
  }
  return new NextResponse(null, { status: 204 });
}
