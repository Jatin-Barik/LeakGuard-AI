"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeDollarSign, Gauge, Lightbulb, ShieldAlert, TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LeakScoreGauge } from "@/components/dashboard/leak-score-gauge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { demoDashboardStats, demoLeakScore, demoRecommendations } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

const breakdown = [
  { label: "Unused subscriptions", value: demoLeakScore.unusedSubscriptions, impact: "Planet Fitness and NYT look underused." },
  { label: "Duplicate services", value: demoLeakScore.duplicateSubscriptions, impact: "Music, video, and cloud overlap detected." },
  { label: "Price hikes", value: demoLeakScore.priceHikes, impact: "Netflix increased 48.4% from its prior tier." },
  { label: "Large expenses", value: demoLeakScore.largeExpenses, impact: "Adobe dominates monthly software spend." },
  { label: "Spending trend", value: demoLeakScore.spendingTrend, impact: "Recurring spend is rising month over month." },
];

export default function LeakScorePage() {
  return (
    <DashboardShell
      title="Leak Score"
      subtitle="A transparent 0-100 financial leak risk model with explainable drivers"
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="h-4 w-4 text-sky-300" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <LeakScoreGauge score={demoLeakScore.overall} size="lg" />
            <div className="mt-8 grid w-full gap-3 sm:grid-cols-3">
              {[
                { label: "Monthly leaks", value: `${formatCurrency(demoDashboardStats.potentialSavings)}/mo` },
                { label: "Annual upside", value: `${formatCurrency(demoDashboardStats.projectedSavings)}/yr` },
                { label: "Risk level", value: "Elevated" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-center">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="h-4 w-4 text-amber-300" />
                Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {breakdown.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.impact}</p>
                    </div>
                    <span className="text-sm font-semibold">{item.value}/100</span>
                  </div>
                  <Progress value={item.value} className="h-2" indicatorClassName={item.value < 45 ? "bg-red-400" : "bg-amber-400"} />
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-emerald-300" />
                Improvement Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoRecommendations.slice(0, 3).map((recommendation) => (
                <div key={recommendation.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] p-4">
                  <div>
                    <p className="text-sm font-medium">{recommendation.title}</p>
                    <p className="text-xs text-muted-foreground">{recommendation.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-300">
                      {formatCurrency(recommendation.estimatedMonthlySavings)}/mo
                    </p>
                    <p className="text-xs text-muted-foreground">{recommendation.priority} priority</p>
                  </div>
                </div>
              ))}
              <Button variant="gradient" className="w-full">
                Improve Score
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-sky-300" />
              Model Reasoning
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {demoLeakScore.reasoning.map((reason) => (
              <div key={reason} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-muted-foreground">
                <BadgeDollarSign className="mb-3 h-4 w-4 text-emerald-300" />
                {reason}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
