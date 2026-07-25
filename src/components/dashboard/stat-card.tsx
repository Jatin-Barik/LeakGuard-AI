"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "success" | "warning" | "danger";
  delay?: number;
}

const variantStyles = {
  default: "from-indigo-500/20 to-purple-500/10",
  success: "from-emerald-500/20 to-teal-500/10",
  warning: "from-amber-500/20 to-orange-500/10",
  danger: "from-red-500/20 to-rose-500/10",
};

const iconStyles = {
  default: "text-indigo-400 bg-indigo-500/20",
  success: "text-emerald-400 bg-emerald-500/20",
  warning: "text-amber-400 bg-amber-500/20",
  danger: "text-red-400 bg-red-500/20",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={cn("overflow-hidden relative", `bg-gradient-to-br ${variantStyles[variant]}`)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
              {trend && (
                <div className="flex items-center gap-1 text-xs">
                  {trend.value >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-red-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-emerald-400" />
                  )}
                  <span className={trend.value >= 0 ? "text-red-400" : "text-emerald-400"}>
                    {Math.abs(trend.value)}%
                  </span>
                  <span className="text-muted-foreground">{trend.label}</span>
                </div>
              )}
            </div>
            <div className={cn("rounded-xl p-3", iconStyles[variant])}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatCardCurrency({
  title,
  amount,
  ...props
}: Omit<StatCardProps, "value"> & { amount: number }) {
  return <StatCard title={title} value={formatCurrency(amount)} {...props} />;
}
