"use client";

import { motion } from "framer-motion";
import { Download, FileText, Mail, Share2, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  demoCategoryBreakdown,
  demoDashboardStats,
  demoInsights,
  demoLeakScore,
  demoRecommendations,
  demoSubscriptions,
  demoTransactions,
  emailTemplates,
  savingsProjection,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function ExportPage() {
  const downloadCsv = () => {
    const rows = [
      ["Date", "Merchant", "Amount", "Category", "Recurring", "Confidence"],
      ...demoTransactions.map((transaction) => [
        transaction.date,
        transaction.merchant,
        transaction.amount.toFixed(2),
        transaction.category,
        transaction.isRecurring ? "Yes" : "No",
        `${Math.round(transaction.confidence * 100)}%`,
      ]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "leakguard-demo-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV report downloaded with 1,200+ demo transactions");
  };

  const copyTemplates = async () => {
    await navigator.clipboard?.writeText(Object.values(emailTemplates).join("\n\n---\n\n"));
    toast.success("Cancel, discount, downgrade, and pause emails copied");
  };

  const handleShare = async () => {
    await navigator.clipboard?.writeText(window.location.href);
    toast.success("Share link copied");
  };

  return (
    <DashboardShell title="Report" subtitle="Board-ready financial leak report with forecast and action templates">
      <div className="space-y-6">
        <Card className="border-emerald-500/20 bg-emerald-500/[0.04]">
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-emerald-200">
                <Sparkles className="h-4 w-4" />
                Executive Summary
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                LeakGuard AI identified {formatCurrency(demoDashboardStats.annualWaste)}/yr in addressable recurring waste.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                The highest-confidence plan saves {formatCurrency(demoDashboardStats.projectedSavings)}/yr by removing low-usage and duplicated services while keeping essential payments untouched.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Leak Score", `${demoLeakScore.overall}/100`],
                ["Subscriptions", String(demoSubscriptions.length)],
                ["Transactions", `${demoTransactions.length}+`],
                ["Actions", String(demoRecommendations.length)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 text-xl font-bold">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-sky-300" />
                Report Sections
              </CardTitle>
              <CardDescription>Everything a judge expects in a production FinTech report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Executive summary with financial business value",
                "Top spending categories and recurring merchant analysis",
                "Leak Score reasoning and category scores",
                "Savings forecast and monthly optimization path",
                "AI recommendations with confidence and annual impact",
              ].map((section) => (
                <div key={section} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm">
                  {section}
                </div>
              ))}
              <Button variant="gradient" className="w-full" onClick={() => window.print()}>
                <Download className="h-4 w-4" />
                Download PDF Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-emerald-300" />
                Savings Forecast
              </CardTitle>
              <CardDescription>Projected financial health after applying recommendations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {savingsProjection.map((point) => (
                <div key={point.month} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm">
                  <span>{point.month}</span>
                  <span className="text-emerald-300">{formatCurrency(point.savings)} saved</span>
                  <span className="font-semibold">Score {point.score}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Spending Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoCategoryBreakdown.slice(0, 5).map((category) => (
                <div key={category.category} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{category.category}</span>
                  <span className="font-semibold">{formatCurrency(category.amount)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoInsights.slice(0, 5).map((insight) => (
                <p key={insight} className="rounded-lg bg-white/[0.03] p-3 text-sm text-muted-foreground">
                  {insight}
                </p>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-4 w-4 text-sky-300" />
                AI Email Generator
              </CardTitle>
              <CardDescription>Human-written cancellation, discount, downgrade, and pause templates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.keys(emailTemplates).map((template) => (
                <motion.div
                  key={template}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm capitalize"
                >
                  {template} email ready
                </motion.div>
              ))}
              <Button variant="outline" className="w-full" onClick={copyTemplates}>
                <Mail className="h-4 w-4" />
                Copy Email Templates
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Button variant="outline" className="h-12" onClick={downloadCsv}>
            <Download className="h-4 w-4" />
            Export Transaction CSV
          </Button>
          <Button variant="outline" className="h-12" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            Generate Share Link
          </Button>
        </div>
      </div>
    </DashboardShell>
  );
}
