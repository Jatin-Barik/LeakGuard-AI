"use client";

import { useState, useCallback } from "react";
import type { DashboardStats, LeakScoreBreakdown, Recommendation, Subscription } from "@/types";
import {
  demoDashboardStats,
  demoLeakScore,
  demoRecommendations,
  demoSubscriptions,
} from "@/lib/demo-data";

interface DashboardData {
  stats: DashboardStats;
  leakScore: LeakScoreBreakdown;
  subscriptions: Subscription[];
  recommendations: Recommendation[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboardData(): DashboardData {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    stats: demoDashboardStats,
    leakScore: demoLeakScore,
    subscriptions: demoSubscriptions,
    recommendations: demoRecommendations,
    isLoading,
    error,
    refresh,
  };
}
