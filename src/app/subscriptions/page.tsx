"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Search } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SubscriptionRow } from "@/components/dashboard/recommendation-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { demoSubscriptions, demoDuplicateGroups } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");

  const filtered = demoSubscriptions.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.merchant.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell
      title="Subscriptions"
      subtitle={`${demoSubscriptions.length} active subscriptions detected`}
    >
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by merchant, category..."
            className="pl-9 bg-secondary/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Duplicate Groups */}
        <div className="grid md:grid-cols-3 gap-4">
          {demoDuplicateGroups.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-amber-500/20 bg-amber-500/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Copy className="h-4 w-4 text-amber-400" />
                    <CardTitle className="text-sm">{group.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-amber-400 mb-2">
                    {formatCurrency(group.monthlyWaste)}/mo waste
                  </p>
                  <p className="text-xs text-muted-foreground">{group.recommendation}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {group.subscriptions.map((s) => (
                      <Badge key={s.id} variant="outline" className="text-[10px]">
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-white/5">
            {filtered.map((sub, i) => (
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
      </div>
    </DashboardShell>
  );
}
