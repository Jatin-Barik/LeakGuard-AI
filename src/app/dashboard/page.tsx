"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CreditCard,
  DollarSign,
  PiggyBank,
  TrendingUp,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LeakScoreGauge } from "@/components/dashboard/leak-score-gauge";
import { StatCardCurrency } from "@/components/dashboard/stat-card";
import { RecommendationCard, PriceHikeAlert, SubscriptionRow } from "@/components/dashboard/recommendation-card";
import { SpendingAreaChart, CategoryPieChart } from "@/components/charts/spending-charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  demoDashboardStats,
  demoLeakScore,
  demoMonthlySpending,
  demoCategoryBreakdown,
  demoRecommendations,
  demoPriceHikes,
  demoSubscriptions,
  demoAchievements,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const stats = demoDashboardStats;

  return (
    <DashboardShell
      title="Dashboard"
      subtitle="Your subscription health at a glance"
    >
      <div className="space-y-8">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardCurrency
            title="Total Monthly Spend"
            amount={stats.totalMonthlySpend}
            icon={DollarSign}
            trend={{ value: 5.8, label: "vs last month" }}
            delay={0}
          />
          <StatCardCurrency
            title="Potential Savings"
            amount={stats.potentialSavings}
            icon={PiggyBank}
            variant="success"
            subtitle={`${formatCurrency(stats.projectedSavings)}/yr projected`}
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

        {/* Leak Score + Price Hikes */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
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
                      <Badge variant={item.score < 50 ? "destructive" : "warning"}>
                        {item.score}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="lg:col-span-2 space-y-4">
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
                {demoRecommendations.slice(0, 2).map((rec, i) => (
                  <RecommendationCard key={rec.id} recommendation={rec} index={i} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <SpendingAreaChart data={demoMonthlySpending} />
          <CategoryPieChart data={demoCategoryBreakdown} />
        </div>

        {/* Active Subscriptions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Active Subscriptions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {stats.activeSubscriptions} subscriptions • {formatCurrency(stats.totalMonthlySpend)}/mo
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
            {demoSubscriptions.slice(0, 6).map((sub, i) => (
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

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {demoAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`text-center p-4 rounded-xl border ${
                    ach.unlocked
                      ? "border-indigo-500/30 bg-indigo-500/5"
                      : "border-white/5 opacity-40"
                  }`}
                >
                  <div className="text-2xl mb-2">{ach.unlocked ? "🏆" : "🔒"}</div>
                  <p className="text-xs font-medium">{ach.title}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
