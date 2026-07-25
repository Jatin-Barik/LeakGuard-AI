"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CreditCard,
  DollarSign,
  PiggyBank,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LeakScoreGauge } from "@/components/dashboard/leak-score-gauge";
import { StatCardCurrency } from "@/components/dashboard/stat-card";
import { RecommendationCard, PriceHikeAlert, SubscriptionRow } from "@/components/dashboard/recommendation-card";
import { SavingsSimulator } from "@/components/dashboard/savings-simulator";
import { SpendingAreaChart, CategoryPieChart } from "@/components/charts/spending-charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  demoAccount,
  demoAchievements,
  demoCategoryBreakdown,
  demoDashboardStats,
  demoInsights,
  demoLeakScore,
  demoMonthlySpending,
  demoPriceHikes,
  demoPriceTimeline,
  demoRecommendations,
  demoSavingsGoals,
  demoSubscriptions,
  monthlyFinancialStory,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const stats = demoDashboardStats;

  return (
    <DashboardShell
      title="Dashboard"
      subtitle="Demo mode is preloaded with 12 months, 1,200+ transactions, and AI-ready insights"
    >
      <div className="space-y-8">
        <Card className="overflow-hidden border-sky-400/20 bg-sky-400/[0.04]">
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Badge variant="outline" className="mb-3 border-sky-400/30 text-sky-200">
                Live demo account: {demoAccount.email}
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                LeakGuard AI found {formatCurrency(stats.potentialSavings)}/mo in preventable subscription leaks.
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                {monthlyFinancialStory.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  variant="gradient"
                  onClick={() => toast.success("Budget optimized: 8 actions queued, score projected to 82.")}
                >
                  <Sparkles className="h-4 w-4" />
                  Optimize My Budget
                </Button>
                <Link href="/advisor">
                  <Button variant="outline">
                    Ask AI Advisor
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {demoInsights.slice(0, 3).map((insight, index) => (
                <motion.div
                  key={insight}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 * index }}
                  className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm"
                >
                  <Sparkles className="mb-2 h-4 w-4 text-sky-300" />
                  {insight}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCardCurrency
            title="Total Monthly Spend"
            amount={stats.totalMonthlySpend}
            icon={DollarSign}
            trend={{ value: 18, label: "vs last month" }}
            delay={0}
          />
          <StatCardCurrency
            title="Potential Savings"
            amount={stats.potentialSavings}
            icon={PiggyBank}
            variant="success"
            subtitle={`${formatCurrency(stats.projectedSavings)}/yr starter plan`}
            delay={0.1}
          />
          <StatCardCurrency
            title="Annual Waste"
            amount={stats.annualWaste}
            icon={AlertTriangle}
            variant="danger"
            delay={0.2}
          />
          <StatCardCurrency
            title="Highest Expense"
            amount={stats.highestExpense.amount}
            icon={CreditCard}
            subtitle={stats.highestExpense.name}
            delay={0.3}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">Leak Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <LeakScoreGauge score={demoLeakScore.overall} size="md" />
                <div className="mt-6 w-full space-y-2">
                  {[
                    { label: "Unused Subs", score: demoLeakScore.unusedSubscriptions },
                    { label: "Duplicates", score: demoLeakScore.duplicateSubscriptions },
                    { label: "Price Hikes", score: demoLeakScore.priceHikes },
                    { label: "Spending Trend", score: demoLeakScore.spendingTrend },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <Badge variant={item.score < 50 ? "destructive" : "warning"}>{item.score}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Price Hike Alerts</CardTitle>
                <Badge variant="destructive">{demoPriceHikes.length} detected</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoPriceHikes.map((hike) => (
                  <PriceHikeAlert
                    key={hike.id}
                    merchant={hike.merchant}
                    oldAmount={hike.oldAmount}
                    newAmount={hike.newAmount}
                    changePercent={hike.changePercent}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Top Recommendations</CardTitle>
                <Link href="/recommendations">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoRecommendations.slice(0, 3).map((rec, i) => (
                  <RecommendationCard key={rec.id} recommendation={rec} index={i} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SpendingAreaChart data={demoMonthlySpending} />
          <CategoryPieChart data={demoCategoryBreakdown} />
        </div>

        <SavingsSimulator maxSavings={stats.potentialSavings} baseScore={stats.leakScore} />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Price Increase Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoPriceTimeline.map((item, index) => (
                <motion.div
                  key={item.merchant}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{item.merchant}</p>
                      <p className="text-xs text-muted-foreground">Annual impact: {formatCurrency(item.annualImpact)}</p>
                    </div>
                    <Badge variant="destructive">+{item.increasePercent}%</Badge>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {item.timeline.map((point) => (
                      <div key={`${item.merchant}-${point.month}`} className="min-w-14 text-center">
                        <p className="text-[10px] text-muted-foreground">{point.month}</p>
                        <p className="rounded-md bg-black/20 px-2 py-1 text-xs font-medium">{formatCurrency(point.amount)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-emerald-300" />
                Goals & Streaks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoSavingsGoals.map((goal) => {
                const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div key={goal.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{goal.title}</p>
                        <p className="text-xs text-muted-foreground">Deadline {goal.deadline}</p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-300">{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-4 text-sm">
                Potential reward: unlock the Financial Optimizer badge after applying three high-confidence actions.
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Active Subscriptions</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {stats.activeSubscriptions} active subscriptions - {formatCurrency(stats.totalMonthlySpend)}/mo
              </p>
            </div>
            <Link href="/subscriptions">
              <Button variant="ghost" size="sm">
                Manage
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-white/5">
            {demoSubscriptions.slice(0, 10).map((sub, i) => (
              <SubscriptionRow
                key={sub.id}
                name={sub.name}
                merchant={sub.merchant}
                amount={sub.amount}
                previousAmount={sub.previousAmount}
                frequency={sub.frequency}
                usageScore={sub.usageScore}
                isDuplicate={sub.isDuplicate}
                index={i}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {demoAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4 text-center"
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-200">{ach.title}</p>
                  <p className="text-xs text-muted-foreground">{ach.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
