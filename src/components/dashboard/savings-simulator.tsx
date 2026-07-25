"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, PiggyBank, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

interface SavingsSimulatorProps {
  maxSavings: number;
  baseScore: number;
}

export function SavingsSimulator({ maxSavings, baseScore }: SavingsSimulatorProps) {
  const [monthlySavings, setMonthlySavings] = useState(50);

  const projection = useMemo(() => {
    const yearlySavings = monthlySavings * 12;
    const score = Math.min(92, Math.round(baseScore + monthlySavings * 0.32));
    const wellness =
      score >= 80 ? "Excellent" : score >= 68 ? "Strong" : score >= 55 ? "Improving" : "Needs attention";

    return { yearlySavings, score, wellness };
  }, [baseScore, monthlySavings]);

  return (
    <Card className="overflow-hidden border-emerald-500/20 bg-emerald-500/[0.04]">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            Savings Simulator
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag the slider to preview score and health impact in real time.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-right">
          <p className="text-xs text-muted-foreground">Financial Health</p>
          <p className="text-sm font-semibold text-emerald-200">{projection.wellness}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monthly optimization</span>
              <span className="font-semibold text-emerald-300">{formatCurrency(monthlySavings)}/mo</span>
            </div>
            <input
              aria-label="Monthly savings target"
              type="range"
              min={0}
              max={Math.ceil(maxSavings)}
              value={monthlySavings}
              onChange={(event) => setMonthlySavings(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-emerald-400"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(0)}</span>
              <span>{formatCurrency(maxSavings)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Leak Score after changes</span>
              <span className="font-semibold">{projection.score}/100</span>
            </div>
            <Progress value={projection.score} className="h-2" indicatorClassName="bg-emerald-400" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Monthly Savings", value: formatCurrency(monthlySavings), icon: PiggyBank },
            { label: "Yearly Savings", value: formatCurrency(projection.yearlySavings), icon: TrendingUp },
            { label: "New Leak Score", value: String(projection.score), icon: Activity },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="rounded-lg border border-white/10 bg-black/20 p-4"
              >
                <Icon className="mb-4 h-4 w-4 text-emerald-300" />
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">{item.value}</p>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
