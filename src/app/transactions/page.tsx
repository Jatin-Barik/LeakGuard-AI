"use client";

import { ReceiptText, Repeat, SearchCheck, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { demoTransactions } from "@/lib/demo-data";

export default function TransactionsPage() {
  const recurring = demoTransactions.filter((transaction) => transaction.isRecurring).length;
  const averageConfidence =
    demoTransactions.reduce((sum, transaction) => sum + transaction.confidence, 0) / demoTransactions.length;

  return (
    <DashboardShell
      title="Transactions"
      subtitle="Normalized statement data with merchant resolution and AI confidence"
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Extracted Rows" value={demoTransactions.length} icon={ReceiptText} />
          <StatCard title="Recurring Signals" value={recurring} icon={Repeat} variant="success" />
          <StatCard
            title="Average Confidence"
            value={`${Math.round(averageConfidence * 100)}%`}
            icon={ShieldCheck}
            variant="warning"
            subtitle="Across all parsed transactions"
          />
        </div>
        <TransactionsTable transactions={demoTransactions} />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Merchant aliases like NETFLIX.COM and Netflix Inc are resolved into one canonical merchant.",
            "Noisy bank references are stripped before categorization to improve model precision.",
            "Low-confidence rows stay reviewable instead of being hidden from the customer.",
          ].map((text) => (
            <div key={text} className="glass rounded-lg p-4 text-sm text-muted-foreground">
              <SearchCheck className="mb-3 h-4 w-4 text-sky-300" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
