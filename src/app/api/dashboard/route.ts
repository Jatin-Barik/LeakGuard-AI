import { NextResponse } from "next/server";
import {
  demoDashboardStats,
  demoLeakScore,
  demoRecommendations,
  demoSubscriptions,
} from "@/lib/demo-data";

export async function GET() {
  return NextResponse.json({
    stats: demoDashboardStats,
    leakScore: demoLeakScore,
    subscriptions: demoSubscriptions,
    recommendations: demoRecommendations,
  });
}
