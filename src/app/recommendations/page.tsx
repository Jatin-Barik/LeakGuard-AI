"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { Card, CardContent } from "@/components/ui/card";
import { demoRecommendations } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function RecommendationsPage() {
  const totalMonthly = demoRecommendations.reduce(
    (sum, r) => sum + r.estimatedMonthlySavings,
    0
  );
  const totalAnnual = demoRecommendations.reduce(
    (sum, r) => sum + r.estimatedAnnualSavings,
    0
  );

  return (
    <DashboardShell
      title="AI Recommendations"
      subtitle="Personalized actions to optimize your subscriptions"
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border-indigo-500/20">
            <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-indigo-500/20 p-3">
                  <Sparkles className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Potential Savings</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {formatCurrency(totalMonthly)}/mo
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Annual Impact</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAnnual)}/yr</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-4">
          {demoRecommendations.map((rec, i) => (
            <RecommendationCard key={rec.id} recommendation={rec} index={i} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
