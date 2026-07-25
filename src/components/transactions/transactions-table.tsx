"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, CheckCircle2, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";

const categoryTone: Record<string, string> = {
  streaming: "bg-red-500/15 text-red-300 border-red-500/20",
  music: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  software: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  cloud: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
  fitness: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  news: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/20",
};

export function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortByAmount, setSortByAmount] = useState(false);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(transactions.map((transaction) => transaction.category)))],
    [transactions]
  );

  const filtered = useMemo(() => {
    const result = transactions.filter((transaction) => {
      const matchesSearch = [transaction.merchant, transaction.description, transaction.category]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === "all" || transaction.category === category;
      return matchesSearch && matchesCategory;
    });
    return sortByAmount ? [...result].sort((a, b) => b.amount - a.amount) : result;
  }, [category, search, sortByAmount, transactions]);

  return (
    <Card>
      <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-base">Transaction Intelligence</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Search, filter, and inspect AI confidence for every detected charge.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search merchants..."
              className="w-full bg-secondary/30 pl-9 sm:w-64"
            />
          </div>
          <Button variant="outline" onClick={() => setSortByAmount((value) => !value)}>
            <ArrowDownUp className="h-4 w-4" />
            Amount
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          {categories.map((item) => (
            <button
              key={item}
              className={cn(
                "rounded-full border px-3 py-1 text-xs capitalize transition-colors",
                category === item
                  ? "border-sky-400/40 bg-sky-500/15 text-sky-200"
                  : "border-white/10 text-muted-foreground hover:bg-white/5"
              )}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.7fr] gap-4 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground md:grid">
            <span>Merchant</span>
            <span>Date</span>
            <span>Category</span>
            <span>Confidence</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="divide-y divide-white/5">
            {filtered.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.025 }}
                className="grid gap-3 px-4 py-4 md:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.7fr] md:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/8 text-sm font-semibold">
                    {transaction.merchant.slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{transaction.merchant}</p>
                    <p className="truncate text-xs text-muted-foreground">{transaction.description ?? "Statement charge"}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{formatDate(transaction.date)}</span>
                <Badge className={cn("w-fit capitalize", categoryTone[transaction.category] ?? "")} variant="outline">
                  {transaction.category}
                </Badge>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {Math.round(transaction.confidence * 100)}%
                </div>
                <div className="text-right text-sm font-semibold">{formatCurrency(transaction.amount)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
