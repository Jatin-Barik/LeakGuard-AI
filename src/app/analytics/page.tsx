"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  SpendingAreaChart,
  CategoryPieChart,
  SavingsBarChart,
  PriceHistoryChart,
} from "@/components/charts/spending-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoMonthlySpending, demoCategoryBreakdown, demoDashboardStats } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

const savingsComparison = [
  { name: "Music", current: 33.97, optimized: 11.99 },
  { name: "Streaming", current: 51.97, optimized: 37.98 },
  { name: "Fitness", current: 24.99, optimized: 0 },
  { name: "Cloud", current: 12.98, optimized: 2.99 },
  { name: "Software", current: 74.99, optimized: 59.99 },
];

const netflixPriceHistory = [
  { date: "Jan", amount: 15.49 },
  { date: "Feb", amount: 15.49 },
  { date: "Mar", amount: 22.99 },
  { date: "Apr", amount: 22.99 },
  { date: "May", amount: 22.99 },
  { date: "Jun", amount: 22.99 },
  { date: "Jul", amount: 22.99 },
];

export default function AnalyticsPage() {
  const stats = demoDashboardStats;

  return (
    <DashboardShell
      title="Analytics"
      subtitle="Deep insights into your subscription spending patterns"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Monthly Spend", value: formatCurrency(stats.totalMonthlySpend) },
            { label: "Annual Waste", value: formatCurrency(stats.annualWaste) },
            { label: "Projected Savings", value: formatCurrency(stats.projectedSavings) },
            { label: "Active Subs", value: stats.activeSubscriptions.toString() },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xl font-bold mt-1">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <SpendingAreaChart data={demoMonthlySpending} />
          <CategoryPieChart data={demoCategoryBreakdown} />
        </div>

        <SavingsBarChart data={savingsComparison} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Netflix Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <PriceHistoryChart data={netflixPriceHistory} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
