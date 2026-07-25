"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  Copy,
  TrendingUp,
  X,
  Pause,
  MessageSquare,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { Recommendation, RecommendationAction } from "@/types";

const actionConfig: Record<
  RecommendationAction,
  { icon: typeof X; label: string; color: string }
> = {
  cancel: { icon: X, label: "Cancel", color: "destructive" as const },
  downgrade: { icon: ArrowDown, label: "Downgrade", color: "warning" as const },
  pause: { icon: Pause, label: "Pause", color: "warning" as const },
  negotiate: { icon: MessageSquare, label: "Negotiate", color: "default" as const },
  bundle: { icon: Package, label: "Bundle", color: "success" as const },
  keep: { icon: TrendingUp, label: "Keep", color: "success" as const },
};

const priorityColors = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
} as const;

interface RecommendationCardProps {
  recommendation: Recommendation;
  index?: number;
}

export function RecommendationCard({ recommendation, index = 0 }: RecommendationCardProps) {
  const config = actionConfig[recommendation.action];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group hover:border-indigo-500/30 transition-colors">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-indigo-500/10 p-3 shrink-0">
              <Icon className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-sm">{recommendation.title}</h3>
                <Badge variant={priorityColors[recommendation.priority]}>
                  {recommendation.priority}
                </Badge>
                <Badge variant="outline">{config.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {recommendation.description}
              </p>
              <div className="rounded-lg bg-secondary/50 p-3 mb-3">
                <p className="text-xs text-muted-foreground mb-1">Why?</p>
                <p className="text-sm">{recommendation.reason}</p>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-emerald-400 font-semibold">
                    Save {formatCurrency(recommendation.estimatedMonthlySavings)}/mo
                  </span>
                  <span className="text-muted-foreground">
                    {formatCurrency(recommendation.estimatedAnnualSavings)}/yr
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(recommendation.confidence * 100)}% confidence
                  </span>
                </div>
                <Button size="sm" variant="gradient">
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface SubscriptionRowProps {
  name: string;
  merchant: string;
  amount: number;
  previousAmount?: number;
  frequency: string;
  usageScore?: number;
  isDuplicate?: boolean;
  index?: number;
}

export function SubscriptionRow({
  name,
  merchant,
  amount,
  previousAmount,
  frequency,
  usageScore,
  isDuplicate,
  index = 0,
}: SubscriptionRowProps) {
  const priceChange = previousAmount
    ? ((amount - previousAmount) / previousAmount) * 100
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-indigo-300">
          {merchant[0]}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{name}</p>
            {isDuplicate && (
              <Badge variant="warning" className="text-[10px]">
                <Copy className="h-3 w-3 mr-1" />
                Duplicate
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground capitalize">{frequency}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {usageScore !== undefined && (
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">Usage</p>
            <p
              className={`text-sm font-medium ${
                usageScore < 30 ? "text-red-400" : usageScore < 60 ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              {usageScore}%
            </p>
          </div>
        )}
        <div className="text-right">
          <p className="font-semibold">{formatCurrency(amount)}</p>
          {priceChange !== null && priceChange > 0 && (
            <p className="text-xs text-red-400 flex items-center gap-1 justify-end">
              <TrendingUp className="h-3 w-3" />
              {formatPercent(priceChange)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function PriceHikeAlert({
  merchant,
  oldAmount,
  newAmount,
  changePercent,
}: {
  merchant: string;
  oldAmount: number;
  newAmount: number;
  changePercent: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
    >
      <div className="rounded-full bg-red-500/20 p-2">
        <AlertTriangle className="h-5 w-5 text-red-400" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{merchant} Price Increase Detected</p>
        <div className="flex items-center gap-2 mt-1 text-sm">
          <span className="text-muted-foreground line-through">
            {formatCurrency(oldAmount)}
          </span>
          <span className="text-red-400">→</span>
          <span className="font-semibold text-red-400">{formatCurrency(newAmount)}</span>
          <Badge variant="destructive">{formatPercent(changePercent)}</Badge>
        </div>
      </div>
    </motion.div>
  );
}
