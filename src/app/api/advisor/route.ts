import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { demoDashboardStats, demoSubscriptions } from "@/lib/demo-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ detail: "Message is required." }, { status: 400 });
    }
    if (message.length > 1_000) {
      return NextResponse.json({ detail: "Message must be under 1,000 characters." }, { status: 413 });
    }

    const res = await fetch(`${siteConfig.apiUrl}/api/advisor/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, message }),
      signal: AbortSignal.timeout(20_000),
    });

    if (res.ok) {
      return NextResponse.json(await res.json());
    }
  } catch {
    // Fallback to demo mode when backend is unavailable
  }

  return NextResponse.json({
    response:
      `I'm running in demo mode. Start the FastAPI backend and configure GOOGLE_GEMINI_API_KEY for live AI responses. Your demo data shows $${demoDashboardStats.potentialSavings.toFixed(2)}/month in potential savings across ${demoSubscriptions.length} subscriptions.`,
    model: "demo",
  });
}
