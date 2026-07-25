import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${siteConfig.apiUrl}/api/advisor/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return NextResponse.json(await res.json());
    }
  } catch {
    // Fallback to demo mode when backend is unavailable
  }

  return NextResponse.json({
    response:
      "I'm running in demo mode. Start the FastAPI backend and configure GOOGLE_GEMINI_API_KEY for live AI responses. Your demo data shows $96.96/month in potential savings across 12 subscriptions.",
    model: "demo",
  });
}
